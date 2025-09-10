from rest_framework import serializers
from django.contrib.auth import get_user_model
from . models import Categories,Brands,ProductImage,Products,CartItem,Cart,Order,OrderedItem
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from uuid import uuid4
from datetime import datetime
import re

User=get_user_model()

class SignUpSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True)
    class Meta:
        model=User
        fields=['first_name','last_name','email', 'phone','password']

    def create(self, validated_data):
        user=User.objects.create_user(**validated_data)

        return user   

class CategoriesSerializer(serializers.HyperlinkedModelSerializer):
    id=serializers.HyperlinkedIdentityField(view_name='cat-detail')
    slug=serializers.ReadOnlyField()
    class Meta:
        model=Categories
        fields=['id','name','slug','description','is_active','sort_order','created_at','updated_at']

class BrandsSerializer(serializers.ModelSerializer):
    slug=serializers.ReadOnlyField()
    class Meta:
        model=Brands
        # fields=['id','name','slug','description','is_active','website','country','created_at','updated_at']
        fields="__all__"

class ProductSerializer(serializers.HyperlinkedModelSerializer):
    category=serializers.PrimaryKeyRelatedField(queryset=Categories.objects.all())
    brand=serializers.PrimaryKeyRelatedField(queryset=Brands.objects.all())
    slug=serializers.ReadOnlyField()
    owner=serializers.ReadOnlyField(source="owner.email")
    # id=serializers.HyperlinkedIdentityField(view_name="products-detail")
    class Meta:
        model=Products
        fields=['url','id','name','slug','description','price','current_price','specs','stock_quantity','is_active','is_featured','category','brand','created_at','updated_at','owner']
        # fields="__all__"

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


class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        try:
            user=User.objects.get(email=attrs['email'])
        except User.DoesNotExist:
            raise serializers.ValidationError('invalid input try again')
        if not user.check_password(attrs['password']):
            raise serializers.ValidationError('invalid input pls try agian')
        tokens=self.get_token(user)
        return{'refresh':str(tokens),'access':str(tokens.access_token)}

class CartItemSerializer(serializers.HyperlinkedModelSerializer):
    cart=serializers.ReadOnlyField(source="cart.cart_id")
    product=serializers.PrimaryKeyRelatedField(queryset=Products.objects.all())
    price_when_added=serializers.ReadOnlyField()
    quantity=serializers.IntegerField(default=1)
    total=serializers.ReadOnlyField()
    current_price=serializers.ReadOnlyField()

    class Meta:
        model=CartItem
        fields=['id','url','cart','product','price_when_added','quantity','current_price','total']

    def create(self, validated_data):
        if validated_data['cart_id']:
            instance=Cart.objects.get(cart_id=validated_data['cart_id'])
            if instance.owner_type == 'AnonymousUser' and validated_data['owner_type'] != 'AnonymousUser':
                instance.owner_type=validated_data['owner_type']
                instance.save()
        else:
            del validated_data['cart_id']
        cart,create=Cart.objects.get_or_create(cart_id=validated_data.get("cart_id",str(uuid4())),defaults={"owner_type":validated_data["owner_type"],"expiry":validated_data["expiry"]})
        cart_item,create=CartItem.objects.update_or_create(cart=cart,product=validated_data['product'],defaults={"product":validated_data['product'],"quantity":validated_data["quantity"],'price_when_added':validated_data['product'].price},current_price=validated_data['product'].current_price,total=validated_data['product'].current_price*validated_data['quantity'])

        return cart_item
    def update(self, instance, validated_data):
        instance.quantity=validated_data.get('quantity',instance.quantity)
        instance.save()
        return instance
    
class CartSerializer(serializers.ModelSerializer):
    items=CartItemSerializer(many=True,read_only=True)
    total=serializers.SerializerMethodField()
    total_item=serializers.SerializerMethodField()
    delivery_fee=serializers.SerializerMethodField()
    class Meta:
        model=Cart
        fields=['id','cart_id','items','total_item','total','delivery_fee']

    def get_total(self,obj):
        return sum([item.total for item in obj.items.all()])
    def get_total_item(self,obj):
        return sum( item.quantity for item in obj.items.all())
    def get_delivery_fee(self,obj):
        return 750 if self.get_total_item(obj) < 2 else 2250
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
        print(validated_data)
        order_id=str(datetime.now()) + str(uuid4())
        real_id=re.sub(r"[^a-zA-Z0-9]","",order_id)
        order,create=Order.objects.get_or_create(order_id=validated_data.get('order_id',real_id),defaults={"total_order":sum(item["total"] for item in validated_data["order_item"]),"total_quantity":sum(item["quantity"] for item in validated_data["order_item"]),"shipping_address":validated_data["shipping_address"],"phone":validated_data["phone"],"user":validated_data['user']})      
        for item in validated_data["order_item"]:
            order_item=OrderedItem.objects.create(order=order,product=item['product'],quantity=item["quantity"],price=item["price"],total=item["total"])

        return order
    
    def get_total_amount(self,obj):
        return sum([item.total for item in obj.order_item.all()])
    def get_total_quantity(self,obj):
        return sum([item.quantity for item in obj.order_item.all()])
    def get_created_at(self,obj):
        return obj.order_date
    def get_delivery_fee(self,obj):
        return 750 if self.get_total_quantity(obj) < 1 else 2280