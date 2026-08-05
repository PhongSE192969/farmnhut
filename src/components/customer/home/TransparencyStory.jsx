import { FileSearch, Sprout, Headset } from "lucide-react";
import SectionHeading from "@/components/customer/ui/SectionHeading";
import Reveal from "@/components/customer/ui/Reveal";

const POINTS = [
  { icon: FileSearch, label: "Thông tin sản phẩm rõ ràng" },
  { icon: Sprout, label: "Hướng dẫn theo nhu cầu cây trồng" },
  { icon: Headset, label: "Kết nối tư vấn và điểm bán" },
];

export default function TransparencyStory() {
  return (
    <section className="font-customer bg-customer-light/60 py-14 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 lg:px-10 text-center">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Chất lượng bắt đầu từ sự minh bạch"
            title="Chất lượng bắt đầu từ thông tin minh bạch"
            description="Mỗi lựa chọn dinh dưỡng cần bắt đầu từ việc hiểu cây trồng và nhu cầu canh tác. AgriFert ưu tiên trình bày thông tin sản phẩm rõ ràng, hướng dẫn sử dụng dễ tiếp cận và xây dựng các kênh hỗ trợ để người trồng có thêm cơ sở tham khảo trước khi lựa chọn."
            className="mx-auto"
          />
        </Reveal>

        <div className="mt-9 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {POINTS.map((point, index) => (
            <Reveal key={point.label} delay={index * 70}>
              <div className="flex flex-col items-center gap-3 rounded-2xl bg-white border border-customer-primary/10 p-5 h-full">
                <span className="flex size-11 items-center justify-center rounded-xl bg-customer-primary/10 text-customer-primary">
                  <point.icon size={20} />
                </span>
                <p className="font-bold text-sm text-customer-ink">{point.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={220}>
          <p className="mt-8 text-xs text-customer-secondary/80 max-w-xl mx-auto">
            Xem chi tiết thành phần, hướng dẫn sử dụng và liều lượng của từng
            sản phẩm tại{" "}
            <a href="/products" className="text-customer-primary font-semibold hover:underline">
              trang sản phẩm
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
