import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

const StaffHandbook = () => {
  const { handbookArticles, addHandbookArticle, updateHandbookArticle, deleteHandbookArticle } = useContent();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });

  const filteredData = handbookArticles.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleOpenModal = (article = null) => {
    if (article) {
      setEditingArticle(article);
      setFormData({ title: article.title, content: article.content });
    } else {
      setEditingArticle(null);
      setFormData({ title: '', content: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingArticle(null);
    setFormData({ title: '', content: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingArticle) {
      updateHandbookArticle(editingArticle.id, { ...formData });
    } else {
      addHandbookArticle({
        ...formData,
        date: new Date().toISOString().split('T')[0],
        author: 'Staff',
        category: 'Chung'
      });
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      deleteHandbookArticle(id);
    }
  };

  return (
    <div className="p-6">
      {/* Header & Breadcrumb */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <BookOpen className="text-primary" size={28} />
            Quản lý Cẩm Nang
          </h1>
          <p className="text-gray-500 mt-2">Quản lý nội dung cẩm nang kiến thức dành cho khách hàng.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-5 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Thêm bài viết mới
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 max-w-2xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề hoặc nội dung..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary border border-gray-200 dark:border-gray-700 transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {/* Handbook Content List */}
      <div className="space-y-4 max-w-4xl">
        {filteredData.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-10 text-center rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <p className="text-gray-500">Chưa có bài viết nào.</p>
          </div>
        ) : (
          filteredData.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-all duration-300">
                <div className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <button onClick={() => toggleExpand(item.id)} className="flex-1 text-left flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <BookOpen size={20} />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h2>
                  </button>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
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
                {editingArticle ? 'Sửa bài viết cẩm nang' : 'Thêm bài viết mới'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tiêu đề bài viết</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white font-medium"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nội dung (hỗ trợ HTML)</label>
                <textarea 
                  required
                  rows="10"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-sm outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white resize-none font-medium"
                  placeholder="<p>Nhập nội dung ở đây...</p>"
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
                  {editingArticle ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffHandbook;
