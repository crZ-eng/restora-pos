
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .models import Producto, Pedido
from .serializers import ProductoSerializer, PedidoSerializer


class ProductoViewSet(viewsets.ModelViewSet):
    serializer_class = ProductoSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [IsAuthenticated()]

        return [IsAdminUser()]

    def get_queryset(self):
        usuario = self.request.user

        if usuario.is_staff:
            return Producto.objects.filter(
                administrador=usuario
            ).order_by("-id")

        return Producto.objects.filter(
            disponible=True
        ).order_by("-id")

    def perform_create(self, serializer):
        serializer.save(administrador=self.request.user)

    def perform_update(self, serializer):
        serializer.save(administrador=self.request.user)


class PedidoViewSet(viewsets.ModelViewSet):
    serializer_class = PedidoSerializer
    queryset = Pedido.objects.all().order_by("-id")

    def get_permissions(self):
        # Los usuarios autenticados pueden consultar y crear comandas.
        if self.action in ["list", "retrieve", "create"]:
            return [IsAuthenticated()]

        # Solo administradores pueden modificar o eliminar pedidos.
        return [IsAdminUser()]
