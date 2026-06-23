// Map slug từ URL sang tên danh mục con và nhóm cha
export const subcategoryMap = {
  // Phân bón hữu cơ
  'phan-chuong': { name: 'Phân chuồng', parent: 'Phân bón hữu cơ', parentSlug: 'phan-bon' },
  'phan-trun-que': { name: 'Phân trùn quế', parent: 'Phân bón hữu cơ', parentSlug: 'phan-bon' },
  'phan-bo-u-vi-sinh': { name: 'Phân bò ủ vi sinh', parent: 'Phân bón hữu cơ', parentSlug: 'phan-bon' },
  'phan-ga-u-vi-sinh': { name: 'Phân gà ủ vi sinh', parent: 'Phân bón hữu cơ', parentSlug: 'phan-bon' },
  'phan-de': { name: 'Phân dê', parent: 'Phân bón hữu cơ', parentSlug: 'phan-bon' },
  'phan-ca': { name: 'Phân cá', parent: 'Phân bón hữu cơ', parentSlug: 'phan-bon' },
  'phan-doi': { name: 'Phân dơi', parent: 'Phân bón hữu cơ', parentSlug: 'phan-bon' },
  'phan-compost': { name: 'Phân compost', parent: 'Phân bón hữu cơ', parentSlug: 'phan-bon' },

  // Phân bón vô cơ
  'npk': { name: 'NPK', parent: 'Phân bón vô cơ', parentSlug: 'phan-bon' },
  'ure': { name: 'Ure', parent: 'Phân bón vô cơ', parentSlug: 'phan-bon' },
  'dap': { name: 'DAP', parent: 'Phân bón vô cơ', parentSlug: 'phan-bon' },
  'kali': { name: 'Kali', parent: 'Phân bón vô cơ', parentSlug: 'phan-bon' },
  'sa': { name: 'SA', parent: 'Phân bón vô cơ', parentSlug: 'phan-bon' },

  // Phân bón lá & Vi sinh
  'phan-bon-la': { name: 'Phân bón lá', parent: 'Phân bón lá & Vi sinh', parentSlug: 'phan-bon' },
  'phan-vi-sinh': { name: 'Phân vi sinh', parent: 'Phân bón lá & Vi sinh', parentSlug: 'phan-bon' },

  // Giải pháp đặc biệt
  'phan-cai-tao-dat': { name: 'Phân cải tạo đất', parent: 'Giải pháp đặc biệt', parentSlug: 'phan-bon' },
};

// Map slug cha sang tên
export const parentCategoryMap = {
  'phan-bon': 'Phân Bón',
  'thuoc-bvv': 'Thuốc Bảo Vệ Thực Vật',
  'hat-giong': 'Hạt Giống',
};

// Nhóm các subcategory theo parent group để sidebar dùng
export const subcategoryGroups = {
  'Phân bón hữu cơ': [
    { slug: 'phan-chuong', name: 'Phân chuồng' },
    { slug: 'phan-trun-que', name: 'Phân trùn quế' },
    { slug: 'phan-bo-u-vi-sinh', name: 'Phân bò ủ vi sinh' },
    { slug: 'phan-ga-u-vi-sinh', name: 'Phân gà ủ vi sinh' },
    { slug: 'phan-de', name: 'Phân dê' },
    { slug: 'phan-ca', name: 'Phân cá' },
    { slug: 'phan-doi', name: 'Phân dơi' },
    { slug: 'phan-compost', name: 'Phân compost' },
  ],
  'Phân bón vô cơ': [
    { slug: 'npk', name: 'NPK' },
    { slug: 'ure', name: 'Ure' },
    { slug: 'dap', name: 'DAP' },
    { slug: 'kali', name: 'Kali' },
    { slug: 'sa', name: 'SA' },
  ],
  'Phân bón lá & Vi sinh': [
    { slug: 'phan-bon-la', name: 'Phân bón lá' },
    { slug: 'phan-vi-sinh', name: 'Phân vi sinh' },
  ],
  'Giải pháp đặc biệt': [
    { slug: 'phan-cai-tao-dat', name: 'Phân cải tạo đất' },
  ],
};
