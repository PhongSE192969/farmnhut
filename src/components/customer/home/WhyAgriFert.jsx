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
            {/* Floating overlapping circular photos — layout borrowed from a
                reference mockup, recolored/sized to fit the existing AgriFert
                palette instead of adopting the mockup's own color system. */}
            <div className="relative h-[340px] sm:h-[400px] lg:h-full lg:min-h-[420px]">
              <div className="absolute left-0 top-2 w-[62%] aspect-square rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img
                  src="/assets/customer/why-agrifert.jpg"
                  alt="Hình ảnh minh họa hoạt động canh tác hiện đại trên cánh đồng"
                  loading="lazy"
                  className="h-full w-full object-cover animate-slow-zoom"
                />
              </div>
              <div className="absolute right-0 bottom-0 w-[52%] aspect-square rounded-full overflow-hidden border-4 border-white shadow-2xl">
                <img
                  src="/assets/customer/hero/hero-hands-seedling.jpg"
                  alt="Bàn tay chăm sóc cây con trong đất — hình ảnh minh họa"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="absolute top-0 right-[8%] bg-customer-accent text-customer-primaryDark text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg shadow-lg rotate-3">
                Canh tác bền vững
              </span>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALUES.map((item, index) => (
              <Reveal key={item.title} delay={index * 70}>
                <div className="group h-full rounded-2xl bg-white border border-customer-primary/10 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-customer-primary/25">
                  <div className="flex items-center gap-3">
                    <item.icon
                      size={26}
                      strokeWidth={1.5}
                      className="shrink-0 text-customer-primary transition-transform duration-300 group-hover:scale-110"
                    />
                    <h3 className="font-bold text-sm text-customer-ink">{item.title}</h3>
                  </div>
                  <span className="mt-3 block h-0.5 w-8 rounded-full bg-customer-accent" />
                  <p className="mt-3 text-xs text-customer-secondary leading-relaxed">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
