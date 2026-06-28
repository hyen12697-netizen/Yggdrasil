import { useMemo } from 'react';
import { useProduct } from '../context/ProductContext';
import { usePromotion } from '../context/PromotionContext';

export const usePromotedProducts = () => {
  const { products: rawProducts } = useProduct();
  const { getActivePromotions } = usePromotion();
  
  return useMemo(() => {
    const activePromotions = getActivePromotions();
    
    // Nếu không có khuyến mãi nào, trả về dữ liệu gốc
    if (!activePromotions || activePromotions.length === 0) {
      return rawProducts;
    }

    return rawProducts.map(product => {
      let bestDiscountedPrice = product.price;
      let appliedPromotion = null;
      let maxDiscountAmount = 0;

      // Tìm khuyến mãi có lợi nhất cho sản phẩm này
      activePromotions.forEach(promo => {
        let isApplicable = false;

        if (promo.targetType === 'all') {
          isApplicable = true;
        } else if (promo.targetType === 'category' && promo.targetCategories.includes(product.category)) {
          isApplicable = true;
        } else if (promo.targetType === 'product' && promo.targetProducts.includes(product.id)) {
          isApplicable = true;
        }

        if (isApplicable) {
          let currentDiscountAmount = 0;
          let calculatedPrice = product.price;

          if (promo.type === 'percentage') {
            currentDiscountAmount = (product.price * promo.value) / 100;
            calculatedPrice = product.price - currentDiscountAmount;
          } else if (promo.type === 'fixed') {
            currentDiscountAmount = promo.value;
            calculatedPrice = product.price - currentDiscountAmount;
            if (calculatedPrice < 0) calculatedPrice = 0; // Không thể có giá âm
          }

          if (currentDiscountAmount > maxDiscountAmount) {
            maxDiscountAmount = currentDiscountAmount;
            bestDiscountedPrice = calculatedPrice;
            appliedPromotion = promo;
          }
        }
      });

      if (appliedPromotion) {
        return {
          ...product,
          price: bestDiscountedPrice,
          oldPrice: product.price, // Giá cũ chính là giá ban đầu
          promotionLabel: appliedPromotion.type === 'percentage' 
            ? `-${appliedPromotion.value}%` 
            : `-${appliedPromotion.value.toLocaleString('vi-VN')}đ`
        };
      }

      return product;
    });
  }, [getActivePromotions]);
};
