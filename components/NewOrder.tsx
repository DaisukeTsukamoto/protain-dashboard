import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../App';
import { OrderStatus, ShippingAddress } from '../types';
import { Save, X } from 'lucide-react';

const NewOrder = () => {
  const navigate = useNavigate();
  const { members, addresses, addOrder } = useData();

  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.RECEIVED);
  const [memo, setMemo] = useState<string>('');
  
  const [availableAddresses, setAvailableAddresses] = useState<ShippingAddress[]>([]);

  // Filter addresses when member changes
  useEffect(() => {
    if (selectedMemberId) {
      const filtered = addresses.filter(addr => addr.memberId === selectedMemberId);
      setAvailableAddresses(filtered);
      // Reset address selection if the current one doesn't belong to the new member
      if (filtered.length > 0) {
        setSelectedAddressId(filtered[0].id);
      } else {
        setSelectedAddressId('');
      }
    } else {
      setAvailableAddresses([]);
      setSelectedAddressId('');
    }
  }, [selectedMemberId, addresses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMemberId || !selectedAddressId) {
      alert('会員と配送先を選択してください');
      return;
    }

    const member = members.find(m => m.id === selectedMemberId);
    const address = addresses.find(a => a.id === selectedAddressId);

    if (!member || !address) return;

    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      memberId: member.id,
      memberName: member.name,
      shippingAddressId: address.id,
      shippingAddressLabel: address.label,
      status: status,
      memo: memo,
      createdAt: new Date().toLocaleString('ja-JP', { 
        year: 'numeric', month: '2-digit', day: '2-digit', 
        hour: '2-digit', minute: '2-digit' 
      }),
      totalAmount: Math.floor(Math.random() * 20000) + 3000 // Mock amount
    };

    addOrder(newOrder);
    navigate('/orders');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">新規注文登録</h2>
        <p className="text-gray-500 text-sm">新しい注文情報をシステムに登録します</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        {/* Member Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            会員 <span className="text-red-500">*</span>
          </label>
          <select
            required
            className="w-full bg-white border border-gray-300 rounded-lg shadow-sm py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
          >
            <option value="">会員を選択してください</option>
            {members.map(member => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.email})
              </option>
            ))}
          </select>
        </div>

        {/* Address Selection (Dependent) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            配送先 <span className="text-red-500">*</span>
          </label>
          <select
            required
            disabled={!selectedMemberId}
            className="w-full bg-white border border-gray-300 rounded-lg shadow-sm py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:text-gray-400"
            value={selectedAddressId}
            onChange={(e) => setSelectedAddressId(e.target.value)}
          >
            {availableAddresses.length === 0 ? (
               <option value="">
                 {selectedMemberId ? '登録された配送先がありません' : '先に会員を選択してください'}
               </option>
            ) : (
              availableAddresses.map(addr => (
                <option key={addr.id} value={addr.id}>
                  {addr.label} - {addr.address1}{addr.address2}
                </option>
              ))
            )}
          </select>
          {selectedMemberId && availableAddresses.length === 0 && (
             <p className="mt-1 text-xs text-red-500">この会員には配送先が登録されていません。配送先管理画面で登録してください。</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ステータス <span className="text-red-500">*</span>
          </label>
          <select
            required
            className="w-full bg-white border border-gray-300 rounded-lg shadow-sm py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
          >
            {Object.values(OrderStatus).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Memo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            メモ (任意)
          </label>
          <textarea
            rows={4}
            className="w-full bg-white border border-gray-300 rounded-lg shadow-sm py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            placeholder="特記事項があれば入力してください"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <X size={16} className="mr-2" />
            キャンセル
          </button>
          <button
            type="submit"
            className="flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <Save size={16} className="mr-2" />
            注文を作成
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewOrder;