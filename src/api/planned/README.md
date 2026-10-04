# Hợp đồng API dự kiến

Các tài liệu trong thư mục này được suy ra từ chức năng frontend hiện có. Đây không phải API đang hoạt động và chưa được backend xác nhận.

Quy ước URL tạm dùng prefix `/api` vì endpoint duy nhất hiện có là `/api/health`. Không sử dụng `/api/v1` khi backend chưa quyết định versioning.

Trước khi triển khai, BE và FE phải chốt:

- Cấu trúc response và error chung.
- Cơ chế authentication: JWT, cookie session hoặc phương án khác.
- Phân quyền `Customer`, `Staff`, `Manager`.
- Kiểu ID và định dạng thời gian.
- Phân trang, lọc và sắp xếp.
- Upload file/ảnh.
- Tên và giá trị trạng thái đơn hàng/diễn đàn.
