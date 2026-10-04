# Đề xuất API nội dung và marketing

> Trạng thái: đề xuất, chưa được BE xác nhận hoặc triển khai.

| Nghiệp vụ | Method và URL đề xuất | Chức năng | Quyền |
|---|---|---|---|
| Tin tức | `GET/POST /api/news`, `GET/PUT/DELETE /api/news/{id}` | Danh sách, chi tiết và CRUD | GET công khai; ghi Staff |
| Cẩm nang | `GET/POST /api/handbook`, `GET/PUT/DELETE /api/handbook/{slugOrId}` | Danh sách, chi tiết và CRUD | GET công khai; ghi Staff |
| Banner | `GET/POST /api/banners`, `PUT/DELETE /api/banners/{id}` | Banner theo vị trí trang chủ/diễn đàn | GET công khai; ghi Manager |
| Khuyến mãi | `GET/POST /api/promotions`, `PUT/DELETE /api/promotions/{id}` | CRUD và bật/tắt chương trình | GET công khai; ghi Manager |
| Coupon | `POST /api/coupons/validate`, CRUD `/api/coupons` | Kiểm tra và quản lý mã | Validate Customer; CRUD Manager |
| Popup | `GET/PUT /api/site/popup` | Popup đang hoạt động và cấu hình | GET công khai; PUT Manager |
| Thông báo | `GET /api/notifications/me`, `PATCH /api/notifications/{id}/read` | Thông báo riêng và đánh dấu đọc | Đã đăng nhập |
| Quản lý thông báo | `POST/PUT/DELETE /api/notifications[/{id}]` | Tạo, sửa, xóa, bật/tắt | Staff |

## Cần thống nhất với BE

- TODO: Handbook dùng `slug`, nội dung HTML hay danh sách section có cấu trúc.
- TODO: Sanitize HTML ở backend trước khi lưu/hiển thị.
- TODO: Banner phân biệt `home` và `forum`, thứ tự và khoảng thời gian hiển thị.
- TODO: Promotion/coupon được tính hoàn toàn ở BE khi đặt hàng.
- TODO: Thông báo chung hay bản ghi theo từng người dùng; trạng thái đã đọc phải tách theo user.
- TODO: API cấu hình website ngoài popup nếu các giá trị hotline/email/address cần quản lý động.
