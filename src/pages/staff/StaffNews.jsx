import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Newspaper, ChevronDown, ChevronUp } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useSystemNotification } from '../../context/SystemNotificationContext';

const StaffNews = () => {
  const { newsArticles, addNewsArticle, updateNewsArticle, deleteNewsArticle } = useContent();
  const { addNotification, updateNotification, deleteNotification, notifications } = useSystemNotification();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({ title: '', summary: '', content: '' });

  const filteredData = newsArticles.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleOpenModal = (article = null) => {
    if (article) {
      setEditingArticle(article);
      setFormData({ title: article.title, summary: article.summary || '', content: article.content });
    } else {
      setEditingArticle(null);
      setFormData({ title: '', summary: '', content: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingArticle(null);
    setFormData({ title: '', summary: '', content: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingArticle) {
      updateNewsArticle(editingArticle.id, { ...formData });
      
      // Update notification if it exists
      const relatedNotif = notifications.find(n => n.type === 'news' && n.url === `/news/${editingArticle.id}`);
      if (relatedNotif) {
        updateNotification(relatedNotif.id, {
          title: formData.title,
          content: formData.summary,
        });
      }
    } else {
      const newId = Date.now().toString();
      addNewsArticle({
        ...formData,
        id: newId,
        date: new Date().toISOString().split('T')[0],
        author: 'Staff'
      });
      
      // Add notification for the new news
      addNotification({
        title: formData.title,
        content: formData.summary,
        type: 'news',
        url: `/news/${newId}`,
      });
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bản tin này?')) {
      deleteNewsArticle(id);
      
      // Delete related notification
      const relatedNotif = notifications.find(n => n.type === 'news' && n.url === `/news/${id}`);
      if (relatedNotif) {
        deleteNotification(relatedNotif.id);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Newspaper className="text-primary" size={28} />
            Quản lý Tin Tức
          </h1>
          <p className="text-gray-500 mt-2">Soạn thảo và quản lý các bản tin, thông báo mới nhất cho khách hàng.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-5 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Đăng tin mới
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 max-w-2xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm tin tức..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary border border-gray-200 dark:border-gray-700 transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <div className="space-y-4 max-w-4xl">
        {filteredData.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-10 text-center rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <p className="text-gray-500">Chưa có tin tức nào.</p>
          </div>
        ) : (
          filteredData.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-all duration-300">
                <div className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <button onClick={() => toggleExpand(item.id)} className="flex-1 text-left flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Newspaper size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h2>
                      <p className="text-sm text-gray-500 line-clamp-1">{item.summary}</p>
                    </div>
                  </button>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <div className="text-sm text-gray-400 mr-2">{item.date}</div>
                    <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                    <button onClick={() => toggleExpand(item.id)} className="text-gray-400 ml-2">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div 
                      className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-gray-600 dark:text-gray-300"
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/80">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingArticle ? 'Sửa tin tức' : 'Đăng tin mới'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tiêu đề bản tin</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Mô tả ngắn (Summary)</label>
                <input 
                  type="text" 
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({...formData, summary: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white font-medium"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nội dung (hỗ trợ HTML)</label>
                <textarea 
                  required
                  rows="8"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-sm outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white resize-none font-medium"
                  placeholder="<p>Nhập nội dung chi tiết ở đây...</p>"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark shadow-md transition-colors"
                >
                  {editingArticle ? 'Cập nhật' : 'Đăng tin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffNews;
