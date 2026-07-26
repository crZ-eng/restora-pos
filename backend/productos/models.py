from django.db import models


class Producto(models.Model):

    CATEGORIAS = [
        ("Carnes", "Carnes"),
        ("Hamburguesas", "Hamburguesas"),
        ("Pastas", "Pastas"),
        ("Bebidas", "Bebidas"),
    ]

    nombre = models.CharField(max_length=150)

    descripcion = models.TextField(blank=True)

    categoria = models.CharField(
        max_length=50,
        choices=CATEGORIAS
    )

    precio = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    stock = models.IntegerField(default=0)

    tiempo_preparacion = models.IntegerField(default=15)

    imagen = models.ImageField(
        upload_to="productos/",
        blank=True,
        null=True
    )

    requiere_termino = models.BooleanField(default=False)

    permite_observaciones = models.BooleanField(default=True)

    disponible = models.BooleanField(default=True)

    creado = models.DateTimeField(auto_now_add=True)

    actualizado = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre