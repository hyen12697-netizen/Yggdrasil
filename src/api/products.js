import { apiRequest } from './client';

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

export const mapProductSummary = (product) => ({
  ...product,
  price: toNumber(product.price),
  oldPrice: product.oldPrice == null ? null : toNumber(product.oldPrice),
  discount: toNumber(product.discountPercent),
  rating: toNumber(product.avgRating),
  soldCount: toNumber(product.salesCount),
  stock: toNumber(product.stockQuantity),
  image: product.mainImageUrl || product.images?.[0] || '',
  category: product.categoryName || '',
  subcategory: product.subcategoryName || '',
  isNew: false,
  isAvailable: (product.status === undefined || product.status === 'AVAILABLE') && toNumber(product.stockQuantity) > 0,
});

export const mapProductDetail = (product) => ({
  ...mapProductSummary({
    ...product,
    mainImageUrl: product.images?.[0] || product.mainImageUrl,
    categoryName: product.category?.name,
    subcategoryName: product.subcategory?.name,
    brandName: product.brand?.name,
  }),
  description: product.description || '',
  ingredients: product.composition || '',
  usage: product.usageInstructions || '',
  images: product.images || [],
  attributes: product.attributes,
  categoryDetails: product.category,
  subcategoryDetails: product.subcategory,
  brand: product.brand,
});

export const listProducts = async (query = {}) => {
  const response = await apiRequest('/api/v1/products', {
    query: { page: 0, size: 12, isAvailable: true, ...query },
  });
  return { ...response, content: (response.content || []).map(mapProductSummary) };
};

export const getProduct = async (idOrSlug) =>
  mapProductDetail(await apiRequest(`/api/v1/products/${encodeURIComponent(idOrSlug)}`));

export const getRelatedProducts = async (idOrSlug) => {
  const response = await apiRequest(`/api/v1/products/${encodeURIComponent(idOrSlug)}/related`);
  return (response || []).map(mapProductSummary);
};

export const listCategories = async (query = {}) => {
  const response = await apiRequest('/api/v1/categories', {
    query: { page: 0, size: 100, active: true, sortBy: 'order', sortDir: 'asc', ...query },
  });
  return response.content || [];
};
