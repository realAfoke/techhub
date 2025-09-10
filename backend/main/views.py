from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from . import models
from . import serializers
from rest_framework import permissions
from rest_framework.reverse import reverse
from datetime import timedelta
from django.contrib.auth import get_user_model
from rest_framework import permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from main.auth_serializer import IsOwner
from rest_framework.exceptions import ValidationError
from rest_framework import status
from django.db import transaction

User=get_user_model()

class LoginView(TokenObtainPairView):
    serializer_class=serializers.LoginSerializer

class Root(APIView):
    def get(self,request):
        return Response(
            {
                'add_cart_item':reverse('cart-list',request=request),
                'add_product':reverse('product-view',request=request),
                'login':reverse('login-view',request=request),
                'product':reverse('product-view',request=request),
                # 'checkout':reverse('checkout-view',request=request),
            }
        )
# class SignUpView(generics.ListCreateAPIView):
#     queryset=User.objects.all()
#     serializer_class=serializers.SignUpSerializer

# class UserListView(generics.ListAPIView):
#     queryset=User.objects.all()
#     serializer_class=serializers.UserSerializer
#     # permission_classes=[permissions.IsAuthenticatedOrReadOnly]

# class CategoriesListView(generics.ListCreateAPIView):
#     queryset=models.Categories.objects.all()
#     serializer_class=serializers.CategoriesSerializer
#     # permission_classes=[permissions.IsAuthenticated]

# class CategoriesDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset=models.Categories.objects.all()
#     serializer_class=serializers.CategoriesSerializer

class BrandListView(generics.ListCreateAPIView):
    queryset=models.Brands.objects.all()
    serializer_class=serializers.BrandsSerializer

class ProductsListView(generics.ListCreateAPIView):
    queryset=models.Products.objects.all()
    serializer_class=serializers.ProductSerializer
    permission_classes=[permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        print(dict(self.request.data))
        serializer.save(owner=self.request.user)

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset=models.Products.objects.all()
    serializer_class=serializers.ProductSerializer
    permission_classes=[permissions.IsAuthenticatedOrReadOnly,IsOwner]

    
class CartItemListView(generics.ListCreateAPIView):
    queryset=models.CartItem.objects.all()
    serializer_class=serializers.CartItemSerializer
    permission_classes=[permissions.AllowAny]

    def perform_create(self, serializer):
        print('hi')
        qs=dict(self.request.data)
        serializer.save(owner_type=str(self.request.user) if self.request.user.is_authenticated else 'AnonymousUser',expiry=timedelta(days=365) if self.request.user.is_authenticated else timedelta(days=30),cart_id=qs['cart_id'][0])

class ViewCart(generics.ListCreateAPIView):
    queryset=models.Cart.objects.all()
    serializer_class=serializers.CartSerializer
    lookup_field='cart_id'
    # def get_queryset(self):
    #     qs=models.CartItem.objects.filter(cart__cart_id=self.kwargs['id'])
    #     return qs
    
class ItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset=models.CartItem.objects.all()
    serializer_class=serializers.CartItemSerializer
    
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
        print(serializer.data)
   
class PlaceOrderView(generics.CreateAPIView):
    queryset=models.Order.objects.all()
    serializer_class=serializers.OrderSerializer
    pagination_class=[permissions.IsAuthenticatedOrReadOnly,IsOwner]
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
        for item in items:
            if item.quantity > item.product.stock_quantity:
                raise ValidationError("carted prodduct quantity is more than stock quantity please reduce product quantity")
            order_item={}
            order_item['product']=item.product
            order_item['quantity']=item.quantity
            order_item['price']=item.current_price
            order_item['total']=item.quantity*item.current_price
            items_list.append(order_item)
            item.product.stock_quantity=item.product.stock_quantity - item .quantity
            item.product.save()
            print(item.product.stock_quantity,"product stock >>>>>>>>")
        serializer.save(order_item=items_list,user=self.request.user)
        cart.delete()
        
class OrderHistoryView(generics.ListAPIView):
    serializer_class=serializers.OrderSerializer
    permission_classes=[permissions.IsAuthenticated,IsOwner]

    def list(self, request, *args, **kwargs):
        queryset=models.Order.objects.filter(user_id=request.user)
        serializer=self.get_serializer(queryset,many=True)
        return Response(serializer.data)

# name:samsung
# slug:samsung
# description:the best mobile phone in the whole wide world
# price:200.00
# current_price:1500000.00
# specs:{"battery":"20000mah"}
# stock_quantity:20
# is_active:true
# is_featured:false
# category:5
# brand:1
# created_at:2025-09-02T20:55:05.946888Z
# updated_at:2025-09-02T20:55:05.946888Z
# owner:techhub@example.com
# sku:life is good