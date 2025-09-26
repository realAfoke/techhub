from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin
from django.utils.text import slugify
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from uuid import uuid4


# Create your models here.
class CustomUserManager(BaseUserManager):
    use_in_migrations=True

    def create_user(self,email,password=None,**extra_fields):
        if not email:
            raise ValueError('Error:email not found')
        email=self.normalize_email(email)
        user=self.model(email=email,**extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self,email,password=None,**extra_fields):
        extra_fields.setdefault('is_staff',True)
        extra_fields.setdefault('is_active',True)
        extra_fields.setdefault('is_superuser',True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('supperuser must have is_staff = True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('staff must have is_supperuser = True')
        
        return self.create_user(email,password,**extra_fields)
    

        
        

class User(AbstractBaseUser,PermissionsMixin):
    first_name=models.CharField(max_length=200)
    # username=models.CharField(max_length=200,unique=True)
    last_name=models.CharField(max_length=200)
    email=models.EmailField(unique=True)
    phone=models.CharField(max_length=15)
    is_verified=models.BooleanField(null=True,blank=False,default=False)
    data_joined=models.DateTimeField(auto_now_add=True)
    state=models.CharField(max_length=200)
    city=models.CharField(max_length=200)
    address=models.TextField()
    is_active=models.BooleanField(default=True)
    is_staff=models.BooleanField(default=False)

    USERNAME_FIELD='email'
    REQUIRED_FIELDS=[]

    objects=CustomUserManager()
    
    def __str__(self):
        return self.email
    
    class Meta():
        db_table='usermodel'

    def send_verification_email(self):
        EmailVerificationToken.objects.filter(created__lt=timezone.now()-timedelta(hours=24),is_used=False).delete()
        token=EmailVerificationToken.objects.create(user=self)
        verification_url=f"http://127.0.0.1:8000/verify-email/{token.token}/"
        send_mail(
        subject='Verify your TechHub account',
        message=f'Click this link to verify: {verification_url}',
        # from_email=settings.DEFAULT_FROM_EMAIL,
        from_email='noreply@techhub.com',
        recipient_list=[self.email],
        fail_silently=False,
    )
        
    def send_password_reset_email(self):
        PasswordResetToken.objects.filter(
            created__lt=timezone.now() - timedelta(hours=24),
            is_used=False
        ).delete()
        
        token = PasswordResetToken.objects.create(user=self)
        
        reset_url = f"http://localhost:8000/reset-password/{token.token}/"
        
        send_mail(
            subject='Reset your TechHub password',
            message=f'Click this link to reset your password: {reset_url}',
            from_email='noreply@techhub.com',
            recipient_list=[self.email],
            fail_silently=False,
        )



    
class Categories(models.Model):
    name=models.CharField(max_length=200)
    slug=models.SlugField()
    description=models.TextField()
    is_active=models.BooleanField(default=True)
    sort_order=models.IntegerField()
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    class Meta():
        db_table='categories'

    def save(self,*args,**kwargs):
        if not self.slug:
            self.slug=slugify(self.name)
        return super().save(*args,**kwargs)

    def __str__(self):
        return self.name

class Brands(models.Model):
    name=models.CharField(max_length=200)
    slug=models.SlugField()
    description=models.TextField()
    is_active=models.BooleanField(default=True)
    website=models.CharField(max_length=200,null=True)
    country=models.CharField(max_length=200)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    class Meta():
        db_table='brand'

    def save(self,*args,**kwargs):
        if not self.slug:
            self.slug=slugify(self.name)
        return super().save(*args,**kwargs)
    
    def __str__(self):
        return self.name
    

class Products(models.Model):
    name=models.CharField(max_length=200)
    slug=models.SlugField()
    description=models.TextField()
    price=models.DecimalField(max_digits=10,decimal_places=2)
    current_price=models.DecimalField(max_digits=10,decimal_places=2)
    sku=models.CharField(max_length=200)
    specs=models.JSONField()
    stock_quantity=models.IntegerField()
    is_active=models.BooleanField(default=True)
    is_featured=models.BooleanField()
    category=models.ForeignKey(Categories,related_name="product",on_delete=models.PROTECT)
    brand=models.ForeignKey(Brands,related_name="product",on_delete=models.PROTECT)
    owner=models.ForeignKey(User,related_name="product_item",on_delete=models.CASCADE,default=1)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    class Meta():
        db_table='products'

    def save(self,*args,**kwargs):
        if not (self.slug or self.current_price):
            self.slug=slugify(self.name)
            self.current_price=self.price
        return super().save(*args,**kwargs)

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
    

class Cart(models.Model):
    owner_type=models.CharField(max_length=255,null=True,blank=True)
    cart_id=models.UUIDField(null=True,blank=True)
    expiry=models.DurationField(null=True,blank=True)
    created_at=models.DateTimeField(auto_now_add=True,null=True,blank=True)

    class Meta():
        db_table='cart'

    def is_anonymous(self):
        return self.owner_type== 'AnonymousUser'
    
    def is_authenicated(self,user):
        return self.owner_type== str(user)

class CartItem(models.Model):
   cart=models.ForeignKey(Cart,related_name="items",on_delete=models.CASCADE,null=True,blank=True)
   product=models.ForeignKey(Products,on_delete=models.CASCADE,null=True,blank=True)
   quantity=models.IntegerField(default=1)
   price_when_added=models.DecimalField(max_digits=10,decimal_places=2,null=True,blank=True)
   current_price=models.DecimalField(max_digits=10,decimal_places=2,null=True,blank=True)
   total=models.IntegerField(null=True)

   class Meta:
       db_table="cartitem"
    
   def __str__(self):
        return self.product.name
   

class Order(models.Model):
    user=models.ForeignKey(User,related_name='order',on_delete=models.CASCADE)
    total_order=models.DecimalField(decimal_places=2,max_digits=10)
    total_quantity=models.IntegerField(null=True)
    shipping_address=models.TextField()
    phone=models.CharField(max_length=15,null=True)
    order_status=models.CharField(max_length=200,default='pending')
    order_date=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    order_id=models.CharField(max_length=200)

    class Meta:
        db_table='order'

    def __str__(self):
        return self.user.email
    
    def send_pending_mail(self):
        formatted=self.updated_at.strftime("%b %d %Y")
        print(formatted)
        Subject=f" Order Confirmation - Order {self.order_id}"

        body=f"""

        Hello {self.user.first_name} {self.user.last_name}

        Order Number:{self.order_id}
        # Order Date:{formatted}
        Status: {self.order_status}

        Shipping Address:{self.shipping_address}
        

        Total: ${self.total_order}

        We’ll notify you when your order ships.
        If you have questions, contact us at support@myshop.com.

        Thank you for shopping with us!
        """
        send_mail(Subject,body,'no-reply@myshop.com',[self.user.email],fail_silently=False)
    

class OrderedItem(models.Model):
    order=models.ForeignKey(Order,related_name='order_item',on_delete=models.CASCADE)
    product=models.ForeignKey(Products,related_name='order_product',on_delete=models.PROTECT)
    quantity=models.IntegerField()
    price=models.DecimalField(max_digits=10,decimal_places=2,null=True)
    total=models.DecimalField(max_digits=10,decimal_places=2,null=True)

    class Meta:
        db_table='ordereditem'

    # def send_pending_mail(self):




class PaymentMethod(models.Model):
    name=models.CharField(max_length=200)
    code=models.CharField(max_length=100)
    is_active=models.BooleanField(default=True)
    fees=models.DecimalField(max_digits=10,decimal_places=2)
    description=models.TextField()
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    class Meta:
        db_table='payment_method'

    def __str__(self):
        return self.code


class SavedCard(models.Model):
    user=models.ForeignKey(User,related_name='card',on_delete=models.CASCADE)
    payment_method=models.ForeignKey(PaymentMethod,related_name='save_card',on_delete=models.CASCADE)
    masked_card_number=models.CharField(max_length=200)
    expiry_month=models.IntegerField()
    expiry_year=models.IntegerField()
    paystack_token=models.CharField(max_length=200)
    is_default=models.BooleanField()
    is_active=models.BooleanField()
    nickname=models.CharField(max_length=200)
    created_at=models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table='save_card'

    def __str__(self):
        return self.payment_method
    

class Payment(models.Model):
    method=models.ForeignKey(PaymentMethod,related_name='payment',on_delete=models.PROTECT)
    saved_card=models.ForeignKey(SavedCard,related_name='payment',null=True,blank=True,on_delete=models.SET_NULL)
    order=models.ForeignKey(Order,related_name='payment',on_delete=models.CASCADE)
    amount=models.DecimalField(max_digits=10,decimal_places=2)
    currency=models.CharField(max_length=200)
    status=models.CharField(max_length=200)
    paystack_reference=models.CharField(max_length=300)
    paystack_response=models.JSONField()
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    class Meta:
        db_table='payment'

    def __str__(self):
        return self.method


class EmailVerificationToken(models.Model):
    user=models.ForeignKey(User,related_name='email_verif',on_delete=models.CASCADE)
    token=models.UUIDField(default=uuid4)
    created=models.DateTimeField(auto_now_add=True)
    is_used=models.BooleanField(default=False)

class PasswordResetToken(models.Model):
    user=models.ForeignKey(User,related_name='password_token',on_delete=models.CASCADE)
    token=models.UUIDField(default=uuid4)
    created=models.DateTimeField(auto_now_add=True)
    is_used=models.BooleanField(default=False)