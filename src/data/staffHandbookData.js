export const staffHandbookData = [
  {
    id: 'order-processing',
    title: 'Quy trình xử lý đơn hàng',
    icon: 'Package',
    content: `
      <h3>1. Tiếp nhận đơn hàng mới</h3>
      <p>Khi có đơn hàng mới chuyển sang trạng thái "Chờ xác nhận", nhân viên cần kiểm tra kỹ các thông tin: họ tên, số điện thoại, địa chỉ nhận hàng và danh sách sản phẩm.</p>
      <h3>2. Xác nhận với khách hàng</h3>
      <p>Gọi điện thoại cho khách hàng theo số điện thoại đã cung cấp để xác nhận lại đơn hàng. Xác nhận lại các sản phẩm, tổng tiền, phí ship và thời gian giao hàng dự kiến.</p>
      <h3>3. Đóng gói và giao hàng</h3>
      <p>Chuyển đơn hàng sang trạng thái "Đang giao" và in phiếu xuất kho. Bàn giao cho đơn vị vận chuyển đối tác. Đảm bảo đóng gói cẩn thận đối với hàng dễ vỡ hoặc chất lỏng.</p>
      <h3>4. Theo dõi và hoàn tất</h3>
      <p>Theo dõi quá trình vận chuyển. Khi khách hàng đã nhận được hàng và thanh toán (nếu là COD), chuyển trạng thái đơn hàng sang "Hoàn thành".</p>
    `
  },
  {
    id: 'post-moderation',
    title: 'Quy trình duyệt bài đăng',
    icon: 'MessageSquare',
    content: `
      <h3>1. Tiêu chí duyệt bài</h3>
      <p>Bài đăng trên diễn đàn cần đảm bảo: không chứa ngôn từ kích động, đả kích; không quảng cáo sản phẩm của đối thủ; hình ảnh phải rõ nét, lịch sự; nội dung phải liên quan đến nông nghiệp, cây trồng, vật nuôi hoặc sản phẩm công ty.</p>
      <h3>2. Xử lý bài vi phạm</h3>
      <p>Nếu bài đăng vi phạm nhẹ: Ẩn bài đăng và gửi thông báo nhắc nhở đến người dùng. Nếu vi phạm nặng (lừa đảo, chửi thề liên tục): Khóa tài khoản người dùng và xóa bài viết ngay lập tức.</p>
      <h3>3. Khuyến khích bài viết chất lượng</h3>
      <p>Đối với các bài chia sẻ kinh nghiệm hay, hướng dẫn chi tiết, nhân viên có thể ghim bài lên đầu diễn đàn hoặc thả biểu tượng "Hữu ích" để tăng độ uy tín cho tác giả.</p>
    `
  },
  {
    id: 'customer-complaints',
    title: 'Hướng dẫn xử lý khiếu nại',
    icon: 'AlertCircle',
    content: `
      <h3>1. Lắng nghe và ghi nhận</h3>
      <p>Luôn giữ thái độ bình tĩnh, lịch sự và chuyên nghiệp. Lắng nghe toàn bộ vấn đề của khách hàng mà không ngắt lời. Ghi nhận chính xác mã đơn hàng hoặc vấn đề đang gặp phải.</p>
      <h3>2. Đề xuất phương án giải quyết</h3>
      <p>- <strong>Hàng lỗi/hư hỏng do vận chuyển:</strong> Yêu cầu khách cung cấp video/hình ảnh mở hàng. Tiến hành gửi bù hàng mới hoặc hoàn tiền theo yêu cầu khách hàng.</p>
      <p>- <strong>Giao sai sản phẩm:</strong> Giao lại đúng sản phẩm và thu hồi sản phẩm giao sai (chi phí vận chuyển do công ty chịu).</p>
      <h3>3. Theo dõi sau xử lý</h3>
      <p>Liên hệ lại với khách hàng sau 3-5 ngày để đảm bảo họ đã hài lòng với cách giải quyết và sản phẩm thay thế.</p>
    `
  },
  {
    id: 'account-rules',
    title: 'Quy định về tài khoản',
    icon: 'Users',
    content: `
      <h3>1. Quyền hạn của Staff</h3>
      <p>Tài khoản Staff chỉ được phép quản lý đơn hàng, xem danh sách khách hàng (không có quyền xóa tài khoản khách), và quản lý diễn đàn. Mọi thao tác cấu hình hệ thống, quản lý doanh thu hoặc thêm/xóa sản phẩm thuộc về quyền của Manager/Admin.</p>
      <h3>2. Bảo mật thông tin</h3>
      <p>Nghiêm cấm việc tiết lộ thông tin cá nhân của khách hàng (số điện thoại, địa chỉ, lịch sử mua hàng) cho bất kỳ bên thứ 3 nào khi chưa có sự cho phép của cấp quản lý.</p>
      <h3>3. Quy định sử dụng tài khoản</h3>
      <p>Không cho mượn tài khoản nội bộ. Mọi hoạt động được thực hiện dưới tài khoản Staff sẽ được lưu lại trong lịch sử hệ thống (System Logs).</p>
    `
  },
  {
    id: 'faq',
    title: 'Các câu hỏi thường gặp (FAQ)',
    icon: 'HelpCircle',
    content: `
      <h3>1. Làm sao để đổi mật khẩu tài khoản nội bộ?</h3>
      <p>Bạn có thể đổi mật khẩu tại mục Cài đặt > Hồ sơ cá nhân. Nếu quên mật khẩu, hãy liên hệ IT Support hoặc Quản lý trực tiếp để được reset mật khẩu.</p>
      <h3>2. Tôi có thể tự thêm danh mục sản phẩm mới không?</h3>
      <p>Không. Chức năng quản lý sản phẩm và danh mục chỉ hiển thị đối với tài khoản cấp Manager trở lên. Nếu bạn thấy thiếu danh mục, hãy đề xuất lên quản lý.</p>
      <h3>3. Nếu hệ thống báo lỗi 500 khi tôi duyệt bài thì làm thế nào?</h3>
      <p>Chụp ảnh màn hình lỗi, ghi nhớ mã bài viết (Post ID) và gửi ngay cho bộ phận kỹ thuật để kiểm tra. Trong thời gian chờ, không bấm F5 liên tục để tránh spam server.</p>
    `
  }
];
