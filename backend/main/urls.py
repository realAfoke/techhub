from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse

urlpatterns=[
    path('',views.Root.as_view(),name='root-view'),
    path('sign-up/',views.SignUpView.as_view(),name='signup-view'),
    path('me/',views.CurrentUserView.as_view(),name='user-view'),
    path('check-user/',views.CheckUser.as_view(),name='checkemail_view'),
    path("login/",views.LoginView.as_view(),name="login-view"),
    path('logout/',views.LogOutView.as_view(),name='logout-view'),
    path("refresh-token/",views.CustomRefreshTokenView.as_view(),name="refresh-view"),
    # path('token-refresh/',TokenRefreshView,as_view(),name='refresh-view')
    path("password-reset/",views.PasswordResetView.as_view(),name='reset-view'),
    path('reset-password/<uuid:token>/',views.PasswordResetConfirmView.as_view(),name='confrim-view'),
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
    path('request-verification/',views.SendVerification.as_view(),name='send-verif'),
    path('categories/<int:pk>/',views.CategoriesDetailView.as_view(),name="categories-detail"),
    path('categories/',views.CategoriesListView.as_view(),name='cat-list'),
    path('search/',views.SearchView.as_view(),name='search-list'),
    path('payment-method/',views.PaymentMethodView.as_view(),name='paymentmethod-view'),
    path('payment-initialiser/',views.payment_initialiser,name='paymentinitialiser-view'),
    path('api/flutterwave/webhook/',views.payment_verification,name='flutterwave_webhook')
]


# if settings.DEBUG:
#     urlpatterns+=static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
