import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  MessageSquare, 
  Gift, 
  BarChart3, 
  Settings, 
  LogOut, 
  ChevronDown, 
  ChevronRight, 
  Search, 
  Bell, 
  Leaf,
  Newspaper,
  BookOpen,
  Menu,
  X,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StaffLayout = () => {
  const { user, logout } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role === 'Manager') {
    return <Navigate to="/manager" replace />;
  } else if (user.role === 'Customer') {
    return <Navigate to="/" replace />;
  }

  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const currentFullPath = location.pathname + location.search;
  
  // Mobile sidebar state
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Quick Search state
  const [managerQuery, setManagerQuery] = useState('');

  // Accordion state
  const [openGroups, setOpenGroups] = useState({
    products: true,
    orders: true,
    customers: false,
    forum: false,
    marketing: false,
    reports: false,
    settings: false,
  });

  const toggleGroup = (group) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const menuGroups = [
    {
      id: 'dashboard',
      label: 'Tổng quan',
      icon: LayoutDashboard,
      path: '/staff'
    },
    {
      id: 'orders',
      label: 'Quản lý đơn hàng',
      icon: ShoppingCart,
      subItems: [
        { label: 'Tất cả đơn hàng', path: '/staff/orders?tab=orders-all' },
        { label: 'Đơn chờ xác nhận', path: '/staff/orders?tab=orders-pending' },
        { label: 'Đang giao', path: '/staff/orders?tab=orders-shipping' },
        { label: 'Hoàn thành', path: '/staff/orders?tab=orders-completed' },
        { label: 'Đã hủy', path: '/staff/orders?tab=orders-cancelled' }
      ]
    },
    {
      id: 'customers',
      label: 'Quản lý khách hàng',
      icon: Users,
      subItems: [
        { label: 'Danh sách khách hàng', path: '/staff/customers' }
      ]
    },
    {
      id: 'forum',
      label: 'Quản lý diễn đàn',
      icon: MessageSquare,
      subItems: [
        { label: 'Duyệt bài viết', path: '/staff/forum/posts' },
        { label: 'Quản lý bình luận', path: '/staff/forum/comments' },
        { label: 'Báo cáo vi phạm', path: '/staff/forum/reports' }
      ]
    },
    {
      id: 'handbook',
      label: 'Cẩm nang (Handbook)',
      icon: BookOpen,
      path: '/staff/handbook'
    },
    {
      id: 'news',
      label: 'Tin Tức',
      icon: Newspaper,
      path: '/staff/news'
    },
    {
      id: 'notifications',
      label: 'Thông báo',
      icon: Bell,
      path: '/staff/notifications'
    },
    {
      id: 'settings',
      label: 'Cài đặt',
      icon: Settings,
      subItems: [
        { label: 'Hồ sơ cá nhân', path: '/staff/settings/profile' }
      ]
    }
  ];

  const handleTabClick = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    menuGroups.forEach(group => {
      if (group.subItems) {
        const hasActiveSub = group.subItems.some(sub => sub.path === currentFullPath || sub.path === currentPath);
        if (hasActiveSub) {
          setOpenGroups(prev => ({ ...prev, [group.id]: true }));
        }
      }
    });
  }, [currentFullPath, currentPath]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden text-gray-800 dark:text-gray-200 transition-colors duration-300">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 text-gray-300 border-r border-neutral-800/60 flex flex-col shrink-0 transition-transform duration-300
        lg:relative lg:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Brand Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-800/60">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white shrink-0">
              <Leaf size={20} />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Yggdrasil</h2>
          </div>
          <button onClick={() => setIsMobileOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-2.5 scrollbar-thin">
          {menuGroups.map((group) => {
            const Icon = group.icon;
            
            if (!group.subItems) {
              const isActive = currentPath === group.path || currentFullPath === group.path;
              return (
                <button
                  key={group.id}
                  onClick={() => handleTabClick(group.path)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-base font-semibold transition-all ${
                    isActive 
                      ? 'bg-primary text-white shadow-sm shadow-primary/25' 
                      : 'text-gray-350 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{group.label}</span>
                </button>
              );
            }

            // Accordion Item
            const isOpen = openGroups[group.id];
            const hasActiveSub = group.subItems.some(sub => sub.path === currentPath || sub.path === currentFullPath);
            
            return (
              <div key={group.id} className="space-y-1.5">
                <button
                  onClick={() => toggleGroup(group.id)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-base font-semibold transition-all ${
                    hasActiveSub 
                      ? 'text-white font-bold bg-neutral-800' 
                      : 'text-gray-355 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span>{group.label}</span>
                  </div>
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                
                {isOpen && (
                  <div className="pl-9 space-y-1.5">
                    {group.subItems.map((sub) => {
                      const isSubActive = sub.path === currentFullPath || sub.path === currentPath;
                      return (
                        <button
                          key={sub.path}
                          onClick={() => handleTabClick(sub.path)}
                          className={`w-full text-left py-2 px-3 rounded-md text-sm font-medium transition-colors block ${
                            isSubActive 
                              ? 'text-primary dark:text-emerald-450 font-bold bg-primary/10' 
                              : 'text-gray-400 hover:text-white hover:bg-neutral-800/40'
                          }`}
                        >
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        
        {/* Logout bottom area */}
        <div className="p-3 border-t border-neutral-800 space-y-1">
          <Link 
            to="/"
            className="w-full flex items-center gap-3 px-3 py-3 text-gray-300 hover:text-white hover:bg-neutral-800/80 rounded-lg transition-colors text-base font-semibold"
          >
            <Home size={20} />
            <span>Quay lại trang User</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 text-red-400 hover:text-red-350 hover:bg-red-950/20 rounded-lg transition-colors text-base font-semibold"
          >
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Dashboard Header */}
        <header className="h-16 bg-neutral-900 border-b border-neutral-800/60 flex items-center justify-between px-6 shrink-0 relative z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white p-1.5 hover:bg-neutral-800 rounded-lg"
            >
              <Menu size={20} />
            </button>
            
            {/* Quick Search */}
            <div className="relative w-48 sm:w-64 md:w-80 hidden xs:block">
              <input 
                type="text"
                placeholder="Tìm nhanh tính năng, đơn hàng..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-full py-1.5 pl-9 pr-4 text-xs outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white"
                value={managerQuery}
                onChange={(e) => setManagerQuery(e.target.value)}
              />
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          {/* Admin User Profile */}
          <div className="flex items-center gap-5">
            
            <div className="w-px h-6 bg-neutral-800"></div>

            <button 
              onClick={() => handleTabClick('profile-edit')}
              className="flex items-center gap-3 hover:opacity-85 transition-opacity text-left outline-none cursor-pointer"
              title="Chỉnh sửa hồ sơ cá nhân"
            >
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold overflow-hidden shadow-md border-2 border-neutral-700 shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Admin Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0) || 'A'
                )}
              </div>
              <div className="text-left hidden sm:block">
                <span className="block text-sm font-bold text-white leading-tight">
                  {user?.name || 'Quản trị viên'}
                </span>
                <span className="block text-xs text-gray-400 font-medium mt-0.5">
                  {user?.role || 'Administrator'}
                </span>
              </div>
            </button>
          </div>
        </header>

        {/* Dynamic Route Outlet */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-gray-50/50 dark:bg-gray-900/40">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StaffLayout;
