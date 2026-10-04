# Đề xuất API tài khoản và xác thực

> Trạng thái: đề xuất, chưa được BE xác nhận hoặc triển khai.

| Mục đích | Method | URL đề xuất | Request chính | Response dự kiến | Quyền |
|---|---|---|---|---|---|
| Đăng ký khách hàng | POST | `/api/auth/register` | `name`, `email`, `phone`, `password` | User không chứa password | Công khai |
| Đăng nhập | POST | `/api/auth/login` | `email`, `password` | Thông tin user và dữ liệu xác thực theo cơ chế BE chọn | Công khai |
| Lấy tài khoản hiện tại | GET | `/api/auth/me` | Không | User hiện tại | Đã đăng nhập |
| Cập nhật hồ sơ | PATCH | `/api/users/me` | `name`, `email`, `phone`, `address`, `avatar` | User đã cập nhật | Đã đăng nhập |
| Đổi mật khẩu | PUT | `/api/users/me/password` | `currentPassword`, `newPassword` | Thông báo kết quả | Đã đăng nhập |

## Cần thống nhất với BE

- TODO: Chọn JWT hay cookie session; chưa thêm token vào `client.js`.
- TODO: Chính sách refresh/logout và thời hạn phiên.
- TODO: Upload avatar bằng multipart hay URL ảnh.
- TODO: Xác minh email, quên mật khẩu và giới hạn đăng nhập sai.
- Password tuyệt đối không xuất hiện trong response hoặc được lưu trong `localStorage`.
