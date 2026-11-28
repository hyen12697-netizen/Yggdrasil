import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';
import {
  getWishlist as apiGetWishlist,
  addToWishlist as apiAddToWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
} from '../api/wishlist';
import { tokenStorage } from '../api/axiosClient';
import { DEFAULT_PRODUCT_IMAGE } from './ProductContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

/**
 * WishlistContext lưu trữ danh sách theo cấu trúc gốc của BE:
 *   wishlistItems = [{ id: wishlistItemId, product: { id, name, price, mainImageUrl, ... } }]
 *
 * Helper `isInWishlist(productId)` so sánh product.id (không phải wishlistItem.id).
 */
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();
  const { isAuthenticated, user } = useAuth();

  const normalizedRole = String(user?.role || '').toUpperCase();
  const isCustomer = !!user && (normalizedRole === 'CUSTOMER' || normalizedRole === '');

  // ─── Fetch từ server ─────────────────────────────────────────────────────────
  const fetchWishlist = useCallback(async () => {
    const token = tokenStorage.get();
    if (!token || !isCustomer) {
      setWishlistItems([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await apiGetWishlist();
      // data = WishlistItemResponse[] = [{ id, product: {...}, createdAt }]
      setWishlistItems(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err?.status !== 403) {
        console.warn('[WishlistContext] Không thể tải wishlist:', err.message);
      }
      setWishlistItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [isCustomer]);

  const userId = user?.id;

  // Tự động đồng bộ wishlist khi user đăng nhập / đăng xuất / F5 (chỉ gọi với role CUSTOMER)
  useEffect(() => {
    if (isAuthenticated && userId && isCustomer) {
      Promise.resolve().then(() => fetchWishlist());
    } else {
      Promise.resolve().then(() => setWishlistItems([]));
    }
  }, [isAuthenticated, userId, isCustomer, fetchWishlist]);

  // Lắng nghe 401 → xóa wishlist state
  useEffect(() => {
    const handle = () => setWishlistItems([]);
    window.addEventListener('ygg:unauthorized', handle);
    return () => window.removeEventListener('ygg:unauthorized', handle);
  }, []);

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  /**
   * Trả về true nếu sản phẩm đã trong wishlist (so sánh theo product.id).
   */
  const isInWishlist = (productId) =>
    wishlistItems.some((item) => item.product?.id === productId || item.id === productId);

  /**
   * Lấy wishlist item theo productId (để lấy wishlistItemId khi cần xoá).
   */
  const getWishlistItem = (productId) =>
    wishlistItems.find((item) => item.product?.id === productId);

  // ─── Add ─────────────────────────────────────────────────────────────────────
  const addToWishlist = async (product) => {
    const productId = product.id;
    if (isInWishlist(productId)) return;

    const token = tokenStorage.get();
    if (!token) {
      showNotification({ type: 'error', message: 'Vui lòng đăng nhập để thêm vào yêu thích.' });
      return;
    }
    if (!isCustomer) {
      showNotification({ type: 'error', message: 'Chức năng yêu thích chỉ áp dụng cho tài khoản khách hàng.' });
      return;
    }

    // Optimistic update
    const optimisticItem = { id: `temp-${productId}`, product };
    setWishlistItems((prev) => [...prev, optimisticItem]);

    try {
      const newItem = await apiAddToWishlist(productId);
      // Replace optimistic item with real server response
      setWishlistItems((prev) =>
        prev.map((item) => (item.id === `temp-${productId}` ? newItem : item))
      );
      showNotification({ type: 'success', message: 'Đã thêm vào danh sách yêu thích!' });
    } catch (err) {
      // Rollback
      setWishlistItems((prev) => prev.filter((item) => item.id !== `temp-${productId}`));
      showNotification({ type: 'error', message: err.message || 'Không thể thêm vào yêu thích.' });
    }
  };

  // ─── Remove ──────────────────────────────────────────────────────────────────
  const removeFromWishlist = async (productId) => {
    const token = tokenStorage.get();

    // Optimistic update
    setWishlistItems((prev) =>
      prev.filter((item) => (item.product?.id ?? item.id) !== productId)
    );

    if (!token || !isCustomer) return; // guest or non-customer role

    try {
      await apiRemoveFromWishlist(productId);
      showNotification({ type: 'success', message: 'Đã xóa khỏi danh sách yêu thích!' });
    } catch (err) {
      // Rollback: re-fetch
      fetchWishlist();
      showNotification({ type: 'error', message: err.message || 'Không thể xóa khỏi yêu thích.' });
    }
  };

  // ─── Toggle ──────────────────────────────────────────────────────────────────
  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // ─── Derived: flat product list for UI ───────────────────────────────────────
  /**
   * Trả về danh sách sản phẩm phẳng (product objects) để các trang UI render trực tiếp.
   * Mỗi object có thêm _wishlistItemId để phân biệt.
   */
  const wishlistProducts = wishlistItems.map((item) => {
    const p = item.product ?? item;
    return {
      ...p,
      // Chuẩn hóa tên field từ BE → UI
      image: p.mainImageUrl || p.image || DEFAULT_PRODUCT_IMAGE,
      oldPrice: p.oldPrice ?? null,
      discount: p.discountPercent ?? p.discount ?? 0,
      rating: p.avgRating ?? p.rating ?? 0,
      category: p.categoryName ?? p.category ?? '',
      inStock: (p.stockQuantity ?? p.stock ?? 1) > 0,
      _wishlistItemId: item.id,
    };
  });

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,        // raw API items
        wishlistProducts,     // flat, normalized for UI
        isLoading,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        getWishlistItem,
        fetchWishlist,
        wishlistCount: wishlistItems.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
