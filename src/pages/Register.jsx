import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Eye, EyeOff } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { isValidEmail } from '../utils/validators';

const Register = () => {
  const { showNotification } = useNotification();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fullname.trim()) {
      showNotification({ type: 'error', message: 'Vui lòng nhập họ và tên' });
      return;
    }

    if (!email.trim() || !isValidEmail(email)) {
      showNotification({ type: 'error', message: 'Vui lòng nhập địa chỉ email hợp lệ.' });
      return;
    }

    // Phone validation (Vietnam phone number regex)
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phone.trim() || !phoneRegex.test(phone)) {
      showNotification({ type: 'error', message: 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 03, 05, 07, 08, 09)' });
      return;
    }

    if (password.length < 6) {
      showNotification({ type: 'error', message: 'Mật khẩu phải chứa ít nhất 6 ký tự' });
      return;
    }

    if (password !== confirmPassword) {
      showNotification({ type: 'error', message: 'Mật khẩu xác nhận không trùng khớp' });
      return;
    }

    if (!agreeTerms) {
      showNotification({ type: 'error', message: 'Bạn phải đồng ý với Điều khoản dịch vụ và Chính sách bảo mật' });
      return;
    }

    const success = register(fullname, email, phone, password);
    if (success) {
      showNotification({ type: 'success', message: 'Đăng ký tài khoản thành công! Vui lòng đăng nhập.' });
      navigate('/login');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        
        {/* Header */}
        <div className="bg-primary/10 p-6 text-center border-b border-primary/20">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4 shadow-md shadow-primary/20">
            <Leaf className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tạo Tài Khoản
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Tham gia cộng đồng nông nghiệp xanh ngay hôm nay
          </p>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required 
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="Nhập họ và tên của bạn"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input 
                type="tel" 
                required 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="Ví dụ: 0987654321"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg pl-4 pr-10 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="Tối thiểu 6 ký tự"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  required 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg pl-4 pr-10 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="Nhập lại mật khẩu"
                />
                {confirmPassword.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-start mt-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded text-primary focus:ring-primary bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 mt-1" 
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 leading-tight">
                  Tôi đồng ý với <a href="#" className="text-primary hover:underline font-semibold">Điều khoản dịch vụ</a> và <a href="#" className="text-primary hover:underline font-semibold">Chính sách bảo mật</a>
                </span>
              </label>
            </div>

            <button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 mt-4"
            >
              Đăng Ký Tài Khoản
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 dark:border-gray-700 pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Đã có tài khoản?{' '}
              <Link 
                to="/login"
                className="text-primary font-bold hover:underline"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
