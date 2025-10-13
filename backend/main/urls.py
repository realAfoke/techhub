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
    path('cart/',views.CartView.as_view(),name='cart-view'),
    path('cart/item/<uuid:cart_id>/',views.UpdateEditCartView.as_view(),name='cartitem-detail'),
    path('product/add/',views.ProductView.as_view(),name='product-add'),
    path('product/<int:pk>/',views.ProductView.as_view(),name='products-detail'),
    path('products/',views.ProductView.as_view(),name='products-detail'),
    path('brands/',views.BrandListView.as_view(),name="brand-view"),
    path('checkout/cart/<uuid:cart_id>/',views.CheckOutView.as_view(),name="checkout-view"),
    path('place-order/',views.PlaceOrderView.as_view(),name='place-order-view'),
    path('order-history/',views.OrderHistoryView.as_view(),name='order-view'),
    path('search/',views.SearchView.as_view(),name='searvh-view'),
    path('verify-email/<uuid:token>/',views.EmailVerificationView.as_view(),name='email-verif'),
    path('send-verification/',views.SendVerification.as_view(),name='send-verif'),
    path('categories/<int:pk>/',views.CategoriesDetailView.as_view(),name="categories-detail"),
    path('categories/',views.CategoriesListView.as_view(),name='cat-list'),
    path('search/',views.SearchView.as_view(),name='search-list')
   
]


# myonimesecrethash08145942580afokereality

#  https://16ffc3af4db4.ngrok-free.app/wehook/flutterwave



#  {"cart_id":null,
#     "carts":[{
#     "product":20,
#     "quantity":1
# },
#     {
#     "product":98,
#     "quantity":1
# },
#     {
#     "product":110,
#     "quantity":1
# }]
#     }
    