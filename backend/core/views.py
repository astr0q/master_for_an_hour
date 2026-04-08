from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Profiles
from .serializers import RegisterSerializer, ProfileSerializer


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