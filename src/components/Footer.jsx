import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, X } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { isValidEmail } from '../utils/validators';

const policiesData = {
  shipping: {
    title: "CHÍNH SÁCH GIAO HÀNG",
    content: (
      <div className="space-y-4">
        <p>Nhằm mang đến sự thuận tiện cho khách hàng, chúng tôi cung cấp dịch vụ giao hàng nhanh chóng và an toàn đối với tất cả các đơn hàng trên website.</p>
        
        <h4 className="font-semibold text-white text-lg mt-6">Thời gian giao hàng</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><span className="text-white font-medium">Nội thành:</span> từ 1 - 2 ngày làm việc.</li>
          <li><span className="text-white font-medium">Các tỉnh, thành phố khác:</span> từ 2 - 5 ngày làm việc.</li>
          <li>Đối với khu vực vùng sâu, vùng xa hoặc các trường hợp bất khả kháng (thời tiết, thiên tai...), thời gian giao hàng có thể kéo dài hơn dự kiến.</li>
        </ul>
        
        <h4 className="font-semibold text-white text-lg mt-6">Phí vận chuyển</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>Miễn phí vận chuyển đối với các đơn hàng đạt giá trị theo chương trình khuyến mãi của cửa hàng.</li>
          <li>Đối với các đơn hàng còn lại, phí vận chuyển sẽ được tính theo đơn vị vận chuyển và thông báo trước khi khách hàng xác nhận đặt hàng.</li>
        </ul>
        
        <h4 className="font-semibold text-white text-lg mt-6">Khi nhận hàng</h4>
        <p>Khách hàng vui lòng kiểm tra:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Đúng sản phẩm đã đặt.</li>
          <li>Đúng số lượng.</li>
          <li>Bao bì còn nguyên vẹn, không rách hoặc móp méo.</li>
        </ul>
        <p className="mt-4 italic">Nếu phát hiện hàng hóa bị hư hỏng, thiếu sản phẩm hoặc giao sai đơn hàng, vui lòng liên hệ ngay với chúng tôi để được hỗ trợ xử lý trong thời gian sớm nhất.</p>
      </div>
    )
  },
  return: {
    title: "CHÍNH SÁCH ĐỔI TRẢ",
    content: (
      <div className="space-y-4">
        <p>Chúng tôi luôn mong muốn mang đến cho khách hàng những sản phẩm chất lượng và đúng nhu cầu sử dụng.</p>
        
        <h4 className="font-semibold text-white text-lg mt-6">Điều kiện đổi trả</h4>
        <p>Khách hàng có thể yêu cầu đổi hoặc trả sản phẩm trong các trường hợp:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Giao sai sản phẩm so với đơn đặt hàng.</li>
          <li>Sản phẩm bị lỗi từ nhà sản xuất.</li>
          <li>Hàng hóa bị hư hỏng trong quá trình vận chuyển.</li>
        </ul>
        
        <h4 className="font-semibold text-white text-lg mt-6">Thời gian đổi trả</h4>
        <p>Yêu cầu đổi trả được tiếp nhận trong vòng <span className="text-primary font-medium">07 ngày</span> kể từ ngày khách hàng nhận hàng.</p>
        
        <h4 className="font-semibold text-white text-lg mt-6">Trường hợp không áp dụng</h4>
        <p>Chúng tôi không hỗ trợ đổi trả đối với:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Sản phẩm đã qua sử dụng.</li>
          <li>Bao bì, tem niêm phong không còn nguyên vẹn.</li>
          <li>Hàng hóa bị hư hỏng do lỗi từ phía khách hàng.</li>
          <li>Yêu cầu đổi trả sau thời gian quy định.</li>
        </ul>
        
        <h4 className="font-semibold text-white text-lg mt-6">Quy trình đổi trả</h4>
        <p>Khách hàng vui lòng liên hệ bộ phận chăm sóc khách hàng, cung cấp mã đơn hàng và hình ảnh sản phẩm để được hướng dẫn xử lý.</p>
      </div>
    )
  },
  privacy: {
    title: "CHÍNH SÁCH BẢO MẬT THÔNG TIN",
    content: (
      <div className="space-y-4">
        <p>Chúng tôi cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng khi mua sắm trên website.</p>
        
        <h4 className="font-semibold text-white text-lg mt-6">Thông tin khách hàng được thu thập bao gồm:</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>Họ và tên.</li>
          <li>Số điện thoại.</li>
          <li>Địa chỉ giao hàng.</li>
          <li>Email (nếu có).</li>
        </ul>
        
        <h4 className="font-semibold text-white text-lg mt-6">Thông tin chỉ được sử dụng nhằm:</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>Xử lý đơn hàng.</li>
          <li>Giao hàng.</li>
          <li>Liên hệ hỗ trợ khách hàng.</li>
          <li>Gửi thông tin khuyến mãi khi khách hàng đồng ý.</li>
        </ul>
        
        <h4 className="font-semibold text-white text-lg mt-6">Chúng tôi cam kết:</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>Không mua bán hoặc chia sẻ thông tin khách hàng cho bên thứ ba.</li>
          <li>Chỉ cung cấp thông tin khi có yêu cầu từ cơ quan nhà nước có thẩm quyền theo quy định của pháp luật.</li>
          <li>Áp dụng các biện pháp bảo mật nhằm đảm bảo an toàn dữ liệu khách hàng.</li>
        </ul>
      </div>
    )
  },
  guide: {
    title: "HƯỚNG DẪN MUA HÀNG",
    content: (
      <div className="space-y-4">
        <div className="flex gap-4 items-start">
          <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold">1</div>
          <div>
            <h4 className="font-semibold text-white text-lg">Chọn sản phẩm</h4>
            <p className="mt-1">Chọn sản phẩm cần mua và nhấn "Thêm vào giỏ hàng".</p>
          </div>
        </div>
        
        <div className="flex gap-4 items-start mt-4">
          <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold">2</div>
          <div>
            <h4 className="font-semibold text-white text-lg">Kiểm tra giỏ hàng</h4>
            <p className="mt-1">Kiểm tra giỏ hàng, cập nhật số lượng nếu cần rồi chọn "Tiến hành thanh toán".</p>
          </div>
        </div>
        
        <div className="flex gap-4 items-start mt-4">
          <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold">3</div>
          <div>
            <h4 className="font-semibold text-white text-lg">Điền thông tin</h4>
            <p className="mt-1 mb-2">Điền đầy đủ thông tin:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Họ và tên.</li>
              <li>Số điện thoại.</li>
              <li>Địa chỉ nhận hàng.</li>
              <li>Ghi chú (nếu có).</li>
            </ul>
          </div>
        </div>
        
        <div className="flex gap-4 items-start mt-4">
          <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold">4</div>
          <div>
            <h4 className="font-semibold text-white text-lg">Chọn phương thức thanh toán</h4>
            <p className="mt-1 mb-2">Lựa chọn phương thức thanh toán phù hợp:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Thanh toán khi nhận hàng (COD).</li>
              <li>Chuyển khoản ngân hàng.</li>
            </ul>
          </div>
        </div>
        
        <div className="flex gap-4 items-start mt-4">
          <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold">5</div>
          <div>
            <h4 className="font-semibold text-white text-lg">Xác nhận</h4>
            <p className="mt-1">Xác nhận đặt hàng.</p>
          </div>
        </div>
        
        <p className="mt-6 italic border-l-4 border-primary pl-4">Sau khi nhận được đơn hàng, nhân viên sẽ liên hệ để xác nhận thông tin và tiến hành giao hàng trong thời gian sớm nhất.</p>
        
        <div className="bg-gray-800/80 p-5 rounded-lg mt-8 border border-red-500/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          <h4 className="font-semibold mb-3 text-red-400 text-lg uppercase">Lưu ý quan trọng</h4>
          <p className="mb-2 font-medium">Đối với thuốc bảo vệ thực vật, khách hàng cần:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Đọc kỹ hướng dẫn sử dụng trước khi dùng.</li>
            <li>Sử dụng đúng liều lượng theo khuyến cáo của nhà sản xuất.</li>
            <li>Mang đầy đủ đồ bảo hộ khi pha và phun thuốc.</li>
            <li>Bảo quản sản phẩm nơi khô ráo, thoáng mát, tránh xa trẻ em và nguồn thực phẩm.</li>
          </ul>
        </div>
      </div>
    )
  }
};

const Footer = () => {
  const [activePolicy, setActivePolicy] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { showNotification } = useNotification();

  const handlePolicyClick = (e, policyKey) => {
    e.preventDefault();
    setActivePolicy(activePolicy === policyKey ? null : policyKey);
    // Smooth scroll to the bottom of the page
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t-[6px] border-primary">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <Link to="/" className="inline-block mb-4">
            <h2 className="text-3xl font-bold text-white tracking-tight">Yggdrasil</h2>
            <p className="text-primary-light uppercase tracking-widest text-xs mt-1">Nông nghiệp xanh</p>
          </Link>
          <p className="text-sm leading-relaxed mb-6">
            Yggdrasil - Nơi sự sống vươn mình mạnh mẽ. Chuyên cung cấp các loại phân bón, thuốc bảo vệ thực vật và hạt giống chất lượng cao cho nhà nông, hướng tới nền nông nghiệp bền vững.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-xs font-bold">
              FB
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-xs font-bold">
              IG
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-xs font-bold">
              TW
            </a>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-primary">
            Liên Hệ
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin size={20} className="text-primary shrink-0 mt-0.5" />
              <span className="text-sm">123 Đường Nông Nghiệp, Quận 1, TP.HCM</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={20} className="text-primary shrink-0" />
              <span className="text-sm font-semibold text-white">08357757501</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={20} className="text-primary shrink-0" />
              <span className="text-sm">hotro@yggdrasil.vn</span>
            </li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-6 relative inline-block after:content-[''] after:-bottom-2 after:absolute after:left-0 after:w-12 after:h-1 after:bg-primary">
            Chính Sách
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a 
                href="#" 
                onClick={(e) => handlePolicyClick(e, 'shipping')} 
                className={`hover:text-primary transition-colors flex items-center gap-2 ${activePolicy === 'shipping' ? 'text-primary font-medium' : ''}`}
              >
                <span className={`w-1 h-1 rounded-full ${activePolicy === 'shipping' ? 'bg-primary' : 'bg-gray-500'}`}></span> 
                Chính sách giao hàng
              </a>
            </li>
            <li>
              <a 
                href="#" 
                onClick={(e) => handlePolicyClick(e, 'return')} 
                className={`hover:text-primary transition-colors flex items-center gap-2 ${activePolicy === 'return' ? 'text-primary font-medium' : ''}`}
              >
                <span className={`w-1 h-1 rounded-full ${activePolicy === 'return' ? 'bg-primary' : 'bg-gray-500'}`}></span> 
                Chính sách đổi trả
              </a>
            </li>
            <li>
              <a 
                href="#" 
                onClick={(e) => handlePolicyClick(e, 'privacy')} 
                className={`hover:text-primary transition-colors flex items-center gap-2 ${activePolicy === 'privacy' ? 'text-primary font-medium' : ''}`}
              >
                <span className={`w-1 h-1 rounded-full ${activePolicy === 'privacy' ? 'bg-primary' : 'bg-gray-500'}`}></span> 
                Bảo mật thông tin
              </a>
            </li>
            <li>
              <a 
                href="#" 
                onClick={(e) => handlePolicyClick(e, 'guide')} 
                className={`hover:text-primary transition-colors flex items-center gap-2 ${activePolicy === 'guide' ? 'text-primary font-medium' : ''}`}
              >
                <span className={`w-1 h-1 rounded-full ${activePolicy === 'guide' ? 'bg-primary' : 'bg-gray-500'}`}></span> 
                Hướng dẫn mua hàng
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-6 relative inline-block after:content-[''] after:-bottom-2 after:absolute after:left-0 after:w-12 after:h-1 after:bg-primary">
            Đăng Ký Nhận Tin
          </h3>
          <p className="text-sm mb-4">Nhận ngay ưu đãi giảm 10% cho đơn hàng đầu tiên và cập nhật cẩm nang nông nghiệp mới nhất.</p>
          <form className="flex" onSubmit={(e) => {
            e.preventDefault();
            if (!isValidEmail(newsletterEmail)) {
              showNotification({ type: 'error', message: 'Vui lòng nhập địa chỉ email hợp lệ.' });
              return;
            }
            showNotification({ type: 'success', message: 'Đăng ký nhận tin thành công!' });
            setNewsletterEmail('');
          }}>
            <input 
              type="email" 
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              onBlur={(e) => {
                if (e.target.value && !isValidEmail(e.target.value)) {
                  showNotification({ type: 'error', message: 'Vui lòng nhập địa chỉ email hợp lệ.' });
                }
              }}
              placeholder="Email của bạn..." 
              className="bg-gray-800 text-white px-4 py-3 rounded-l-md w-full outline-none focus:ring-1 focus:ring-primary"
              required
            />
            <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-5 rounded-r-md transition-colors font-medium">
              Gửi
            </button>
          </form>
        </div>
        
      </div>
      
      {/* Active Policy Content */}
      {activePolicy && (
        <div className="max-w-7xl mx-auto px-4 mt-12 animate-fade-in">
          <div className="bg-gray-800 rounded-xl p-6 md:p-8 border border-gray-700 relative shadow-xl">
            <button 
              onClick={() => setActivePolicy(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-full p-1 transition-colors"
              title="Đóng"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl font-bold text-primary mb-6 border-b border-gray-700 pb-4 inline-block">{policiesData[activePolicy].title}</h3>
            <div className="text-gray-300 text-sm md:text-base leading-relaxed policy-content">
              {policiesData[activePolicy].content}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Yggdrasil. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

