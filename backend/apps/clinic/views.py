from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import AllowAny
from apps.accounts.permissions import IsAdmin
from apps.clinic.models import Specialty
from apps.clinic.serializers import (
    SpecialtySerializer,
    DoctorProfileSerializer,
    DoctorDetailSerializer,
)
from apps.clinic.selectors import get_doctor_list, get_doctor_detail


class DoctorListView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = DoctorProfileSerializer

    def get_queryset(self):
        search = self.request.query_params.get("search", "").strip() or None
        specialty_slug = self.request.query_params.get("specialty", "").strip() or None
        return get_doctor_list(search=search, specialty_slug=specialty_slug)


class DoctorDetailView(RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = DoctorDetailSerializer

    def get_object(self):
        return get_doctor_detail(self.kwargs["pk"])


class SpecialtyListCreateView(ListCreateAPIView):
    serializer_class = SpecialtySerializer
    queryset = Specialty.objects.all().order_by("name")

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdmin()]


class SpecialtyDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdmin]
    serializer_class = SpecialtySerializer
    queryset = Specialty.objects.all()
