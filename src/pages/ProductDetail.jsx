import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { ShoppingCart, Heart, Plus, Minus, MessageCircle, Star, CheckCircle, Package, Award, Sparkles, BookOpen, ArrowLeft, Loader2 } from 'lucide-react';
import { usePromotedProducts } from '../hooks/usePromotedProducts';
import { useProduct } from '../context/ProductContext';
import { usePromotion } from '../context/PromotionContext';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useNotification } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductReviews, createProductReview } from '../api';

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('info');
  const [selectedImage, setSelectedImage] = useState('');

  const products = usePromotedProducts();
  const { fetchProductById } = useProduct();
  const { getActivePromotions } = usePromotion();
  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showNotification } = useNotification();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [detailProduct, setDetailProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState(null);

  // Gọi API chi tiết sản phẩm GET /products/{id}
  useEffect(() => {
    let active = true;

    Promise.resolve()
      .then(() => {
        if (!active) return null;
        setProductLoading(true);
        setProductError(null);
        setQuantity(1);
        return fetchProductById(id);
      })
      .then((data) => {
        if (!active) return;
        setDetailProduct(data);
        setSelectedImage(data?.image || '');
      })
      .catch((err) => {
        if (!active) return;
        // Fallback sang danh sách đã load nếu có khớp id
        const fallback = products.find((p) => String(p.id) === String(id));
        if (fallback) {
          setDetailProduct(fallback);
          setSelectedImage(fallback.image || '');
        } else {
          setDetailProduct(null);
          setProductError(err.message || 'Không tìm thấy sản phẩm.');
        }
      })
      .finally(() => {
        if (active) setProductLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, fetchProductById]);

  // Áp dụng khuyến mãi đang chạy nếu có lên sản phẩm chi tiết
  const product = useMemo(() => {
    const cached = products.find((p) => String(p.id) === String(id));
    const base = detailProduct || cached;
    if (!base) return null;

    const activePromotions = getActivePromotions?.() || [];
    if (!activePromotions.length) return base;

    let bestDiscountedPrice = base.price;
    let appliedPromotion = null;
    let maxDiscountAmount = 0;

    activePromotions.forEach((promo) => {
      let isApplicable = false;
      if (promo.targetType === 'all') {
        isApplicable = true;
      } else if (promo.targetType === 'category' && promo.targetCategories?.includes(base.category)) {
        isApplicable = true;
      } else if (promo.targetType === 'product' && promo.targetProducts?.includes(base.id)) {
        isApplicable = true;
      }

      if (isApplicable) {
        let currentDiscountAmount = 0;
        let calculatedPrice = base.price;
        if (promo.type === 'percentage') {
          currentDiscountAmount = (base.price * promo.value) / 100;
          calculatedPrice = base.price - currentDiscountAmount;
        } else if (promo.type === 'fixed') {
          currentDiscountAmount = promo.value;
          calculatedPrice = Math.max(0, base.price - currentDiscountAmount);
        }
        if (currentDiscountAmount > maxDiscountAmount) {
          maxDiscountAmount = currentDiscountAmount;
          bestDiscountedPrice = calculatedPrice;
          appliedPromotion = promo;
        }
      }
    });

    if (appliedPromotion) {
      return {
        ...base,
        price: bestDiscountedPrice,
        oldPrice: base.oldPrice ?? base.price,
        promotionLabel:
          appliedPromotion.type === 'percentage'
            ? `-${appliedPromotion.value}%`
            : `-${appliedPromotion.value.toLocaleString('vi-VN')}đ`,
      };
    }

    return base;
  }, [detailProduct, products, id, getActivePromotions]);

  const galleryImages = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    return product.image ? [product.image] : [];
  }, [product]);

  // Find related products in the same subcategory, fallback to same category
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    let list = [];
    if (product.subcategory) {
      list = products.filter((p) => p.subcategory === product.subcategory && p.id !== product.id);
    }
    if (list.length === 0 && product.category) {
      list = products.filter((p) => p.category === product.category && p.id !== product.id);
    }
    return list.slice(0, 4);
  }, [product, products]);

  // ─── Reviews State ─────────────────────────────────────────────────────────
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  const [reviewPage, setReviewPage] = useState(0);
  const [reviewsTotalPages, setReviewsTotalPages] = useState(1);

  // ─── Submit form state ────────────────────────────────────────────────────
  const [submitRating, setSubmitRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitComment, setSubmitComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  const fetchReviews = useCallback(async (pid, page = 0) => {
    if (!pid) return;
    setReviewsLoading(true);
    setReviewsError(null);
    try {
      const data = await getProductReviews(pid, { page, size: 10 });
      const list = data?.content ?? (Array.isArray(data) ? data : []);
      if (page === 0) {
        setReviews(list);
      } else {
        setReviews((prev) => [...prev, ...list]);
      }
      setReviewsTotalPages(data?.totalPages ?? 1);
      setReviewPage(page);
    } catch (err) {
      setReviewsError(err.message || 'Không thể tải đánh giá.');
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  const productIdForReviews = product?.id;

  useEffect(() => {
    if (productIdForReviews) {
      Promise.resolve().then(() => {
        fetchReviews(productIdForReviews, 0);
        setHasReviewed(false);
      });
    }
  }, [productIdForReviews, fetchReviews]);

  const avgRating = useMemo(() => {
    const backendRating = product?.avgRating ?? product?.rating;
    if (backendRating) return Number(backendRating);
    if (!reviews.length) return 0;
    return reviews.reduce((acc, r) => acc + (r.rating ?? 0), 0) / reviews.length;
  }, [reviews, product]);

  const totalReviews = product?.totalReviews ?? reviews.length;

  if (productLoading && !product) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500">
        <Loader2 size={40} className="animate-spin text-primary" />
        <p className="text-sm font-medium">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-10 text-center max-w-md w-full">
          <Package size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Không tìm thấy sản phẩm</h2>
          <p className="text-sm text-gray-500 mb-6">{productError || 'Sản phẩm này có thể đã ngừng kinh doanh hoặc không tồn tại.'}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-6 rounded-full transition-colors text-sm"
          >
            <ArrowLeft size={16} /> Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const maxStock = product.stockQuantity ?? product.stock ?? 0;
  const inStock = product.isAvailable !== false && maxStock > 0;
  const isFavorited = isInWishlist(product.id);
  const mainImageSrc = selectedImage || product.image || 'https://images.unsplash.com/photo-1592424001806-538421319246?auto=format&fit=crop&q=80&w=600';

  const handleQuantity = (type) => {
    if (type === 'inc') {
      setQuantity((q) => {
        const current = parseInt(q) || 0;
        if (current + 1 > maxStock) {
          showNotification({ type: 'error', message: `Số lượng yêu cầu vượt quá tồn kho. Hiện chỉ còn ${maxStock} sản phẩm trong kho.` });
          return current;
        }
        return current + 1;
      });
    }
    if (type === 'dec' && (parseInt(quantity) || 0) > 1) setQuantity((q) => (parseInt(q) || 0) - 1);
  };

  const handleAddToCart = () => {
    if (!user) {
      showNotification({
        type: 'confirm',
        title: 'Yêu cầu đăng nhập',
        message: 'Vui lòng đăng nhập để tiếp tục mua hàng.',
        onConfirm: () => navigate('/login'),
      });
      return;
    }

    const currentQty = parseInt(quantity) || 1;
    const cartItem = cartItems?.find((item) => item.id === product.id);
    const inCartQty = cartItem ? cartItem.quantity : 0;

    if (currentQty + inCartQty > maxStock) {
      showNotification({ type: 'error', message: `Số lượng yêu cầu vượt quá tồn kho. Hiện chỉ còn ${maxStock} sản phẩm trong kho.` });
      return;
    }

    addToCart(product, currentQty);
  };

  const handleBuyNow = () => {
    if (!user) {
      showNotification({
        type: 'confirm',
        title: 'Yêu cầu đăng nhập',
        message: 'Vui lòng đăng nhập để tiếp tục mua hàng.',
        onConfirm: () => navigate('/login'),
      });
      return;
    }

    const currentQty = parseInt(quantity) || 1;
    const cartItem = cartItems?.find((item) => item.id === product.id);
    const inCartQty = cartItem ? cartItem.quantity : 0;

    if (currentQty + inCartQty > maxStock) {
      showNotification({ type: 'error', message: `Số lượng yêu cầu vượt quá tồn kho. Hiện chỉ còn ${maxStock} sản phẩm trong kho.` });
      return;
    }

    addToCart(product, currentQty);
    navigate('/cart');
  };

  const handleToggleWishlist = () => {
    if (!user) {
      showNotification({
        type: 'confirm',
        title: 'Yêu cầu đăng nhập',
        message: 'Vui lòng đăng nhập để tiếp tục mua hàng.',
        onConfirm: () => navigate('/login'),
      });
      return;
    }
    toggleWishlist(product);
  };

  const renderStars = (rating = 5) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floorRating) {
        stars.push(<Star key={i} className="fill-current text-yellow-400" size={16} />);
      } else {
        stars.push(<Star key={i} className="text-gray-300 dark:text-gray-600" size={16} />);
      }
    }
    return stars;
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      showNotification({
        type: 'confirm',
        title: 'Yêu cầu đăng nhập',
        message: 'Vui lòng đăng nhập để gửi đánh giá.',
        onConfirm: () => navigate('/login'),
      });
      return;
    }
    if (!submitComment.trim()) {
      showNotification({ type: 'error', message: 'Vui lòng nhập nội dung đánh giá!' });
      return;
    }
    setIsSubmitting(true);
    try {
      const newReview = await createProductReview(product.id, {
        rating: submitRating,
        comment: submitComment.trim(),
      });
      setReviews((prev) => [newReview, ...prev]);
      setSubmitComment('');
      setSubmitRating(5);
      setHasReviewed(true);
      showNotification({ type: 'success', message: 'Đánh giá của bạn đã được gửi thành công!' });
    } catch (err) {
      const msg =
        err?.status === 409
          ? 'Bạn đã đánh giá sản phẩm này rồi!'
          : err.message || 'Không thể gửi đánh giá. Vui lòng thử lại.';
      showNotification({ type: 'error', message: msg });
      if (err?.status === 409) setHasReviewed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6 overflow-x-auto whitespace-nowrap py-1">
          <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <span className="mx-2">/</span>
          {product.subcategory ? (
            <>
              <Link to="/category/phan-bon" className="hover:text-primary transition-colors">Phân Bón</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 dark:text-gray-200 font-medium">{product.subcategory}</span>
            </>
          ) : (
            <span className="text-gray-900 dark:text-gray-200 font-medium">{product.category || 'Sản phẩm'}</span>
          )}
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-gray-200 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Main Detail Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8 mb-8 flex flex-col lg:flex-row gap-10">

          {/* Image Gallery */}
          <div className="w-full lg:w-5/12 shrink-0">
            <div className="relative aspect-square rounded-2xl bg-gray-100 dark:bg-gray-700 overflow-hidden border border-gray-200 dark:border-gray-600 mb-4">
              <img
                src={mainImageSrc}
                alt={product.name}
                className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1592424001806-538421319246?auto=format&fit=crop&q=80&w=600';
                }}
              />
              {product.discount > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-md">
                  Giảm {product.discount}%
                </span>
              )}
            </div>

            {galleryImages.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {galleryImages.slice(0, 4).map((imgUrl, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`aspect-square rounded-xl bg-gray-100 dark:bg-gray-700 border-2 cursor-pointer overflow-hidden transition-colors ${
                      mainImageSrc === imgUrl ? 'border-primary' : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={imgUrl || 'https://images.unsplash.com/photo-1592424001806-538421319246?auto=format&fit=crop&q=80&w=600'}
                      alt={`${product.name} ${i + 1}`}
                      className="w-full h-full object-cover opacity-85 hover:opacity-100 mix-blend-multiply dark:mix-blend-normal"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1592424001806-538421319246?auto=format&fit=crop&q=80&w=600';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 flex flex-col">
            <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>{product.category}</span>
              {product.subcategory && (
                <>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <span>{product.subcategory}</span>
                </>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">{product.name}</h1>

            <div className="flex items-center gap-4 mb-5 text-sm flex-wrap">
              <div className="flex items-center gap-0.5 text-yellow-400">
                {renderStars(avgRating || product?.avgRating || product?.rating || 5)}
                <span className="text-gray-700 dark:text-gray-200 ml-2 font-semibold">
                  {avgRating ? avgRating.toFixed(1) : (product?.avgRating || product?.rating || 5)}
                </span>
                <span className="text-gray-400 ml-1">/ 5</span>
              </div>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>
              <span className="text-gray-500 dark:text-gray-400">{totalReviews} đánh giá</span>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>
              <span className="text-gray-600 dark:text-gray-400">Đã bán {product.soldCount ?? 0}</span>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>
              {inStock ? (
                <span className="text-primary font-medium flex items-center gap-1">
                  <CheckCircle size={14} /> Còn hàng ({maxStock})
                </span>
              ) : (
                <span className="text-red-500 font-medium">Hết hàng</span>
              )}
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl mb-6 flex items-end gap-4 border border-gray-100 dark:border-gray-800">
              <span className="text-3xl font-bold text-primary">{(product.price ?? 0).toLocaleString('vi-VN')} đ</span>
              {product.oldPrice && (
                <span className="text-lg text-gray-400 line-through mb-1">{Number(product.oldPrice).toLocaleString('vi-VN')} đ</span>
              )}
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-sm md:text-base">
              {product.description}
            </p>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50/50 dark:bg-gray-900/35 rounded-xl text-sm border border-gray-100/50 dark:border-gray-800">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Package size={16} className="text-primary" />
                <span>Quy cách: <strong>{product.packaging || 'Đóng túi/bao'}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <CheckCircle size={16} className="text-primary" />
                <span>Thương hiệu: <strong>{product.brand || 'Uy tín chất lượng'}</strong></span>
              </div>
            </div>

            <div className="mt-auto">
              {/* Quantity */}
              <div className="flex items-center gap-6 mb-6">
                <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">Số lượng:</span>
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                  <button onClick={() => handleQuantity('dec')} className="p-2.5 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors">
                    <Minus size={16} />
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={quantity}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        setQuantity('');
                      } else if (/^\d+$/.test(val)) {
                        const parsed = parseInt(val, 10);
                        if (parsed > maxStock) {
                          showNotification({ type: 'error', message: `Số lượng yêu cầu vượt quá tồn kho. Hiện chỉ còn ${maxStock} sản phẩm trong kho.` });
                        } else {
                          setQuantity(parsed);
                        }
                      }
                    }}
                    onBlur={() => {
                      if (quantity === '' || parseInt(quantity) < 1) {
                        setQuantity(1);
                      }
                    }}
                    className="w-12 text-center bg-transparent font-medium text-gray-900 dark:text-white outline-none text-sm"
                  />
                  <button onClick={() => handleQuantity('inc')} className="p-2.5 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4 mb-6">
                {parseInt(quantity) >= 50 ? (
                  <div className="w-full flex flex-col gap-3">
                    <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl text-sm leading-relaxed border border-blue-100 dark:border-blue-800">
                      Đơn hàng từ 50 sản phẩm trở lên vui lòng liên hệ với chúng tôi qua Zalo hoặc số điện thoại để được tư vấn, kiểm tra tồn kho và nhận báo giá tốt nhất.
                    </div>
                    <div className="flex gap-3">
                      <a href="https://zalo.me/08357757501" target="_blank" rel="noreferrer" className="flex-1 min-w-[150px] bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center text-sm md:text-base">
                        Liên hệ Zalo
                      </a>
                      <a href="tel:08357757501" className="flex-1 min-w-[150px] bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center text-sm md:text-base">
                        Gọi hỗ trợ
                      </a>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleAddToCart}
                      disabled={!inStock}
                      className={`flex-1 min-w-[150px] border-2 font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all text-sm md:text-base ${
                        inStock
                          ? 'border-primary text-primary hover:bg-primary/5'
                          : 'border-gray-300 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart size={18} /> Thêm vào giỏ
                    </button>
                    <button
                      onClick={handleBuyNow}
                      disabled={!inStock}
                      className={`flex-1 min-w-[150px] text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md text-sm md:text-base ${
                        inStock ? 'bg-primary hover:bg-primary-dark hover:shadow-lg' : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Mua Ngay
                    </button>
                  </>
                )}

                {parseInt(quantity) < 50 && (
                  <button
                    onClick={handleToggleWishlist}
                    className={`w-12 h-12 md:w-14 md:h-14 shrink-0 border border-gray-200 dark:border-gray-600 hover:border-red-500 rounded-xl flex items-center justify-center transition-all bg-white dark:bg-gray-800 ${
                      isFavorited
                        ? 'text-red-500'
                        : 'text-gray-600 dark:text-gray-300 hover:text-red-500'
                    }`}
                    title={isFavorited ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                  >
                    <Heart size={20} className={isFavorited ? 'fill-current' : ''} />
                  </button>
                )}
              </div>

              {/* Zalo Contact */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 text-center">
                <a href="https://zalo.me/08357757501" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-full transition-colors mb-2 w-full sm:w-auto text-sm">
                  <MessageCircle size={18} />
                  Liên hệ Zalo mua sỉ: 08357757501
                </a>
                <p className="text-blue-800 dark:text-blue-300 text-xs font-medium">
                  Cần tư vấn kỹ thuật? Liên hệ ngay: <strong>08357757501</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
          <div className="flex border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 overflow-x-auto whitespace-nowrap hide-scrollbar">
            {[
              { id: 'info', label: 'Mô tả chi tiết', icon: <BookOpen size={16} /> },
              { id: 'ingredients', label: 'Thành phần', icon: <Award size={16} /> },
              { id: 'benefits', label: 'Công dụng', icon: <Sparkles size={16} /> },
              { id: 'usage', label: 'Hướng dẫn sử dụng', icon: <CheckCircle size={16} /> },
              { id: 'packaging', label: 'Quy cách đóng gói', icon: <Package size={16} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`flex-1 py-4 px-5 text-sm font-semibold transition-colors border-b-2 flex items-center justify-center gap-2 min-w-[150px] ${
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-white dark:bg-gray-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          <div className="p-6 md:p-8 prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">
            {activeTab === 'info' && <p>{product.description}</p>}
            {activeTab === 'ingredients' && <p>{product.ingredients || 'Đang cập nhật thành phần chi tiết từ nhà sản xuất.'}</p>}
            {activeTab === 'benefits' && <p>{product.benefits || 'Đang cập nhật công dụng chi tiết cho từng loại cây trồng.'}</p>}
            {activeTab === 'usage' && <p>{product.usage || 'Đang cập nhật hướng dẫn sử dụng và tỷ lệ pha loãng.'}</p>}
            {activeTab === 'packaging' && <p>{product.packaging || 'Quy cách chuẩn từ nhà máy phân phối chính thức.'}</p>}
          </div>
        </div>

        {/* ═══ Customer Reviews Section ═══ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8 mb-12">
          {/* Header + Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Star className="fill-yellow-400 text-yellow-400" size={22} />
                Đánh Giá Của Khách Hàng
              </h2>
              {avgRating > 0 && (
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-white leading-none">
                    {avgRating.toFixed(1)}
                  </span>
                  <div>
                    <div className="flex gap-0.5 text-yellow-400 mb-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={18}
                          className={s <= Math.round(avgRating) ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">{totalReviews} lượt đánh giá</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ─── Submit Review Form ─── */}
          {!hasReviewed ? (
            <div className="mb-8 bg-gray-50 dark:bg-gray-900/40 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                {user ? 'Viết đánh giá của bạn' : 'Đăng nhập để đánh giá sản phẩm'}
              </h3>
              {user ? (
                <form onSubmit={handleSubmitReview}>
                  {/* Star Selector */}
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setSubmitRating(s)}
                        className="transition-transform hover:scale-125"
                      >
                        <Star
                          size={32}
                          className={`transition-colors ${
                            s <= (hoverRating || submitRating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Xuất sắc'][hoverRating || submitRating]}
                    </span>
                  </div>
                  {/* Comment */}
                  <textarea
                    rows={4}
                    value={submitComment}
                    onChange={(e) => setSubmitComment(e.target.value)}
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl py-3 px-4 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary transition-all resize-none mb-3"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isSubmitting
                        ? 'bg-primary/70 cursor-not-allowed text-white'
                        : 'bg-primary hover:bg-primary-dark text-white active:scale-95 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {isSubmitting
                      ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Đang gửi...</>
                      : <><Star size={15} className="fill-white" /> Gửi đánh giá</>
                    }
                  </button>
                </form>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm"
                >
                  Đăng nhập để đánh giá
                </Link>
              )}
            </div>
          ) : (
            <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle size={20} className="text-green-500 shrink-0" />
              <p className="text-sm text-green-800 dark:text-green-300 font-medium">
                Bạn đã đánh giá sản phẩm này. Cảm ơn bạn đã chia sẻ!
              </p>
            </div>
          )}

          {/* ─── Reviews List ─── */}
          {reviewsLoading && reviews.length === 0 ? (
            <div className="flex flex-col items-center py-12 gap-3 text-gray-400">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-sm">Đang tải đánh giá...</p>
            </div>
          ) : reviewsError ? (
            <div className="text-center py-10 text-gray-500">
              <p className="text-sm mb-2">{reviewsError}</p>
              <button onClick={() => fetchReviews(product.id, 0)} className="text-primary text-sm hover:underline">Thử lại</button>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <Star size={40} className="text-gray-200 dark:text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Chưa có đánh giá nào</p>
              <p className="text-sm text-gray-400 mt-1">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
            </div>
          ) : (
            <AnimatePresence>
              <div className="space-y-6">
                {reviews.map((rev, idx) => (
                  <motion.div
                    key={rev.id ?? idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="flex gap-4 border-b border-gray-100 dark:border-gray-700 last:border-0 pb-6 last:pb-0"
                  >
                    {/* Avatar */}
                    <div className="shrink-0">
                      {rev.userAvatarUrl ? (
                        <img
                          src={rev.userAvatarUrl}
                          alt={rev.userFullName}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 dark:border-gray-700"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-base">
                          {(rev.userFullName ?? 'A').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">
                          {rev.userFullName ?? 'Ẩn danh'}
                        </span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={13}
                              className={s <= (rev.rating ?? 5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">
                          {rev.createdAt
                            ? new Date(rev.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
                            : ''}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{rev.comment}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}

          {/* Load More */}
          {!reviewsLoading && reviewPage + 1 < reviewsTotalPages && (
            <div className="text-center mt-8">
              <button
                onClick={() => fetchReviews(product.id, reviewPage + 1)}
                className="text-primary border border-primary/30 hover:bg-primary/5 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
              >
                Xem thêm đánh giá
              </button>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-primary rounded-full"></span>
              Sản Phẩm Liên Quan
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
