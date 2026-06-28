import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProduct } from '../context/ProductContext';
import { usePromotedProducts } from '../hooks/usePromotedProducts';
import ProductCard from '../components/ProductCard';
import { ChevronRight, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const { user } = useAuth();
  const { categories } = useProduct();
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('Mới nhất');
  
  const products = usePromotedProducts();

  const filteredProducts = useMemo(() => {
    let result = activeCategory === 'Tất cả' 
      ? products 
      : products.filter(p => p.category === activeCategory);
    
    if (sortBy === 'Giá tăng dần') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Giá giảm dần') {
      result = [...result].sort((a, b) => b.price - a.price);
    }
    return result;
  }, [activeCategory, sortBy]);


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
              <button className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:-translate-y-1">
                Mua sắm ngay
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 mt-8 md:mt-12 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 mb-6 sticky top-24">
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Filter size={20} className="text-primary" /> Danh Mục
            </h3>
            <ul className="space-y-2">
              {categories.filter(c => c.isActive).map((cat, index) => (
                <li key={cat.id || index}>
                  <button 
                    onClick={() => setActiveCategory(cat.name)}
                    className={`w-full text-left py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-between group ${
                      activeCategory === cat.name 
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
              {activeCategory} <span className="text-gray-500 text-sm font-normal">({filteredProducts.length} sản phẩm)</span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sắp xếp:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 outline-none"
              >
                <option>Mới nhất</option>
                <option>Giá tăng dần</option>
                <option>Giá giảm dần</option>
              </select>
            </div>
          </div>

          {!user ? (
            <div className="bg-white dark:bg-gray-800 p-12 rounded-xl border border-gray-100 dark:border-gray-700 text-center flex flex-col items-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <Filter className="text-gray-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Vui lòng đăng nhập để xem sản phẩm</h3>
              <p className="text-gray-500 mb-6">Bạn cần đăng nhập để xem thông tin chi tiết các sản phẩm của chúng tôi.</p>
              <div className="flex gap-4">
                <Link to="/login" className="bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-sm">Đăng nhập</Link>
                <Link to="/register" className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-sm">Đăng ký</Link>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  key={product.id}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-12 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <Filter className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-gray-500">Xin lỗi, hiện tại chưa có sản phẩm nào trong danh mục này. Vui lòng thử lại sau.</p>
              <button 
                onClick={() => setActiveCategory('Tất cả')}
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
