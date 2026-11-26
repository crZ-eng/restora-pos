
from django.db import transaction
from rest_framework import serializers

from .models import Producto, Pedido, DetallePedido


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


class DetallePedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetallePedido
        fields = [
            "producto",
            "cantidad",
            "precio",
            "subtotal",
            "termino",
            "observaciones",
        ]
        read_only_fields = ["precio", "subtotal"]

    def validate_cantidad(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "La cantidad debe ser mayor que cero."
            )
        return value


class PedidoSerializer(serializers.ModelSerializer):
    items = DetallePedidoSerializer(many=True)

    class Meta:
        model = Pedido
        fields = [
            "id",
            "mesa",
            "estado",
            "total",
            "creado",
            "actualizado",
            "items",
        ]
        read_only_fields = [
            "id",
            "estado",
            "total",
            "creado",
            "actualizado",
        ]

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError(
                "La comanda debe contener al menos un producto."
            )
        return items

    def create(self, validated_data):
        items_data = validated_data.pop("items")

        with transaction.atomic():
            # Obtener todos los productos involucrados y bloquearlos.
            producto_ids = sorted({
                item["producto"].pk for item in items_data
            })

            productos = Producto.objects.select_for_update().filter(
                pk__in=producto_ids
            ).order_by("pk")

            productos_por_id = {
                producto.pk: producto for producto in productos
            }

            # Sumar cantidades, incluso si un producto aparece
            # varias veces en la misma comanda.
            cantidades = {}

            for item in items_data:
                producto_id = item["producto"].pk
                cantidades[producto_id] = (
                    cantidades.get(producto_id, 0)
                    + item["cantidad"]
                )

            # Validar todo el inventario antes de descontar.
            for producto_id, cantidad in cantidades.items():
                producto = productos_por_id.get(producto_id)

                if producto is None:
                    raise serializers.ValidationError(
                        "Uno de los productos ya no existe."
                    )

                if not producto.disponible:
                    raise serializers.ValidationError(
                        f"{producto.nombre} no está disponible."
                    )

                if producto.stock < cantidad:
                    raise serializers.ValidationError(
                        f"Stock insuficiente para {producto.nombre}. "
                        f"Disponible: {producto.stock}. "
                        f"Solicitado: {cantidad}."
                    )

            # Crear el pedido solo después de validar todos los productos.
            pedido = Pedido.objects.create(**validated_data)

            total = 0

            for item in items_data:
                producto = productos_por_id[item["producto"].pk]
                cantidad = item["cantidad"]

                precio = producto.precio
                subtotal = precio * cantidad

                DetallePedido.objects.create(
                    pedido=pedido,
                    producto=producto,
                    cantidad=cantidad,
                    precio=precio,
                    subtotal=subtotal,
                    termino=item.get("termino"),
                    observaciones=item.get("observaciones", ""),
                )

                total += subtotal

            # Descontar una sola vez la cantidad total de cada producto.
            for producto_id, cantidad in cantidades.items():
                producto = productos_por_id[producto_id]
                producto.stock -= cantidad

                if producto.stock == 0:
                    producto.disponible = False

                producto.save(
                    update_fields=[
                        "stock",
                        "disponible",
                        "actualizado",
                    ]
                )

            pedido.total = total
            pedido.save()

            return pedido
