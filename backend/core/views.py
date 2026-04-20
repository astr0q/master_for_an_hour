from rest_framework.decorators import api_view  # type: ignore[import]
from rest_framework.response import Response  # type: ignore[import]
from .models import Profiles, RepairRequests, Services, RequestUpdates, MasterAvailability, Notifications
from .serializers import (
    RegisterSerializer, ProfileSerializer,
    RepairRequestSerializer, ServiceSerializer,
    MasterSerializer, AvailabilitySerializer,
    NotificationSerializer
)
from django.db.models import Count, Q
from datetime import datetime, timedelta
from django.utils import timezone


@api_view(['POST'])
def register(request):
    data = request.data

    required = ['first_name', 'last_name', 'email', 'password', 'role']
    for field in required:
        if not data.get(field, '').strip():
            return Response({'error': f'{field} is required'}, status=400)

    if data['role'] not in ['customer', 'operator', 'master']:
        return Response({'error': 'Invalid role'}, status=400)

    if len(data['password']) < 4:
        return Response({'error': 'Password must be at least 4 characters'}, status=400)

    if '@' not in data['email']:
        return Response({'error': 'Invalid email address'}, status=400)

    if Profiles.objects.filter(email=data['email']).exists():
        return Response({'error': 'Email already registered'}, status=400)

    serializer = RegisterSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User registered successfully'}, status=201)

    return Response(serializer.errors, status=400)


@api_view(['POST'])
def login(request):
    email = request.data.get('email', '').strip()
    password = request.data.get('password', '').strip()

    if not email or not password:
        return Response({'error': 'Email and password are required'}, status=400)

    try:
        user = Profiles.objects.get(email=email, password=password)
        serializer = ProfileSerializer(user)
        return Response(serializer.data, status=200)
    except Profiles.DoesNotExist:
        return Response({'error': 'Invalid email or password'}, status=401)


@api_view(['GET'])
def get_services(request):
    services = Services.objects.all()
    serializer = ServiceSerializer(services, many=True)
    return Response(serializer.data)

def create_notification(user_id, message):
    try:
        user = Profiles.objects.get(profile_id=user_id)
        Notifications.objects.create(
            user=user,
            message=message,
            created_at=timezone.now()
        )
    except Profiles.DoesNotExist:
        pass


@api_view(['POST'])
def create_request(request):
    data = request.data

    if not data.get('customer_id'):
        return Response({'error': 'Not logged in'}, status=400)

    if not data.get('service_id'):
        return Response({'error': 'Please select a service'}, status=400)

    if not data.get('address', '').strip():
        return Response({'error': 'Address is required'}, status=400)

    if len(data.get('address', '')) > 255:
        return Response({'error': 'Address is too long'}, status=400)

    if len(data.get('description', '')) > 500:
        return Response({'error': 'Description is too long (max 500 characters)'}, status=400)

    try:
        customer = Profiles.objects.get(
            profile_id=data['customer_id'], role='customer')
    except Profiles.DoesNotExist:
        return Response({'error': 'Customer not found'}, status=404)

    try:
        service = Services.objects.get(service_id=data['service_id'])
    except Services.DoesNotExist:
        return Response({'error': 'Service not found'}, status=404)

    repair_request = RepairRequests.objects.create(
        customer=customer,
        service=service,
        description=data.get('description', ''),
        address=data['address'].strip(),
        scheduled_at=data.get('scheduled_at') or None,
        status='new'
    )

    serializer = RepairRequestSerializer(repair_request)
    return Response(serializer.data, status=201)


@api_view(['GET'])
def get_requests(request):
    role = request.query_params.get('role')
    user_id = request.query_params.get('user_id')

    if not role or not user_id:
        return Response({'error': 'role and user_id are required'}, status=400)

    if role == 'customer':
        requests = RepairRequests.objects.filter(
            customer_id=user_id
        ).order_by('-created_at')
    else:
        requests = RepairRequests.objects.all().order_by('-created_at')

    serializer = RepairRequestSerializer(requests, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
def update_status(request, request_id):
    try:
        repair_request = RepairRequests.objects.get(request_id=request_id)
    except RepairRequests.DoesNotExist:
        return Response({'error': 'Request not found'}, status=404)

    new_status = request.data.get('status', '').strip()
    updated_by_id = request.data.get('updated_by')

    if not new_status:
        return Response({'error': 'Status is required'}, status=400)

    allowed = ['new', 'assigned', 'in_progress', 'completed', 'cancelled']
    if new_status not in allowed:
        return Response({'error': f'Invalid status. Allowed: {allowed}'}, status=400)

    old_status = repair_request.status
    repair_request.status = new_status
    repair_request.save()

    # notify the customer when operator changes status
    create_notification(
        repair_request.customer_id,
        f'Your repair request ({repair_request.service.name}) status changed to {new_status}'
)

    try:
        updated_by = Profiles.objects.get(profile_id=updated_by_id)
        RequestUpdates.objects.create(
            request=repair_request,
            updated_by=updated_by,
            old_status=old_status,
            new_status=new_status,
            note=request.data.get('note', '')
        )
    except Profiles.DoesNotExist:
        pass

    return Response(RepairRequestSerializer(repair_request).data)


@api_view(['PATCH'])
def assign_master(request, request_id):
    try:
        repair_request = RepairRequests.objects.get(request_id=request_id)
    except RepairRequests.DoesNotExist:
        return Response({'error': 'Request not found'}, status=404)

    master_id = request.data.get('master_id')
    updated_by_id = request.data.get('updated_by')

    if not master_id:
        return Response({'error': 'Please select a master'}, status=400)

    if repair_request.status == 'completed':
        return Response({'error': 'Cannot reassign a completed request'}, status=400)

    if repair_request.status == 'cancelled':
        return Response({'error': 'Cannot assign a cancelled request'}, status=400)

    try:
        master = Profiles.objects.get(profile_id=master_id, role='master')
    except Profiles.DoesNotExist:
        return Response({'error': 'Master not found'}, status=404)

    old_status = repair_request.status
    repair_request.assigned_master = master
    repair_request.status = 'assigned'
    repair_request.save()

    # notify the master they have been assigned
    create_notification(
        master_id,
        f'You have been assigned a new job: {repair_request.service.name} at {repair_request.address}'
)

    try:
        updated_by = Profiles.objects.get(profile_id=updated_by_id)
        RequestUpdates.objects.create(
            request=repair_request,
            updated_by=updated_by,
            old_status=old_status,
            new_status='assigned',
            note=f'Assigned to {master.first_name} {master.last_name}'
        )
    except Profiles.DoesNotExist:
        pass

    return Response(RepairRequestSerializer(repair_request).data)


@api_view(['PATCH'])
def update_progress(request, request_id):
    try:
        repair_request = RepairRequests.objects.get(request_id=request_id)
    except RepairRequests.DoesNotExist:
        return Response({'error': 'Request not found'}, status=404)

    master_id = request.data.get('master_id')
    new_status = request.data.get('status', '').strip()
    note = request.data.get('note', '').strip()

    if not new_status:
        return Response({'error': 'Status is required'}, status=400)

    if repair_request.assigned_master_id != master_id:
        return Response({'error': 'You are not assigned to this job'}, status=403)

    if repair_request.status == 'completed':
        return Response({'error': 'Job is already completed'}, status=400)

    allowed = ['in_progress', 'completed']
    if new_status not in allowed:
        return Response({'error': 'Master can only set in_progress or completed'}, status=400)

    old_status = repair_request.status
    repair_request.status = new_status
    repair_request.save()

    # notify the customer their job status changed
    create_notification(
        repair_request.customer_id,
        f'Your repair request ({repair_request.service.name}) is now {new_status}'
)

    try:
        master = Profiles.objects.get(profile_id=master_id)
        RequestUpdates.objects.create(
            request=repair_request,
            updated_by=master,
            old_status=old_status,
            new_status=new_status,
            note=note
        )
    except Profiles.DoesNotExist:
        pass

    return Response(RepairRequestSerializer(repair_request).data)


@api_view(['GET'])
def get_masters(request):
    masters = Profiles.objects.filter(role='master')
    serializer = MasterSerializer(masters, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_master_jobs(request, master_id):
    if not Profiles.objects.filter(profile_id=master_id, role='master').exists():
        return Response({'error': 'Master not found'}, status=404)

    jobs = RepairRequests.objects.filter(
        assigned_master_id=master_id
    ).order_by('-created_at')

    serializer = RepairRequestSerializer(jobs, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_availability(request):
    availability = MasterAvailability.objects.select_related('master').all()
    serializer = AvailabilitySerializer(availability, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def update_availability(request):
    master_id = request.data.get('master_id')
    is_available = request.data.get('is_available')
    notes = request.data.get('notes', '').strip()

    if master_id is None:
        return Response({'error': 'master_id is required'}, status=400)

    if is_available is None:
        return Response({'error': 'is_available is required'}, status=400)

    if len(notes) > 255:
        return Response({'error': 'Notes too long (max 255 characters)'}, status=400)

    try:
        master = Profiles.objects.get(profile_id=master_id, role='master')
    except Profiles.DoesNotExist:
        return Response({'error': 'Master not found'}, status=404)

    availability, created = MasterAvailability.objects.update_or_create(
        master=master,
        defaults={
            'is_available': is_available,
            'notes': notes,
        }
    )

    return Response(AvailabilitySerializer(availability).data)


@api_view(['GET'])
def get_history(request):
    role = request.query_params.get('role')
    user_id = request.query_params.get('user_id')
    status_filter = request.query_params.get('status')
    service_filter = request.query_params.get('service_id')
    date_from = request.query_params.get('date_from')
    date_to = request.query_params.get('date_to')

    # base query — only finished requests
    if role == 'customer':
        queryset = RepairRequests.objects.filter(
            customer_id=user_id,
            status__in=['completed', 'cancelled']
        )
    else:
        queryset = RepairRequests.objects.filter(
            status__in=['completed', 'cancelled']
        )

    # optional filters
    if status_filter:
        queryset = queryset.filter(status=status_filter)

    if service_filter:
        queryset = queryset.filter(service_id=service_filter)

    if date_from:
        queryset = queryset.filter(created_at__date__gte=date_from)

    if date_to:
        queryset = queryset.filter(created_at__date__lte=date_to)

    queryset = queryset.order_by('-created_at')
    serializer = RepairRequestSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_stats(request):
    total_requests = RepairRequests.objects.count()
    active_requests = RepairRequests.objects.filter(
        status__in=['new', 'assigned', 'in_progress']
    ).count()
    completed_requests = RepairRequests.objects.filter(
        status='completed').count()
    cancelled_requests = RepairRequests.objects.filter(
        status='cancelled').count()
    total_masters = Profiles.objects.filter(role='master').count()
    available_masters = MasterAvailability.objects.filter(
        is_available=True).count()

    # requests per service
    by_service = (
        RepairRequests.objects
        .values('service__name')
        .annotate(total=Count('request_id'))
        .order_by('-total')
    )

    # requests per status
    by_status = (
        RepairRequests.objects
        .values('status')
        .annotate(total=Count('request_id'))
        .order_by('-total')
    )

    return Response({
        'total_requests': total_requests,
        'active_requests': active_requests,
        'completed_requests': completed_requests,
        'cancelled_requests': cancelled_requests,
        'total_masters': total_masters,
        'available_masters': available_masters,
        'by_service': list(by_service),
        'by_status': list(by_status),
    })


@api_view(['GET'])
def get_reports(request):
    date_from = request.query_params.get('date_from')
    date_to = request.query_params.get('date_to')
    service_filter = request.query_params.get('service_id')
    status_filter = request.query_params.get('status')

    queryset = RepairRequests.objects.all()

    if date_from:
        queryset = queryset.filter(created_at__date__gte=date_from)
    if date_to:
        queryset = queryset.filter(created_at__date__lte=date_to)
    if service_filter:
        queryset = queryset.filter(service_id=service_filter)
    if status_filter:
        queryset = queryset.filter(status=status_filter)

    queryset = queryset.order_by('-created_at')

    # summary counts for the filtered set
    summary = {
        'total': queryset.count(),
        'completed': queryset.filter(status='completed').count(),
        'cancelled': queryset.filter(status='cancelled').count(),
        'in_progress': queryset.filter(status='in_progress').count(),
        'new': queryset.filter(status='new').count(),
        'assigned': queryset.filter(status='assigned').count(),
    }

    serializer = RepairRequestSerializer(queryset, many=True)
    return Response({
        'summary': summary,
        'records': serializer.data,
    })

@api_view(['GET'])
def get_notifications(request):
    user_id = request.query_params.get('user_id')
    notifications = Notifications.objects.filter(
        user_id=user_id
    ).order_by('-created_at')[:30]  # last 30 only
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
def mark_read(request, notification_id):
    try:
        notification = Notifications.objects.get(notification_id=notification_id)
        notification.is_read = True
        notification.save()
        return Response({'message': 'Marked as read'})
    except Notifications.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)


@api_view(['PATCH'])
def mark_all_read(request):
    user_id = request.data.get('user_id')
    Notifications.objects.filter(user_id=user_id, is_read=False).update(is_read=True)
    return Response({'message': 'All marked as read'})