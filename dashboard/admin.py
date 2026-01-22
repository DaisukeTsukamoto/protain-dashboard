from django.contrib import admin

from .models import Member, Order, ShippingAddress


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'is_active', 'created_at')
    search_fields = ('name', 'email')
    list_filter = ('is_active',)


@admin.register(ShippingAddress)
class ShippingAddressAdmin(admin.ModelAdmin):
    list_display = ('label', 'member', 'postal_code', 'recipient_name', 'is_active', 'created_at')
    search_fields = ('label', 'recipient_name', 'postal_code')
    list_filter = ('is_active',)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'member', 'shipping_address', 'status', 'created_at')
    list_filter = ('status',)
