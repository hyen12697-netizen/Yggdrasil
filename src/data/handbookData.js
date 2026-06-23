// Dữ liệu Cẩm nang Nông nghiệp Yggdrasil
// Được tổng hợp và biên soạn từ các nguồn uy tín:
// - Bộ Nông nghiệp & Phát triển Nông thôn Việt Nam
// - Trung tâm Khuyến nông Quốc gia
// - Viện Khoa học Nông nghiệp Việt Nam
// - Tài liệu kỹ thuật từ Yara, Bình Điền, Phú Mỹ, Đầu Trâu.

export const handbookCategories = [
  { id: 'kien-thuc-cay-trong', name: 'Kiến thức cây trồng' },
  { id: 'kien-thuc-phan-bon', name: 'Kiến thức phân bón' },
  { id: 'thuoc-bao-ve-thuc-vat', name: 'Thuốc bảo vệ thực vật' },
  { id: 'phong-tru-sau-benh', name: 'Phòng trừ sâu bệnh' },
  { id: 'ky-thuat-canh-tac', name: 'Kỹ thuật canh tác' }
];

export const handbookArticles = [
  // ==========================================
  // I. KIẾN THỨC CÂY TRỒNG (14 bài viết)
  // ==========================================
  {
    id: 1,
    slug: 'cay-lua',
    title: 'Kỹ thuật chăm sóc cây lúa nước đạt năng suất cao',
    category: 'Kiến thức cây trồng',
    categorySlug: 'kien-thuc-cay-trong',
    publishDate: '2026-06-20',
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=800',
    summary: 'Hướng dẫn chi tiết từ đặc điểm sinh học, điều kiện sinh trưởng đến nhu cầu dinh dưỡng và lưu ý chăm sóc cây lúa nước.',
    sources: ['Trung tâm Khuyến nông Quốc gia', 'Viện Khoa học Nông nghiệp Việt Nam'],
    content: {
      sections: [
        {
          title: '1. Đặc điểm sinh học',
          text: 'Cây lúa (Oryza sativa) thuộc họ Hòa thảo, là cây thân thảo ngắn ngày. Bộ rễ của lúa là rễ chùm phát triển mạnh ở lớp đất mặt từ 0 - 20cm. Thân lúa gồm nhiều lóng rỗng kết nối bằng mắt thân chắc chắn. Lá lúa thuôn dài, song song. Hoa lúa lưỡng tính, tự thụ phấn để tạo thành hạt thóc.'
        },
        {
          title: '2. Điều kiện sinh trưởng tối ưu',
          text: 'Lúa ưa khí hậu nhiệt đới ẩm ấm áp. Nhiệt độ tối thích từ 25 - 32 độ C. Cần ánh sáng dồi dào để cây quang hợp tạo chất khô. Đất trồng thích hợp nhất là đất thịt, đất sét hoặc đất phù sa giữ nước tốt, độ pH lý tưởng từ 5.5 - 6.5.'
        },
        {
          title: '3. Nhu cầu dinh dưỡng',
          text: 'Lúa cần ba nguyên tố đa lượng quan trọng: Đạm (N) kích thích đẻ nhánh và phát triển phiến lá; Lân (P) kích rễ ăn sâu và hình thành mầm hoa; Kali (K) hỗ trợ cứng cây, chống đổ ngã và tăng tỷ lệ chắc hạt. Ngoài ra cần trung vi lượng như Silic (tăng sức đề kháng nấm bệnh) và Kẽm.'
        },
        {
          title: '4. Các giai đoạn phát triển chính',
          text: 'Chu kỳ sinh trưởng của cây lúa gồm 4 thời kỳ chính: \n- Giai đoạn mạ (gieo sạ đến khi có 3-4 lá)\n- Giai đoạn đẻ nhánh (quyết định số bông trên mét vuông)\n- Giai đoạn làm đòng (hình thành bông lúa non bên trong bẹ lá)\n- Giai đoạn trổ chín (phơi màu thụ phấn, ngậm sữa và chín hạt).'
        },
        {
          title: '5. Lưu ý quan trọng khi chăm sóc',
          text: 'Thực hiện tưới nước thông minh theo phương pháp "Ngập - Lộ - Phơi luân phiên" để tiết kiệm nước và giúp rễ lúa ăn sâu vào đất. Bón phân đón đòng đúng thời điểm khi đòng lúa có kích thước 1-2mm (nhú bông gòn). Quản lý cỏ dại và kiểm tra ruộng thường xuyên để phát hiện sớm rầy nâu, sâu cuốn lá.'
        }
      ]
    }
  },
  {
    id: 2,
    slug: 'cay-ca-phe',
    title: 'Kỹ thuật canh tác cây cà phê bền vững tại Tây Nguyên',
    category: 'Kiến thức cây trồng',
    categorySlug: 'kien-thuc-cay-trong',
    publishDate: '2026-06-18',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
    summary: 'Tổng hợp quy trình kỹ thuật canh tác cà phê Robusta và Arabica đạt năng suất ổn định, phòng tránh suy kiệt đất vườn.',
    sources: ['Viện Khoa học Kỹ thuật Nông Lâm nghiệp Tây Nguyên (WASI)'],
    content: {
      sections: [
        {
          title: '1. Đặc điểm sinh học',
          text: 'Cây cà phê thuộc họ Thiến thảo (Rubiaceae). Thân gỗ nhỏ, cao từ 3-5m nếu không hãm ngọn. Bộ rễ gồm rễ cọc đâm sâu 1-2m giữ cây và rễ ngang phân bố ở tầng mặt từ 0-30cm làm nhiệm vụ hút nước, hút dinh dưỡng. Quả cà phê là quả hạch, khi chín chuyển sang màu đỏ mọng.'
        },
        {
          title: '2. Điều kiện sinh trưởng tối ưu',
          text: 'Cà phê Robusta (chè) ưa khí hậu nóng ẩm, độ cao dưới 800m. Cà phê Arabica (vối) ưa mát mẻ, độ cao trên 1000m. Lượng mưa cần thiết từ 1500 - 2000mm phân bố theo mùa. Đất trồng lý tưởng là đất đỏ bazan tơi xốp, tầng canh tác sâu trên 70cm, pH từ 5.0 - 6.0.'
        },
        {
          title: '3. Nhu cầu dinh dưỡng',
          text: 'Cây cà phê có nhu cầu dinh dưỡng cao và liên tục. Đạm và Kali cần lượng tương đương nhau để phát triển cành dự trữ cho vụ sau và nuôi quả lớn chắc nhân. Lân cực kỳ cần thiết cho giai đoạn phân hóa mầm hoa và kích hoạt rễ sau mùa khô. Ngoài ra cần bổ sung Magie, Canxi, kẽm, bo định kỳ để hạn chế rụng quả.'
        },
        {
          title: '4. Các giai đoạn phát triển chính',
          text: 'Chu kỳ năm của cà phê kinh doanh bao gồm:\n- Giai đoạn phân hóa mầm hoa (trong mùa khô)\n- Giai đoạn nở hoa & thụ phấn (sau các đợt tưới nước mùa khô)\n- Giai đoạn nuôi quả lớn (trong mùa mưa)\n- Giai đoạn thu hoạch hạt & phục hồi cây sau thu hoạch.'
        },
        {
          title: '5. Lưu ý quan trọng khi chăm sóc',
          text: 'Cần cắt tỉa cành vô hiệu, cành tăm rủ, cành sâu bệnh sau mỗi mùa thu hoạch để tạo độ thông thoáng. Ép nước tạo hạn hạn sinh lý vào mùa khô để cây phân hóa mầm hoa tốt, sau đó tưới đẫm tạo cú hích giúp hoa nở đồng loạt. Thiết lập cây che bóng (như muồng đen, sầu riêng) để điều hòa ánh sáng.'
        }
      ]
    }
  },
  {
    id: 3,
    slug: 'cay-ho-tieu',
    title: 'Kỹ thuật chăm sóc dây hồ tiêu phòng tránh bệnh hại rễ',
    category: 'Kiến thức cây trồng',
    categorySlug: 'kien-thuc-cay-trong',
    publishDate: '2026-06-15',
    image: 'https://images.unsplash.com/photo-1626202378252-87c126ec3ec0?auto=format&fit=crop&q=80&w=800',
    summary: 'Phương pháp trồng tiêu trên trụ sống, bón phân hữu cơ vi sinh và thiết kế hệ thống thoát nước ngăn ngừa nấm bệnh.',
    sources: ['Bộ Nông nghiệp & Phát triển Nông thôn', 'Viện Khoa học Nông nghiệp Việt Nam'],
    content: {
      sections: [
        {
          title: '1. Đặc điểm sinh học',
          text: 'Hồ tiêu (Piper nigrum) là loại dây leo thân cuốn bám vào vật đỡ (trụ lèo). Thân tiêu chia thành nhiều đốt, ở mỗi khớp đốt có rễ bám giúp bám chắc vào trụ gỗ hoặc trụ xây. Lá đơn hình tim xanh bóng. Hoa tự mọc thành chùm dài 7-15cm chứa hàng chục hoa nhỏ.'
        },
        {
          title: '2. Điều kiện sinh trưởng tối ưu',
          text: 'Tiêu ưa điều kiện nóng ẩm, nhiệt độ lý tưởng từ 22 - 30 độ C. Rất nhạy cảm với tình trạng úng nước ở vùng rễ. Ưa ánh sáng tán xạ nhẹ nên rất thích hợp trồng xen hoặc bò trên thân trụ sống (cây keo giậu, cây muồng). Yêu cầu đất thoát nước nhanh, tơi xốp, pH 5.5 - 6.5.'
        },
        {
          title: '3. Nhu cầu dinh dưỡng',
          text: 'Cây tiêu cần lượng phân hữu cơ lớn hàng năm để giữ ẩm đất và làm tơi xốp. NPK bón theo tỷ lệ cân đối, cần tăng cường Kali khi chuỗi quả đang lớn để chắc hạt, hạn chế rụng quả sinh lý. Bổ sung Canxi, Silic giúp tế bào thân vỏ chắc khỏe, chống chịu sâu bệnh tốt hơn.'
        },
        {
          title: '4. Các giai đoạn phát triển chính',
          text: '- Giai đoạn kiến thiết cơ bản (năm 1 đến năm 3, tập trung leo trụ và phát cành khung)\n- Giai đoạn kinh doanh phát hoa (bắt đầu mùa mưa, thụ phấn nhờ nước mưa)\n- Giai đoạn nuôi quả lớn (tháng 6 đến tháng 11)\n- Giai đoạn thu hoạch hạt tiêu chín và dưỡng dây (tháng 12 đến tháng 3 năm sau).'
        },
        {
          title: '5. Lưu ý quan trọng khi chăm sóc',
          text: 'Bắt buộc phải xẻ rãnh thoát nước sâu giữa các hàng tiêu vào mùa mưa để ngăn ngừa hiện tượng úng gốc. Tuyệt đối không xới xáo đất sát gốc làm đứt rễ non, tạo đường xâm nhập cho nấm Phytophthora gây bệnh chết nhanh chết chậm. Ưu tiên bón phân hữu cơ hoai mục kết hợp nấm Trichoderma đối kháng.'
        }
      ]
    }
  },
  {
    id: 4,
    slug: 'cay-cao-su',
    title: 'Kỹ thuật chăm sóc và cạo mủ cao su đúng kỹ thuật',
    category: 'Kiến thức cây trồng',
    categorySlug: 'kien-thuc-cay-trong',
    publishDate: '2026-06-12',
    image: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&q=80&w=800',
    summary: 'Cách bón phân và duy trì vườn cao su kiến thiết, quy trình cạo mủ đúng độ sâu hạn chế phạm gỗ thân.',
    sources: ['Tập đoàn Công nghiệp Cao su Việt Nam'],
    content: {
      sections: [
        {
          title: '1. Đặc điểm sinh học',
          text: 'Cây cao su (Hevea brasiliensis) là cây thân gỗ lớn có tuổi thọ kinh tế từ 25-30 năm. Rễ cọc phát triển cắm sâu 2-4m hấp thu mạch nước ngầm và giữ cây vững chắc. Hệ thống mạch mủ nằm ở lớp vỏ cây chứa chất latex trắng đục. Lá kép chân vịt gồm 3 lá chét.'
        },
        {
          title: '2. Điều kiện sinh trưởng tối ưu',
          text: 'Cây ưa khí hậu nhiệt đới gió mùa nóng ẩm, lượng mưa lớn trên 1800mm. Nhiệt độ tối thích 25-30 độ C. Thích nghi được trên nhiều loại đất như đất bazan, đất xám bạc màu nhưng yêu cầu độ sâu tầng đất canh tác trên 1.5m không có đá vỉa cứng, pH từ 4.5 - 5.5.'
        },
        {
          title: '3. Nhu cầu dinh dưỡng',
          text: 'Thời kỳ kiến thiết cơ bản cần đạm và lân cao để kích thích cây tăng chiều cao và chu vi thân. Thời kỳ khai thác mủ cần bổ sung kali để kéo dài thời gian chảy mủ, tăng hàm lượng cao su khô (DRC) và giúp phục hồi vỏ tái sinh.'
        },
        {
          title: '4. Các giai đoạn phát triển chính',
          text: '- Giai đoạn kiến thiết cơ bản (từ khi trồng đến khi chu vi thân đạt 50cm ở độ cao 1m, kéo dài 6-7 năm)\n- Giai đoạn kinh doanh khai thác mủ (cạo mủ định kỳ suốt 20-25 năm)\n- Giai đoạn thanh lý lấy gỗ.'
        },
        {
          title: '5. Lưu ý quan trọng khi chăm sóc',
          text: 'Tuân thủ kỹ thuật cạo mủ đúng độ sâu cách tượng tầng (gỗ) khoảng 1 - 1.5mm, không được cạo phạm vào phần gỗ làm hình thành các u nần trên vỏ tái sinh. Nghỉ cạo mủ hoàn toàn trong thời gian cây rụng lá sinh lý vào mùa khô (thường từ tháng 2 đến tháng 4) để cây tích lũy năng lượng dưỡng da.'
        }
      ]
    }
  },
  {
    id: 5,
    slug: 'cay-sau-rieng',
    title: 'Kỹ thuật chăm sóc sầu riêng ra hoa đậu quả đồng đều',
    category: 'Kiến thức cây trồng',
    categorySlug: 'kien-thuc-cay-trong',
    publishDate: '2026-06-10',
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=800',
    summary: 'Chi tiết quy trình tạo cơi đọt, siết nước kích bông và dinh dưỡng nuôi trái sầu riêng ngon, tránh sượng cơm.',
    sources: ['Viện Cây ăn quả miền Nam (SOFRI)', 'Tài liệu hướng dẫn từ chuyên gia nông nghiệp ĐBSCL'],
    content: {
      sections: [
        {
          title: '1. Đặc điểm sinh học',
          text: 'Sầu riêng (Durio zibethinus) thuộc họ Gạo (Bombacaceae). Là cây thân gỗ lớn có cành ngang khỏe chịu lực tốt. Bộ rễ ăn sâu nhưng nhạy cảm cao với sự tích nước. Hoa lưỡng tính mọc thành chùm lớn trên thân gỗ hoặc cành lớn. Quả có vỏ dai, gai nhọn, phần thịt quả (cơm) thơm béo ngọt ngào.'
        },
        {
          title: '2. Điều kiện sinh trưởng tối ưu',
          text: 'Sầu riêng ưa nóng ẩm, nhiệt độ tối thích từ 24 - 30 độ C. Rất nhạy cảm với độ mặn và ngập úng đất rễ. Đất thích hợp là đất thịt pha cát, đất phù sa ven sông được đắp đê bao, đất bazan thoát nước hoàn hảo, pH từ 5.5 - 6.5.'
        },
        {
          title: '3. Nhu cầu dinh dưỡng',
          text: 'Dinh dưỡng của sầu riêng đòi hỏi sự tinh tế. Giai đoạn làm cơi đọt cần nhiều Đạm và Humic hữu cơ. Giai đoạn tạo mầm bông cần tăng Lân và Kali trắng (Kali sunfat). Thời kỳ nuôi quả cần Kali cao kết hợp Canxi - Bo để hạn chế rụng quả non và chống sượng quả, cháy múi quả.'
        },
        {
          title: '4. Các giai đoạn phát triển chính',
          text: '- Giai đoạn phục hồi và tạo cơi đọt mới sau thu hoạch (cần tối thiểu 2-3 cơi đọt khỏe mạnh)\n- Giai đoạn làm bông (siết nước đất cằn và phun lân tạo mầm)\n- Giai đoạn xổ nhụy và đậu quả non\n- Giai đoạn nuôi quả lớn (từ tuần thứ 4 đến tuần thứ 16)\n- Giai đoạn chín tự nhiên và thu hoạch.'
        },
        {
          title: '5. Lưu ý quan trọng khi chăm sóc',
          text: 'Siết nước (cắt nước) hoàn toàn từ 7 - 14 ngày để cây phân hóa mầm hoa rõ rệt. Khi mắt cua sáng rõ, tưới nhấp nhẹ nước trở lại và tăng lượng nước từ từ. Giai đoạn xổ nhụy cần thụ phấn bổ sung lúc chiều tối để quả tròn đều không bị méo. Tuyệt đối tránh đi đọt non khi cây đang mang trái non.'
        }
      ]
    }
  },
  {
    id: 6,
    slug: 'cay-mit',
    title: 'Kỹ thuật trồng mít Thái siêu sớm đạt năng suất cao',
    category: 'Kiến thức cây trồng',
    categorySlug: 'kien-thuc-cay-trong',
    publishDate: '2026-06-08',
    image: 'https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2?auto=format&fit=crop&q=80&w=800',
    summary: 'Quy trình tỉa quả, bọc quả chống ruồi vàng hại mít và kiểm soát bệnh xơ đen hiệu quả.',
    sources: ['Viện Cây ăn quả miền Nam (SOFRI)'],
    content: {
      sections: [
        {
          title: '1. Đặc điểm sinh học',
          text: 'Mít (Artocarpus heterophyllus) thuộc họ Dâu tằm. Thân gỗ có nhựa mủ trắng. Bộ rễ ăn sâu và tỏa rộng chịu hạn khá tốt. Hoa mít mọc thành cụm bông trên thân chính hoặc cành già (hoa đực và hoa cái riêng biệt). Quả là quả phức hình bầu dục lớn chứa nhiều múi mít ngọt ngào.'
        },
        {
          title: '2. Điều kiện sinh trưởng tối ưu',
          text: 'Mít thích nghi tốt với khí hậu nóng ẩm nhiệt đới. Không đòi hỏi đất đai quá khắt khe, có thể trồng trên đất xám, đất phù sa hoặc đất đồi dốc. Tuy nhiên đất cần thông thoáng thoát nước tốt, pH thích hợp từ 5.5 - 6.5.'
        },
        {
          title: '3. Nhu cầu dinh dưỡng',
          text: 'Nhu cầu phân bón của mít lớn ở thời kỳ mang quả. Cần bổ sung phân hữu cơ dồi dào để cải tạo đất quanh gốc cây. NPK có tỷ lệ Kali cao ở giai đoạn cuối giúp múi mít lên màu vàng nghệ đẹp, tăng độ ngọt tự nhiên và thơm lâu.'
        },
        {
          title: '4. Các giai đoạn phát triển chính',
          text: '- Giai đoạn kiến thiết cơ bản (năm đầu tiên đến năm thứ hai, thúc cây ra cành tán mạnh)\n- Giai đoạn ra hoa tạo trái (thân chính ra cựa bông)\n- Giai đoạn nuôi quả phát triển lớn\n- Giai đoạn chín và thu hoạch hạt mít.'
        },
        {
          title: '5. Lưu ý quan trọng khi chăm sóc',
          text: 'Mít Thái siêu sớm ra trái rất nhiều, cần tỉa bớt quả chỉ giữ lại 1-2 quả khỏe đẹp trên một cây dưới 3 năm tuổi để tránh cây suy kiệt và chết nhánh. Tiến hành bọc quả bằng túi chuyên dụng khi quả có đường kính 10cm để chống ruồi vàng đẻ trứng hại quả. Tránh tưới đẫm nước mưa khi cây ra hoa để hạn chế xơ đen.'
        }
      ]
    }
  },
  {
    id: 7,
    slug: 'cay-xoai',
    title: 'Kỹ thuật chăm sóc và kích thích xoài ra hoa trái vụ',
    category: 'Kiến thức cây trồng',
    categorySlug: 'kien-thuc-cay-trong',
    publishDate: '2026-06-05',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800',
    summary: 'Phương pháp bón phân đón lộc, xử lý Paclobutrazol kích xoài ra bông sớm và quản lý bệnh thán thư.',
    sources: ['Đại học Cần Thơ - Khoa Nông nghiệp', 'Trung tâm Khuyến nông Quốc gia'],
    content: {
      sections: [
        {
          title: '1. Đặc điểm sinh học',
          text: 'Xoài (Mangifera indica) thuộc họ Đào lộn hột. Thân gỗ lớn tán lá rậm rạp. Rễ xoài ăn sâu tới 4-6m giúp chống hạn rất tốt. Phát hoa xoài mọc đầu cành chứa cả hoa lưỡng tính và hoa đực. Quả xoài là quả hạch, hình dạng thuôn dài hoặc tròn dẹt tùy giống.'
        },
        {
          title: '2. Điều kiện sinh trưởng tối ưu',
          text: 'Xoài cần một mùa khô lạnh ngắn để phân hóa mầm hoa. Ưa ánh sáng mặt trời đầy đủ. Chịu hạn tốt nhưng sợ gió bão lúc ra hoa quả non. Đất thích hợp nhất là đất thịt pha cát nhẹ, giàu dinh dưỡng dồi dào, pH 5.5 - 7.0.'
        },
        {
          title: '3. Nhu cầu dinh dưỡng',
          text: 'Cây xoài cần nhiều Đạm để phát triển cơi đọt non bóng mượt. Lân giúp kích hoa mạnh mẽ. Kali đóng vai trò thúc đẩy quả chín đều ngọt lịm và vỏ săn chắc không nứt vỏ. Trung vi lượng Bo rất cần thiết giai đoạn ra hoa giúp hạt phấn sống tốt.'
        },
        {
          title: '4. Các giai đoạn phát triển chính',
          text: '- Giai đoạn ra cơi đọt (phục hồi tán cành)\n- Giai đoạn phân hóa mầm hoa đầu ngọn cành\n- Giai đoạn ra bông thụ phấn trái non\n- Giai đoạn lớn quả lớn nhanh và thu hoạch chín.'
        },
        {
          title: '5. Lưu ý quan trọng khi chăm sóc',
          text: 'Để xử lý xoài ra hoa trái vụ, tiến hành đổ thuốc ức chế sinh trưởng Paclobutrazol quanh gốc khi cơi đọt thứ hai có màu xanh lá chuối non. Phòng ngừa bệnh thán thư (nấm mắt cua) hại bông xoài bằng cách phun thuốc phòng ngừa trước khi xổ nhụy và khi gặp trời mưa ẩm dầm.'
        }
      ]
    }
  },
  {
    id: 8,
    slug: 'cay-buoi',
    title: 'Kỹ thuật canh tác bưởi da xanh đạt chất lượng xuất khẩu',
    category: 'Kiến thức cây trồng',
    categorySlug: 'kien-thuc-cay-trong',
    publishDate: '2026-06-03',
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=800',
    summary: 'Phương pháp giữ ẩm đất bằng cỏ sinh học, tỉa tán thông thoáng và dinh dưỡng cho bưởi mọng nước, ngọt lịm.',
    sources: ['Viện Cây ăn quả miền Nam (SOFRI)'],
    content: {
      sections: [
        {
          title: '1. Đặc điểm sinh học',
          text: 'Cây bưởi (Citrus maxima) là cây thân gỗ nhỏ có gai khi còn non. Lá có cánh eo rộng hình tim ngược rất dễ nhận biết. Rễ bưởi ăn nông tập trung ở lớp đất mặt 0-40cm. Hoa trắng ngọc thơm ngát mọc nách lá. Quả mọng nước chứa múi tép bưởi ngọt giòn.'
        },
        {
          title: '2. Điều kiện sinh trưởng tối ưu',
          text: 'Bưởi thích hợp khí hậu ấm áp mát mẻ, nhiệt độ 23-30 độ C. Đòi hỏi độ ẩm đất cao nhưng không chịu được úng ngập nước lâu ngày. Ưa thích đất bồi phù sa thoát nước ven sông ĐBSCL hoặc đất cát pha phù sa cổ, pH từ 5.5 - 6.5.'
        },
        {
          title: '3. Nhu cầu dinh dưỡng',
          text: 'Cây bưởi cần bón phân hữu cơ hoai mục nhiều để giữ lớp keo đất tơi xốp bảo vệ hệ rễ tơ ăn nông. NPK bón cân đối. Cực kỳ cần Canxi và Magie để vỏ quả bưởi bóng mướt và tép bưởi mọng nước ngọt thanh, không bị đắng vỏ.'
        },
        {
          title: '4. Các giai đoạn phát triển chính',
          text: '- Giai đoạn phát cành tạo tán mở\n- Giai đoạn ra bông đậu quả non tự nhiên\n- Giai đoạn quả phát triển lớn kéo dài 7-8 tháng\n- Giai đoạn thu hoạch cắt trái ngọt.'
        },
        {
          title: '5. Lưu ý quan trọng khi chăm sóc',
          text: 'Không nên làm sạch cỏ dại hoàn toàn ở gốc, hãy giữ lớp cỏ phủ cao 5-10cm để giữ ẩm đất mùa khô hạn. Tiến hành cắt tỉa cành tăm, cành sâu bệnh bên trong tán định kỳ để ánh sáng chiếu xuyên giúp ngăn ngừa nấm hồng và rệp sáp hại trái.'
        }
      ]
    }
  },
  {
    id: 9,
    slug: 'cay-cam',
    title: 'Kỹ thuật chăm sóc vườn cam sành bền vững',
    category: 'Kiến thức cây trồng',
    categorySlug: 'kien-thuc-cay-trong',
    publishDate: '2026-06-01',
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=800',
    summary: 'Cách phòng ngừa rầy chổng cánh truyền bệnh vàng lá gân xanh Greening hại cam.',
    sources: ['Trung tâm Khuyến nông Quốc gia'],
    content: {
      sections: [
        {
          title: '1. Đặc điểm sinh học',
          text: 'Cam sành (Citrus sinensis) là cây thân gỗ nhỏ có tán lá hình cầu. Lá có eo lá hẹp hơn bưởi. Rễ tơ phân bố mọc nông quanh tán cây. Quả cam khi chín mọng nước vỏ màu vàng cam bóng bẩy.'
        },
        {
          title: '2. Điều kiện sinh trưởng tối ưu',
          text: 'Thích khí hậu ẩm dịu ôn hòa. Thích đất phù sa màu mỡ tầng canh tác sâu. Cần cấp nước dồi dào đặc biệt thời kỳ lớn quả nhưng rãnh vườn phải thoát lũ nhanh, tránh úng nước, pH ổn định 5.5 - 6.5.'
        },
        {
          title: '3. Nhu cầu dinh dưỡng',
          text: 'Bên cạnh bón lót hữu cơ sâu, cam cần nhiều nguyên tố vi lượng Kẽm (Zn), Bo (B), Đồng (Cu) để ngăn vàng lá sinh lý và rụng trái non hàng loạt. Đạm và Kali cần bón xen kẽ để thúc quả to mọng vỏ ngọt.'
        },
        {
          title: '4. Các giai đoạn phát triển chính',
          text: '- Giai đoạn cơi đọt kiến thiết\n- Giai đoạn ra bông đậu quả cam non\n- Giai đoạn nuôi quả cam mọng nước lớn nhanh\n- Giai đoạn thu hoạch trái ngọt chín.'
        },
        {
          title: '5. Lưu ý quan trọng khi chăm sóc',
          text: 'Cực kỳ cẩn thận với rầy chổng cánh - tác nhân truyền virus gây bệnh vàng lá gân xanh (Greening) nan y không thuốc chữa. Phun xịt phòng trừ rầy chổng cánh lúc cây nhú cơi đọt non mới. Nhổ bỏ và tiêu hủy lập tức các cây bị bệnh Greening để tránh lây nhiễm.'
        }
      ]
    }
  },
  {
    id: 10,
    slug: 'cay-quyt',
    title: 'Kỹ thuật trồng và chăm sóc quýt đường mọng nước',
    category: 'Kiến thức cây trồng',
    categorySlug: 'kien-thuc-cay-trong',
    publishDate: '2026-05-28',
    image: 'https://images.unsplash.com/photo-1591857177580-2a54378ed31a?auto=format&fit=crop&q=80&w=800',
    summary: 'Dinh dưỡng cân đối tránh dày vỏ quýt, xốp vỏ quýt và sâu vẽ bùa phá hoại lá non.',
    sources: ['Viện Khoa học Nông nghiệp Việt Nam'],
    content: {
      sections: [
        {
          title: '1. Đặc điểm sinh học',
          text: 'Quýt đường là dòng quýt bản địa thân dẻo dai nhiều cành nhỏ rũ xuống. Quả quýt có dạng hơi dẹt hai đầu, vỏ mỏng láng dễ bóc khi chín cơm múi màu cam đỏ ngọt mọng.'
        },
        {
          title: '2. Điều kiện sinh trưởng tối ưu',
          text: 'Ưa mát mẻ ẩm vừa. Thích vùng đất thịt pha cát, đất đỏ bazan thoát nước tốt. Cần độ ẩm ổn định mùa nuôi quả, pH đất lý tưởng 5.5 - 6.5.'
        },
        {
          title: '3. Nhu cầu dinh dưỡng',
          text: 'Cần phân hữu cơ hoai và bón Kali định kỳ giai đoạn cuối để tăng tích lũy đường. Tránh bón thừa đạm (phân đạm vô cơ Ure) vào giai đoạn cuối vì sẽ khiến vỏ quýt bị dày, rỗng ruột và nhạt nước.'
        },
        {
          title: '4. Các giai đoạn phát triển chính',
          text: '- Giai đoạn sinh trưởng phát cành lá\n- Giai đoạn ra cựa bông thụ phấn\n- Giai đoạn tạo trái lớn mọng\n- Giai đoạn thu hoạch hạt và quýt quả chín ngọt.'
        },
        {
          title: '5. Lưu ý quan trọng khi chăm sóc',
          text: 'Chăm sóc cẩn thận lá non phòng bọ trĩ và sâu vẽ bùa vẽ các vệt trắng ngoằn ngoèo làm xoăn lá rụng cành non. Phun chế phẩm trừ sâu vẽ bùa lúc lá quýt non lụa bánh tẻ.'
        }
      ]
    }
  },
  {
    id: 11,
    slug: 'cay-thanh-long',
    title: 'Kỹ thuật chăm sóc thanh long tai xanh vỏ đỏ ngọt đậm',
    category: 'Kiến thức cây trồng',
    categorySlug: 'kien-thuc-cay-trong',
    publishDate: '2026-05-25',
    image: 'https://images.unsplash.com/photo-1527325678964-54921661f888?auto=format&fit=crop&q=80&w=800',
    summary: 'Phương pháp chong đèn kích bông trái vụ và phòng trị bệnh đốm trắng mắt cua hại cành.',
    sources: ['Trung tâm Khuyến nông tỉnh Bình Thuận'],
    content: {
      sections: [
        {
          title: '1. Đặc điểm sinh học',
          text: 'Thanh long (Hylocereus undatus) thuộc họ Xương rồng. Thân leo bò tam giác có gai nhỏ. Hệ rễ gồm rễ đất ngắn hút dinh dưỡng mặt và rễ bám ký sinh trên cột trụ xi măng. Quả chứa nhiều vảy xanh (tai cành).'
        },
        {
          title: '2. Điều kiện sinh trưởng tối ưu',
          text: 'Thanh long cực kỳ ưa sáng, cần ánh nắng trực tiếp hoàn toàn để tạo hoa. Chịu hạn giỏi nhưng úng nước thân cành sẽ bị thối nhũn ngay lập tức. Đất trồng thích hợp nhất là đất cát pha tơi xốp thoát nước hoàn toàn, pH 5.5 - 6.0.'
        },
        {
          title: '3. Nhu cầu dinh dưỡng',
          text: 'Yêu cầu lân cao giai đoạn kích ra hoa. Khi mang quả cần nhiều Kali để vỏ quả màu đỏ tươi bắt mắt, tai xanh cứng thẳng đứng không bị héo và phần ruột ngọt thanh chắc thịt.'
        },
        {
          title: '4. Các giai đoạn phát triển chính',
          text: '- Giai đoạn sinh trưởng leo cột phủ cành rủ\n- Giai đoạn ra bông bông nở thụ phấn\n- Giai đoạn quả phát triển chín đỏ vỏ\n- Giai đoạn phục hồi cắt cành già.'
        },
        {
          title: '5. Lưu ý quan trọng khi chăm sóc',
          text: 'Xử lý ra hoa trái vụ bằng phương pháp chong đèn sợi đốt hoặc đèn LED chuyên dụng vào ban đêm liên tục từ 12-15 ngày để sưởi ấm thân dây. Chú ý phòng bệnh đốm trắng (đốm mắt cua) do nấm gây ra vào mùa mưa dầm ẩm ướt.'
        }
      ]
    }
  },
  {
    id: 12,
    slug: 'cay-chuoi',
    title: 'Kỹ thuật thâm canh cây chuối năng suất cao',
    category: 'Kiến thức cây trồng',
    categorySlug: 'kien-thuc-cay-trong',
    publishDate: '2026-05-22',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=800',
    summary: 'Kỹ thuật tỉa chồi bên, chống đỡ buồng tránh ngã đổ và phòng ngừa bệnh héo rũ Panama hại rễ chuối.',
    sources: ['Viện Khoa học Nông nghiệp Việt Nam'],
    content: {
      sections: [
        {
          title: '1. Đặc điểm sinh học',
          text: 'Chuối (Musa) là cây thân giả khổng lồ do bẹ lá xếp khít chặt chồng lên nhau. Thân thật là củ chuối nằm ngầm sâu dưới lòng đất. Bộ rễ ăn nông và rộng tỏa xung quanh gốc.'
        },
        {
          title: '2. Điều kiện sinh trưởng tối ưu',
          text: 'Cây chuối rất cần nước để duy trì bẹ lá mọng nước xanh tốt. Nhiệt độ lý tưởng 25-30 độ C. Ưa đất phù sa ven sông ĐBSCL giàu mùn ẩm tơi xốp, pH lý tưởng 6.0 - 7.0.'
        },
        {
          title: '3. Nhu cầu dinh dưỡng',
          text: 'Cây chuối cực kỳ "hảo" Kali. Kali chiếm tỷ trọng dinh dưỡng lớn nhất giúp vận chuyển đường tinh bột nuôi quả to dài đồng đều và giúp thân bẹ lá cứng cáp chống đỡ buồng chuối nặng cân mà không bị gãy gập cây.'
        },
        {
          title: '4. Các giai đoạn phát triển chính',
          text: '- Giai đoạn cây chuối con đâm chồi\n- Giai đoạn phát triển lá lớn trưởng thành\n- Giai đoạn trổ buồng bắp chuối đẻ nải\n- Giai đoạn chín nải chuối vàng.'
        },
        {
          title: '5. Lưu ý quan trọng khi chăm sóc',
          text: 'Nên chủ động đánh tỉa bớt chồi chuối con bên cạnh, mỗi gốc chỉ giữ lại 1 cây mẹ đang mang trái và 1-2 chồi con nối dõi kế bên để tránh phân tán chất dinh dưỡng nuôi cây. Làm cọc chống đỡ buồng chuối chu đáo khi buồng chuối nặng cân phòng gió lốc.'
        }
      ]
    }
  },
  {
    id: 13,
    slug: 'rau-mau',
    title: 'Kỹ thuật trồng và chăm sóc rau màu an toàn sinh học',
    category: 'Kiến thức cây trồng',
    categorySlug: 'kien-thuc-cay-trong',
    publishDate: '2026-05-20',
    image: 'https://images.unsplash.com/photo-1566385974606-54d444b792ff?auto=format&fit=crop&q=80&w=800',
    summary: 'Cách bón phân và phun xịt thuốc sinh học cho rau ăn lá, rau ăn quả ngắn ngày an toàn vệ sinh.',
    sources: ['Bộ Nông nghiệp & Phát triển Nông thôn Việt Nam'],
    content: {
      sections: [
        {
          title: '1. Đặc điểm sinh học',
          text: 'Rau màu là nhóm cây ngắn ngày chu kỳ thu hoạch ngắn (25 - 90 ngày) thân thảo mềm. Bao gồm rau ăn lá (cải xanh, xà lách, muống), rau ăn quả (cà chua, dưa leo, ớt) và rau ăn củ (củ cải, cà rốt).'
        },
        {
          title: '2. Điều kiện sinh trưởng tối ưu',
          text: 'Cần đất vườn cực xốp nhẹ, thoát nước nhanh, đất sạch mầm bệnh. Tưới nước nhẹ nhàng đều đặn sáng chiều. Ánh sáng đầy đủ dịu nhẹ, pH đất thích hợp 6.0 - 6.8.'
        },
        {
          title: '3. Nhu cầu dinh dưỡng',
          text: 'Rau ăn lá cần đạm cao thời gian ngắn. Rau ăn quả cần lân và kali ở thời kỳ ra hoa đậu quả lớn trái. Ưu tiên phân hữu cơ hoai mục, dịch hữu cơ thủy phân (dịch giun quế, phân cá thủy phân) để hạn chế dư lượng nitrat có hại trong lá rau.'
        },
        {
          title: '4. Các giai đoạn phát triển chính',
          text: '- Giai đoạn gieo hạt ươm khay cây con\n- Giai đoạn cấy ra luống đất bón thúc cành lá\n- Giai đoạn thu hoạch giòn ngọt rau ăn lá / ra hoa đậu quả rau ăn quả.'
        },
        {
          title: '5. Lưu ý quan trọng khi chăm sóc',
          text: 'Tuyệt đối tuân thủ thời gian cách ly khuyến cáo (PHI) của phân bón và thuốc BVTV trước khi thu hoạch rau củ để bảo vệ sức khỏe người ăn. Sử dụng lưới quây chắn côn trùng thay vì phun thuốc hóa học nhiều.'
        }
      ]
    }
  },
  {
    id: 14,
    slug: 'hoa-kieng',
    title: 'Kỹ thuật chăm sóc hoa hồng và mai vàng nở đúng dịp tết',
    category: 'Kiến thức cây trồng',
    categorySlug: 'kien-thuc-cay-trong',
    publishDate: '2026-05-18',
    image: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=800',
    summary: 'Quy trình chuẩn bị đất trồng chậu tơi xốp, bón lân kali thúc hoa và cách bấm ngọn, vặt lá mai vàng trổ bông.',
    sources: ['Nghệ nhân cây cảnh làng hoa Sa Đéc, làng hoa Gò Vấp'],
    content: {
      sections: [
        {
          title: '1. Đặc điểm sinh học',
          text: 'Hoa hồng thuộc chi Rosa rễ cọc hoa nở đầu cành; mai vàng thân gỗ nhánh hoa nở từ nách lá mắt ngủ. Cả hai đều có giá trị thẩm mỹ hoa cảnh chậu cao cần chăm sóc tỉ mỉ nghệ thuật.'
        },
        {
          title: '2. Điều kiện sinh trưởng tối ưu',
          text: 'Yêu cầu giá thể trồng chậu thông thoáng hoàn hảo chứa xơ dừa hoai mục phân trùn quế thoát nước nhanh. Đòi hỏi ánh nắng chiếu sáng trung bình 6 tiếng/ngày, pH lý tưởng 5.8 - 6.5.'
        },
        {
          title: '3. Nhu cầu dinh dưỡng',
          text: 'Thời kỳ cành lá cần đạm và humic hữu cơ phục hồi tược non. Thời kỳ phân hóa mầm hoa cần lân cao (như siêu lân phun lá) và kali giúp nụ mập mọc to, sắc hoa bền sắc tươi đậm màu chống tàn.'
        },
        {
          title: '4. Các giai đoạn phát triển chính',
          text: '- Giai đoạn kiến thiết cắt tỉa cành tạo cơi tược\n- Giai đoạn đứng ngọn ngủ đông ủ mầm hoa\n- Giai đoạn trổ hoa bung nhụy nở rộ\n- Giai đoạn dưỡng gốc phục hồi cây kiểng.'
        },
        {
          title: '5. Lưu ý quan trọng khi chăm sóc',
          text: 'Đối với mai vàng tết, canh vặt bỏ lá mai sạch sẽ vào khoảng ngày 14 - 16 tháng 11 âm lịch tùy tình hình thời tiết ấm hay lạnh để thúc nụ hoa bung trấu nở tròn đúng ngày mùng một. Cắt tỉa tạo cành hoa hồng định kỳ giúp bông nở rực rỡ.'
        }
      ]
    }
  },

  // ==========================================
  // II. KIẾN THỨC PHÂN BÓN (10 bài viết)
  // ==========================================
  {
    id: 15,
    slug: 'phan-huu-co-la-gi',
    title: 'Phân hữu cơ là gì? Phân loại và vai trò cải tạo đất trồng',
    category: 'Kiến thức phân bón',
    categorySlug: 'kien-thuc-phan-bon',
    publishDate: '2026-06-19',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
    summary: 'Tìm hiểu định nghĩa phân hữu cơ, các nhóm phân hữu cơ truyền thống, công nghiệp và tác dụng làm màu mỡ cấu trúc đất vườn.',
    sources: ['Viện Khoa học Nông nghiệp Việt Nam', 'Giáo trình Thổ nhưỡng - Phân bón'],
    content: {
      sections: [
        {
          title: 'Định nghĩa phân hữu cơ',
          text: 'Phân hữu cơ là loại phân bón chứa các chất dinh dưỡng đa, trung, vi lượng ở dạng các hợp chất hữu cơ có nguồn gốc từ tự nhiên (chất thải động vật, xác thực vật, rác thải nhà bếp...). Phân được phân hủy hoai mục nhờ vi sinh vật trước khi bón cho cây.'
        },
        {
          title: 'Phân loại phân hữu cơ',
          text: '1. Phân hữu cơ truyền thống: Phân chuồng (trâu, bò, lợn), phân gà trấu, phân xanh (xác lá cây dại), than bùn.\n2. Phân hữu cơ chế biến công nghiệp: Phân hữu cơ vi sinh, phân hữu cơ khoáng, phân hữu cơ sinh học được bổ sung vi sinh vật có lợi.'
        },
        {
          title: 'Vai trò cốt lõi đối với đất đai',
          text: 'Hữu cơ bổ sung chất mùn dồi dào giúp liên kết các hạt đất sét khô thành cấu trúc viên tơi xốp thông thoáng, nâng cao khả năng giữ nước, giữ chất dinh dưỡng của đất cát, giải độc chất kiềm cho đất chai hóa, đồng thời tạo môi trường thức ăn lý tưởng nuôi giun đất và vi sinh vật bản địa phát triển.'
        }
      ]
    }
  },
  {
    id: 16,
    slug: 'phan-vo-co-la-gi',
    title: 'Phân vô cơ là gì? Ưu nhược điểm của phân bón hóa học',
    category: 'Kiến thức phân bón',
    categorySlug: 'kien-thuc-phan-bon',
    publishDate: '2026-06-16',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
    summary: 'Hiểu đúng về phân hóa học (phân khoáng vô cơ). Sử dụng sao cho hiệu quả mà không làm thoái hóa tài nguyên đất trồng.',
    sources: ['Bộ Nông nghiệp & Phát triển Nông thôn', 'Tài liệu khuyến nông quốc gia'],
    content: {
      sections: [
        {
          title: 'Định nghĩa phân vô cơ',
          text: 'Phân vô cơ (phân hóa học) là sản phẩm công nghiệp sản xuất từ khoáng tự nhiên hoặc tổng hợp hóa học, chứa dinh dưỡng đa lượng thiết yếu dưới dạng muối khoáng vô cơ dễ tan (Đạm, Lân, Kali) giúp rễ cây hấp thụ nhanh chóng lập tức.'
        },
        {
          title: 'Ưu điểm nổi bật',
          text: 'Chứa hàm lượng dinh dưỡng đậm đặc cực kỳ cao, tan nhanh ngấm sâu rễ hút tức thì giúp cây nhanh xanh lá, hồi đọt mập rễ sau vài ngày bón. Chi phí vận chuyển bón đất gọn nhẹ hơn phân hữu cơ thô.'
        },
        {
          title: 'Nhược điểm khi lạm dụng quá đà',
          text: 'Lạm dụng lâu dài không bón bổ sung hữu cơ sẽ làm tiêu diệt giun đất và vi sinh vật có hại, làm đất trồng bị nén chặt chai cứng biến dạng bạc màu, rửa trôi làm ô nhiễm nguồn nước ngầm và gây tích lũy muối độc tính ở rễ.'
        }
      ]
    }
  },
  {
    id: 17,
    slug: 'phan-vi-sinh-la-gi',
    title: 'Phân vi sinh là gì? Cơ chế hoạt động của vi khuẩn có lợi',
    category: 'Kiến thức phân bón',
    categorySlug: 'kien-thuc-phan-bon',
    publishDate: '2026-06-13',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
    summary: 'Tìm hiểu phân bón chứa các tế bào vi sinh vật sống có khả năng phân giải lân, cố định đạm tự nhiên.',
    sources: ['Viện Hóa học Nông nghiệp Việt Nam'],
    content: {
      sections: [
        {
          title: 'Khái niệm phân vi sinh',
          text: 'Phân vi sinh là chế phẩm bón đất chứa các chủng vi sinh vật sống hữu ích đã được tuyển chọn mật độ cao (không dưới 1x10^8 tế bào/g), khi bón vào đất chúng hoạt động tạo ra các chất dễ tiêu nuôi dưỡng cây.'
        },
        {
          title: 'Cơ chế hoạt động của các chủng vi sinh phổ biến',
          text: '1. Vi sinh cố định đạm (Azotobacter, Rhizobium): Hấp thu khí nitơ tự nhiên chuyển thành đạm amoni cây dễ hút.\n2. Vi sinh phân giải lân khó tan (Bacillus): Tiết axit hữu cơ hòa tan các liên kết phốt phát cứng khó tan trong đất chua.\n3. Nấm đối kháng (Trichoderma): Tiết kháng sinh cạnh tranh tiêu diệt bào tử nấm Phytophthora gây thối rễ.'
        },
        {
          title: 'Lưu ý khi sử dụng phân vi sinh',
          text: 'Không bón phân vi sinh chung với thuốc trừ nấm bệnh hóa học hoặc vôi bột rải đất sát nhau vì sẽ giết chết tế bào bào tử nấm vi khuẩn có lợi. Bón đất ẩm mát để giữ vi sinh sống.'
        }
      ]
    }
  },
  {
    id: 18,
    slug: 'phan-npk-la-gi',
    title: 'Phân NPK là gì? Thành phần dinh dưỡng đa lượng cốt lõi',
    category: 'Kiến thức phân bón',
    categorySlug: 'kien-thuc-phan-bon',
    publishDate: '2026-06-11',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
    summary: 'Khái niệm phân bón hỗn hợp NPK và ý nghĩa của từng nguyên tố Đạm - Lân - Kali đối với đời sống thực vật.',
    sources: ['Tổng công ty Phân bón Đầu Trâu - Bình Điền'],
    content: {
      sections: [
        {
          title: 'Khái niệm NPK',
          text: 'Phân NPK là phân hỗn hợp chứa tối thiểu 3 nguyên tố đa lượng quan trọng bậc nhất cho cây: N (Nitơ - Đạm), P (Phốt pho - Lân), K (Kali - Kali). Được sản xuất dạng trộn hạt hoặc một hạt đồng đều dinh dưỡng.'
        },
        {
          title: 'Vai trò của từng thành phần đa lượng',
          text: '- Nitơ (N - Đạm): Thúc đẩy sinh khối cành lá, tược non, làm lá to rộng xanh mướt.\n- Phốt pho (P - Lân): Kích rễ tơ ăn sâu mọc dài, phân hóa mầm hoa đẻ cựa bông chắc khỏe.\n- Kali (K - Kali): Tăng lực đẩy vận chuyển đường tinh bột nuôi trái ngọt củ to, giúp vách tế bào cứng cáp chống rét chịu úng đổ ngã.'
        },
        {
          title: 'Sự khác biệt NPK một hạt và NPK ba màu',
          text: 'NPK một hạt chứa đầy đủ 3 nguyên tố trong cùng một hạt phân, giúp cây hấp thụ đều không lệch dòng. NPK ba màu là sự trộn cơ học các hạt đạm, lân, kali riêng lẻ có giá thành rẻ hơn nhưng dễ phân tầng hạt.'
        }
      ]
    }
  },
  {
    id: 19,
    slug: 'cach-doc-chi-so-npk',
    title: 'Cách đọc chỉ số phân NPK để chọn đúng công thức cho cây',
    category: 'Kiến thức phân bón',
    categorySlug: 'kien-thuc-phan-bon',
    publishDate: '2026-06-09',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
    summary: 'Giải mã ý nghĩa các con số tỷ lệ phần trăm như 16-16-8, 20-20-15 hay 15-5-20 ghi trên bao bì.',
    sources: ['Tập đoàn hóa chất nông nghiệp Yara Việt Nam'],
    content: {
      sections: [
        {
          title: 'Quy ước ghi chỉ số NPK trên bao bì',
          text: 'Các con số cách nhau bởi dấu gạch ngang đại diện cho tỷ lệ phần trăm (%) khối lượng nguyên chất của Nitơ tổng số (N) - Lân hữu hiệu (P2O5) - Kali hữu hiệu (K2O). Ví dụ bao NPK 20-20-15 chứa 20% Đạm, 20% Lân và 15% Kali.'
        },
        {
          title: 'Lựa chọn công thức NPK theo thời kỳ cây trồng',
          text: '1. Công thức đạm lân cao (Ví dụ 20-20-15, 16-16-8): Dùng đầu mùa mưa, thời kỳ thúc cơi đọt đẻ nhánh và dưỡng rễ tơ.\n2. Công thức cân bằng (Ví dụ 15-15-15, 13-13-13): Dùng thời kỳ cây trung bình ổn định Bonsai, duy trì tược tốt.\n3. Công thức đạm kali cao (Ví dụ 15-5-20, 16-8-16): Dùng dưỡng trái to ngọt quả sầu riêng, cà phê thời kỳ gần thu hoạch vỏ chín.'
        },
        {
          title: 'Ý nghĩa của ký hiệu TE đi kèm',
          text: 'Ký hiệu "TE" (Trace Elements) chỉ ra phân có bổ sung các chất vi lượng cần thiết như Kẽm (Zn), Bo (B), Đồng (Cu), Sắt (Fe) giúp cây khỏe ngăn ngừa vàng lá loang lỗ xoăn lá non.'
        }
      ]
    }
  },
  {
    id: 20,
    slug: 'khi-nao-nen-bon-phan-huu-co',
    title: 'Khi nào nên bón phân hữu cơ? Thời điểm bón đất lý tưởng',
    category: 'Kiến thức phân bón',
    categorySlug: 'kien-thuc-phan-bon',
    publishDate: '2026-06-07',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
    summary: 'Kế hoạch bón lót hữu cơ kiến tạo tơi xốp đất ban đầu và phục hồi đất kiệt sau thu hoạch bông trái.',
    sources: ['Trung tâm Khuyến nông Quốc gia'],
    content: {
      sections: [
        {
          title: 'Bón lót trước khi trồng mới',
          text: 'Phân hữu cơ hoai mục là thành phần bắt buộc phải trộn đều vào hố trồng, luống đất trồng trước khi đặt bầu cây con tối thiểu 10-15 ngày giúp rễ con đặt xuống tiếp xúc ngay lớp đất tơi ẩm rễ mọc êm không cháy xót.'
        },
        {
          title: 'Bón phục hồi sau mỗi mùa thu hoạch',
          text: 'Sau kỳ thu hoạch sầu riêng, cà phê, chuối, đất vườn thường chai cằn kiệt dinh dưỡng. Bón rải gốc lượng phân hữu cơ từ 3-10kg/gốc để cải tạo kết keo đất giúp cây phục hồi làm cơi đọt mới nhanh.'
        },
        {
          title: 'Độ ẩm đất lý tưởng để bón hữu cơ',
          text: 'Nên bón phân hữu cơ khi đất ẩm nhẹ, hoặc sau khi tưới nước ẩm đều. Tránh bón vào thời điểm hạn hán đất khô nứt làm phân bay hơi hao phí mùn trơ trọi chất dơ dưới nắng nóng chói chang.'
        }
      ]
    }
  },
  {
    id: 21,
    slug: 'khi-nao-nen-bon-phan-la',
    title: 'Khi nào nên bón phân lá? Giải pháp cấp cứu dinh dưỡng nhanh',
    category: 'Kiến thức phân bón',
    categorySlug: 'kien-thuc-phan-bon',
    publishDate: '2026-06-04',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
    summary: 'Sử dụng phân bón qua lá (phun xịt bề mặt lá) đúng trường hợp khẩn cấp rễ yếu hư hại.',
    sources: ['Viện Khoa học Nông nghiệp Việt Nam', 'Chuyên trang kỹ thuật Yara'],
    content: {
      sections: [
        {
          title: 'Cơ chế cây hấp thụ dinh dưỡng qua lá',
          text: 'Trên phiến lá có hàng triệu lỗ khí khổng phân bố nhiều ở mặt dưới lá. Phun phân bón lá chứa muối khoáng tinh khiết dễ tan giúp chất dinh dưỡng đi thẳng qua lỗ khí khổng vào tế bào lá nuôi cây cực nhanh chỉ sau vài giờ.'
        },
        {
          title: 'Các trường hợp đặc biệt nên bón phân lá',
          text: '1. Hệ rễ cây bị hư hại tổn thương do ngập úng mùa lũ, nghẹt rễ chua phèn không hút dinh dưỡng được.\n2. Cây gặp hạn hán mùa khô kéo dài đất cằn rễ cọc đứng yên.\n3. Thời điểm nhạy cảm cần kích mầm hoa đồng loạt ngọn cành đầu hoặc bón nuôi quả bóng vỏ giòn.'
        },
        {
          title: 'Nguyên tắc phun bón lá an toàn',
          text: 'Pha đúng nồng độ cực loãng khuyến cáo. Phun vào thời điểm khí khổng mở rộng: Sáng sớm khi sương chưa tan hoặc chiều mát nắng lặn. Tuyệt đối không phun lúc giữa trưa nắng gắt hoặc trời sắp mưa to sẽ gây cháy lá rụng bông nụ.'
        }
      ]
    }
  },
  {
    id: 22,
    slug: 'cach-bon-phan-dung-ky-thuat',
    title: 'Cách bón phân đúng kỹ thuật tránh thất thoát lãng phí',
    category: 'Kiến thức phân bón',
    categorySlug: 'kien-thuc-phan-bon',
    publishDate: '2026-05-30',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
    summary: 'Phương pháp rải rìa tán hình chiếu, xới lấp đất nhẹ và tưới nước giữ độ ẩm hòa tan phân bón.',
    sources: ['Trung tâm Khuyến nông Quốc gia'],
    content: {
      sections: [
        {
          title: 'Nguyên lý rễ tơ hướng tán cây',
          text: 'Rễ tơ hấp thu phân bón mạnh nhất nằm ở rìa mép ngoài hình chiếu tán lá cây chiếu xuống mặt đất. Không được bón tập trung sát tận gốc cây ăn quả lớn vì nơi đó rễ lớn hóa gỗ không hút được phân, dễ gây ngộ độc nóng xót rễ xì mủ gốc.'
        },
        {
          title: 'Quy trình bón phân đúng chuẩn',
          text: '1. Vệ sinh làm cỏ dại rìa mép tán.\n2. Xới nhẹ một lớp đất sâu khoảng 5-10cm hình vòng tròn rìa tán lá.\n3. Rải đều phân hạt NPK hữu cơ vào rãnh vòng tròn.\n4. Lấp đất nhẹ phủ lên hạt phân để tránh bay hơi hao phí đạm nitơ dưới nắng.\n5. Tưới nước ẩm nhẹ đều đặn hòa tan phân thấm đất nuôi rễ tơ.'
        },
        {
          title: 'Lựa chọn thời tiết lúc bón phân',
          text: 'Bón phân lúc chiều mát mẻ khi trời không mưa to dầm dề để tránh bị nước mưa dội trôi xối xả phân bón xuống mương ao ruộng.'
        }
      ]
    }
  },
  {
    id: 23,
    slug: 'dau-hieu-cay-thieu-dinh-duong',
    title: 'Dấu hiệu cây thiếu dinh dưỡng qua biểu hiện lá',
    category: 'Kiến thức phân bón',
    categorySlug: 'kien-thuc-phan-bon',
    publishDate: '2026-05-26',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
    summary: 'Cách nhìn lá chẩn đoán cây thiếu Đạm, Lân, Kali hay vi lượng sắt kẽm bo để xử lý bón cứu cây kịp thời.',
    sources: ['Viện Khoa học Nông nghiệp Việt Nam', 'Cẩm nang chẩn đoán thiếu dinh dưỡng của Yara'],
    content: {
      sections: [
        {
          title: 'Thiếu đa lượng (Nitơ, Phốt pho, Kali)',
          text: '- Thiếu Đạm (N): Các lá già phía dưới chuyển màu vàng nhạt đầu tiên cành còi cọc đâm nhánh yếu.\n- Thiếu Lân (P): Lá chuyển sang màu xanh đậm xỉn rỉ rìa lá úa đỏ tím rỉ sét tím đỏ nhạt sinh trưởng rễ chững đứng yên.\n- Thiếu Kali (K): Mép rìa lá bị cháy xém khô ráp như bị sấy lửa từ chóp lá lan dần vào dọc gân lá già.'
        },
        {
          title: 'Thiếu trung vi lượng (Canxi, Magie, Bo, Kẽm, Sắt)',
          text: '- Thiếu Canxi - Bo: Đỉnh sinh trưởng ngọn cành bị chùn, nụ hoa dễ rụng đen trái méo mó nứt vỏ.\n- Thiếu Magie (Mg): Lá già có các vệt vàng loang lổ nhưng gân lá vẫn giữ màu xanh đậm.\n- Thiếu Sắt (Fe): Lá non mới ra mỏng dính vàng nhợt trắng bóng gân xanh rõ nét.'
        },
        {
          title: 'Giải pháp khắc phục',
          text: 'Khi thiếu đa lượng bón thúc NPK hạt gốc. Khi thiếu vi lượng phun phân bón lá vi lượng chelate hóa nhanh hấp thụ phục hồi bộ đọt đâm tược non.'
        }
      ]
    }
  },
  {
    id: 24,
    slug: 'cach-lua-chon-phan-bon-phu-hop',
    title: 'Cách lựa chọn phân bón phù hợp từng loại đất trồng',
    category: 'Kiến thức phân bón',
    categorySlug: 'kien-thuc-phan-bon',
    publishDate: '2026-05-21',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
    summary: 'Chọn phân chua phân kiềm cho đất chua phèn đất cát bạc màu đất cát biển để bảo dưỡng độ phì.',
    sources: ['Tổng công ty Phân bón Phú Mỹ'],
    content: {
      sections: [
        {
          title: 'Lựa chọn phân cho đất chua phèn',
          text: 'Đất chua có độ pH thấp dưới 5.0 chứa nhiều ion nhôm sắt tự do độc rễ. Tuyệt đối hạn chế bón phân có tính sinh lý chua như SA, Kali Clorua đỏ. Nên chọn bón phân Lân nung chảy (Lân Văn Điển), vôi bột khử chua nâng độ pH trước.'
        },
        {
          title: 'Lựa chọn phân cho đất cát bạc màu',
          text: 'Đất cát cấu trúc rỗng dễ bị rửa trôi chất mùn đạm kali nhanh chóng. Không nên bón phân hóa học đậm đặc một đợt lớn. Nên bón lượng lớn phân hữu cơ vi sinh, phân hữu cơ mùn để nâng khả năng keo giữ chất của cát dồi dào.'
        },
        {
          title: 'Lựa chọn phân cho đất sét nặng giữ nước',
          text: 'Đất sét hạt mịn bít kín dễ ngập úng bí khí. Ưu tiên bón vôi bột bón phân chuồng phân dê hoai mục trộn cát giá thể xơ dừa giúp phá cấu trúc hạt sét láng o tơi xốp trở lại.'
        }
      ]
    }
  },

  // ==========================================
  // III. THUỐC BẢO VỆ THỰC VẬT (6 bài viết)
  // ==========================================
  {
    id: 25,
    slug: 'cac-nhom-thuoc-bvv',
    title: 'Các nhóm thuốc bảo vệ thực vật phổ biến trong nông nghiệp',
    category: 'Thuốc bảo vệ thực vật',
    categorySlug: 'thuoc-bao-ve-thuc-vat',
    publishDate: '2026-06-17',
    image: 'https://images.unsplash.com/photo-1592424001806-538421319246?auto=format&fit=crop&q=80&w=800',
    summary: 'Phân loại thuốc trừ sâu bệnh hóa học và sinh học, các gốc hoạt chất diệt nấm hại cây.',
    sources: ['Cục Bảo vệ Thực vật - Bộ Nông nghiệp & PTNT'],
    content: {
      sections: [
        {
          title: 'Phân loại theo đối tượng diệt trừ',
          text: '1. Thuốc trừ sâu (Insecticides): Diệt sâu ăn lá, bọ trĩ, rầy cám.\n2. Thuốc trừ bệnh (Fungicides/Bactericides): Trị các bệnh do nấm bào tử nấm hồng bệnh héo xanh vi khuẩn.\n3. Thuốc trừ cỏ dại (Herbicides): Diệt cỏ.\n4. Thuốc diệt chuột ốc sên.'
        },
        {
          title: 'Phân biệt thuốc hóa học và thuốc sinh học',
          text: '- Thuốc hóa học: Tác dụng nhanh lập tức, hiệu lực diệt mạnh nhưng độc tính cao cho môi trường người phun, dễ tồn dư độc hại.\n- Thuốc sinh học (Ví dụ thuốc vi sinh Bt, chế phẩm Neem oil): Chiết xuất thảo mộc vi khuẩn diệt sâu an toàn hoàn toàn không độc tính dư lượng nhưng tác dụng chậm cần xịt ngừa.'
        },
        {
          title: 'Các vạch màu chỉ độc tính trên nhãn thuốc',
          text: 'Vạch màu đỏ (Độc hại cấp I cực độc rất nguy hiểm) -> Vạch màu vàng (Độc trung bình) -> Vạch màu xanh da trời (Độc nhẹ cẩn thận) -> Vạch màu xanh lá cây (Độc rất nhẹ cực kỳ an toàn).'
        }
      ]
    }
  },
  {
    id: 26,
    slug: 'cach-su-dung-thuoc-an-toan',
    title: 'Quy trình sử dụng thuốc bảo vệ thực vật an toàn hiệu quả',
    category: 'Thuốc bảo vệ thực vật',
    categorySlug: 'thuoc-bao-ve-thuc-vat',
    publishDate: '2026-06-14',
    image: 'https://images.unsplash.com/photo-1592424001806-538421319246?auto=format&fit=crop&q=80&w=800',
    summary: 'Nguyên tắc chuẩn bị dụng cụ pha chế phun xịt đúng chiều gió hướng phun và xử lý vỏ bao bì rác độc hại.',
    sources: ['Cục Bảo vệ Thực vật Việt Nam'],
    content: {
      sections: [
        {
          title: 'Khâu pha chế thuốc an toàn',
          text: 'Luôn đọc kỹ hướng dẫn pha đúng tỷ lệ ml/lít nước trên vỏ chai bao bì thuốc. Không dùng tay trần để khuấy quấy nước thuốc pha, dùng que tre cành cây dài khuấy nhẹ đều.'
        },
        {
          title: 'Kỹ thuật phun xịt trên đồng ruộng',
          text: 'Chỉ phun xịt thuốc lúc trời mát mẻ gió nhẹ râm mát. Đi dọc theo hướng gió, vòi xịt hướng xuôi theo chiều gió thổi đi ra phía xa thân mình để tránh hít luồng hơi độc bay ngược vào cơ thể. Tuyệt đối không phun ngược chiều gió lớn hoặc trưa nắng gắt làm bốc hơi nhanh thuốc.'
        },
        {
          title: 'Xử lý bao bì chai lọ thuốc sau sử dụng',
          text: 'Vỏ chai bao bì sau khi xịt sạch thuốc phải được gom về các hố chứa rác độc hại của thôn bản ruộng đồng. Tuyệt đối không vứt chai vỏ thuốc xuống lòng kênh sông rạch ruộng nước gây chết cá ô nhiễm nguồn sinh hoạt.'
        }
      ]
    }
  },
  {
    id: 27,
    slug: 'nguyen-tac-4-dung',
    title: 'Nguyên tắc 4 đúng trong sử dụng thuốc bảo vệ thực vật',
    category: 'Thuốc bảo vệ thực vật',
    categorySlug: 'thuoc-bao-ve-thuc-vat',
    publishDate: '2026-06-11',
    image: 'https://images.unsplash.com/photo-1592424001806-538421319246?auto=format&fit=crop&q=80&w=800',
    summary: 'Chi tiết nguyên tắc vàng giúp tăng tối đa hiệu quả diệt trừ dịch hại mà tiết kiệm chi phí mua thuốc.',
    sources: ['Cục Bảo vệ Thực vật - Bộ Nông nghiệp & PTNT'],
    content: {
      sections: [
        {
          title: '1. Đúng thuốc',
          text: 'Bắt bệnh chẩn đoán đúng đối tượng dịch hại hại lá. Ví dụ sâu ăn lá dùng thuốc trừ sâu; bệnh do nấm sợi phải dùng thuốc đặc trị nấm rễ đốm lá chứ không được xịt thuốc sâu vô hiệu lãng phí tiền.'
        },
        {
          title: '2. Đúng lúc',
          text: 'Phun thuốc lúc sâu non tuổi 1-2 mới nở da mềm diệt dễ nhất; bệnh nấm vừa nhú đốm mắt cua nhỏ xịt ngắt mầm bệnh lập tức. Tránh xịt khi sâu lột xác to vỏ sừng trơ lì thuốc hóa học.'
        },
        {
          title: '3. Đúng liều lượng & nồng độ',
          text: 'Pha đúng dung lượng chỉ định mác nhãn. Pha quá loãng sâu kháng thuốc lờn thuốc làm dịch bùng mạnh hơn; pha quá đậm đặc làm cháy cháy đọt non chùn hoa xót rễ cây.'
        },
        {
          title: '4. Đúng cách',
          text: 'Xịt trúng ổ dịch hại. Bọ trĩ nhện đỏ ưa cư trú nấp ở mặt dưới lá non phải ngửa vòi xịt hướng từ dưới phun lên đẫm lá; sâu cuốn lá phải phun đẫm rãnh lá kẽ đọt.'
        }
      ]
    }
  },
  {
    id: 28,
    slug: 'thoi-gian-cach-ly',
    title: 'Thời gian cách ly (PHI) trong nông nghiệp là gì?',
    category: 'Thuốc bảo vệ thực vật',
    categorySlug: 'thuoc-bao-ve-thuc-vat',
    publishDate: '2026-06-08',
    image: 'https://images.unsplash.com/photo-1592424001806-538421319246?auto=format&fit=crop&q=80&w=800',
    summary: 'Tầm quan trọng của thời gian cách ly trước thu hoạch bảo vệ sức khỏe người ăn tránh ngộ độc tồn dư hóa chất.',
    sources: ['Bộ Y tế - Bộ Nông nghiệp & PTNT Việt Nam'],
    content: {
      sections: [
        {
          title: 'Định nghĩa thời gian cách ly (PHI)',
          text: 'Thời gian cách ly (Pre-Harvest Interval - PHI) là khoảng thời gian tối thiểu bắt buộc từ lần phun thuốc BVTV cuối cùng đến khi được phép tiến hành thu hoạch cắt rau hái trái cây để đảm bảo hoạt chất thuốc phân hủy hoàn toàn dưới mức giới hạn tối đa cho phép (MRL).'
        },
        {
          title: 'Quy định PHI thông thường',
          text: 'Mỗi hoạt chất thuốc có thời gian phân hủy khác nhau. Thuốc sinh học sinh hóa thường có PHI ngắn từ 3 - 5 ngày. Thuốc hóa học thế hệ cũ lân hữu cơ hoặc carbamate có PHI dài từ 7 - 14 ngày hoặc hơn.'
        },
        {
          title: 'Hậu quả nguy hại nếu thu hoạch sớm',
          text: 'Thu hoạch bán nông sản chưa đủ ngày cách ly sẽ tồn dư hóa chất độc làm người ăn bị ngộ độc thực phẩm cấp tính hoặc tích lũy gây bệnh ung thư suy gan thận mãn tính nguy hiểm tính mạng.'
        }
      ]
    }
  },
  {
    id: 29,
    slug: 'bao-quan-thuoc-dung-cach',
    title: 'Cách bảo quản thuốc bảo vệ thực vật trong hộ gia đình',
    category: 'Thuốc bảo vệ thực vật',
    categorySlug: 'thuoc-bao-ve-thuc-vat',
    publishDate: '2026-06-04',
    image: 'https://images.unsplash.com/photo-1592424001806-538421319246?auto=format&fit=crop&q=80&w=800',
    summary: 'Quy tắc lưu trữ tủ thuốc cao ráo tránh tầm tay trẻ con giữ nhãn chai sạch nắp vặn kín hơi.',
    sources: ['Cục Bảo vệ Thực vật Việt Nam'],
    content: {
      sections: [
        {
          title: 'Nơi lưu trữ an toàn cao ráo',
          text: 'Thuốc cần được cất trong một tủ riêng hoặc kho riêng nhỏ có khóa bảo mật chắc chắn đặt ở vị trí cao ráo thoáng mát. Tránh xa hoàn toàn khu vực cất thức ăn, gạo gia đình chăn nuôi gia súc.'
        },
        {
          title: 'Giữ nguyên bao bì nhãn mác gốc',
          text: 'Tuyệt đối không chiết rót thuốc trừ sâu hóa học sang chai nhựa đựng nước ngọt, lon bia cũ vì rất dễ gây nhầm lẫn uống phải dẫn đến tử vong thương tâm. Luôn giữ nhãn dán rõ chữ chỉ dẫn của hãng.'
        },
        {
          title: 'Nhiệt độ bảo quản thích hợp',
          text: 'Tránh để thuốc tiếp xúc trực tiếp nguồn sáng mặt trời gay gắt hoặc nhiệt độ kho trên 40 độ C vì nhiệt độ cao có thể làm thuốc bị phân hủy biến đổi hoạt chất mất tác dụng hoặc nổ gây hỏa hoạn.'
        }
      ]
    }
  },
  {
    id: 30,
    slug: 'trang-bi-bao-ho-khi-phun-thuoc',
    title: 'Trang bị bảo hộ bắt buộc khi tiến hành phun thuốc bảo vệ thực vật',
    category: 'Thuốc bảo vệ thực vật',
    categorySlug: 'thuoc-bao-ve-thuc-vat',
    publishDate: '2026-05-29',
    image: 'https://images.unsplash.com/photo-1592424001806-538421319246?auto=format&fit=crop&q=80&w=800',
    summary: 'Danh sách trang bị kính mắt mũ nón quần áo chống thấm khẩu trang hoạt tính ủng cao su.',
    sources: ['Viện Sức khỏe Nghề nghiệp & Môi trường'],
    content: {
      sections: [
        {
          title: 'Trang bị bảo hộ cơ bản đầy đủ',
          text: 'Khi phun xịt thuốc trừ dịch hại, người nông dân bắt buộc phải mặc:\n- Quần áo dài tay bằng vải dù tráng nhựa chống thấm thuốc ẩm vô thân mình.\n- Đeo khẩu trang lọc độc than hoạt tính.\n- Kính nhựa bảo hộ mắt ngăn bụi sương hơi thuốc cay bay vô.\n- Ủng cao su đi ruộng, găng tay nitrile cao su chống trượt.'
        },
        {
          title: 'Quy trình vệ sinh sau khi phun xong',
          text: 'Sau khi phun thuốc kết thúc đợt ruộng dọn dẹp bình xịt xong, phải thay đồ bảo hộ giặt sạch phơi nắng riêng biệt. Người phun đi tắm rửa sạch xà bông gội sạch tóc để loại bỏ hơi thuốc bám rít da cơ thể lập tức.'
        },
        {
          title: 'Lưu ý khi có dấu hiệu ngộ độc mỏi mệt',
          text: 'Nếu trong quá trình phun xịt cảm thấy chóng mặt, buồn nôn, tức ngực mệt mỏi, cần ngưng ngay lập tức tìm nơi râm mát rửa sạch mặt uống nước đường gừng ấm. Nếu nặng đưa đi bệnh viện cấp cứu gấp kèm vỏ chai thuốc.'
        }
      ]
    }
  },

  // ==========================================
  // IV. PHÒNG TRỪ SÂU BỆNH (8 bài viết)
  // ==========================================
  {
    id: 31,
    slug: 'sau-cuon-la',
    title: 'Phòng trừ sâu cuốn lá nhỏ hại lúa lúa ruộng',
    category: 'Phòng trừ sâu bệnh',
    categorySlug: 'phong-tru-sau-benh',
    publishDate: '2026-06-18',
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=800',
    summary: 'Dấu hiệu sâu cuốn lá cuộn tổ dọc biểu bì ăn trắng phiến lá lúa lúa nước và biện pháp trừ diệt.',
    sources: ['Trung tâm Khuyến nông Quốc gia', 'Viện Bảo vệ Thực vật'],
    content: {
      sections: [
        {
          title: '1. Dấu hiệu nhận biết',
          text: 'Sâu cuốn lá nhỏ (Cnaphalocrocis medinalis) hại lá bằng cách nhả tơ cuốn dọc mép lá lúa thành một chiếc tổ hình ống tròn dài. Sâu non ẩn mình bên trong ống tơ ăn biểu bì màu xanh của lá lúa chỉ chừa lại lớp màng tế bào mỏng màu trắng dọc lá tạo thành các vệt sọc trắng làm lúa héo úa xơ xác giảm quang hợp đòng.'
        },
        {
          title: '2. Nguyên nhân bùng phát dịch',
          text: 'Vào đợt thời tiết ẩm mát mẻ mưa nhiều bướm đêm đẻ trứng nở hàng loạt sâu con. Đặc biệt ở ruộng bón thừa đạm lá lúa rậm rạp xanh non mướt bép là ổ lý tưởng cho bướm rải trứng đẻ dày.'
        },
        {
          title: '3. Biện pháp phòng ngừa sinh học',
          text: 'Gieo sạ mật độ vừa phải từ 80 - 100kg hạt giống/ha. Bón đạm cân đối theo bảng so màu lá lúa. Vệ sinh sạch cỏ bờ cỏ dại nơi bướm đêm trú ẩn núp dại.'
        },
        {
          title: '4. Giải pháp xử lý đặc trị',
          text: 'Khi mật độ sâu tuổi nhỏ (độ tuổi 1-2) mọc dày vượt ngưỡng gây hại, phun xịt thuốc chứa hoạt chất sinh học Bacillus thuringiensis (Bt) hoặc thuốc hóa học có đặc tính tiếp xúc nội hấp xông hơi để diệt tận gốc sâu con trong cuốn lá.'
        }
      ]
    }
  },
  {
    id: 32,
    slug: 'ray-nau',
    title: 'Phòng trừ rầy nâu hại lúa lúa truyền bệnh virus',
    category: 'Phòng trừ sâu bệnh',
    categorySlug: 'phong-tru-sau-benh',
    publishDate: '2026-06-15',
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=800',
    summary: 'Cách nhận diện rầy cám rầy trưởng thành chích hút nhựa gây cháy rầy và phòng virus lùn lùn xoắn lá.',
    sources: ['Bộ Nông nghiệp & Phát triển Nông thôn'],
    content: {
      sections: [
        {
          title: '1. Dấu hiệu nhận biết',
          text: 'Rầy nâu (Nilaparvata lugens) bám dày ở gốc bẹ sát mặt nước chích hút nhựa lúa làm thân lúa khô vàng héo khô. Khi mật độ rầy lớn rải đều sẽ tạo các ổ héo khô cháy rầy loang lổ hình tròn màu xám vàng nâu. Rầy còn truyền virus gây bệnh hiểm nghèo lùn xoắn lá lùn sọc đen lúa đẹt bông.'
        },
        {
          title: '2. Nguyên nhân bùng phát',
          text: 'Thời tiết ấm mưa nắng xen kẽ rầy đẻ trứng nhanh. Ruộng sạ dầy bón đạm cao râm rạp, nước ngập úng không thông gió gốc lúa ẩm thấp ẩm mát giúp rầy nhân đàn cực mạnh.'
        },
        {
          title: '3. Biện pháp phòng ngừa sinh học',
          text: 'Sử dụng giống lúa kháng rầy nâu. Thực hiện gieo sạ đồng loạt tập trung né rầy theo lịch nông nghiệp địa phương. Thả vịt ruộng ăn rầy cám giai đoạn lúa đẻ nhánh nhẹ.'
        },
        {
          title: '4. Giải pháp xử lý đặc trị',
          text: 'Khi rầy cám mới nở rộ xịt ngay thuốc đặc trị rầy chống lột xác hoặc thuốc nội hấp thấm gốc. Phun vòi xịt hướng đâm sâu xuống bẹ gốc sát mặt nước mới trúng đích rầy trốn.'
        }
      ]
    }
  },
  {
    id: 33,
    slug: 'benh-dao-on',
    title: 'Phòng trừ bệnh đạo ôn hại lúa (cháy lá lúa)',
    category: 'Phòng trừ sâu bệnh',
    categorySlug: 'phong-tru-sau-benh',
    publishDate: '2026-06-12',
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=800',
    summary: 'Cách chẩn đoán vết bệnh hình thoi thối cổ bông lúa do nấm gây ra và quy trình ngắt đạm phun thuốc.',
    sources: ['Viện Khoa học Nông nghiệp Việt Nam', 'Viện Bảo vệ Thực vật'],
    content: {
      sections: [
        {
          title: '1. Dấu hiệu nhận biết',
          text: 'Bệnh đạo ôn do nấm Pyricularia oryzae gây ra. Trên phiến lá vết bệnh ban đầu là chấm đốm nhỏ màu xanh xám sũng nước, sau mọc rộng thành hình thoi đặc trưng màu nâu nhạt rìa vàng đầu nhọn. Bệnh nặng tấn công cổ bông bông lúa làm thối đen gãy cổ bông bông lúa bạc trắng không hạt.'
        },
        {
          title: '2. Nguyên nhân bùng phát',
          text: 'Nấm bào tử nảy mầm nhanh trong điều kiện mát mẻ nhiệt độ 20-28 độ C âm u nhiều sương mù đẫm nước mặt lá. Ruộng bón quá nhiều phân đạm làm mô tế bào lá lúa mềm mỏng rách nấm dễ chui nhập vô.'
        },
        {
          title: '3. Biện pháp phòng ngừa sinh học',
          text: 'Gieo sạ mật độ thưa hợp lý. Bón phân hữu cơ cân đối nâng sức đề kháng mô tế bào cứng lá. Sử dụng hạt giống sạch bệnh đã xử lý sát trùng.'
        },
        {
          title: '4. Giải pháp xử lý đặc trị',
          text: 'Khi ruộng chớm xuất hiện vết bệnh hình thoi lấm tấm, lập tức ngưng bón tất cả các nguồn đạm hóa học hữu cơ phân phun lá. Tiến hành phun xịt thuốc đặc trị nấm đạo ôn chứa hoạt chất Tricyclazole hoặc Isoprothiolane đều khắp ruộng.'
        }
      ]
    }
  },
  {
    id: 34,
    slug: 'benh-than-thu',
    title: 'Phòng trừ bệnh thán thư hại cây ăn quả xoài sầu riêng',
    category: 'Phòng trừ sâu bệnh',
    categorySlug: 'phong-tru-sau-benh',
    publishDate: '2026-06-09',
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=800',
    summary: 'Dấu hiệu vết bệnh vòng tròn đen lõm thối rụng quả non nấm tấn công và kỹ thuật xử lý vườn thông thoáng.',
    sources: ['Viện Cây ăn quả miền Nam (SOFRI)'],
    content: {
      sections: [
        {
          title: '1. Dấu hiệu nhận biết',
          text: 'Bệnh thán thư do nấm Colletotrichum gây ra. Trên lá vết bệnh ban đầu là đốm nâu đen nhỏ lan dần mọc rộng ra tạo thành mảng cháy lớn giòn khô bể rách. Trên quả sầu riêng, xoài, ớt xuất hiện các đốm lõm tròn xám đen lõm có viền rõ rệt làm thối rữa quả thối thịt rụng cuống quả non.'
        },
        {
          title: '2. Nguyên nhân bùng phát',
          text: 'Nấm nảy bào tử lây lan theo gió và giọt nước mưa đọng lá. Vườn bít rậm rạp cỏ dại um tùm giữ độ ẩm vườn cao tạo điều kiện tối thích nấm nứt bào tử đẻ bông bệnh hại cành.'
        },
        {
          title: '3. Biện pháp phòng ngừa sinh học',
          text: 'Cắt tỉa cành vô hiệu thông thoáng tạo luồng gió đối lưu xuyên cành để vườn mau ráo nước sau mưa. Dọn dẹp tàn dư cành lá rụng thối đen đem đốt sạch.'
        },
        {
          title: '4. Giải pháp xử lý đặc trị',
          text: 'Phun xịt phòng ngừa lúc hoa búp sắp nở cựa đọt. Khi chớm bệnh xịt thuốc diệt nấm chứa gốc đồng (Copper hydroxide), Mancozeb hoặc Azoxystrobin định kỳ 7-10 ngày một lần để khống chế vết bệnh loang rộng.'
        }
      ]
    }
  },
  {
    id: 35,
    slug: 'benh-vang-la',
    title: 'Phòng ngừa bệnh vàng lá thối rễ phục hồi rễ tơ',
    category: 'Phòng trừ sâu bệnh',
    categorySlug: 'phong-tru-sau-benh',
    publishDate: '2026-06-06',
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=800',
    summary: 'Khắc phục cây ăn quả bưởi cam quýt tiêu bị vàng đọt rụng lá rễ tơ thối đen lột vỏ rễ.',
    sources: ['Viện Cây ăn quả miền Nam (SOFRI)', 'Trung tâm Khuyến nông Quốc gia'],
    content: {
      sections: [
        {
          title: '1. Dấu hiệu nhận biết',
          text: 'Lá cây rụng úa bắt đầu từ các đọt gân lá ngọn rụng dần xuống lá già. Đào kiểm tra rễ thấy hệ thống rễ tơ bám bị thối mục đen, vỏ rễ dễ dàng tuột khỏi lõi rễ tơ gỗ bên trong, cây đứng chững không đâm chồi đọt rụng lá trơ xương cành.'
        },
        {
          title: '2. Nguyên nhân phức hợp',
          text: 'Sự tấn công của nấm Fusarium solani phối hợp nấm Phytophthora cướp phá vết thương rễ do tuyến trùng cắn phá khi rễ bị bí khí yếm khí ngập úng rễ lâu ngày.'
        },
        {
          title: '3. Biện pháp phòng ngừa sinh học',
          text: 'Thiết kế hệ thống đê bao thoát lũ rãnh vườn thật sâu thoát nước triệt để mùa mưa. Bón vôi nâng độ pH đất trên 5.5 giúp nấm khó đẻ bào tử. Bón phân hữu cơ vi sinh bọc Trichoderma thường xuyên.'
        },
        {
          title: '4. Giải pháp xử lý đặc trị',
          text: 'Cắt cành ngọn giảm bốc hơi nước. Tưới thuốc diệt tuyến trùng và diệt nấm gốc đồng Metalaxyl vô đất 2 đợt cách nhau 7 ngày. Khi mầm bệnh ngưng hẳn tưới Humic + lân vi lượng kích rễ non mới mọc bật tược xanh.'
        }
      ]
    }
  },
  {
    id: 36,
    slug: 'benh-nam-re',
    title: 'Phòng trừ bệnh nấm rễ (lở cổ rễ thối cổ rễ cây con)',
    category: 'Phòng trừ sâu bệnh',
    categorySlug: 'phong-tru-sau-benh',
    publishDate: '2026-06-03',
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=800',
    summary: 'Cách phát hiện đốm đen thối vòng quanh thân sát đất làm cây con rau màu đổ rạp héo xanh.',
    sources: ['Viện Bảo vệ Thực vật Việt Nam'],
    content: {
      sections: [
        {
          title: '1. Dấu hiệu nhận biết',
          text: 'Thân sát gốc đất của cây con rau màu hoa hồng bị tóp lại thối đen lở cổ rễ bầm ướt. Cây con héo rũ xanh rạp xuống đất nhanh chóng chỉ sau một đêm sương gió rậm.'
        },
        {
          title: '2. Nguyên nhân bùng phát',
          text: 'Do các loài nấm đất Rhizoctonia solani hoặc Pythium tấn công mô non cổ vỏ rễ sát mặt đất ẩm ướt cao bít kín gió yếm khí.'
        },
        {
          title: '3. Biện pháp phòng ngừa sinh học',
          text: 'Giá thể ươm hạt giống phải phơi ải khử trùng vôi bột sạch sẽ. Gieo hạt thưa không gieo thành bụi dầy đè ẩm. Rải nấm đối kháng Trichoderma giữ rãnh khay tơi xốp.'
        },
        {
          title: '4. Giải pháp xử lý đặc trị',
          text: 'Nhổ bỏ các cây con đã thối rạp tiêu hủy. Phun xịt khoanh vùng tưới gốc bằng các hoạt chất trừ nấm bệnh như Validamycin hoặc Pencycuron ngăn lây lan các khay chậu xung quanh.'
        }
      ]
    }
  },
  {
    id: 37,
    slug: 'sau-duc-than',
    title: 'Phòng trừ sâu đục thân đục cành cắn phá cành lúa cành quả',
    category: 'Phòng trừ sâu bệnh',
    categorySlug: 'phong-tru-sau-benh',
    publishDate: '2026-05-31',
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=800',
    summary: 'Cách phát hiện cành héo rũ đùn mạt cưa phân sâu lỗ đục cành gỗ bón thuốc nội hấp cứu cành.',
    sources: ['Trung tâm Khuyến nông Quốc gia'],
    content: {
      sections: [
        {
          title: '1. Dấu hiệu nhận biết',
          text: 'Đỉnh chồi ngọn lúa bị héo úa bạc trắng (bông bạc khô hạt). Trên cành cây gỗ cây ăn quả có lỗ nhỏ đùn ra mạt gỗ bột cưa phân sâu li ti, cành lá phía trên lỗ đục héo rũ từ từ rụng lá chết khô cành gãy đổ.'
        },
        {
          title: '2. Nguyên nhân chu kỳ',
          text: 'Bướm đục thân hoặc xén tóc đẻ trứng nách lá vỏ gỗ. Sâu con nở đục xuyên qua lớp vỏ đi dọc ruột gỗ mạch dẫn thân để ăn sinh tủy gỗ bít đường nước nuôi cành.'
        },
        {
          title: '3. Biện pháp phòng ngừa sinh học',
          text: 'Bẫy đèn diệt bướm đêm mùa đẻ trứng. Quét vôi bột vôi đặc quanh gốc cây ăn quả lớn cao 1m để ngăn xén tóc đẻ trứng vỏ gốc cây.'
        },
        {
          title: '4. Giải pháp xử lý đặc trị',
          text: 'Cắt cành héo dưới lỗ đục đem đốt diệt sâu con trốn ruột. Dùng kim tiêm bơm trực tiếp nước thuốc trừ sâu độc tính xông hơi mạnh (Ví dụ Chlorpyrifos Ethyl hoặc Diazinon) vào lỗ đục rồi dùng đất sét trét bít lỗ lại ép sâu nghẹt chết trong ruột gỗ.'
        }
      ]
    }
  },
  {
    id: 38,
    slug: 'bo-tri',
    title: 'Phòng trừ bọ trĩ (bù lạch) hại đọt hoa hồng dưa leo',
    category: 'Phòng trừ sâu bệnh',
    categorySlug: 'phong-tru-sau-benh',
    publishDate: '2026-05-27',
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=800',
    summary: 'Biểu hiện đọt non xoăn ngửa lòng thuyền mép đen vệt xám bạc nách bông hoa và cách phòng trừ bọ trĩ lờn thuốc.',
    sources: ['Viện Bảo vệ Thực vật', 'Tài liệu khuyến nông tỉnh Lâm Đồng'],
    content: {
      sections: [
        {
          title: '1. Dấu hiệu nhận biết',
          text: 'Bọ trĩ (Thrips) chích hút đọt ngọn non làm lá bị quăn xoăn ngửa lên phía trên như chiếc thuyền mép lá khô đen cong. Cánh hoa hồng hoa ly bị sậm đen vệt rách không bung cánh đều. Mặt dưới lá xuất hiện vệt bạc xám bóng nhợt.'
        },
        {
          title: '2. Nguyên nhân bùng phát',
          text: 'Thời tiết khô ráo nóng nắng gắt mùa nắng tạo điều kiện bọ trĩ đẻ sinh sôi siêu nhanh bầy đàn hàng vạn con hút mủ.'
        },
        {
          title: '3. Biện pháp phòng ngừa sinh học',
          text: 'Tưới nước dạng vòi phun mưa áp lực phun từ dưới ngửa lên đọt bông để rửa trôi bọ trĩ bám lá. Thả thiên địch bọ rùa săn mồi.'
        },
        {
          title: '4. Giải pháp xử lý đặc trị',
          text: 'Bọ trĩ đẻ vòng ngắn nhanh lờn thuốc rất mạnh. Phải phun xịt luân phiên các hoạt chất thuốc trừ bọ trĩ khác nhóm hóa học (Ví dụ Imidacloprid phối Spinetoram hoặc dầu khoáng hữu cơ Neem oil) phun đẫm lúc sáng sớm khi bọ trĩ bò ra hoạt động đọt.'
        }
      ]
    }
  },

  // ==========================================
  // V. KỸ THUẬT CANH TÁC (7 bài viết)
  // ==========================================
  {
    id: 39,
    slug: 'ky-thuat-trong-cay',
    title: 'Quy trình kỹ thuật đào hố đặt bầu trồng cây gỗ cây ăn quả',
    category: 'Kỹ thuật canh tác',
    categorySlug: 'ky-thuat-canh-tac',
    publishDate: '2026-06-19',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=800',
    summary: 'Chuẩn bị hố trồng đúng kích thước bón lót phân chuồng xử lý nấm và cố định bầu rễ giữ mát cây con mới cắm xuống đất.',
    sources: ['Trung tâm Khuyến nông Quốc gia'],
    content: {
      sections: [
        {
          title: '1. Đào hố và bón lót nền móng',
          text: 'Kích thước hố trồng cây ăn quả thông dụng từ 60x60x60cm. Trộn lớp đất mặt hố đào lên với 10-15kg phân chuồng hoai mục + 0.5kg phân lân + 50g vôi bột khử khuẩn. Lấp đầy hố ủ đất trước khi xuống cây con tối thiểu 15-20 ngày.'
        },
        {
          title: '2. Kỹ thuật hạ bầu cây con',
          text: 'Dùng dao cắt túi nilon bầu đất nhẹ nhàng tránh làm bể nát vỡ bầu đất đứt rễ con. Đặt bầu đứng chính giữa hố. Mặt bầu đất nằm ngang hoặc cao hơn mặt đất vườn 2-3cm (tránh trồng quá sâu ngập cổ rễ làm thối gốc nghẹt rễ sau này).'
        },
        {
          title: '3. Cố định cọc giữ và che bóng mát',
          text: 'Nén đất quanh bầu chặt vừa. Cắm chéo 2 cọc tre buộc dây giữ thân cây con tránh gió rung lay đứt rễ non mọc rễ tơ bám đất. Làm mái che bóng bằng tàu dừa lá chuối che bớt nắng 30-50% trong 2 tuần đầu cây cắm móng vườn.'
        }
      ]
    }
  },
  {
    id: 40,
    slug: 'ky-thuat-tuoi-nuoc',
    title: 'Các kỹ thuật tưới nước hiệu quả tiết kiệm trong trồng trọt',
    category: 'Kỹ thuật canh tác',
    categorySlug: 'ky-thuat-canh-tac',
    publishDate: '2026-06-16',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=800',
    summary: 'So sánh tưới phun mưa tưới nhỏ giọt kiểm soát độ ẩm mặt và rễ tránh bệnh dịch lây qua vòi tưới.',
    sources: ['Viện Khoa học Thủy lợi Việt Nam'],
    content: {
      sections: [
        {
          title: 'Kỹ thuật tưới phun mưa tự động',
          text: 'Sử dụng béc phun xoay nước đều đẫm trên tán lá. Rất thích hợp tưới thảm cỏ vườn rau ăn lá chè cà phê. Giúp làm sạch mát lá bụi bẩn bụi đất bám lá trôi bọ trĩ nhện đỏ mặt dưới lá non hiệu quả.'
        },
        {
          title: 'Kỹ thuật tưới nhỏ giọt công nghệ Israel',
          text: 'Nước tưới chảy rỉ nhỏ giọt từ từ đúng vị trí rễ tơ dưới gốc qua đường ống nhỏ giọt. Tiết kiệm nước đến 50% tránh xối đất trôi dinh dưỡng phân hóa học. Giúp mặt đất tán lá khô ráo hạn chế tối đa độ ẩm bùng nấm lá bệnh lây.'
        },
        {
          title: 'Nguyên tắc giờ tưới nước sinh học',
          text: 'Tưới lúc sáng sớm tinh sương hoặc chiều mát lịm hoàng hôn. Tuyệt đối không tưới đẫm nước ngập vườn giữa trưa nắng gắt 40 độ C vì sẽ làm sôi nóng nước rễ cây gây luộc chín rễ cây chết đột ngột.'
        }
      ]
    }
  },
  {
    id: 41,
    slug: 'cai-tao-dat',
    title: 'Kỹ thuật cải tạo đất vườn chai cứng thoái hóa hóa học',
    category: 'Kỹ thuật canh tác',
    categorySlug: 'ky-thuat-canh-tac',
    publishDate: '2026-06-13',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=800',
    summary: 'Các bước xả chua xả phèn bón hữu cơ vi sinh than bùn phục hồi lớp mùn keo phì nhiêu cho đất.',
    sources: ['Viện Thổ nhưỡng Nông hóa Việt Nam'],
    content: {
      sections: [
        {
          title: '1. Khử độc xả phèn nâng pH',
          text: 'Rải vôi bột nông nghiệp liều lượng 50-100g/m2 xới đất mặt nông phơi ải nắng 7 ngày. Tưới nước xả trôi phèn chua ra các kênh rãnh nhỏ thoát mương vườn bớt chất phèn tự do độc rễ.'
        },
        {
          title: '2. Tái tạo chất mùn xốp móng',
          text: 'Bón lượng lớn phân compost phân hữu cơ hoai mục than bùn vỏ trấu mục sơ dừa mục dừa hoai. Hạn chế lạm dụng cuốc xới sâu làm đứt nát cấu trúc xốp giun đất tự sinh.'
        },
        {
          title: '3. Trồng cây che phủ phân xanh xanh phân',
          text: 'Trồng xen cây họ đậu (đậu xanh, muồng cỏ lau) phủ gốc mặt. Lớp vi khuẩn nốt sần Rhizobium rễ cây họ đậu cố định đạm đút trả lượng đạm mùn hữu cơ mát rượi đất vườn phục hồi sinh khối.'
        }
      ]
    }
  },
  {
    id: 42,
    slug: 'u-phan-huu-co',
    title: 'Quy trình ủ phân hữu cơ hoai mục bằng chế phẩm vi sinh',
    category: 'Kỹ thuật canh tác',
    categorySlug: 'ky-thuat-canh-tac',
    publishDate: '2026-06-10',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=800',
    summary: 'Tận dụng phế phẩm nông nghiệp vỏ trấu bã mía phân thô ủ đậy bạt lên men diệt hạt cỏ hạt cỏ mầm mống sâu.',
    sources: ['Trung tâm Khuyến nông Quốc gia'],
    content: {
      sections: [
        {
          title: '1. Chuẩn bị nguyên liệu phối trộn',
          text: 'Thu gom phân chuồng thô (phân bò tươi lợn dê trâu) phối trộn bã thực vật khô (vỏ trấu, bã mía, rơm rạ mục nghiền nhỏ) tỷ lệ thích hợp 3 phần phân chuồng : 1 phần xơ bã thực vật. Hòa tan gói men vi sinh Trichoderma tưới ẩm phun đều.'
        },
        {
          title: '2. Tạo đống ủ và che phủ kín bạt',
          text: 'Vun nguyên liệu tạo đống cao khoảng 1 - 1.5m đầm nén vừa. Tưới nước ẩm độ ẩm đống đạt 50-60% (vắt chặt tay nước rỉ kẽ ngón không nhỏ giọt là chuẩn). Che đậy bạt nilon kín mít giữ nhiệt đống ủ.'
        },
        {
          title: '3. Đảo trộn kiểm tra độ chín phân',
          text: 'Sau 15 ngày nhiệt ruột đống tăng vọt lên 55-65 độ C diệt sạch hạt cỏ dại bào tử nấm mầm bệnh sâu hại. Tiến hành đảo trộn lật tung đống ủ định kỳ 20 ngày bổ sung nước ẩm nhẹ. Sau 60-90 ngày đống ủ nguội dần tơi xốp màu nâu sẫm không mùi hôi bón vườn cực lành tính.'
        }
      ]
    }
  },
  {
    id: 43,
    slug: 'trong-cay-theo-mua-vu',
    title: 'Ý nghĩa của việc gieo trồng đúng lịch mùa vụ',
    category: 'Kỹ thuật canh tác',
    categorySlug: 'ky-thuat-canh-tac',
    publishDate: '2026-06-07',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=800',
    summary: 'Nắm lịch gieo trồng lúa hè thu đông xuân né mặn né lũ hạn chế bùng dịch rầy sâu hại đợt chu kỳ mùa.',
    sources: ['Cục Trồng trọt - Bộ Nông nghiệp & PTNT'],
    content: {
      sections: [
        {
          title: 'Tận dụng thời tiết nhiệt độ khí hậu tự nhiên',
          text: 'Gieo trồng đúng lịch giúp cây con hấp thụ ánh sáng độ ấm tốt nhất tránh gặp thời tiết cực đoan như lạnh sương muối, nắng nóng thiêu đốt làm thối rụng mầm hoa quả non khô khan rễ cọc.'
        },
        {
          title: 'Tránh né sâu bệnh bùng phát chu kỳ',
          text: 'Sâu bướm rầy bùng dịch theo chu kỳ mùa nắng khô hoặc ẩm mưa dầm. Xuống giống né đợt bướm rầy di cư giúp bảo vệ cây non không cần phun thuốc trừ sâu hóa độc bộc lộ đợt đầu ruộng.'
        },
        {
          title: 'Né mặn xâm nhập ĐBSCL và mùa lũ ngập',
          text: 'Vùng ven biển phải gieo hạt gieo lúa vụ Đông Xuân kết thúc sớm trước khi nước mặn lấn mương biển sông sâu. Vùng lũ lụt hái hái xong trái cây sầu riêng mít Thái trước tháng 9 âm lịch mưa nguồn xả lũ ngập vườn.'
        }
      ]
    }
  },
  {
    id: 44,
    slug: 'canh-tac-huu-co',
    title: 'Quy trình canh tác hữu cơ theo tiêu chuẩn PGS',
    category: 'Kỹ thuật canh tác',
    categorySlug: 'ky-thuat-canh-tac',
    publishDate: '2026-06-04',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=800',
    summary: 'Quy tắc ngắt tuyệt đối phân bón hóa học thuốc BVTV tổng hợp giữ vùng đệm khoảng cách vườn.',
    sources: ['Hiệp hội Nông nghiệp Hữu cơ Việt Nam'],
    content: {
      sections: [
        {
          title: 'Không sử dụng hóa chất tổng hợp',
          text: 'Tuyệt đối cấm sử dụng các loại phân bón hóa học vô cơ tan nhanh đạm SA Ure NPK hóa học, các thuốc diệt cỏ cỏ dại, thuốc trừ sâu rầy trừ nấm bệnh tổng hợp từ dầu mỏ hóa học.'
        },
        {
          title: 'Thiết kế vùng đệm cách ly luồng độc',
          text: 'Vườn hữu cơ cần có hàng rào cây xanh hoặc rãnh nước đệm rộng 2-3m xung quanh ranh đất để chặn dòng nước xối tràn chảy chứa phân hóa học hoặc thuốc BVTV của ruộng bên ngoài bay gió lây nhiễm sang.'
        },
        {
          title: 'Sử dụng thiên địch và thuốc bảo vệ sinh học',
          text: 'Bảo vệ nuôi dưỡng bọ rùa ong ký sinh thiên địch. Sử dụng gừng ớt tỏi củ chế nước dầu neem bám dính xịt xua sâu, dùng chế phẩm Trichoderma, nấm Metarhizium để trừ nấm rầy tự nhiên.'
        }
      ]
    }
  },
  {
    id: 45,
    slug: 'canh-tac-ben-vung',
    title: 'Canh tác nông nghiệp bền vững kết hợp đa dạng sinh học',
    category: 'Kỹ thuật canh tác',
    categorySlug: 'ky-thuat-canh-tac',
    publishDate: '2026-06-01',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=800',
    summary: 'Xây dựng vườn rừng đa tầng luân canh họ đậu giữ nguồn nước ngầm bảo vệ đất đai dài lâu tương lai.',
    sources: ['Viện Khoa học Nông nghiệp Việt Nam', 'Tổ chức FAO Việt Nam'],
    content: {
      sections: [
        {
          title: 'Đa dạng sinh học đa tầng tán cành',
          text: 'Hạn chế độc canh một cây duy nhất (độc canh cà phê tiêu sầu riêng). Nên xen canh trồng đa tầng: Tầng cao che bóng mát giữ ẩm lớn (muồng đen dừa cây lớn) -> Tầng trung kinh doanh (sầu riêng cà phê cam quýt) -> Tầng thấp rau ngắn ngày che mặt cỏ -> Tầng ngầm thảm cỏ che phủ mọc rễ tơi đất giữ nước.'
        },
        {
          title: 'Luân canh luân canh cây họ đậu đút trả đất',
          text: 'Trồng luân phiên rau màu lúa vụ xen với các loài đỗ họ đậu lạc đỗ để trả lại chất mùn cấu trúc xốp tự nhiên cho đất đất màu mỡ tự sinh.'
        },
        {
          title: 'Bảo vệ nguồn tài nguyên đất nước dài lâu',
          text: 'Sử dụng tưới nước nhỏ giọt hạn chế xói mòn rửa đất dốc đồi. Ủ phân hữu cơ tại vườn giảm chi phí nhập khẩu năng lượng bảo tồn đa dạng hệ sinh thái và nguồn nước ngầm phục vụ cuộc sống bền vững nông dân mai sau.'
        }
      ]
    }
  }
];
