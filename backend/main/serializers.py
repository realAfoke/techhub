from rest_framework import serializers
from django.contrib.auth import get_user_model
from . models import Categories,Brands,ProductImage,Products,CartItem,Cart
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from uuid import uuid4

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
        fields=['url','id','name','slug','description','price','specs','stock_quantity','is_active','is_featured','category','brand','created_at','updated_at','owner']
        # fields="__all__"


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

class CartSerializer(serializers.ModelSerializer):
    items=ProductSerializer()
    class Meta:
        model=Cart
        fields=['id','owner_status','product','cart_id']

class CartItemSerializer(serializers.ModelSerializer):
    cart=serializers.ReadOnlyField(source="cart.cart_id")
    product=serializers.PrimaryKeyRelatedField(queryset=Products.objects.all())
    price_when_added=serializers.ReadOnlyField()
    quantity=serializers.IntegerField(default=1)
    # total=

    class Meta:
        model=CartItem
        fields=['id','cart','product','price_when_added','quantity']

    def create(self, validated_data):
        print(validated_data,'>>>>>>>>>')
        if not validated_data['cart_id']:
            del validated_data['cart_id']
        cart,create=Cart.objects.get_or_create(cart_id=validated_data.get("cart_id",str(uuid4())),defaults={"owner_type":validated_data["owner_type"],"expiry":validated_data["expiry"]})
        cart_item,create=CartItem.objects.update_or_create(cart=cart,product=validated_data['product'],defaults={"product":validated_data['product'],"quantity":validated_data["quantity"],'price_when_added':validated_data['product'].price})

        return cart_item

class UserCartItemSerializer(serializers.ModelSerializer):
    product=ProductSerializer()
    class Meta:
        model=CartItem
        fields="__all__"