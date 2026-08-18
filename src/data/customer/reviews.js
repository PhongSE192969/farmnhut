// Mock data for the homepage "Khách hàng nói gì về AgriFert" section.
// No real customer photos are used (would misrepresent real people as
// AgriFert customers) — each review gets a plain initial-letter avatar
// instead. `location` picks real rural/agricultural xã (commune) known for
// the crop in question — not urban wards — weighted toward the Mekong Delta
// (Long An, An Giang, Tiền Giang, Cần Thơ) with a smaller share from the
// Central Highlands (Đắk Lắk, Gia Lai), per content direction. isMock/
// dataStatus flag every record as demo content — swap for a real reviews
// API response before production and drop those two fields.
const reviews = [
  {
    id: "review-1",
    name: "Văn Tuấn",
    location: "Trường Xuân - Cần Thơ",
    quote:
      "Ruộng lúa nhà tôi trước hay bị vàng lá giai đoạn đẻ nhánh, từ khi dùng đúng sản phẩm AgriFert gợi ý thì cây phục hồi rõ rệt, năng suất vụ sau tăng hẳn.",
    avatarColor: "bg-emerald-600",
    isMock: true,
    dataStatus: "demo",
  },
  {
    id: "review-2",
    name: "Mỹ Hà",
    location: "Cư M'gar - Đắk Lắk",
    quote:
      "Đại lý tư vấn rất nhiệt tình, đúng giai đoạn ra hoa của cà phê nên tôi bón kịp lúc, tỷ lệ đậu trái năm nay cao hơn hẳn mọi năm.",
    avatarColor: "bg-orange-500",
    isMock: true,
    dataStatus: "demo",
  },
  {
    id: "review-3",
    name: "Đình Dũng",
    location: "Chư Sê - Gia Lai",
    quote:
      "Sản phẩm dễ dùng, có hướng dẫn liều lượng rõ ràng theo từng giai đoạn cây tiêu nên tôi không còn bón mò như trước nữa.",
    avatarColor: "bg-indigo-500",
    isMock: true,
    dataStatus: "demo",
  },
  {
    id: "review-4",
    name: "Thanh Lan",
    location: "Ngũ Hiệp - Tiền Giang",
    quote:
      "Vườn sầu riêng nhà tôi từng bị rụng trái non nhiều, sau khi đổi phác đồ dinh dưỡng theo tư vấn thì tình trạng cải thiện đáng kể.",
    avatarColor: "bg-rose-500",
    isMock: true,
    dataStatus: "demo",
  },
  {
    id: "review-5",
    name: "Hải Phong",
    location: "Cần Đước - Long An",
    quote:
      "Giao hàng nhanh, đúng sản phẩm đặt, giá cả hợp lý so với các cửa hàng vật tư nông nghiệp khác quanh khu vực tôi.",
    avatarColor: "bg-amber-500",
    isMock: true,
    dataStatus: "demo",
  },
  {
    id: "review-6",
    name: "Thùy Nga",
    location: "Chợ Mới - An Giang",
    quote:
      "Tôi thích nhất là có thể tra cứu sản phẩm theo từng giai đoạn sinh trưởng của cây, đỡ mất công hỏi han nhiều nơi.",
    avatarColor: "bg-purple-500",
    isMock: true,
    dataStatus: "demo",
  },
  {
    id: "review-7",
    name: "Quốc Bình",
    location: "Thạnh Hóa - Long An",
    quote:
      "Đội ngũ kỹ thuật hỗ trợ nhiệt tình khi vườn có dấu hiệu bất thường, phản hồi nhanh và hướng dẫn cụ thể từng bước xử lý.",
    avatarColor: "bg-teal-600",
    isMock: true,
    dataStatus: "demo",
  },
  {
    id: "review-8",
    name: "Ngọc Thảo",
    location: "Châu Phú - An Giang",
    quote:
      "Dùng ổn định được 3 vụ liên tiếp rồi, chất lượng đồng đều, không có tình trạng thất thường như một vài loại phân bón khác tôi từng dùng.",
    avatarColor: "bg-sky-600",
    isMock: true,
    dataStatus: "demo",
  },
  {
    id: "review-9",
    name: "Minh Kiên",
    location: "Cư Kuin - Đắk Lắk",
    quote:
      "Điểm bán gần nhà nên tiện ghé mua bổ sung khi cần gấp, không phải chờ đặt hàng lâu như trước.",
    avatarColor: "bg-neutral-700",
    isMock: true,
    dataStatus: "demo",
  },
  {
    id: "review-10",
    name: "Xuân Yến",
    location: "Phong Điền - Cần Thơ",
    quote:
      "Cây trồng trong vườn nhà tôi lên màu lá đẹp hơn thấy rõ sau vài tuần sử dụng, sẽ tiếp tục ủng hộ AgriFert lâu dài.",
    avatarColor: "bg-pink-600",
    isMock: true,
    dataStatus: "demo",
  },
];

export default reviews;
