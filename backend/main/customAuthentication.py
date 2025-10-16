from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from rest_framework import exceptions


User=get_user_model()
class CustomAuth:
    def authenticate(self,request,email=None,phone=None,password=None,**kwargs):
        print(phone,'phone >>>>>>>>>.')
        if email is None and phone is None:
            return
        try:
            if email:
                user=User.objects.get(email=email)
            else:
                user=User.objects.get(phone=phone)
        except User.DoesNotExist:
            return
            # raise exceptions.NotFound('user found')
        
        if user.check_password(password):
            return user