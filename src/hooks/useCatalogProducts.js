import { useEffect, useState } from 'react';
import { listProducts } from '../api/products';

const emptyPage = (page = 0, size = 12) => ({
  content: [], page, size, totalElements: 0, totalPages: 0, first: true, last: true,
});

const listProductsForCategories = async ({ categoryIds, ...query }) => {
  const page = Number(query.page) || 0;
  const size = Number(query.size) || 12;
  const ids = [...new Set(categoryIds)];
  if (ids.length === 0) return emptyPage(page, size);
  if (ids.length === 1) return listProducts({ ...query, categoryId: ids[0] });

  const categoryPages = await Promise.all(ids.map((categoryId) =>
    listProducts({ ...query, categoryId, page: 0, size: 100 })
  ));
  const allProducts = categoryPages.flatMap((categoryPage) => categoryPage.content);
  const productById = new Map(allProducts.map((product) => [product.id, product]));
  const products = [...productById.values()];
  const direction = query.sortDir === 'asc' ? 1 : -1;

  products.sort((left, right) => {
    if (query.sortBy === 'price') return (left.price - right.price) * direction;
    // The summary DTO has no createdAt field; IDs provide the stable newest-first order.
    return (left.id - right.id) * direction;
  });

  const totalElements = products.length;
  const totalPages = Math.ceil(totalElements / size);
  return {
    content: products.slice(page * size, (page + 1) * size),
    page,
    size,
    totalElements,
    totalPages,
    first: page === 0,
    last: totalPages === 0 || page >= totalPages - 1,
  };
};

export const useCatalogProducts = (query) => {
  const queryKey = JSON.stringify(query);
  const [page, setPage] = useState({ content: [], page: 0, size: 12, totalElements: 0, totalPages: 0 });
  const [error, setError] = useState('');
  const [loadedKey, setLoadedKey] = useState(null);

  useEffect(() => {
    let active = true;
    const request = JSON.parse(queryKey);
    const productsRequest = Array.isArray(request.categoryIds)
      ? listProductsForCategories(request)
      : listProducts(request);
    productsRequest
      .then((result) => { if (active) { setPage(result); setError(''); setLoadedKey(queryKey); } })
      .catch((requestError) => { if (active) { setError(requestError.message || 'Không thể tải danh sách sản phẩm.'); setLoadedKey(queryKey); } });
    return () => { active = false; };
  }, [queryKey]);

  return { ...page, loading: loadedKey !== queryKey, error };
};
