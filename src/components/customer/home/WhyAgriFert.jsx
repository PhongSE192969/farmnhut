import { Sprout, CalendarClock, FileText, MessageCircleQuestion } from "lucide-react";
import SectionHeading from "@/components/customer/ui/SectionHeading";
import Reveal from "@/components/customer/ui/Reveal";

const VALUES = [
  {
    icon: Sprout,
    title: "Phù hợp theo cây trồng",
    description: "Dễ dàng khám phá các dòng sản phẩm theo nhóm cây trồng và nhu cầu sử dụng.",
  },
  {
    icon: CalendarClock,
    title: "Theo từng giai đoạn sinh trưởng",
    description: "Thông tin được tổ chức theo hành trình phát triển của cây để người dùng dễ tìm hiểu và lựa chọn.",
  },
  {
    icon: FileText,
    title: "Thông tin rõ ràng, dễ tiếp cận",
    description: "Nội dung sản phẩm được trình bày trực quan, giúp người trồng thuận tiện tham khảo trước khi sử dụng.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Hỗ trợ kết nối",
    description: "Người dùng có thể tìm sản phẩm, điểm bán hoặc để lại thông tin để nhận hỗ trợ phù hợp.",
  },
];

export default function WhyAgriFert() {
  return (
    <section className="font-customer bg-white py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="Vì sao lựa chọn AgriFert?"
            title="Giải pháp được xây dựng từ nhu cầu canh tác thực tế"
            description="AgriFert hướng đến việc giúp người trồng tiếp cận giải pháp dinh dưỡng phù hợp hơn với từng nhóm cây trồng, từng giai đoạn sinh trưởng và mục tiêu chăm sóc."
            className="mb-10"
          />
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8 lg:gap-10 items-stretch">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-full min-h-[280px]">
              <img
                src="/assets/customer/why-agrifert.jpg"
                alt="Hình ảnh minh họa hoạt động canh tác hiện đại trên cánh đồng"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALUES.map((item, index) => (
              <Reveal key={item.title} delay={index * 70}>
                <div className="flex flex-col gap-3 h-full rounded-2xl border border-customer-primary/10 bg-customer-cream p-5">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-customer-primary/10 text-customer-primary">
                    <item.icon size={20} />
                  </span>
                  <h3 className="font-bold text-sm text-customer-ink">{item.title}</h3>
                  <p className="text-xs text-customer-secondary leading-relaxed">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
