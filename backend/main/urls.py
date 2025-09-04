from django.urls import path
from . import views

urlpatterns=[
    path('',views.Root.as_view(),name='root-view'),
    path('cart-item/add/',views.CartItemListView.as_view(),name='cart-list'),
    path('cart-item/view/<uuid:id>/',views.ViewCart.as_view(),name="view-cart"),
    path('product/add/',views.ProductsListView.as_view(),name='product-view'),
    path('product/edit/<int:pk>/',views.ProductDetailView.as_view(),name="products-detail"),
    path('brands/add/',views.BrandListView.as_view(),name="brand-view"),
    # path('cart-item/edit/<int:pk>/',views.ItemDetailView.as_view(),name="item-detail"),
   
]