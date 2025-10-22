from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.Categories)
admin.site.register(models.Brands)
admin.site.register(models.Products)
admin.site.register(models.ProductImage)
admin.site.register(models.User)
admin.site.register(models.Cart)
admin.site.register(models.CartItem)
admin.site.register(models.PaymentMethod)
admin.site.register(models.EmailVerificationToken)
