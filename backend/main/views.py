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

User=get_user_model()

class LoginView(TokenObtainPairView):
    serializer_class=serializers.LoginSerializer

class Root(APIView):
    def get(self,request):
        return Response(
            {
                'add_cart_item':reverse('cart-list',request=request),
                # 'get_all_user_cart_item':reverse('view-cart',request=request,id=id),
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
    pagination_class=[permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        print(self.request.user)
        # user_id=User.objects.filter(emial=self.request.user)
        # serializer.save(owner=user_id.id)
        serializer.save(owner=self.request.user)

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset=models.Products.objects.all()
    serializer_class=serializers.ProductSerializer
    permission_classes=[permissions.IsAuthenticatedOrReadOnly,IsOwner]

class CartItemListView(generics.ListCreateAPIView):
    queryset=models.CartItem.objects.all()
    serializer_class=serializers.CartItemSerializer
    # permission_classes=[permissions.AllowAny]

    def perform_create(self, serializer):
        qs=dict(self.request.data)
        serializer.save(owner_type=str(self.request.user) if self.request.user.is_authenticated else 'AnonymousUser',expiry=timedelta(days=365) if self.request.user.is_authenticated else timedelta(days=30),cart_id=qs['cart_id'][0])

class ViewCart(generics.ListAPIView):
    serializer_class=serializers.UserCartItemSerializer
    def get_queryset(self):
        qs=models.CartItem.objects.filter(cart__cart_id=self.kwargs['id'])
        print(self.serializer_class(qs,many=True).data)
        return qs
