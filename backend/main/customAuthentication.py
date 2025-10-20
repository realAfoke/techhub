from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from rest_framework import exceptions
from rest_framework_simplejwt.authentication import JWTAuthentication



User=get_user_model()
class CustomAuth:
    def authenticate(self,request,email=None,phone=None,password=None,**kwargs):
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
        
        
class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        raw_token=request.COOKIES.get('access')
        if raw_token is None:
            return
        try:
            validated_token=self.get_validated_token(raw_token)
            user=self.get_user(validated_token)
            return user,validated_token
        except Exception as e:
            print('Token validation error:',e)
            return None