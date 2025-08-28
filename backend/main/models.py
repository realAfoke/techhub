from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin

# Create your models here.
class CustomUserManager(BaseUserManager):
    use_in_migrations=True

    def create(self,email,password=None,**extra_fields):
        if not email:
            raise ValueError('Error:email not found')
        email=self.normalize_email(email)
        user=self.model(email=email,*extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self,email,password=None,**extra_fields):
        extra_fields.setdefault('is_staff',True)
        extra_fields.setdefault('is_active',True)
        extra_fields.setdefault('is_superuser',True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('supperuser must have is_staff = True')
        if extra_fields.get('is_supperuser') is not True:
            raise ValueError('staff must have is_supperuser = True')
        
        return self.create(email,password,extra_fields)
        
        

class User(AbstractBaseUser,PermissionsMixin):
    first_name=models.CharField(max_length=200)
    last_name=models.CharField(max_length=200)
    email=models.EmailField(unique=True)
    phone=models.CharField(max_length=15,unique=True)
    is_verified=models.BooleanField()
    data_joined=models.DateTimeField(auto_now_add=True)
    state=models.CharField(max_length=200)
    city=models.CharField(max_length=200)
    address=models.TextField()
    is_active=models.BooleanField(True)
    is_staff=models.BooleanField(False)

    USERNAME_FIELD='email'
    REQUIRED_FIELDS=[]

    objects=CustomUserManager()
    
    def __str__(self):
        return self.email
    
    class Meta():
        db_table='usermodel'
    
class Categories(models.Model):
    name=models.CharField(max_length=200)
    slug=models.SlugField()
    description=models.TextField()
    is_active=models.BooleanField()
    sort_order=models.IntegerField()
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    class Meta():
        db_table='categories'

    def __str__(self):
        return self.name

class Brands(models.Model):
    name=models.CharField(max_length=200)
    slug=models.SlugField()
    description=models.TextField()
    is_active=models.BooleanField()
    website=models.CharField(max_length=200)
    country=models.CharField(max_length=200)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    class Meta():
        db_table='brand'

    def __str__(self):
        return self.name
    

class Products(models.Model):
    name=models.CharField(max_length=200)
    slug=models.SlugField()
    description=models.TextField()
    price=models.DecimalField(max_digits=10,decimal_places=2)
    sku=models.CharField(max_length=200,unique=True)
    specs=models.JSONField()
    stock_quantity=models.IntegerField()
    is_active=models.BooleanField()
    is_featured=models.BooleanField()
    category=models.ForeignKey(Categories,related_name="product",on_delete=models.PROTECT)
    brand=models.ForeignKey(Brands,related_name="product",on_delete=models.PROTECT)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    class Meta():
        db_table='products'

    def __str__(self):
        return self.name
    

class ProductImage(models.Model):
    image=models.ImageField()
    alt_text=models.CharField(max_length=200)
    is_main_imagge=models.BooleanField()
    sort_order=models.IntegerField()
    created_at=models.DateTimeField(auto_now_add=True)
    product=models.ForeignKey(Products,related_name='product_image',on_delete=models.CASCADE)

    class Meta():
        db_table='productimage'

    def __str__(self):
        return self.product