import React, { useState } from 'react';
import { useProduct } from '../../context/ProductContext';
import { Plus, Edit2, Trash2, Search, X, Check, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const CategoryManager = () => {
  const { categories, addCategory, updateCategory, deleteCategory, toggleCategoryStatus } = useProduct();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: '', order: 0, isActive: true });

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filteredCategories = (categories || []).filter(c => {
    const matchName = (c.name || '').toLowerCase().includes((searchTerm || '').toLowerCase());
    const matchStatus = filterStatus === 'all' ? true : filterStatus === 'active' ? c.isActive : !c.isActive;
    return matchName && matchStatus;
  }).sort((a, b) => a.order - b.order);

  const openAddModal = () => {
    setEditingCat(null);
    setFormData({ name: '', description: '', image: '', order: categories.length, isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCat(cat.id);
    setFormData({ ...cat });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Tên danh mục không được để trống');
      return;
    }
    
    if (editingCat) {
      updateCategory(editingCat, formData);
      toast.success('Đã cập nhật danh mục');
    } else {
      addCategory(formData);
      toast.success('Đã thêm danh mục mới');
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      deleteCategory(deleteConfirm.id);
      toast.success('Đã xóa danh mục');
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input 
              type="text" 
              placeholder="Tìm danh mục..." 
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <select 
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl px-4 py-2.5 outline-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="hidden">Đã ẩn</option>
          </select>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shrink-0 transition-colors w-full md:w-auto justify-center"
        >
          <Plus size={18} /> Thêm danh mục
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-655 dark:text-gray-450">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-bold">
              <tr>
                <th className="px-5 py-4 w-16">Thứ tự</th>
                <th className="px-5 py-4">Tên danh mục</th>
                <th className="px-5 py-4">Mô tả</th>
                <th className="px-5 py-4 text-center">Trạng thái</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
              {filteredCategories.map(cat => (
                <tr key={cat.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-750/30">
                  <td className="px-5 py-4.5 font-medium">{cat.order}</td>
                  <td className="px-5 py-4.5 font-bold text-gray-900 dark:text-white">{cat.name}</td>
                  <td className="px-5 py-4.5 text-gray-500 max-w-xs truncate">{cat.description || 'Chưa có mô tả'}</td>
                  <td className="px-5 py-4.5 text-center">
                    <button 
                      onClick={() => toggleCategoryStatus(cat.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${cat.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {cat.isActive ? 'Hoạt động' : 'Tạm ẩn'}
                    </button>
                  </td>
                  <td className="px-5 py-4.5 text-right space-x-2">
                    <button onClick={() => openEditModal(cat)} className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => setDeleteConfirm(cat)} className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center text-gray-500 font-medium">
                    Chưa có danh mục sản phẩm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{editingCat ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục mới'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Tên danh mục (*)</label>
                <input required type="text" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Mô tả</label>
                <textarea className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50 resize-none h-20" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Thứ tự hiển thị</label>
                  <input type="number" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50" value={formData.order} onChange={e => setFormData({...formData, order: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Trạng thái</label>
                  <select className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50" value={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.value === 'true'})}>
                    <option value="true">Hoạt động</option>
                    <option value="false">Tạm ẩn</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Hủy</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark transition-colors">{editingCat ? 'Cập nhật' : 'Thêm mới'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xác nhận Xóa */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-xl overflow-hidden p-6 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Xóa danh mục?</h3>
            <p className="text-gray-500 mb-6 text-sm">Bạn có chắc chắn muốn xóa danh mục <strong>{deleteConfirm.name}</strong> không? Hành động này không thể hoàn tác.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Hủy</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors">Xóa luôn</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
