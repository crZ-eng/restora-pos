from rest_framework import serializers

from .models import Producto


class ProductoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Producto

        fields = [
            "id",
            "administrador",
            "nombre",
            "descripcion",
            "categoria",
            "precio",
            "stock",
            "tiempo_preparacion",
            "imagen",
            "requiere_termino",
            "permite_observaciones",
            "disponible",
            "creado",
            "actualizado",
        ]

        read_only_fields = [
            "id",
            "administrador",
            "creado",
            "actualizado",
        ]

