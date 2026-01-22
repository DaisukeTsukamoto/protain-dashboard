import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  PlusCircle, 
  Users, 
  Truck, 
  LogOut, 
  Menu,
  X,
  Package,
  Dumbbell
} from 'lucide-react';
import { Member, Order, ShippingAddress, OrderStatus } from './types';
import { MOCK_MEMBERS, MOCK_ORDERS, MOCK_ADDRESSES } from './constants';
import Dashboard from './components/Dashboard';
import OrderList from './components/OrderList';
import NewOrder from './components/NewOrder';
import MemberList from './components/MemberList';
import ShippingList from './components/ShippingList';
import Login from './components/Login';

// --- Contexts ---

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface DataContextType {
  members: Member[];
  orders: Order[];
  addresses: ShippingAddress[];
  addOrder: (order: Order) => void;
  updateMember: (member: Member) => void;
  addAddress: (address: ShippingAddress) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// --- Providers ---

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('auth_token') === 'mock_token';
  });

  const login = (email: string, pass: string) => {
    // Mock authentication
    if (email && pass) {
      localStorage.setItem('auth_token', 'mock_token');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const DataProvider = ({ children }: { children: ReactNode }) => {
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [addresses, setAddresses] = useState<ShippingAddress[]>(MOCK_ADDRESSES);

  const addOrder = (order: Order) => {
    setOrders([order, ...orders]);
  };

  const updateMember = (updatedMember: Member) => {
    setMembers(members.map(m => m.id === updatedMember.id ? updatedMember : m));
  };

  const addAddress = (address: ShippingAddress) => {
    setAddresses([...addresses, address]);
  };

  return (
    <DataContext.Provider value={{ members, orders, addresses, addOrder, updateMember, addAddress }}>
      {children}
    </DataContext.Provider>
  );
};

// --- Hooks ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};

// --- Layout Components ---

const SidebarItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mb-1 ${
        isActive 
          ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' 
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const Layout = ({ children }: { children: ReactNode }) => {
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-900 text-white shadow-xl">
        <div className="p-6 border-b border-gray-800 flex items-center space-x-3">
          <div className="bg-orange-600 p-1.5 rounded-lg">
            <Dumbbell className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-none">ProteinAdmin</h1>
            <span className="text-xs text-gray-500 font-medium">Pro Nutrition</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <SidebarItem to="/" icon={LayoutDashboard} label="ホーム" />
          <SidebarItem to="/orders/new" icon={PlusCircle} label="新規注文" />
          <SidebarItem to="/orders" icon={ShoppingCart} label="注文履歴" />
          <div className="my-4 border-t border-gray-800"></div>
          <SidebarItem to="/members" icon={Users} label="会員情報" />
          <SidebarItem to="/shipping" icon={Truck} label="配送先" />
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={logout}
            className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors w-full px-4 py-2"
          >
            <LogOut size={20} />
            <span>ログアウト</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="w-64 bg-gray-900 text-white h-full flex flex-col">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Dumbbell className="text-orange-500" size={24} />
                <span className="font-bold text-lg">ProteinAdmin</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} className="text-gray-400" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6">
              <div onClick={() => setIsMobileMenuOpen(false)}>
                <SidebarItem to="/" icon={LayoutDashboard} label="ホーム" />
                <SidebarItem to="/orders/new" icon={PlusCircle} label="新規注文" />
                <SidebarItem to="/orders" icon={ShoppingCart} label="注文履歴" />
                <div className="my-4 border-t border-gray-800"></div>
                <SidebarItem to="/members" icon={Users} label="会員情報" />
                <SidebarItem to="/shipping" icon={Truck} label="配送先" />
              </div>
            </nav>
            <div className="p-4 border-t border-gray-800">
              <button onClick={logout} className="flex items-center space-x-3 text-gray-400 w-full px-4 py-2">
                <LogOut size={20} />
                <span>ログアウト</span>
              </button>
            </div>
          </div>
          <div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}></div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm z-10 p-4 md:hidden flex justify-between items-center">
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-600">
            <Menu size={24} />
          </button>
          <span className="font-bold text-gray-800">ProteinAdmin</span>
          <div className="w-6"></div> {/* Spacer */}
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

const App = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><OrderList /></PrivateRoute>} />
            <Route path="/orders/new" element={<PrivateRoute><NewOrder /></PrivateRoute>} />
            <Route path="/members" element={<PrivateRoute><MemberList /></PrivateRoute>} />
            <Route path="/shipping" element={<PrivateRoute><ShippingList /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;