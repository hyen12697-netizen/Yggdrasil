# Đề xuất API danh mục sản phẩm

> Trạng thái: đề xuất, chưa được BE xác nhận hoặc triển khai.

| Mục đích | Method | URL đề xuất | Request/params chính | Response dự kiến | Quyền |
|---|---|---|---|---|---|
| Danh sách sản phẩm | GET | `/api/products` | `page`, `size`, `search`, `category`, `subcategory`, `brand`, `sort` | Danh sách có phân trang | Công khai |
| Chi tiết sản phẩm | GET | `/api/products/{id}` | ID trên path | Product đầy đủ | Công khai |
| Tạo sản phẩm | POST | `/api/products` | Thông tin sản phẩm | Product vừa tạo | Manager |
| Sửa sản phẩm | PUT | `/api/products/{id}` | Thông tin sản phẩm | Product đã sửa | Manager |
| Xóa sản phẩm | DELETE | `/api/products/{id}` | ID trên path | Response rỗng hoặc thông báo | Manager |
| Danh sách danh mục | GET | `/api/categories` | `active`, `search` | Danh sách category | Công khai |
| Quản lý danh mục | POST/PUT/DELETE | `/api/categories[/{id}]` | Category | Category hoặc response rỗng | Manager |
| Danh sách thương hiệu | GET | `/api/brands` | `active`, `search` | Danh sách brand | Công khai |
| Quản lý thương hiệu | POST/PUT/DELETE | `/api/brands[/{id}]` | Brand | Brand hoặc response rỗng | Manager |

## Trường dữ liệu FE đang cần

Product hiện dùng: `id`, `name`, `price`, `oldPrice`, `category`, `subcategory`, `brand`, `stock`, `image`, `description`, `ingredients`, `benefits`, `packaging`, `rating`, `soldCount`, `isNew`.

## Cần thống nhất với BE

- TODO: Response phân trang.
- TODO: Tiền dùng số nguyên VND hay decimal.
- TODO: Upload nhiều ảnh và ảnh đại diện.
- TODO: Quy tắc xóa category/brand đang có sản phẩm.
- TODO: Giá khuyến mãi do product API tính hay FE ghép từ promotion API.
