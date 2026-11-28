import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Lock, Unlock, Mail, Phone, User,
  ShoppingBag, Loader2, AlertCircle, TrendingUp, Package,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotification } from '../../context/NotificationContext';
import { getCustomerById, toggleCustomerStatus, formatCustomerStatus } from '../../api/customers';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (value) =>
  Number(value ?? 0).toLocaleString('vi-VN') + ' đ';

const fmtDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const STATUS_MAP = {
  PENDING:   { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  CONFIRMED: { label: 'Đã xác nhận',  color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  SHIPPING:  { label: 'Đang giao',    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
  DELIVERED: { label: 'Đã giao',      color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  CANCELLED: { label: 'Đã hủy',       color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

// ─── Component ─────────────────────────────────────────────────────────────────

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lockLoading, setLockLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Fetch customer detail ──────────────────────────────────────────────────
  const fetchCustomer = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCustomerById(id);
      setCustomer(data);
    } catch (err) {
      setError(err.message || 'Không thể tải thông tin khách hàng.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  // ── Toggle lock / unlock ───────────────────────────────────────────────────
  const handleToggleLock = async () => {
    const isActive = customer?.status === 'ACTIVE';
    const actionLabel = isActive ? 'khóa' : 'mở khóa';

    showNotification({
      type: 'confirm',
      title: isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản',
      message: `Bạn có chắc muốn ${actionLabel} tài khoản của "${customer.fullName}"?`,
      onConfirm: async () => {
        setLockLoading(true);
        try {
          const result = await toggleCustomerStatus(id);
          // Cập nhật state local ngay lập tức (optimistic)
          setCustomer((prev) => ({ ...prev, status: result.status }));
          showNotification({
            type: 'success',
            message: result.message || `Đã ${actionLabel} tài khoản thành công!`,
          });
        } catch (err) {
          showNotification({ type: 'error', message: err.message || `Không thể ${actionLabel} tài khoản.` });
        } finally {
          setLockLoading(false);
        }
      },
    });
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-gray-400">
        <Loader2 size={40} className="animate-spin text-primary" />
        <p className="text-sm font-medium">Đang tải thông tin khách hàng...</p>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error || !customer) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-gray-400">
        <AlertCircle size={40} className="text-red-400" />
        <p className="text-sm font-medium text-red-500">{error || 'Không tìm thấy khách hàng.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-2 text-sm text-primary underline hover:no-underline"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const isActive = customer.status === 'ACTIVE';
  const statusLabel = formatCustomerStatus(customer.status);
  const purchaseHistory = customer.purchaseHistory ?? [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/staff/customers')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Chi Tiết Khách Hàng</h1>
          <p className="text-sm text-gray-500 mt-0.5">ID: #{customer.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Left Column: Profile Card ─────────────────────────────────── */}
        <div className="xl:col-span-1 space-y-6">
          {/* Profile summary */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold mb-4 select-none">
              {customer.fullName?.charAt(0)?.toUpperCase() ?? '?'}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{customer.fullName}</h2>
            <p className="text-gray-400 text-sm mb-4">{customer.email}</p>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isActive
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              {statusLabel}
            </span>

            {/* Stats */}
            <div className="w-full mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-700/50 pt-6">
              <div>
                <div className="flex items-center justify-center gap-1 text-gray-400 text-xs mb-1">
                  <TrendingUp size={12} />
                  <span>Tổng chi tiêu</span>
                </div>
                <p className="font-bold text-primary">{fmtCurrency(customer.totalSpending)}</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-gray-400 text-xs mb-1">
                  <Package size={12} />
                  <span>Tổng đơn</span>
                </div>
                <p className="font-bold text-gray-900 dark:text-white">{customer.totalOrders ?? 0}</p>
              </div>
            </div>
          </div>

          {/* Admin actions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Thao tác quản trị</h3>
            <div className="space-y-3">
              <button
                onClick={handleToggleLock}
                disabled={lockLoading}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                  isActive
                    ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}
              >
                {lockLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : isActive ? (
                  <><Lock size={18} /> Khóa tài khoản</>
                ) : (
                  <><Unlock size={18} /> Mở khóa tài khoản</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Right Column: Info & Purchase History ─────────────────────── */}
        <div className="xl:col-span-2 space-y-6">
          {/* Contact info (read-only) */}
          <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Thông Tin Liên Hệ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <User size={16} /> Họ và Tên
                </label>
                <div className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-650 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white font-medium">
                  {customer.fullName}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Mail size={16} /> Email
                </label>
                <div className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-650 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white font-medium">
                  {customer.email}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Phone size={16} /> Số điện thoại
                </label>
                <div className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-650 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white font-medium">
                  {customer.phone || <span className="text-gray-400 italic">Chưa cập nhật</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Purchase history */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700/50">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShoppingBag size={20} className="text-primary" /> Lịch sử mua hàng
                {purchaseHistory.length > 0 && (
                  <span className="ml-auto text-sm font-normal text-gray-500">
                    {purchaseHistory.length} đơn hàng
                  </span>
                )}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-655 dark:text-gray-400">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-bold">
                  <tr>
                    <th className="px-5 py-4 whitespace-nowrap">Mã ĐH</th>
                    <th className="px-5 py-4 whitespace-nowrap">Ngày đặt</th>
                    <th className="px-5 py-4 whitespace-nowrap">Tổng tiền</th>
                    <th className="px-5 py-4 whitespace-nowrap">Thanh toán</th>
                    <th className="px-5 py-4 whitespace-nowrap">Trạng thái</th>
                    <th className="px-5 py-4 min-w-[180px]">Địa chỉ giao hàng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
                  {purchaseHistory.length > 0 ? (
                    purchaseHistory.map((o) => {
                      const statusInfo = STATUS_MAP[o.status] ?? {
                        label: o.status,
                        color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
                      };
                      return (
                        <tr key={o.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-750/30 transition-colors">
                          <td className="px-5 py-4.5 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                            #{o.id}
                          </td>
                          <td className="px-5 py-4.5 text-gray-500 whitespace-nowrap">{fmtDate(o.orderDate)}</td>
                          <td className="px-5 py-4.5 font-bold text-primary whitespace-nowrap">
                            {fmtCurrency(o.totalPrice)}
                          </td>
                          <td className="px-5 py-4.5 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                o.paymentStatus
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {o.paymentStatus ? 'Đã TT' : 'Chưa TT'}
                            </span>
                          </td>
                          <td className="px-5 py-4.5 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="px-5 py-4.5 text-gray-500 text-xs">{o.shippingAddress || '—'}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-5 py-10 text-center text-gray-400">
                        <div className="flex flex-col items-center gap-2">
                          <ShoppingBag size={32} className="opacity-30" />
                          <p>Khách hàng chưa có đơn hàng nào.</p>
                        </div>
                      </td>
                    </tr>
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
