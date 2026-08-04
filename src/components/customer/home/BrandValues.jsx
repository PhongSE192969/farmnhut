import { Leaf, ShieldCheck, BookOpenText, Users } from "lucide-react";
import SectionHeading from "@/components/customer/ui/SectionHeading";
import CustomerButton from "@/components/customer/ui/CustomerButton";
import Reveal from "@/components/customer/ui/Reveal";

// Copy below is intentionally general — it must be replaced with content
// verified by the AgriFert team (real sourcing/QC process description)
// before production. No certifications, years-in-business, customer
// counts, cultivated-area figures, or trial results are claimed here.
const VALUES = [
  {
    icon: Leaf,
    title: "Lựa chọn nguyên liệu",
    description:
      "Nguyên liệu đầu vào được lựa chọn phù hợp với từng nhóm sản phẩm phân bón.",
  },
  {
    icon: ShieldCheck,
    title: "Kiểm soát chất lượng",
    description:
      "Quy trình đóng gói và bảo quản được thực hiện theo hướng dẫn của từng sản phẩm.",
  },
  {
    icon: BookOpenText,
    title: "Hướng dẫn sử dụng rõ ràng",
    description:
      "Mỗi sản phẩm đều có hướng dẫn liều lượng và cách dùng cụ thể trên bao bì và trang chi tiết.",
  },
  {
    icon: Users,
    title: "Đồng hành cùng người trồng",
    description:
      "Đội ngũ kỹ thuật sẵn sàng hỗ trợ tư vấn khi bạn cần thêm thông tin về sản phẩm.",
  },
];

export default function BrandValues() {
  return (
    <section className="font-customer bg-customer-primaryDark text-white py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-10">
        <Reveal>
          <SectionHeading
            dark
            align="center"
            eyebrow="Vì sao chọn AgriFert"
            title="Giá trị AgriFert theo đuổi"
            description="Chúng tôi tập trung vào những gì có thể kiểm chứng — sản phẩm, quy trình và sự đồng hành cùng người trồng."
            className="mx-auto mb-10"
          />
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map((item, index) => (
            <Reveal key={item.title} delay={index * 70}>
              <div className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 h-full hover:bg-white/10 transition-colors">
                <span className="flex size-12 items-center justify-center rounded-xl bg-customer-accent/20 text-customer-accent border border-customer-accent/30">
                  <item.icon size={22} />
                </span>
                <h3 className="font-bold text-base">{item.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={280} className="text-center mt-10">
          <CustomerButton variant="accent" to="/gioi-thieu">
            Tìm hiểu về AgriFert
          </CustomerButton>
        </Reveal>
      </div>
    </section>
  );
}
