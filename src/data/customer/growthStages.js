// Mock data for the "Hành trình dinh dưỡng" homepage section.
// Each stage links to a recommended product grouping — explicitly NOT a
// combo with a fixed shared price, since no such pricing policy exists yet.
const growthStages = [
  {
    id: "chuan-bi-dat",
    label: "Chuẩn bị đất",
    icon: "Shovel",
    description: "Cải tạo và xử lý đất trước khi xuống giống hoặc vào vụ mới.",
    isMock: true,
    dataStatus: "demo",
  },
  {
    id: "nuoi-cay",
    label: "Nuôi cây",
    icon: "Sprout",
    description: "Bổ sung dinh dưỡng cho cây phát triển thân, lá trong giai đoạn sinh trưởng.",
    isMock: true,
    dataStatus: "demo",
  },
  {
    id: "phuc-hoi",
    label: "Phục hồi",
    icon: "HeartPulse",
    description: "Giúp cây phục hồi sau thu hoạch hoặc sau giai đoạn bất lợi.",
    isMock: true,
    dataStatus: "demo",
  },
  {
    id: "truoc-ra-hoa",
    label: "Trước ra hoa",
    icon: "Flower",
    description: "Chuẩn bị dinh dưỡng để cây phân hóa mầm hoa tốt hơn.",
    isMock: true,
    dataStatus: "demo",
  },
  {
    id: "ho-tro-dau-trai",
    label: "Hỗ trợ đậu trái",
    icon: "CircleDot",
    description: "Hỗ trợ giai đoạn thụ phấn và giữ trái non trên cây.",
    isMock: true,
    dataStatus: "demo",
  },
  {
    id: "nuoi-trai",
    label: "Nuôi trái",
    icon: "Apple",
    description: "Bổ sung dinh dưỡng giúp trái phát triển kích thước và chất lượng.",
    isMock: true,
    dataStatus: "demo",
  },
];

export default growthStages;
