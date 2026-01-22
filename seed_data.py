import os
import django
import random

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'protain_dashboard.settings')
django.setup()

from dashboard.models import Member, ShippingAddress

def run():
    print('Creating dummy data...')

    # create members
    members_data = [
        {'name': '山田 太郎', 'email': 'taro@example.com', 'phone': '090-1111-2222'},
        {'name': '鈴木 次郎', 'email': 'jiro@example.com', 'phone': '090-3333-4444'},
        {'name': '佐藤 在庫', 'email': 'hanako@example.com', 'phone': '080-5555-6666'},
    ]

    members = []
    for data in members_data:
        member, created = Member.objects.get_or_create(
            email=data['email'],
            defaults={
                'name': data['name'],
                'phone': data['phone']
            }
        )
        if created:
            print(f'Created member: {member.name}')
        else:
            print(f'Member already exists: {member.name}')
        members.append(member)

    # create shipping addresses
    addresses_data = [
        {
            'label': '自宅',
            'postal_code': '100-0001',
            'address1': '東京都千代田区',
            'address2': '千代田1-1',
            'recipient_name': '山田 太郎',
            'phone': '090-1111-2222'
        },
        {
            'label': '実家',
            'postal_code': '200-0002',
            'address1': '神奈川県横浜市',
            'address2': '西区1-2-3',
            'recipient_name': '山田 父',
            'phone': '045-111-2222'
        },
        {
            'label': 'オフィス',
            'postal_code': '150-0043',
            'address1': '東京都渋谷区',
            'address2': '道玄坂1-1-1',
            'recipient_name': '鈴木 次郎',
            'phone': '090-3333-4444'
        }
    ]

    # Assign addresses to members randomly or specifically
    # Yamada gets Home and Parents
    if len(members) >= 1:
        yamada = members[0]
        ShippingAddress.objects.get_or_create(
            member=yamada,
            label='自宅',
            defaults=addresses_data[0]
        )
        ShippingAddress.objects.get_or_create(
            member=yamada,
            label='実家',
            defaults=addresses_data[1]
        )
        print(f'Added addresses for {yamada.name}')

    # Suzuki gets Office
    if len(members) >= 2:
        suzuki = members[1]
        ShippingAddress.objects.get_or_create(
            member=suzuki,
            label='オフィス',
            defaults=addresses_data[2]
        )
        print(f'Added address for {suzuki.name}')

    print('Dummy data creation complete.')

if __name__ == '__main__':
    run()
