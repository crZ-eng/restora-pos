from django.contrib import admin

from .models import Mesero


@admin.register(Mesero)
class MeseroAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "nombre",
        "codigo",
        "activo",
        "creado",
    )

    search_fields = (
        "nombre",
        "codigo",
    )

    list_filter = (
        "activo",
    )