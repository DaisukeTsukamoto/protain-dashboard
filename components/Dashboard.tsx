import React from 'react';
import { useData } from '../App';
import { OrderStatus } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { ShoppingBag, Users, AlertCircle, CheckCircle } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      {subtext && <p className="text-xs text-gray-400 mt-2">{subtext}</p>}
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="text-white" size={24} />
    </div>
  </div>
);

const Dashboard = () => {
  const { orders, members } = useData();

  // Calculate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === OrderStatus.RECEIVED || o.status === OrderStatus.IN_PROGRESS).length;
  const completedOrders = orders.filter(o => o.status === OrderStatus.COMPLETED).length;
  const totalMembers = members.length;

  // Chart Data Preparation - Energy colors
  const statusData = [
    { name: '受付', value: orders.filter(o => o.status === OrderStatus.RECEIVED).length, color: '#F97316' }, // Orange-500
    { name: '対応中', value: orders.filter(o => o.status === OrderStatus.IN_PROGRESS).length, color: '#EAB308' }, // Yellow-500
    { name: '完了', value: orders.filter(o => o.status === OrderStatus.COMPLETED).length, color: '#22C55E' }, // Green-500
    { name: 'キャンセル', value: orders.filter(o => o.status === OrderStatus.CANCELLED).length, color: '#9CA3AF' }, // Gray-400
  ];

  // Mock data for sales trend (just visualization)
  const salesData = [
    { name: '10/01', count: 12 },
    { name: '10/02', count: 19 },
    { name: '10/03', count: 8 },
    { name: '10/04', count: 24 },
    { name: '10/05', count: 15 },
    { name: '10/06', count: 18 },
    { name: '10/07', count: 22 },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">ホーム</h2>
        <p className="text-gray-500">システム概要と最新の状況</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="総注文数" 
          value={totalOrders} 
          icon={ShoppingBag} 
          color="bg-orange-600" 
          subtext="今月の累計"
        />
        <StatCard 
          title="未対応・対応中" 
          value={pendingOrders} 
          icon={AlertCircle} 
          color="bg-yellow-500" 
          subtext="アクションが必要です"
        />
        <StatCard 
          title="完了済み" 
          value={completedOrders} 
          icon={CheckCircle} 
          color="bg-green-600" 
          subtext="正常に出荷されました"
        />
        <StatCard 
          title="会員数" 
          value={totalMembers} 
          icon={Users} 
          color="bg-slate-700" 
          subtext="アクティブ会員"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">ステータス分布</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">週間注文推移</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{fill: '#6B7280'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#6B7280'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                />
                <Bar dataKey="count" fill="#EA580C" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg">
        <h4 className="font-bold text-orange-900 mb-2">ようこそ、管理者様</h4>
        <p className="text-sm text-orange-800">
          本日も業務お疲れ様です。未対応の注文が {pendingOrders} 件あります。
          <a href="#/orders" className="ml-2 font-semibold underline hover:text-orange-950">注文履歴を確認する</a>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;