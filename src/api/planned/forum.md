# Đề xuất API diễn đàn

> Trạng thái: đề xuất, chưa được BE xác nhận hoặc triển khai.

| Mục đích | Method | URL đề xuất | Request/params chính | Response dự kiến | Quyền |
|---|---|---|---|---|---|
| Danh sách bài đã duyệt | GET | `/api/forum/posts` | `page`, `size`, `search`, `author` | Danh sách bài và tổng tương tác | Công khai |
| Gửi bài chờ duyệt | POST | `/api/forum/posts` | `title`, `content`, ảnh | Post trạng thái chờ duyệt | Customer |
| Sửa/xóa bài | PUT/DELETE | `/api/forum/posts/{id}` | Nội dung hoặc ID | Post/response rỗng | Tác giả hoặc Staff |
| Bài đang chờ | GET | `/api/forum/posts/pending` | Phân trang | Danh sách chờ | Staff |
| Duyệt/từ chối | PATCH | `/api/forum/posts/{id}/moderation` | `decision`, lý do nếu có | Post đã cập nhật | Staff |
| Like/unlike | PUT/DELETE | `/api/forum/posts/{id}/likes/me` | Không | Số like mới | Đã đăng nhập |
| Thêm bình luận | POST | `/api/forum/posts/{id}/comments` | `content` | Comment vừa tạo | Đã đăng nhập |
| Sửa/xóa bình luận | PUT/DELETE | `/api/forum/posts/{postId}/comments/{commentId}` | Nội dung hoặc ID | Comment/response rỗng | Tác giả hoặc Staff |
| Báo cáo nội dung | POST | `/api/forum/reports` | Loại, target ID, lý do | Report vừa tạo | Đã đăng nhập |
| Danh sách/xử lý báo cáo | GET/PATCH | `/api/forum/reports[/{id}]` | Phân trang hoặc quyết định | Report/list | Staff |

## Cần thống nhất với BE

- TODO: Enum trạng thái bài, bình luận và báo cáo.
- TODO: Upload ảnh thay cho base64 trong `localStorage`.
- TODO: Chống spam, giới hạn nội dung và quyền moderation.
- TODO: Response comment dạng lồng trong post hay endpoint phân trang riêng.
