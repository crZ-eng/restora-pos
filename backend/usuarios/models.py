from django.db import models
from django.contrib.auth.models import User


class Mesero(models.Model):

    administrador = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="meseros",
        null=True,
        blank=True
    )

    usuario = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="mesero"
    )

    nombre = models.CharField(max_length=100)

    codigo = models.CharField(
        max_length=10,
        unique=True
    )

    activo = models.BooleanField(default=True)

    creado = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.nombre}-{self.codigo}"

