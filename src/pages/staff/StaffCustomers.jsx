import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useCustomers } from '../../context/CustomerContext';

const StaffCustomers = () => {
  const navigate = useNavigate();
  const { customers: customersList } = useCustomers();
  const [customerSearch, setCustomerSearch] = useState('');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Danh Sách Khách Hàng</h1>
          <p className="text-sm text-gray-500 mt-0.5">Quản lý và tra cứu thông tin khách hàng trên hệ thống</p>
        </div>
        <div className="relative w-full md:w-72">
          <input 
            type="text" 
            placeholder="Tìm tên, email, SĐT..." 
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
          />
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-655 dark:text-gray-450">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-bold">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">Mã KH</th>
                <th className="px-5 py-4 min-w-[150px]">Họ và Tên</th>
                <th className="px-5 py-4 whitespace-nowrap">Liên hệ</th>
                <th className="px-5 py-4 text-center whitespace-nowrap">Ngày tham gia</th>
                <th className="px-5 py-4 text-center whitespace-nowrap">Tổng đơn</th>
                <th className="px-5 py-4 text-right whitespace-nowrap">Tổng chi tiêu</th>
                <th className="px-5 py-4 text-center whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
              {customersList
                .filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.email.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone.includes(customerSearch))
                .map(c => (
                <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-750/30">
                  <td className="px-5 py-4.5 font-bold text-gray-900 dark:text-white whitespace-nowrap">{c.id}</td>
                  <td className="px-5 py-4.5 font-extrabold text-gray-900 dark:text-white text-base">
                    {c.name}
                    <span className={`ml-2 px-2 py-0.5 rounded text-[10px] font-bold ${c.status === 'Hoạt động' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>{c.status}</span>
                  </td>
                  <td className="px-5 py-4.5 text-gray-500 font-medium">
                    <div className="text-xs text-gray-800 dark:text-gray-300">{c.email}</div>
                    <div className="text-xs">{c.phone}</div>
                  </td>
                  <td className="px-5 py-4.5 text-center text-gray-500 whitespace-nowrap">{c.joinDate}</td>
                  <td className="px-5 py-4.5 text-center font-bold text-gray-800 dark:text-gray-200 whitespace-nowrap">{c.ordersCount} đơn</td>
                  <td className="px-5 py-4.5 text-right font-extrabold text-primary text-base whitespace-nowrap">{c.totalSpent.toLocaleString('vi-VN')} đ</td>
                  <td className="px-5 py-4.5 text-center whitespace-nowrap space-x-2">
                    <button 
                      onClick={() => navigate('/staff/customers/' + c.id)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg transition-colors font-bold text-xs"
                    >Xem chi tiết</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default StaffCustomers;
