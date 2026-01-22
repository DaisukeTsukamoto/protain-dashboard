from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import CreateView, ListView, TemplateView, UpdateView

from .forms import MemberForm, OrderForm, ShippingAddressForm
from .models import Member, Order, ShippingAddress


class HomeView(LoginRequiredMixin, TemplateView):
    template_name = 'dashboard/home.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['member_count'] = Member.objects.filter(is_active=True).count()
        context['shipping_count'] = ShippingAddress.objects.filter(is_active=True).count()
        context['order_count'] = Order.objects.count()
        context['recent_orders'] = Order.objects.select_related('member', 'shipping_address').order_by('-created_at')[:5]
        return context


class OrderCreateView(LoginRequiredMixin, CreateView):
    model = Order
    form_class = OrderForm
    template_name = 'dashboard/order_form.html'
    success_url = reverse_lazy('order-list')


class OrderListView(LoginRequiredMixin, ListView):
    model = Order
    template_name = 'dashboard/order_list.html'
    context_object_name = 'orders'

    def get_queryset(self):
        return Order.objects.select_related('member', 'shipping_address').order_by('-created_at')


class MemberListView(LoginRequiredMixin, ListView):
    model = Member
    template_name = 'dashboard/member_list.html'
    context_object_name = 'members'

    def get_queryset(self):
        return Member.objects.order_by('name')


class MemberCreateView(LoginRequiredMixin, CreateView):
    model = Member
    form_class = MemberForm
    template_name = 'dashboard/member_form.html'
    success_url = reverse_lazy('member-list')


class MemberUpdateView(LoginRequiredMixin, UpdateView):
    model = Member
    form_class = MemberForm
    template_name = 'dashboard/member_form.html'
    success_url = reverse_lazy('member-list')


class ShippingAddressListView(LoginRequiredMixin, ListView):
    model = ShippingAddress
    template_name = 'dashboard/shipping_list.html'
    context_object_name = 'addresses'

    def get_queryset(self):
        return ShippingAddress.objects.select_related('member').order_by('label')


class ShippingAddressCreateView(LoginRequiredMixin, CreateView):
    model = ShippingAddress
    form_class = ShippingAddressForm
    template_name = 'dashboard/shipping_form.html'
    success_url = reverse_lazy('shipping-list')


class ShippingAddressUpdateView(LoginRequiredMixin, UpdateView):
    model = ShippingAddress
    form_class = ShippingAddressForm
    template_name = 'dashboard/shipping_form.html'
    success_url = reverse_lazy('shipping-list')
