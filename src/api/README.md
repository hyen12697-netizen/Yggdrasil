# Lớp kết nối API của frontend

Thư mục này là nơi duy nhất dành cho các hàm HTTP từ React đến backend. UI, router và các context hiện tại chưa được chuyển sang API để giữ nguyên luồng demo bằng `localStorage`.

## Cấu hình

Sao chép `.env.example` thành `.env.local` và chỉnh URL theo môi trường:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Vite chỉ đưa các biến bắt đầu bằng `VITE_` vào frontend. Không đặt mật khẩu database, JWT secret hoặc bí mật khác trong các biến này.

Hiện `http://localhost:5000` là Express mẫu trong `server/server.js`. Spring Boot chưa khai báo controller và cũng chưa có API prefix. Khi nhóm chọn Spring Boot làm backend chính, cần đổi `VITE_API_BASE_URL` sang địa chỉ Spring Boot; không cần sửa URL trong từng component.

## Sử dụng

`apiRequest` hỗ trợ query params, request JSON, response rỗng, response JSON hoặc text, hủy request qua `AbortSignal`, và lỗi HTTP có status code. Response thành công được trả nguyên cấu trúc của backend, không bọc thêm trong `data`.

```jsx
import { useEffect, useState } from 'react';
import { ApiError, getApiHealth } from './api';

function ApiStatus() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    getApiHealth({ signal: controller.signal })
      .then(setStatus)
      .catch((error) => {
        if (error instanceof ApiError) {
          console.error(error.status, error.message, error.data);
        }
      });

    return () => controller.abort();
  }, []);

  return <pre>{JSON.stringify(status, null, 2)}</pre>;
}
```

Không có token interceptor vì repository chưa có quy ước xác thực từ backend. Khi BE chốt JWT hoặc cookie session, nhóm cần thống nhất cách lưu và gửi token trước khi thay đổi `client.js`.

## API đã tồn tại trong source

| Nghiệp vụ | Hàm FE | Method | Endpoint | Xác thực | Tình trạng BE | File nguồn đối chiếu | Việc còn thiếu |
|---|---|---|---|---|---|---|---|
| Kiểm tra máy chủ Express | `getApiHealth` | GET | `/api/health` | Không | Đã mount, trả JSON `{ status, message }`; chưa kiểm thử kết nối trong lần thay đổi này | [`server/server.js`](../../server/server.js) | Chọn backend chính; nếu dùng Spring Boot thì triển khai endpoint tương ứng hoặc bỏ health server Express |

Spring Boot hiện chỉ có entity và config. Không có controller, service hay repository, vì vậy không có endpoint Spring nào được liệt kê như API đang hoạt động. Entity không được xem là bằng chứng của endpoint.

## API dự kiến

Các hợp đồng dưới `planned/` là **đề xuất chưa được backend xác nhận**:

- [`planned/auth.md`](planned/auth.md): tài khoản và xác thực.
- [`planned/catalog.md`](planned/catalog.md): sản phẩm, danh mục và thương hiệu.
- [`planned/orders.md`](planned/orders.md): giỏ hàng phía client và đơn hàng.
- [`planned/forum.md`](planned/forum.md): bài viết, bình luận và báo cáo.
- [`planned/content-marketing.md`](planned/content-marketing.md): tin tức, cẩm nang, banner, khuyến mãi và thông báo.
- [`planned/administration.md`](planned/administration.md): khách hàng, nhân viên và báo cáo.

Không import tài liệu hoặc tạo hàm gọi các endpoint này trong luồng chạy hiện tại.

## Chuyển một API từ `planned/` sang module chính

1. BE triển khai và mount controller thật.
2. Xác nhận method, URL, request, response, lỗi và quyền bằng code BE hoặc tài liệu API đã cập nhật.
3. Kiểm thử endpoint bằng request chỉ đọc hoặc môi trường phát triển.
4. Tạo module nghiệp vụ tại `src/api`, ví dụ `products.js`.
5. Gọi `apiRequest` trong module đó và export qua `index.js`.
6. Cập nhật bảng “API đã tồn tại” phía trên.
7. Chỉ sau đó mới chuyển context hoặc trang React từ mock data sang hàm API.
