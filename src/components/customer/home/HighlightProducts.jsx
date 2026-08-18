import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Droplet, Heart } from "lucide-react";
import SectionHeading from "@/components/customer/ui/SectionHeading";
import CustomerButton from "@/components/customer/ui/CustomerButton";
import Reveal from "@/components/customer/ui/Reveal";
import highlightProducts from "@/data/customer/highlightProducts";
import { formatCurrency } from "@/utils/helpers";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const AUTO_ADVANCE_MS = 2400;

// Width/height ratio of the featured-card image box, matched to the two
// static sizes the box used before it became measurement-driven (130x150
// below the sm breakpoint, 160x190 at sm+) so growing it to match the text
// column keeps the same proportions rather than turning square.
const FEATURED_IMAGE_ASPECT_MOBILE = 130 / 150;
const FEATURED_IMAGE_ASPECT_DESKTOP = 160 / 190;

// One component, two looks — deliberately NOT two separate components
// (FeaturedCard/CompactCard) swapped by index, because React would then
// unmount/remount a whole new element every time the active card changes,
// which skips CSS transitions entirely. Keeping the same DOM node and just
// flipping classes is what makes the "pop up + change background" effect
// actually animate instead of snapping.
function ProductCard({ product, isActive, cardRef }) {
  const [liked, setLiked] = useState(false);
  const nameRef = useRef(null);
  const ctaRef = useRef(null);
  // null until measured — the static h-[150px]/sm:h-[190px] classes below
  // stay in effect as the fallback size until then, so there's no flash of
  // a collapsed image box.
  const [featuredImageSize, setFeaturedImageSize] = useState(null);

  // Sizes the featured image so its height matches the on-screen distance
  // from the product name to the "Xem sản phẩm" button — requested so the
  // image reads as proportioned to the popup card instead of floating in a
  // fixed-size box regardless of how tall the text column ends up being.
  useEffect(() => {
    // No need to clear featuredImageSize on deactivation — the style that
    // consumes it is only applied while isActive, so a stale value just
    // sits unused until this card is promoted again and re-measures.
    if (!isActive) return undefined;

    const measure = () => {
      const nameTop = nameRef.current?.getBoundingClientRect().top;
      const ctaBottom = ctaRef.current?.getBoundingClientRect().bottom;
      if (nameTop == null || ctaBottom == null) return;

      const height = Math.round(ctaBottom - nameTop);
      if (height <= 0) return;

      const aspect = window.innerWidth >= 640 ? FEATURED_IMAGE_ASPECT_DESKTOP : FEATURED_IMAGE_ASPECT_MOBILE;
      setFeaturedImageSize({ height, width: Math.round(height * aspect) });
    };

    // The text column crossfades in over the same 500ms as the card's own
    // width/background transition (mt-4 max-h-40 opacity-100), so measuring
    // immediately would catch it still collapsed — wait for that to settle
    // first, matching the 500ms duration used throughout this card.
    const settleId = window.setTimeout(measure, 520);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(settleId);
      window.removeEventListener("resize", measure);
    };
  }, [isActive]);

  return (
    // Outer wrapper is the FLIP target — the parent slides it via inline
    // transform when the rotation reorders the row (see the layout effect
    // below), while this inner div keeps doing the width crossfade on its
    // own. Splitting the two means the JS-driven transform and the
    // CSS-driven width transition never fight over the same `transition`
    // property.
    <div ref={cardRef} className="shrink-0 snap-start">
      <div
        className={`group relative transition-[width] duration-500 ease-out motion-reduce:transition-none ${
          isActive ? "w-[300px] sm:w-[440px] lg:w-[560px]" : "w-[170px] sm:w-[200px]"
        }`}
      >
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            setLiked((value) => !value);
          }}
          aria-label={liked ? "Bỏ yêu thích" : "Yêu thích"}
          aria-pressed={liked}
          className={`absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full transition-colors sm:right-4 sm:top-4 sm:size-9 ${
            isActive
              ? "bg-white/15 text-white hover:bg-white/25"
              : "border border-gray-100 bg-white text-customer-secondary shadow-sm hover:text-red-500"
          }`}
        >
          <Heart size={15} className={liked ? "fill-current text-red-500" : ""} />
        </button>

        <Link
          to="/products"
          className={`flex h-full flex-col transition-all duration-500 ease-out motion-reduce:transition-none ${
            isActive
              ? "gap-5 rounded-3xl bg-customer-primaryDark p-6 shadow-[14px_14px_0_-6px_rgba(11,64,40,0.12)] sm:flex-row sm:items-center sm:gap-8 lg:p-8"
              : "rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:-translate-y-1 hover:shadow-md"
          }`}
        >
          <div
            className={`mx-auto flex shrink-0 items-center justify-center transition-all duration-500 motion-reduce:transition-none ${
              isActive ? "h-[150px] w-[130px] sm:h-[190px] sm:w-[160px]" : "h-[110px] w-full"
            }`}
            style={
              isActive && featuredImageSize
                ? { height: `${featuredImageSize.height}px`, width: `${featuredImageSize.width}px` }
                : undefined
            }
          >
            <img
              src={product.image}
              alt={product.imageAlt}
              loading="lazy"
              className={`max-h-full max-w-full object-contain transition-transform duration-500 ${
                !isActive ? "group-hover:scale-105" : ""
              }`}
            />
          </div>

          <div className={`flex flex-1 flex-col ${isActive ? "text-center sm:text-left" : ""}`}>
            <h3
              ref={nameRef}
              className={`font-bold transition-all duration-500 motion-reduce:transition-none ${
                isActive
                  ? "text-xl text-white sm:text-2xl"
                  : "mt-3 min-h-[2.5rem] text-sm text-customer-primary line-clamp-2"
              }`}
            >
              {product.name}
            </h3>

            <p
              className={`transition-all duration-500 motion-reduce:transition-none ${
                isActive ? "mt-3 text-sm text-white/60" : "mt-1 text-xs text-customer-secondary"
              }`}
            >
              {product.unit}
            </p>

            <p
              className={`font-extrabold text-customer-accent transition-all duration-500 motion-reduce:transition-none ${
                isActive ? "mt-1 text-2xl" : "mt-2 text-sm"
              }`}
            >
              {formatCurrency(product.price)}
            </p>

            {/* Tagline + CTA stay permanently in the DOM (never conditionally
                rendered) so this is a height/opacity transition, not a
                mount/unmount — same reasoning as the card-level split above. */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-out motion-reduce:transition-none ${
                isActive ? "mt-4 max-h-40 opacity-100" : "mt-0 max-h-0 opacity-0"
              }`}
            >
              <div className="h-px bg-white/15" />
              <div className="mt-4 flex items-start justify-center gap-2 sm:justify-start">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-customer-accent/20 text-customer-accent">
                  <Droplet size={13} />
                </span>
                <p className="text-left text-xs leading-relaxed text-white/70">{product.tagline}</p>
              </div>
              <span
                ref={ctaRef}
                className="group/btn mt-4 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-customer-primaryDark shadow-sm transition-all hover:-translate-y-0.5 hover:bg-customer-light"
              >
                Xem sản phẩm
                <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default function HighlightProducts() {
  // activeIndex is a rotation offset into highlightProducts, not a slot
  // position — the featured card is always rendered first (see
  // orderedProducts below). That's what keeps the dark "popped up" card
  // pinned to the leftmost slot on every auto-advance instead of drifting
  // around depending on where a scroll-position detector thought the user
  // had scrolled to.
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef(null);
  const hoveringRef = useRef(false);
  const reduceMotion = prefersReducedMotion();

  // Keyed by product id (not slot index) since the id is the only thing
  // that stays stable across a reorder — the same DOM node just moves to a
  // new slot, which is exactly what the FLIP animation below needs to
  // track.
  const cardRefs = useRef({});
  // Viewport-relative left of every card captured right before a reorder;
  // consumed once by the layout effect below to compute how far each card
  // needs to visually slide from where it was to where it ends up.
  const flipLeftsRef = useRef(null);

  const orderedProducts = [
    ...highlightProducts.slice(activeIndex),
    ...highlightProducts.slice(0, activeIndex),
  ];

  // Re-armed every time the active card changes, so it always waits a full
  // pause after the last change before advancing — paused on hover/touch,
  // skipped entirely under reduced motion. Scrolling back to the start
  // keeps the newly-promoted featured card visible even if the user had
  // manually scrolled the row to browse the compact cards.
  useEffect(() => {
    if (reduceMotion) return undefined;

    const id = setTimeout(() => {
      if (hoveringRef.current) return;

      const lefts = {};
      Object.entries(cardRefs.current).forEach(([productId, el]) => {
        if (el) lefts[productId] = el.getBoundingClientRect().left;
      });
      flipLeftsRef.current = lefts;

      setActiveIndex((current) => (current + 1) % highlightProducts.length);

      // snap-mandatory keeps re-evaluating the nearest snap point while the
      // cards' widths are mid-crossfade (duration-500), and settles on
      // whichever card ends up closest once the transition finishes —
      // not necessarily the first one — clipping the newly-promoted
      // featured card off the left edge. Suspending snapping for the
      // length of that transition (and forcing an instant, not
      // scroll-smooth-animated, reset) stops it from re-snapping to the
      // wrong card; both are restored once the layout has settled.
      const scroller = scrollerRef.current;
      if (scroller) {
        scroller.style.scrollSnapType = "none";
        scroller.style.scrollBehavior = "auto";
        scroller.scrollLeft = 0;
        scroller.style.scrollBehavior = "";
        window.setTimeout(() => {
          scroller.style.scrollSnapType = "";
        }, 550);
      }
    }, AUTO_ADVANCE_MS);

    return () => clearTimeout(id);
  }, [activeIndex, reduceMotion]);

  // FLIP ("First, Last, Invert, Play"): the reorder above just committed —
  // every card is now sitting at its new slot with no visible motion,
  // since a React key-based reorder just repositions DOM nodes instantly.
  // For each card, jump it back (via transform) to where it visually was
  // a moment ago, then let it transition to translateX(0) — the browser
  // animates that as a real slide from the old position to the new one,
  // which is what makes the whole row read as rotating left-to-right
  // instead of teleporting.
  useLayoutEffect(() => {
    const firstLefts = flipLeftsRef.current;
    flipLeftsRef.current = null;
    if (!firstLefts || reduceMotion) return;

    Object.entries(cardRefs.current).forEach(([productId, el]) => {
      if (!el) return;
      const firstLeft = firstLefts[productId];
      if (firstLeft === undefined) return;

      const deltaX = firstLeft - el.getBoundingClientRect().left;
      if (Math.abs(deltaX) < 1) return;

      el.style.transition = "none";
      el.style.transform = `translateX(${deltaX}px)`;
      void el.offsetWidth; // force reflow so the jump above is committed before animating away from it
      el.style.transition = "transform 500ms ease";
      el.style.transform = "";
    });
  }, [activeIndex, reduceMotion]);

  return (
    <section className="font-customer bg-white py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-10">
        <div className="relative flex flex-wrap items-end justify-between gap-4 mb-8">
          <SectionHeading
            eyebrow="Vật tư & gợi ý cho bạn"
            title="Sản phẩm nổi bật"
            description="Các sản phẩm phân bón được nhiều nhà vườn lựa chọn tại đại lý của bạn."
          />

          {/* Hand-drawn dashed arrow doodle pointing at the CTA — decorative accent, desktop only */}
          <svg
            aria-hidden="true"
            viewBox="0 0 90 40"
            className="hidden lg:block absolute right-32 -top-7 w-20 h-9 text-customer-primary/40"
          >
            <path
              d="M4 6c20 2 46 4 60 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="1 7"
            />
            <path
              d="M56 20l10 8-11 3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <CustomerButton variant="ghost" to="/products" icon={ArrowRight} className="flex-row-reverse">
            Xem tất cả
          </CustomerButton>
        </div>
      </div>

      <Reveal>
        <div
          ref={scrollerRef}
          onMouseEnter={() => {
            hoveringRef.current = true;
          }}
          onMouseLeave={() => {
            hoveringRef.current = false;
          }}
          onTouchStart={() => {
            hoveringRef.current = true;
          }}
          onTouchEnd={() => {
            hoveringRef.current = false;
          }}
          className="mx-auto flex max-w-7xl snap-x snap-mandatory scroll-smooth items-end gap-4 overflow-x-auto px-4 pb-4 lg:px-10 md:gap-5 scroll-pl-4 lg:scroll-pl-10 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", overflowAnchor: "none" }}
        >
          {orderedProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              isActive={index === 0}
              cardRef={(el) => {
                cardRefs.current[product.id] = el;
              }}
            />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
