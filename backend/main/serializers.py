from rest_framework import serializers,exceptions
from django.contrib.auth import get_user_model,authenticate
from . models import Categories,Brands,ProductImage,Products,CartItem,Cart,Order,OrderedItem,PaymentMethod,Payment,SavedCard
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from uuid import uuid4
from datetime import datetime
from django.http.request import QueryDict
import re
from django.db.models import Q
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth.models import update_last_login
from rest_framework_simplejwt.authentication import JWTAuthentication

User=get_user_model()

class SignUpSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True)
    email=serializers.CharField(required=False,write_only=True)
    phone=serializers.CharField(required=False,write_only=True)
    class Meta:
        model=User
        fields=['id','email', 'phone','password']

    def create(self, validated_data):
        user=User.objects.create_user(**validated_data)

        user.send_verification_email()

        return user   
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id','email','first_name','last_name','phone','state','city','address','complete_status']

class LoginSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields[self.username_field]=serializers.CharField(required=False,write_only=True)

    def authenticate(self,phone=None,email=None,password=None,**kwargs):
        if phone is None and email is None:
            return ('No email or Phone number provided')
        try:
            if phone:
                user=User.objects.get(phone=phone)
            else:
                user=User.objects.get(email=email)
        except User.DoesNotExist:
            return exceptions.AuthenticationFailed( {
        "no_active_account":("No active account found with the given credentials")
    })

        if not user.check_password(password):
            raise serializers.ValidationError('No active account found with the given credentials')
        return user

    def validate(self, attrs):
        self.initial_data['request']=self.context['request']
        self.user=self.authenticate(**self.initial_data)
        if self.user is None:
            return  {
        "no_active_account":("No active account found with the given credentials")}

        refresh=self.get_token(self.user)
        return {'refresh':str(refresh),'access':str(refresh.access_token)}

class CategoriesSerializer(serializers.HyperlinkedModelSerializer):
    # id=serializers.HyperlinkedIdentityField(view_name='categories-detail')
    slug=serializers.ReadOnlyField()
    class Meta:
        model=Categories
        fields=['url','id','name','slug','description','is_active','sort_order','created_at','updated_at']

class BrandsSerializer(serializers.ModelSerializer):
    slug=serializers.ReadOnlyField()
    class Meta:
        model=Brands
        # fields=['id','name','slug','description','is_active','website','country','created_at','updated_at']
        fields="__all__"

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model=ProductImage
        fields="__all__"
    
class ProductFullSerializer(serializers.HyperlinkedModelSerializer):
    category=CategoriesSerializer(read_only=True)
    brand=BrandsSerializer(read_only=True)
    product_image=ProductImageSerializer(many=True,read_only=True)
    owner=serializers.ReadOnlyField(source="owner.email")
    class Meta:
        model=Products
        fields=['id','url','name','slug','description','price','current_price','specs','stock_quantity','is_active','is_featured','category','brand','created_at','updated_at','owner','product_image','sku']

    def create(self, validated_data):
        brands=validated_data.get('brand')
        custom_brand= validated_data['brand'].get('custom_brand')
        if brands.get('brand'):
            brand_data=Brands.objects.get(pk=brands['brand'])
            validated_data['brand']=brand_data
        elif custom_brand and custom_brand.get('name'):
            brand_data=Brands.objects.create(**custom_brand)
            validated_data['brand']=brand_data
        else:
            validated_data.pop('brand')
        product_image=validated_data.pop('product_image',[])
        product=Products.objects.create(**validated_data)
        for item in product_image:
            item['product']=product
            ProductImage.objects.create(**item)
        
        return product

    def update(self,instance,validated_data):
        instance.name=validated_data.get('name',instance.name)
        instance.category=validated_data.get('category',instance.category)
        instance.brand=validated_data.get('brand',instance.brand)
        instance.slug=validated_data.get('slug',instance.slug)
        instance.price=validated_data.get('price',instance.price)
        instance.current_price=validated_data.get('current_price',instance.current_price)
        instance.stock_quantity=validated_data.get('stock_quantity',instance.stock_quantity)
        instance.specs=validated_data.get('specs',instance.specs)
        instance.description=validated_data.get('description',instance.description)
        instance.sku=validated_data.get('sku',instance.sku)
        instance.is_active=validated_data.get('is_active',instance.is_active)
        instance.is_featured=validated_data.get('is_featured',instance.is_featured)

        instance.save()
        return instance

class ProductSerializer(serializers.HyperlinkedModelSerializer):
    product_image=ProductImageSerializer(many=True,read_only=True)
    # auth=serializers.SerializerMethodField()
    class Meta:
        model=Products
        fields=['id','url','name','price','current_price','sku','stock_quantity','product_image']


    # def get_auth(self,obj):
    #     request=self.context.get('request')
    #     return request.user.is_authenticated if request else False


    

class CartItemSerializer(serializers.HyperlinkedModelSerializer):
    cart=serializers.ReadOnlyField(source="cart.owner_type.id")
    product=ProductSerializer(read_only=True)
    price_when_added=serializers.ReadOnlyField()
    quantity=serializers.IntegerField(default=1)
    total=serializers.ReadOnlyField()
    current_price=serializers.ReadOnlyField()

    class Meta:
        model=CartItem
        fields=['id','cart','product','price_when_added','quantity','current_price','total']
        # extra_kwargs={'url':{'view_name':'cart-view','lookup_field':'cart_id'}}

    def update(self, instance, validated_data):
        print(instance)
        print(validated_data)
    
class CartSerializer(serializers.ModelSerializer):
    items=CartItemSerializer(many=True,read_only=True)
    total=serializers.SerializerMethodField()
    total_item=serializers.SerializerMethodField()
    # delivery_fee=serializers.SerializerMethodField()
    class Meta:
        model=Cart
        fields=['id','cart_id','items','total_item','total',]

    def create(self, validated_data):
        request=self.context.get('request')
        if request.user.is_authenticated:
            lookup={'owner_type':request.user}
            validated_data['cart_id']=validated_data.pop('cart_id') or str(uuid4())
        else:
            lookup={'cart_id':validated_data.pop('cart_id') or str(uuid4())}
        carts=validated_data.pop('carts')
        cart_instance,_=Cart.objects.get_or_create(**lookup,defaults=validated_data)
        for item in carts:
            product_instance=Products.objects.get(pk=item.pop('product'))
            try:
                cart=CartItem.objects.get(cart=cart_instance,product=product_instance)
                cart.quantity=item.get('quantity')+1
                cart.save()
            except CartItem.DoesNotExist:
                cart=CartItem.objects.update_or_create(cart=cart_instance,product=product_instance,defaults={"quantity":item.get("quantity"),"price_when_added":product_instance.price,"current_price":product_instance.current_price,"total":product_instance.current_price * item.get("quantity")})
        return cart_instance
    
    def update(self, instance, validated_data):
        method=validated_data['items'].pop('type')
        target=int(validated_data['items'].pop('item_id'))
        item=instance.items.get(id=target)
        print(item)
        if method == 'add' :
            item.quantity +=1
            item.save()
        else:
            item.quantity -=1
            item.save()
        
        return instance
    

    def get_total(self,obj):
        return sum([item.quantity*item.current_price for item in obj.items.all()])
    def get_total_item(self,obj):
        return sum( item.quantity for item in obj.items.all())
    # def get_delivery_fee(self,obj):
    #     return 750 if self.get_total_item(obj) < 2 else 2250
    

class OrderItemSerializer(serializers.ModelSerializer):
    product=ProductSerializer()
    class Meta:
        model=OrderedItem
        fields="__all__"  
    

        
class OrderSerializer(serializers.ModelSerializer):
    order_item=OrderItemSerializer(many=True,read_only=True)
    shipping_address=serializers.CharField(max_length=500)
    phone=serializers.CharField(max_length=15)
    order_status=serializers.ReadOnlyField()
    order_id=serializers.ReadOnlyField()
    total_quantity=serializers.SerializerMethodField()
    delivery_fee=serializers.SerializerMethodField()
    total_amount=serializers.SerializerMethodField()
    created_at=serializers.SerializerMethodField()
    class Meta:
        model=Order
        fields=['id','order_item','shipping_address','phone','total_amount','total_quantity','delivery_fee','order_id','order_status','created_at']

    def create(self, validated_data):
        order_id=validated_data['order_item'][0]['order_id']
        order,create=Order.objects.get_or_create(order_id=order_id,defaults={"total_order":sum(item["total"] for item in validated_data["order_item"]),"total_quantity":sum(item["quantity"] for item in validated_data["order_item"]),"shipping_address":validated_data["shipping_address"],"phone":validated_data["phone"],"user":validated_data['user']})      
        for item in validated_data["order_item"]:
            order_item=OrderedItem.objects.create(order=order,product=item['product'],quantity=item["quantity"],price=item["price"],total=item["total"])
        return order
    
    def get_total_amount(self,obj):
        return sum([item.total for item in obj.order_item.all()])+ self.get_delivery_fee(obj)
    def get_total_quantity(self,obj):
        return sum(item.quantity for item in obj.order_item.all())
    def get_created_at(self,obj):
        return obj.order_date
    def get_delivery_fee(self,obj):
        return 750 if self.get_total_quantity(obj) <= 2 else 2280


class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model=PaymentMethod
        fields="__all__"


# class PaymentSeriliazer(serializers.ModelSerializer):
#     method=serializers.PrimaryKeyRelatedField(queryset=PaymentMethod.objects.all())
#     order=serializers.PrimaryKeyRelatedField(queryset=Order.objects.all())
#     amount=serializers.ReadOnlyField()
#     currency=serializers.ReadOnlyField()
#     status=serializers.ReadOnlyField()
#     paystack_reference=serializers.ReadOnlyField()
#     paystack_response=serializers.ReadOnlyField()

#     class Meta:
#         model=Payment
#         fields=['id','method','order','amount','currency','status','paystack_reference','paystack_response']

    # def create(self, validated_data):
        #