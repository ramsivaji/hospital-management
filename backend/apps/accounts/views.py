from django.conf import settings
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

from apps.accounts.models import User
from apps.accounts.serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
)


def set_refresh_cookie(response, refresh_token):
    simple_jwt = getattr(settings, "SIMPLE_JWT", {})
    cookie_name = simple_jwt.get("AUTH_COOKIE", "refresh_token")
    lifetime = simple_jwt.get("REFRESH_TOKEN_LIFETIME")
    max_age = int(lifetime.total_seconds()) if lifetime else 7 * 86400
    secure = simple_jwt.get("AUTH_COOKIE_SECURE", False)
    httponly = simple_jwt.get("AUTH_COOKIE_HTTP_ONLY", True)
    samesite = simple_jwt.get("AUTH_COOKIE_SAMESITE", "Lax")

    response.set_cookie(
        cookie_name,
        str(refresh_token),
        max_age=max_age,
        httponly=httponly,
        secure=secure,
        samesite=samesite,
        path="/",
    )


def clear_refresh_cookie(response):
    simple_jwt = getattr(settings, "SIMPLE_JWT", {})
    cookie_name = simple_jwt.get("AUTH_COOKIE", "refresh_token")
    response.delete_cookie(cookie_name, path="/")


class RegisterView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    @method_decorator(ratelimit(key="ip", rate="10/m", method="POST", block=True))
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        user_data = UserSerializer(user).data
        response = Response(
            {"user": user_data, "access": access_token},
            status=status.HTTP_201_CREATED,
        )
        set_refresh_cookie(response, refresh)
        return response


class LoginView(APIView):
    permission_classes = [AllowAny]

    @method_decorator(ratelimit(key="ip", rate="10/m", method="POST", block=True))
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        user_data = UserSerializer(user).data
        response = Response(
            {"user": user_data, "access": access_token},
            status=status.HTTP_200_OK,
        )
        set_refresh_cookie(response, refresh)
        return response


class RefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        simple_jwt = getattr(settings, "SIMPLE_JWT", {})
        cookie_name = simple_jwt.get("AUTH_COOKIE", "refresh_token")
        raw_refresh = request.COOKIES.get(cookie_name) or request.data.get("refresh")

        if not raw_refresh:
            return Response(
                {"code": "authentication_failed", "message": "Refresh token not provided", "details": {}},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            refresh = RefreshToken(raw_refresh)
            access_token = str(refresh.access_token)

            if simple_jwt.get("ROTATE_REFRESH_TOKENS", True):
                refresh.set_jti()
                refresh.set_exp()

            response = Response({"access": access_token}, status=status.HTTP_200_OK)
            set_refresh_cookie(response, refresh)
            return response
        except (TokenError, InvalidToken) as exc:
            return Response(
                {"code": "authentication_failed", "message": str(exc), "details": {}},
                status=status.HTTP_401_UNAUTHORIZED,
            )


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        simple_jwt = getattr(settings, "SIMPLE_JWT", {})
        cookie_name = simple_jwt.get("AUTH_COOKIE", "refresh_token")
        raw_refresh = request.COOKIES.get(cookie_name) or request.data.get("refresh")

        if raw_refresh:
            try:
                refresh = RefreshToken(raw_refresh)
                if hasattr(refresh, "blacklist"):
                    refresh.blacklist()
            except (TokenError, InvalidToken, AttributeError):
                pass

        response = Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        clear_refresh_cookie(response)
        return response


class MeView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
