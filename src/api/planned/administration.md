# Đề xuất API quản trị

> Trạng thái: đề xuất, chưa được BE xác nhận hoặc triển khai.

| Mục đích | Method | URL đề xuất | Request/params chính | Response dự kiến | Quyền |
|---|---|---|---|---|---|
| Danh sách khách hàng | GET | `/api/customers` | `page`, `size`, `search`, `status` | Danh sách phân trang | Staff/Manager |
| Chi tiết khách hàng | GET | `/api/customers/{id}` | ID | Customer và thống kê đơn | Staff/Manager |
| Sửa khách hàng | PUT | `/api/customers/{id}` | Thông tin được phép sửa | Customer đã sửa | Staff/Manager |
| Khóa/mở tài khoản | PATCH | `/api/users/{id}/status` | `status`, lý do nếu có | User đã cập nhật | Staff/Manager theo chính sách |
| Danh sách nhân viên | GET | `/api/staff` | `page`, `size`, `search`, `status` | Danh sách nhân viên | Manager |
| Tạo nhân viên | POST | `/api/staff` | Tên, email, phone, role | Tài khoản nhân viên | Manager |
| Sửa/xóa nhân viên | PUT/DELETE | `/api/staff/{id}` | Staff hoặc ID | Staff/response rỗng | Manager |
| Reset mật khẩu | POST | `/api/staff/{id}/password-reset` | Chưa xác định | Trạng thái gửi reset | Manager |
| Dashboard | GET | `/api/reports/dashboard` | Khoảng thời gian | Tổng quan | Manager |
| Báo cáo chi tiết | GET | `/api/reports/{type}` | `from`, `to`, bộ lọc, phân trang | Dữ liệu báo cáo | Manager |
| Xuất báo cáo | GET | `/api/reports/{type}/export` | Bộ lọc | File tải xuống | Manager |

## Cần thống nhất với BE

- TODO: Staff có được xóa khách hàng hay chỉ khóa tài khoản.
- TODO: Tạo Staff phải đồng thời tạo credential đăng nhập, không tách thành hai danh sách như mock hiện tại.
- TODO: Quy trình reset mật khẩu qua email, link hết hạn hoặc mật khẩu tạm.
- TODO: Công thức doanh thu, đơn hợp lệ và múi giờ báo cáo.
- TODO: Định dạng file export và giới hạn khoảng thời gian.
