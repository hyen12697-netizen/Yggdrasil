import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, LogOut, Bell, UserPlus, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { usePromotedProducts } from '../hooks/usePromotedProducts';
import { useSystemNotification } from '../context/SystemNotificationContext';

// Helper to remove Vietnamese accents for better search
const removeAccents = (str) => {
  return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
};

const Header = () => {
  const { user, logout } = useAuth();
  const { cartCount, openAddToCartModal } = useCart();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const products = usePromotedProducts();
  const { activeNotifications, unreadCount, markAsRead } = useSystemNotification();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    openAddToCartModal(product);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
    } else {
      const normalizedQuery = removeAccents(query.toLowerCase());
      
      const scoredProducts = products.map(p => {
        const normalizedName = removeAccents(p.name.toLowerCase());
        let score = 0;
        
        // 1. Exact match
        if (normalizedName === normalizedQuery) {
          score = 100;
        } 
        // 2. Starts with query
        else if (normalizedName.startsWith(normalizedQuery)) {
          score = 75;
        } 
        // 3. Starts with query at word boundary
        else if (normalizedName.includes(` ${normalizedQuery}`)) {
          score = 50;
        } 
        // 4. Contains query anywhere
        else if (normalizedName.includes(normalizedQuery)) {
          score = 10;
        }

        return { ...p, score };
      });

      const filtered = scoredProducts
        .filter(p => p.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      setSearchResults(filtered);
    }
  };

  const handleResultClick = (id) => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
    navigate(`/product/${id}`);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-white h-[40px] hidden md:block">
        <div className="max-w-7xl mx-auto px-4 h-full grid grid-cols-3 items-center text-[14px] font-medium">
          <div className="flex items-center justify-start gap-2">
            <span>Hotline tư vấn:</span>
            <strong className="text-yellow-300">08357757501</strong>
          </div>
          <div className="flex items-center justify-center italic font-normal opacity-90">
            Nơi sự sống vươn mình mạnh mẽ
          </div>
          <div className="flex items-center justify-end gap-6">
            <Link to="/contact" className="hover:text-yellow-300 transition-colors">Liên hệ</Link>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 h-auto md:h-[90px] py-4 md:py-0 flex flex-wrap md:flex-nowrap justify-between items-center gap-6">
        
        {/* Logo */}
        <Link to="/" className="flex flex-col items-start shrink-0">
          <h1 className="text-5xl font-extrabold text-primary tracking-tight leading-none">Yggdrasil</h1>
          <p className="text-[12px] text-gray-500 dark:text-gray-400 uppercase tracking-widest hidden sm:block mt-1">Nông nghiệp xanh</p>
        </Link>

        {/* Search */}
        <div className="flex-1 w-full md:w-auto order-3 md:order-none max-w-[650px] mx-auto">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Tìm kiếm phân bón, hạt giống, thuốc bảo vệ thực vật..." 
              className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full py-3 pl-6 pr-16 text-[15px] outline-none focus:ring-2 focus:ring-primary border border-gray-200 dark:border-gray-700 transition-all shadow-sm"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            />
            <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-primary text-white px-6 rounded-full hover:bg-primary-dark transition-colors flex items-center justify-center shadow-md">
              <Search size={22} />
            </button>
            
            {/* Search Results Dropdown */}
            {isSearchFocused && searchQuery.trim() !== '' && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                {searchResults.length > 0 ? (
                  <ul>
                    {searchResults.map(product => (
                      <li key={product.id} className="border-b border-gray-50 dark:border-gray-700 last:border-0">
                        <button 
                          onMouseDown={() => handleResultClick(product.id)}
                          className="w-full text-left flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded bg-gray-100 dark:bg-gray-700" />
                          <div className="flex-1">
                            <h4 className="text-[14px] font-medium text-gray-900 dark:text-white line-clamp-1">{product.name}</h4>
                            <p className="text-[12px] text-gray-500 mt-0.5">{product.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[14px] font-bold text-primary">{product.price.toLocaleString('vi-VN')} ₫</p>
                            {product.oldPrice && (
                              <p className="text-[12px] text-gray-400 line-through">{product.oldPrice.toLocaleString('vi-VN')} ₫</p>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-500 text-[14px]">
                    Không tìm thấy sản phẩm phù hợp.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-6 sm:gap-8 text-gray-700 dark:text-gray-300 order-2 md:order-none shrink-0 h-full">
          
          {user ? (
            <div className="relative group cursor-pointer h-full flex items-center">
              <div className="flex flex-col items-center hover:text-primary transition-colors py-2">
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover border-2 border-gray-100" />
                ) : (
                  <User size={28} strokeWidth={1.5} />
                )}
                <span className="text-[14px] mt-1.5 font-medium hidden lg:block truncate max-w-[80px]">{user.name.split(' ').pop()}</span>
              </div>
              
              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-2">
                  <p className="text-base font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
                <Link to="/profile" className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Tài khoản của tôi</Link>
                <Link to="/orders" className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Theo dõi đơn hàng</Link>
                {user.role === 'Manager' && (
                  <Link to="/manager" className="block px-4 py-2.5 text-sm text-primary font-medium hover:bg-gray-50 dark:hover:bg-gray-700">Dashboard Quản lý</Link>
                )}
                {user.role === 'Staff' && (
                  <Link to="/staff" className="block px-4 py-2.5 text-sm text-green-600 font-medium hover:bg-gray-50 dark:hover:bg-gray-700">Staff Dashboard</Link>
                )}
                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 mt-1">
                  <LogOut size={18} /> Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="flex flex-col items-center hover:text-primary transition-colors py-2">
                <User size={28} strokeWidth={1.5} />
                <span className="text-[14px] mt-1.5 font-medium hidden lg:block">Đăng nhập</span>
              </Link>
              <Link to="/register" className="flex flex-col items-center hover:text-primary transition-colors py-2">
                <UserPlus size={28} strokeWidth={1.5} />
                <span className="text-[14px] mt-1.5 font-medium hidden lg:block">Đăng ký</span>
              </Link>
            </>
          )}

          <div className="relative group cursor-pointer h-full flex items-center">
            <div className="flex flex-col items-center hover:text-primary transition-colors py-2">
              <div className="relative">
                <Bell size={28} strokeWidth={1.5} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">{unreadCount}</span>
                )}
              </div>
              <span className="text-[14px] mt-1.5 font-medium hidden lg:block">Thông báo</span>
            </div>
            
            {/* Notifications Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-base font-semibold text-gray-900 dark:text-white">Thông báo mới nhận ({unreadCount})</p>
              </div>
              <div className="max-h-[300px] overflow-y-auto hide-scrollbar">
                {activeNotifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    Không có thông báo nào.
                  </div>
                ) : (
                  activeNotifications.map(n => (
                    <div 
                      key={n.id}
                      onClick={() => {
                        markAsRead(n.id);
                        navigate(n.url || '/');
                      }}
                      className={`flex items-start gap-3 p-3 transition-colors border-b border-gray-50 dark:border-gray-700 cursor-pointer ${n.isRead ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700' : 'bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-900/30'}`}
                    >
                      <div className="flex-1">
                        <p className={`text-sm ${n.isRead ? 'text-gray-900 dark:text-gray-200 font-medium' : 'text-gray-900 dark:text-white font-bold'} line-clamp-2`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">{n.content}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(n.date).toLocaleDateString('vi-VN')}</p>
                      </div>
                      {!n.isRead && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="relative group cursor-pointer h-full flex items-center">
            <Link to="/wishlist" className="flex flex-col items-center hover:text-primary transition-colors py-2">
              <div className="relative">
                <Heart size={28} strokeWidth={1.5} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">
                    {wishlistItems.length}
                  </span>
                )}
              </div>
              <span className="text-[14px] mt-1.5 font-medium hidden lg:block">Yêu thích</span>
            </Link>

            {/* Wishlist Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-base font-semibold text-gray-900 dark:text-white">Sản phẩm yêu thích ({wishlistItems.length})</p>
              </div>
              <div className="max-h-[300px] overflow-y-auto hide-scrollbar">
                {wishlistItems.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    Chưa có sản phẩm nào
                  </div>
                ) : (
                  wishlistItems.slice(0, 5).map(p => (
                    <Link key={p.id} to={`/product/${p.id}`} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-50 dark:border-gray-700 last:border-0">
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 overflow-hidden shrink-0">
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1592424001806-538421319246?auto=format&fit=crop&q=80&w=100';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{p.name}</p>
                        <p className="text-primary font-bold text-sm mt-1">{p.price.toLocaleString('vi-VN')} ₫</p>
                      </div>
                      <button onClick={(e) => handleAddToCart(e, p)} className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors shrink-0" title="Thêm vào giỏ">
                        <ShoppingCart size={18} />
                      </button>
                    </Link>
                  ))
                )}
              </div>
              <div className="p-2 text-center border-t border-gray-100 dark:border-gray-700">
                <Link to="/wishlist" className="text-sm text-primary font-medium hover:underline">Xem danh sách yêu thích</Link>
              </div>
            </div>
          </div>

          <Link to="/cart" className="flex flex-col items-center hover:text-primary transition-colors relative py-2">
            <div className="relative">
              <ShoppingCart size={28} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[14px] mt-1.5 font-medium hidden lg:block">Giỏ hàng</span>
          </Link>

        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 relative shadow-[0_4px_6px_-4px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-center gap-12 lg:gap-14 overflow-x-auto whitespace-nowrap hide-scrollbar text-[17px] font-medium text-gray-800 dark:text-gray-200 h-[60px]">
            <li className="h-full flex items-center">
              <Link to="/" className="flex items-center h-full px-2 hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors">Trang Chủ</Link>
            </li>
            
            {/* Phân Bón + Mega Menu */}
            <li className="h-full flex items-center group">
              <Link to="/category/phan-bon" className="flex items-center gap-1 h-full px-2 hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors cursor-pointer">
                Phân Bón <ChevronDown size={18} className="group-hover:rotate-180 transition-transform duration-300" />
              </Link>
              
              {/* Mega Menu Dropdown */}
              <div className="absolute left-0 top-full w-full bg-white dark:bg-gray-800 shadow-xl border-t border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform origin-top translate-y-2 group-hover:translate-y-0">
                <div className="max-w-7xl mx-auto px-4 py-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    
                    {/* Cột 1 */}
                    <div>
                      <h3 className="text-[16px] font-bold text-primary mb-4 border-b border-gray-100 pb-2">Phân bón hữu cơ</h3>
                      <ul className="flex flex-col gap-3 text-[15px] text-gray-600 dark:text-gray-400 font-normal">
                        <li><Link to="/category/phan-bon/phan-chuong" className="hover:text-primary hover:translate-x-2 transition-transform inline-block">Phân chuồng</Link></li>
                        <li><Link to="/category/phan-bon/phan-trun-que" className="hover:text-primary hover:translate-x-2 transition-transform inline-block">Phân trùn quế</Link></li>
                        <li><Link to="/category/phan-bon/phan-bo-u-vi-sinh" className="hover:text-primary hover:translate-x-2 transition-transform inline-block">Phân bò ủ vi sinh</Link></li>
                        <li><Link to="/category/phan-bon/phan-ga-u-vi-sinh" className="hover:text-primary hover:translate-x-2 transition-transform inline-block">Phân gà ủ vi sinh</Link></li>
                        <li><Link to="/category/phan-bon/phan-de" className="hover:text-primary hover:translate-x-2 transition-transform inline-block">Phân dê</Link></li>
                        <li><Link to="/category/phan-bon/phan-ca" className="hover:text-primary hover:translate-x-2 transition-transform inline-block">Phân cá</Link></li>
                        <li><Link to="/category/phan-bon/phan-doi" className="hover:text-primary hover:translate-x-2 transition-transform inline-block">Phân dơi</Link></li>
                        <li><Link to="/category/phan-bon/phan-compost" className="hover:text-primary hover:translate-x-2 transition-transform inline-block">Phân compost</Link></li>
                      </ul>
                    </div>
                    
                    {/* Cột 2 */}
                    <div>
                      <h3 className="text-[16px] font-bold text-primary mb-4 border-b border-gray-100 pb-2">Phân bón vô cơ</h3>
                      <ul className="flex flex-col gap-3 text-[15px] text-gray-600 dark:text-gray-400 font-normal">
                        <li><Link to="/category/phan-bon/npk" className="hover:text-primary hover:translate-x-2 transition-transform inline-block">NPK</Link></li>
                        <li><Link to="/category/phan-bon/ure" className="hover:text-primary hover:translate-x-2 transition-transform inline-block">Ure</Link></li>
                        <li><Link to="/category/phan-bon/dap" className="hover:text-primary hover:translate-x-2 transition-transform inline-block">DAP</Link></li>
                        <li><Link to="/category/phan-bon/kali" className="hover:text-primary hover:translate-x-2 transition-transform inline-block">Kali</Link></li>
                        <li><Link to="/category/phan-bon/sa" className="hover:text-primary hover:translate-x-2 transition-transform inline-block">SA</Link></li>
                      </ul>
                    </div>
                    
                    {/* Cột 3 */}
                    <div>
                      <h3 className="text-[16px] font-bold text-primary mb-4 border-b border-gray-100 pb-2">Phân bón lá & Vi sinh</h3>
                      <ul className="flex flex-col gap-3 text-[15px] text-gray-600 dark:text-gray-400 font-normal">
                        <li><Link to="/category/phan-bon/phan-bon-la" className="hover:text-primary hover:translate-x-2 transition-transform inline-block">Phân bón lá</Link></li>
                        <li><Link to="/category/phan-bon/phan-vi-sinh" className="hover:text-primary hover:translate-x-2 transition-transform inline-block">Phân vi sinh</Link></li>
                      </ul>
                    </div>
                    
                    {/* Cột 4 */}
                    <div>
                      <h3 className="text-[16px] font-bold text-primary mb-4 border-b border-gray-100 pb-2">Giải pháp đặc biệt</h3>
                      <ul className="flex flex-col gap-3 text-[15px] text-gray-600 dark:text-gray-400 font-normal">
                        <li><Link to="/category/phan-bon/phan-cai-tao-dat" className="hover:text-primary hover:translate-x-2 transition-transform inline-block">Phân cải tạo đất</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            <li className="h-full flex items-center">
              <Link to="/category/thuoc-bvv" className="flex items-center h-full px-2 hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors">Thuốc Bảo Vệ Thực Vật</Link>
            </li>
            <li className="h-full flex items-center">
              <Link to="/category/hat-giong" className="flex items-center h-full px-2 hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors">Hạt Giống</Link>
            </li>
            <li className="h-full flex items-center">
              <Link to="/handbook" className="flex items-center h-full px-2 hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors">Cẩm Nang</Link>
            </li>
            <li className="h-full flex items-center">
              <Link to="/forum" className="flex items-center h-full px-2 hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors">Diễn Đàn</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
