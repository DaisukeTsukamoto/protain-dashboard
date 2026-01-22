import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Lock, Mail, Dumbbell, User as UserIcon } from 'lucide-react';

const Login = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For registration
  
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // For MVP, both login and register simulate a successful login
    if (login(email, password)) {
      navigate('/');
    } else {
      setError('メールアドレスまたはパスワードが正しくありません。');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-orange-600 mb-2">
           <Dumbbell size={48} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          ProteinAdmin Pro
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          最強の管理ダッシュボードへようこそ
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => { setIsLoginView(true); setError(''); }}
              className={`flex-1 py-4 text-center text-sm font-medium transition-colors ${
                isLoginView 
                  ? 'border-b-2 border-orange-600 text-orange-600 bg-orange-50/50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              ログイン
            </button>
            <button
              onClick={() => { setIsLoginView(false); setError(''); }}
              className={`flex-1 py-4 text-center text-sm font-medium transition-colors ${
                !isLoginView 
                  ? 'border-b-2 border-orange-600 text-orange-600 bg-orange-50/50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              新規登録
            </button>
          </div>

          <div className="py-8 px-4 sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* Name Field - Register Only */}
              {!isLoginView && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    お名前
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required={!isLoginView}
                      className="block w-full pl-10 sm:text-sm bg-white border border-gray-300 rounded-md py-2 text-gray-900 placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="プロテイン 太郎"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  メールアドレス
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 sm:text-sm bg-white border border-gray-300 rounded-md py-2 text-gray-900 placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  パスワード
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isLoginView ? "current-password" : "new-password"}
                    required
                    className="block w-full pl-10 sm:text-sm bg-white border border-gray-300 rounded-md py-2 text-gray-900 placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                >
                  {isLoginView ? 'ログイン' : 'アカウントを作成して開始'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    デモ用アカウント: 任意の入力で実行可能
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;