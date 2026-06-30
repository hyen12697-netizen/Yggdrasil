import { createContext, useState, useContext, useEffect } from 'react';
import { useNotification } from './NotificationContext';
import AddToCartModal from '../components/AddToCartModal';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { showNotification } = useNotification();
  
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('yggdrasil_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const [modalCallback, setModalCallback] = useState(null);

  useEffect(() => {
    localStorage.setItem('yggdrasil_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    showNotification({ type: 'success', message: 'Đã thêm vào giỏ hàng' });
  };

  const openAddToCartModal = (product, onSuccess) => {
    setModalProduct(product);
    setModalCallback(() => onSuccess);
    setIsModalOpen(true);
  };

  const closeAddToCartModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setModalProduct(null);
      setModalCallback(null);
    }, 200); // Wait for transition
  };

  const handleModalConfirm = (product, quantity) => {
    addToCart(product, quantity);
    if (modalCallback) {
      modalCallback();
    }
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    showNotification({ type: 'success', message: 'Đã xóa khỏi giỏ hàng' });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity !== '' && quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * (parseInt(item.quantity) || 0)), 0);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      openAddToCartModal,
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      getCartTotal,
      cartCount: cartItems.reduce((count, item) => count + (parseInt(item.quantity) || 0), 0)
    }}>
      {children}
      <AddToCartModal 
        isOpen={isModalOpen}
        onClose={closeAddToCartModal}
        product={modalProduct}
        onConfirm={handleModalConfirm}
        cartItems={cartItems}
      />
    </CartContext.Provider>
  );
};
