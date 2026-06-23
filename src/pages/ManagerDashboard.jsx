import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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
  Truck,
  RotateCcw,
  Check,
  Percent,
  Calendar,
  Layers,
  Sliders,
  FileSpreadsheet
} from 'lucide-react';
import { useForum } from '../context/ForumContext';
import { usePopup } from '../context/PopupContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { products as initialProducts, categories } from '../data/mockData';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

// Mock Orders Data
const initialOrders = [
  { id: 'DH1002', customer: 'Nguyễn Văn Hùng', date: '2026-06-22', total: 450000, status: 'Chờ xác nhận', items: '2x Phân trùn quế' },
  { id: 'DH1001', customer: 'Trần Thị Mai', date: '2026-06-21', total: 1200000, status: 'Đang giao', items: '3x NPK Phú Mỹ, 1x Chế phẩm Trichoderma' },
  { id: 'DH1000', customer: 'Lê Hoàng Nam', date: '2026-06-20', total: 250000, status: 'Hoàn thành', items: '1x Bình xịt Dudaco' },
  { id: 'DH0999', customer: 'Phạm Thanh Bình', date: '2026-06-19', total: 85000, status: 'Hoàn thành', items: '1x Hạt giống cà chua' },
  { id: 'DH0998', customer: 'Hoàng Kim Chi', date: '2026-06-18', total: 320000, status: 'Đã hủy', items: '2x Phân dê hoai mục' },
  { id: 'DH0997', customer: 'Vũ Minh Đức', date: '2026-06-17', total: 175000, status: 'Chờ xác nhận', items: '1x NPK 15-15-15' },
  { id: 'DH0996', customer: 'Đỗ Thúy Hạnh', date: '2026-06-16', total: 540000, status: 'Đang giao', items: '4x Phân bò hoai mục' }
];

// Mock Customers
const initialCustomers = [
  { id: 'KH001', name: 'Nguyễn Văn Hùng', email: 'hung.nguyen@gmail.com', phone: '0901234567', totalSpent: 2450000, ordersCount: 5 },
  { id: 'KH002', name: 'Trần Thị Mai', email: 'mai.tran@yahoo.com', phone: '0912345678', totalSpent: 3500000, ordersCount: 8 },
  { id: 'KH003', name: 'Lê Hoàng Nam', email: 'nam.le@hotmail.com', phone: '0987654321', totalSpent: 1250000, ordersCount: 3 },
  { id: 'KH004', name: 'Phạm Thanh Bình', email: 'binh.pham@outlook.com', phone: '0934567890', totalSpent: 85000, ordersCount: 1 },
  { id: 'KH005', name: 'Hoàng Kim Chi', email: 'chi.hoang@gmail.com', phone: '0956789012', totalSpent: 640000, ordersCount: 4 }
];

const ManagerDashboard = () => {
  const { pendingPosts, approvePost, rejectPost, posts } = useForum();
  const { popupSettings, updatePopup } = usePopup();
  const { user, updateProfile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'dashboard';

  // Profile Edit Form State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '08357757501');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State managers
  const [productsList, setProductsList] = useState(initialProducts);
  const { orders: ordersList, updateOrderStatus } = useOrders();
  const [selectedManagerOrderId, setSelectedManagerOrderId] = useState(null);
  const [customersList, setCustomersList] = useState(initialCustomers);
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
    usage: '',
    packaging: 'Bao 5kg',
    isNew: true,
    rating: 5,
    soldCount: 0
  });

  // Website Settings Form State
  const [webSettings, setWebSettings] = useState({
    siteName: 'Yggdrasil - Nông Nghiệp Xanh',
    hotline: '08357757501',
    email: 'contact@yggdrasil.com',
    address: '123 Đường Nông Nghiệp, TP. Hồ Chí Minh',
    policy: 'Chính sách hoàn trả hàng trong vòng 7 ngày nếu lỗi sản xuất...',
    intro: 'Yggdrasil chuyên cung cấp giải pháp phân bón và hạt giống xanh bền vững.'
  });

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
    toast.success('Đã lưu thiết lập popup!');
  };

  // Add new product handler
  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      toast.error('Vui lòng nhập tên và giá sản phẩm');
      return;
    }
    const created = {
      ...newProduct,
      id: Date.now(),
      price: parseFloat(newProduct.price),
      oldPrice: newProduct.oldPrice ? parseFloat(newProduct.oldPrice) : undefined,
      discount: newProduct.oldPrice ? Math.round(((parseFloat(newProduct.oldPrice) - parseFloat(newProduct.price)) / parseFloat(newProduct.oldPrice)) * 100) : undefined,
      image: '/product-1.png'
    };
    setProductsList([created, ...productsList]);
    toast.success('Thêm sản phẩm thành công!');
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
      isNew: true,
      rating: 5,
      soldCount: 0
    });
    setSearchParams({ tab: 'products-list' });
  };

  // Delete product handler
  const handleDeleteProduct = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      setProductsList(prev => prev.filter(p => p.id !== id));
      toast.success('Đã xóa sản phẩm thành công!');
    }
  };

  // Update order status handler
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    toast.success(`Đã cập nhật trạng thái đơn ${orderId} sang "${newStatus}"`);
  };

  const handleApprove = (id) => {
    approvePost(id);
    toast.success('Đã duyệt bài viết');
  };

  const handleReject = (id) => {
    rejectPost(id);
    toast.success('Đã từ chối bài viết');
  };

  // Stats calculation
  const totalProductsCount = productsList.length;
  const totalOrdersCount = ordersList.length;
  const totalCustomersCount = customersList.length;
  const totalPostsCount = posts.length + pendingPosts.length;
  const totalRevenue = useMemo(() => {
    return ordersList
      .filter(o => o.status === 'Hoàn thành' || o.status === 'Đang giao' || o.status === 'Đã giao thành công' || o.status === 'Đang giao hàng')
      .reduce((sum, o) => sum + o.total, 0);
  }, [ordersList]);

  // Filtered Products for management view
  const filteredProducts = useMemo(() => {
    if (!prodSearch.trim()) return productsList;
    return productsList.filter(p => p.name.toLowerCase().includes(prodSearch.toLowerCase()) || p.category.toLowerCase().includes(prodSearch.toLowerCase()));
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
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Tổng Quan Hệ Thống</h1>
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

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 flex items-center gap-5 transition-transform hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <MessageSquare size={26} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Bài Viết</p>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{totalPostsCount}</h3>
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
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Biểu Đồ Tăng Trưởng Doanh Thu (Trăm Triệu)</h3>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Recent Orders - Spacious */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Đơn Hàng Mới Giao Dịch</h3>
                <button onClick={() => setSearchParams({ tab: 'orders-all' })} className="text-sm text-primary font-bold hover:underline">
                  Xem tất cả đơn
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-650 dark:text-gray-400">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-bold">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Mã ĐH</th>
                      <th className="px-4 py-3">Khách hàng</th>
                      <th className="px-4 py-3">Tổng tiền</th>
                      <th className="px-4 py-3 rounded-r-lg">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
                    {ordersList.slice(0, 4).map(o => (
                      <tr key={o.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-750/30">
                        <td className="px-4 py-4.5 font-bold text-gray-900 dark:text-white">{o.id}</td>
                        <td className="px-4 py-4.5 font-semibold text-gray-800 dark:text-gray-205">{o.customer}</td>
                        <td className="px-4 py-4.5 text-primary font-bold text-base">{o.total.toLocaleString('vi-VN')} đ</td>
                        <td className="px-4 py-4.5">
                          <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                            o.status === 'Chờ xác nhận' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/35 dark:text-yellow-400' :
                            o.status === 'Đang giao' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/35 dark:text-blue-400' :
                            o.status === 'Hoàn thành' ? 'bg-green-100 text-green-800 dark:bg-green-900/35 dark:text-green-400' :
                            'bg-red-100 text-red-800 dark:bg-red-900/35 dark:text-red-400'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pending Forum Posts */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Phê Duyệt Bài Viết Diễn Đàn</h3>
                <button onClick={() => setSearchParams({ tab: 'forum-posts' })} className="text-sm text-primary font-bold hover:underline">
                  Duyệt hàng chờ
                </button>
              </div>
              <div className="space-y-5">
                {pendingPosts.length === 0 ? (
                  <div className="text-center py-10">
                    <CheckCircle size={44} className="mx-auto text-green-500 mb-3 animate-bounce" />
                    <p className="text-sm text-gray-500 font-medium">Tuyệt vời! Không còn bài đăng nào cần duyệt.</p>
                  </div>
                ) : (
                  pendingPosts.slice(0, 2).map(post => (
                    <div key={post.id} className="p-4 border border-gray-150 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/40 text-sm space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                            {post.author.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 dark:text-white block text-sm">{post.author}</span>
                            <span className="text-[10px] text-gray-400">{post.time}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{post.content}</p>
                      <div className="flex gap-3 justify-end pt-2">
                        <button onClick={() => rejectPost(post.id)} className="bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-955/20 dark:text-red-400 font-bold px-4 py-2 rounded-lg text-xs border border-red-200 dark:border-red-800 transition-colors">
                          Từ chối
                        </button>
                        <button onClick={() => approvePost(post.id)} className="bg-primary hover:bg-primary-dark text-white font-bold px-5 py-2 rounded-lg text-xs shadow-sm transition-colors">
                          Phê duyệt
                        </button>
                      </div>
                    </div>
                  ))
                )}
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
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white font-medium"
                value={prodSearch}
                onChange={(e) => setProdSearch(e.target.value)}
              />
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
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
                    <th className="px-5 py-4">Danh mục con</th>
                    <th className="px-5 py-4">Giá bán</th>
                    <th className="px-5 py-4">Quy cách</th>
                    <th className="px-5 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-750/30">
                      <td className="px-5 py-4.5">
                        <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded bg-gray-150" />
                      </td>
                      <td className="px-5 py-4.5">
                        <span className="font-bold text-gray-900 dark:text-white block text-base">{p.name}</span>
                        <span className="text-xs text-gray-400 mt-0.5">Mã số: {p.id}</span>
                      </td>
                      <td className="px-5 py-4.5 font-medium">{p.category}</td>
                      <td className="px-5 py-4.5">
                        <span className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
                          {p.subcategory || 'Chưa phân loại'}
                        </span>
                      </td>
                      <td className="px-5 py-4.5 font-extrabold text-primary text-base">{p.price.toLocaleString('vi-VN')} đ</td>
                      <td className="px-5 py-4.5 text-gray-500 font-semibold">{p.packaging || 'Mặc định'}</td>
                      <td className="px-5 py-4.5 text-right">
                        <div className="flex justify-end gap-2.5">
                          <button 
                            onClick={() => toast.success('Tính năng chỉnh sửa sẽ được cập nhật ở đợt nâng cấp tới')}
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
                  ))}
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
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tên sản phẩm</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white font-semibold"
                  placeholder="Ví dụ: Phân bón NPK Phú Mỹ 20-20-15"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Danh mục chính</label>
                  <select 
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white font-medium"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  >
                    <option>Phân bón hữu cơ</option>
                    <option>Phân bón vô cơ</option>
                    <option>Phân bón lá & Vi sinh</option>
                    <option>Giải pháp đặc biệt</option>
                    <option>Thuốc bảo vệ thực vật</option>
                    <option>Hạt giống</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Danh mục con</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
                    placeholder="Ví dụ: Phân chuồng, NPK..."
                    value={newProduct.subcategory}
                    onChange={(e) => setNewProduct({...newProduct, subcategory: e.target.value})}
                  />
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
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
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
                    onChange={(e) => setNewProduct({...newProduct, oldPrice: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Quy cách đóng bao</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
                    placeholder="Ví dụ: Bao 5kg, Chai 1 Lít..."
                    value={newProduct.packaging}
                    onChange={(e) => setNewProduct({...newProduct, packaging: e.target.value})}
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
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
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
                    onChange={(e) => setNewProduct({...newProduct, ingredients: e.target.value})}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Công dụng cây trồng</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white resize-none"
                    placeholder="Giúp kích rễ, xanh lá..."
                    value={newProduct.benefits}
                    onChange={(e) => setNewProduct({...newProduct, benefits: e.target.value})}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Hướng dẫn bón phân</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white resize-none"
                    placeholder="Tần suất bón và tỷ lệ nước pha..."
                    value={newProduct.usage}
                    onChange={(e) => setNewProduct({...newProduct, usage: e.target.value})}
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl border border-gray-100 dark:border-gray-700/50 space-y-6">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                {currentTab === 'products-cats' ? 'Các nhóm hàng chính hiện hành' : 'Các nhãn hàng đối tác chính'}
              </h3>
              <ul className="divide-y divide-gray-100 dark:divide-gray-750">
                {(currentTab === 'products-cats' 
                  ? categories.filter(c => c !== 'Tất cả')
                  : ['Đầu Trâu (Bình Điền)', 'Phú Mỹ', 'Đạm Cà Mau', 'SFarm', 'Điền Trang', 'Sông Gianh', 'Quế Lâm', 'Tribat']
                ).map((item, i) => (
                  <li key={i} className="py-4 flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-900 dark:text-white">{item}</span>
                    <span className="text-xs bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 px-2.5 py-0.5 rounded font-bold">Hoạt động</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl border border-gray-100 dark:border-gray-700/50 h-fit space-y-5">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                Thêm danh mục
              </h3>
            </div>
          </div>
        </motion.div>
      )}

      {/* 🛒 TAB: ORDERS MANAGEMENT */}
      {currentTab.startsWith('orders-') && (
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
                      <th className="px-5 py-4">Mã đơn hàng</th>
                      <th className="px-5 py-4">Khách hàng</th>
                      <th className="px-5 py-4">Ngày giao dịch</th>
                      <th className="px-5 py-4">Tổng tiền</th>
                      <th className="px-5 py-4">Trạng thái giao</th>
                      <th className="px-5 py-4 text-right">Thao tác</th>
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
                          <td className="px-5 py-4.5 font-bold text-gray-900 dark:text-white text-base">{o.id}</td>
                          <td className="px-5 py-4.5 font-semibold text-gray-850 dark:text-gray-250">
                            {o.customerName || o.customer}
                          </td>
                          <td className="px-5 py-4.5 text-gray-500 font-medium">{o.date}</td>
                          <td className="px-5 py-4.5 font-bold text-primary text-base">{o.total.toLocaleString('vi-VN')} đ</td>
                          <td className="px-5 py-4.5">
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
                          <td className="px-5 py-4.5 text-right">
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
      )}

      {/* 👥 TAB: CUSTOMERS MANAGEMENT */}
      {currentTab.startsWith('customers-') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Quản Lý Danh Sách Khách Hàng</h1>
            <p className="text-sm text-gray-500 mt-0.5">Theo dõi lịch sử giao dịch và thông tin chi tiêu của từng khách hàng</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-655 dark:text-gray-450">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-bold">
                  <tr>
                    <th className="px-5 py-4">Mã KH</th>
                    <th className="px-5 py-4">Họ và Tên</th>
                    <th className="px-5 py-4">Địa chỉ Email</th>
                    <th className="px-5 py-4">Số điện thoại</th>
                    <th className="px-5 py-4 text-center">Tổng đơn mua</th>
                    <th className="px-5 py-4 text-right">Tổng giá trị chi tiêu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
                  {customersList.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-750/30">
                      <td className="px-5 py-4.5 font-bold text-gray-900 dark:text-white">{c.id}</td>
                      <td className="px-5 py-4.5 font-extrabold text-gray-900 dark:text-white text-base">{c.name}</td>
                      <td className="px-5 py-4.5 text-gray-500 font-medium">{c.email}</td>
                      <td className="px-5 py-4.5 text-gray-500">{c.phone}</td>
                      <td className="px-5 py-4.5 text-center font-bold text-gray-800 dark:text-gray-200">{c.ordersCount} đơn</td>
                      <td className="px-5 py-4.5 text-right font-extrabold text-primary text-base">{c.totalSpent.toLocaleString('vi-VN')} đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* 💬 TAB: FORUM MODERATION */}
      {currentTab.startsWith('forum-') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Hệ Thống Duyệt Diễn Đàn</h1>
              <p className="text-sm text-gray-500 mt-0.5">Kiểm duyệt các bài viết nông nghiệp được tải lên hệ thống từ cộng đồng</p>
            </div>
            {pendingPosts.length > 0 && (
              <span className="bg-yellow-100 text-yellow-800 text-sm font-bold px-4 py-1.5 rounded-full animate-pulse">
                {pendingPosts.length} bài đăng cần duyệt
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-5">
              <h3 className="font-bold text-base text-gray-950 dark:text-white">Danh sách bài đăng chờ duyệt</h3>
              {pendingPosts.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-150 dark:border-gray-750 text-center">
                  <CheckCircle size={48} className="mx-auto text-green-500 mb-3" />
                  <p className="text-sm text-gray-500 font-medium">Hàng đợi trống! Tất cả các thảo luận đã xuất bản an toàn.</p>
                </div>
              ) : (
                pendingPosts.map(post => (
                  <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-150 dark:border-gray-750 flex flex-col justify-between space-y-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-650 text-white flex items-center justify-center font-bold text-sm">{post.author.charAt(0)}</div>
                      <div>
                        <span className="font-bold text-gray-950 dark:text-white block text-sm">{post.author}</span>
                        <span className="text-xs text-gray-400 mt-0.5">{post.time}</span>
                      </div>
                    </div>
                    {post.title && <h4 className="font-bold text-base text-gray-950 dark:text-white">{post.title}</h4>}
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">{post.content}</p>
                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 dark:border-gray-700/50">
                      <button onClick={() => rejectPost(post.id)} className="bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-955/20 dark:text-red-400 font-bold px-4 py-2 rounded-lg text-xs border border-red-200 dark:border-red-800 transition-colors">
                        Từ chối
                      </button>
                      <button onClick={() => handleApprove(post.id)} className="bg-primary hover:bg-primary-dark text-white font-bold px-5 py-2 rounded-lg text-xs shadow-md transition-colors">
                        Duyệt xuất bản
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl border border-gray-150 dark:border-gray-700/50 h-fit space-y-5">
              <h3 className="font-bold text-base text-gray-950 dark:text-white">Báo cáo vi phạm (Spam)</h3>
              <div className="space-y-4">
                {[
                  { user: 'Nguyễn Văn B', reason: 'Nội dung quảng cáo spam', post: 'Tôi bán phân bón sđt...' },
                  { user: 'Lê Văn C', reason: 'Ngôn từ chưa chuẩn mực', post: 'Bài viết vô ích quá...' }
                ].map((rep, i) => (
                  <div key={i} className="p-4 bg-gray-55/40 dark:bg-gray-900/30 rounded-lg text-xs border border-gray-100 dark:border-gray-750 space-y-1.5">
                    <span className="font-bold block text-red-500 text-sm">{rep.reason}</span>
                    <span className="text-gray-500 block text-xs">Người gửi báo cáo: {rep.user}</span>
                    <p className="text-gray-400 dark:text-gray-500 italic mt-1 font-medium">"{rep.post}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 🎁 TAB: MARKETING BANNER / POPUPS / COUPONS */}
      {currentTab.startsWith('marketing-') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Chiến Dịch Khuyến Mãi & Tiếp Thị</h1>
            <p className="text-sm text-gray-500 mt-0.5">Tạo các chương trình đẩy doanh số, mã giảm giá và popup tiếp cận người dùng</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Popup Design Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700/50 pb-4">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Thiết Lập Popup Khuyến Mãi</h3>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="isActive" checked={popupForm.isActive} onChange={handlePopupChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-255 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  <span className="ml-2 text-xs text-gray-550 dark:text-gray-400 font-bold">{popupForm.isActive ? 'Đang kích hoạt' : 'Đang đóng'}</span>
                </label>
              </div>

              <form onSubmit={handlePopupSubmit} className="space-y-5 text-sm font-medium">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tiêu đề quảng cáo</label>
                  <input 
                    type="text" 
                    name="title"
                    value={popupForm.title}
                    onChange={handlePopupChange}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-650 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white font-semibold"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nội dung chiến dịch</label>
                  <textarea 
                    name="content"
                    value={popupForm.content}
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
                    value={popupForm.image}
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
                  onClick={() => toast.success('Tính năng thêm coupon mới đang được nâng cấp')}
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
      {currentTab.startsWith('reports-') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Báo Cáo Hoạt Động & Biểu Đồ</h1>
              <p className="text-sm text-gray-550 mt-0.5">Xuất các số liệu kinh doanh xuất nhập kho chi tiết hàng tháng</p>
            </div>
            <button 
              onClick={() => toast.success('Đang khởi tạo tệp báo cáo thống kê định dạng XLS...')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 text-sm transition-colors shadow-md"
            >
              <FileSpreadsheet size={18} /> Xuất báo cáo hoạt động
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700/50">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Doanh số tuần này</span>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">32.400.000 đ</h3>
              <span className="text-xs text-green-500 font-bold mt-1.5 block">↑ 8% so với tuần trước</span>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700/50">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Tỷ lệ hủy đơn hàng</span>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">2.4%</h3>
              <span className="text-xs text-green-500 font-bold mt-1.5 block">↓ 0.5% so với tháng trước</span>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700/50">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Giá trị trung bình giỏ</span>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">340.000 đ</h3>
              <span className="text-xs text-green-500 font-bold mt-1.5 block">↑ 12% chi tiêu giỏ</span>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700/50">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Người mua đăng ký mới</span>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">+48 tài khoản</h3>
              <span className="text-xs text-indigo-500 font-bold mt-1.5 block">Trong vòng 7 ngày qua</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl border border-gray-100 dark:border-gray-700/50 space-y-5">
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Danh sách 5 mặt hàng đem lại lợi nhuận cao nhất</h3>
            <div className="space-y-5 divide-y divide-gray-50 dark:divide-gray-750">
              {[
                { name: 'Phân trùn quế nguyên chất SFarm Pb01', sales: 1540, revenue: 130900000 },
                { name: 'Đất sạch mùn hữu cơ Tribat 10kg', sales: 1200, revenue: 54000000 },
                { name: 'Phân bón NPK 20-20-15 Phú Mỹ', sales: 910, revenue: 163800000 },
                { name: 'Chế phẩm sinh học Trichoderma Điền Trang', sales: 880, revenue: 39600000 },
                { name: 'Hạt giống cà chua Cherry quả ngọt', sales: 650, revenue: 22750000 }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm pt-4.5 first:pt-0 border-none">
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white text-base block">{i+1}. {item.name}</span>
                    <span className="text-xs text-gray-450 mt-1 block">Khối lượng bán ra: {item.sales} sản phẩm</span>
                  </div>
                  <strong className="text-primary text-base">{item.revenue.toLocaleString('vi-VN')} đ</strong>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ⚙️ TAB: SETTINGS WEBSITE */}
      {currentTab.startsWith('settings-') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl mx-auto">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Cấu Hình Website Cửa Hàng</h1>
            <p className="text-sm text-gray-500 mt-0.5">Thay đổi hotline, địa chỉ kho hàng và các chính sách bảo mật vận hành</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-150 dark:border-gray-700 p-8">
            <form onSubmit={(e) => { e.preventDefault(); toast.success('Đã lưu thông tin cấu hình website!'); }} className="space-y-5 text-sm font-medium">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-450 mb-1.5 uppercase tracking-wider">Tên trang web hiển thị</label>
                  <input 
                    type="text" 
                    value={webSettings.siteName}
                    onChange={(e) => setWebSettings({...webSettings, siteName: e.target.value})}
                    className="w-full bg-gray-55 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg px-4 py-2.5 text-sm outline-none text-gray-900 dark:text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-450 mb-1.5 uppercase tracking-wider">Hotline tổng đài chăm sóc</label>
                  <input 
                    type="text" 
                    value={webSettings.hotline}
                    onChange={(e) => setWebSettings({...webSettings, hotline: e.target.value})}
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
                    onChange={(e) => setWebSettings({...webSettings, email: e.target.value})}
                    className="w-full bg-gray-55 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg px-4 py-2.5 text-sm outline-none text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-450 mb-1.5 uppercase tracking-wider">Địa chỉ chi nhánh chính</label>
                  <input 
                    type="text" 
                    value={webSettings.address}
                    onChange={(e) => setWebSettings({...webSettings, address: e.target.value})}
                    className="w-full bg-gray-55 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg px-4 py-2.5 text-sm outline-none text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-450 mb-1.5 uppercase tracking-wider">Thông điệp giới thiệu</label>
                <textarea 
                  rows={2}
                  value={webSettings.intro}
                  onChange={(e) => setWebSettings({...webSettings, intro: e.target.value})}
                  className="w-full bg-gray-55 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg px-4 py-2.5 text-sm outline-none text-gray-900 dark:text-white resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-455 mb-1.5 uppercase tracking-wider">Chính sách trả hàng bảo hành</label>
                <textarea 
                  rows={4}
                  value={webSettings.policy}
                  onChange={(e) => setWebSettings({...webSettings, policy: e.target.value})}
                  className="w-full bg-gray-55 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg px-4 py-2.5 text-sm outline-none text-gray-900 dark:text-white resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-colors shadow-md">
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
                  toast.error('Mật khẩu mới nhập lại không khớp!');
                  return;
                }
                updateProfile({
                  name: profileName,
                  email: profileEmail,
                  avatar: profileAvatar,
                  phone: profilePhone
                });
                toast.success('Cập nhật hồ sơ cá nhân thành công!');
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }} 
              className="space-y-6 text-sm font-medium"
            >
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100 dark:border-gray-700/50">
                <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center font-bold overflow-hidden shadow-lg border-4 border-neutral-700 shrink-0">
                  {profileAvatar ? (
                    <img src={profileAvatar} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : (
                    profileName.charAt(0) || 'A'
                  )}
                </div>
                <div className="space-y-2 w-full">
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-450 uppercase tracking-wider">Đường dẫn ảnh đại diện (Avatar URL)</label>
                  <input 
                    type="text" 
                    value={profileAvatar}
                    onChange={(e) => setProfileAvatar(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg px-4 py-2.5 text-sm outline-none text-gray-900 dark:text-white"
                  />
                  <p className="text-[10px] text-gray-400">Nhập URL hình ảnh công khai để cập nhật ảnh đại diện quản trị của bạn.</p>
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
                    <input 
                      type="password" 
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full bg-gray-55 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg px-4 py-2.5 text-sm outline-none text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-455 mb-1.5 uppercase tracking-wider">Mật khẩu mới</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-gray-55 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg px-4 py-2.5 text-sm outline-none text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-455 mb-1.5 uppercase tracking-wider font-semibold text-primary">Nhập lại mật khẩu</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-gray-55 dark:bg-gray-700 border border-gray-250 dark:border-gray-655 rounded-lg px-4 py-2.5 text-sm outline-none text-gray-900 dark:text-white"
                    />
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

    </div>
  );
};

export default ManagerDashboard;
