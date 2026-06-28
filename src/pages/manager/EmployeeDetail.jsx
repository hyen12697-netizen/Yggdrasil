import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Trash2, Lock, Unlock, Mail, Phone, User, Calendar, ShieldAlert, KeyRound, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStaff } from '../../context/StaffContext';
import { useNotification } from '../../context/NotificationContext';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { staffList, updateStaff, deleteStaff, toggleStaffLock, resetPassword } = useStaff();
  
  const contextEmployee = staffList.find(s => s.id === id);
  const [formData, setFormData] = useState(null);
  
  useEffect(() => {
    if (contextEmployee && !formData) {
      setFormData(contextEmployee);
    } else if (contextEmployee && formData && contextEmployee.id !== formData.id) {
      setFormData(contextEmployee);
    }
  }, [contextEmployee, id]);

  if (!contextEmployee || !formData) {
    return <div className="p-8 text-center text-gray-500">Đang tải thông tin nhân viên...</div>;
  }

  const handleToggleLock = () => {
    toggleStaffLock(id);
    const newStatus = contextEmployee.status === 'Hoạt động' ? 'khóa' : 'mở khóa';
    showNotification({ type: 'success', message: `Đã ${newStatus} tài khoản nhân viên!` });
  };

  const handleDelete = () => {
    showNotification({
      type: 'confirm',
      message: 'Bạn có chắc chắn muốn xóa nhân viên này vĩnh viễn?',
      onConfirm: () => {
        deleteStaff(id);
        showNotification({ type: 'success', message: 'Đã xóa nhân viên thành công!' });
        navigate('/manager?tab=staff-list');
      }
    });
  };

  const handleResetPassword = () => {
    showNotification({
      type: 'confirm',
      message: 'Hệ thống sẽ tạo một mật khẩu mới ngẫu nhiên và gửi về email của nhân viên. Tiếp tục?',
      onConfirm: () => {
        resetPassword(id);
        showNotification({ type: 'success', message: 'Đã reset mật khẩu thành công! Email đã được gửi.' });
      }
    });
  };

  const handleSave = () => {
    updateStaff(id, formData);
    showNotification({ type: 'success', message: 'Đã cập nhật thông tin nhân viên!' });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/manager?tab=staff-list')} 
          className="p-2 hover:bg-neutral-800 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Chi Tiết Nhân Viên</h1>
          <p className="text-sm text-gray-400 mt-0.5">Mã NV: {contextEmployee.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="xl:col-span-1 space-y-8">
          <div className="bg-[#1F2937] p-8 rounded-2xl shadow-md border border-gray-700/60 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center text-3xl font-bold mb-5 border-2 border-blue-800/50">
              {contextEmployee.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-white">{contextEmployee.name}</h2>
            <p className="text-gray-400 text-sm mb-5">@{contextEmployee.username}</p>
            
            <div className="flex gap-2">
              <span className={`px-4 py-1.5 rounded-lg text-xs font-bold ${contextEmployee.role === 'Manager' ? 'bg-purple-900/40 text-purple-300 border border-purple-800/50' : 'bg-blue-900/40 text-blue-300 border border-blue-800/50'}`}>
                {contextEmployee.role}
              </span>
              <span className={`px-4 py-1.5 rounded-lg text-xs font-bold ${contextEmployee.status === 'Hoạt động' ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-800/50' : 'bg-red-900/40 text-red-400 border border-red-800/50'}`}>
                {contextEmployee.status}
              </span>
            </div>

            <div className="w-full mt-8 grid grid-cols-2 gap-4 border-t border-gray-700/60 pt-8">
              <div className="col-span-2 text-left bg-gray-800 p-4 rounded-xl flex items-center gap-4">
                <Calendar size={20} className="text-gray-500"/>
                <div>
                  <p className="text-gray-400 text-xs">Ngày tham gia</p>
                  <p className="font-bold text-gray-200 text-sm mt-0.5">{contextEmployee.joinDate}</p>
                </div>
              </div>
              <div className="col-span-2 text-left bg-gray-800 p-4 rounded-xl flex items-center gap-4">
                <Clock size={20} className="text-gray-500"/>
                <div>
                  <p className="text-gray-400 text-xs">Đăng nhập lần cuối</p>
                  <p className="font-bold text-gray-200 text-sm mt-0.5">{contextEmployee.lastLogin || 'Chưa từng đăng nhập'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1F2937] p-8 rounded-2xl shadow-md border border-gray-700/60">
            <h3 className="font-bold text-white mb-5">Thao tác quản trị</h3>
            <div className="space-y-4">
              <button 
                onClick={handleResetPassword} 
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <KeyRound size={18} /> Đặt lại mật khẩu (Reset)
              </button>
              <button 
                onClick={handleToggleLock} 
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 ${contextEmployee.status === 'Hoạt động' ? 'bg-orange-500 hover:bg-orange-400 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
              >
                {contextEmployee.status === 'Hoạt động' ? <><Lock size={18} /> Khóa tài khoản</> : <><Unlock size={18} /> Mở khóa tài khoản</>}
              </button>
              <button 
                onClick={handleDelete} 
                className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <Trash2 size={18} /> Xóa nhân viên
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Info & Permissions */}
        <div className="xl:col-span-2">
          <div className="bg-[#1F2937] p-8 rounded-2xl shadow-md border border-gray-700/60 h-full">
            <div className="flex justify-between items-center mb-8 border-b border-gray-700/60 pb-5">
              <h3 className="text-xl font-bold text-white">Thông Tin Chi Tiết</h3>
              <button 
                onClick={handleSave} 
                className="flex items-center gap-2 text-sm bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <Save size={18} /> Lưu thay đổi
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2.5 flex items-center gap-2"><User size={16} className="text-gray-500"/> Họ và Tên</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-200 transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2.5 flex items-center gap-2"><Mail size={16} className="text-gray-500"/> Email</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-200 transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2.5 flex items-center gap-2"><Phone size={16} className="text-gray-500"/> Số điện thoại</label>
                <input 
                  type="text" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-200 transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2.5 flex items-center gap-2"><ShieldAlert size={16} className="text-gray-500"/> Vai trò (Phân quyền)</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-200 appearance-none transition-colors"
                >
                  <option value="Manager">Quản lý (Manager)</option>
                  <option value="Staff">Nhân viên (Staff)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-300 mb-2.5">Username</label>
                <input 
                  type="text" 
                  value={contextEmployee.username} 
                  readOnly 
                  className="w-full bg-[#111827] border border-gray-700/60 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed font-semibold focus:outline-none" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-300 mb-2.5">Mật khẩu</label>
                <input 
                  type="text" 
                  value="[Đã mã hóa]" 
                  readOnly 
                  className="w-full bg-[#111827] border border-gray-700/60 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed italic focus:outline-none" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeDetail;
