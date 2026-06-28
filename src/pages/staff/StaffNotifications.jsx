import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Bell, CheckCircle, XCircle } from 'lucide-react';
import { useSystemNotification } from '../../context/SystemNotificationContext';

const StaffNotifications = () => {
  const { notifications, addNotification, updateNotification, deleteNotification, toggleNotificationActive } = useSystemNotification();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', type: 'general', url: '/' });

  const filteredData = notifications.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (notification = null) => {
    if (notification) {
      setEditingNotification(notification);
      setFormData({ 
        title: notification.title, 
        content: notification.content, 
        type: notification.type || 'general',
        url: notification.url || '/'
      });
    } else {
      setEditingNotification(null);
      setFormData({ title: '', content: '', type: 'general', url: '/' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNotification(null);
    setFormData({ title: '', content: '', type: 'general', url: '/' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingNotification) {
      updateNotification(editingNotification.id, { ...formData });
    } else {
      addNotification({
        ...formData,
        author: 'Staff'
      });
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
      deleteNotification(id);
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case 'news': return 'Tin tức';
      case 'promotion': return 'Khuyến mãi';
      case 'system': return 'Hệ thống';
      case 'handbook': return 'Cẩm nang';
      default: return 'Thông báo chung';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Bell className="text-primary" size={28} />
            Quản lý Thông Báo
          </h1>
          <p className="text-gray-500 mt-2">Tạo và quản lý các thông báo đẩy (push notifications) hiển thị cho người dùng.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-5 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Tạo thông báo mới
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 max-w-2xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm thông báo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary border border-gray-200 dark:border-gray-700 transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-655 dark:text-gray-450">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-bold">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">Tiêu đề</th>
                <th className="px-5 py-4 min-w-[200px]">Nội dung</th>
                <th className="px-5 py-4 whitespace-nowrap">Loại</th>
                <th className="px-5 py-4 whitespace-nowrap">Ngày tạo</th>
                <th className="px-5 py-4 text-center whitespace-nowrap">Trạng thái</th>
                <th className="px-5 py-4 text-right whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-gray-500">
                    Chưa có thông báo nào
                  </td>
                </tr>
              ) : (
                filteredData.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-750/30">
                    <td className="px-5 py-4.5 font-bold text-gray-900 dark:text-white line-clamp-1">{item.title}</td>
                    <td className="px-5 py-4.5 text-gray-600 dark:text-gray-400 line-clamp-1">{item.content}</td>
                    <td className="px-5 py-4.5 whitespace-nowrap">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-semibold">
                        {getTypeName(item.type)}
                      </span>
                    </td>
                    <td className="px-5 py-4.5 text-gray-500 whitespace-nowrap">{new Date(item.date).toLocaleDateString('vi-VN')}</td>
                    <td className="px-5 py-4.5 text-center whitespace-nowrap">
                      <button 
                        onClick={() => toggleNotificationActive(item.id)}
                        className={`flex items-center justify-center gap-1 mx-auto px-3 py-1 rounded-full text-xs font-bold transition-colors ${item.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}
                      >
                        {item.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {item.isActive ? 'Đang bật' : 'Đã tắt'}
                      </button>
                    </td>
                    <td className="px-5 py-4.5 text-right whitespace-nowrap space-x-2">
                      <button 
                        onClick={() => handleOpenModal(item)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Sửa thông báo"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa thông báo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/80">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingNotification ? 'Sửa thông báo' : 'Tạo thông báo mới'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tiêu đề</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nội dung ngắn gọn</label>
                <textarea 
                  required
                  rows="3"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-sm outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white resize-none font-medium"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phân loại</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white font-medium"
                  >
                    <option value="general">Thông báo chung</option>
                    <option value="news">Tin tức</option>
                    <option value="promotion">Khuyến mãi</option>
                    <option value="handbook">Cẩm nang</option>
                    <option value="system">Hệ thống</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Đường dẫn đích (URL)</label>
                  <input 
                    type="text" 
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    placeholder="/news/1, /product/123..."
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white font-medium"
                  />
                </div>
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
                  {editingNotification ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffNotifications;
