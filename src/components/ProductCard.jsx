import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Eye, CreditCard } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { openAddToCartModal } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openAddToCartModal(product);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openAddToCartModal(product, () => {
      navigate('/cart');
    });
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const isFavorited = isInWishlist(product.id);

  // Generate star rating elements
  const renderStars = (rating = 5) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floorRating) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i - 0.5 <= rating) {
        stars.push(<span key={i} className="text-yellow-400 relative">★<span className="absolute left-0 top-0 overflow-hidden w-1/2 text-gray-300">★</span></span>);
      } else {
        stars.push(<span key={i} className="text-gray-300 dark:text-gray-600">★</span>);
      }
    }
    return stars;
  };

  return (
    <motion.div 
      whileHover={{ y: -6 }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 group flex flex-col h-full relative"
    >
      {/* Wishlist button top-right */}
      <button 
        onClick={handleToggleWishlist}
        className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center shadow-sm backdrop-blur-sm transition-colors ${
          isFavorited 
            ? 'bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-500/20 dark:text-red-400' 
            : 'bg-white/80 dark:bg-gray-800/80 text-gray-500 hover:text-red-500'
        }`}
        title={isFavorited ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
      >
        <Heart size={16} className={`group-hover:scale-110 transition-transform ${isFavorited ? 'fill-current' : ''}`} />
      </button>

      {/* Product Image Link */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-square shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.name} 
            className="object-cover w-full h-full mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500" 
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = 'https://images.unsplash.com/photo-1592424001806-538421319246?auto=format&fit=crop&q=80&w=400';
            }}
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
              Mới
            </span>
          )}
          {product.promotionLabel ? (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
              {product.promotionLabel}
            </span>
          ) : product.discount ? (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
              -{product.discount}%
            </span>
          ) : null}
        </div>
      </Link>
      
      {/* Product Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category & Subcategory */}
        <div className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <span>{product.category}</span>
          {product.subcategory && (
            <>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <span className="text-primary font-medium">{product.subcategory}</span>
            </>
          )}
        </div>

        {/* Product Name */}
        <Link to={`/product/${product.id}`} className="block mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors text-sm md:text-base">
            {product.name}
          </h3>
        </Link>
        
        {/* Price Row */}
        <div className="flex items-end gap-2 mt-auto mb-2">
          <span className="text-base md:text-lg font-bold text-primary">
            {product.price.toLocaleString('vi-VN')}đ
          </span>
          {product.oldPrice && (
            <span className="text-xs text-gray-400 line-through mb-0.5">
              {product.oldPrice.toLocaleString('vi-VN')}đ
            </span>
          )}
        </div>
        
        {/* Rating and Sales */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700/50 pt-2 mb-4">
          <div className="flex items-center gap-0.5">
            {renderStars(product.rating)}
            <span className="ml-1 text-[11px] font-medium">({product.rating || 5})</span>
          </div>
          <span>Đã bán {product.soldCount || 100}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-auto">
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={handleAddToCart}
              className="bg-primary/10 hover:bg-primary text-primary hover:text-white font-semibold py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all text-xs border border-primary/20 hover:border-primary shadow-sm"
              title="Thêm vào giỏ hàng"
            >
              <ShoppingCart size={14} />
              Thêm giỏ
            </button>
            <button 
              onClick={handleBuyNow}
              className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all text-xs shadow-sm hover:shadow-md"
              title="Mua ngay"
            >
              <CreditCard size={14} />
              Mua ngay
            </button>
          </div>
          
          <Link 
            to={`/product/${product.id}`}
            className="w-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-xs border border-gray-200/60 dark:border-gray-600/60"
          >
            <Eye size={14} />
            Xem chi tiết
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
