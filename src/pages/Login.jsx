import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Eye, EyeOff } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { isValidEmail } from '../utils/validators';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleQuickLogin = (role) => {
    if (role === 'Customer') {
      setEmail('customer@yggdrasil.com');
      setPassword('123456');
    } else if (role === 'Staff') {
      setEmail('staff@yggdrasil.com');
      setPassword('123456');
    } else {
      setEmail('manager@yggdrasil.com');
      setPassword('123456');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const loggedInUser = login(email, password);
    if (loggedInUser) {
      if (loggedInUser.role === 'Manager') {
        navigate('/manager');
      } else if (loggedInUser.role === 'Staff') {
        navigate('/staff');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        
        {/* Header */}
        <div className="bg-primary/10 p-6 text-center border-b border-primary/20">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <Leaf className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Đăng Nhập
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Chào mừng bạn trở lại với Yggdrasil
          </p>
        </div>

        <div className="p-6 md:p-8">
          {/* Quick Login Helper */}
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
            <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-3 uppercase tracking-wider text-center">Tài khoản có sẵn</p>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => handleQuickLogin('Customer')}
                className="flex-1 bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-300 text-xs py-2 rounded-lg border border-blue-200 dark:border-blue-600 hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors font-medium shadow-sm"
              >
                Customer
              </button>
              <button 
                type="button"
                onClick={() => handleQuickLogin('Staff')}
                className="flex-1 bg-emerald-600 text-white text-xs py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm"
              >
                Staff
              </button>
              <button 
                type="button"
                onClick={() => handleQuickLogin('Manager')}
                className="flex-1 bg-blue-600 text-white text-xs py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                Manager
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={(e) => {
                  if (e.target.value && !isValidEmail(e.target.value)) {
                    showNotification({ type: 'error', message: 'Vui lòng nhập địa chỉ email hợp lệ.' });
                  }
                }}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="Ví dụ: customer@yggdrasil.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mật khẩu</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg pl-4 pr-10 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
                {password.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-primary focus:ring-primary bg-gray-100 border-gray-300" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Ghi nhớ tôi</span>
              </label>
              <button 
                type="button"
                onClick={() => showNotification({ type: 'info', message: 'Chức năng Quên mật khẩu hiện đang được phát triển. Vui lòng quay lại sau.' })}
                className="text-sm text-primary font-medium hover:underline"
              >
                Quên mật khẩu?
              </button>
            </div>

            <button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all active:scale-95 mt-2"
            >
              Đăng Nhập
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 dark:border-gray-700 pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Chưa có tài khoản?{' '}
              <Link 
                to="/register"
                className="text-primary font-bold hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
