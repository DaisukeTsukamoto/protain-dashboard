import React, { useState } from 'react';
import { useData } from '../App';
import { MapPin, User, Phone, Plus, Edit2 } from 'lucide-react';

const ShippingList = () => {
  const { addresses, members } = useData();
  const [filterMemberId, setFilterMemberId] = useState<string>('all');

  const filteredAddresses = filterMemberId === 'all' 
    ? addresses 
    : addresses.filter(a => a.memberId === filterMemberId);

  const getMemberName = (id: string) => members.find(m => m.id === id)?.name || '不明';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">配送先管理</h2>
          <p className="text-gray-500 text-sm">会員の配送先情報の確認と編集</p>
        </div>
        <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors">
          <Plus size={16} className="mr-2" />
          新規配送先登録
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center space-x-4">
           <span className="text-sm font-medium text-gray-700">会員絞り込み:</span>
           <select 
              className="bg-white border border-gray-300 rounded-md text-sm py-1 px-2 text-gray-900 focus:ring-orange-500 focus:border-orange-500"
              value={filterMemberId}
              onChange={(e) => setFilterMemberId(e.target.value)}
           >
             <option value="all">全て表示</option>
             {members.map(m => (
               <option key={m.id} value={m.id}>{m.name}</option>
             ))}
           </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
          {filteredAddresses.map((addr) => (
            <div key={addr.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white relative">
              <div className="absolute top-4 right-4 text-gray-400 cursor-pointer hover:text-orange-600">
                <Edit2 size={16} />
              </div>
              
              <div className="flex items-center space-x-2 mb-3">
                <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-0.5 rounded">
                  {addr.label}
                </span>
                <span className="text-xs text-gray-500">
                   (会員: {getMemberName(addr.memberId)})
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start">
                   <User size={14} className="mt-1 mr-2 text-gray-400" />
                   <span className="font-medium text-gray-900">{addr.recipientName} 様</span>
                </div>
                <div className="flex items-start">
                   <MapPin size={14} className="mt-1 mr-2 text-gray-400" />
                   <div>
                     <p>〒{addr.postalCode}</p>
                     <p>{addr.address1}</p>
                     <p>{addr.address2}</p>
                   </div>
                </div>
                {addr.phone && (
                  <div className="flex items-center">
                    <Phone size={14} className="mr-2 text-gray-400" />
                    <span>{addr.phone}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {filteredAddresses.length === 0 && (
            <div className="col-span-full py-10 text-center text-gray-500">
              該当する配送先は見つかりませんでした
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShippingList;