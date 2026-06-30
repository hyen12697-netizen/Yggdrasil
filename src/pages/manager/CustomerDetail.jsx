import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Trash2, Lock, Unlock, Mail, Phone, MapPin, User, Calendar, ShoppingBag, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOrders } from '../../context/OrderContext';
import { useNotification } from '../../context/NotificationContext';
import { useCustomers } from '../../context/CustomerContext';
import { isValidEmail } from '../../utils/validators';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { orders } = useOrders();
  const { customers, updateCustomer, deleteCustomer } = useCustomers();
  
  const customer = customers.find(c => c.id === id);

  // Local state for editing
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (customer && !formData) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address || '123 Đường Tôn Đức Thắng, Quận 1, TP.HCM'
      });
    }
  }, [customer, formData]);

  if (!customer || !formData) {
    return <div className="p-8 text-center text-gray-500">Đang tải thông tin khách hàng...</div>;
  }

  const customerOrders = orders.filter(o => o.customer === customer.name || o.customerName === customer.name);
  const lastOrder = customerOrders.length > 0 ? customerOrders[0].date : 'Chưa có đơn hàng';

  const handleToggleLock = () => {
    const newStatus = customer.status === 'Hoạt động' ? 'Khóa' : 'Hoạt động';
    updateCustomer(customer.id, { status: newStatus });
    showNotification({ type: 'success', message: `Đã ${newStatus.toLowerCase()} tài khoản khách hàng!` });
  };

  const handleDelete = () => {
    if (customerOrders.length > 0) {
      showNotification({
        type: 'error',
        message: 'Khách hàng này đã có lịch sử giao dịch. Không thể xóa cứng, đề nghị khóa tài khoản!'
      });
      return;
    }

    showNotification({
      type: 'confirm',
      message: 'Bạn có chắc chắn muốn xóa khách hàng này vĩnh viễn?',
      onConfirm: () => {
        deleteCustomer(customer.id);
        showNotification({ type: 'success', message: 'Đã xóa khách hàng thành công!' });
        navigate('/staff/customers');
      }
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      showNotification({ type: 'error', message: 'Vui lòng điền đầy đủ các thông tin bắt buộc!' });
      return;
    }
    if (!isValidEmail(formData.email)) {
      showNotification({ type: 'error', message: 'Vui lòng nhập địa chỉ email hợp lệ.' });
      return;
    }
    updateCustomer(customer.id, formData);
    showNotification({ type: 'success', message: 'Đã cập nhật thông tin khách hàng!' });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/staff/customers')} 
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Chi Tiết Khách Hàng</h1>
          <p className="text-sm text-gray-500 mt-0.5">ID: {customer.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold mb-4">
              {customer.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{customer.name}</h2>
            <p className="text-gray-500 text-sm mb-4">@{customer.username}</p>
            
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${customer.status === 'Hoạt động' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
              {customer.status}
            </span>

            <div className="w-full mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-700/50 pt-6">
              <div>
                <p className="text-gray-500 text-xs mb-1">Tổng chi tiêu</p>
                <p className="font-bold text-primary">{customer.totalSpent.toLocaleString('vi-VN')} đ</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Tổng đơn</p>
                <p className="font-bold text-gray-900 dark:text-white">{customer.ordersCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Thao tác quản trị</h3>
            <div className="space-y-3">
              <button onClick={handleToggleLock} className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-colors ${customer.status === 'Hoạt động' ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                {customer.status === 'Hoạt động' ? <><Lock size={18} /> Khóa tài khoản</> : <><Unlock size={18} /> Mở khóa tài khoản</>}
              </button>
              <button onClick={handleDelete} className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold transition-colors">
                <Trash2 size={18} /> Xóa khách hàng
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Info & History */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Thông Tin Chi Tiết</h3>
              <button onClick={handleSave} className="flex items-center gap-2 text-sm bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-bold transition-colors">
                <Save size={16} /> Lưu thay đổi
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><User size={16}/> Họ và Tên</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-650 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><Mail size={16}/> Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} 
                onBlur={(e) => {
                  if (e.target.value && !isValidEmail(e.target.value)) {
                    showNotification({ type: 'error', message: 'Vui lòng nhập địa chỉ email hợp lệ.' });
                  }
                }}
                className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-650 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><Phone size={16}/> Số điện thoại</label>
                <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-650 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><MapPin size={16}/> Địa chỉ</label>
                <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-650 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Mật khẩu</label>
                <input type="text" value="[Đã mã hóa]" readOnly className="w-full bg-gray-100 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed italic" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center"><Calendar size={20}/></div>
                <div>
                  <p className="text-xs text-gray-500">Ngày tạo tài khoản</p>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{customer.joinDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center"><Clock size={20}/></div>
                <div>
                  <p className="text-xs text-gray-500">Lần mua gần nhất</p>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{lastOrder}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700/50">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"><ShoppingBag size={20} className="text-primary"/> Lịch sử mua hàng</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-655 dark:text-gray-400">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-bold">
                  <tr>
                    <th className="px-5 py-4 whitespace-nowrap">Mã ĐH</th>
                    <th className="px-5 py-4 whitespace-nowrap">Ngày mua</th>
                    <th className="px-5 py-4 whitespace-nowrap">Tổng tiền</th>
                    <th className="px-5 py-4 whitespace-nowrap">Trạng thái</th>
                    <th className="px-5 py-4 min-w-[200px]">Chi tiết sản phẩm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
                  {customerOrders.length > 0 ? (
                    customerOrders.map(o => (
                      <tr key={o.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-750/30">
                        <td className="px-5 py-4.5 font-bold text-gray-900 dark:text-white whitespace-nowrap">{o.id}</td>
                        <td className="px-5 py-4.5 text-gray-500 whitespace-nowrap">{o.date}</td>
                        <td className="px-5 py-4.5 font-bold text-primary whitespace-nowrap">{o.total.toLocaleString('vi-VN')} đ</td>
                        <td className="px-5 py-4.5 whitespace-nowrap">
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-bold">{o.status}</span>
                        </td>
                        <td className="px-5 py-4.5 text-gray-500">
                          {Array.isArray(o.items) ? o.items.map(i => `${i.quantity}x ${i.name}`).join(', ') : o.items}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" className="px-5 py-8 text-center text-gray-500">Khách hàng chưa có đơn hàng nào.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerDetail;
