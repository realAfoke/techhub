from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from . import models
from . import serializers
from rest_framework import permissions
from rest_framework.reverse import reverse
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework import permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from main.auth_serializer import IsOwner,IsVerified
from rest_framework.exceptions import ValidationError
from rest_framework import status
from django.db import transaction
from django.db.models import Q
from datetime import datetime
from uuid import uuid4
import re
from pprint import pprint
from django.contrib.auth.views import PasswordResetView



User=get_user_model()

class LoginView(TokenObtainPairView):
    serializer_class=serializers.LoginSerializer

    def post(self, request, *args, **kwargs):
        token= super().post(request, *args, **kwargs)
        response=Response({'message':'successfull'})
        response.set_cookie(
            key='access',
            value=str(token.data.get('access')),
            httponly=True,
            secure=True,
            samesite='None',
            max_age=60*5
        )
        response.set_cookie(
            key='refresh',
            value=str(token.data.get('refresh')),
            httponly=True,
            secure=True,
            samesite='None',
            max_age=60*60*24*7
        )
        return response
    
class LogOutView(APIView):
    def post(self,request):
        response=Response({'message':'Logged out successfully'})
        response.delete_cookie('access')
        response.delete_cookie('refresh')

        return response 


class Root(APIView):
    def get(self,request):
        return Response(
            {   'user':reverse('user-view',request=request),
                # 'add_cart_item':reverse('cart-list',request=request),
                # 'add_product':reverse('product-view',request=request),
                'login':reverse('login-view',request=request),
                # 'product':reverse('product-view',request=request),
                # 'checkout':reverse('checkout-view',request=request),
            }
        )
class SignUpView(generics.ListCreateAPIView):
    queryset=User.objects.all()
    serializer_class=serializers.SignUpSerializer


class CurrentUserView(generics.RetrieveAPIView):
    serializer_class=serializers.UserSerializer
    permission_classes=[permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user



class CheckUser(APIView):
    def get(self,request):
        for k,v in request.query_params.items():
            q_object =Q(**{f"{k}":v[:]})
        if models.User.objects.filter(q_object).exists():
            return Response('user exist')
        else:
            return Response('user not found')

class PasswordResetView(APIView):
    def post(self,request):
        email=request.data.get('email')
        reset=None
        try:
            if request.user.is_authenticated:
                reset=request.user
            else:
                reset=models.User.objects.get(email=email)
            reset.send_password_reset_email()
            
        except models.User.DoesNotExist:
            pass
        return Response({'message':'you will get a reset link via the email provided'})
    
class PasswordResetConfirmView(APIView):
    def post(self,request,*args,**kwargs):
        token=kwargs['token']
        new_password=request.data.get('new_password')
        try:
            password=models.PasswordResetToken.objects.get(token=token)
            if not password or password.created < timezone.now()-timedelta(hours=24):
                raise ValidationError('link expired')
            password.user.set_password(new_password)
            password.is_used=True
            password.user.save()
            password.save()
            return Response({'mssg':'passwod reset successful login with your new password'})
        except models.PasswordResetToken.DoesNotExist:
            return Response({'mssg':'link expired'})
        

# class UserListView(generics.ListAPIView):
#     queryset=User.objects.all()
#     serializer_class=serializers.UserSerializer
    # permission_classes=[permissions.IsAuthenticatedOrReadOnly]



class CategoriesListView(generics.ListCreateAPIView):
    queryset=models.Categories.objects.all()
    serializer_class=serializers.CategoriesSerializer
    # permission_classes=[permissions.IsAuthenticated]


class CategoriesDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset=models.Categories.objects.all()
    serializer_class=serializers.CategoriesSerializer


class SearchView(generics.ListAPIView):
    queryset=models.Products.objects.all()
    serializer_class=serializers.ProductSerializer
    
    def list(self, request, *args, **kwargs):
        query=self.get_queryset()
        q_object=Q()
        search_params=dict(request.query_params)
        if not search_params.get('name'):
            for k,v in search_params.items():
                if k == 'price':
                    q_object &=Q(**{f"{k}__gt":v[0]})
                else:
                    q_object &=Q(**{f"{k}__in":v[0].split(",")})
        else:
            for k,v in search_params.items():
                q_object |=Q( **{f"{k}__icontains":v[0]})
        products=query.filter(q_object)
        serializer=self.get_serializer(products,many=True)
        return Response(serializer.data)
        
    

class BrandListView(generics.ListCreateAPIView):
    queryset=models.Brands.objects.all()
    serializer_class=serializers.BrandsSerializer



class ProductView(APIView):
    permission_classes=[permissions.IsAuthenticatedOrReadOnly,IsOwner]
    def post(self,request):
        products=request.data
        try:
            for product in products:
                serializer=serializers.ProductFullSerializer(data=product,context={'request':request})
                if serializer.is_valid():
                    category=models.Categories.objects.get(pk=product.get('category_id'))
                    serializer.save(owner=self.request.user,brand=product.get('brand'),product_image=product.get('product_image'),category=category)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(str(e),status=status.HTTP_400_BAD_REQUEST)
    
    def get(self,request,pk=None):
        if pk:
            try:
                product=models.Products.objects.get(pk=pk)
                serializer=serializers.ProductFullSerializer(product,context={'request':request})
                return Response(serializer.data,status=status.HTTP_200_OK)
            except models.Products.DoesNotExist:
                return Response({"detail":"Product Not Found"},status=status.HTTP_404_NOT_FOUND)
        products=models.Products.objects.all()
        serializer=serializers.ProductSerializer(products,many=True,context={'request':request})
        data=serializer.data.copy()
        if request.user.is_authenticated:
            data.append({'auth':True})
        else:
            data.append({'auth':False})
        return Response(data)
    
class CartView(generics.ListCreateAPIView):
    queryset=models.Cart.objects.all()
    serializer_class=serializers.CartSerializer
    permission_classes=[permissions.AllowAny]

    def perform_create(self, serializer):
        qs=self.request.data
        cart_id=qs.get('cart_id')
        serializer.save(expiry=timedelta(days=365) if self.request.user.is_authenticated else timedelta(days=30),carts=qs.get('carts'),cart_id=cart_id)
    def list(self, request, *args, **kwargs):
        cart_id=request.query_params.get('cart_id')
        query=self.get_queryset()
        anon_cart=query.filter(cart_id=cart_id).first()
        user=request.user
        if anon_cart:
            carts=anon_cart
        if user.is_authenticated:
            existing_cart=query.filter(owner_type=user).first()
            if existing_cart and anon_cart:
                for item in anon_cart.items.all():
                    item.cart=existing_cart
                    item.save()
                anon_cart.delete()
                existing_cart.save()
            carts=existing_cart
        else:
            return Response({'message':'Cart is Empty'})        
        if not carts.owner_type and user.is_authenticated:
            carts.owner_type=request.user
            carts.save()

        serializer=self.get_serializer(carts)
        return Response(serializer.data)

class UpdateEditCartView(generics.RetrieveUpdateDestroyAPIView):
    queryset=models.Cart.objects.all()
    serializer_class=serializers.CartSerializer
    lookup_field='cart_id'
    def edit_item(self,request,items):
        cart=self.get_object()
        serializer=self.get_serializer(cart,data=request.data,partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save(items=items)
            return serializer.data

    def update(self, request, *args, **kwargs):
        items=request.data
        return Response(self.edit_item(request,items),status=status.HTTP_200_OK)
        
    def delete(self, request, *args, **kwargs):
        qs=dict(request.query_params)
        print(qs)
        carts=self.get_object()
        item=carts.items.get(id=qs['item_id'][0])
        item.delete()
        serializer=self.get_serializer(carts)
        return Response(serializer.data,status=status.HTTP_200_OK)
       

class CheckOutView(generics.ListCreateAPIView):
    queryset=models.Cart.objects.all()
    serializer_class=serializers.CartSerializer
    lookup_field='cart_id'

    def list(self, request, *args, **kwargs):
        items=self.get_queryset()
        serializer=self.get_serializer(items,many=True)
        print(serializer.data)
        return Response(serializer.data)
    

@api_view(['GET'])
def checkout(request,cart_id):
    if request.method == 'GET':
        cart=models.Cart.get(cart_id=cart_id)
        serializer=serializers.CheckOutSerializer(cart,many=True)
   
class PlaceOrderView(generics.CreateAPIView):
    queryset=models.Order.objects.all()
    serializer_class=serializers.OrderSerializer
    permission_classes=[permissions.IsAuthenticatedOrReadOnly,IsOwner,IsVerified]
    def create(self, request, *args, **kwargs):
        serializer=self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            return Response({'error':e.detail})
        try:
            self.perform_create(serializer)
        except Exception as e:
            print(e)
            return Response({'error':str(e)},status=status.HTTP_400_BAD_REQUEST)
        try:
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response({'error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    @transaction.atomic
    def perform_create(self, serializer):
        cart=models.Cart.objects.get(cart_id=self.request.data.get('cart_id'))
        items=models.CartItem.objects.filter(cart=cart)
        items_list=[]
        order_id=str(datetime.now()) + str(uuid4())
        real_id=re.sub(r"[^a-zA-Z0-9]","",order_id)
        for item in items:
            if item.quantity > item.product.stock_quantity:
                raise ValidationError("carted prodduct quantity is more than stock quantity please reduce product quantity")
            order_item={}
            order_item['product']=item.product
            order_item['quantity']=item.quantity
            order_item['price']=item.current_price
            order_item['total']=item.quantity*item.current_price
            order_item['order_id']=real_id
            items_list.append(order_item)
            item.product.stock_quantity=item.product.stock_quantity - item .quantity
            item.product.save()
        serializer.save(order_item=items_list,user=self.request.user)
        cart.delete()
        email=models.Order.objects.get(order_id=real_id)
        email.send_pending_mail()
    
        
class OrderHistoryView(generics.ListAPIView):
    serializer_class=serializers.OrderSerializer
    permission_classes=[permissions.IsAuthenticated,IsOwner]

    def list(self, request, *args, **kwargs):
        queryset=models.Order.objects.filter(user_id=request.user)
        serializer=self.get_serializer(queryset,many=True)
        return Response(serializer.data)

def orderConfirmationEmail(order):
    order=models.Order.objects.get(order_id=order)
    user=models.User.objects.get(pk=order.user_id)
    if not order:
        return
    

class EmailVerificationView(generics.RetrieveAPIView):
    def retrieve(self, request, *args, **kwargs):
        token=self.kwargs['token']
        try:
            verification=models.EmailVerificationToken.objects.get(token=token)
            if not verification.created or verification.created < timezone.now()- timedelta(hours=24):
                raise ValidationError({'error':'expired','message':'invalid or expired verification link.Please request a new one.'})
        except models.EmailVerificationToken.DoesNotExist as e:
            return Response({'error':'expired','message':'invalid or expired verification link.Please request a new one.'})
        verification.user.is_verified=True
        verification.is_used=True
        verification.user.save()
        verification.save()
        return Response('Email verification succesfull')
    

class SendVerification(APIView):
    permission_classes=[permissions.IsAuthenticated]
    def post(self,request):
        user=request.user
        user.send_verification_email()
        return Response({'msg':'verification email sent'})
    # lookup_field='token'


class PaymentMethodView(generics.ListCreateAPIView):
    queryset=models.PaymentMethod.objects.all()
    serializer_class=serializers.PaymentMethodSerializer