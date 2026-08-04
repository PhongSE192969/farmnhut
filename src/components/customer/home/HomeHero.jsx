import { ArrowRight, Leaf } from "lucide-react";
import CustomerButton from "@/components/customer/ui/CustomerButton";
import Reveal from "@/components/customer/ui/Reveal";

export default function HomeHero() {
  return (
    <section className="font-customer bg-customer-cream">
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <Reveal as="div" className="order-2 lg:order-1">
          <span className="inline-flex items-center gap-2 bg-customer-light text-customer-primary rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-5">
            <Leaf size={13} /> Giải pháp dinh dưỡng cây trồng
          </span>

          <h1 className="text-customer-ink text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-5 max-w-lg">
            Dinh dưỡng phù hợp cho từng mùa vụ
          </h1>

          <p className="text-customer-secondary text-base md:text-lg leading-relaxed mb-8 max-w-md">
            Khám phá sản phẩm AgriFert theo cây trồng, giai đoạn sinh trưởng
            và nhu cầu canh tác.
          </p>

          <div className="flex flex-wrap gap-3">
            <CustomerButton
              variant="primary"
              size="lg"
              icon={ArrowRight}
              onClick={() =>
                document
                  .getElementById("product-finder")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              Tìm sản phẩm phù hợp
            </CustomerButton>

            <CustomerButton variant="outline" size="lg" to="/products">
              Xem sản phẩm
            </CustomerButton>
          </div>
        </Reveal>

        <Reveal as="div" delay={120} className="order-1 lg:order-2">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-sm">
            <img
              src="/assets/customer/hero/hero-farm-field.jpg"
              alt="Cánh đồng xanh vào buổi sáng sớm"
              className="h-full w-full object-cover"
              fetchPriority="high"
              width={1600}
              height={1200}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
