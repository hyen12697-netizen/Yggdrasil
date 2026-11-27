import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getProducts as apiGetProducts,
  getProductById as apiGetProductById,
  createProduct as apiCreateProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  getCategories as apiGetCategories,
  createCategory as apiCreateCategory,
  updateCategory as apiUpdateCategory,
  deleteCategory as apiDeleteCategory,
  getBrands as apiGetBrands,
  createBrand as apiCreateBrand,
  updateBrand as apiUpdateBrand,
  deleteBrand as apiDeleteBrand,
} from '../api/products';

const ProductContext = createContext();

export const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1592424001806-538421319246?auto=format&fit=crop&q=80&w=400';

/**
 * Chuẩn hóa field sản phẩm từ Spring Boot DTO sang cấu trúc thống nhất cho UI
 */
export const normalizeProduct = (p) => {
  if (!p) return null;
  const rawImage =
    p.mainImageUrl ||
    p.image ||
    (Array.isArray(p.images) && p.images.find(Boolean)) ||
    '';
  const image = rawImage || DEFAULT_PRODUCT_IMAGE;
  const category =
    p.categoryName ??
    (typeof p.category === 'object' ? p.category?.name : p.category) ??
    '';
  const subcategory =
    p.subcategoryName ??
    (typeof p.subcategory === 'object' ? p.subcategory?.name : p.subcategory) ??
    '';
  const brand =
    p.brandName ??
    (typeof p.brand === 'object' ? p.brand?.name : p.brand) ??
    '';
  const stockQuantity = Number(p.stockQuantity ?? p.stock ?? 0);

  return {
    ...p,
    image,
    category,
    subcategory,
    brand,
    price: Number(p.price ?? 0),
    oldPrice: p.oldPrice != null ? Number(p.oldPrice) : null,
    discount: Number(p.discountPercent ?? p.discount ?? 0),
    rating: Number(p.avgRating ?? p.rating ?? 0),
    stock: stockQuantity,
    stockQuantity,
  };
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProduct must be used within a ProductProvider');
  return context;
};

export const useProductContext = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ─── Pagination state ─────────────────────────────────────────────────────
  const [pagination, setPagination] = useState({
    pageNo: 0,
    pageSize: 20,
    totalElements: 0,
    totalPages: 0,
    last: true,
  });

  // ─── Fetch products (Đã bóc tách chuẩn Spring Data JPA) ───────────────────
  const fetchProducts = useCallback(async (params = { page: 0, size: 20 }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiGetProducts(params);

      let productList = [];
      if (response?.content && Array.isArray(response.content)) {
        // Chuẩn: Spring Data JPA PageResponse (axiosClient đã unwrap response.data)
        const { content, ...pageInfo } = response;
        setPagination(pageInfo);
        productList = content;
      } else if (Array.isArray(response)) {
        // Fallback: BE trả về array thẳng
        productList = response;
      }

      setProducts(productList.map(normalizeProduct).filter(Boolean));
    } catch (err) {
      console.error('[ProductContext] Lỗi gọi API sản phẩm:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─── Fetch single product detail ──────────────────────────────────────────
  const fetchProductById = useCallback(async (id) => {
    const response = await apiGetProductById(id);
    return normalizeProduct(response?.data ?? response);
  }, []);

  // ─── Fetch categories ─────────────────────────────────────────────────────
  const fetchCategories = useCallback(async (params = {}) => {
    try {
      // BE trả về PageResponse – load 100 items để hiển thị hết danh mục
      const response = await apiGetCategories({ page: 0, size: 100, ...params });
      // PageResponse: { content: [] } hoặc array
      const data = response?.content ?? (Array.isArray(response) ? response : []);
      setCategories(data.map((c) => ({ ...c, isActive: c.isActive ?? c.active ?? true })));
    } catch (err) {
      console.warn('[ProductContext] Categories API unavailable:', err.message);
    }
  }, []);

  // ─── Fetch brands ─────────────────────────────────────────────────────────
  const fetchBrands = useCallback(async (params = {}) => {
    try {
      // BE trả về PageResponse – load 100 items để hiển thị hết thương hiệu
      const response = await apiGetBrands({ page: 0, size: 100, ...params });
      // PageResponse: { content: [] } hoặc array
      const data = response?.content ?? (Array.isArray(response) ? response : []);
      setBrands(data.map((b) => ({ ...b, isActive: b.isActive ?? b.active ?? true })));
    } catch (err) {
      console.warn('[ProductContext] Brands API unavailable:', err.message);
    }
  }, []);

  // ─── Load data on mount / F5 ──────────────────────────────────────────────
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, [fetchProducts, fetchCategories, fetchBrands]);

  // ─── Product CRUD actions ─────────────────────────────────────────────────
  const addProduct = async (product) => {
    try {
      const created = normalizeProduct(await apiCreateProduct(product));
      setProducts((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error('[ProductContext] Thêm sản phẩm thất bại:', err);
      throw err;
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      const updated = normalizeProduct(await apiUpdateProduct(id, updatedData));
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch (err) {
      console.error('[ProductContext] Cập nhật sản phẩm thất bại:', err);
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await apiDeleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('[ProductContext] Xóa sản phẩm thất bại:', err);
      throw err;
    }
  };

  // ─── Category CRUD actions ────────────────────────────────────────────────
  const addCategory = async (category) => {
    try {
      const created = await apiCreateCategory(category);
      const normalized = { ...created, isActive: created?.isActive ?? created?.active ?? true };
      setCategories((prev) => [...prev, normalized]);
      return normalized;
    } catch (err) {
      console.error('[ProductContext] Thêm danh mục thất bại:', err);
      throw err;
    }
  };

  const updateCategory = async (id, updatedData) => {
    try {
      const updated = await apiUpdateCategory(id, updatedData);
      const normalized = { ...updated, isActive: updated?.isActive ?? updated?.active ?? true };
      setCategories((prev) => prev.map((c) => (c.id === id ? normalized : c)));
      return normalized;
    } catch (err) {
      console.error('[ProductContext] Cập nhật danh mục thất bại:', err);
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await apiDeleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('[ProductContext] Xóa danh mục thất bại:', err);
      throw err;
    }
  };

  const toggleCategoryStatus = async (id) => {
    const target = categories.find((c) => c.id === id);
    if (!target) return;
    const nextActive = !target.isActive;
    return updateCategory(id, {
      name: target.name,
      description: target.description ?? '',
      isActive: nextActive,
      active: nextActive,
    });
  };

  // ─── Brand CRUD actions ───────────────────────────────────────────────────
  const addBrand = async (brand) => {
    try {
      const created = await apiCreateBrand(brand);
      const normalized = { ...created, isActive: created?.isActive ?? created?.active ?? true };
      setBrands((prev) => [...prev, normalized]);
      return normalized;
    } catch (err) {
      console.error('[ProductContext] Thêm thương hiệu thất bại:', err);
      throw err;
    }
  };

  const updateBrand = async (id, updatedData) => {
    try {
      const updated = await apiUpdateBrand(id, updatedData);
      const normalized = { ...updated, isActive: updated?.isActive ?? updated?.active ?? true };
      setBrands((prev) => prev.map((b) => (b.id === id ? normalized : b)));
      return normalized;
    } catch (err) {
      console.error('[ProductContext] Cập nhật thương hiệu thất bại:', err);
      throw err;
    }
  };

  const deleteBrand = async (id) => {
    try {
      await apiDeleteBrand(id);
      setBrands((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error('[ProductContext] Xóa thương hiệu thất bại:', err);
      throw err;
    }
  };

  const toggleBrandStatus = async (id) => {
    const target = brands.find((b) => b.id === id);
    if (!target) return;
    const nextActive = !target.isActive;
    return updateBrand(id, {
      name: target.name,
      description: target.description ?? '',
      logo: target.logo ?? '',
      country: target.country ?? '',
      isActive: nextActive,
      active: nextActive,
    });
  };

  // ─── Context value ────────────────────────────────────────────────────────
  const value = {
    // State
    products,
    categories,
    brands,
    isLoading,
    error,
    pagination,
    // Refetch helpers
    fetchProducts,
    fetchProductById,
    fetchCategories,
    fetchBrands,
    // Product Actions
    addProduct,
    updateProduct,
    deleteProduct,
    // Category Actions
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    // Brand Actions
    addBrand,
    updateBrand,
    deleteBrand,
    toggleBrandStatus,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};