import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Filter, Download } from 'lucide-react';

const bestSellersData = [
  { id: 1, name: 'Phân trùn quế nguyên chất SFarm Pb01', sales: 1540, revenue: 130900000, category: 'Phân bón' },
  { id: 2, name: 'Đất sạch mùn hữu cơ Tribat 10kg', sales: 1200, revenue: 54000000, category: 'Đất sạch' },
  { id: 3, name: 'Phân bón NPK 20-20-15 Phú Mỹ', sales: 910, revenue: 163800000, category: 'Phân bón' },
  { id: 4, name: 'Chế phẩm sinh học Trichoderma Điền Trang', sales: 880, revenue: 39600000, category: 'Chế phẩm' },
  { id: 5, name: 'Hạt giống cà chua Cherry quả ngọt', sales: 650, revenue: 22750000, category: 'Hạt giống' },
  { id: 6, name: 'Bộ dụng cụ làm vườn mini 3 món', sales: 520, revenue: 46800000, category: 'Dụng cụ' },
  { id: 7, name: 'Bình xịt tưới cây Dudaco 2 Lít', sales: 480, revenue: 24000000, category: 'Dụng cụ' },
  { id: 8, name: 'Giá thể xơ dừa đã xử lý chát Sfarm', sales: 450, revenue: 15750000, category: 'Đất sạch' },
  { id: 9, name: 'Hạt giống dưa hấu ruột đỏ F1', sales: 380, revenue: 13300000, category: 'Hạt giống' },
  { id: 10, name: 'Phân bón lá NPK 30-10-10 Growmore', sales: 310, revenue: 13950000, category: 'Phân bón' },
];

const BestSellersReport = () => {
  const [timeFilter, setTimeFilter] = useState('month');
  const maxSales = Math.max(...bestSellersData.map(p => p.sales));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Sản Phẩm Bán Chạy</h1>
          <p className="text-sm text-gray-550 mt-0.5">Top 10 sản phẩm mang lại doanh số cao nhất</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white font-medium appearance-none"
            >
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="quarter">Quý này</option>
              <option value="year">Năm nay</option>
            </select>
          </div>
          <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 text-sm transition-colors shadow-sm">
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 md:p-8">
        <div className="space-y-6">
          {bestSellersData.map((item, index) => {
            const barWidth = (item.sales / maxSales) * 100;
            return (
              <div key={item.id} className="group relative">
                <div className="flex items-center gap-4 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                    index === 0 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30' : 
                    index === 1 ? 'bg-gray-100 text-gray-500 dark:bg-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30' :
                    'bg-gray-50 text-gray-400 dark:bg-gray-800 border border-gray-100 dark:border-gray-700'
                  }`}>
                    {index < 3 ? <Trophy size={16} /> : index + 1}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                    <div className="truncate">
                      <h4 className="font-bold text-gray-900 dark:text-white truncate">{item.name}</h4>
                      <span className="text-xs text-gray-500">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-4 text-right shrink-0">
                      <div>
                        <span className="text-[11px] text-gray-400 block">Đã bán</span>
                        <strong className="text-gray-900 dark:text-white">{item.sales}</strong>
                      </div>
                      <div className="w-24">
                        <span className="text-[11px] text-gray-400 block">Doanh thu</span>
                        <strong className="text-primary">{item.revenue.toLocaleString('vi-VN')} đ</strong>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Horizontal Bar */}
                <div className="w-full bg-gray-100 dark:bg-gray-700/50 rounded-full h-1.5 ml-12" style={{ width: 'calc(100% - 3rem)' }}>
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-1000 ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-500' :
                      'bg-primary'
                    }`}
                    style={{ width: `${barWidth}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default BestSellersReport;
