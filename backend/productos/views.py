from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .models import Producto
from .serializers import ProductoSerializer


class ProductoViewSet(viewsets.ModelViewSet):

    serializer_class = ProductoSerializer

    def get_permissions(self):

        if self.action in ["list", "retrieve"]:
            return [IsAuthenticated()]

        return [IsAdminUser()]

    def get_queryset(self):

        usuario = self.request.user

        # ADMINISTRADOR
        # Solo puede ver sus propios productos
        if usuario.is_staff:
            return Producto.objects.filter(
                administrador=usuario
            ).order_by("-id")

        # MESERO
        # Solo puede ver productos disponibles
        return Producto.objects.filter(
            disponible=True
        ).order_by("-id")

    def perform_create(self, serializer):

        serializer.save(
            administrador=self.request.user
        )

    def perform_update(self, serializer):

        serializer.save(
            administrador=self.request.user
        )