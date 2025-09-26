from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns=[
    path('',views.Root.as_view(),name='root-view'),
    path('sign-up/',views.SignUpView.as_view(),name='signup-view'),
    path("login/",views.LoginView.as_view(),name="login-view"),
    path("password-reset/",views.PasswordResetView.as_view(),name='reset-view'),
    path('reset-password/<uuid:token>/',views.PasswordResetConfirmView.as_view(),name='confrim-view'),
    path("api/auth/refresh/",TokenRefreshView.as_view(),name="token-refresh-view"),
    path('cart-item/add/',views.CartItemListView.as_view(),name='cart-list'),
    path('cart-item/view/<uuid:cart_id>/',views.ViewCart.as_view(),name="view-cart"),
    path('cart-item/edit/<int:pk>/',views.ItemDetailView.as_view(),name='cartitem-detail'),
    path('product/add/',views.ProductsListView.as_view(),name='product-view'),
    path('product/edit/<int:pk>/',views.ProductDetailView.as_view(),name="products-detail"),
    path('brands/add/',views.BrandListView.as_view(),name="brand-view"),
    path('checkout/cart/<uuid:cart_id>/',views.CheckOutView.as_view(),name="checkout-view"),
    path('place-order/',views.PlaceOrderView.as_view(),name='place-order-view'),
    path('order-history/',views.OrderHistoryView.as_view(),name='order-view'),
    path('search/',views.SearchView.as_view(),name='searvh-view'),
    path('verify-email/<uuid:token>/',views.EmailVerificationView.as_view(),name='email-verif'),
    path('send-verification/',views.SendVerification.as_view(),name='send-verif'),
    # path('payment',views.)
   
]


# myonimesecrethash08145942580afokereality

#  https://16ffc3af4db4.ngrok-free.app/wehook/flutterwave