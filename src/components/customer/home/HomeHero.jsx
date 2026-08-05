import { ArrowRight, Sprout } from "lucide-react";
import CustomerButton from "@/components/customer/ui/CustomerButton";
import Reveal from "@/components/customer/ui/Reveal";

export default function HomeHero() {
  return (
    <section className="font-customer relative bg-customer-primaryDark overflow-hidden">
      {/* Faint decorative texture, not a photo — keeps the solid background from feeling flat without any contrast risk */}
      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:28px_28px]" />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-10 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <Reveal as="div" className="order-2 lg:order-1">
          <span className="inline-flex items-center gap-2 bg-white/10 text-customer-accent border border-white/15 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-6">
            <Sprout size={13} /> Giải pháp dinh dưỡng cây trồng
          </span>

          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6 max-w-lg">
            Dinh dưỡng đúng lúc,
            <br />
            vững mùa bội thu
          </h1>

          <p className="text-white/75 text-base md:text-lg leading-relaxed mb-9 max-w-md">
            AgriFert mang đến các giải pháp dinh dưỡng được xây dựng theo cây
            trồng, giai đoạn sinh trưởng và nhu cầu canh tác thực tế.
          </p>

          <div className="flex flex-wrap gap-3">
            <CustomerButton
              variant="accent"
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

            <CustomerButton variant="outline-white" size="lg" to="/products">
              Khám phá sản phẩm
            </CustomerButton>
          </div>
        </Reveal>

        <Reveal as="div" delay={120} className="order-1 lg:order-2 relative">
          {/* Elevated, framed photo card — the reference's "floating" hero
              visual reimagined without photo-compositing tools: a rounded
              card with a soft shadow and accent ring stands in for it. */}
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <div className="absolute -inset-3 rounded-[2rem] border border-customer-accent/25" />
            <div className="relative rounded-[1.75rem] overflow-hidden aspect-[4/5] lg:aspect-[4/4.5] shadow-2xl shadow-black/40">
              <img
                src="/assets/customer/hero/hero-hands-seedling.jpg"
                alt="Bàn tay chăm sóc cây con trong đất — hình ảnh minh họa"
                className="h-full w-full object-cover"
                fetchPriority="high"
              />
            </div>

            <div className="absolute -bottom-5 -left-5 flex items-center gap-3 bg-white rounded-2xl shadow-xl px-4 py-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-customer-light text-customer-primary shrink-0">
                <Sprout size={18} />
              </span>
              <div className="leading-tight">
                <p className="text-xs font-bold text-customer-ink">Chăm sóc đúng cách</p>
                <p className="text-[11px] text-customer-secondary">Từng giai đoạn cây trồng</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
