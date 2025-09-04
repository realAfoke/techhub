from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.Categories)
admin.site.register(models.Brands)
admin.site.register(models.Products)
admin.site.register(models.User)
