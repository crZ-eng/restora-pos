
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Producto
from .serializers import ProductoSerializer


class ProductoViewSet(viewsets.ModelViewSet):

    serializer_class = ProductoSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Producto.objects.filter(
            administrador=self.request.user
        ).order_by("-id")

    def perform_create(self, serializer):

        serializer.save(
            administrador=self.request.user
        )

