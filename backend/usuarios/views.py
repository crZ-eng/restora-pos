
import secrets
import string

from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated

from rest_framework_simplejwt.tokens import RefreshToken

from .models import Mesero
from .serializers import MeseroSerializer


def generar_codigo():

    caracteres = string.ascii_uppercase + string.digits

    while True:

        codigo = "".join(
            secrets.choice(caracteres)
            for _ in range(6)
        )

        if not Mesero.objects.filter(codigo=codigo).exists():
            return codigo


def generar_tokens(usuario):

    refresh = RefreshToken.for_user(usuario)

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


# ============================================================
# REGISTRO ADMINISTRADOR
# ============================================================

class RegistroAdministradorView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        username = request.data.get("username")
        password = request.data.get("password")
        password_confirm = request.data.get("password_confirm")

        if not username or not password:

            return Response(
                {
                    "error": "Usuario y contraseña son obligatorios."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if password != password_confirm:

            return Response(
                {
                    "error": "Las contraseñas no coinciden."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():

            return Response(
                {
                    "error": "Ese usuario ya existe."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        usuario = User.objects.create_user(
            username=username,
            password=password
        )

        usuario.is_staff = True
        usuario.is_superuser = True
        usuario.save()

        tokens = generar_tokens(usuario)

        return Response(
            {
                "mensaje": "Administrador creado correctamente.",
                "usuario": usuario.username,
                "rol": "administrador",
                **tokens
            },
            status=status.HTTP_201_CREATED
        )


# ============================================================
# LOGIN ADMINISTRADOR
# ============================================================

class LoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        username = request.data.get("username")
        password = request.data.get("password")

        usuario = authenticate(
            username=username,
            password=password
        )

        if usuario is None:

            return Response(
                {
                    "error": "Usuario o contraseña incorrectos."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not usuario.is_staff:

            return Response(
                {
                    "error": "Este usuario no es un administrador."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        tokens = generar_tokens(usuario)

        return Response(
            {
                "mensaje": "Inicio de sesión correcto.",
                "usuario": usuario.username,
                "rol": "administrador",
                **tokens
            },
            status=status.HTTP_200_OK
        )


# ============================================================
# CREAR MESERO
# ============================================================

class CrearMeseroView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        if not request.user.is_staff:

            return Response(
                {
                    "error": "No tienes permisos para crear meseros."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        nombre = request.data.get("nombre")

        if not nombre or not nombre.strip():

            return Response(
                {
                    "error": "El nombre es obligatorio."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        codigo = generar_codigo()

        username = f"mesero_{codigo}"

        usuario = User.objects.create_user(
            username=username
        )

        usuario.set_unusable_password()
        usuario.save()

        mesero = Mesero.objects.create(
            administrador=request.user,
            usuario=usuario,
            nombre=nombre.strip(),
            codigo=codigo
        )

        return Response(
            {
                "mensaje": "Mesero creado correctamente.",
                "mesero": MeseroSerializer(mesero).data
            },
            status=status.HTTP_201_CREATED
        )


# ============================================================
# LISTAR MESEROS DEL ADMINISTRADOR ACTUAL
# ============================================================

class ListaMeserosView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if not request.user.is_staff:

            return Response(
                {
                    "error": "No tienes permisos para ver los meseros."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        meseros = Mesero.objects.filter(
            administrador=request.user
        ).order_by("-creado")

        serializer = MeseroSerializer(
            meseros,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


# ============================================================
# EDITAR / ELIMINAR MESERO
# ============================================================

class DetalleMeseroView(APIView):

    permission_classes = [IsAuthenticated]

    def put(self, request, id):

        if not request.user.is_staff:

            return Response(
                {
                    "error": "No tienes permisos para editar meseros."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        try:

            mesero = Mesero.objects.get(
                id=id,
                administrador=request.user
            )

        except Mesero.DoesNotExist:

            return Response(
                {
                    "error": "Mesero no encontrado."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        nombre = request.data.get("nombre")

        if not nombre or not nombre.strip():

            return Response(
                {
                    "error": "El nombre es obligatorio."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        mesero.nombre = nombre.strip()
        mesero.save()

        return Response(
            {
                "mensaje": "Mesero actualizado correctamente.",
                "mesero": MeseroSerializer(mesero).data
            },
            status=status.HTTP_200_OK
        )

    def delete(self, request, id):

        if not request.user.is_staff:

            return Response(
                {
                    "error": "No tienes permisos para eliminar meseros."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        try:

            mesero = Mesero.objects.get(
                id=id,
                administrador=request.user
            )

        except Mesero.DoesNotExist:

            return Response(
                {
                    "error": "Mesero no encontrado."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        mesero.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )


# ============================================================
# LOGIN MESERO
# ============================================================

class LoginMeseroView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        codigo = request.data.get("codigo")

        if not codigo:

            return Response(
                {
                    "error": "El código es obligatorio."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            mesero = Mesero.objects.get(
                codigo=codigo.upper(),
                activo=True
            )

        except Mesero.DoesNotExist:

            return Response(
                {
                    "error": "Código de mesero inválido."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        tokens = generar_tokens(
            mesero.usuario
        )

        return Response(
            {
                "mensaje": "Inicio de sesión correcto.",
                "usuario": mesero.nombre,
                "rol": "mesero",
                "codigo": mesero.codigo,
                **tokens
            },
            status=status.HTTP_200_OK
        )

