from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from django.http import JsonResponse


def healthz(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("healthz", healthz),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/v1/auth/", include("apps.accounts.urls")),
    path("api/v1/", include("apps.clinic.urls")),
    path("api/v1/", include("apps.scheduling.urls")),
    path("api/v1/", include("apps.appointments.urls")),
    path("api/v1/", include("apps.reports.urls")),
    path("api/internal/", include("apps.notifications.urls")),
]
