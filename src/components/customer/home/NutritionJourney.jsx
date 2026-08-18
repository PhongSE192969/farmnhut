import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getGrowthStages } from "@/services/customerHomeService";
import Reveal from "@/components/customer/ui/Reveal";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Builds a smooth wave through arbitrary points using a per-segment S-curve:
// each segment leaves its start point and arrives at its end point on a
// purely horizontal tangent (control points sit at the segment's horizontal
// midpoint). Because both segments sharing a point approach it horizontally,
// they always meet tangent-continuous — no kinks at any dot — which is what
// gives the alternating high/low stage sequence its round, bouncing-ball
// look instead of the flatter, more angular curve a Catmull-Rom spline
// produces on a sharp zigzag like this one. Used by the lg+ row layout,
// where stages sit side by side and bounce up/down.
function smoothPathThroughHorizontal(points) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const midX = (p1.x + p2.x) / 2;
    d += ` C ${midX} ${p1.y}, ${midX} ${p2.y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

// Same idea, rotated 90°: control points sit at the segment's vertical
// midpoint instead, so each segment leaves/arrives on a vertical tangent.
// Used by the below-lg column layout, where stages stack top to bottom and
// bounce left/right — this is what gives it the staggered zigzag look.
function smoothPathThroughVertical(points) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const midY = (p1.y + p2.y) / 2;
    d += ` C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function measureDots(containerEl, dotEls) {
  if (!containerEl || dotEls.length === 0) return null;

  const containerRect = containerEl.getBoundingClientRect();
  if (containerRect.width === 0 || containerRect.height === 0) return null;

  const points = dotEls.map((el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: r.left + r.width / 2 - containerRect.left,
      y: r.top + r.height / 2 - containerRect.top,
    };
  });
  if (points.some((p) => !p)) return null;

  return { width: containerRect.width, height: containerRect.height, points };
}

// Measures a set of connector dots inside `containerRef` and turns them into
// a smooth SVG path, re-measuring on resize. Shared by both the lg+ row
// layout and the below-lg column layout — they differ only in which axis the
// wave bounces along (`orientation`) and are otherwise the same problem:
// find the dots' real DOM positions, connect them, fade the line in once
// scrolled into view.
//
// Refs are created by the caller (NutritionJourney) and passed in rather
// than returned from here: the react-compiler ref-safety lint rule treats
// any object holding a ref as fully "tainted" and flags every property
// access on it (including plain state fields) as an unsafe render-time ref
// read. Returning only plain state keeps that object safe to destructure.
function useConnectorPath({ containerRef, svgPathRef, dotRefs, orientation, itemCount }) {
  const hasDrawnRef = useRef(false);
  const [pathD, setPathD] = useState("");
  const [viewBox, setViewBox] = useState("0 0 100 100");
  const [drawn, setDrawn] = useState(() => prefersReducedMotion());

  // eslint-disable-next-line react-hooks/exhaustive-deps -- containerRef and dotRefs are
  // stable ref objects (only their .current mutates, read imperatively by the effects
  // below rather than reactively), and `orientation` is fixed per call site.
  const measure = useMemo(
    () => () => {
      const m = measureDots(containerRef.current, dotRefs.current);
      if (!m) return;
      setViewBox(`0 0 ${m.width} ${m.height}`);
      setPathD(orientation === "vertical" ? smoothPathThroughVertical(m.points) : smoothPathThroughHorizontal(m.points));
    },
    []
  );

  useLayoutEffect(() => {
    if (itemCount === 0) return undefined;

    measure();
    const raf = requestAnimationFrame(measure);

    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [itemCount, measure]);

  // Fade the line in once it scrolls into view — content itself never
  // depends on this: the path is already fully visible (opacity 1) until
  // this effect has something to animate from, so a JS/observer failure
  // just means "no fade-in", never a missing timeline. Opacity (rather than
  // a stroke-dashoffset "draw") keeps the decorative dashed stroke intact
  // instead of rendering as one solid dash covering the whole path.
  //
  // `pathD` is recomputed on every resize (font loading, viewport changes,
  // etc.), which would otherwise re-run this effect and reset drawn=false
  // each time — flickering the already-revealed line back to hidden. The
  // hasDrawnRef guard makes the reveal a true one-time event.
  useLayoutEffect(() => {
    if (!pathD || prefersReducedMotion()) return undefined;

    const node = svgPathRef.current;
    if (!node) return undefined;
    if (hasDrawnRef.current) return undefined;

    // Always true given this component's own JSX structure (the path is
    // always inside a <section>) — guarded rather than asserted so a future
    // refactor can't turn this into a silent no-op reveal.
    const section = node.closest("section");
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          hasDrawnRef.current = true;
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [pathD]);

  return { pathD, viewBox, drawn };
}

function ConnectorSvg({ svgPathRef, viewBox, pathD, drawn }) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full text-customer-primary/45"
      aria-hidden="true"
    >
      <path
        ref={svgPathRef}
        d={pathD}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="7 6"
        strokeLinecap="round"
        className="animate-line-flow"
        style={{ opacity: drawn ? 1 : 0, transition: "opacity 900ms ease-out" }}
      />
    </svg>
  );
}

function StageBadge({ number }) {
  return (
    <span className="absolute -top-4 left-1/2 z-20 flex size-8 -translate-x-1/2 items-center justify-center rounded-full bg-customer-primary text-xs font-extrabold text-white ring-4 ring-white shadow-sm">
      {String(number).padStart(2, "0")}
    </span>
  );
}

// Triangle pointing from the card toward its connector dot. "bottom"/"top"
// are used by the lg+ row layout (dot stacked above/below the card); "left"/
// "right" by the below-lg column layout (dot beside the card).
const ARROW_CLASSES = {
  bottom: "-bottom-[7px] left-1/2 -translate-x-1/2 border-x-[7px] border-x-transparent border-t-[7px] border-t-white",
  top: "-top-[7px] left-1/2 -translate-x-1/2 border-x-[7px] border-x-transparent border-b-[7px] border-b-white",
  left: "-left-[7px] top-1/2 -translate-y-1/2 border-y-[7px] border-y-transparent border-r-[7px] border-r-white",
  right: "-right-[7px] top-1/2 -translate-y-1/2 border-y-[7px] border-y-transparent border-l-[7px] border-l-white",
};

function StageCard({ stage, number, arrowSide, widthClassName = "w-40 lg:w-32 xl:w-40" }) {
  return (
    <div
      className={`relative ${widthClassName} rounded-2xl border border-customer-primary/10 bg-white px-4 lg:px-3 xl:px-4 pt-6 pb-4 text-center shadow-[0_8px_24px_-12px_rgba(11,64,40,0.18)]`}
    >
      <StageBadge number={number} />
      <h3 className="text-sm lg:text-xs xl:text-sm font-bold text-customer-primaryDark">{stage.label}</h3>
      <p className="mt-1.5 min-h-[52px] text-xs lg:text-[11px] xl:text-xs leading-relaxed text-customer-secondary">
        {stage.description}
      </p>
      <span aria-hidden="true" className={`absolute ${ARROW_CLASSES[arrowSide]}`} />
    </div>
  );
}

function StageImage({ stage, imgRef, dotRef, dotPosition = "bottom" }) {
  const circle = (
    <span
      ref={imgRef}
      className="block size-32 xl:size-40 overflow-hidden rounded-full border-[6px] border-white shadow-[0_10px_28px_-8px_rgba(11,64,40,0.35)]"
    >
      <img
        src={stage.image}
        alt={stage.imageAlt}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </span>
  );
  const dot = <span ref={dotRef} className="size-3 rounded-full bg-customer-primary ring-2 ring-white shadow" />;

  // dotPosition flips the connector dot to the circle's top edge instead of
  // its bottom — used so the wave line can arc over a stage's photo rather
  // than dip under it (see the `dotPosition` map in the render loop below).
  // "top" gets a wider gap (vs. "bottom"'s tight 6px) so the curve has room
  // to bow around the circle instead of grazing its edge.
  return (
    <div className={`flex flex-col items-center ${dotPosition === "top" ? "gap-6" : "gap-2.5"}`}>
      {dotPosition === "top" ? (
        <>
          {dot}
          {circle}
        </>
      ) : (
        <>
          {circle}
          {dot}
        </>
      )}
    </div>
  );
}

// Mobile/tablet zigzag row: photo on one side, a compact fixed-width card on
// the other, with a small connector dot overlaid on the photo's inner edge
// (the side facing the card) so the wave line can thread between rows
// without crossing over either photo or card. The card is intentionally
// NOT full-width (min-w-0/flex-1 would stretch it edge to edge) — a fixed,
// compact width lets each row sit off to its own side, which is what
// actually produces the staggered zigzag rather than just the photo
// swapping sides while the text block stays centered.
function MobileStageRow({ stage, number, alignLeft, dotRef }) {
  return (
    <Link
      to={`/products?stage=${stage.id}`}
      className={`group relative z-10 flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-customer-primary ${
        alignLeft ? "flex-row" : "flex-row-reverse"
      }`}
    >
      <span className="relative shrink-0">
        <span className="block size-20 sm:size-24 overflow-hidden rounded-full border-[5px] border-white shadow-[0_10px_24px_-8px_rgba(11,64,40,0.35)]">
          <img src={stage.image} alt={stage.imageAlt} loading="lazy" className="h-full w-full object-cover" />
        </span>
        <span
          ref={dotRef}
          aria-hidden="true"
          className={`absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-customer-primary ring-2 ring-white shadow ${
            alignLeft ? "-right-1.5" : "-left-1.5"
          }`}
        />
      </span>
      <StageCard
        stage={stage}
        number={number}
        arrowSide={alignLeft ? "left" : "right"}
        widthClassName="w-32 sm:w-36"
      />
    </Link>
  );
}

// Faint agriculture-themed line-art — pure inline SVG, no external/generated
// images. Kept far below content contrast, and the corner motifs hide on
// small screens per the "don't clutter mobile" requirement.
function DecorativeArt() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
      <svg
        viewBox="0 0 200 200"
        className="hidden md:block absolute -right-8 -top-10 h-56 w-56 text-customer-primary/[0.06]"
      >
        <path
          d="M100 190 V60 M100 60 C60 60 40 40 30 10 C70 15 95 35 100 60 M100 60 C140 60 160 40 170 10 C130 15 105 35 100 60 M100 110 C70 110 55 95 48 75 C78 78 96 92 100 110 M100 130 C130 130 145 115 152 95 C122 98 104 112 100 130"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      <svg
        viewBox="0 0 200 200"
        className="hidden md:block absolute -left-10 -bottom-12 h-56 w-56 text-customer-primary/[0.06]"
      >
        <path
          d="M100 190 V60 M100 60 C60 60 40 40 30 10 C70 15 95 35 100 60 M100 60 C140 60 160 40 170 10 C130 15 105 35 100 60 M100 110 C70 110 55 95 48 75 C78 78 96 92 100 110 M100 130 C130 130 145 115 152 95 C122 98 104 112 100 130"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      <svg
        viewBox="0 0 100 100"
        className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 text-customer-primary/[0.035]"
      >
        <path
          d="M50 88 V38 M50 38 C30 38 20 26 16 10 C36 13 47 24 50 38 M50 38 C70 38 80 26 84 10 C64 13 53 24 50 38"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>

      <svg
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-16 w-full text-customer-primary/[0.05]"
      >
        <path
          d="M0 80 C150 40 300 90 450 55 C600 20 750 75 900 50 C1020 30 1120 60 1200 40 V100 H0 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export default function NutritionJourney() {
  const [stages, setStages] = useState([]);
  const imgRefs = useRef([]);

  const desktopContainerRef = useRef(null);
  const desktopSvgPathRef = useRef(null);
  const desktopDotRefs = useRef([]);
  const mobileContainerRef = useRef(null);
  const mobileSvgPathRef = useRef(null);
  const mobileDotRefs = useRef([]);

  const desktop = useConnectorPath({
    containerRef: desktopContainerRef,
    svgPathRef: desktopSvgPathRef,
    dotRefs: desktopDotRefs,
    orientation: "horizontal",
    itemCount: stages.length,
  });
  const mobile = useConnectorPath({
    containerRef: mobileContainerRef,
    svgPathRef: mobileSvgPathRef,
    dotRefs: mobileDotRefs,
    orientation: "vertical",
    itemCount: stages.length,
  });

  useEffect(() => {
    getGrowthStages().then(setStages);
  }, []);

  if (stages.length === 0) return null;

  return (
    <section className="font-customer relative overflow-hidden bg-white py-14 lg:py-20">
      <DecorativeArt />

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-10">
        <Reveal>
          <span className="block text-xs font-bold uppercase tracking-widest text-customer-primary">
            Gợi ý theo giai đoạn
          </span>
          <span className="mt-2 block h-1 w-10 rounded-full bg-customer-accent" />
          <h2 className="mt-4 text-2xl md:text-[clamp(1.75rem,1.2rem+2vw,2.5rem)] font-extrabold leading-tight text-customer-ink">
            Hành trình dinh dưỡng cho cây trồng
          </h2>
          <p className="mt-3 max-w-2xl text-sm md:text-base leading-relaxed text-customer-secondary">
            Mỗi giai đoạn sinh trưởng cần một nhóm dinh dưỡng khác nhau — chọn đúng giai đoạn để xem
            nhóm sản phẩm khuyến nghị.
          </p>
        </Reveal>

        {/* lg and up only: horizontal wave timeline. Below lg the 6-stage row
            can't fit its content widths without shrinking cards/photos into
            illegibility, so tablet/mobile use the vertical zigzag instead —
            see the `lg:hidden` block below. Column width and gap are tiered
            (compact at lg, full-size at xl) so the row's natural width
            (`w-max`) always fits inside the max-w-7xl container at every
            width from 1024px up, and the horizontal scrollbar this used to
            need never appears. `scrollbar-hide` is kept as a safety net for
            odd viewport/zoom combinations rather than a primary fix. The
            curve is measured from the real DOM position of each stage's
            connector dot, so it can never drift from the points it's
            supposed to connect, at any width. */}
        {/* pt-6 matters more than it looks: this wrapper sets overflow-x,
            and per the CSS overflow spec that silently forces overflow-y
            from its default 'visible' to 'auto' too — so the 01/03/05
            badges, which poke 16px above their card via -top-4, were being
            clipped by the container's own top edge. The padding gives that
            poke-out room to live inside the scrollport instead. */}
        <div className="hidden lg:block mt-10 overflow-x-auto scrollbar-hide pt-6 pb-2">
          <div
            ref={desktopContainerRef}
            className="relative mx-auto flex w-max justify-center gap-5 xl:gap-10 min-h-[400px] lg:min-h-[440px] px-1"
          >
            <ConnectorSvg
              svgPathRef={desktopSvgPathRef}
              viewBox={desktop.viewBox}
              pathD={desktop.pathD}
              drawn={desktop.drawn}
            />

            {stages.map((stage, index) => {
              const isOdd = index % 2 === 0; // stages 1, 3, 5 (1-indexed)
              // Stages 3 and 5 (index 2, 4) route the wave line over the top
              // of their photo instead of underneath, per design request —
              // stage 1 keeps the default underneath connector.
              const dotPosition = index === 2 || index === 4 ? "top" : "bottom";
              const image = (
                <StageImage
                  stage={stage}
                  dotPosition={dotPosition}
                  imgRef={(el) => {
                    imgRefs.current[index] = el;
                  }}
                  dotRef={(el) => {
                    desktopDotRefs.current[index] = el;
                  }}
                />
              );
              const card = <StageCard stage={stage} number={index + 1} arrowSide={isOdd ? "bottom" : "top"} />;

              return (
                <Reveal key={stage.id} delay={index * 90} className="relative z-10 shrink-0">
                  <Link
                    to={`/products?stage=${stage.id}`}
                    className={`group flex h-full w-32 xl:w-40 flex-col items-center gap-3 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-customer-primary ${
                      isOdd ? "justify-start" : "justify-end"
                    }`}
                  >
                    {isOdd ? (
                      <>
                        {card}
                        {image}
                      </>
                    ) : (
                      <>
                        {image}
                        {card}
                      </>
                    )}
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Below lg (mobile + tablet): the same wave, rotated 90° into a
            staggered zigzag going down instead of sideways — photos
            alternate left/right and a smooth curve threads between the
            connector dots on their inner edges, same as the desktop
            version but along the vertical axis. Keeps the "uốn lượn" look
            without the wide horizontal row a straight-line-down layout
            would otherwise need. */}
        <div ref={mobileContainerRef} className="relative mt-10 lg:hidden">
          <ConnectorSvg
            svgPathRef={mobileSvgPathRef}
            viewBox={mobile.viewBox}
            pathD={mobile.pathD}
            drawn={mobile.drawn}
          />
          <div className="relative flex flex-col gap-8">
            {stages.map((stage, index) => {
              const alignLeft = index % 2 === 0; // stages 1, 3, 5 (1-indexed): photo + card lean left
              return (
                <Reveal
                  key={stage.id}
                  delay={index * 70}
                  className={alignLeft ? "self-start" : "self-end"}
                >
                  <MobileStageRow
                    stage={stage}
                    number={index + 1}
                    alignLeft={alignLeft}
                    dotRef={(el) => {
                      mobileDotRefs.current[index] = el;
                    }}
                  />
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
