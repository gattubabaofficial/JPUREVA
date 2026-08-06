from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    CustomTokenObtainPairView,
    LogoutView,
    MeView,
    RegisterHotelView,
    RegisterLabView,
    RegisterSupplierView,
)

urlpatterns = [
    path("register/supplier/", RegisterSupplierView.as_view(), name="register-supplier"),
    path("register/lab/", RegisterLabView.as_view(), name="register-lab"),
    path("register/hotel/", RegisterHotelView.as_view(), name="register-hotel"),
    path("login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"),
]
