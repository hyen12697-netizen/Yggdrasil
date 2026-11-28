import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, HeartCrack, ChevronRight, Home, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Wishlist = () => {
  const navigate = useNavigate();
  const { openAddToCartModal } = useCart();
  const { wishlistProducts, isLoading, removeFromWishlist } = useWishlist();
  const { showNotification } = useNotification();
  const { user } = useAuth();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!user) {
      if (isInitialMount.current) {
        showNotification({
          type: 'confirm',
          title: 'Yêu cầu đăng nhập',
          message: 'Vui lòng đăng nhập để xem danh sách yêu thích.',
          onConfirm: () => navigate('/login')
        });
      }
      navigate('/login');
    }
    isInitialMount.current = false;
  }, [user, navigate, showNotification]);

  if (!user) return null;

  const handleRemove = (productId) => {
    removeFromWishlist(productId);
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    openAddToCartModal(product);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary flex items-center gap-1">
            <Home size={14} />
            Trang chủ
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 dark:text-gray-100 font-medium">Danh sách yêu thích</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Danh Sách Yêu Thích</h1>
            <p className="text-gray-500 mt-2">
              {isLoading ? 'Đang tải...' : `Bạn có ${wishlistProducts.length} sản phẩm trong danh sách`}
            </p>
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-16 text-center shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-4">
            <Loader2 size={40} className="text-primary animate-spin" />
            <p className="text-gray-500">Đang tải danh sách yêu thích...</p>
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-24 h-24 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <HeartCrack size={48} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Chưa có sản phẩm yêu thích nào</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Bạn chưa có sản phẩm nào trong danh sách yêu thích. Hãy quay lại cửa hàng để khám phá thêm nhiều sản phẩm tuyệt vời nhé!
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center bg-primary text-white font-semibold py-3 px-8 rounded-full hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    <th className="p-4 pl-6">Sản phẩm</th>
                    <th className="p-4 w-40">Giá</th>
                    <th className="p-4 w-36 text-center">Trạng thái</th>
                    <th className="p-4 w-44 text-right pr-6">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  <AnimatePresence>
                    {wishlistProducts.map((item) => (
                      <motion.tr
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group"
                      >
                        {/* Product info */}
                        <td className="p-4 pl-6">
                          <Link to={`/product/${item.id}`} className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-700 shrink-0 overflow-hidden relative border border-gray-200 dark:border-gray-600">
                              <img
                                src={item.image || 'https://images.unsplash.com/photo-1592424001806-538421319246?auto=format&fit=crop&q=80&w=200'}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://images.unsplash.com/photo-1592424001806-538421319246?auto=format&fit=crop&q=80&w=200';
                                }}
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white text-base hover:text-primary transition-colors line-clamp-2">
                                {item.name}
                              </h3>
                              {item.category && (
                                <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                              )}
                            </div>
                          </Link>
                        </td>

                        {/* Price */}
                        <td className="p-4 align-middle">
                          <div className="font-bold text-primary text-lg">
                            {Number(item.price).toLocaleString('vi-VN')}đ
                          </div>
                          {item.oldPrice && (
                            <div className="text-sm text-gray-400 line-through">
                              {Number(item.oldPrice).toLocaleString('vi-VN')}đ
                            </div>
                          )}
                        </td>

                        {/* Stock status */}
                        <td className="p-4 align-middle text-center">
                          {item.inStock ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Còn hàng
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                              Hết hàng
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="p-4 pr-6 align-middle text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => handleAddToCart(e, item)}
                              disabled={!item.inStock}
                              className={`px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all font-medium text-sm ${
                                item.inStock
                                  ? 'bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                              }`}
                              title={item.inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                            >
                              <ShoppingCart size={18} />
                              <span className="hidden sm:inline">Thêm giỏ</span>
                            </button>
                            <button
                              onClick={() => handleRemove(item.id)}
                              className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white dark:bg-red-500/10 dark:hover:bg-red-600 transition-all shadow-sm hover:shadow"
                              title="Xóa khỏi yêu thích"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
