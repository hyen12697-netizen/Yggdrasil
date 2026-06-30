import { useState, useMemo, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  XCircle,
  Settings as SettingsIcon,
  Image as ImageIcon,
  Package,
  Users,
  AlertTriangle,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Truck,
  RotateCcw,
  Check,
  Percent,
  Calendar,
  Layers,
  Sliders,
  FileSpreadsheet,
  Camera,
  X,
  Copy,
  GripVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { usePromotion } from '../context/PromotionContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { mockCustomers } from '../data/mockData';
import { useNotification } from '../context/NotificationContext';
import { useProduct } from '../context/ProductContext';
import { useBanner } from '../context/BannerContext';
import { useHeroBanner } from '../context/HeroBannerContext';
import { usePopup } from '../context/PopupContext';
import { useStaff } from '../context/StaffContext';
import ReportManager from '../components/manager/ReportManager';
import CategoryManager from '../components/manager/CategoryManager';
import BrandManager from '../components/manager/BrandManager';
import HeroSlider from '../components/HeroSlider';
import { motion } from 'framer-motion';
import { isValidEmail } from '../utils/validators';

import RevenueReport from '../components/manager/reports/RevenueReport';
import OrdersReport from '../components/manager/reports/OrdersReport';
import BestSellersReport from '../components/manager/reports/BestSellersReport';
import NewUsersReport from '../components/manager/reports/NewUsersReport';// Mock Staff
// initialStaff moved to context

const removeVietnameseTones = (str) => {
  if (!str) return '';
  return str
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase();
};

const ManagerDashboard = () => {

  const { promotions, addPromotion, updatePromotion, deletePromotion, togglePromotionStatus } = usePromotion();
  const { showNotification } = useNotification();
  const { user, updateProfile } = useAuth();
  const { popupSettings, updatePopup } = usePopup();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentTab = searchParams.get('tab') || 'dashboard';

  // Profile Edit Form State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '08357757501');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        showNotification({ type: 'error', message: 'Kích thước ảnh quá lớn. Vui lòng chọn ảnh dưới 2MB.' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // State managers
  const { products: productsList, addProduct, updateProduct, deleteProduct: removeProductContext, categories, brands } = useProduct();
  const { orders: ordersList } = useOrders();
  const customersList = mockCustomers; // Using mockData to keep stats functioning

  const { staffList, addStaff } = useStaff();
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffSearch, setStaffSearch] = useState('');

  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Staff',
    username: '',
    password: ''
  });
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [editingPromoId, setEditingPromoId] = useState(null);
  const [promoForm, setPromoForm] = useState({
    title: '',
    description: '',
    type: 'percentage',
    value: '',
    startDate: '',
    endDate: '',
    targetType: 'all',
    targetCategories: [],
    targetProducts: [],
    isActive: true
  });

  // Banner Context & State
  const { banners, addBanner, updateBanner, deleteBanner, toggleBannerStatus } = useBanner();
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    link: '',
    image: '',
    order: 1,
    isActive: true
  });

  // Popup Form State
  const [popupForm, setPopupForm] = useState(popupSettings);

  // Product Search / Add State
  const [prodSearch, setProdSearch] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Phân bón hữu cơ',
    subcategory: 'Phân chuồng',
    price: '',
    oldPrice: '',
    description: '',
    ingredients: '',
    benefits: '',
    packaging: 'Bao 5kg',
    image: '',
    isNew: true,
    rating: 5,
    soldCount: 0,
    stock: 100
  });

  // Edit Product State
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProductErrors, setEditProductErrors] = useState({});

  // Website Settings Form State
  const [webSettings, setWebSettings] = useState({
    siteName: 'Yggdrasil - Nông Nghiệp Xanh',
    hotline: '08357757501',
    email: 'contact@yggdrasil.com',
    address: '123 Đường Nông Nghiệp, TP. Hồ Chí Minh',
    policy: 'Chính sách hoàn trả hàng trong vòng 7 ngày nếu lỗi sản xuất...',
    intro: 'Yggdrasil chuyên cung cấp giải pháp phân bón và hạt giống xanh bền vững.'
  });

  // Promotions Handlers
  const handlePromoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPromoForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    if (editingPromoId) {
      updatePromotion(editingPromoId, promoForm);
      showNotification({ type: 'success', message: 'Cập nhật chương trình khuyến mãi thành công!' });
    } else {
      addPromotion(promoForm);
      showNotification({ type: 'success', message: 'Thêm chương trình khuyến mãi thành công!' });
    }
    setIsPromoModalOpen(false);
  };

  const openPromoModal = (promo = null) => {
    if (promo) {
      setEditingPromoId(promo.id);
      setPromoForm(promo);
    } else {
      setEditingPromoId(null);
      setPromoForm({
        title: '',
        description: '',
        type: 'percentage',
        value: '',
        startDate: '',
        endDate: '',
        targetType: 'all',
        targetCategories: [],
        targetProducts: [],
        isActive: true
      });
    }
    setIsPromoModalOpen(true);
  };

  const handleBannerSubmit = (e) => {
    e.preventDefault();
    if (!bannerForm.image) {
      showNotification({ type: 'error', message: 'Vui lòng tải lên ảnh banner!' });
      return;
    }
    if (editingBanner) {
      updateBanner(editingBanner.id, bannerForm);
      showNotification({ type: 'success', message: 'Đã cập nhật banner thành công!' });
    } else {
      addBanner(bannerForm);
      showNotification({ type: 'success', message: 'Đã thêm banner thành công!' });
    }
    setEditingBanner(null);
    setBannerForm({ title: '', link: '', image: '', order: 1, isActive: true });
  };

  const handleDeleteBanner = (id) => {
    showNotification({
      type: 'confirm',
      message: 'Bạn có chắc chắn muốn xóa banner này?',
      onConfirm: () => {
        deleteBanner(id);
        showNotification({ type: 'success', message: 'Đã xóa banner thành công!' });
      }
    });
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setBannerForm({
      title: banner.title || '',
      link: banner.link || '',
      image: banner.image || '',
      order: banner.order || 1,
      isActive: banner.isActive
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePopupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPopupForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePopupSubmit = (e) => {
    e.preventDefault();
    updatePopup(popupForm);
    showNotification({ type: 'success', message: 'Đã lưu thiết lập popup!' });
  };

  // Add new product handler
  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      showNotification({ type: 'error', message: 'Vui lòng nhập tên và giá sản phẩm' });
      return;
    }
    const created = {
      ...newProduct,
      price: parseFloat(newProduct.price),
      oldPrice: newProduct.oldPrice ? parseFloat(newProduct.oldPrice) : undefined,
      discount: newProduct.oldPrice ? Math.round(((parseFloat(newProduct.oldPrice) - parseFloat(newProduct.price)) / parseFloat(newProduct.oldPrice)) * 100) : undefined,
      image: newProduct.image || '/product-1.png'
    };
    addProduct(created);
    showNotification({ type: 'success', message: 'Thêm sản phẩm thành công!' });
    setNewProduct({
      name: '',
      category: 'Phân bón hữu cơ',
      subcategory: 'Phân chuồng',
      price: '',
      oldPrice: '',
      description: '',
      ingredients: '',
      benefits: '',
      usage: '',
      packaging: 'Bao 5kg',
      image: '',
      isNew: true,
      rating: 5,
      soldCount: 0
    });
    setSearchParams({ tab: 'products-list' });
  };

  // Delete product handler
  const handleDeleteProduct = (id) => {
    showNotification({
      type: 'confirm',
      message: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
      onConfirm: () => {
        removeProductContext(id);
        showNotification({ type: 'success', message: 'Đã xóa sản phẩm thành công!' });
      }
    });
  };

  const openEditProductModal = (product) => {
    setEditingProduct({ ...product });
    setEditProductErrors({});
    setIsEditProductModalOpen(true);
  };

  const closeEditProductModal = () => {
    setIsEditProductModalOpen(false);
    setEditingProduct(null);
    setEditProductErrors({});
  };

  const handleEditProductChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({ ...prev, [name]: value }));
    if (editProductErrors[name]) {
      setEditProductErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEditProductSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!editingProduct.name || !editingProduct.name.trim()) {
      errors.name = 'Tên sản phẩm không được để trống';
    }
    if (!editingProduct.price || parseFloat(editingProduct.price) <= 0) {
      errors.price = 'Giá bán phải lớn hơn 0';
    }
    if (!editingProduct.category) {
      errors.category = 'Vui lòng chọn danh mục';
    }
    if (!editingProduct.image) {
      errors.image = 'Vui lòng chọn ảnh sản phẩm';
    }

    if (Object.keys(errors).length > 0) {
      setEditProductErrors(errors);
      return;
    }

    const updatedPrice = parseFloat(editingProduct.price);
    const oldPrice = editingProduct.oldPrice ? parseFloat(editingProduct.oldPrice) : undefined;

    updateProduct(editingProduct.id, {
      ...editingProduct,
      price: updatedPrice,
      oldPrice: oldPrice,
      discount: oldPrice ? Math.round(((oldPrice - updatedPrice) / oldPrice) * 100) : undefined
    });

    showNotification({ type: 'success', message: 'Cập nhật sản phẩm thành công.' });
    closeEditProductModal();
  };


  // Stats calculation
  const totalProductsCount = productsList.length;
  const totalOrdersCount = ordersList.length;
  const totalCustomersCount = customersList.length;

  const totalRevenue = useMemo(() => {
    return ordersList
      .filter(o => o.status === 'Hoàn thành' || o.status === 'Đang giao' || o.status === 'Đã giao thành công' || o.status === 'Đang giao hàng')
      .reduce((sum, o) => sum + o.total, 0);
  }, [ordersList]);

  // Filtered Products for management view
  const filteredProducts = useMemo(() => {
    if (!prodSearch.trim()) return productsList;
    const searchNormalized = removeVietnameseTones(prodSearch);

    return productsList.filter(p => {
      const nameMatch = removeVietnameseTones(p.name).includes(searchNormalized);
      const idMatch = removeVietnameseTones(p.id.toString()).includes(searchNormalized);
      const catMatch = removeVietnameseTones(p.category).includes(searchNormalized);
      const subCatMatch = removeVietnameseTones(p.subcategory || '').includes(searchNormalized);
      return nameMatch || idMatch || catMatch || subCatMatch;
    });
  }, [productsList, prodSearch]);

  // Top 10 Bestsellers List
  const topBestsellers = useMemo(() => {
    return [...productsList].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0)).slice(0, 10);
  }, [productsList]);

  return (
    <div className="space-y-8">

      {/* 📊 TAB: DASHBOARD */}
      {currentTab === 'dashboard' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Tổng quan hệ thống</h1>
              <p className="text-base text-gray-500 mt-1">Báo cáo tình hình hoạt động, thống kê bán hàng và phê duyệt diễn đàn</p>
            </div>
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 py-2.5 px-4 rounded-xl border border-gray-150 dark:border-gray-700 shadow-sm text-sm text-gray-600 dark:text-gray-300 font-bold">
              <Calendar size={16} className="text-primary" />
              <span>Hôm nay: {new Date().toLocaleDateString('vi-VN')}</span>
            </div>
          </div>

          {/* Stats Cards - Spaced out and enlarged */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 flex items-center gap-5 transition-transform hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Package size={26} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Sản Phẩm</p>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{totalProductsCount}</h3>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 flex items-center gap-5 transition-transform hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <ShoppingBag size={26} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Đơn Hàng</p>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{totalOrdersCount}</h3>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 flex items-center gap-5 transition-transform hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Users size={26} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Khách Hàng</p>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{totalCustomersCount}</h3>
              </div>
            </div>



            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 flex items-center gap-5 transition-transform hover:-translate-y-1 col-span-1 sm:col-span-2 lg:col-span-1 xl:col-span-2">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <DollarSign size={26} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Tổng Doanh Thu</p>
                <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-450 mt-1">
                  {totalRevenue.toLocaleString('vi-VN')} đ
                </h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Chart Area */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 md:p-8 lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Biểu Đồ Tăng Trưởng Doanh Thu</h3>
                <span className="text-sm text-green-500 font-bold flex items-center gap-1.5 bg-green-50 dark:bg-green-950/30 px-3 py-1 rounded-full">
                  <TrendingUp size={16} /> +24% so với trước
                </span>
              </div>

              <div className="h-72 w-full flex items-end relative pt-6">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
                  <line x1="0" y1="50" x2="500" y2="50" stroke="#e2e8f0" strokeDasharray="5,5" className="dark:stroke-gray-700" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#e2e8f0" strokeDasharray="5,5" className="dark:stroke-gray-700" />
                  <line x1="0" y1="150" x2="500" y2="150" stroke="#e2e8f0" strokeDasharray="5,5" className="dark:stroke-gray-700" />

                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5 }}
                    d="M 10 180 Q 100 160 170 120 T 350 70 T 490 30"
                    fill="none"
                    stroke="#2e7d32"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path d="M 10 180 Q 100 160 170 120 T 350 70 T 490 30 L 490 200 L 10 200 Z" fill="url(#chart-grad-primary)" opacity="0.1" />

                  <circle cx="10" cy="180" r="6" fill="#2e7d32" />
                  <circle cx="170" cy="120" r="6" fill="#2e7d32" />
                  <circle cx="350" cy="70" r="6" fill="#2e7d32" />
                  <circle cx="490" cy="30" r="6" fill="#2e7d32" />

                  <defs>
                    <linearGradient id="chart-grad-primary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2e7d32" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 font-semibold px-2">
                  <span>Tuần 1</span>
                  <span>Tuần 2</span>
                  <span>Tuần 3</span>
                  <span>Tuần 4</span>
                </div>
              </div>
            </div>

            {/* Warning Stock */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-6 flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-700/50">
                  <AlertTriangle size={22} className="text-amber-500" />
                  <span>Sắp Hết Hàng Trong Kho</span>
                </h3>
                <div className="space-y-5">
                  {[
                    { name: 'Đất sạch mùn hữu cơ Tribat', stock: 2, sub: 'Giải pháp cải tạo đất' },
                    { name: 'Hạt giống cà chua Cherry F1', stock: 4, sub: 'Hạt giống' },
                    { name: 'Phân dơi nguyên chất Bat Guano', stock: 5, sub: 'Phân dơi' }
                  ].map((p, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block">{p.name}</span>
                        <span className="text-xs text-gray-400 mt-0.5">{p.sub}</span>
                      </div>
                      <span className="bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 font-extrabold px-3 py-1 rounded-lg text-xs shrink-0">
                        Còn {p.stock} bao
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700/50">
                <button
                  onClick={() => setSearchParams({ tab: 'products-list' })}
                  className="w-full text-center text-sm text-primary font-bold hover:underline"
                >
                  Quản lý kho sản phẩm ngay →
                </button>
              </div>
            </div>
          </div>



          {/* Top 10 Bestselling Products */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 md:p-8 space-y-6">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Top 10 Sản Phẩm Đắt Khách Nhất</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-655 dark:text-gray-400">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-bold">
                  <tr>
                    <th className="px-5 py-3 rounded-l-lg">Hình ảnh</th>
                    <th className="px-5 py-3">Tên sản phẩm</th>
                    <th className="px-5 py-3">Nhóm ngành</th>
                    <th className="px-5 py-3">Giá bán</th>
                    <th className="px-5 py-3 rounded-r-lg">Đã bán thực tế</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
                  {topBestsellers.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-750/30">
                      <td className="px-5 py-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded bg-gray-100" />
                      </td>
                      <td className="px-5 py-3 font-extrabold text-gray-900 dark:text-white text-base">{p.name}</td>
                      <td className="px-5 py-3 text-gray-450">{p.category}</td>
                      <td className="px-5 py-3 text-primary font-bold text-base">{p.price.toLocaleString('vi-VN')} đ</td>
                      <td className="px-5 py-3 font-extrabold text-gray-850 dark:text-gray-300">{p.soldCount || 0} sản phẩm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* 📦 TAB: PRODUCTS LIST */}
      {currentTab === 'products-list' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Danh Sách Mặt Hàng</h1>
              <p className="text-sm text-gray-500 mt-0.5">Tìm kiếm, cập nhật thông tin và điều chỉnh sản phẩm trong hệ thống</p>
            </div>
            <button
              onClick={() => setSearchParams({ tab: 'products-add' })}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 text-sm transition-colors shadow-md"
            >
              <Plus size={18} /> Thêm Sản Phẩm Mới
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col md:flex-row gap-5 items-center justify-between">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Tìm mặt hàng theo tên hoặc nhóm chính..."
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg py-2.5 pl-10 pr-10 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white font-medium"
                value={prodSearch}
                onChange={(e) => setProdSearch(e.target.value)}
              />
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              {prodSearch && (
                <button
                  onClick={() => setProdSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-655 dark:text-gray-400">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-bold">
                  <tr>
                    <th className="px-5 py-4">Ảnh</th>
                    <th className="px-5 py-4">Tên mặt hàng</th>
                    <th className="px-5 py-4">Danh mục</th>
                    <th className="px-5 py-4 whitespace-nowrap text-center">Danh mục con</th>
                    <th className="px-5 py-4">Giá bán</th>
                    <th className="px-5 py-4">Quy cách</th>
                    <th className="px-5 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-750/30">
                        <td className="px-5 py-4.5">
                          <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded bg-gray-150" />
                        </td>
                        <td className="px-5 py-4.5">
                          <span className="font-bold text-gray-900 dark:text-white block text-base">{p.name}</span>
                          <span className="text-xs text-gray-400 mt-0.5">Mã số: {p.id}</span>
                        </td>
                        <td className="px-5 py-4.5 font-medium">{p.category}</td>
                        <td className="px-5 py-4.5 text-center">
                          <span
                            className="inline-block max-w-[160px] truncate align-middle bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full text-xs font-bold"
                            title={p.subcategory || 'Chưa phân loại'}
                          >
                            {p.subcategory || 'Chưa phân loại'}
                          </span>
                        </td>
                        <td className="px-5 py-4.5 font-extrabold text-primary text-base">{p.price.toLocaleString('vi-VN')} đ</td>
                        <td className="px-5 py-4.5 text-gray-500 font-semibold">{p.packaging || 'Mặc định'}</td>
                        <td className="px-5 py-4.5 text-right">
                          <div className="flex justify-end gap-2.5">
                            <button
                              onClick={() => openEditProductModal(p)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/35 rounded transition-colors"
                              title="Sửa"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-2 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/35 rounded transition-colors"
                              title="Xóa"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-5 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Search size={40} className="text-gray-300 dark:text-gray-600 mb-3" />
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Không tìm thấy sản phẩm phù hợp</h3>
                          <p className="text-gray-500">Vui lòng thử lại với từ khóa khác.</p>
                          <button
                            onClick={() => setProdSearch('')}
                            className="mt-4 text-primary font-bold hover:underline text-sm"
                          >
                            Xóa tìm kiếm
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* 📦 TAB: ADD PRODUCT */}
      {currentTab === 'products-add' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl mx-auto">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Thêm Sản Phẩm Mới</h1>
            <p className="text-sm text-gray-500 mt-0.5">Thiết lập các thông tin chi tiết giúp sản phẩm được kiểm duyệt nhanh chóng</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-150 dark:border-gray-700 p-8 space-y-6">
            <form onSubmit={handleAddProductSubmit} className="space-y-6">

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Ảnh sản phẩm</label>
                <div className="flex items-center gap-4">
                  {newProduct.image && (
                    <img src={newProduct.image} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setNewProduct({ ...newProduct, image: URL.createObjectURL(file) });
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tên sản phẩm</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white font-semibold"
                  placeholder="Ví dụ: Phân bón NPK Phú Mỹ 20-20-15"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Danh mục sản phẩm</label>
                  <select
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white font-medium"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  >
                    <option value="">Chọn danh mục...</option>
                    {categories.filter(c => c.isActive).map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Thương hiệu</label>
                  <select
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white font-medium"
                    value={newProduct.brand || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                  >
                    <option value="">Chọn thương hiệu...</option>
                    {brands.filter(b => b.isActive).map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Giá bán hiển thị (đ)</label>
                  <input
                    type="number"
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white font-semibold"
                    placeholder="Nhập giá bán thực tế"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Giá niêm yết cũ (nếu có)</label>
                  <input
                    type="number"
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
                    placeholder="Giá trước khi áp dụng giảm"
                    value={newProduct.oldPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, oldPrice: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Số lượng tồn kho</label>
                  <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-250 dark:border-gray-650">
                    <button 
                      type="button"
                      onClick={() => setNewProduct(prev => ({ ...prev, stock: Math.max(0, (parseInt(prev.stock) || 0) - 1) }))} 
                      className="px-4 py-3 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors font-bold text-lg"
                    >
                      -
                    </button>
                    <input 
                      type="text" 
                      inputMode="numeric"
                      value={newProduct.stock} 
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          setNewProduct({ ...newProduct, stock: '' });
                        } else if (/^\d+$/.test(val)) {
                          setNewProduct({ ...newProduct, stock: parseInt(val, 10) });
                        }
                      }}
                      onBlur={() => {
                        if (newProduct.stock === '' || parseInt(newProduct.stock) < 0) {
                          setNewProduct({ ...newProduct, stock: 0 });
                        }
                      }}
                      className="w-full text-center bg-transparent font-semibold text-gray-900 dark:text-white outline-none py-3"
                    />
                    <button 
                      type="button"
                      onClick={() => setNewProduct(prev => ({ ...prev, stock: (parseInt(prev.stock) || 0) + 1 }))} 
                      className="px-4 py-3 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Quy cách đóng bao</label>
                  <input
                    type="text"
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
                    placeholder="Ví dụ: Bao 5kg, Chai 1 Lít..."
                    value={newProduct.packaging}
                    onChange={(e) => setNewProduct({ ...newProduct, packaging: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Mô tả sản phẩm</label>
                <textarea
                  rows={4}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white resize-none"
                  placeholder="Mô tả công dụng và thông số cơ bản cho người mua dễ hiểu..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Thành phần chi tiết</label>
                  <textarea
                    rows={4}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white resize-none"
                    placeholder="Tỷ lệ lân, đạm, hữu cơ..."
                    value={newProduct.ingredients}
                    onChange={(e) => setNewProduct({ ...newProduct, ingredients: e.target.value })}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Công dụng cây trồng</label>
                  <textarea
                    rows={4}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white resize-none"
                    placeholder="Giúp kích rễ, xanh lá..."
                    value={newProduct.benefits}
                    onChange={(e) => setNewProduct({ ...newProduct, benefits: e.target.value })}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Hướng dẫn bón phân</label>
                  <textarea
                    rows={4}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white resize-none"
                    placeholder="Tần suất bón và tỷ lệ nước pha..."
                    value={newProduct.usage}
                    onChange={(e) => setNewProduct({ ...newProduct, usage: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setSearchParams({ tab: 'products-list' })}
                  className="flex-1 bg-gray-150 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-650 text-gray-700 dark:text-gray-300 font-bold py-3 rounded-xl transition-colors text-sm text-center"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-colors text-sm text-center shadow-md"
                >
                  Lưu & Đăng bán ngay
                </button>
              </div>

            </form>
          </div>
        </motion.div>
      )}

      {/* 📦 TAB: PRODUCT CATEGORIES / BRANDS */}
      {(currentTab === 'products-cats' || currentTab === 'products-brands') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {currentTab === 'products-cats' ? 'Danh Mục Sản Phẩm' : 'Quản Lý Thương Hiệu'}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Kiểm soát phân cấp và nhãn hiệu sản phẩm trong kho hàng</p>
          </div>

          {currentTab === 'products-cats' ? <CategoryManager /> : <BrandManager />}
        </motion.div>
      )}





      {/* 👨‍💼 TAB: STAFF MANAGEMENT - LIST */}
      {currentTab === 'staff-list' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Danh Sách Nhân Viên</h1>
              <p className="text-sm text-gray-500 mt-0.5">Quản lý tài khoản và phân quyền nhân viên hệ thống</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <input
                  type="text"
                  placeholder="Tìm nhân viên..."
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                  value={staffSearch}
                  onChange={(e) => setStaffSearch(e.target.value)}
                />
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <button
                onClick={() => setSearchParams({ tab: 'staff-add' })}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shrink-0 transition-colors"
              >
                <Plus size={18} /> <span className="hidden sm:inline">Thêm mới</span>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-655 dark:text-gray-450">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-bold">
                  <tr>
                    <th className="px-5 py-4 whitespace-nowrap">Mã NV</th>
                    <th className="px-5 py-4 min-w-[150px]">Họ và Tên</th>
                    <th className="px-5 py-4 whitespace-nowrap">Liên hệ</th>
                    <th className="px-5 py-4 whitespace-nowrap">Vai trò</th>
                    <th className="px-5 py-4 whitespace-nowrap">Ngày tham gia</th>
                    <th className="px-5 py-4 text-center whitespace-nowrap">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
                  {staffList
                    .filter(s => s.name.toLowerCase().includes(staffSearch.toLowerCase()) || s.email.toLowerCase().includes(staffSearch.toLowerCase()) || s.role.toLowerCase().includes(staffSearch.toLowerCase()))
                    .map(s => (
                      <tr key={s.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-750/30">
                        <td className="px-5 py-4.5 font-bold text-gray-900 dark:text-white whitespace-nowrap">{s.id}</td>
                        <td className="px-5 py-4.5 font-extrabold text-gray-900 dark:text-white text-base">
                          {s.name}
                          <span className={`ml-2 px-2 py-0.5 rounded text-[10px] font-bold ${s.status === 'Hoạt động' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>{s.status}</span>
                        </td>
                        <td className="px-5 py-4.5 text-gray-500 font-medium">
                          <div className="text-xs text-gray-800 dark:text-gray-300">{s.email}</div>
                          <div className="text-xs">{s.phone}</div>
                        </td>
                        <td className="px-5 py-4.5 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${s.role === 'Manager' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                            {s.role}
                          </span>
                        </td>
                        <td className="px-5 py-4.5 text-gray-500 whitespace-nowrap">{s.joinDate}</td>
                        <td className="px-5 py-4.5 text-center whitespace-nowrap">
                          <button
                            onClick={() => navigate('/manager/employees/' + s.id)}
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
      )}

      {/* 👨‍💼 TAB: STAFF MANAGEMENT - ADD */}
      {currentTab === 'staff-add' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Thêm Nhân Viên Mới</h1>
            <p className="text-sm text-gray-500 mt-0.5">Tạo tài khoản mới và cấp quyền truy cập hệ thống</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm max-w-4xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Họ và Tên (*)</label>
                <input type="text" value={staffForm.name} onChange={e => setStaffForm({ ...staffForm, name: e.target.value })} placeholder="Nhập họ và tên..." className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white font-semibold" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email (*)</label>
                <input type="email" value={staffForm.email} onChange={e => setStaffForm({ ...staffForm, email: e.target.value })} 
                onBlur={(e) => {
                  if (e.target.value && !isValidEmail(e.target.value)) {
                    showNotification({ type: 'error', message: 'Vui lòng nhập địa chỉ email hợp lệ.' });
                  }
                }}
                placeholder="Nhập địa chỉ email..." className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white font-semibold" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Số điện thoại (*)</label>
                <input type="text" value={staffForm.phone} onChange={e => setStaffForm({ ...staffForm, phone: e.target.value })} placeholder="Nhập SĐT..." className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white font-semibold" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Vai trò phân quyền</label>
                <select
                  value={staffForm.role}
                  onChange={e => setStaffForm({ ...staffForm, role: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white font-semibold appearance-none"
                >
                  <option value="Staff">Nhân viên (Staff)</option>
                  <option value="Manager">Quản lý (Manager)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Username (*)</label>
                <input type="text" value={staffForm.username} onChange={e => setStaffForm({ ...staffForm, username: e.target.value })} placeholder="Tên đăng nhập..." className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white font-semibold" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Mật khẩu khởi tạo (*)</label>
                <input type="password" value={staffForm.password} onChange={e => setStaffForm({ ...staffForm, password: e.target.value })} placeholder="Mật khẩu tạm thời..." className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white font-semibold" />
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700/50">
              <button
                onClick={() => {
                  if (!staffForm.name || !staffForm.email || !staffForm.username) {
                    showNotification({ type: 'error', message: 'Vui lòng điền đầy đủ các trường bắt buộc (*)' });
                    return;
                  }
                  if (!isValidEmail(staffForm.email)) {
                    showNotification({ type: 'error', message: 'Vui lòng nhập địa chỉ email hợp lệ.' });
                    return;
                  }
                  addStaff(staffForm);
                  showNotification({ type: 'success', message: 'Tạo tài khoản nhân viên thành công!' });
                  setStaffForm({ name: '', email: '', phone: '', role: 'Staff', username: '', password: '' });
                  setSearchParams({ tab: 'staff-list' });
                }}
                className="bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-sm"
              >
                Hoàn Tất & Tạo Tài Khoản
              </button>
            </div>
          </div>
        </motion.div>
      )}


      {/* 🖼️ TAB: FORUM BANNERS */}
      {currentTab === 'marketing-forum-banners' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Quản Lý Banner Diễn Đàn</h1>
            <p className="text-sm text-gray-500 mt-0.5">Thêm, sửa, xóa và sắp xếp các banner hiển thị trên trang Diễn đàn cộng đồng</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Banner List */}
            <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-655 dark:text-gray-400">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-bold">
                    <tr>
                      <th className="px-5 py-4 whitespace-nowrap">Hình ảnh</th>
                      <th className="px-5 py-4">Tiêu đề & Link</th>
                      <th className="px-5 py-4 text-center whitespace-nowrap">Thứ tự</th>
                      <th className="px-5 py-4 text-center whitespace-nowrap">Trạng thái</th>
                      <th className="px-5 py-4 text-right whitespace-nowrap">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
                    {banners.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-5 py-8 text-center text-gray-500">
                          Chưa có banner nào. Hãy thêm banner mới!
                        </td>
                      </tr>
                    ) : banners.map(b => (
                      <tr key={b.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-750/30">
                        <td className="px-5 py-4">
                          <img src={b.image} alt={b.title} className="w-16 h-16 object-cover rounded-lg shadow-sm border border-gray-100 dark:border-gray-700" />
                        </td>
                        <td className="px-5 py-4 font-semibold text-gray-850 dark:text-gray-250">
                          <div className="font-bold text-gray-900 dark:text-white mb-0.5">{b.title || '(Không có tiêu đề)'}</div>
                          <a href={b.link} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline line-clamp-1">{b.link || '(Không có link)'}</a>
                        </td>
                        <td className="px-5 py-4 text-center font-bold text-gray-900 dark:text-white">{b.order}</td>
                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => toggleBannerStatus(b.id)}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${b.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-gray-150 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                              }`}
                          >
                            {b.isActive ? 'Đang bật' : 'Đang tắt'}
                          </button>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditBanner(b)}
                              className="bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 dark:text-blue-400 p-2 rounded-lg transition-colors cursor-pointer"
                              title="Chỉnh sửa banner"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteBanner(b.id)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 p-2 rounded-lg transition-colors cursor-pointer"
                              title="Xóa banner"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Banner Form */}
            <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700/50 pb-4 mb-5">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                  {editingBanner ? 'Cập Nhật Banner' : 'Thêm Banner Mới'}
                </h3>
                {editingBanner && (
                  <button
                    onClick={() => {
                      setEditingBanner(null);
                      setBannerForm({ title: '', link: '', image: '', order: 1, isActive: true });
                    }}
                    className="text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded transition-colors"
                  >
                    Hủy sửa
                  </button>
                )}
              </div>

              <form onSubmit={handleBannerSubmit} className="space-y-4 text-sm font-medium">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Ảnh Banner (*)</label>
                  {bannerForm.image ? (
                    <div className="relative mb-2 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-650 group aspect-[4/5] sm:aspect-square sm:h-64 lg:h-80 w-full max-w-sm mx-auto shadow-sm">
                      <img src={bannerForm.image} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setBannerForm({ ...bannerForm, image: '' })}
                          className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      {bannerForm.title && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 pt-12">
                          <h3 className="font-extrabold text-white text-lg leading-tight line-clamp-2 drop-shadow-md">{bannerForm.title}</h3>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full max-w-sm mx-auto aspect-[4/5] sm:aspect-square sm:h-64 lg:h-80 bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center text-gray-400 mb-2 relative hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <ImageIcon size={32} className="mb-3 text-gray-400" />
                      <span className="text-sm font-bold text-gray-500 dark:text-gray-400">Nhấn để tải ảnh lên</span>
                      <span className="text-xs mt-1 text-gray-400">Tỷ lệ 1:1 (hoặc 4:5 trên mobile)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setBannerForm({ ...bannerForm, image: reader.result });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                  <p className="text-xs text-gray-400 text-center">Khuyến nghị kích thước: 600x600px để hiển thị sắc nét nhất</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tiêu đề quảng cáo</label>
                  <input
                    type="text"
                    placeholder="Không bắt buộc..."
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Liên kết đích (URL)</label>
                  <input
                    type="text"
                    placeholder="https://... (Không bắt buộc)"
                    value={bannerForm.link}
                    onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Thứ tự hiển thị</label>
                    <input
                      type="number"
                      min="1"
                      value={bannerForm.order}
                      onChange={(e) => setBannerForm({ ...bannerForm, order: parseInt(e.target.value) || 1 })}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white font-bold"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-end pb-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bannerForm.isActive}
                        onChange={(e) => setBannerForm({ ...bannerForm, isActive: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-255 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 font-bold">{bannerForm.isActive ? 'Hiển thị' : 'Ẩn'}</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors shadow-md">
                    {editingBanner ? 'Lưu Thay Đổi' : 'Tạo Banner'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      )}

      {/* 🎁 TAB: MARKETING BANNER / POPUPS / COUPONS */}
      {currentTab.startsWith('marketing-') && currentTab !== 'marketing-forum-banners' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Chiến Dịch Khuyến Mãi & Tiếp Thị</h1>
            <p className="text-sm text-gray-500 mt-0.5">Tạo các chương trình đẩy doanh số, mã giảm giá và popup tiếp cận người dùng</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Promotions List */}
            {currentTab === 'marketing-promotions' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 md:p-8 space-y-6 md:col-span-2">
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700/50 pb-4">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">Danh Sách Chương Trình Khuyến Mãi</h3>
                  <button
                    onClick={() => openPromoModal()}
                    className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 text-sm transition-colors shadow-sm"
                  >
                    <Plus size={16} /> Thêm chương trình
                  </button>
                </div>

                {promotions.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">Chưa có chương trình khuyến mãi nào.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-650 dark:text-gray-400">
                      <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-bold">
                        <tr>
                          <th className="px-4 py-3 rounded-l-lg">Chương trình</th>
                          <th className="px-4 py-3 whitespace-nowrap">Mức giảm</th>
                          <th className="px-4 py-3">Thời gian</th>
                          <th className="px-4 py-3 whitespace-nowrap">Trạng thái</th>
                          <th className="px-4 py-3 rounded-r-lg whitespace-nowrap text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
                        {promotions.map(promo => (
                          <tr key={promo.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-750/30">
                            <td className="px-4 py-4">
                              <p className="font-bold text-gray-900 dark:text-white mb-0.5">{promo.title}</p>
                              <p className="text-xs text-gray-500 line-clamp-1">{promo.description}</p>
                            </td>
                            <td className="px-4 py-4 font-bold text-red-500 whitespace-nowrap">
                              {promo.type === 'percentage' ? `-${promo.value}%` : `-${promo.value.toLocaleString('vi-VN')}đ`}
                            </td>
                            <td className="px-4 py-4 text-xs whitespace-nowrap">
                              Từ {promo.startDate || 'nay'} <br /> Đến {promo.endDate || 'vô thời hạn'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <button
                                onClick={() => togglePromotionStatus(promo.id)}
                                className={`px-2.5 py-1 rounded text-xs font-bold ${promo.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/35 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                                  }`}
                              >
                                {promo.isActive ? 'Đang chạy' : 'Đã dừng'}
                              </button>
                            </td>
                            <td className="px-4 py-4 text-right whitespace-nowrap">
                              <button onClick={() => openPromoModal(promo)} className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 mr-1">
                                <Edit size={16} />
                              </button>
                              <button onClick={() => deletePromotion(promo.id)} className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Popup Design Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700/50 pb-4">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Thiết Lập Popup Khuyến Mãi</h3>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="isActive" checked={popupForm?.isActive} onChange={handlePopupChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-255 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  <span className="ml-2 text-xs text-gray-550 dark:text-gray-400 font-bold">{popupForm?.isActive ? 'Đang kích hoạt' : 'Đang đóng'}</span>
                </label>
              </div>

              <form onSubmit={handlePopupSubmit} className="space-y-5 text-sm font-medium">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tiêu đề quảng cáo</label>
                  <input
                    type="text"
                    name="title"
                    value={popupForm?.title || ''}
                    onChange={handlePopupChange}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nội dung chiến dịch</label>
                  <textarea
                    name="content"
                    value={popupForm?.content || ''}
                    onChange={handlePopupChange}
                    rows={4}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Liên kết ảnh banner đi kèm</label>
                  <input
                    type="text"
                    name="image"
                    value={popupForm?.image || ''}
                    onChange={handlePopupChange}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors shadow-md">
                    Cập nhật Popup trang chủ
                  </button>
                </div>
              </form>
            </div>

            {/* Coupons / Discount list */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4">Các Coupon Khuyến Mãi Đang Kích Hoạt</h3>
                <div className="space-y-4">
                  {[
                    { code: 'YGGDRASIL20', value: '20%', desc: 'Giảm 20% đơn từ 500k', count: 120 },
                    { code: 'NHAGIANH50', value: '50k', desc: 'Giảm 50k cho phân bón lá', count: 450 },
                    { code: 'FREEGREEN', value: '100%', desc: 'Freeship đơn hàng nông sản hữu cơ', count: 90 }
                  ].map((c, i) => (
                    <div key={i} className="flex justify-between items-center text-sm p-4 bg-gray-50/50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-700/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          <Percent size={20} />
                        </div>
                        <div>
                          <strong className="text-gray-900 dark:text-white text-base block">{c.code}</strong>
                          <span className="block text-xs text-gray-400 mt-0.5">{c.desc}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-primary block text-base">{c.value}</span>
                        <span className="text-xs text-gray-500">Đã áp dụng: {c.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700/50 mt-4">
                <button
                  onClick={() => showNotification({ type: 'success', message: 'Tính năng thêm coupon mới đang được nâng cấp' })}
                  className="w-full text-center text-sm text-primary font-bold hover:underline"
                >
                  Tạo chiến dịch Coupon mới →
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* 📈 TAB: REPORTS & STATS */}
      {currentTab === 'reports-revenue' && <RevenueReport showNotification={showNotification} />}
      {currentTab === 'reports-orders' && <OrdersReport />}
      {currentTab === 'reports-bestsellers' && <BestSellersReport />}
      {currentTab === 'reports-users' && <NewUsersReport />}

      {/* ⚙️ TAB: SETTINGS WEBSITE */}
      {currentTab.startsWith('settings-') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl mx-auto">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Cấu Hình Website Cửa Hàng</h1>
            <p className="text-sm text-gray-500 mt-0.5">Thay đổi hotline, địa chỉ kho hàng và các chính sách bảo mật vận hành</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-150 dark:border-gray-700 p-8">
            <form onSubmit={(e) => { e.preventDefault(); showNotification({ type: 'success', message: 'Đã lưu thông tin cấu hình website!' }); }} className="space-y-5 text-sm font-medium">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-450 mb-1.5 uppercase tracking-wider">Tên trang web hiển thị</label>
                  <input
                    type="text"
                    value={webSettings.siteName}
                    onChange={(e) => setWebSettings({ ...webSettings, siteName: e.target.value })}
                    className="w-full bg-gray-55 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg px-4 py-2.5 text-sm outline-none text-gray-900 dark:text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-450 mb-1.5 uppercase tracking-wider">Hotline tổng đài chăm sóc</label>
                  <input
                    type="text"
                    value={webSettings.hotline}
                    onChange={(e) => setWebSettings({ ...webSettings, hotline: e.target.value })}
                    className="w-full bg-gray-55 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg px-4 py-2.5 text-sm outline-none text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-450 mb-1.5 uppercase tracking-wider">Email chăm sóc khách hàng</label>
                  <input
                    type="email"
                    value={webSettings.email}
                    onChange={(e) => setWebSettings({ ...webSettings, email: e.target.value })}
                    onBlur={(e) => {
                      if (e.target.value && !isValidEmail(e.target.value)) {
                        showNotification({ type: 'error', message: 'Vui lòng nhập địa chỉ email hợp lệ.' });
                      }
                    }}
                    className="w-full bg-gray-55 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg px-4 py-2.5 text-sm outline-none text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-450 mb-1.5 uppercase tracking-wider">Địa chỉ chi nhánh chính</label>
                  <input
                    type="text"
                    value={webSettings.address}
                    onChange={(e) => setWebSettings({ ...webSettings, address: e.target.value })}
                    className="w-full bg-gray-55 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg px-4 py-2.5 text-sm outline-none text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-450 mb-1.5 uppercase tracking-wider">Thông điệp giới thiệu</label>
                <textarea
                  rows={2}
                  value={webSettings.intro}
                  onChange={(e) => setWebSettings({ ...webSettings, intro: e.target.value })}
                  className="w-full bg-gray-55 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg px-4 py-2.5 text-sm outline-none text-gray-900 dark:text-white resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-455 mb-1.5 uppercase tracking-wider">Chính sách trả hàng bảo hành</label>
                <textarea
                  rows={4}
                  value={webSettings.policy}
                  onChange={(e) => setWebSettings({ ...webSettings, policy: e.target.value })}
                  className="w-full bg-gray-55 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg px-4 py-2.5 text-sm outline-none text-gray-900 dark:text-white resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end pt-4">
                <button type="button" onClick={(e) => {
                  e.preventDefault();
                  if (webSettings.email && !isValidEmail(webSettings.email)) {
                    showNotification({ type: 'error', message: 'Vui lòng nhập địa chỉ email hợp lệ.' });
                    return;
                  }
                  showNotification({ type: 'success', message: 'Cập nhật cấu hình thành công!' });
                }} className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-colors shadow-md">
                  Cập nhật cấu hình ngay
                </button>
              </div>

            </form>
          </div>
        </motion.div>
      )}

      {/* 👤 TAB: PROFILE EDIT */}
      {currentTab === 'profile-edit' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl mx-auto">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Hồ Sơ Cá Nhân</h1>
            <p className="text-sm text-gray-500 mt-0.5">Thay đổi thông tin liên hệ, ảnh đại diện và mật khẩu quản trị của bạn</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-150 dark:border-gray-700 p-8 space-y-8">
            {/* Sync profile states if user changes */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newPassword && newPassword !== confirmPassword) {
                  showNotification({ type: 'error', message: 'Mật khẩu mới nhập lại không khớp!' });
                  return;
                }
                if (!isValidEmail(profileEmail)) {
                  showNotification({ type: 'error', message: 'Vui lòng nhập địa chỉ email hợp lệ.' });
                  return;
                }
                updateProfile({
                  name: profileName,
                  email: profileEmail,
                  avatar: profileAvatar,
                  phone: profilePhone
                });
                showNotification({ type: 'success', message: 'Cập nhật hồ sơ cá nhân thành công!' });
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }}
              className="space-y-6 text-sm font-medium"
            >
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100 dark:border-gray-700/50">
                <div
                  className="relative group cursor-pointer shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                  title="Nhấp để thay đổi ảnh đại diện"
                >
                  <div className="w-24 h-24 rounded-full bg-primary text-white flex justify-center items-center font-bold overflow-hidden shadow-lg border-4 border-white dark:border-gray-800 shrink-0 text-4xl">
                    {profileAvatar ? (
                      <img src={profileAvatar} alt="Profile preview" className="w-full h-full object-cover" />
                    ) : (
                      profileName.charAt(0).toUpperCase() || 'A'
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={28} />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                  />
                </div>
                <div className="space-y-2 w-full">
                  <h3 className="font-bold text-xl md:text-2xl text-gray-900 dark:text-white">{profileName}</h3>
                  <p className="text-gray-500 mt-1">{user?.role === 'Manager' ? 'Quản Lý Cửa Hàng' : 'Administrator'}</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-primary hover:underline mt-2 inline-block font-medium"
                  >
                    Thay đổi ảnh đại diện
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-450 mb-1.5 uppercase tracking-wider">Họ và Tên</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg px-4 py-2.5 text-sm outline-none text-gray-900 dark:text-white font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-450 mb-1.5 uppercase tracking-wider">Địa chỉ Email</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    onBlur={(e) => {
                      if (e.target.value && !isValidEmail(e.target.value)) {
                        showNotification({ type: 'error', message: 'Vui lòng nhập địa chỉ email hợp lệ.' });
                      }
                    }}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg px-4 py-2.5 text-sm outline-none text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-455 mb-1.5 uppercase tracking-wider">Số điện thoại liên hệ</label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg px-4 py-2.5 text-sm outline-none text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-455 mb-1.5 uppercase tracking-wider">Vai trò quản trị</label>
                  <input
                    type="text"
                    value={user?.role || 'Administrator'}
                    disabled
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-750 rounded-lg px-4 py-2.5 text-sm outline-none text-gray-400 font-semibold cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-gray-700/50 space-y-4">
                <h3 className="font-bold text-base text-gray-900 dark:text-white">Đổi Mật Khẩu (Nếu muốn)</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-450 mb-1.5 uppercase tracking-wider">Mật khẩu cũ</label>
                    <div className="relative">
                      <input
                        type={showOldPassword ? "text" : "password"}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full bg-gray-55 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg pl-4 pr-10 py-2.5 text-sm outline-none text-gray-900 dark:text-white"
                      />
                      {oldPassword.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-455 mb-1.5 uppercase tracking-wider">Mật khẩu mới</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-gray-55 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg pl-4 pr-10 py-2.5 text-sm outline-none text-gray-900 dark:text-white"
                      />
                      {newPassword.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-455 mb-1.5 uppercase tracking-wider font-semibold text-primary">Nhập lại mật khẩu</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-gray-55 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg pl-4 pr-10 py-2.5 text-sm outline-none text-gray-900 dark:text-white"
                      />
                      {confirmPassword.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-8 rounded-lg text-sm transition-colors shadow-md">
                  Lưu thay đổi hồ sơ
                </button>
              </div>

            </form>
          </div>
        </motion.div>
      )}

      {/* Promo Modal */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsPromoModalOpen(false)}></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]"
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/80">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingPromoId ? 'Chỉnh Sửa Chương Trình Khuyến Mãi' : 'Thêm Chương Trình Mới'}
              </h2>
              <button onClick={() => setIsPromoModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="promo-form" onSubmit={handlePromoSubmit} className="space-y-5 text-sm font-medium">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tên chương trình *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={promoForm.title}
                    onChange={handlePromoChange}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Mô tả chương trình</label>
                  <textarea
                    name="description"
                    rows={2}
                    value={promoForm.description}
                    onChange={handlePromoChange}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-250 dark:border-gray-650 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Loại giảm giá</label>
                    <select
                      name="type"
                      value={promoForm.type}
                      onChange={handlePromoChange}
                      className="w-full bg-white dark:bg-gray-900 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
                    >
                      <option value="percentage">Giảm theo %</option>
                      <option value="fixed">Giảm số tiền cố định (VNĐ)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Giá trị giảm *</label>
                    <input
                      type="number"
                      name="value"
                      required
                      min="1"
                      value={promoForm.value}
                      onChange={handlePromoChange}
                      className="w-full bg-white dark:bg-gray-900 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Ngày bắt đầu</label>
                    <input
                      type="date"
                      name="startDate"
                      value={promoForm.startDate}
                      onChange={handlePromoChange}
                      className="w-full bg-white dark:bg-gray-900 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Ngày kết thúc</label>
                    <input
                      type="date"
                      name="endDate"
                      value={promoForm.endDate}
                      onChange={handlePromoChange}
                      className="w-full bg-white dark:bg-gray-900 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Đối tượng áp dụng</label>
                  <select
                    name="targetType"
                    value={promoForm.targetType}
                    onChange={handlePromoChange}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white mb-3"
                  >
                    <option value="all">Tất cả sản phẩm</option>
                    <option value="category">Theo danh mục sản phẩm</option>
                    <option value="product">Sản phẩm cụ thể</option>
                  </select>

                  {promoForm.targetType === 'category' && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <label key={cat.name} className="flex items-center gap-2 text-sm bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary">
                          <input
                            type="checkbox"
                            checked={promoForm.targetCategories.includes(cat.name)}
                            onChange={(e) => {
                              const newCategories = e.target.checked
                                ? [...promoForm.targetCategories, cat.name]
                                : promoForm.targetCategories.filter(c => c !== cat.name);
                              setPromoForm(prev => ({ ...prev, targetCategories: newCategories }));
                            }}
                            className="text-primary focus:ring-primary rounded"
                          />
                          {cat.name}
                        </label>
                      ))}
                    </div>
                  )}

                  {promoForm.targetType === 'product' && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2">
                      <p className="text-xs text-gray-500 mb-2">Chọn sản phẩm (có thể chọn nhiều):</p>
                      <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-1">
                        {productsList.map(prod => (
                          <label key={prod.id} className="flex items-center justify-between gap-2 text-sm px-2 py-1.5 hover:bg-white dark:hover:bg-gray-800 rounded cursor-pointer">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={promoForm.targetProducts.includes(prod.id)}
                                onChange={(e) => {
                                  const newProducts = e.target.checked
                                    ? [...promoForm.targetProducts, prod.id]
                                    : promoForm.targetProducts.filter(id => id !== prod.id);
                                  setPromoForm(prev => ({ ...prev, targetProducts: newProducts }));
                                }}
                                className="text-primary focus:ring-primary rounded"
                              />
                              <span className="line-clamp-1">{prod.name}</span>
                            </div>
                            <span className="text-xs text-gray-400 shrink-0">{prod.price.toLocaleString('vi-VN')}đ</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={promoForm.isActive}
                      onChange={handlePromoChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-255 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 font-bold">{promoForm.isActive ? 'Kích hoạt ngay' : 'Tạm dừng'}</span>
                  </label>
                </div>
              </form>
            </div>

            <div className="p-5 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/80 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsPromoModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                form="promo-form"
                className="px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors shadow-md"
              >
                {editingPromoId ? 'Lưu Thay Đổi' : 'Tạo Khuyến Mãi'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {/* 📦 MODAL: EDIT PRODUCT */}
      {isEditProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl my-auto overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <div className="flex justify-between items-center p-5 md:p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Chỉnh Sửa Sản Phẩm</h2>
              <button
                onClick={closeEditProductModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-5 md:p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <form id="edit-product-form" onSubmit={handleEditProductSubmit} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Cột trái: Ảnh */}
                  <div className="shrink-0 w-full md:w-1/3">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Ảnh sản phẩm</label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-center">
                      <img
                        src={editingProduct.image || '/product-1.png'}
                        alt="Preview"
                        className="w-full aspect-square object-cover rounded-lg bg-gray-100 dark:bg-gray-700 mb-4"
                        onError={(e) => { e.currentTarget.src = '/product-1.png'; }}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleEditProductChange({
                              target: { name: 'image', value: URL.createObjectURL(file) }
                            });
                          }
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                      />
                    </div>
                    {editProductErrors.image && <p className="text-red-500 text-xs mt-1 font-semibold">{editProductErrors.image}</p>}
                  </div>

                  {/* Cột phải: Thông tin */}
                  <div className="flex-1 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tên sản phẩm (*)</label>
                        <input
                          type="text"
                          name="name"
                          value={editingProduct.name || ''}
                          onChange={handleEditProductChange}
                          className={`w-full bg-gray-50 dark:bg-gray-700 border ${editProductErrors.name ? 'border-red-500' : 'border-gray-250 dark:border-gray-650'} rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white font-semibold`}
                        />
                        {editProductErrors.name && <p className="text-red-500 text-xs mt-1 font-semibold">{editProductErrors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Mã số (Read-only)</label>
                        <input
                          type="text"
                          value={editingProduct.id || ''}
                          readOnly
                          className="w-full bg-gray-200 dark:bg-gray-600 border border-transparent rounded-lg px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 font-semibold cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Danh mục sản phẩm (*)</label>
                        <select
                          name="category"
                          value={editingProduct.category || ''}
                          onChange={handleEditProductChange}
                          className={`w-full bg-gray-50 dark:bg-gray-700 border ${editProductErrors.category ? 'border-red-500' : 'border-gray-250 dark:border-gray-650'} rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white font-medium`}
                        >
                          <option value="">-- Chọn danh mục --</option>
                          {categories.filter(c => c.isActive).map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                        {editProductErrors.category && <p className="text-red-500 text-xs mt-1 font-semibold">{editProductErrors.category}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Thương hiệu (*)</label>
                        <select
                          name="brand"
                          value={editingProduct.brand || ''}
                          onChange={handleEditProductChange}
                          className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white font-medium"
                        >
                          <option value="">-- Chọn thương hiệu --</option>
                          {brands.filter(b => b.isActive).map(b => (
                            <option key={b.id} value={b.name}>{b.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Giá bán (*)</label>
                        <input
                          type="number"
                          name="price"
                          min="1"
                          value={editingProduct.price || ''}
                          onChange={handleEditProductChange}
                          className={`w-full bg-gray-50 dark:bg-gray-700 border ${editProductErrors.price ? 'border-red-500' : 'border-gray-250 dark:border-gray-650'} rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white font-semibold`}
                        />
                        {editProductErrors.price && <p className="text-red-500 text-xs mt-1 font-semibold">{editProductErrors.price}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Số lượng tồn kho</label>
                        <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-250 dark:border-gray-650">
                          <button 
                            type="button"
                            onClick={() => setEditingProduct(prev => ({ ...prev, stock: Math.max(0, (parseInt(prev.stock) || 0) - 1) }))} 
                            className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors font-bold text-lg"
                          >
                            -
                          </button>
                          <input 
                            type="text" 
                            inputMode="numeric"
                            value={editingProduct.stock !== undefined ? editingProduct.stock : (editingProduct.soldCount || 0)} 
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '') {
                                setEditingProduct({ ...editingProduct, stock: '' });
                              } else if (/^\d+$/.test(val)) {
                                setEditingProduct({ ...editingProduct, stock: parseInt(val, 10) });
                              }
                            }}
                            onBlur={() => {
                              if (editingProduct.stock === '' || parseInt(editingProduct.stock) < 0) {
                                setEditingProduct({ ...editingProduct, stock: 0 });
                              }
                            }}
                            className="w-full text-center bg-transparent font-semibold text-gray-900 dark:text-white outline-none py-2.5"
                          />
                          <button 
                            type="button"
                            onClick={() => setEditingProduct(prev => ({ ...prev, stock: (parseInt(prev.stock) !== undefined ? parseInt(prev.stock) : (prev.soldCount || 0)) + 1 }))} 
                            className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors font-bold text-lg"
                          >
                            +
                          </button>
                        </div>
                      </div>



                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Quy cách</label>
                        <input
                          type="text"
                          name="packaging"
                          value={editingProduct.packaging || ''}
                          onChange={handleEditProductChange}
                          className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Mô tả sản phẩm</label>
                      <textarea
                        name="description"
                        rows={4}
                        value={editingProduct.description || ''}
                        onChange={handleEditProductChange}
                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-5 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/80 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeEditProductModal}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                form="edit-product-form"
                className="px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors shadow-md"
              >
                Cập nhật sản phẩm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
