import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

const AddToCartModal = ({ isOpen, onClose, product, onConfirm, cartItems }) => {
  const [quantity, setQuantity] = useState(1);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const maxStock = product.stock || 0;
  const cartItem = cartItems?.find(item => item.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const handleQuantity = (type) => {
    if (type === 'inc') {
      setQuantity(q => {
        const current = parseInt(q) || 0;
        if (current + inCartQty + 1 > maxStock) {
          showNotification({ type: 'error', message: `Số lượng yêu cầu vượt quá tồn kho. Hiện chỉ còn ${maxStock} sản phẩm trong kho.` });
          return current;
        }
        return current + 1;
      });
    }
    if (type === 'dec' && (parseInt(quantity) || 0) > 1) {
      setQuantity(q => (parseInt(q) || 0) - 1);
    }
  };

  const handleConfirm = () => {
    const currentQty = parseInt(quantity) || 1;
    if (currentQty + inCartQty > maxStock) {
      showNotification({ type: 'error', message: `Số lượng yêu cầu vượt quá tồn kho. Hiện chỉ còn ${maxStock} sản phẩm trong kho.` });
      return;
    }
    
    onConfirm(product, currentQty);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        
        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 relative z-10">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Chọn số lượng</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Body */}
          <div className="p-5 flex flex-col gap-5 bg-white dark:bg-gray-800 relative z-10">
            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shrink-0 border border-gray-100 dark:border-gray-600">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1592424001806-538421319246?auto=format&fit=crop&q=80&w=200'; }}
                />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">{product.name}</h4>
                <div className="font-bold text-primary">{product.price.toLocaleString('vi-VN')} đ</div>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Số lượng muốn mua:
              </label>
              <div className="flex items-center">
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                  <button 
                    onClick={() => handleQuantity('dec')} 
                    className="p-3 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                  >
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
                        if (parsed + inCartQty > maxStock) {
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
                    className="w-16 text-center bg-transparent font-medium text-gray-900 dark:text-white outline-none text-base"
                  />
                  <button 
                    onClick={() => handleQuantity('inc')} 
                    className="p-3 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                {inCartQty > 0 && (
                  <span className="ml-3 text-xs text-gray-500 dark:text-gray-400">
                    Đã có {inCartQty} trong giỏ
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 relative z-10">
            {parseInt(quantity) >= 50 ? (
              <div className="flex flex-col gap-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-3 rounded-lg text-sm leading-relaxed border border-blue-100 dark:border-blue-800">
                  Đơn hàng từ 50 sản phẩm trở lên vui lòng liên hệ với chúng tôi qua Zalo hoặc số điện thoại để được tư vấn, kiểm tra tồn kho và nhận báo giá tốt nhất.
                </div>
                <div className="flex gap-3">
                  <a href="https://zalo.me/08357757501" target="_blank" rel="noreferrer" className="flex-1 py-2.5 rounded-xl font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center shadow-sm">
                    Liên hệ Zalo
                  </a>
                  <a href="tel:08357757501" className="flex-1 py-2.5 rounded-xl font-medium text-white bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center shadow-sm">
                    Gọi hỗ trợ
                  </a>
                </div>
                <button onClick={onClose} className="w-full py-2 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors mt-1">
                  Đóng
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleConfirm}
                  className="flex-1 py-2.5 rounded-xl font-medium text-white bg-primary hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShoppingCart size={18} />
                  Xác nhận
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddToCartModal;
