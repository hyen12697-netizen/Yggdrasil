# Đề xuất API đơn hàng

> Trạng thái: đề xuất, chưa được BE xác nhận hoặc triển khai.

| Mục đích | Method | URL đề xuất | Request/params chính | Response dự kiến | Quyền |
|---|---|---|---|---|---|
| Tạo đơn | POST | `/api/orders` | Người nhận, địa chỉ, phương thức thanh toán, danh sách `productId` và `quantity`, coupon nếu có | Đơn đã được BE tính giá | Customer |
| Đơn của tôi | GET | `/api/orders/me` | `page`, `size`, `status` | Danh sách đơn của user | Customer |
| Chi tiết đơn của tôi | GET | `/api/orders/me/{id}` | ID trên path | Order và items | Chủ đơn |
| Danh sách vận hành | GET | `/api/orders` | `page`, `size`, `status`, `search` | Danh sách đơn | Staff/Manager |
| Cập nhật trạng thái | PATCH | `/api/orders/{id}/status` | `status` | Order đã cập nhật | Staff/Manager |
| Hủy đơn | POST | `/api/orders/{id}/cancel` | Lý do nếu có | Order đã hủy | Chủ đơn hoặc Staff |

## Cần thống nhất với BE

- BE phải đọc giá và tồn kho từ database, không tin `total` hoặc `price` do FE gửi.
- TODO: Chốt enum trạng thái và chuyển trạng thái hợp lệ.
- TODO: Trừ/hoàn tồn kho và xử lý cạnh tranh.
- TODO: COD, chuyển khoản và cổng thanh toán thực tế.
- TODO: Phí vận chuyển, coupon, hóa đơn, hoàn tiền và trả hàng.
- Giỏ hàng hiện vẫn là state/localStorage phía FE; chưa đề xuất cart server cho đến khi nhóm xác nhận yêu cầu đồng bộ đa thiết bị.
