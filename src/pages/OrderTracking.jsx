import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { getMyOrders, getOrderById, cancelOrder } from '../api/index';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowLeft,
  FileText,
  MapPin,
  CreditCard,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  Loader2,
  RefreshCw,
} from 'lucide-react';

const STATUS_MAP = {
  PENDING:              { step: 0, label: 'Chờ xác nhận',       badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  CONFIRMED:            { step: 1, label: 'Đang đóng gói',      badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  PACKING:              { step: 1, label: 'Đang đóng gói',      badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  PROCESSING:           { step: 1, label: 'Đang đóng gói',      badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  SHIPPING:             { step: 2, label: 'Đang giao hàng',     badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  DELIVERED:            { step: 3, label: 'Đã giao thành công', badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  COMPLETED:            { step: 3, label: 'Đã giao thành công', badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  CANCELLED:            { step: -1, label: 'Đã hủy',            badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  CANCELED:             { step: -1, label: 'Đã hủy',            badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  'Chờ xác nhận':       { step: 0, label: 'Chờ xác nhận',       badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  'Đã xác nhận':        { step: 1, label: 'Đang đóng gói',      badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  'Đang đóng gói':      { step: 1, label: 'Đang đóng gói',      badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  'Đang giao hàng':     { step: 2, label: 'Đang giao hàng',     badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  'Đang giao':          { step: 2, label: 'Đang giao hàng',     badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  'Đã giao thành công': { step: 3, label: 'Đã giao thành công', badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  'Hoàn thành':         { step: 3, label: 'Đã giao thành công', badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  'Đã hủy':             { step: -1, label: 'Đã hủy',            badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

const normalizeOrder = (raw, currentUser) => {
  if (!raw) return null;
  const rawItems = raw.orderItemsList ?? raw.items ?? [];
  const items = Array.isArray(rawItems)
    ? rawItems.map((it, idx) => {
        const prod = it.product ?? {};
        return {
          id: it.id ?? prod.id ?? idx,
          name: prod.name ?? it.productName ?? it.name ?? `Sản phẩm #${prod.id ?? it.productId ?? ''}`,
          image: prod.mainImageUrl ?? prod.image ?? it.image ?? '',
          category: prod.categoryName ?? prod.category?.name ?? it.category ?? '',
          price: Number(it.price ?? prod.price ?? 0),
          quantity: Number(it.quantity ?? 1),
        };
      })
    : [];

  const computedTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = Number(raw.totalPrice ?? raw.totalAmount ?? raw.total ?? computedTotal);
  const rawDate = raw.orderDate ?? raw.createdAt ?? raw.date;
  const formattedDate = rawDate
    ? (() => {
        const d = new Date(rawDate);
        return Number.isNaN(d.getTime())
          ? String(rawDate)
          : d.toLocaleString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            });
      })()
    : 'Vừa xong';

  const statusRaw = raw.status ?? 'PENDING';
  const statusInfo = STATUS_MAP[statusRaw] ?? STATUS_MAP[String(statusRaw).toUpperCase()] ?? {
    step: 0,
    label: String(statusRaw),
    badge: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };

  const methodRaw = raw.method ?? raw.paymentMethod ?? 'COD';
  const paymentMethodLabel =
    methodRaw === 'BANK_TRANSFER'
      ? 'Chuyển khoản ngân hàng'
      : methodRaw === 'COD'
        ? 'Thanh toán khi nhận hàng (COD)'
        : String(methodRaw);

  return {
    id: raw.id,
    date: formattedDate,
    total,
    status: statusInfo.label,
    statusStep: statusInfo.step,
    statusBadge: statusInfo.badge,
    isCancelled: statusInfo.step === -1,
    canCancel: statusInfo.step === 0,
    shippingAddress: raw.shippingAddress ?? raw.address ?? '',
    paymentMethod: paymentMethodLabel,
    customerName: raw.customerName ?? raw.receiverName ?? raw.user?.fullName ?? currentUser?.fullName ?? currentUser?.name ?? 'Khách hàng',
    customerPhone: raw.customerPhone ?? raw.receiverPhone ?? raw.user?.phone ?? currentUser?.phone ?? '',
    items,
  };
};

const OrderTracking = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!user?.id) {
      setOrders([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyOrders(user.id);

      console.log("DATA:", data);
      console.log("IS ARRAY:", Array.isArray(data));

      const list = Array.isArray(data) ? data : [];

      const normalized = list
          .map((order) => normalizeOrder(order, user))
          .filter(Boolean);

      console.log("Orders to display:", normalized);

      setOrders(normalized);
    } catch (err) {
      if (err?.status === 404) {
        setOrders([]);
      } else {
        setError(err.message || 'Không thể tải danh sách đơn hàng.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      Promise.resolve().then(() => fetchOrders());
    }
  }, [user?.id, fetchOrders]);

  const handleSelectOrder = async (orderId) => {
    setSelectedOrderId(orderId);
    const fromList = orders.find((o) => o.id === orderId) || null;
    setSelectedOrderDetail(fromList);

    setIsLoadingDetail(true);
    try {
      const data = await getOrderById(orderId);
      const normalized = normalizeOrder(data?.data ?? data, user);
      if (normalized) setSelectedOrderDetail(normalized);
    } catch {
      // Giữ thông tin từ danh sách nếu API chi tiết tạm lỗi
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleCancelOrder = (orderId) => {
    showNotification({
      type: 'confirm',
      title: 'Xác nhận hủy đơn',
      message: `Bạn có chắc chắn muốn hủy đơn hàng #${orderId}?`,
      onConfirm: async () => {
        setIsCancelling(true);
        try {
          await cancelOrder(orderId);
          showNotification({ type: 'success', message: `Đã hủy đơn hàng #${orderId} thành công.` });
          await fetchOrders();
          if (selectedOrderId === orderId) {
            setSelectedOrderDetail((prev) =>
              prev
                ? {
                    ...prev,
                    status: 'Đã hủy',
                    statusStep: -1,
                    statusBadge: STATUS_MAP.CANCELLED.badge,
                    isCancelled: true,
                    canCancel: false,
                  }
                : null
            );
          }
        } catch (err) {
          showNotification({ type: 'error', message: err.message || 'Không thể hủy đơn hàng.' });
        } finally {
          setIsCancelling(false);
        }
      },
    });
  };

  const selectedOrder = useMemo(() => {
    if (!selectedOrderId) return null;
    return selectedOrderDetail || orders.find((o) => o.id === selectedOrderId) || null;
  }, [selectedOrderId, selectedOrderDetail, orders]);

  const progressSteps = [
    { status: 'Chờ xác nhận', label: 'Chờ xác nhận', icon: Clock },
    { status: 'Đang đóng gói', label: 'Đang đóng gói', icon: Package },
    { status: 'Đang giao hàng', label: 'Đang giao hàng', icon: Truck },
    { status: 'Đã giao thành công', label: 'Đã giao thành công', icon: CheckCircle2 },
  ];

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!user) {
      if (isInitialMount.current) {
        showNotification({
          type: 'confirm',
          title: 'Yêu cầu đăng nhập',
          message: 'Vui lòng đăng nhập để theo dõi đơn hàng.',
          onConfirm: () => navigate('/login'),
        });
      }
      navigate('/login');
    }
    isInitialMount.current = false;
  }, [user, navigate, showNotification]);

  if (!user) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4">

        <AnimatePresence mode="wait">
          {!selectedOrder ? (
            /* VIEW 1: DANH SÁCH ĐƠN HÀNG */
            <motion.div
              key="list-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight font-sans">Theo Dõi Đơn Hàng</h1>
                  <p className="text-base text-gray-500 mt-1">Danh sách đơn hàng bạn đã đặt mua tại Yggdrasil</p>
                </div>
                <button
                  onClick={fetchOrders}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-primary hover:text-primary transition-colors"
                >
                  <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} /> Làm mới
                </button>
              </div>

              {isLoading ? (
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-16 text-center border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center gap-4">
                  <Loader2 size={36} className="animate-spin text-primary" />
                  <p className="text-sm text-gray-500">Đang tải đơn hàng của bạn...</p>
                </div>
              ) : error ? (
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
                  <p className="text-red-500 font-medium mb-4">{error}</p>
                  <button onClick={fetchOrders} className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold">
                    Thử lại
                  </button>
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-700 shadow-sm max-w-xl mx-auto animate-fade-in">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <ShoppingBag size={36} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Chưa có đơn hàng nào</h3>
                  <p className="text-gray-500 mb-6 text-sm">Hệ thống chưa ghi nhận đơn hàng nào được đặt bởi tài khoản của bạn.</p>
                  <Link to="/" className="bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3 rounded-full transition-colors shadow-md inline-block text-sm">
                    Mua sắm sản phẩm ngay
                  </Link>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 font-bold border-b border-gray-100 dark:border-gray-750">
                        <tr>
                          <th className="px-6 py-4">Mã đơn hàng</th>
                          <th className="px-6 py-4">Ngày đặt</th>
                          <th className="px-6 py-4">Tổng tiền</th>
                          <th className="px-6 py-4">Trạng thái</th>
                          <th className="px-6 py-4 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
                        {orders.map((o) => (
                          <tr key={o.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-750/30 transition-colors">
                            <td className="px-6 py-5 font-bold text-gray-900 dark:text-white">#{o.id}</td>
                            <td className="px-6 py-5 text-gray-500 font-semibold">{o.date}</td>
                            <td className="px-6 py-5 font-extrabold text-primary text-base">
                              {o.total.toLocaleString('vi-VN')} ₫
                            </td>
                            <td className="px-6 py-5">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${o.statusBadge}`}>
                                {o.status}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <div className="inline-flex items-center gap-3">
                                {o.canCancel && (
                                  <button
                                    onClick={() => handleCancelOrder(o.id)}
                                    disabled={isCancelling}
                                    className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline cursor-pointer disabled:opacity-50"
                                  >
                                    Hủy đơn
                                  </button>
                                )}
                                <button
                                  onClick={() => handleSelectOrder(o.id)}
                                  className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark hover:underline cursor-pointer"
                                >
                                  Xem chi tiết <ChevronRight size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            /* VIEW 2: CHI TIẾT ĐƠN HÀNG */
            <motion.div
              key="detail-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Nút quay lại */}
              <div className="flex justify-between items-center flex-wrap gap-3">
                <button
                  onClick={() => {
                    setSelectedOrderId(null);
                    setSelectedOrderDetail(null);
                  }}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors font-bold cursor-pointer"
                >
                  <ArrowLeft size={16} /> Quay lại danh sách đơn hàng
                </button>
                <div className="flex items-center gap-3">
                  {selectedOrder.canCancel && (
                    <button
                      onClick={() => handleCancelOrder(selectedOrder.id)}
                      disabled={isCancelling}
                      className="px-4 py-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      {isCancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
                    </button>
                  )}
                  <span className="text-xs text-gray-400 font-semibold bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                    Mã giao dịch: #{selectedOrder.id}
                  </span>
                </div>
              </div>

              {/* Card Tiến trình Đơn hàng */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-5 mb-8">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <FileText size={20} className="text-primary" /> Tiến trình đơn hàng #{selectedOrder.id}
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">Khởi tạo giao dịch lúc: {selectedOrder.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isLoadingDetail && <Loader2 size={14} className="animate-spin text-primary" />}
                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                      Trạng thái: <span className="text-primary font-bold">{selectedOrder.status}</span>
                    </span>
                  </div>
                </div>

                {/* Timeline Progress */}
                {selectedOrder.isCancelled ? (
                  <div className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 p-6 rounded-2xl flex items-center justify-center gap-3 font-bold text-base border border-red-150 dark:border-red-900/30">
                    <XCircle size={26} /> Đơn hàng này đã bị hủy bỏ.
                  </div>
                ) : (
                  <div className="relative py-6">
                    <div className="overflow-x-auto select-none hide-scrollbar">
                      <div className="flex items-center justify-between relative z-10 px-4 min-w-[500px] md:px-12">
                        {progressSteps.map((step, index) => {
                          const Icon = step.icon;
                          const currentIndex = selectedOrder.statusStep;
                          const isCompleted = index <= currentIndex;
                          const isCurrent = index === currentIndex;

                          return (
                            <div key={step.status} className="flex flex-col items-center w-1/4 relative">
                              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border-4 bg-white dark:bg-gray-800 z-10 transition-all duration-500 ${
                                isCompleted
                                  ? 'border-primary text-primary dark:border-primary-light dark:text-primary-light'
                                  : 'border-gray-200 dark:border-gray-700 text-gray-400'
                              } ${isCurrent ? 'scale-110 shadow-lg shadow-primary/20 ring-4 ring-primary/10' : ''}`}>
                                <Icon size={20} className={isCurrent ? 'animate-pulse' : ''} />
                              </div>
                              <p className={`mt-3 text-xs md:text-sm font-bold text-center ${
                                isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                              } ${isCurrent ? 'text-primary dark:text-primary-light font-extrabold' : ''}`}>
                                {step.label}
                              </p>
                              <span className={`text-[10px] mt-1 block font-bold ${
                                isCurrent ? 'text-primary dark:text-primary-light' : 'text-gray-400'
                              }`}>
                                {isCurrent ? '⏳ Đang xử lý' : isCompleted ? '✔ Đã xong' : '○ Chờ'}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="absolute top-12 md:top-13 left-[12%] right-[12%] h-1 bg-gray-200 dark:bg-gray-700 -z-0 min-w-[400px]">
                        <div
                          className="h-full bg-primary dark:bg-primary-light transition-all duration-1000 ease-in-out"
                          style={{
                            width: `${(Math.max(0, selectedOrder.statusStep) / (progressSteps.length - 1)) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chi tiết biên nhận mua sắm */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">
                    Danh sách sản phẩm mua
                  </h3>

                  {selectedOrder.items.length === 0 ? (
                    <p className="text-sm text-gray-500 py-4">Không có dữ liệu chi tiết sản phẩm cho đơn hàng này.</p>
                  ) : (
                    <div className="space-y-4 divide-y divide-gray-105 dark:divide-gray-700">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center pt-4 first:pt-0">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1592424001806-538421319246?auto=format&fit=crop&q=80&w=200'}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-650 shrink-0"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1592424001806-538421319246?auto=format&fit=crop&q=80&w=200'; }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                              {item.name}
                            </h4>
                            {item.category && (
                              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{item.category}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-0.5 font-medium">
                              Đơn giá: {item.price.toLocaleString('vi-VN')} ₫
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs text-gray-550">Số lượng: <span className="font-bold text-gray-905 dark:text-white">x{item.quantity}</span></p>
                            <p className="font-extrabold text-primary text-sm mt-1">
                              {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-5 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <span className="font-bold text-gray-900 dark:text-white text-base">Tổng giá trị đơn hàng</span>
                    <span className="font-extrabold text-primary text-xl">
                      {selectedOrder.total.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                </div>

                {/* Thông tin vận chuyển & thanh toán */}
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
                    <h3 className="font-bold text-base text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2.5 flex items-center gap-2">
                      <MapPin size={16} className="text-primary" /> Địa chỉ giao nhận
                    </h3>
                    <div className="space-y-2.5 text-sm">
                      <div>
                        <span className="text-gray-450 block text-[11px] uppercase tracking-wider font-bold">Người nhận:</span>
                        <span className="font-bold text-gray-900 dark:text-white">{selectedOrder.customerName}</span>
                      </div>
                      {selectedOrder.customerPhone && (
                        <div>
                          <span className="text-gray-450 block text-[11px] uppercase tracking-wider font-bold">Số điện thoại:</span>
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedOrder.customerPhone}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-450 block text-[11px] uppercase tracking-wider font-bold">Địa chỉ giao:</span>
                        <span className="text-gray-750 dark:text-gray-300 leading-relaxed font-semibold">{selectedOrder.shippingAddress}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
                    <h3 className="font-bold text-base text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2.5 flex items-center gap-2">
                      <CreditCard size={16} className="text-primary" /> Phương thức thanh toán
                    </h3>
                    <div className="text-sm">
                      <span className="font-bold text-gray-900 dark:text-white block">{selectedOrder.paymentMethod}</span>
                      <span className="text-xs text-gray-450 mt-1.5 block leading-relaxed font-medium">
                        {selectedOrder.paymentMethod.includes('COD')
                          ? 'Vui lòng thanh toán tiền mặt cho nhân viên giao hàng khi nhận được nông sản.'
                          : 'Chuyển khoản ngân hàng.'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-emerald-50/50 dark:bg-gray-800/40 rounded-3xl p-5 border border-emerald-100 dark:border-gray-700 flex gap-3">
                    <ShieldCheck className="text-primary shrink-0 mt-0.5" size={20} />
                    <div className="text-xs text-gray-600 dark:text-gray-450 leading-relaxed font-semibold">
                      <strong className="text-primary dark:text-primary-light block mb-1">Bảo đảm vận chuyển</strong>
                      Sản phẩm đóng gói cẩn thận, vận chuyển nhanh chóng, cam kết hoàn trả trong vòng 7 ngày nếu có lỗi sản phẩm.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default OrderTracking;
