from rest_framework import serializers  # type: ignore[import]
from .models import Profiles, RepairRequests, Services, MasterAvailability, Notifications


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    phone = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Profiles
        fields = ['first_name', 'last_name',
                  'email', 'password', 'role', 'phone']

    def validate_role(self, value):
        if value not in ['customer', 'operator', 'master']:
            raise serializers.ValidationError("Invalid role")
        return value

    def create(self, validated_data):
        phone = validated_data.pop('phone', None)
        if phone == '' or phone is None:
            validated_data['phone'] = None
        else:
            try:
                validated_data['phone'] = int(phone)
            except (ValueError, OverflowError):
                validated_data['phone'] = None

        return super().create(validated_data)


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profiles
        fields = ['profile_id', 'first_name',
                  'last_name', 'email', 'role', 'phone']


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Services
        fields = ['service_id', 'name', 'description', 'base_price']


class RepairRequestSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    service_name = serializers.CharField(source='service.name', read_only=True)
    assigned_master_name = serializers.SerializerMethodField()

    def get_customer_name(self, obj):
        return f"{obj.customer.first_name} {obj.customer.last_name}"

    def get_assigned_master_name(self, obj):
        if obj.assigned_master:
            return f"{obj.assigned_master.first_name} {obj.assigned_master.last_name}"
        return None

    class Meta:
        model = RepairRequests
        fields = [
            'request_id', 'customer_id', 'customer_name',
            'service_id', 'service_name', 'description',
            'address', 'scheduled_at', 'status',
            'assigned_master_id', 'assigned_master_name',
            'created_at'
        ]


class MasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profiles
        fields = ['profile_id', 'first_name', 'last_name', 'email', 'phone']


class AvailabilitySerializer(serializers.ModelSerializer):
    master_name = serializers.CharField(
        source='master.full_name', read_only=True)

    class Meta:
        model = MasterAvailability
        fields = ['availability_id', 'master_id', 'master_name',
                  'is_available', 'notes', 'updated_at']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notifications
        fields = ['notification_id', 'user_id',
                  'message', 'is_read', 'created_at']
