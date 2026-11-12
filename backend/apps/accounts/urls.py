from django.urls import path, re_path
from apps.accounts.views import (
    RegisterView,
    LoginView,
    RefreshView,
    LogoutView,
    MeView,
)

urlpatterns = [
    re_path(r"^register/?$", RegisterView.as_view(), name="register"),
    re_path(r"^login/?$", LoginView.as_view(), name="login"),
    re_path(r"^refresh/?$", RefreshView.as_view(), name="refresh"),
    re_path(r"^logout/?$", LogoutView.as_view(), name="logout"),
    re_path(r"^me/?$", MeView.as_view(), name="me"),
]
