import re

from django import forms
from django.contrib.auth.forms import AuthenticationForm

from .models import Member, Order, ShippingAddress


def normalize_postal_code(value: str) -> str:
    digits = re.sub(r'\D', '', value or '')
    if len(digits) == 7:
        return f'{digits[:3]}-{digits[3:]}'
    return value


def normalize_phone(value: str) -> str:
    digits = re.sub(r'\D', '', value or '')
    if len(digits) == 11:
        return f'{digits[:3]}-{digits[3:7]}-{digits[7:]}'
    if len(digits) == 10:
        return f'{digits[:3]}-{digits[3:6]}-{digits[6:]}'
    return value


class EmailAuthenticationForm(AuthenticationForm):
    username = forms.CharField(
        label='Email or Username',
        widget=forms.TextInput(attrs={'autocomplete': 'username'}),
    )


class MemberForm(forms.ModelForm):
    class Meta:
        model = Member
        fields = ['name', 'email', 'phone', 'is_active']

    def clean_phone(self):
        phone = self.cleaned_data.get('phone', '')
        return normalize_phone(phone) if phone else phone


class ShippingAddressForm(forms.ModelForm):
    class Meta:
        model = ShippingAddress
        fields = [
            'member',
            'label',
            'postal_code',
            'address1',
            'address2',
            'recipient_name',
            'phone',
            'is_active',
        ]

    def clean_postal_code(self):
        postal_code = self.cleaned_data.get('postal_code', '')
        return normalize_postal_code(postal_code)

    def clean_phone(self):
        phone = self.cleaned_data.get('phone', '')
        return normalize_phone(phone) if phone else phone


class OrderForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ['member', 'shipping_address', 'status', 'memo']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['member'].queryset = Member.objects.filter(is_active=True)
        self.fields['shipping_address'].queryset = ShippingAddress.objects.filter(is_active=True)
