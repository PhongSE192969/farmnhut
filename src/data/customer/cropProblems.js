// Mock data for the "Vấn đề cây trồng" homepage section.
// Framed as symptoms/orientation only — never a diagnosis or guaranteed
// fix. isMock/dataStatus flag this as demo content.
const cropProblems = [
  {
    id: "cham-phat-trien",
    label: "Cây chậm phát triển",
    icon: "TrendingDown",
    description: "Cây sinh trưởng chậm hơn bình thường so với giai đoạn hiện tại.",
    isMock: true,
    dataStatus: "demo",
  },
  {
    id: "vang-la",
    label: "Vàng lá",
    icon: "Leaf",
    description: "Lá chuyển vàng bất thường, có thể do nhiều nguyên nhân khác nhau.",
    isMock: true,
    dataStatus: "demo",
  },
  {
    id: "ra-hoa-khong-deu",
    label: "Ra hoa không đồng đều",
    icon: "Flower2",
    description: "Cây ra hoa rải rác hoặc không tập trung theo mùa vụ.",
    isMock: true,
    dataStatus: "demo",
  },
  {
    id: "kho-dau-trai",
    label: "Khó đậu trái",
    icon: "CircleDashed",
    description: "Tỷ lệ đậu trái sau khi ra hoa thấp hơn kỳ vọng.",
    isMock: true,
    dataStatus: "demo",
  },
  {
    id: "trai-phat-trien-kem",
    label: "Trái phát triển kém",
    icon: "Grape",
    description: "Trái lớn chậm hoặc chưa đạt kích thước, mẫu mã mong muốn.",
    isMock: true,
    dataStatus: "demo",
  },
  {
    id: "phuc-hoi-sau-thu-hoach",
    label: "Cần phục hồi sau thu hoạch",
    icon: "RotateCcw",
    description: "Cây suy yếu sau vụ thu hoạch, cần thời gian phục hồi trước vụ mới.",
    isMock: true,
    dataStatus: "demo",
  },
];

export default cropProblems;
