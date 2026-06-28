import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, Truck, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const mockDailyOrders = [
  { day: 'Thứ 2', orders: 45 },
  { day: 'Thứ 3', orders: 52 },
  { day: 'Thứ 4', orders: 38 },
  { day: 'Thứ 5', orders: 65 },
  { day: 'Thứ 6', orders: 82 },
  { day: 'Thứ 7', orders: 115 },
  { day: 'Chủ nhật', orders: 95 },
];

const OrdersReport = () => {
  const maxOrders = Math.max(...mockDailyOrders.map(d => d.orders));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Thống Kê Đơn Hàng</h1>
          <p className="text-sm text-gray-550 mt-0.5">Theo dõi luân chuyển đơn hàng và tỷ lệ hoàn thành</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full flex items-center justify-center mb-2">
            <Package size={20} />
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">1,245</h3>
          <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-1">Tổng đơn</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-500 rounded-full flex items-center justify-center mb-2">
            <Clock size={20} />
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">142</h3>
          <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-1">Chờ xử lý</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-2">
            <Package size={20} />
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">86</h3>
          <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-1">Đang đóng gói</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-2">
            <Truck size={20} />
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">215</h3>
          <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-1">Đang giao</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-500 rounded-full flex items-center justify-center mb-2">
            <CheckCircle size={20} />
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">760</h3>
          <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-1">Hoàn thành</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mb-2">
            <XCircle size={20} />
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">42</h3>
          <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-1">Đã hủy</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 flex flex-col">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-6">Lượng đơn hàng 7 ngày qua</h3>
          <div className="flex-1 min-h-[250px] flex items-end justify-between gap-2 pt-10 relative">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
              {[4, 3, 2, 1, 0].map(line => (
                <div key={line} className="w-full border-t border-gray-100 dark:border-gray-750 flex items-center h-0">
                  <span className="absolute -left-2 -translate-x-full text-[10px] text-gray-400 font-medium">
                    {Math.round((maxOrders * (line / 4)))}
                  </span>
                </div>
              ))}
            </div>

            {mockDailyOrders.map((data, index) => {
              const heightPercent = (data.orders / maxOrders) * 100;
              return (
                <div key={index} className="relative flex flex-col items-center flex-1 group z-10 h-full justify-end">
                  <div className="absolute -top-10 bg-gray-900 text-white text-xs font-bold py-1 px-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                    {data.orders} đơn
                  </div>
                  <div 
                    className="w-full max-w-[40px] bg-indigo-500/90 hover:bg-indigo-500 rounded-t-lg transition-all duration-500"
                    style={{ height: `${heightPercent}%` }}
                  ></div>
                  <span className="text-[10px] sm:text-xs text-gray-500 mt-3 font-medium whitespace-nowrap">{data.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 flex flex-col justify-center items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center border-4 border-red-100 dark:border-red-900/40">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">3.4%</h3>
            <p className="font-bold text-gray-700 dark:text-gray-300 mt-1">Tỷ lệ hủy đơn</p>
            <p className="text-xs text-gray-500 mt-2">Mức hoàn trả/hủy đơn đã giảm 0.5% so với tháng trước. Nằm trong ngưỡng an toàn.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrdersReport;
