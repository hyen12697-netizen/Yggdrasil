import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePromotedProducts } from '../hooks/usePromotedProducts';
import { subcategoryMap, subcategoryGroups, parentCategoryMap } from '../data/subcategoryMap';
import ProductCard from '../components/ProductCard';
import { ChevronRight, Filter, Home, LayoutGrid, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const slugify = (str) => {
  if (!str) return '';
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-');
};

const CategoryPage = () => {
  const { parentSlug, subSlug } = useParams();
  const [sortBy, setSortBy] = useState('Mới nhất');
  
  const products = usePromotedProducts();

  // Find category names based on slug
  const parentCategoryName = parentCategoryMap[parentSlug] || 'Danh mục';
  const currentSubcategory = subSlug ? subcategoryMap[subSlug] : null;
  const subcategoryName = currentSubcategory ? currentSubcategory.name : '';

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = products || [];
    
    if (subSlug) {
      // Filter by subcategory
      if (currentSubcategory) {
        result = result.filter(p => {
          const subCat = p.subcategory || p.subcategoryName || '';
          return slugify(subCat) === subSlug || subCat === currentSubcategory.name;
        });
      }
    } else if (parentSlug) {
      // Filter by parent category using slugify
      if (parentSlug === 'phan-bon') {
        // Show all fertilizer products
        const fertilizerSlugs = [
          'phan-bon-huu-co',
          'phan-bon-vo-co',
          'phan-bon-la-vi-sinh',
          'giai-phap-dac-biet',
          'phan-bon'
        ];
        result = result.filter(p => {
          const catName = p.categoryName || (p.category && p.category.name) || p.category || '';
          const pSlug = slugify(catName);
          return fertilizerSlugs.includes(pSlug) || pSlug.includes('phan-bon');
        });
      } else if (parentSlug === 'thuoc-bvv') {
        result = result.filter(p => {
          const catName = p.categoryName || (p.category && p.category.name) || p.category || '';
          const pSlug = slugify(catName);
          return pSlug.includes('thuoc') || pSlug.includes('bao-ve-thuc-vat');
        });
      } else if (parentSlug === 'hat-giong') {
        result = result.filter(p => {
          const catName = p.categoryName || (p.category && p.category.name) || p.category || '';
          return slugify(catName).includes('hat-giong');
        });
      } else {
        result = result.filter(p => {
          const catName = p.categoryName || (p.category && p.category.name) || p.category || '';
          return slugify(catName) === parentSlug;
        });
      }
    }

    // Apply sorting
    if (sortBy === 'Giá tăng dần') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Giá giảm dần') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Mới nhất') {
      // Sort new products first
      result = [...result].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }
    return result;
  }, [products, parentSlug, subSlug, currentSubcategory, sortBy]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-16 pt-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8 overflow-x-auto whitespace-nowrap py-1">
          <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <Home size={14} />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight size={14} />
          <Link to={`/category/${parentSlug}`} className={`hover:text-primary transition-colors ${!subSlug ? 'text-primary font-semibold' : ''}`}>
            {parentCategoryName}
          </Link>
          {subSlug && (
            <>
              <ChevronRight size={14} />
              <span className="text-primary font-semibold">{subcategoryName}</span>
            </>
          )}
        </nav>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 to-green-700 text-white p-8 md:p-12 mb-8 shadow-md">
          <div className="relative z-10 max-w-2xl">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
              {parentCategoryName}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
              {subSlug ? subcategoryName : `Tất cả sản phẩm ${parentCategoryName}`}
            </h1>
            <p className="text-green-50/90 text-sm md:text-base">
              {subSlug 
                ? `Khám phá các sản phẩm thuộc danh mục ${subcategoryName} chất lượng cao, giúp tối ưu năng suất cây trồng của bạn.`
                : `Hệ thống cung cấp đầy đủ các giải pháp sinh học, hóa học chất lượng cao cho một nền nông nghiệp xanh bền vững.`}
            </p>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 hidden md:block">
            <div className="w-full h-full bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-yellow-300 via-transparent to-transparent"></div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sticky top-24 max-h-[80vh] overflow-y-auto hide-scrollbar">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                <Filter size={20} className="text-primary" /> 
                <span>Danh Mục Con</span>
              </h3>
              
              {parentSlug === 'phan-bon' ? (
                <div className="space-y-5">
                  {Object.entries(subcategoryGroups).map(([groupName, items]) => (
                    <div key={groupName}>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{groupName}</h4>
                      <ul className="space-y-1">
                        {items.map((item) => {
                          const isActive = subSlug === item.slug;
                          return (
                            <li key={item.slug}>
                              <Link 
                                to={`/category/phan-bon/${item.slug}`}
                                className={`w-full text-left py-1.5 px-3 rounded-lg text-sm transition-all flex items-center justify-between group ${
                                  isActive 
                                    ? 'bg-primary/10 text-primary font-semibold' 
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                              >
                                <span>{item.name}</span>
                                <ChevronRight size={12} className={`transition-transform ${isActive ? 'translate-x-1 opacity-100' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} />
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-2">
                  <li>
                    <Link 
                      to={`/category/thuoc-bvv`}
                      className={`w-full text-left py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-between ${
                        parentSlug === 'thuoc-bvv' 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>Thuốc Bảo Vệ Thực Vật</span>
                      <ChevronRight size={14} />
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to={`/category/hat-giong`}
                      className={`w-full text-left py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-between ${
                        parentSlug === 'hat-giong' 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>Hạt Giống</span>
                      <ChevronRight size={14} />
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </aside>

          {/* Product Listing Area */}
          <div className="flex-1">
            
            {/* Filter Bar */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <LayoutGrid size={18} className="text-gray-400" />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Danh sách sản phẩm <span className="text-gray-400 font-normal text-xs ml-1">({filteredProducts.length} sản phẩm)</span>
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">Sắp xếp:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-xs rounded-lg focus:ring-primary focus:border-primary block p-2 outline-none cursor-pointer"
                >
                  <option>Mới nhất</option>
                  <option>Giá tăng dần</option>
                  <option>Giá giảm dần</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
                    key={product.id}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 p-16 rounded-xl border border-gray-100 dark:border-gray-700 text-center flex flex-col items-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/10 text-red-500 mb-4">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Chưa có sản phẩm</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mb-6">
                  Hiện chưa có sản phẩm nào thuộc danh mục này. Vui lòng quay lại sau hoặc tham khảo các danh mục sản phẩm khác.
                </p>
                <Link 
                  to="/category/phan-bon"
                  className="bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-6 rounded-full text-sm transition-colors shadow-sm"
                >
                  Xem phân bón khác
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
