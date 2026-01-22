import { Member, Order, OrderStatus, ShippingAddress } from './types';

export const MOCK_MEMBERS: Member[] = [
  { id: 'm1', name: '田中 太郎', email: 'tanaka@example.com', phone: '090-1111-2222', isActive: true, joinedAt: '2023-01-15' },
  { id: 'm2', name: '佐藤 花子', email: 'sato@example.com', phone: '080-3333-4444', isActive: true, joinedAt: '2023-03-10' },
  { id: 'm3', name: '鈴木 一郎', email: 'suzuki@example.com', isActive: true, joinedAt: '2023-05-20' },
  { id: 'm4', name: '高橋 優子', email: 'takahashi@example.com', phone: '070-5555-6666', isActive: true, joinedAt: '2023-06-01' },
];

export const MOCK_ADDRESSES: ShippingAddress[] = [
  { id: 'a1', memberId: 'm1', label: '自宅', postalCode: '100-0001', address1: '東京都千代田区千代田', address2: '1-1', recipientName: '田中 太郎', isActive: true },
  { id: 'a2', memberId: 'm1', label: '実家', postalCode: '231-0000', address1: '神奈川県横浜市中区', address2: '本町1-1', recipientName: '田中 次郎', isActive: true },
  { id: 'a3', memberId: 'm2', label: '自宅', postalCode: '530-0001', address1: '大阪府大阪市北区', address2: '梅田1-1', recipientName: '佐藤 花子', isActive: true },
  { id: 'a4', memberId: 'm3', label: 'オフィス', postalCode: '810-0001', address1: '福岡県福岡市中央区', address2: '天神1-1', recipientName: '鈴木 一郎', isActive: true },
  { id: 'a5', memberId: 'm4', label: '自宅', postalCode: '060-0000', address1: '北海道札幌市中央区', address2: '北一条西1-1', recipientName: '高橋 優子', isActive: true },
];

export const MOCK_ORDERS: Order[] = [
  { id: 'ORD-001', memberId: 'm1', memberName: '田中 太郎', shippingAddressId: 'a1', shippingAddressLabel: '自宅', status: OrderStatus.COMPLETED, createdAt: '2023-10-01 10:00', totalAmount: 5980 },
  { id: 'ORD-002', memberId: 'm2', memberName: '佐藤 花子', shippingAddressId: 'a3', shippingAddressLabel: '自宅', status: OrderStatus.COMPLETED, createdAt: '2023-10-02 14:30', totalAmount: 12500 },
  { id: 'ORD-003', memberId: 'm1', memberName: '田中 太郎', shippingAddressId: 'a2', shippingAddressLabel: '実家', status: OrderStatus.IN_PROGRESS, createdAt: '2023-10-05 09:15', totalAmount: 3980 },
  { id: 'ORD-004', memberId: 'm3', memberName: '鈴木 一郎', shippingAddressId: 'a4', shippingAddressLabel: 'オフィス', status: OrderStatus.RECEIVED, createdAt: '2023-10-06 11:20', totalAmount: 24000 },
  { id: 'ORD-005', memberId: 'm4', memberName: '高橋 優子', shippingAddressId: 'a5', shippingAddressLabel: '自宅', status: OrderStatus.CANCELLED, createdAt: '2023-10-07 16:45', totalAmount: 5980 },
  { id: 'ORD-006', memberId: 'm2', memberName: '佐藤 花子', shippingAddressId: 'a3', shippingAddressLabel: '自宅', status: OrderStatus.RECEIVED, createdAt: '2023-10-08 08:50', totalAmount: 8900 },
];