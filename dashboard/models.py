from django.db import models


class Member(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name


class ShippingAddress(models.Model):
    member = models.ForeignKey(Member, on_delete=models.PROTECT, related_name='shipping_addresses')
    label = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=8)
    address1 = models.CharField(max_length=255)
    address2 = models.CharField(max_length=255)
    recipient_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f'{self.label} ({self.recipient_name})'


class Order(models.Model):
    STATUS_RECEIVED = '受付'
    STATUS_IN_PROGRESS = '対応中'
    STATUS_COMPLETED = '完了'
    STATUS_CANCELED = 'キャンセル'

    STATUS_CHOICES = [
        (STATUS_RECEIVED, STATUS_RECEIVED),
        (STATUS_IN_PROGRESS, STATUS_IN_PROGRESS),
        (STATUS_COMPLETED, STATUS_COMPLETED),
        (STATUS_CANCELED, STATUS_CANCELED),
    ]

    member = models.ForeignKey(Member, on_delete=models.PROTECT)
    shipping_address = models.ForeignKey(ShippingAddress, on_delete=models.PROTECT)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_RECEIVED)
    memo = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f'Order {self.pk}'
