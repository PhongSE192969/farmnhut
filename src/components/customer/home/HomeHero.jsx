import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import CustomerButton from "@/components/customer/ui/CustomerButton";
import Reveal from "@/components/customer/ui/Reveal";

const SLIDE_DURATION_MS = 7000;
const CROSSFADE_MS = 1000;

// Slide 1 is the LCP element — kept small/eager. Slides 2-3 are mounted a
// beat after first paint (see slidesReady below) so they never compete
// with critical above-the-fold resources.
const SLIDES = [
  {
    src: "/assets/customer/hero/hero-farm-field.jpg",
    alt: "Cánh đồng xanh vào buổi sáng sớm — hình ảnh minh họa",
  },
  {
    src: "/assets/customer/hero/hero-hands-seedling.jpg",
    alt: "Bàn tay chăm sóc cây con trong đất — hình ảnh minh họa",
  },
  {
    src: "/assets/customer/hero/hero-golden-field.jpg",
    alt: "Cánh đồng vào mùa vụ dưới nắng vàng — hình ảnh minh họa",
  },
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const prefersReducedData = () =>
  typeof navigator !== "undefined" && navigator.connection?.saveData === true;

// Mobile renders a single pre-cropped image (see the sm:hidden <img> below)
// — the slideshow only applies at the breakpoint where it's actually shown.
const isDesktopViewport = () =>
  typeof window !== "undefined" && window.matchMedia?.("(min-width: 640px)").matches;

export default function HomeHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesReady, setSlidesReady] = useState(false);
  const timerRef = useRef(null);

  const reduceMotion = prefersReducedMotion() || prefersReducedData();
  const skipSlideshow = reduceMotion || !isDesktopViewport();

  useEffect(() => {
    if (skipSlideshow) return;

    // Defer mounting slides 2-3 until the main hero content has painted.
    const readyTimeout = setTimeout(() => setSlidesReady(true), 1200);
    return () => clearTimeout(readyTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (skipSlideshow || !slidesReady) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % SLIDES.length);
    }, SLIDE_DURATION_MS);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slidesReady]);

  return (
    <section className="font-customer relative min-h-[600px] lg:min-h-[680px] flex items-center overflow-hidden bg-customer-primaryDark">
      {/* Mobile: single pre-cropped image, no slideshow, no Ken Burns */}
      <img
        src="/assets/customer/hero/hero-farm-field-mobile.jpg"
        alt={SLIDES[0].alt}
        className="sm:hidden absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
      />

      {/* Desktop/tablet: crossfade slideshow */}
      <div className="hidden sm:block absolute inset-0">
        {SLIDES.map((slide, index) => {
          if (index > 0 && !slidesReady) return null;
          const isActive = index === activeIndex;

          return (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              fetchPriority={index === 0 ? "high" : undefined}
              loading={index === 0 ? "eager" : "lazy"}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out ${
                isActive ? "opacity-100" : "opacity-0"
              } ${!reduceMotion && isActive ? "animate-hero-kenburns" : ""}`}
              style={{ transitionDuration: `${CROSSFADE_MS}ms` }}
            />
          );
        })}
      </div>

      {/*
        Two-layer overlay, tuned for legibility against ALL 3 slide photos —
        including the bright sunrise-field one, where a single top-to-bottom
        gradient left the top ~20% opacity and the eyebrow badge unreadable.
        Layer 1 is a FLAT tint (constant minimum darkness everywhere, so no
        region of any image is ever left too bright for white text). Layer 2
        adds extra depth toward the bottom for the buttons, on top of that
        floor — it never goes lighter than layer 1 alone.
      */}
      <div className="absolute inset-0 bg-customer-primaryDark/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-customer-primaryDark/45 via-customer-primaryDark/10 to-transparent" />

      <div className="relative z-10 px-4 lg:px-10 pt-20 pb-24 lg:pb-32 max-w-7xl mx-auto w-full">
        <Reveal className="max-w-xl">
          <h1 className="text-white text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-5 [text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">
            Dinh dưỡng đúng lúc,
            <br />
            vững mùa bội thu
          </h1>

          <p className="text-white/90 text-base md:text-lg leading-relaxed mb-8 max-w-md [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]">
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
      </div>

      <span
        aria-hidden="true"
        className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-10 items-center justify-center size-9 rounded-full border border-white/30 text-white/80 animate-bounce motion-reduce:animate-none"
      >
        <ChevronDown size={18} />
      </span>
    </section>
  );
}
