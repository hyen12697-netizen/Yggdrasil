import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserPlus, Activity, Filter } from 'lucide-react';

const mockUserGrowth = [
  { day: '01/06', newUsers: 12, activeUsers: 450 },
  { day: '02/06', newUsers: 15, activeUsers: 462 },
  { day: '03/06', newUsers: 8, activeUsers: 470 },
  { day: '04/06', newUsers: 22, activeUsers: 485 },
  { day: '05/06', newUsers: 18, activeUsers: 510 },
  { day: '06/06', newUsers: 25, activeUsers: 525 },
  { day: '07/06', newUsers: 30, activeUsers: 560 },
  { day: '08/06', newUsers: 14, activeUsers: 565 },
  { day: '09/06', newUsers: 19, activeUsers: 580 },
  { day: '10/06', newUsers: 28, activeUsers: 610 },
];

const NewUsersReport = () => {
  const maxNewUsers = Math.max(...mockUserGrowth.map(d => d.newUsers));
  const maxActiveUsers = Math.max(...mockUserGrowth.map(d => d.activeUsers));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Thống Kê Người Dùng</h1>
          <p className="text-sm text-gray-550 mt-0.5">Phân tích tăng trưởng và mức độ tương tác của khách hàng</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Tổng thành viên</span>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">8,452</h3>
            <span className="text-xs text-emerald-500 font-bold mt-1 block">+12% so với tháng trước</span>
          </div>
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Đăng ký mới (10 ngày)</span>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">191</h3>
            <span className="text-xs text-emerald-500 font-bold mt-1 block">Trung bình 19 user/ngày</span>
          </div>
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
            <UserPlus size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Active Users</span>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">610</h3>
            <span className="text-xs text-emerald-500 font-bold mt-1 block">Đang online & tương tác</span>
          </div>
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
            <UserCheck size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Tỷ lệ chuyển đổi</span>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">4.2%</h3>
            <span className="text-xs text-rose-500 font-bold mt-1 block">-0.5% so với tuần trước</span>
          </div>
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center">
            <Activity size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">Biểu đồ người dùng mới (10 ngày gần nhất)</h3>
          <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-500"></div> Đăng ký mới</div>
          </div>
        </div>

        <div className="flex-1 min-h-[300px] flex items-end justify-between gap-1 sm:gap-2 pt-10 relative">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
            {[4, 3, 2, 1, 0].map(line => (
              <div key={line} className="w-full border-t border-gray-100 dark:border-gray-750 flex items-center h-0">
                <span className="absolute -left-2 -translate-x-full text-[10px] text-gray-400 font-medium">
                  {Math.round(maxNewUsers * (line / 4))}
                </span>
              </div>
            ))}
          </div>

          {mockUserGrowth.map((data, index) => {
            const newUsersHeight = (data.newUsers / maxNewUsers) * 100;
            return (
              <div key={index} className="relative flex flex-col items-center flex-1 group z-10 h-full justify-end">
                <div className="absolute -top-12 bg-gray-900 text-white text-xs font-bold py-1.5 px-3 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none text-center">
                  <div>{data.newUsers} user mới</div>
                  <div className="text-[10px] text-gray-400 font-normal mt-0.5">{data.activeUsers} active</div>
                </div>
                
                <div 
                  className="w-full max-w-[36px] bg-emerald-500/90 hover:bg-emerald-500 rounded-t-lg transition-all duration-500 relative flex flex-col justify-end"
                  style={{ height: `${newUsersHeight}%` }}
                >
                </div>
                <span className="text-[10px] sm:text-xs text-gray-500 mt-3 font-medium whitespace-nowrap -rotate-45 sm:rotate-0 origin-top-left sm:origin-center">{data.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default NewUsersReport;
