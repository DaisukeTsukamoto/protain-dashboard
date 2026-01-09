export enum OrderStatus {
  RECEIVED = '受付',
  IN_PROGRESS = '対応中',
  COMPLETED = '完了',
  CANCELLED = 'キャンセル',
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  joinedAt: string;
}

export interface ShippingAddress {
  id: string;
  memberId: string;
  label: string;
  postalCode: string;
  address1: string; // Prefecture/City
  address2: string; // Street/Building
  recipientName: string;
  phone?: string;
  isActive: boolean;
}

export interface Order {
  id: string;
  memberId: string;
  memberName: string; // Denormalized for display convenience
  shippingAddressId: string;
  shippingAddressLabel: string; // Denormalized
  status: OrderStatus;
  memo?: string;
  createdAt: string;
  totalAmount?: number; // Optional as per MVP but good for UI
}

export interface User {
  id: string;
  email: string;
  name: string;
}