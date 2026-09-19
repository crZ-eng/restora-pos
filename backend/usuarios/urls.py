from django.urls import path

from .views import (
    RegistroAdministradorView,
    LoginView,
    ListaMeserosView,
    CrearMeseroView,
    DetalleMeseroView,
    LoginMeseroView,
)


urlpatterns = [

    path(
        "registro/",
        RegistroAdministradorView.as_view()
    ),

    path(
        "login/",
        LoginView.as_view()
    ),

    path(
        "meseros/",
        ListaMeserosView.as_view()
    ),

    path(
        "meseros/crear/",
        CrearMeseroView.as_view()
    ),

    path(
        "meseros/<int:id>/",
        DetalleMeseroView.as_view()
    ),

    path(
        "meseros/login/",
        LoginMeseroView.as_view()
    ),

]