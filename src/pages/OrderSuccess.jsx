import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Home, MapPin, CreditCard, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getOrderById } from '../api/index';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [orderDetail, setOrderDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!orderId || orderId === 'success') return;

    let active = true;

    Promise.resolve()
      .then(() => {
        if (active) setIsLoading(true);
        return getOrderById(orderId);
      })
      .then((res) => {
        if (!active) return;
        setOrderDetail(res?.data ?? res);
      })
      .catch(() => {
        if (active) setOrderDetail(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [orderId]);

  const items = orderDetail?.orderItemsList ?? orderDetail?.items ?? [];
  const totalAmount =
    orderDetail?.totalPrice ??
    orderDetail?.totalAmount ??
    orderDetail?.total ??
    items.reduce((sum, item) => sum + Number(item.price ?? item.product?.price ?? 0) * Number(item.quantity ?? 1), 0);
  const shippingAddress = orderDetail?.shippingAddress ?? orderDetail?.address;
  const paymentMethod = orderDetail?.paymentMethod ?? orderDetail?.method;

  return (
    <div className="min-h-[80vh] bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 max-w-lg w-full p-8 text-center"
      >
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Đặt Hàng Thành Công!
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
          Cảm ơn bạn đã tin tưởng và mua sắm tại Yggdrasil. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao.
        </p>

        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 mb-6 border border-gray-100 dark:border-gray-700 flex items-center justify-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Mã đơn hàng:</span>
          <span className="font-mono font-bold text-primary text-lg">#{orderId}</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 py-4 mb-6">
            <Loader2 size={16} className="animate-spin text-primary" /> Đang tải chi tiết đơn hàng...
          </div>
        ) : orderDetail && (
          <div className="text-left bg-gray-50 dark:bg-gray-900/40 rounded-2xl p-4 mb-6 border border-gray-100 dark:border-gray-700 space-y-3 text-sm">
            {shippingAddress && (
              <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                <span>{shippingAddress}</span>
              </div>
            )}
            {paymentMethod && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <CreditCard size={16} className="text-primary shrink-0" />
                <span>
                  {paymentMethod === 'BANK_TRANSFER'
                    ? 'Chuyển khoản ngân hàng'
                    : paymentMethod === 'COD'
                      ? 'Thanh toán khi nhận hàng (COD)'
                      : paymentMethod}
                </span>
              </div>
            )}
            {items.length > 0 && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-1.5">
                {items.map((item, idx) => (
                  <div key={item.id ?? idx} className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                    <span className="truncate pr-2">
                      {item.product?.name ?? item.productName ?? item.name ?? `Sản phẩm #${item.product?.id ?? item.productId}`} x{item.quantity}
                    </span>
                    <span className="font-semibold shrink-0">
                      {(Number(item.price ?? item.product?.price ?? 0) * Number(item.quantity ?? 1)).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                ))}
              </div>
            )}
            {totalAmount > 0 && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center font-bold">
                <span className="text-gray-700 dark:text-gray-200">Tổng tiền:</span>
                <span className="text-primary text-base">{Number(totalAmount).toLocaleString('vi-VN')} đ</span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            to="/orders"
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <Package size={18} /> Xem Đơn Hàng Của Bạn
          </Link>

          <Link
            to="/"
            className="w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Home size={18} /> Về Trang Chủ
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
