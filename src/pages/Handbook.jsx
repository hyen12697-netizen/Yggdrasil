import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, ArrowRight, Filter, BookOpen, Clock, AlertCircle } from 'lucide-react';
import { handbookArticles, handbookCategories } from '../data/handbookData';

// Helper loại bỏ dấu tiếng Việt để tìm kiếm chính xác
const removeAccents = (str) => {
  return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
};

const ARTICLES_PER_PAGE = 9;

const Handbook = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(ARTICLES_PER_PAGE);

  // Lọc bài viết theo danh mục và tìm kiếm
  const filteredArticles = useMemo(() => {
    let result = handbookArticles;

    // Lọc theo danh mục
    if (activeCategory !== 'all') {
      result = result.filter(art => art.categorySlug === activeCategory);
    }

    // Lọc theo tìm kiếm từ khóa (không phân biệt dấu tiếng Việt)
    if (searchQuery.trim() !== '') {
      const normalizedQuery = removeAccents(searchQuery.toLowerCase());
      result = result.filter(art => {
        const titleMatch = removeAccents(art.title.toLowerCase()).includes(normalizedQuery);
        const summaryMatch = removeAccents(art.summary.toLowerCase()).includes(normalizedQuery);
        return titleMatch || summaryMatch;
      });
    }

    return result;
  }, [activeCategory, searchQuery]);

  // Reset số lượng bài hiển thị khi đổi bộ lọc hoặc tìm kiếm
  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setVisibleCount(ARTICLES_PER_PAGE);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setVisibleCount(ARTICLES_PER_PAGE);
  };

  // Lấy các bài viết hiển thị theo giới hạn phân trang
  const visibleArticles = useMemo(() => {
    return filteredArticles.slice(0, visibleCount);
  }, [filteredArticles, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + ARTICLES_PER_PAGE);
  };

  // Đếm số lượng bài viết của từng danh mục để hiển thị badge
  const categoryCounts = useMemo(() => {
    const counts = { all: handbookArticles.length };
    handbookCategories.forEach(cat => {
      counts[cat.id] = handbookArticles.filter(art => art.categorySlug === cat.id).length;
    });
    return counts;
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-16">
      {/* Banner cẩm nang nông nghiệp */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=2000" 
            alt="Cẩm nang nông nghiệp" 
            className="w-full h-full object-cover mix-blend-overlay opacity-30"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/80 via-primary/50 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 py-16 md:py-24 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-white/10 backdrop-blur-md text-yellow-300 font-semibold px-4 py-1.5 rounded-full text-sm uppercase tracking-wider mb-4 inline-block">
              Thư viện kiến thức nông nghiệp
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
          >
            Cẩm Nang <span className="text-yellow-300">Nông Nghiệp</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-green-50 max-w-3xl mb-8"
          >
            Chia sẻ các bài viết kỹ thuật canh tác, sử dụng phân bón, thuốc bảo vệ thực vật và phòng chống dịch bệnh chính xác từ các cơ quan nông nghiệp uy tín hàng đầu.
          </motion.p>
          
          {/* Thanh tìm kiếm lớn */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-2xl relative"
          >
            <div className="relative">
              <input 
                type="text" 
                placeholder="Tìm kiếm bài viết, chủ đề kỹ thuật..." 
                className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full py-4 pl-14 pr-6 text-base outline-none focus:ring-4 focus:ring-primary/20 border-0 shadow-lg"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar bộ lọc danh mục */}
          <aside className="w-full lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-5 text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
                <Filter size={20} className="text-primary" /> Danh Mục Cẩm Nang
              </h3>
              
              <ul className="space-y-1">
                <li>
                  <button 
                    onClick={() => handleCategoryChange('all')}
                    className={`w-full text-left py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-between font-medium group ${
                      activeCategory === 'all' 
                        ? 'bg-primary text-white shadow-md shadow-primary/20' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <BookOpen size={16} />
                      Tất cả kiến thức
                    </span>
                    <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full ${
                      activeCategory === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      {categoryCounts.all}
                    </span>
                  </button>
                </li>
                {handbookCategories.map((cat) => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`w-full text-left py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-between font-medium group ${
                        activeCategory === cat.id 
                          ? 'bg-primary text-white shadow-md shadow-primary/20' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <BookOpen size={16} />
                        {cat.name}
                      </span>
                      <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full ${
                        activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}>
                        {categoryCounts[cat.id]}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Grid bài viết */}
          <main className="w-full lg:col-span-3 flex flex-col">
            {/* Header thông tin hiển thị */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {activeCategory === 'all' ? 'Tất cả bài viết' : handbookCategories.find(c => c.id === activeCategory)?.name}
                <span className="text-gray-400 text-sm font-normal">({filteredArticles.length} bài viết)</span>
              </h2>
              {searchQuery && (
                <div className="text-sm text-gray-500">
                  Từ khóa: <span className="text-primary font-medium">"{searchQuery}"</span>
                </div>
              )}
            </div>

            {/* Danh sách bài viết dạng Grid */}
            {visibleArticles.length > 0 ? (
              <motion.div 
                layout 
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {visibleArticles.map((art, idx) => (
                    <motion.article
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      key={art.id}
                      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 flex flex-col group h-full cursor-pointer"
                      onClick={() => navigate(`/handbook/${art.slug}`)}
                    >
                      {/* Ảnh minh họa */}
                      <div className="relative pt-[56.25%] overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
                        <img 
                          src={art.image} 
                          alt={art.title} 
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 bg-primary text-white text-[12px] font-bold px-3 py-1 rounded-full uppercase shadow-md">
                          {art.category}
                        </div>
                      </div>

                      {/* Thông tin bài viết */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 mb-3">
                            <span className="flex items-center gap-1.5">
                              <Calendar size={13} />
                              {new Date(art.publishDate).toLocaleDateString('vi-VN')}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock size={13} />
                              5 phút đọc
                            </span>
                          </div>
                          
                          <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors mb-2.5 leading-snug">
                            {art.title}
                          </h3>
                          
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed mb-4">
                            {art.summary}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between text-primary font-bold text-sm">
                          <span>Đọc bài viết</span>
                          <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                            <ArrowRight size={16} />
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* Không tìm thấy bài viết */
              <div className="bg-white dark:bg-gray-800 p-16 rounded-2xl border border-gray-100 dark:border-gray-700 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center mb-4 text-red-500">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Không tìm thấy bài viết</h3>
                <p className="text-gray-500 max-w-md">
                  Rất tiếc, chúng tôi không tìm thấy bài viết nào phù hợp với từ khóa tìm kiếm của bạn. Hãy thử đổi từ khóa khác.
                </p>
                <button 
                  onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                  className="mt-6 bg-primary hover:bg-primary-dark text-white font-medium px-6 py-2.5 rounded-full transition-colors shadow-md"
                >
                  Xóa bộ lọc tìm kiếm
                </button>
              </div>
            )}

            {/* Nút Xem Thêm (Load More) */}
            {filteredArticles.length > visibleCount && (
              <div className="mt-12 text-center">
                <button 
                  onClick={handleLoadMore}
                  className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold px-8 py-3.5 rounded-full border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary transition-all shadow-sm hover:shadow-md cursor-pointer"
                >
                  Xem thêm bài viết
                </button>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
};

export default Handbook;
