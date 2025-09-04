"""
URL configuration for setting project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from main import views
from rest_framework_simplejwt.views import TokenRefreshView
# from rest_framework_simplejwt.views import TokenObtainPairView
from main.views import LoginView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("",include('main.urls')),
    # path('api/auth/',include('rest_framework.urls')),
    # path("sign-up/",views.SignUpView.as_view(),name="sign-up-view"),
    path("api/auth/login/",LoginView.as_view(),name="login-view"),
    path("api/auth/refresh/",TokenRefreshView.as_view(),name="token-refresh-view"),

]
