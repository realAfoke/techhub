from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.decorators import api_view,permission_classes
from . import models
from . import serializers
from rest_framework import permissions
from rest_framework.reverse import reverse
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework import permissions
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from main.auth_serializer import IsOwner,IsVerified
from rest_framework.exceptions import ValidationError
from rest_framework import status
from django.db import transaction
from django.db.models import Q
from datetime import datetime
from uuid import uuid4
import re
from rest_framework_simplejwt.exceptions import InvalidToken,TokenError
from pprint import pprint
from django.contrib.auth.views import PasswordResetView
from rave_python import Rave,RaveExceptions,Misc
from decouple import config
from django.conf import settings
import json
import requests
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse,JsonResponse


User=get_user_model()

class CustomRefreshTokenView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        serializer=self.get_serializer(data={'refresh':request.COOKIES.get('refresh')})
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])
        
        response=Response({'access token refresh'})
        response.set_cookie(
            key='access',
            value=serializer.validated_data.get('access'),
            path='/',
            samesite='None',
            secure=True,
            max_age=60*5,
            httponly=True
        )
        return response

class LoginView(TokenObtainPairView):
    serializer_class=serializers.LoginSerializer
    def post(self, request, *args, **kwargs):
        token= super().post(request, *args, **kwargs)
        response=Response({'message':'successfull'})
        response.set_cookie(
            key='access',
            value=str(token.data.get('access')),
            path='/',
            httponly=True,
            secure=True,
            samesite='None',
            max_age=60*5
        )
        response.set_cookie(
            key='refresh',
            value=str(token.data.get('refresh')),
            path='/',
            httponly=True,
            secure=True,
            samesite='None',
            max_age=60*60*24*7
        )
        return response
    
class LogOutView(APIView):
    def post(self,request):
        response=Response({'message':'Logged out successfully'})
        response.delete_cookie('refresh',path='/',samesite='None')
        response.delete_cookie('access',path='/',samesite='None')


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


class CurrentUserView(generics.RetrieveUpdateAPIView):
    serializer_class=serializers.ProfileSerializer
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
        return Response({'message':'if an account exists with that email address,we\'ve sent instructions to reset your password.Please check your inbox and follow the link to continue'})
    
class PasswordResetConfirmView(APIView):
    def post(self,request,*args,**kwargs):
        token=kwargs['token']
        new_password=request.data.get('new_pass_word')
        try:
            reset_token=models.PasswordResetToken.objects.get(token=token)
            if not reset_token or reset_token.created < timezone.now()-timedelta(hours=24):
                raise ValidationError('link expired')
            user=reset_token.user
            user.set_password(new_password)
            user.save()
            print('is_changed:',user.check_password(request.data.get('new_password')))
            reset_token.is_used=True
            reset_token.save()
            return Response({'mssg':'passwod reset successful login with your new password'})
        except models.PasswordResetToken.DoesNotExist:
            return Response({'mssg':'link expired'})

@api_view(['PUT','PATCH'])
@permission_classes([permissions.IsAuthenticated])
def password_update(request,pk):
    if request.method == 'PUT' or request .method == 'PATCH':
        try:
            user=models.User.objects.get(id=pk)
        except models.User.DoesNotExist:
            return Response({"message":'user does not exit'})
        password_check=user.check_password(request.data.get('current_password'))
        if not password_check:
            raise ValidationError('current password incorrect')
        user.set_password(request.data.get('new_password'))
        user.save()

        return Response({'message':'password change successfully'})


# class PasswordChangeView(generics.UpdateAPIView):



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
        if not serializer.data:
            return Response({'response':'Item not found'},status=status.HTTP_404_NOT_FOUND)
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
                category=product.category
                brand=product.brand
                price=product.price
                similiar_product=models.Products.objects.filter(Q(category=category) |Q(brand=brand) | Q(price__lt=price) | Q(price__gt=price))
                similiar_product_serializer=serializers.ProductSerializer(similiar_product,many=True,context={'request':request})
                serializer=serializers.ProductFullSerializer(product,context={'request':request})
                response={'product_detail':serializer.data,'similiar_product':similiar_product_serializer.data}
                return Response(response,status=status.HTTP_200_OK)
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
        if not anon_cart and not user.is_authenticated:
             return Response({'message':'Cart is Empty'})     
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
            if existing_cart:
                carts=existing_cart
            else:
                carts=anon_cart
            if not carts.owner_type:
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


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def payment_initialiser(request):
    if request.method == 'POST':
        if not request.headers.get('verif-hash'):
            cart=models.Cart.objects.filter(owner_type=request.user).first()
            for item in cart.items.all():
                if item.quantity > item.product.stock_quantity:
                    raise ValidationError(f"carted prodduct {item.product.name} quantity is more than stock quantity please reduce product quantity")
                item.product.stock_quantity=item.product.stock_quantity - item.quantity
                item.product.save()

            payload=request.data
            customer={}
            customer['email']=request.user.email
            customer['phone']=request.user.phone
            customer['name']=f'{request.user.first_name} {request.user.last_name}'
            payload['customer']=customer
            payload['redirect_url']='https://localhost:5173/'
            payload['tx_ref']=str(cart.cart_id)
            header={'Authorization':f'Bearer {settings.RAVE_SECRET_KEY}','Content-Type':'application/json'}
            try:
                # pprint(payload)
                payment=requests.post('https://api.flutterwave.com/v3/payments',headers=header,json=payload)
                data=payment.json()
                print('data:',data)
                return Response(data)
            except requests.RequestException as e:
                return Response({'error':str(e)})
        
    # secret_hash=getattr(settings,'RAVE_SECRET_KEY',None)
    # if secret_hash and secret_hash == request.headers.get('verif-hash'):
@api_view(['POST'])
@csrf_exempt
def payment_verification(request):
    if request.method == 'POST':
        secret_hash=getattr(settings,'RAVE_SECRET_HASH',None)
        recieve_hash=request.headers.get('verif-hash')
        if secret_hash != recieve_hash:
            return JsonResponse({'error':'Invalid signature'},status=401)
        data=json.loads(request.body)
        pprint({'data hook':data})
        tx_id=data['data']['id']
        verif_url=f'https://api.flutterwave.com/v3/transactions/{tx_id}/verify'
        headers={'Authorization':f'Bearer {settings.RAVE_SECRET_KEY}'}

        req=requests.get(verif_url,headers=headers)
        resp=req.json()
        pprint({'resp hook':resp})
        if resp['status']== 'success':
            cart_id=resp['data']['tx_ref']
            cart=models.Cart.objects.filter(cart_id=cart_id).first()
            order_id=str(datetime.now()) + str(uuid4())
            real_id=re.sub(r"[^a-zA-Z0-9]","",order_id)
            order_data={'order_id':real_id}
            order_item_list=[]
            user=cart.owner_type
            total_order=0
            total_quantity=0
            for item in cart.items.all():
                ordered_item={}
                ordered_item['product']=item.product
                ordered_item['price']=item.price_when_added
                ordered_item['quantity']=item.quantity
                ordered_item['total']=item.total
                total_order +=item.total
                total_quantity +=item.quantity
                order_item_list.append(ordered_item)
        
            serializer=serializers.OrderSerializer(data=order_data,context={'request':request})
            if serializer.is_valid(raise_exception=True):
                serializer.save(user=user,total_order=total_order,total_quantity=total_quantity,order_status='success',order_item=order_item_list)
                order=models.Order.objects.get(order_id=real_id)
                order.send_order_confirmation()
                cart.delete()
                return Response(serializer.data,status=status.HTTP_200_OK)
            else:
                cart_id=resp['data']['tx_ref']
                cart=models.Cart.objects.filter(cart_id=cart_id).first()
                for item in cart.items.all():
                    item.product.stock_quantity +=item.quantity
                    item.product.save()

                return Response({'error':'payment failed'})
    

        # if res['data']['status'] == 'successfull':


class PaymentMethodView(generics.ListCreateAPIView):
    queryset=models.PaymentMethod.objects.all()
    serializer_class=serializers.PaymentMethodSerializer


#  header {'Host': 'localhost:8000', 'Content-Length': '673', 'Accept': 'application/json', 'Content-Type': 'application/json', 'Verif-Hash': 'myscretehashisgreatestonime', 'X-Forwarded-For': '34.254.131.32', 'X-Forwarded-Host': '3fdcd47fa929.ngrok-free.app', 'X-Forwarded-Proto': 'https', 'Accept-Encoding': 'gzip'}
# headers verification hash myscretehashisgreatestonime   

# secret_hash: myscretehashisgreatestonime
# recieve_hash myscretehashisgreatestonime
# data: {'event': 'charge.completed', 'data': {'id': 9752675, 'tx_ref': 'a5ee1de8-ef1e-4716-9d6d-91bbc9cd563b', 'flw_ref': '1761780414461-FLW-MOCK-REF', 'device_fingerprint': 'N/A', 'amount': 1849, 'currency': 'NGN', 'charged_amount': 1849, 'app_fee': 25.89, 'merchant_fee': 0, 'processor_response': 'Successful', 'auth_model': 'INTERNET_BANKING', 'ip': '52.209.154.143', 'narration': 'Novamart', 'status': 'successful', 'payment_type': 'account', 'created_at': '2025-10-29T23:26:54.000Z', 'account_id': 2643416, 'customer': {'id': 3392393, 'name': 'Novamart', 'phone_number': None, 'email': 'ravesb_302fb78d3ebd31eee302_syntaxmerge88@gmail.com', 'created_at': '2025-10-29T23:26:54.000Z'}, 'account': {'account_name': 'undefined undefined'}}, 'event.type': 'ACCOUNT_TRANSACTION'}
# RES: {'status': 'success', 'message': 'Transaction fetched successfully', 'data': {'id': 9752675, 'tx_ref': 'a5ee1de8-ef1e-4716-9d6d-91bbc9cd563b', 'flw_ref': '1761780414461-FLW-MOCK-REF', 'device_fingerprint': 'N/A', 'amount': 1849, 'currency': 'NGN', 'charged_amount': 1849, 'app_fee': 25.89, 'merchant_fee': 0, 'processor_response': 'Successful', 'auth_model': 'INTERNET_BANKING', 'ip': '52.209.154.143', 'narration': 'Novamart', 'status': 'successful', 'payment_type': 'account', 'created_at': '2025-10-29T23:26:54.000Z', 'account_id': 2643416, 'meta': {'__CheckoutInitAddress': 'https://checkout-v2.dev-flutterwave.com/v3/hosted/pay'}, 'amount_settled': 1821.16, 'customer': {'id': 3392393, 'name': 'Novamart', 'phone_number': 'N/A', 'email': 'ravesb_302fb78d3ebd31eee302_syntaxmerge88@gmail.com', 'created_at': '2025-10-29T23:26:54.000Z'}}}







# {'data hook': {'data': {'account_id': 2643416,
#                         'amount': 1849,
#                         'app_fee': 25.89,
#                         'auth_model': 'AUTH',
#                         'charged_amount': 1849,
#                         'created_at': '2025-11-15T00:24:16.000Z',
#                         'currency': 'NGN',
#                         'customer': {'created_at': '2025-10-25T23:26:43.000Z',
#                                      'email': 'ravesb_302fb78d3ebd31eee302_syntaxmerge88@gmail.com',
#                                      'id': 3390341,
#                                      'name': 'Novamart',
#                                      'phone_number': '08012345678'},
#                         'device_fingerprint': 'N/A',
#                         'flw_ref': '2200735871451763166248967',
#                         'id': 9794225,
#                         'ip': '52.209.154.143',
#                         'merchant_fee': 0,
#                         'narration': 'Novamart',
#                         'payment_type': 'bank_transfer',
#                         'processor_response': 'success',
#                         'status': 'successful',
#                         'tx_ref': '1f80e427-9aa5-489d-acf5-6dd3c1572b1e'},
#                'event': 'charge.completed',
#                'event.type': 'BANK_TRANSFER_TRANSACTION'}}
# {'resp hook': {'data': {'account_id': 2643416,
#                         'amount': 1849,
#                         'amount_settled': 1823.11,
#                         'app_fee': 25.89,
#                         'auth_model': 'AUTH',
#                         'charged_amount': 1849,
#                         'created_at': '2025-11-15T00:24:16.000Z',
#                         'currency': 'NGN',
#                         'customer': {'created_at': '2025-10-25T23:26:43.000Z',
#                                      'email': 'ravesb_302fb78d3ebd31eee302_syntaxmerge88@gmail.com',
#                                      'id': 3390341,
#                                      'name': 'Novamart',
#                                      'phone_number': '08012345678'},
#                         'device_fingerprint': 'N/A',
#                         'flw_ref': '2200735871451763166248967',
#                         'id': 9794225,
#                         'ip': '52.209.154.143',
#                         'merchant_fee': 0,
#                         'meta': {'__CheckoutInitAddress': 'https://localhost:5173/',
#                                  'bankname': 'Access Bank',
#                                  'originatoraccountnumber': '123*******90',
#                                  'originatoramount': 'N/A',
#                                  'originatorname': 'JOHN DOE'},
#                         'narration': 'Novamart',
#                         'payment_type': 'bank_transfer',
#                         'processor_response': 'success',
#                         'status': 'successful',
#                         'tx_ref': '1f80e427-9aa5-489d-acf5-6dd3c1572b1e'},
#                'message': 'Transaction fetched successfully',
#                'status': 'success'}}