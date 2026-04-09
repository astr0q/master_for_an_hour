from rest_framework import serializers
from .models import Profiles, RepairRequests, Services


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Profiles
        fields = ['first_name', 'last_name',
                  'email', 'password', 'role', 'phone']

    def validate_role(self, value):
        if value not in ['customer', 'operator', 'master']:
            raise serializers.ValidationError("Invalid role")
        return value


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profiles
        fields = ['profile_id', 'full_name', 'email', 'role', 'phone']


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Services
        fields = ['service_id', 'name', 'description', 'base_price']


class RepairRequestSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(
        source='customer.full_name', read_only=True)
    service_name = serializers.CharField(source='service.name', read_only=True)
    assigned_master_name = serializers.CharField(
        source='assigned_master.full_name', read_only=True, default=None
    )

    class Meta:
        model = RepairRequests
        fields = [
            'request_id', 'customer_id', 'customer_name',
            'service_id', 'service_name', 'description',
            'address', 'scheduled_at', 'status',
            'assigned_master_id', 'assigned_master_name',
            'created_at'
        ]
