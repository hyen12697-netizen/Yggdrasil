import { createContext, useState, useContext, useEffect } from 'react';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

// Dữ liệu đơn hàng mẫu ban đầu để hệ thống hiển thị sinh động
const initialOrders = [
  {
    id: 'YG-2026-1024',
    customerName: 'Customer Yggdrasil',
    customerEmail: 'customer@yggdrasil.com',
    customerPhone: '08357757501',
    shippingAddress: '123 Đường Nông Nghiệp, Quận 1, TP. Hồ Chí Minh',
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    date: '19/06/2026 14:30',
    total: 335000,
    status: 'Đang giao hàng',
    items: [
      { id: 106, name: 'Phân trùn quế viên nén tan chậm SFarm', price: 65000, quantity: 2, image: '/product-1.png', category: 'Phân bón hữu cơ' },
      { id: 120, name: 'Phân cá vi sinh dạng nước Alaska', price: 180000, quantity: 1, image: '/product-1.png', category: 'Phân bón hữu cơ' }
    ]
  },
  {
    id: 'YG-2026-1023',
    customerName: 'Customer Yggdrasil',
    customerEmail: 'customer@yggdrasil.com',
    customerPhone: '08357757501',
    shippingAddress: '123 Đường Nông Nghiệp, Quận 1, TP. Hồ Chí Minh',
    paymentMethod: 'Chuyển khoản ngân hàng',
    date: '18/06/2026 10:15',
    total: 150000,
    status: 'Đã giao thành công',
    items: [
      { id: 112, name: 'Phân gà Nhật Bản cao cấp dạng viên', price: 150000, quantity: 1, image: '/product-1.png', category: 'Phân bón hữu cơ' }
    ]
  },
  {
    id: 'YG-2026-1022',
    customerName: 'Nguyễn Văn Hùng',
    customerEmail: 'hung.nguyen@gmail.com',
    customerPhone: '0901234567',
    shippingAddress: '456 Lê Lợi, Quận Hải Châu, Đà Nẵng',
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    date: '22/06/2026 09:00',
    total: 310000,
    status: 'Chờ xác nhận',
    items: [
      { id: 106, name: 'Phân trùn quế viên nén tan chậm SFarm', price: 65000, quantity: 2, image: '/product-1.png', category: 'Phân bón hữu cơ' },
      { id: 131, name: 'Phân bón NPK 20-20-15 Phú Mỹ', price: 180000, quantity: 1, image: '/product-1.png', category: 'Phân bón vô cơ' }
    ]
  },
  {
    id: 'YG-2026-1021',
    customerName: 'Trần Thị Mai',
    customerEmail: 'mai.tran@yahoo.com',
    customerPhone: '0912345678',
    shippingAddress: '789 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    paymentMethod: 'Chuyển khoản ngân hàng',
    date: '21/06/2026 11:20',
    total: 1200000,
    status: 'Đang giao hàng',
    items: [
      { id: 112, name: 'Phân gà Nhật Bản cao cấp dạng viên', price: 150000, quantity: 3, image: '/product-1.png', category: 'Phân bón hữu cơ' },
      { id: 139, name: 'Phân bón DAP Đình Vũ chất lượng', price: 125000, quantity: 6, image: '/product-1.png', category: 'Phân bón vô cơ' }
    ]
  },
  {
    id: 'YG-2026-1020',
    customerName: 'Lê Hoàng Nam',
    customerEmail: 'nam.le@hotmail.com',
    customerPhone: '0987654321',
    shippingAddress: '22 Bis Lý Tự Trọng, Quận 1, TP. Hồ Chí Minh',
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    date: '20/06/2026 16:45',
    total: 235000,
    status: 'Đã giao thành công',
    items: [
      { id: 112, name: 'Phân gà Nhật Bản cao cấp dạng viên', price: 150000, quantity: 1, image: '/product-1.png', category: 'Phân bón hữu cơ' },
      { id: 105, name: 'Phân trùn quế nguyên chất SFarm Pb01', price: 85000, quantity: 1, image: '/product-1.png', category: 'Phân bón hữu cơ' }
    ]
  },
  {
    id: 'YG-2026-1019',
    customerName: 'Hoàng Kim Chi',
    customerEmail: 'chi.hoang@gmail.com',
    customerPhone: '0956789012',
    shippingAddress: '15 Trần Hưng Đạo, TP. Quy Nhơn, Bình Định',
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    date: '18/06/2026 14:00',
    total: 130000,
    status: 'Đã hủy',
    items: [
      { id: 106, name: 'Phân trùn quế viên nén tan chậm SFarm', price: 65000, quantity: 2, image: '/product-1.png', category: 'Phân bón hữu cơ' }
    ]
  }
];

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('yggdrasil_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  useEffect(() => {
    localStorage.setItem('yggdrasil_orders', JSON.stringify(orders));
  }, [orders]);

  // Thêm đơn hàng mới từ giỏ hàng
  const addOrder = (orderData) => {
    const newOrder = {
      id: 'YG-2026-' + (1000 + orders.length + 25), // Tự động tăng ID
      status: 'Chờ xác nhận',
      date: new Date().toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      ...orderData
    };
    
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  // Cập nhật trạng thái đơn hàng (sử dụng bởi Manager)
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: newStatus } : o
    ));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};
