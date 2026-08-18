// "Sản phẩm nổi bật" homepage section — ảnh thật do người dùng cung cấp,
// đã tách nền (PNG trong suốt) và nén vào public/assets/customer/products/.
// Giá là số tạm thời do người dùng yêu cầu điền đại (dưới 200.000đ) vì chưa có
// giá niêm yết chính thức trong hệ thống — cần thay bằng giá thật trước khi chốt.
// `tagline` là câu rút gọn lấy trực tiếp từ công dụng in trên nhãn thật của
// từng sản phẩm (không tự bịa công dụng mới).
const highlightProducts = [
  {
    id: "loang-trai-tham-sau",
    name: "Loang Trải – Thấm Sâu",
    unit: "Chai 100ml",
    price: 65000,
    tagline: "Thấm sâu, loang trải đều, tăng bám dính, kích nở khí khổng.",
    image: "/assets/customer/products/loang-trai.png",
    imageAlt: "Chai Loang Trải – Thấm Sâu MeriFarm, ảnh sản phẩm thật",
    dataStatus: "brand-verified",
    isBrandVerified: true,
  },
  {
    id: "lun-cay-ruoc-dong",
    name: "Lùn Cây – Rước Đòng",
    unit: "Chai 250ml",
    price: 89000,
    tagline: "Ngắn lóng, cứng cây, hạn chế đổ ngã, trổ thoát đồng loạt.",
    image: "/assets/customer/products/lun-cay-ruoc-dong.png",
    imageAlt: "Chai Lùn Cây – Rước Đòng MeriFarm, ảnh sản phẩm thật",
    dataStatus: "brand-verified",
    isBrandVerified: true,
  },
  {
    id: "magie-bo-kem",
    name: "Magie Bo Kẽm No.1",
    unit: "Gói 500g",
    price: 55000,
    tagline: "Lớn trái, đẹp màu, đẻ nhánh sai hoa, mập đọt.",
    image: "/assets/customer/products/magie-bo-kem.png",
    imageAlt: "Gói Magie Bo Kẽm No.1 MeriFarm, ảnh sản phẩm thật",
    dataStatus: "brand-verified",
    isBrandVerified: true,
  },
  {
    id: "ra-re-no-bui",
    name: "Ra Rễ – Nở Bụi",
    unit: "Chai 250ml",
    price: 92000,
    tagline: "Ra rễ mạnh, đẻ nhánh, giải độc, hạ phèn, cân bằng pH.",
    image: "/assets/customer/products/ra-re-no-bui.png",
    imageAlt: "Chai Ra Rễ – Nở Bụi MeriFarm, ảnh sản phẩm thật",
    dataStatus: "brand-verified",
    isBrandVerified: true,
  },
  {
    id: "vo-gao-nhanh",
    name: "Vỏ Gạo Nhanh",
    unit: "Chai 250ml",
    price: 85000,
    tagline: "Hạt to, sáng bóng, chín cứng cây, tăng năng suất.",
    image: "/assets/customer/products/vo-gao-nhanh.png",
    imageAlt: "Chai Vỏ Gạo Nhanh MeriFarm, ảnh sản phẩm thật",
    dataStatus: "brand-verified",
    isBrandVerified: true,
  },
  {
    id: "ph-balance",
    name: "pH Balance",
    unit: "Hộp Humate 79 Grown",
    price: 145000,
    tagline: "Cân đối pH, siêu ra rễ, phát đọt cực mạnh.",
    image: "/assets/customer/products/ph-balance.png",
    imageAlt: "Hộp pH Balance (Humate 79 Grown) MeriFarm, ảnh sản phẩm thật",
    dataStatus: "brand-verified",
    isBrandVerified: true,
  },
];

export default highlightProducts;
