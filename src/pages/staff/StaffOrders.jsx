import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Check } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';

const StaffOrders = () => {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'orders-all';

  const { orders: ordersList, updateOrderStatus } = useOrders();
  const [selectedManagerOrderId, setSelectedManagerOrderId] = useState(null);

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    setSelectedManagerOrderId(null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Quản Lý Giao Dịch Đơn Hàng</h1>
        <p className="text-sm text-gray-500 mt-0.5">Xử lý các trạng thái đơn hàng, giao hàng và hoàn trả</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Order List Table (8/12 width) */}
        <div className="xl:col-span-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-655 dark:text-gray-400">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-bold">
                <tr>
                  <th className="px-5 py-4 whitespace-nowrap w-[130px]">Mã đơn hàng</th>
                  <th className="px-5 py-4 min-w-[180px]">Khách hàng</th>
                  <th className="px-5 py-4 whitespace-nowrap w-[140px]">Ngày giao dịch</th>
                  <th className="px-5 py-4 whitespace-nowrap w-[150px]">Tổng tiền</th>
                  <th className="px-5 py-4 whitespace-nowrap w-[160px]">Trạng thái giao</th>
                  <th className="px-5 py-4 text-right whitespace-nowrap w-[100px]">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
                {ordersList
                  .filter(o => {
                    if (currentTab === 'orders-pending') return o.status === 'Chờ xác nhận';
                    if (currentTab === 'orders-shipping') return o.status === 'Đang giao' || o.status === 'Đang giao hàng' || o.status === 'Đang đóng gói';
                    if (currentTab === 'orders-completed') return o.status === 'Hoàn thành' || o.status === 'Đã giao thành công';
                    if (currentTab === 'orders-cancelled') return o.status === 'Đã hủy';
                    return true; // orders-all
                  })
                  .map(o => (
                    <tr 
                      key={o.id} 
                      className={`hover:bg-gray-50/50 dark:hover:bg-gray-750/30 transition-colors ${
                        selectedManagerOrderId === o.id ? 'bg-primary/5 dark:bg-primary/10' : ''
                      }`}
                    >
                      <td className="px-5 py-4.5 font-bold text-gray-900 dark:text-white text-base whitespace-nowrap">{o.id}</td>
                      <td className="px-5 py-4.5 font-semibold text-gray-850 dark:text-gray-250 min-w-[180px]">
                        {o.customerName || o.customer}
                      </td>
                      <td className="px-5 py-4.5 text-gray-500 font-medium whitespace-nowrap">{o.date}</td>
                      <td className="px-5 py-4.5 font-bold text-primary text-base whitespace-nowrap">{o.total.toLocaleString('vi-VN')} đ</td>
                      <td className="px-5 py-4.5 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-md text-xs font-bold ${
                          o.status === 'Chờ xác nhận' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/35 dark:text-yellow-400' :
                          o.status === 'Đang đóng gói' ? 'bg-orange-100 text-orange-850 dark:bg-orange-900/35 dark:text-orange-400' :
                          o.status === 'Đang giao hàng' || o.status === 'Đang giao' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/35 dark:text-blue-400' :
                          o.status === 'Đã giao thành công' || o.status === 'Hoàn thành' ? 'bg-green-100 text-green-800 dark:bg-green-900/35 dark:text-green-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/35 dark:text-red-400'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-5 py-4.5 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setSelectedManagerOrderId(o.id)}
                            className="bg-primary/10 hover:bg-primary text-primary hover:text-white p-2 rounded-lg transition-colors cursor-pointer"
                            title="Xem chi tiết đơn hàng"
                          >
                            <Eye size={14} />
                          </button>
                          {o.status === 'Chờ xác nhận' && (
                            <button 
                              onClick={() => handleUpdateOrderStatus(o.id, 'Đang đóng gói')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-colors cursor-pointer"
                              title="Xác nhận đơn hàng"
                            >
                              <Check size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Selected Order Details (4/12 width) */}
        <div className="xl:col-span-4">
          {selectedManagerOrderId ? (
            (() => {
              const o = ordersList.find(order => order.id === selectedManagerOrderId);
              if (!o) return null;
              return (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-150 dark:border-gray-700 space-y-6 sticky top-24 animate-fade-in">
                  <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-700 pb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">Chi tiết đơn {o.id}</h3>
                      <span className="text-xs text-gray-400">Ngày đặt: {o.date}</span>
                    </div>
                    <button 
                      onClick={() => setSelectedManagerOrderId(null)}
                      className="text-gray-400 hover:text-gray-650 text-sm font-semibold border border-gray-200 dark:border-gray-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      Đóng
                    </button>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-2 text-sm">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">Thông tin khách hàng</h4>
                    <p className="text-gray-850 dark:text-gray-200"><span className="font-bold">Người nhận:</span> {o.customerName || o.customer}</p>
                    <p className="text-gray-850 dark:text-gray-200"><span className="font-bold">Điện thoại:</span> {o.customerPhone || 'Chưa cung cấp'}</p>
                    <p className="text-gray-850 dark:text-gray-200"><span className="font-bold">Địa chỉ giao:</span> {o.shippingAddress || 'Chưa cung cấp'}</p>
                    <p className="text-gray-850 dark:text-gray-200"><span className="font-bold">Thanh toán:</span> {o.paymentMethod || 'Thanh toán khi nhận hàng (COD)'}</p>
                  </div>

                  {/* Items */}
                  <div className="space-y-3.5 border-t border-b border-gray-100 dark:border-gray-700 py-4">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">Sản phẩm đã mua</h4>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {Array.isArray(o.items) ? (
                        o.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm gap-2">
                            <span className="text-gray-850 dark:text-gray-200 font-medium line-clamp-1 flex-1">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="font-bold text-gray-900 dark:text-white shrink-0">
                              {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">{o.items}</p>
                      )}
                    </div>
                    <div className="flex justify-between items-center pt-2 font-bold text-base">
                      <span className="text-gray-900 dark:text-white">Tổng cộng:</span>
                      <span className="text-primary">{o.total.toLocaleString('vi-VN')} đ</span>
                    </div>
                  </div>

                  {/* Status Update Actions */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">Cập nhật trạng thái</h4>
                    
                    {/* Big Confirmation button */}
                    {o.status === 'Chờ xác nhận' && (
                      <button 
                        onClick={() => handleUpdateOrderStatus(o.id, 'Đang đóng gói')}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Check size={18} /> Xác Nhận Đơn Hàng
                      </button>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">Chọn trạng thái khác:</label>
                      <select 
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-xl block p-3 outline-none font-bold"
                      >
                        <option value="Chờ xác nhận">Chờ xác nhận</option>
                        <option value="Đang đóng gói">Đang đóng gói</option>
                        <option value="Đang giao hàng">Đang giao hàng</option>
                        <option value="Đã giao thành công">Đã giao thành công</option>
                        <option value="Đã hủy">Đã hủy</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-dashed border-gray-250 dark:border-gray-700 text-center text-gray-500">
              Chọn một đơn hàng từ danh sách bên trái để xem chi tiết biên nhận và thực hiện cập nhật trạng thái.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StaffOrders;
