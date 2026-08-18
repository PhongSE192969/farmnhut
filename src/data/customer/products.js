// Danh mục sản phẩm thật của cửa hàng khách hàng (thương hiệu MeriFarm).
// Ảnh là ảnh sản phẩm thật do người dùng cung cấp (xem ATTRIBUTION.md).
// Các trường chưa xác nhận với đội vận hành (xuất xứ, tồn kho...) được đánh
// dấu rõ "Đang cập nhật" thay vì bịa số liệu — theo đúng cách trang chi tiết
// mẫu người dùng gửi đã làm.
//
// Giá bán giữ nguyên từ dữ liệu "Sản phẩm nổi bật" trên trang chủ
// (xem src/data/customer/highlightProducts.js) — đây vẫn là giá tạm thời,
// cần thay bằng giá niêm yết chính thức trước khi lên production.

export const PRODUCT_CATEGORIES = ["Phân bón NPK", "Phân hữu cơ vi sinh", "Phân bón lá", "Phân bón rễ"];

export const CROP_TYPES = ["Lúa", "Rau màu", "Cây ăn trái", "Hoa kiểng", "Cây công nghiệp", "Cây trồng trong chậu"];

export const USAGE_NEEDS = ["Ra rễ", "Lớn trái - đẹp màu", "Cải tạo đất", "Chống đổ ngã", "Ra hoa - đậu trái", "Tăng năng suất"];

const DISTRIBUTOR = "CÔNG TY TNHH PHÁT TRIỂN KỸ THUẬT TÂM PHÚC";

const products = [
  {
    id: "magie-bo-kem",
    name: "Magie Bo Kẽm No.1",
    brand: "MeriFarm",
    badges: ["Bán chạy"],
    category: "Phân bón lá",
    cropTypes: ["Cây ăn trái", "Rau màu", "Hoa kiểng", "Cây trồng trong chậu"],
    unit: "Gói 500g",
    price: 72000,
    image: "/assets/customer/products/magie-bo-kem.png",
    imageAlt: "Gói Magie Bo Kẽm No.1 MeriFarm, ảnh sản phẩm thật",
    tagline: "Lớn trái, đẹp màu, đẻ nhánh sai hoa, mập đọt.",
    description: "Phân bón lá trung vi lượng giúp lớn trái, đẹp màu, ra rễ mạnh và xanh dày lá.",
    form: "Bột hòa tan",
    mainIngredients: "Mg, Bo, Kẽm, Fe, Mn",
    mainUse: "Lớn trái, đẹp màu, ra rễ",
    usageNeeds: ["Ra rễ", "Lớn trái - đẹp màu"],
    overview:
      "Magie Bo Kẽm No.1 là phân bón lá trung vi lượng dạng bột hòa tan, hỗ trợ cây trồng bổ sung các nguyên tố vi lượng thiết yếu như Magie, Bo, Kẽm, Sắt và Mangan — những yếu tố đóng vai trò quan trọng trong quá trình sinh trưởng, ra hoa, đậu trái và tạo màu sắc trái.",
    overviewExtra:
      "Sản phẩm phù hợp cho nhiều nhóm cây trồng, đặc biệt trong các giai đoạn cây ra hoa, đậu trái, phát triển lá non và khi cây có biểu hiện thiếu vi lượng như đọt xoắn, lá vàng bạc màu.",
    benefits: [
      { icon: "Leaf", title: "Lá xanh dày, mượt lá", description: "Hỗ trợ bổ sung Magie và vi lượng giúp lá xanh dày, mượt và tăng hiệu quả quang hợp." },
      { icon: "Sun", title: "Lớn trái, đẹp màu", description: "Góp phần cải thiện kích thước, màu sắc và chất lượng trái thông qua bổ sung Kẽm và Bo." },
      { icon: "Sprout", title: "Ra rễ, đẻ nhánh", description: "Hỗ trợ phát triển bộ rễ và kích thích đẻ nhánh, sai hoa trong giai đoạn sinh trưởng." },
      { icon: "ShieldCheck", title: "Hạn chế thiếu vi lượng", description: "Phù hợp khi cây có dấu hiệu đọt xoắn, chùn đọt, vàng lá hoặc thiếu khoáng vi lượng." },
    ],
    symptoms: [
      { icon: "AlertTriangle", title: "Cây có đọt xoắn", description: "Hỗ trợ khi cây có hiện tượng đọt xoắn hoặc chùn đọt do thiếu vi lượng." },
      { icon: "Leaf", title: "Lá vàng, bạc màu", description: "Phù hợp khi lá cây có dấu hiệu vàng nhạt hoặc thiếu dinh dưỡng vi lượng." },
      { icon: "Sun", title: "Trái nhỏ, màu nhạt", description: "Hỗ trợ giai đoạn nuôi trái khi trái chậm lớn hoặc màu sắc chưa đẹp." },
      { icon: "Sprout", title: "Cây ít hoa, đậu ít", description: "Phù hợp cây ra hoa kém hoặc tỉ lệ đậu trái thấp hơn bình thường." },
      { icon: "Zap", title: "Sau giai đoạn stress", description: "Giúp bổ sung vi lượng cho cây sau thời kỳ chịu hạn, ngập úng hoặc sâu bệnh." },
    ],
    howToUse:
      "Pha loãng theo hướng dẫn trên bao bì, phun đều lên lá vào sáng sớm hoặc chiều mát. Nên phun định kỳ theo giai đoạn sinh trưởng, tăng cường khi cây có dấu hiệu thiếu vi lượng.",
    storage: "Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp. Đậy kín bao bì sau khi sử dụng.",
    origin: "Đang cập nhật",
    distributor: DISTRIBUTOR,
  },
  {
    id: "ph-balance",
    name: "pH Balance",
    brand: "MeriFarm",
    badges: ["Mới", "Bán chạy"],
    category: "Phân hữu cơ vi sinh",
    cropTypes: ["Cây ăn trái", "Rau màu", "Cây công nghiệp"],
    unit: "Hũ 1kg",
    price: 127000,
    image: "/assets/customer/products/ph-balance.png",
    imageAlt: "Hũ pH Balance (Humate 79 Grown) MeriFarm, ảnh sản phẩm thật",
    tagline: "Cân đối pH, siêu ra rễ, phát đọt cực mạnh.",
    description: "Phân bón sinh học nâng pH, cải tạo đất, kích thích ra rễ và phục hồi cây trồng.",
    form: "Dạng hạt tan",
    mainIngredients: "Humate (axit humic)",
    mainUse: "Nâng pH, cải tạo đất, ra rễ",
    usageNeeds: ["Ra rễ", "Cải tạo đất"],
    overview:
      "pH Balance (Humate 79 Grown) là dòng sản phẩm gốc humate, hỗ trợ nâng pH đất, cải tạo cấu trúc đất bạc màu và kích thích bộ rễ phát triển mạnh — phù hợp cho đất bị chua phèn hoặc canh tác lâu năm.",
    overviewExtra:
      "Sản phẩm thường được dùng để phục hồi cây sau giai đoạn suy yếu, giúp cây ra rễ mới và phát đọt trở lại nhanh hơn.",
    benefits: [
      { icon: "Sparkles", title: "Cân đối pH đất", description: "Hỗ trợ nâng pH cho đất chua phèn, tạo môi trường thuận lợi hơn cho bộ rễ." },
      { icon: "Sprout", title: "Siêu ra rễ", description: "Kích thích bộ rễ phát triển mạnh, đặc biệt hữu ích sau khi bón lót hoặc trồng mới." },
      { icon: "Leaf", title: "Phát đọt cực mạnh", description: "Hỗ trợ cây bung đọt non đồng loạt sau giai đoạn phục hồi." },
      { icon: "ShieldCheck", title: "Cải tạo đất bạc màu", description: "Góp phần cải thiện cấu trúc đất, tăng khả năng giữ ẩm và dinh dưỡng." },
    ],
    symptoms: [
      { icon: "AlertTriangle", title: "Đất chua, phèn", description: "Phù hợp cho vườn/ruộng có đất chua phèn cần nâng pH trước khi bón phân chính." },
      { icon: "Sprout", title: "Cây chậm ra rễ mới", description: "Hỗ trợ khi cây trồng mới hoặc sau cắt tỉa chậm phát triển bộ rễ." },
      { icon: "Leaf", title: "Cây suy yếu sau bệnh", description: "Giúp cây phục hồi sau giai đoạn sâu bệnh hoặc thời tiết bất lợi." },
      { icon: "Sun", title: "Đất canh tác lâu năm", description: "Phù hợp đất trồng lâu năm, cấu trúc đất bị chai cứng, bạc màu." },
      { icon: "Zap", title: "Trước khi vào vụ mới", description: "Dùng cải tạo đất, chuẩn bị nền tảng trước khi xuống giống hoặc bón thúc." },
    ],
    howToUse:
      "Hòa tan theo liều lượng khuyến nghị trên bao bì, tưới gốc hoặc phun qua lá. Có thể kết hợp với phân bón gốc để tăng hiệu quả hấp thu.",
    storage: "Bảo quản nơi khô ráo, thoáng mát, tránh ẩm ướt làm vón cục sản phẩm.",
    origin: "Đang cập nhật",
    distributor: DISTRIBUTOR,
  },
  {
    id: "ra-re-no-bui",
    name: "Ra Rễ – Nở Bụi",
    brand: "MeriFarm",
    badges: ["Bán chạy"],
    category: "Phân bón rễ",
    cropTypes: ["Lúa"],
    unit: "Chai 250ml",
    price: 90000,
    image: "/assets/customer/products/ra-re-no-bui.png",
    imageAlt: "Chai Ra Rễ – Nở Bụi MeriFarm, ảnh sản phẩm thật",
    tagline: "Ra rễ mạnh, đẻ nhánh, giải độc, hạ phèn, cân bằng pH.",
    description: "Phân bón NPK 10-4-4 chuyên dùng cho lúa, giúp ra rễ mạnh, nở bụi và hạ phèn đất.",
    form: "Dạng lỏng",
    mainIngredients: "NPK 10-4-4",
    mainUse: "Ra rễ, nở bụi, hạ phèn",
    usageNeeds: ["Ra rễ", "Cải tạo đất"],
    overview:
      "Ra Rễ – Nở Bụi là phân bón NPK 10-4-4 dạng lỏng, chuyên dùng cho lúa ở giai đoạn đầu vụ, giúp lúa ra rễ mạnh, đẻ nhánh khỏe và hỗ trợ giải độc, hạ phèn cho đất ruộng.",
    overviewExtra:
      "Phù hợp bón khi lúa mới cấy/sạ, hoặc khi ruộng bị ngộ độc hữu cơ, phèn nặng sau khi làm đất.",
    benefits: [
      { icon: "Sprout", title: "Ra rễ mạnh", description: "Kích thích bộ rễ lúa phát triển sâu và khỏe ngay từ đầu vụ." },
      { icon: "Leaf", title: "Đẻ nhánh khỏe", description: "Hỗ trợ lúa đẻ nhánh tập trung, tăng số bông hữu hiệu." },
      { icon: "ShieldCheck", title: "Giải độc, hạ phèn", description: "Hỗ trợ giải độc hữu cơ và hạ phèn cho đất ruộng sau khi làm đất." },
      { icon: "Sparkles", title: "Cân bằng pH", description: "Góp phần ổn định pH đất ruộng, tạo điều kiện thuận lợi cho rễ lúa." },
    ],
    symptoms: [
      { icon: "AlertTriangle", title: "Ruộng bị ngộ độc hữu cơ", description: "Phù hợp cho ruộng có mùi hôi, bọt khí sau khi làm đất do phân hủy rơm rạ." },
      { icon: "Sprout", title: "Lúa chậm bén rễ", description: "Hỗ trợ khi lúa mới cấy/sạ chậm bén rễ hồi xanh." },
      { icon: "Leaf", title: "Đẻ nhánh kém", description: "Phù hợp khi lúa đẻ nhánh chậm hoặc không tập trung." },
      { icon: "Sun", title: "Đất nhiễm phèn", description: "Hỗ trợ ruộng đất phèn, đất chua cần hạ phèn trước khi bón thúc." },
      { icon: "Zap", title: "Đầu vụ, sau sạ/cấy", description: "Dùng giai đoạn đầu vụ để lúa nhanh hồi xanh, phát triển đồng đều." },
    ],
    howToUse:
      "Pha với nước sạch theo tỷ lệ khuyến nghị trên nhãn, phun đều lên ruộng lúa giai đoạn đầu vụ. Có thể kết hợp cùng đợt bón phân lót.",
    storage: "Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp, để xa tầm tay trẻ em.",
    origin: "Đang cập nhật",
    distributor: DISTRIBUTOR,
  },
  {
    id: "vo-gao-nhanh",
    name: "Vỏ Gạo Nhanh",
    brand: "MeriFarm",
    badges: ["Mới", "Bán chạy"],
    category: "Phân bón lá",
    cropTypes: ["Lúa"],
    unit: "Chai 250ml",
    price: 85000,
    image: "/assets/customer/products/vo-gao-nhanh.png",
    imageAlt: "Chai Vỏ Gạo Nhanh MeriFarm, ảnh sản phẩm thật",
    tagline: "Hạt to, sáng bóng, chín cứng cây, tăng năng suất.",
    description: "Phân bón lá chuyên dùng cho lúa giai đoạn vào chắc, giúp hạt to, sáng bóng và chín đều.",
    form: "Dạng lỏng",
    mainIngredients: "Đang cập nhật",
    mainUse: "Vào chắc, sáng hạt, tăng năng suất",
    usageNeeds: ["Tăng năng suất", "Chống đổ ngã"],
    overview:
      "Vỏ Gạo Nhanh là phân bón lá chuyên dùng cho lúa ở giai đoạn vào chắc — sau trổ, hỗ trợ hạt lúa to đều, vỏ trấu sáng bóng và cây cứng cáp đến khi chín, hạn chế đổ ngã cuối vụ.",
    overviewExtra: "Phù hợp phun trong giai đoạn lúa vào chắc đến trước thu hoạch để tối ưu năng suất và chất lượng hạt.",
    benefits: [
      { icon: "Sun", title: "Xanh lá, dày lá", description: "Hỗ trợ lá đòng xanh dày, duy trì quang hợp tốt đến cuối vụ." },
      { icon: "ShieldCheck", title: "Chín cứng cây", description: "Giúp cây cứng cáp, hạn chế đổ ngã trong giai đoạn lúa chín." },
      { icon: "Sparkles", title: "Hạt to, sáng bóng", description: "Hỗ trợ hạt lúa vào chắc đều, vỏ trấu sáng bóng, ít lép." },
      { icon: "Leaf", title: "Tăng năng suất", description: "Góp phần tăng năng suất và chất lượng hạt khi thu hoạch." },
    ],
    symptoms: [
      { icon: "AlertTriangle", title: "Lúa vào chắc chậm", description: "Phù hợp khi lúa sau trổ vào chắc chậm hoặc không đều." },
      { icon: "Leaf", title: "Hạt lép nhiều", description: "Hỗ trợ giảm tỉ lệ hạt lép, giúp bông lúa chắc hạt hơn." },
      { icon: "Sun", title: "Cây yếu, dễ đổ ngã", description: "Giúp cây cứng cáp hơn trong giai đoạn lúa chín, hạn chế đổ ngã." },
      { icon: "Sprout", title: "Lá đòng vàng sớm", description: "Hỗ trợ duy trì lá đòng xanh lâu hơn để nuôi hạt." },
      { icon: "Zap", title: "Trước thu hoạch", description: "Dùng giai đoạn vào chắc đến trước thu hoạch để tối ưu năng suất." },
    ],
    howToUse:
      "Pha với nước sạch theo tỷ lệ khuyến nghị trên nhãn, phun đều lên lá vào giai đoạn lúa vào chắc, tránh phun sát ngày thu hoạch.",
    storage: "Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp.",
    origin: "Đang cập nhật",
    distributor: DISTRIBUTOR,
  },
  {
    id: "lun-cay-ruoc-dong",
    name: "Lùn Cây – Rước Đòng",
    brand: "MeriFarm",
    badges: ["Bán chạy"],
    category: "Phân bón NPK",
    cropTypes: ["Lúa"],
    unit: "Chai 250ml",
    price: 89000,
    image: "/assets/customer/products/lun-cay-ruoc-dong.png",
    imageAlt: "Chai Lùn Cây – Rước Đòng MeriFarm, ảnh sản phẩm thật",
    tagline: "Ngắn lóng, cứng cây, hạn chế đổ ngã, trổ thoát đồng loạt.",
    description: "Phân bón lá NPK chuyên dùng cho lúa giai đoạn làm đòng, giúp ngắn lóng, cứng cây và trổ đồng loạt.",
    form: "Dạng lỏng",
    mainIngredients: "NPK (phân bón lúa 12)",
    mainUse: "Ngắn lóng, cứng cây, rước đòng",
    usageNeeds: ["Chống đổ ngã", "Ra hoa - đậu trái"],
    overview:
      "Lùn Cây – Rước Đòng là phân bón lá NPK chuyên dùng cho lúa ở giai đoạn làm đòng, giúp lóng ngắn lại, thân cây cứng cáp và hỗ trợ lúa trổ thoát bông đồng loạt.",
    overviewExtra: "Phù hợp phun vào giai đoạn lúa làm đòng — trước trổ, đặc biệt hữu ích với ruộng có nguy cơ lốp đổ.",
    benefits: [
      { icon: "ShieldCheck", title: "Ngắn lóng, cứng cây", description: "Giúp lóng lúa ngắn lại, thân cứng cáp, hạn chế đổ ngã khi có gió mạnh." },
      { icon: "Sprout", title: "Rước đòng đều", description: "Hỗ trợ quá trình làm đòng diễn ra đồng đều trên toàn ruộng." },
      { icon: "Sun", title: "Trổ thoát đồng loạt", description: "Giúp bông lúa trổ thoát nhanh và đồng loạt, hạn chế trổ lai rai." },
      { icon: "Leaf", title: "Giảm nguy cơ lốp đổ", description: "Phù hợp cho ruộng lúa tốt, xanh mướt có nguy cơ lốp, đổ ngã." },
    ],
    symptoms: [
      { icon: "AlertTriangle", title: "Ruộng lúa tốt, dễ lốp", description: "Phù hợp ruộng lúa phát triển tốt, thân cao, có nguy cơ đổ ngã khi làm đòng." },
      { icon: "Sprout", title: "Sắp vào giai đoạn làm đòng", description: "Dùng đúng giai đoạn lúa chuẩn bị làm đòng để tối ưu hiệu quả." },
      { icon: "Leaf", title: "Trổ không đều, lai rai", description: "Hỗ trợ khi ruộng lúa có dấu hiệu trổ không đồng loạt." },
      { icon: "Sun", title: "Thân lóng dài, yếu", description: "Giúp rút ngắn lóng, tăng độ cứng cây trước khi trổ." },
      { icon: "Zap", title: "Vùng thường có gió, mưa lớn", description: "Phù hợp ruộng ở khu vực dễ bị đổ ngã do thời tiết." },
    ],
    howToUse:
      "Pha với nước sạch theo tỷ lệ khuyến nghị trên nhãn, phun đều lên lá vào giai đoạn lúa làm đòng, trước khi trổ bông.",
    storage: "Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp.",
    origin: "Đang cập nhật",
    distributor: DISTRIBUTOR,
  },
  {
    id: "loang-trai-tham-sau",
    name: "Loang Trải – Thấm Sâu",
    brand: "MeriFarm",
    badges: [],
    category: "Phân bón lá",
    cropTypes: ["Lúa", "Rau màu", "Cây ăn trái", "Cây công nghiệp"],
    unit: "Chai 100ml",
    price: 65000,
    image: "/assets/customer/products/loang-trai.png",
    imageAlt: "Chai Loang Trải – Thấm Sâu MeriFarm, ảnh sản phẩm thật",
    tagline: "Thấm sâu, loang trải đều, tăng bám dính, kích nở khí khổng.",
    description: "Chế phẩm trộn cùng phân/thuốc, giúp dung dịch loang trải đều, thấm sâu và bám dính tốt hơn trên lá.",
    form: "Dạng lỏng",
    mainIngredients: "Chất hoạt động bề mặt (chất trải)",
    mainUse: "Tăng bám dính, thấm sâu khi phun",
    usageNeeds: ["Cải tạo đất"],
    overview:
      "Loang Trải – Thấm Sâu là chế phẩm trộn chung với phân bón lá hoặc thuốc bảo vệ thực vật khi phun, giúp dung dịch loang trải đều trên bề mặt lá, thấm sâu hơn và kích thích khí khổng mở, tăng hiệu quả hấp thu.",
    overviewExtra: "Phù hợp dùng kèm các đợt phun phân bón lá hoặc thuốc, đặc biệt với lá có lớp sáp dày, khó thấm nước.",
    benefits: [
      { icon: "Sparkles", title: "Loang trải đều", description: "Giúp dung dịch phun loang đều trên bề mặt lá thay vì đọng thành giọt." },
      { icon: "ShieldCheck", title: "Thấm sâu hơn", description: "Hỗ trợ dung dịch thấm sâu vào mô lá, tăng hiệu quả hấp thu dinh dưỡng." },
      { icon: "Leaf", title: "Tăng độ bám dính", description: "Giúp dung dịch bám dính tốt hơn trên lá, hạn chế trôi khi gặp mưa nhẹ." },
      { icon: "Sun", title: "Kích nở khí khổng", description: "Hỗ trợ khí khổng mở rộng, tăng khả năng hấp thu qua lá." },
    ],
    symptoms: [
      { icon: "AlertTriangle", title: "Lá có lớp sáp dày", description: "Phù hợp với cây có lá bóng, lớp sáp dày khiến dung dịch phun khó bám." },
      { icon: "Sparkles", title: "Dung dịch phun hay đọng giọt", description: "Hỗ trợ khi dung dịch phun bị đọng thành giọt, không loang đều trên lá." },
      { icon: "Leaf", title: "Hấp thu qua lá kém", description: "Dùng kèm khi cần tăng hiệu quả hấp thu phân bón lá." },
      { icon: "Sun", title: "Trước đợt mưa nhẹ", description: "Giúp tăng độ bám dính khi phun trước thời điểm có khả năng mưa nhẹ." },
      { icon: "Zap", title: "Phun cùng thuốc BVTV", description: "Phù hợp pha trộn cùng thuốc bảo vệ thực vật để tăng hiệu quả tiếp xúc." },
    ],
    howToUse:
      "Pha chung với dung dịch phân bón lá hoặc thuốc bảo vệ thực vật theo tỷ lệ khuyến nghị trên nhãn, khuấy đều trước khi phun.",
    storage: "Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp, để xa tầm tay trẻ em.",
    origin: "Đang cập nhật",
    distributor: DISTRIBUTOR,
  },
];

export default products;
