from rest_framework import serializers
from .models import Mesero


class MeseroSerializer(serializers.ModelSerializer):

    class Meta:
        model = Mesero

        fields = [
            "id",
            "nombre",
            "codigo",
            "activo",
            "creado",
        ]

        read_only_fields = [
            "id",
            "codigo",
            "activo",
            "creado",
        ]