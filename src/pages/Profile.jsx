import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  User, Mail, Phone, Save, Camera, Lock, Eye, EyeOff,
  Package, ChevronRight, Home, Loader2, ShieldCheck,
  Clock, CheckCircle2, Truck, XCircle, AlertCircle,
} from 'lucide-react';
import { changePassword as apiChangePassword, getMyOrders } from '../api';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Status Config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  PENDING:   { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
  CONFIRMED: { label: 'Đã xác nhận',  color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',   icon: ShieldCheck },
  PACKING:   { label: 'Đang đóng gói', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', icon: Package },
  SHIPPING:  { label: 'Đang giao',    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: Truck },
  DELIVERED: { label: 'Đã giao',      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',  icon: CheckCircle2 },
  COMPLETED: { label: 'Hoàn thành',   color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',  icon: CheckCircle2 },
  CANCELLED: { label: 'Đã hủy',       color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',         icon: XCircle },
  CANCELED:  { label: 'Đã hủy',       color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',         icon: XCircle },
  'Chờ xác nhận':       { label: 'Chờ xác nhận',       color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
  'Đang đóng gói':      { label: 'Đang đóng gói',      color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', icon: Package },
  'Đang giao hàng':     { label: 'Đang giao hàng',     color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: Truck },
  'Đã giao thành công': { label: 'Đã giao thành công', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',  icon: CheckCircle2 },
  'Đã hủy':             { label: 'Đã hủy',             color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',         icon: XCircle },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || { label: status, color: 'bg-gray-100 text-gray-700', icon: AlertCircle };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
      <Icon size={12} />
      {cfg.label}
    </span>
  );
};

// ─── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'info',     label: 'Thông tin cá nhân', icon: User },
  { id: 'password', label: 'Đổi mật khẩu',      icon: Lock },
  { id: 'orders',   label: 'Lịch sử đơn hàng',  icon: Package },
];

// ─── Main Component ────────────────────────────────────────────────────────────
const Profile = () => {
  const { user, updateProfile: ctxUpdateProfile, uploadAvatar: ctxUploadAvatar } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const isInitialMount = useRef(true);

  const [activeTab, setActiveTab] = useState('info');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // ── Profile form state
  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.name || '',
    email:    user?.email || '',
    phone:    user?.phone || '',
    avatar:   user?.avatarUrl || user?.avatar || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // ── Password form state
  const [pwData, setPwData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState({ old: false, new: false, confirm: false });
  const [isSavingPw, setIsSavingPw] = useState(false);

  // ── Orders state
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  // Auth guard
  useEffect(() => {
    if (!user) {
      if (isInitialMount.current) {
        showNotification({
          type: 'confirm',
          title: 'Yêu cầu đăng nhập',
          message: 'Vui lòng đăng nhập để truy cập trang cá nhân.',
          onConfirm: () => navigate('/login'),
        });
      }
      navigate('/login');
    }
    isInitialMount.current = false;
  }, [user, navigate, showNotification]);

  // Sync formData when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || user.name || '',
        email:    user.email || '',
        phone:    user.phone || '',
        avatar:   user.avatarUrl || user.avatar || '',
      });
    }
  }, [user]);

  const userId = user?.id;

  const fetchOrders = useCallback(async () => {
    if (!userId) {
      setOrders([]);
      return;
    }
    setIsLoadingOrders(true);
    setOrdersError(null);
    try {
      const data = await getMyOrders(userId);
      const list = Array.isArray(data)
        ? data
        : (data?.content ?? data?.purchaseHistory ?? data?.data ?? []);
      setOrders(Array.isArray(list) ? list : []);
    } catch (err) {
      const status = err?.status ?? 0;
      if (status === 403 || status === 404 || status === 500 || status === 0) {
        setOrders([]);
        setOrdersError(null);
      } else {
        setOrdersError('Không thể tải lịch sử đơn hàng. Vui lòng thử lại sau.');
      }
    } finally {
      setIsLoadingOrders(false);
    }
  }, [userId]);

  useEffect(() => {
    if (activeTab === 'orders') {
      Promise.resolve().then(() => fetchOrders());
    }
  }, [activeTab, fetchOrders]);

  if (!user) return null;

  // ── Handlers
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showNotification({ type: 'error', message: 'Kích thước ảnh quá lớn. Vui lòng chọn ảnh dưới 2MB.' });
      return;
    }

    const previousAvatar = formData.avatar;
    const reader = new FileReader();
    reader.onloadend = () => setFormData(prev => ({ ...prev, avatar: reader.result }));
    reader.readAsDataURL(file);

    setIsUploadingAvatar(true);
    const uploadedUrl = await ctxUploadAvatar(file);
    setIsUploadingAvatar(false);

    if (uploadedUrl) {
      setFormData(prev => ({ ...prev, avatar: uploadedUrl }));
    } else {
      setFormData(prev => ({ ...prev, avatar: previousAvatar }));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      showNotification({ type: 'error', message: 'Vui lòng nhập họ và tên!' });
      return;
    }
    setIsSaving(true);
    try {
      // ctxUpdateProfile calls PUT /auth/profile + updates user state in context
      const ok = await ctxUpdateProfile({ fullName: formData.fullName, phone: formData.phone });
      if (!ok) throw new Error(); // error already shown by context
    } catch {
      // notification already handled by context
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!pwData.oldPassword || !pwData.newPassword || !pwData.confirmPassword) {
      showNotification({ type: 'error', message: 'Vui lòng điền đầy đủ các trường mật khẩu!' });
      return;
    }
    if (pwData.newPassword !== pwData.confirmPassword) {
      showNotification({ type: 'error', message: 'Mật khẩu mới không khớp!' });
      return;
    }
    if (pwData.newPassword.length < 6) {
      showNotification({ type: 'error', message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' });
      return;
    }
    setIsSavingPw(true);
    try {
      await apiChangePassword({ oldPassword: pwData.oldPassword, newPassword: pwData.newPassword });
      showNotification({ type: 'success', message: 'Đổi mật khẩu thành công!' });
      setPwData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showNotification({ type: 'error', message: err.message || 'Mật khẩu hiện tại không đúng!' });
    } finally {
      setIsSavingPw(false);
    }
  };

  const displayName = user.fullName || user.name || 'Bạn';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary flex items-center gap-1 transition-colors">
            <Home size={14} /> Trang chủ
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 dark:text-gray-100 font-medium">Tài khoản của tôi</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div
                  className="relative group cursor-pointer mb-3"
                  onClick={() => fileInputRef.current?.click()}
                  title="Nhấp để thay đổi ảnh đại diện"
                >
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold overflow-hidden border-4 border-white dark:border-gray-800 shadow-md">
                    {formData.avatar ? (
                      <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : avatarLetter}
                  </div>
                  <div className={`absolute inset-0 bg-black/40 rounded-full flex items-center justify-center transition-opacity ${isUploadingAvatar ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    {isUploadingAvatar ? <Loader2 className="text-white animate-spin" size={22} /> : <Camera className="text-white" size={22} />}
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                />
                <h3 className="font-bold text-gray-900 dark:text-white text-base text-center line-clamp-1">{displayName}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {user.role === 'MANAGER' || user.role === 'Manager' ? 'Quản Lý' : 'Khách Hàng'}
                </p>
              </div>

              {/* Nav tabs */}
              <nav className="flex flex-col gap-1">
                {TABS.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                        activeTab === tab.id
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* ── Main Content ── */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">

              {/* ─── Tab: Thông tin cá nhân ─── */}
              {activeTab === 'info' && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8"
                >
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                    Thông Tin Cá Nhân
                  </h2>

                  <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
                    {/* Họ và tên */}
                    <div className="flex flex-col gap-1.5">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <User size={15} className="text-gray-400" /> Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))}
                        className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary border border-gray-200 dark:border-gray-600 transition-all text-sm"
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </div>

                    {/* Email (read-only) */}
                    <div className="flex flex-col gap-1.5">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <Mail size={15} className="text-gray-400" /> Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={formData.email}
                          readOnly
                          className="w-full bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-xl py-3 px-4 border border-gray-200 dark:border-gray-600 cursor-not-allowed text-sm"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-0.5 rounded">
                          Không thể thay đổi
                        </span>
                      </div>
                    </div>

                    {/* Số điện thoại */}
                    <div className="flex flex-col gap-1.5">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <Phone size={15} className="text-gray-400" /> Số điện thoại
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                        className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary border border-gray-200 dark:border-gray-600 transition-all text-sm"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm ${
                          isSaving ? 'bg-primary/70 cursor-not-allowed text-white' : 'bg-primary hover:bg-primary-dark text-white hover:shadow-md active:scale-95'
                        }`}
                      >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* ─── Tab: Đổi mật khẩu ─── */}
              {activeTab === 'password' && (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8"
                >
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                    Đổi Mật Khẩu
                  </h2>
                  <form onSubmit={handleSavePassword} className="flex flex-col gap-5 max-w-md">
                    {[
                      { key: 'old',     label: 'Mật khẩu hiện tại', field: 'oldPassword' },
                      { key: 'new',     label: 'Mật khẩu mới',       field: 'newPassword' },
                      { key: 'confirm', label: 'Xác nhận mật khẩu',   field: 'confirmPassword' },
                    ].map(({ key, label, field }) => (
                      <div key={key} className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {label} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPw[key] ? 'text' : 'password'}
                            value={pwData[field]}
                            onChange={e => setPwData(p => ({ ...p, [field]: e.target.value }))}
                            className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl py-3 pl-4 pr-12 outline-none focus:ring-2 focus:ring-primary border border-gray-200 dark:border-gray-600 transition-all text-sm"
                            placeholder={`Nhập ${label.toLowerCase()}`}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPw(p => ({ ...p, [key]: !p[key] }))}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                          >
                            {showPw[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-start pt-4 border-t border-gray-100 dark:border-gray-700">
                      <button
                        type="submit"
                        disabled={isSavingPw}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm ${
                          isSavingPw ? 'bg-primary/70 cursor-not-allowed text-white' : 'bg-primary hover:bg-primary-dark text-white hover:shadow-md active:scale-95'
                        }`}
                      >
                        {isSavingPw ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                        {isSavingPw ? 'Đang lưu...' : 'Đổi mật khẩu'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* ─── Tab: Lịch sử đơn hàng ─── */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="px-6 md:px-8 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lịch Sử Đơn Hàng</h2>
                    <Link to="/orders" className="text-sm font-semibold text-primary hover:underline">
                      Theo dõi chi tiết →
                    </Link>
                  </div>

                  {isLoadingOrders ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
                      <Loader2 size={36} className="animate-spin text-primary" />
                      <p className="text-sm">Đang tải lịch sử đơn hàng...</p>
                    </div>
                  ) : ordersError ? (
                    <div className="text-center py-16 text-gray-500">
                      <p className="text-sm mb-3">{ordersError}</p>
                      <button onClick={fetchOrders} className="text-primary text-sm font-semibold hover:underline">
                        Thử lại
                      </button>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-500">
                      <Package size={48} className="text-gray-300" />
                      <div className="text-center">
                        <p className="font-semibold text-gray-700 dark:text-gray-300">Chưa có đơn hàng nào</p>
                        <p className="text-sm mt-1">Hãy khám phá sản phẩm và đặt hàng ngay!</p>
                      </div>
                      <Link
                        to="/"
                        className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-dark transition-colors"
                      >
                        Mua sắm ngay
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {orders.map((order, idx) => {
                        const orderAddress = order.shippingAddress || order.address;
                        const orderDate = order.orderDate || order.createdAt || order.date;
                        const orderTotal =
                          order.totalPrice ??
                          order.totalAmount ??
                          order.total ??
                          (Array.isArray(order.orderItemsList)
                            ? order.orderItemsList.reduce((sum, item) => sum + Number(item.price || item.product?.price || 0) * Number(item.quantity || 1), 0)
                            : 0);
                        const paymentLabel =
                          order.paymentStatus === true || order.paymentStatus === 'PAID'
                            ? { text: '✓ Đã thanh toán', cls: 'text-green-600' }
                            : (order.method || order.paymentMethod) === 'BANK_TRANSFER'
                              ? { text: 'Chuyển khoản ngân hàng', cls: 'text-blue-600' }
                              : { text: 'Thanh toán khi nhận hàng (COD)', cls: 'text-yellow-600' };

                        return (
                          <motion.div
                            key={order.id ?? idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            className="px-6 md:px-8 py-5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                                    #{order.id}
                                  </span>
                                  <StatusBadge status={order.status} />
                                </div>
                                {orderAddress && (
                                  <p className="text-sm text-gray-500 line-clamp-1 max-w-sm">
                                    📍 {orderAddress}
                                  </p>
                                )}
                                {orderDate && (
                                  <p className="text-xs text-gray-400 mt-1">
                                    🗓 {new Date(orderDate).toLocaleDateString('vi-VN', {
                                      day: '2-digit', month: '2-digit', year: 'numeric',
                                      hour: '2-digit', minute: '2-digit'
                                    })}
                                  </p>
                                )}
                              </div>
                              <div className="text-right shrink-0">
                                <p className="font-bold text-primary text-lg">
                                  {Number(orderTotal || 0).toLocaleString('vi-VN')} đ
                                </p>
                                <p className={`text-xs mt-1 font-medium ${paymentLabel.cls}`}>
                                  {paymentLabel.text}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
