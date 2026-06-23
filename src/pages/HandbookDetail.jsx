import { useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, BookOpen, Search, ArrowRight, Award, ShoppingBag, ShoppingCart } from 'lucide-react';
import { handbookArticles } from '../data/handbookData';
import { products } from '../data/mockData';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

const HandbookDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Tìm bài viết hiện tại theo slug
  const article = useMemo(() => {
    return handbookArticles.find(art => art.slug === slug);
  }, [slug]);

  // Cuộn lên đầu trang khi đổi bài viết
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Lọc bài viết liên quan (cùng danh mục, loại bỏ bài viết hiện tại)
  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return handbookArticles
      .filter(art => art.categorySlug === article.categorySlug && art.id !== article.id)
      .slice(0, 4);
  }, [article]);

  // Khuyên dùng sản phẩm dựa trên nội dung bài viết
  const recommendedProducts = useMemo(() => {
    if (!article) return [];
    
    const articleTitleLower = article.title.toLowerCase();
    const articleCategoryLower = article.category.toLowerCase();
    
    let matchedProducts = [];

    // Luật gợi ý 1: Nếu bài viết về thuốc BVTV hoặc phòng trừ sâu bệnh -> gợi ý thuốc BVTV
    if (articleCategoryLower.includes('thuốc') || articleCategoryLower.includes('sâu bệnh') || articleTitleLower.includes('sâu') || articleTitleLower.includes('rầy') || articleTitleLower.includes('bệnh') || articleTitleLower.includes('trĩ')) {
      matchedProducts = products.filter(p => p.category.toLowerCase().includes('thuốc'));
    }
    
    // Luật gợi ý 2: Nếu bài viết liên quan tới cây trồng hạt giống -> gợi ý hạt giống hoặc phân hữu cơ vi sinh
    if (articleTitleLower.includes('gieo') || articleTitleLower.includes('hạt giống') || articleTitleLower.includes('trồng') || articleTitleLower.includes('rau')) {
      matchedProducts = products.filter(p => p.category.toLowerCase().includes('hạt giống') || p.category.toLowerCase().includes('hữu cơ'));
    }

    // Luật gợi ý 3: Nếu không nằm trong 2 luật trên hoặc số lượng ít -> Lấy phân bón phù hợp
    if (matchedProducts.length === 0) {
      if (articleTitleLower.includes('NPK') || articleTitleLower.includes('vô cơ')) {
        matchedProducts = products.filter(p => p.category.toLowerCase().includes('vô cơ'));
      } else if (articleTitleLower.includes('hữu cơ') || articleTitleLower.includes('ủ phân') || articleTitleLower.includes('cải tạo')) {
        matchedProducts = products.filter(p => p.category.toLowerCase().includes('hữu cơ') || p.category.toLowerCase().includes('đặc biệt'));
      } else {
        // Gợi ý sản phẩm nổi bật mặc định
        matchedProducts = products.filter(p => p.isNew || p.rating >= 4.8);
      }
    }

    // Trả về tối đa 3 sản phẩm
    return matchedProducts.slice(0, 3);
  }, [article]);

  if (!article) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Không tìm thấy bài viết</h2>
        <p className="text-gray-500 mb-8">Bài viết nông nghiệp bạn yêu cầu hiện không tồn tại hoặc đã bị gỡ bỏ.</p>
        <Link to="/handbook" className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full shadow-md inline-flex items-center gap-2 transition-transform hover:-translate-y-1">
          <ArrowLeft size={18} />
          Quay lại Cẩm nang
        </Link>
      </div>
    );
  }

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-16">
      {/* Banner nhỏ phía trên đầu trang */}
      <div className="bg-primary-dark text-white py-4 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/handbook')}
            className="flex items-center gap-2 text-sm text-green-100 hover:text-white transition-colors font-medium cursor-pointer"
          >
            <ArrowLeft size={16} /> Quay lại danh sách cẩm nang
          </button>
          <div className="text-xs text-green-200 hidden md:block">
            Trang chủ &gt; Cẩm nang &gt; {article.category}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cột trái: Nội dung chi tiết bài viết (8/12 cột) */}
          <main className="lg:col-span-8">
            <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
              {/* Thẻ danh mục & Ngày đăng */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <span className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                  {article.category}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-400">
                  <Calendar size={15} />
                  Ngày đăng: {new Date(article.publishDate).toLocaleDateString('vi-VN')}
                </span>
              </div>

              {/* Tiêu đề chính */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                {article.title}
              </h1>

              {/* Ảnh bìa chính lớn */}
              <div className="relative rounded-2xl overflow-hidden mb-8 shadow-sm">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-auto object-cover max-h-[450px]"
                />
              </div>

              {/* Tóm tắt mở đầu */}
              <div className="bg-gray-50 dark:bg-gray-700/30 border-l-4 border-primary p-5 rounded-r-xl mb-8">
                <p className="text-gray-700 dark:text-gray-300 italic text-base leading-relaxed">
                  "{article.summary}"
                </p>
              </div>

              {/* Thân bài viết */}
              <div className="space-y-8 text-gray-800 dark:text-gray-200 leading-relaxed text-base">
                {article.content.sections ? (
                  article.content.sections.map((sec, index) => (
                    <div key={index} className="space-y-3">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                        {sec.title}
                      </h2>
                      <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                        {sec.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>Nội dung đang được cập nhật...</p>
                )}
              </div>

              {/* Nguồn trích dẫn uy tín */}
              {article.sources && article.sources.length > 0 && (
                <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-700 flex items-start gap-3 bg-green-50/50 dark:bg-gray-700/20 p-4 rounded-xl">
                  <Award className="text-primary shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white uppercase mb-1">
                      Nguồn tham khảo uy tín:
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {article.sources.join(' • ')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Cột phải: Sidebar bài viết liên quan & giới thiệu sản phẩm (4/12 cột) */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* 1. Sản phẩm khuyến dùng phù hợp chủ đề */}
            {recommendedProducts.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
                  <ShoppingBag size={18} className="text-primary" /> Sản phẩm khuyên dùng
                </h3>
                <div className="space-y-4">
                  {recommendedProducts.map(prod => (
                    <div 
                      key={prod.id}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                    >
                      <img 
                        src={prod.image} 
                        alt={prod.name} 
                        className="w-16 h-16 object-cover rounded-lg bg-gray-100 dark:bg-gray-700"
                      />
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${prod.id}`} className="text-sm font-bold text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary-light transition-colors line-clamp-1 block">
                          {prod.name}
                        </Link>
                        <p className="text-xs text-gray-400 mb-1">{prod.category}</p>
                        <p className="text-primary font-extrabold text-sm">
                          {prod.price.toLocaleString('vi-VN')} ₫
                        </p>
                      </div>
                      <button 
                        onClick={() => handleAddToCart(prod)}
                        className="p-2.5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer shrink-0"
                        title="Thêm vào giỏ"
                      >
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Danh sách bài viết liên quan */}
            {relatedArticles.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
                  <BookOpen size={18} className="text-primary" /> Bài viết liên quan
                </h3>
                <div className="space-y-4">
                  {relatedArticles.map(art => (
                    <Link 
                      key={art.id} 
                      to={`/handbook/${art.slug}`}
                      className="flex gap-3 group items-start hover:translate-x-1 transition-transform"
                    >
                      <img 
                        src={art.image} 
                        alt={art.title} 
                        className="w-16 h-16 object-cover rounded-lg bg-gray-100 dark:bg-gray-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {art.title}
                        </h4>
                        <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <Calendar size={11} />
                          {new Date(art.publishDate).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Link nhanh quay lại cẩm nang */}
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 w-28 h-28 rounded-full bg-white/10" />
              <h3 className="font-bold text-lg mb-2 relative z-10">Cần tư vấn nông nghiệp?</h3>
              <p className="text-sm text-green-50 mb-6 relative z-10 leading-relaxed">
                Đọc thêm nhiều kiến thức bổ ích khác để hỗ trợ cho mùa màng bội thu của gia đình bạn.
              </p>
              <Link 
                to="/handbook"
                className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-2.5 px-6 rounded-full text-sm inline-flex items-center gap-2 transition-transform hover:-translate-y-0.5 relative z-10"
              >
                Vào trang cẩm nang <ArrowRight size={14} />
              </Link>
            </div>
            
          </aside>

        </div>
      </div>
    </div>
  );
};

export default HandbookDetail;
