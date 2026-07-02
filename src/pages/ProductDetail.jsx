import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ShoppingCart, Heart, Plus, Minus, MessageCircle, Star, CheckCircle, Package, Award, Sparkles, BookOpen } from 'lucide-react';
import { usePromotedProducts } from '../hooks/usePromotedProducts';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useNotification } from '../context/NotificationContext';
import { motion } from 'framer-motion';

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('info'); // info, ingredients, benefits, usage, packaging
  
  const products = usePromotedProducts();
  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showNotification } = useNotification();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Find product
  const product = useMemo(() => {
    const productId = parseInt(id);
    return products.find(p => p.id === productId) || products[0];
  }, [id, products]);

  // Find related products in the same subcategory, fallback to same category
  const relatedProducts = useMemo(() => {
    let list = [];
    if (product.subcategory) {
      list = products.filter(p => p.subcategory === product.subcategory && p.id !== product.id);
    }
    if (list.length === 0) {
      list = products.filter(p => p.category === product.category && p.id !== product.id);
    }
    return list.slice(0, 4);
  }, [product, products]);

  const handleQuantity = (type) => {
    const maxStock = product.stock || 0;
    if (type === 'inc') {
      setQuantity(q => {
        const current = parseInt(q) || 0;
        if (current + 1 > maxStock) {
          showNotification({ type: 'error', message: `Số lượng yêu cầu vượt quá tồn kho. Hiện chỉ còn ${maxStock} sản phẩm trong kho.` });
          return current;
        }
        return current + 1;
      });
    }
    if (type === 'dec' && (parseInt(quantity) || 0) > 1) setQuantity(q => (parseInt(q) || 0) - 1);
  };

  const handleAddToCart = () => {
    if (!user) {
      showNotification({
        type: 'confirm',
        title: 'Yêu cầu đăng nhập',
        message: 'Vui lòng đăng nhập để tiếp tục mua hàng.',
        onConfirm: () => navigate('/login')
      });
      return;
    }

    const currentQty = parseInt(quantity) || 1;
    const maxStock = product.stock || 0;
    
    // Kiểm tra xem số lượng trong giỏ hàng + số lượng thêm có vượt quá không
    const cartItem = cartItems?.find(item => item.id === product.id);
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
        onConfirm: () => navigate('/login')
      });
      return;
    }

    const currentQty = parseInt(quantity) || 1;
    const maxStock = product.stock || 0;
    
    const cartItem = cartItems?.find(item => item.id === product.id);
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
        onConfirm: () => navigate('/login')
      });
      return;
    }
    toggleWishlist(product);
  };

  const isFavorited = isInWishlist(product.id);

  // Generate star rating elements
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

  // Mocked customer reviews based on rating
  const mockReviews = useMemo(() => {
    return [
      {
        id: 1,
        author: 'Nguyễn Văn Hùng (Nhà vườn)',
        rating: 5,
        date: '10/05/2026',
        comment: `Sản phẩm dùng cực kỳ chất lượng. Tôi bón cho vườn nhà thấy cây đâm chồi xanh mướt hẳn. Sẽ ủng hộ lâu dài.`
      },
      {
        id: 2,
        author: 'Trần Thị Mai',
        rating: 4.8,
        date: '02/06/2026',
        comment: `Giao hàng nhanh, đóng gói cẩn thận. Phân bón tan tốt, cây ra chồi mới khỏe khoắn.`
      },
      {
        id: 3,
        author: 'Lê Hoàng Nam',
        rating: 4.5,
        date: '18/06/2026',
        comment: `Hài lòng với chất lượng. Giá cả hợp lý so với thị trường.`
      }
    ];
  }, [product]);



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
            <span className="text-gray-900 dark:text-gray-200 font-medium">{product.category}</span>
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
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://images.unsplash.com/photo-1592424001806-538421319246?auto=format&fit=crop&q=80&w=600';
                }}
              />
              {product.discount && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-md">
                  Giảm {product.discount}%
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-xl bg-gray-100 dark:bg-gray-700 border-2 border-transparent hover:border-primary cursor-pointer overflow-hidden transition-colors">
                  <img 
                    src={product.image} 
                    alt="Thumbnail" 
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 mix-blend-multiply dark:mix-blend-normal" 
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = 'https://images.unsplash.com/photo-1592424001806-538421319246?auto=format&fit=crop&q=80&w=600';
                    }}
                  />
                </div>
              ))}
            </div>
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
                {renderStars(product.rating)}
                <span className="text-gray-500 dark:text-gray-400 ml-2">({product.rating || 5.0})</span>
              </div>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>
              <span className="text-gray-600 dark:text-gray-400">Đã bán {product.soldCount || 100}</span>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>
              <span className="text-primary font-medium flex items-center gap-1"><CheckCircle size={14} /> Còn hàng</span>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl mb-6 flex items-end gap-4 border border-gray-100 dark:border-gray-800">
              <span className="text-3xl font-bold text-primary">{product.price.toLocaleString('vi-VN')} đ</span>
              {product.oldPrice && (
                <span className="text-lg text-gray-400 line-through mb-1">{product.oldPrice.toLocaleString('vi-VN')} đ</span>
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
                <span>Thương hiệu: <strong>Uy tín chất lượng</strong></span>
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
                          const maxStock = product.stock || 0;
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
                    <button onClick={handleAddToCart} className="flex-1 min-w-[150px] border-2 border-primary text-primary hover:bg-primary/5 font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all text-sm md:text-base">
                      <ShoppingCart size={18} /> Thêm vào giỏ
                    </button>
                    <button onClick={handleBuyNow} className="flex-1 min-w-[150px] bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg text-sm md:text-base">
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
                    title={isFavorited ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
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

        {/* Customer Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8 mb-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            Đánh Giá Của Khách Hàng
          </h2>
          <div className="space-y-6">
            {mockReviews.map((rev) => (
              <div key={rev.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{rev.author}</h4>
                    <span className="text-xs text-gray-400">{rev.date}</span>
                  </div>
                  <div className="flex text-yellow-400">
                    {renderStars(rev.rating)}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-primary rounded-full"></span>
              Sản Phẩm Liên Quan
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(p => (
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
