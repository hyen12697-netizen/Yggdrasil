import React, { useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Newspaper, ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { newsArticles } = useContent();

  const article = useMemo(() => {
    return newsArticles.find(art => art.id.toString() === id);
  }, [id, newsArticles]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Không tìm thấy bản tin</h1>
          <p className="text-gray-500 mb-8">Bản tin này có thể đã bị xóa hoặc đường dẫn không hợp lệ.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  // Lấy các bài viết khác
  const relatedArticles = newsArticles
    .filter(a => a.id.toString() !== id)
    .slice(0, 3);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Về trang chủ</span>
        </Link>

        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full font-medium">
                <Newspaper size={16} />
                Tin Tức
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={16} />
                {new Date(article.date).toLocaleDateString('vi-VN')}
              </span>

            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              {article.title}
            </h1>

            {article.summary && (
              <p className="text-xl text-gray-600 dark:text-gray-300 font-medium leading-relaxed mb-8 border-l-4 border-primary pl-4">
                {article.summary}
              </p>
            )}

            <div 
              className="prose prose-lg dark:prose-invert max-w-none 
                prose-headings:text-primary prose-headings:font-bold prose-headings:mb-4
                prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-primary hover:prose-a:text-primary-dark
                prose-strong:text-gray-900 dark:prose-strong:text-white
                prose-ul:text-gray-600 dark:prose-ul:text-gray-300
                prose-li:marker:text-primary"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </motion.article>

        {relatedArticles.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tin tức khác</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <Link 
                  key={rel.id} 
                  to={`/news/${rel.id}`}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group flex flex-col h-full"
                >
                  <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                    <Calendar size={14} />
                    {new Date(rel.date).toLocaleDateString('vi-VN')}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {rel.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">
                    {rel.summary}
                  </p>
                  <span className="text-primary font-medium text-sm flex items-center gap-1 mt-auto">
                    Đọc tiếp <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsDetail;
