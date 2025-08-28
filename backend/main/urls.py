from django.urls import path
from . import views

urlpatterns=[
    path("",views.mainGetView.as_view(),name='get-view')
]