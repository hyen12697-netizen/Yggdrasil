import { useState, useMemo, useEffect } from 'react';
import { useProduct, normalizeProduct } from '../context/ProductContext';
import { usePromotion } from '../context/PromotionContext';
import { getProducts as apiGetProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import { ChevronRight, Filter, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const PAGE_SIZE = 20;

const Home = () => {
  const { products: contextProducts, categories, isLoading: contextLoading } = useProduct();
  const { getActivePromotions } = usePromotion();

  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('Mới nhất');
  const [currentPage, setCurrentPage] = useState(0);
  const [serverProducts, setServerProducts] = useState(null);
  const [serverPagination, setServerPagination] = useState({ pageNo: 0, totalPages: 1, totalElements: 0 });
  const [isFetching, setIsFetching] = useState(false);

  // Tìm categoryId tương ứng nếu người dùng chọn danh mục cụ thể
  const selectedCategoryObj = useMemo(() => {
    if (activeCategory === 'Tất cả') return null;
    return categories.find((c) => String(c.name).toLowerCase() === String(activeCategory).toLowerCase()) || null;
  }, [activeCategory, categories]);

  // Gọi GET /products có phân trang, lọc danh mục và sắp xếp
  useEffect(() => {
    let active = true;

    const params = {
      page: currentPage,
      size: PAGE_SIZE,
    };

    if (selectedCategoryObj?.id) {
      params.categoryId = selectedCategoryObj.id;
    }

    if (sortBy === 'Giá tăng dần') {
      params.sortBy = 'price';
      params.sortDir = 'asc';
    } else if (sortBy === 'Giá giảm dần') {
      params.sortBy = 'price';
      params.sortDir = 'desc';
    } else {
      params.sortBy = 'id';
      params.sortDir = 'desc';
    }

    Promise.resolve().then(() => {
      if (active) setIsFetching(true);
      return apiGetProducts(params);
    })
      .then((response) => {
        if (!active) return;
        const list = response?.content ?? (Array.isArray(response) ? response : []);
        setServerProducts(list.map(normalizeProduct).filter(Boolean));
        if (response?.totalPages !== undefined) {
          setServerPagination({
            pageNo: response.pageNo ?? currentPage,
            totalPages: Math.max(1, response.totalPages ?? 1),
            totalElements: response.totalElements ?? list.length,
          });
        } else {
          setServerPagination({ pageNo: 0, totalPages: 1, totalElements: list.length });
        }
      })
      .catch(() => {
        if (!active) return;
        // Fallback sang danh sách từ ProductContext nếu call riêng thất bại
        setServerProducts(null);
      })
      .finally(() => {
        if (active) setIsFetching(false);
      });

    return () => {
      active = false;
    };
  }, [currentPage, selectedCategoryObj?.id, sortBy]);

  // Áp dụng khuyến mãi đang hoạt động & fallback lọc client nếu serverProducts null
  const filteredProducts = useMemo(() => {
    let list = serverProducts ?? contextProducts ?? [];

    if (!serverProducts) {
      if (activeCategory !== 'Tất cả') {
        list = list.filter((p) => {
          const catName = p.category?.name || p.categoryName || p.category;
          return String(catName).toLowerCase() === String(activeCategory).toLowerCase();
        });
      }
      if (sortBy === 'Giá tăng dần') {
        list = [...list].sort((a, b) => (a.price || 0) - (b.price || 0));
      } else if (sortBy === 'Giá giảm dần') {
        list = [...list].sort((a, b) => (b.price || 0) - (a.price || 0));
      }
    }

    const activePromotions = getActivePromotions?.() || [];
    if (!activePromotions.length) return list;

    return list.map((product) => {
      let bestDiscountedPrice = product.price;
      let appliedPromotion = null;
      let maxDiscountAmount = 0;

      activePromotions.forEach((promo) => {
        let isApplicable = false;
        if (promo.targetType === 'all') {
          isApplicable = true;
        } else if (promo.targetType === 'category' && promo.targetCategories?.includes(product.category)) {
          isApplicable = true;
        } else if (promo.targetType === 'product' && promo.targetProducts?.includes(product.id)) {
          isApplicable = true;
        }

        if (isApplicable) {
          let currentDiscountAmount = 0;
          let calculatedPrice = product.price;
          if (promo.type === 'percentage') {
            currentDiscountAmount = (product.price * promo.value) / 100;
            calculatedPrice = product.price - currentDiscountAmount;
          } else if (promo.type === 'fixed') {
            currentDiscountAmount = promo.value;
            calculatedPrice = Math.max(0, product.price - currentDiscountAmount);
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
          ...product,
          price: bestDiscountedPrice,
          oldPrice: product.oldPrice ?? product.price,
          promotionLabel:
            appliedPromotion.type === 'percentage'
              ? `-${appliedPromotion.value}%`
              : `-${appliedPromotion.value.toLocaleString('vi-VN')}đ`,
        };
      }
      return product;
    });
  }, [serverProducts, contextProducts, activeCategory, sortBy, getActivePromotions]);

  const handleSelectCategory = (catName) => {
    setActiveCategory(catName);
    setCurrentPage(0);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(0);
  };

  const scrollToProducts = () => {
    document.getElementById('home-products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const showLoading = isFetching || (contextLoading && filteredProducts.length === 0);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-12">
      {/* Hero Banner Section */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1592424001806-538421319246?auto=format&fit=crop&q=80&w=2000"
            alt="Nông nghiệp xanh"
            className="w-full h-full object-cover mix-blend-overlay opacity-40"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 py-16 md:py-24 lg:py-32 flex items-center">
          <div className="max-w-2xl text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Nơi Sự Sống<br />
              <span className="text-yellow-300">Vươn Mình Mạnh Mẽ</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl mb-8 text-green-50"
            >
              Giải pháp nông nghiệp toàn diện. Cung cấp phân bón, thuốc bảo vệ thực vật và hạt giống chất lượng cao vì một nền nông nghiệp bền vững.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <button
                onClick={scrollToProducts}
                className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:-translate-y-1 cursor-pointer"
              >
                Mua sắm ngay
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div id="home-products" className="max-w-7xl mx-auto px-4 mt-8 md:mt-12 flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 mb-6 sticky top-24">
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Filter size={20} className="text-primary" /> Danh Mục
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleSelectCategory('Tất cả')}
                  className={`w-full text-left py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-between group ${activeCategory === 'Tất cả'
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                  Tất cả
                  <ChevronRight size={14} className={`transition-transform ${activeCategory === 'Tất cả' ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} />
                </button>
              </li>

              {categories.filter((c) => c.isActive !== false).map((cat, index) => (
                <li key={cat.id || index}>
                  <button
                    onClick={() => handleSelectCategory(cat.name)}
                    className={`w-full text-left py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-between group ${activeCategory === cat.name
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                  >
                    {cat.name}
                    <ChevronRight size={14} className={`transition-transform ${activeCategory === cat.name ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {activeCategory}{' '}
              <span className="text-gray-500 text-sm font-normal">
                ({serverProducts ? serverPagination.totalElements : filteredProducts.length} sản phẩm)
              </span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 outline-none"
              >
                <option>Mới nhất</option>
                <option>Giá tăng dần</option>
                <option>Giá giảm dần</option>
              </select>
            </div>
          </div>

          {showLoading ? (
            <div className="text-center py-12 text-gray-500">Đang tải danh sách sản phẩm...</div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    key={product.id || index}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>

              {serverProducts && serverPagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
                  >
                    <ChevronLeft size={16} /> Trước
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-medium px-2">
                    Trang {currentPage + 1} / {serverPagination.totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(serverPagination.totalPages - 1, p + 1))}
                    disabled={currentPage + 1 >= serverPagination.totalPages}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
                  >
                    Sau <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-12 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <Filter className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-gray-500">Xin lỗi, hiện tại chưa có sản phẩm nào trong danh mục này. Vui lòng thử lại sau.</p>
              <button
                onClick={() => handleSelectCategory('Tất cả')}
                className="mt-6 text-primary font-medium hover:underline"
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Home;
