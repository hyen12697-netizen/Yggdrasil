import { useState, useRef } from 'react';
import { Camera, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { motion } from 'framer-motion';
import { isValidEmail } from '../../utils/validators';

const StaffProfile = () => {
  const { user, updateProfile } = useAuth();
  const { showNotification } = useNotification();

  // Profile Edit Form State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '08357757501');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        showNotification({ type: 'error', message: 'Kích thước ảnh quá lớn. Vui lòng chọn ảnh dưới 2MB.' });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      showNotification({ type: 'error', message: 'Mật khẩu mới nhập lại không khớp!' });
      return;
    }
    if (!isValidEmail(profileEmail)) {
      showNotification({ type: 'error', message: 'Vui lòng nhập địa chỉ email hợp lệ.' });
      return;
    }
    updateProfile({
      name: profileName,
      email: profileEmail,
      avatar: profileAvatar,
      phone: profilePhone,
      ...(newPassword ? { password: newPassword } : {})
    });
    showNotification({ type: 'success', message: 'Cập nhật hồ sơ cá nhân thành công!' });
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Hồ Sơ Cá Nhân</h1>
        <p className="text-sm text-gray-500 mt-0.5">Thay đổi thông tin liên hệ, ảnh đại diện và mật khẩu quản trị của bạn</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-150 dark:border-gray-700 p-8 space-y-8">
        <form onSubmit={handleSubmit} className="space-y-6 text-sm font-medium">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100 dark:border-gray-700/50">
            <div 
              className="relative group cursor-pointer shrink-0" 
              onClick={() => fileInputRef.current?.click()}
              title="Nhấp để thay đổi ảnh đại diện"
            >
              <div className="w-24 h-24 rounded-full bg-primary text-white flex justify-center items-center font-bold overflow-hidden shadow-lg border-4 border-white dark:border-gray-800 shrink-0 text-4xl">
                {profileAvatar ? (
                  <img src={profileAvatar} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  profileName.charAt(0).toUpperCase() || 'A'
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={28} />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/png, image/jpeg, image/jpg" 
                className="hidden" 
              />
            </div>
            <div className="space-y-2 w-full">
              <h3 className="font-bold text-xl md:text-2xl text-gray-900 dark:text-white">{profileName}</h3>
              <p className="text-gray-500 mt-1">{user?.role || 'Staff'}</p>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm text-primary hover:underline mt-2 inline-block font-medium"
              >
                Thay đổi ảnh đại diện
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-450 mb-1.5 uppercase tracking-wider">Họ và Tên</label>
              <input 
                type="text" 
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg px-4 py-2.5 text-sm outline-none text-gray-900 dark:text-white font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-450 mb-1.5 uppercase tracking-wider">Địa chỉ Email</label>
              <input 
                type="email" 
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                onBlur={(e) => {
                  if (e.target.value && !isValidEmail(e.target.value)) {
                    showNotification({ type: 'error', message: 'Vui lòng nhập địa chỉ email hợp lệ.' });
                  }
                }}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg px-4 py-2.5 text-sm outline-none text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-455 mb-1.5 uppercase tracking-wider">Số điện thoại liên hệ</label>
              <input 
                type="text" 
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg px-4 py-2.5 text-sm outline-none text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-455 mb-1.5 uppercase tracking-wider">Vai trò quản trị</label>
              <input 
                type="text" 
                value={user?.role || 'Staff'} 
                disabled 
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-750 rounded-lg px-4 py-2.5 text-sm outline-none text-gray-400 font-semibold cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-700/50 space-y-4">
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Đổi Mật Khẩu (Nếu muốn)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-450 mb-1.5 uppercase tracking-wider">Mật khẩu cũ</label>
                <div className="relative">
                  <input 
                    type={showOldPassword ? "text" : "password"} 
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-gray-55 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg pl-4 pr-10 py-2.5 text-sm outline-none text-gray-900 dark:text-white"
                  />
                  {oldPassword.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-455 mb-1.5 uppercase tracking-wider">Mật khẩu mới</label>
                <div className="relative">
                  <input 
                    type={showNewPassword ? "text" : "password"} 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-gray-55 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg pl-4 pr-10 py-2.5 text-sm outline-none text-gray-900 dark:text-white"
                  />
                  {newPassword.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-455 mb-1.5 uppercase tracking-wider font-semibold text-primary">Nhập lại mật khẩu</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-gray-55 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg pl-4 pr-10 py-2.5 text-sm outline-none text-gray-900 dark:text-white"
                  />
                  {confirmPassword.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-8 rounded-lg text-sm transition-colors shadow-md">
              Lưu thay đổi hồ sơ
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default StaffProfile;
