from rest_framework import serializers
from .models import Profiles


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Profiles
        fields = ['first_name', 'last_name', 'email', 'password', 'role', 'phone']

    def validate_role(self, value):
        if value not in ['customer', 'operator', 'master']:
            raise serializers.ValidationError("Invalid role")
        return value


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profiles
        fields = ['profile_id', 'full_name', 'email', 'role', 'phone']