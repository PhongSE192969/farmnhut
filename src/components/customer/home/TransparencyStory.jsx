import { FileSearch, Sprout, Headset } from "lucide-react";
import SectionHeading from "@/components/customer/ui/SectionHeading";
import Reveal from "@/components/customer/ui/Reveal";

const POINTS = [
  {
    icon: FileSearch,
    label: "Thông tin sản phẩm rõ ràng",
    description: "Trình bày thành phần, hướng dẫn sử dụng và liều lượng dễ tiếp cận.",
  },
  {
    icon: Sprout,
    label: "Hướng dẫn theo nhu cầu cây trồng",
    description: "Gợi ý sản phẩm phù hợp theo từng nhóm cây trồng và giai đoạn sinh trưởng.",
  },
  {
    icon: Headset,
    label: "Kết nối tư vấn và điểm bán",
    description: "Hỗ trợ tìm điểm bán và kết nối tư vấn kỹ thuật khi cần.",
  },
];

// Diamond image collage — layout borrowed from a reference mockup ("OUR
// FEATURES"), recolored to the existing AgriFert palette. Reuses 3 already
// licensed hero photos whose subjects line up naturally with the mockup's
// own trio (aerial farmland / hands with a seedling / golden grain field).
const DIAMOND_IMAGES = [
  {
    src: "/assets/customer/hero/hero-farm-field.jpg",
    alt: "Cánh đồng xanh vào buổi sáng sớm — hình ảnh minh họa",
    size: "w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32",
    z: "",
  },
  {
    src: "/assets/customer/hero/hero-hands-seedling.jpg",
    alt: "Bàn tay chăm sóc cây con trong đất — hình ảnh minh họa",
    size: "w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40",
    z: "z-10 -mt-6 sm:-mt-8",
  },
  {
    src: "/assets/customer/hero/hero-golden-field.jpg",
    alt: "Cánh đồng vào mùa vụ dưới nắng vàng — hình ảnh minh họa",
    size: "w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32",
    z: "",
  },
];

export default function TransparencyStory() {
  return (
    <section className="font-customer bg-white py-14 lg:py-20">
      <div className="max-w-5xl mx-auto px-4 lg:px-10 text-center">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Chất lượng bắt đầu từ sự minh bạch"
            title="Chất lượng bắt đầu từ thông tin minh bạch"
            description="Mỗi lựa chọn dinh dưỡng cần bắt đầu từ việc hiểu cây trồng và nhu cầu canh tác thực tế trước khi quyết định."
            className="mx-auto"
          />
        </Reveal>

        <Reveal delay={80}>
          <div className="flex justify-center items-center my-12">
            {DIAMOND_IMAGES.map((img) => (
              <div
                key={img.src}
                className={`${img.size} ${img.z} [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)] overflow-hidden shadow-lg -mx-3 sm:-mx-4 md:-mx-5`}
              >
                <img src={img.src} alt={img.alt} loading="lazy" className="h-full w-full object-cover scale-150" />
              </div>
            ))}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {POINTS.map((point, index) => (
            <Reveal key={point.label} delay={index * 70}>
              <div className="group h-full rounded-2xl bg-white border border-customer-primary/10 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-customer-primary/25">
                <div className="flex items-center gap-3">
                  <point.icon
                    size={26}
                    strokeWidth={1.5}
                    className="shrink-0 text-customer-primary transition-transform duration-300 group-hover:scale-110"
                  />
                  <p className="font-bold text-sm text-customer-ink">{point.label}</p>
                </div>
                <span className="mt-3 block h-0.5 w-8 rounded-full bg-customer-accent" />
                <p className="mt-3 text-xs text-customer-secondary leading-relaxed">{point.description}</p>
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
