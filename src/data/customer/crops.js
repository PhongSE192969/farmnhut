// Mock data for the "Khám phá theo cây trồng" homepage section.
// isMock/dataStatus flag every record as demo content — swap for a real
// crops API response (see src/services/customerHomeService.js) before
// production and drop those two fields.
const crops = [
  {
    id: "lua",
    name: "Lúa",
    slug: "lua",
    image: "/assets/customer/crops/lua.jpg",
    imageAlt: "Ruộng lúa xanh mướt vào mùa sinh trưởng",
    isMock: true,
    dataStatus: "demo",
  },
  {
    id: "ca-phe",
    name: "Cà phê",
    slug: "ca-phe",
    image: "/assets/customer/crops/ca-phe.jpg",
    imageAlt: "Vườn cà phê trĩu quả",
    isMock: true,
    dataStatus: "demo",
  },
  {
    id: "ho-tieu",
    name: "Hồ tiêu",
    slug: "ho-tieu",
    image: "/assets/customer/crops/ho-tieu.jpg",
    imageAlt: "Trụ tiêu xanh tốt trong vườn",
    isMock: true,
    dataStatus: "demo",
  },
  {
    id: "sau-rieng",
    name: "Sầu riêng",
    slug: "sau-rieng",
    image: "/assets/customer/crops/sau-rieng.jpg",
    imageAlt: "Vườn sầu riêng đang cho trái",
    isMock: true,
    dataStatus: "demo",
  },
  {
    id: "cay-an-trai",
    name: "Cây ăn trái",
    slug: "cay-an-trai",
    image: "/assets/customer/crops/cay-an-trai.jpg",
    imageAlt: "Vườn cây ăn trái tươi tốt",
    isMock: true,
    dataStatus: "demo",
  },
  {
    id: "rau-mau",
    name: "Rau màu",
    slug: "rau-mau",
    image: "/assets/customer/crops/rau-mau.jpg",
    imageAlt: "Luống rau màu xanh non",
    isMock: true,
    dataStatus: "demo",
  },
  {
    id: "cay-cong-nghiep",
    name: "Cây công nghiệp",
    slug: "cay-cong-nghiep",
    image: "/assets/customer/crops/cay-cong-nghiep.jpg",
    imageAlt: "Vườn cây công nghiệp dài ngày",
    isMock: true,
    dataStatus: "demo",
  },
  {
    id: "hoa-canh",
    name: "Hoa và cây cảnh",
    slug: "hoa-canh",
    image: "/assets/customer/crops/hoa-canh.jpg",
    imageAlt: "Vườn hoa và cây cảnh nhiều màu sắc",
    isMock: true,
    dataStatus: "demo",
  },
];

export default crops;
