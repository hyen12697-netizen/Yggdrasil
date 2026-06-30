import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, CheckCircle2, ShoppingCart, User, Phone, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useNotification } from '../context/NotificationContext';

const Cart = () => {
  const { showNotification } = useNotification();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  const total = getCartTotal();

  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Thanh toán khi nhận hàng (COD)');

  // Tự động điền thông tin nếu người dùng đã đăng nhập
  useEffect(() => {
    if (user) {
      setReceiverName(user.name || '');
      setReceiverPhone(user.phone || '');
    }
  }, [user]);

  const handleCheckout = () => {
    if (!user) {
      showNotification({ type: 'error', message: 'Vui lòng đăng nhập để thanh toán đơn hàng!' });
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      showNotification({ type: 'error', message: 'Giỏ hàng của bạn đang trống!' });
      return;
    }
    if (!receiverName.trim()) {
      showNotification({ type: 'error', message: 'Vui lòng nhập họ tên người nhận hàng!' });
      return;
    }
    if (!receiverPhone.trim()) {
      showNotification({ type: 'error', message: 'Vui lòng nhập số điện thoại nhận hàng!' });
      return;
    }
    if (!receiverAddress.trim()) {
      showNotification({ type: 'error', message: 'Vui lòng nhập địa chỉ nhận hàng!' });
      return;
    }

    // Tiến hành gọi hàm lưu đơn hàng
    addOrder({
      customerName: receiverName,
      customerEmail: user.email,
      customerPhone: receiverPhone,
      shippingAddress: receiverAddress,
      paymentMethod: paymentMethod,
      total: total,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        category: item.category
      }))
    });

    showNotification({ type: 'success', message: 'Đặt hàng thành công!' });
    clearCart();
    navigate('/orders');
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/" className="text-gray-500 hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium">
            <ArrowLeft size={16} /> Tiếp tục mua sắm
          </Link>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">Giỏ Hàng Của Bạn</h1>
        
        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart size={48} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-500 mb-8">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
            <Link to="/" className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-8 rounded-full transition-colors">
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Cart Items List */}
            <div className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm font-medium text-gray-500">
                  <div className="col-span-6">Sản phẩm</div>
                  <div className="col-span-2 text-center">Đơn giá</div>
                  <div className="col-span-2 text-center">Số lượng</div>
                  <div className="col-span-2 text-right">Thành tiền</div>
                </div>
                
                {/* Cart Items */}
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-4 flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                      
                      {/* Product Info */}
                      <div className="col-span-6 flex gap-4">
                        <div className="w-20 h-20 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-700">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1592424001806-538421319246?auto=format&fit=crop&q=80&w=200'; }}
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <Link to={`/product/${item.id}`} className="font-medium text-gray-900 dark:text-white hover:text-primary transition-colors line-clamp-2">
                            {item.name}
                          </Link>
                          <span className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{item.category}</span>
                          
                          {/* Mobile Price & Delete */}
                          <div className="flex items-center justify-between mt-2 md:hidden">
                            <span className="font-bold text-primary">{item.price.toLocaleString('vi-VN')} đ</span>
                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 p-1">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Price (Desktop) */}
                      <div className="col-span-2 text-center font-medium text-gray-900 dark:text-white hidden md:block">
                        {item.price.toLocaleString('vi-VN')} đ
                      </div>
                      
                      {/* Quantity */}
                      <div className="col-span-2 flex items-center justify-center">
                        <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                          <button 
                            onClick={() => updateQuantity(item.id, (parseInt(item.quantity) || 0) - 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <input 
                            type="text" 
                            inputMode="numeric"
                            value={item.quantity} 
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '') {
                                updateQuantity(item.id, '');
                              } else if (/^\d+$/.test(val)) {
                                const parsed = parseInt(val, 10);
                                const maxStock = item.stock || 0;
                                if (parsed >= 50) {
                                  showNotification({ type: 'error', message: 'Đơn hàng từ 50 sản phẩm trở lên vui lòng liên hệ với chúng tôi qua Zalo: 08357757501 để được tư vấn và nhận báo giá tốt nhất.' });
                                } else if (parsed > maxStock) {
                                  showNotification({ type: 'error', message: `Số lượng yêu cầu vượt quá tồn kho. Hiện chỉ còn ${maxStock} sản phẩm trong kho.` });
                                } else {
                                  updateQuantity(item.id, parsed);
                                }
                              }
                            }}
                            onBlur={() => {
                              if (item.quantity === '' || parseInt(item.quantity) < 1) {
                                updateQuantity(item.id, 1);
                              }
                            }}
                            className="w-12 text-center font-medium text-gray-900 dark:text-white bg-transparent outline-none border-x border-gray-200 dark:border-gray-600"
                          />
                          <button 
                            onClick={() => {
                              const currentQty = parseInt(item.quantity) || 0;
                              const maxStock = item.stock || 0;
                              if (currentQty + 1 >= 50) {
                                showNotification({ type: 'error', message: 'Đơn hàng từ 50 sản phẩm trở lên vui lòng liên hệ Zalo: 08357757501 để được báo giá tốt nhất.' });
                              } else if (currentQty + 1 > maxStock) {
                                showNotification({ type: 'error', message: `Số lượng yêu cầu vượt quá tồn kho. Hiện chỉ còn ${maxStock} sản phẩm trong kho.` });
                              } else {
                                updateQuantity(item.id, currentQty + 1);
                              }
                            }}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Subtotal & Delete (Desktop) */}
                      <div className="col-span-2 flex items-center justify-end gap-4 hidden md:flex">
                        <span className="font-bold text-primary">
                          {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                        </span>
                        <button 
                          onClick={() => removeFromCart(item.id)} 
                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="w-full lg:w-80 xl:w-96 shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Tổng Đơn Hàng</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Tạm tính:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{total.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Phí vận chuyển:</span>
                    <span className="text-yellow-600 dark:text-yellow-500 text-sm font-semibold">Miễn phí giao hàng</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mb-6">
                  <div className="flex justify-between items-end">
                    <span className="text-gray-900 dark:text-white font-medium">Tổng cộng:</span>
                    <span className="text-2xl font-bold text-primary">{total.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>

                {/* Delivery Info form */}
                <div className="mb-6 space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                    Thông tin nhận hàng
                  </h4>
                  
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      Người nhận hàng
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Họ và tên người nhận" 
                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white font-semibold"
                        value={receiverName}
                        onChange={(e) => setReceiverName(e.target.value)}
                      />
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      Số điện thoại nhận hàng
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Số điện thoại di động" 
                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white font-semibold"
                        value={receiverPhone}
                        onChange={(e) => setReceiverPhone(e.target.value)}
                      />
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      Địa chỉ nhận hàng
                    </label>
                    <div className="relative">
                      <textarea 
                        rows={2}
                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện..." 
                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white font-semibold resize-none"
                        value={receiverAddress}
                        onChange={(e) => setReceiverAddress(e.target.value)}
                      ></textarea>
                      <MapPin className="absolute left-3.5 top-6 -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                  </div>
                </div>

                {/* Payment Method selector */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Phương thức thanh toán</h4>
                  <div className="space-y-3">
                    <label className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === 'Thanh toán khi nhận hàng (COD)'
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={paymentMethod === 'Thanh toán khi nhận hàng (COD)'}
                        onChange={() => setPaymentMethod('Thanh toán khi nhận hàng (COD)')}
                        className="mt-1 text-primary focus:ring-primary" 
                      /> 
                      <div>
                        <span className="block font-medium text-gray-900 dark:text-white text-sm">Thanh toán khi nhận hàng (COD)</span>
                        <span className="block text-xs text-gray-500 mt-1">Trả tiền mặt khi giao hàng</span>
                      </div>
                    </label>
                    <label className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === 'Chuyển khoản ngân hàng'
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={paymentMethod === 'Chuyển khoản ngân hàng'}
                        onChange={() => setPaymentMethod('Chuyển khoản ngân hàng')}
                        className="mt-1 text-primary focus:ring-primary" 
                      /> 
                      <div>
                        <span className="block font-medium text-gray-900 dark:text-white text-sm">Chuyển khoản ngân hàng</span>
                        <span className="block text-xs text-gray-500 mt-1">Chuyển khoản qua quét mã QR</span>
                      </div>
                    </label>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 size={20} /> Đặt Hàng Ngay
                </button>
                
                <div className="mt-6 text-center text-sm pt-4 border-t border-gray-100 dark:border-gray-700">
                  <Link to="/orders" className="text-primary font-medium hover:underline flex items-center justify-center gap-1">
                    Tra cứu trạng thái đơn hàng
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

