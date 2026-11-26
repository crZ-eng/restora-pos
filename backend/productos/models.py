from django.db import models
from django.contrib.auth.models import User

class Producto(models.Model):
    CATEGORIAS = [
        ("Carnes", "Carnes"),
        ("Hamburguesas", "Hamburguesas"),
        ("Pastas", "Pastas"),
        ("Bebidas", "Bebidas"),
    ]

    administrador = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="productos",
        null=True,
        blank=True,
    )
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    categoria = models.CharField(max_length=50, choices=CATEGORIAS)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    tiempo_preparacion = models.IntegerField(default=15)
    imagen = models.ImageField(upload_to="productos/", blank=True, null=True)
    requiere_termino = models.BooleanField(default=False)
    permite_observaciones = models.BooleanField(default=True)
    disponible = models.BooleanField(default=True)
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre

class Pedido(models.Model):
    ESTADO_CHOICES = [
        ("PENDIENTE", "Pendiente"),
        ("EN_COCINA", "En Cocina"),
        ("LISTO", "Listo"),
        ("COMPLETADO", "Completado"),
        ("CANCELADO", "Cancelado"),
    ]
    mesa = models.IntegerField(null=True, blank=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default="PENDIENTE")
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

class DetallePedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name="items")
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT)
    cantidad = models.PositiveIntegerField(default=1)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    termino = models.CharField(max_length=50, null=True, blank=True)
    observaciones = models.TextField(blank=True)
