import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const mockRevenueData = [
  { month: 'T11/2023', revenue: 120000000, target: 150000000 },
  { month: 'T12/2023', revenue: 145000000, target: 150000000 },
  { month: 'T01/2024', revenue: 180000000, target: 160000000 },
  { month: 'T02/2024', revenue: 110000000, target: 150000000 },
  { month: 'T03/2024', revenue: 135000000, target: 160000000 },
  { month: 'T04/2024', revenue: 195000000, target: 180000000 },
  { month: 'T05/2024', revenue: 215000000, target: 200000000 },
];

const categoryRevenue = [
  { name: 'Phân bón hữu cơ', revenue: 85000000, percentage: 40 },
  { name: 'Đất sạch & Giá thể', revenue: 45000000, percentage: 21 },
  { name: 'Hạt giống rau củ', revenue: 35000000, percentage: 16 },
  { name: 'Dụng cụ làm vườn', revenue: 30000000, percentage: 14 },
  { name: 'Chế phẩm sinh học', revenue: 20000000, percentage: 9 },
];

const RevenueReport = ({ showNotification }) => {
  const maxRevenue = Math.max(...mockRevenueData.map(d => d.revenue));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Báo Cáo Doanh Thu</h1>
          <p className="text-sm text-gray-550 mt-0.5">Thống kê chi tiết dòng tiền và biểu đồ doanh thu theo thời gian</p>
        </div>
        <button 
          onClick={() => showNotification({ type: 'success', message: 'Đang khởi tạo tệp báo cáo doanh thu định dạng XLS...' })}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 text-sm transition-colors shadow-md"
        >
          <FileSpreadsheet size={18} /> Xuất báo cáo XLS
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Tổng doanh thu tháng này</span>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">215.000.000 đ</h3>
            <span className="text-xs text-emerald-500 font-bold mt-1 block flex items-center gap-1">
              <ArrowUpRight size={14} /> +10.2% so với tháng trước
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Trung bình theo ngày</span>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">6.935.000 đ</h3>
            <span className="text-xs text-emerald-500 font-bold mt-1 block flex items-center gap-1">
              <ArrowUpRight size={14} /> Đạt 107% KPI
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Dự phóng lợi nhuận</span>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">86.000.000 đ</h3>
            <span className="text-xs text-rose-500 font-bold mt-1 block flex items-center gap-1">
              <ArrowDownRight size={14} /> -2.1% chi phí vận hành tăng
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ doanh thu */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 flex flex-col">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-6">Biểu đồ doanh thu 7 tháng gần nhất</h3>
          <div className="flex-1 min-h-[250px] flex items-end justify-between gap-2 pt-10 relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
              {[4, 3, 2, 1, 0].map(line => (
                <div key={line} className="w-full border-t border-gray-100 dark:border-gray-750 flex items-center h-0">
                  <span className="absolute -left-2 -translate-x-full text-[10px] text-gray-400 font-medium">
                    {((maxRevenue * (line / 4)) / 1000000).toFixed(0)}M
                  </span>
                </div>
              ))}
            </div>

            {/* Bars */}
            {mockRevenueData.map((data, index) => {
              const heightPercent = (data.revenue / maxRevenue) * 100;
              return (
                <div key={index} className="relative flex flex-col items-center flex-1 group z-10 h-full justify-end">
                  {/* Tooltip */}
                  <div className="absolute -top-12 bg-gray-900 text-white text-xs font-bold py-1.5 px-3 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                    {data.revenue.toLocaleString('vi-VN')} đ
                  </div>
                  {/* Bar */}
                  <div 
                    className="w-full max-w-[48px] bg-primary/90 hover:bg-primary rounded-t-lg transition-all duration-500"
                    style={{ height: `${heightPercent}%` }}
                  ></div>
                  {/* Label */}
                  <span className="text-[10px] sm:text-xs text-gray-500 mt-3 font-medium whitespace-nowrap">{data.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bảng doanh thu theo danh mục */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 flex flex-col">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-6">Doanh thu theo danh mục</h3>
          <div className="space-y-5 flex-1">
            {categoryRevenue.map((cat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between items-end text-sm">
                  <span className="font-bold text-gray-700 dark:text-gray-300">{cat.name}</span>
                  <span className="font-extrabold text-primary">{cat.revenue.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2" 
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 font-medium text-right">{cat.percentage}% tổng doanh thu</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RevenueReport;
