from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView



# Create your views here.
class mainGetView(APIView):
    def get(self,request,*args,**kwargs):
        return Response({'message':"hello there"})
