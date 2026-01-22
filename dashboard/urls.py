from django.contrib.auth import views as auth_views
from django.urls import path

from .forms import EmailAuthenticationForm
from . import views

urlpatterns = [
    path('login/', auth_views.LoginView.as_view(
        template_name='registration/login.html',
        authentication_form=EmailAuthenticationForm,
    ), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('', views.HomeView.as_view(), name='home'),
    path('orders/new/', views.OrderCreateView.as_view(), name='order-create'),
    path('orders/', views.OrderListView.as_view(), name='order-list'),
    path('members/new/', views.MemberCreateView.as_view(), name='member-create'),
    path('members/', views.MemberListView.as_view(), name='member-list'),
    path('members/<int:pk>/edit/', views.MemberUpdateView.as_view(), name='member-edit'),
    path('shipping/new/', views.ShippingAddressCreateView.as_view(), name='shipping-create'),
    path('shipping/', views.ShippingAddressListView.as_view(), name='shipping-list'),
    path('shipping/<int:pk>/edit/', views.ShippingAddressUpdateView.as_view(), name='shipping-edit'),
]
