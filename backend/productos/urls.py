
from rest_framework.routers import DefaultRouter

from .views import ProductoViewSet, PedidoViewSet

router = DefaultRouter()

router.register(
    r"productos",
    ProductoViewSet,
    basename="productos"
)

router.register(
    r"pedidos",
    PedidoViewSet,
    basename="pedidos"
)

urlpatterns = router.urls
