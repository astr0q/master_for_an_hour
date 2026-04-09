from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Profiles, RepairRequests, Services, RequestUpdates
from .serializers import (
    RegisterSerializer, ProfileSerializer,
    RepairRequestSerializer, ServiceSerializer
)

@api_view(['POST'])
def register(request):
    data = request.data

    if Profiles.objects.filter(email=data.get('email')).exists():
        return Response({'error': 'Email already registered'}, status=400)

    serializer = RegisterSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User registered successfully'}, status=201)

    return Response(serializer.errors, status=400)


@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = Profiles.objects.filter(email=email, password=password).first()

    if not user:
        return Response({'error': 'Invalid email or password'}, status=401)

    serializer = ProfileSerializer(user)
    return Response(serializer.data, status=200)

@api_view(['GET'])
def get_services(request):
    services = Services.objects.all()
    serializer = ServiceSerializer(services, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_request(request):
    data = request.data

    try:
        customer = Profiles.objects.get(profile_id=data.get('customer_id'))
        service = Services.objects.get(service_id=data.get('service_id'))
    except (Profiles.DoesNotExist, Services.DoesNotExist):
        return Response({'error': 'Invalid customer or service'}, status=400)

    repair_request = RepairRequests.objects.create(
        customer=customer,
        service=service,
        description=data.get('description', ''),
        address=data.get('address'),
        scheduled_at=data.get('scheduled_at'),
        status='new'
    )

    serializer = RepairRequestSerializer(repair_request)
    return Response(serializer.data, status=201)


@api_view(['GET'])
def get_requests(request):
    role = request.query_params.get('role')
    user_id = request.query_params.get('user_id')

    if role == 'customer':
        requests = RepairRequests.objects.filter(customer_id=user_id).order_by('-created_at')
    else:
        # operator sees all
        requests = RepairRequests.objects.all().order_by('-created_at')

    serializer = RepairRequestSerializer(requests, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
def update_status(request, request_id):
    try:
        repair_request = RepairRequests.objects.get(request_id=request_id)
    except RepairRequests.DoesNotExist:
        return Response({'error': 'Request not found'}, status=404)

    old_status = repair_request.status
    new_status = request.data.get('status')
    note = request.data.get('note', '')
    updated_by_id = request.data.get('updated_by')

    allowed = ['new', 'assigned', 'in_progress', 'completed', 'cancelled']
    if new_status not in allowed:
        return Response({'error': 'Invalid status'}, status=400)

    repair_request.status = new_status
    repair_request.save()

    # log the change
    try:
        updated_by = Profiles.objects.get(profile_id=updated_by_id)
        RequestUpdates.objects.create(
            request=repair_request,
            updated_by=updated_by,
            old_status=old_status,
            new_status=new_status,
            note=note
        )
    except Profiles.DoesNotExist:
        pass

    serializer = RepairRequestSerializer(repair_request)
    return Response(serializer.data)