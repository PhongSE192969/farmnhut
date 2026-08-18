import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCrops } from "@/services/customerHomeService";
import Reveal from "@/components/customer/ui/Reveal";

// Vertical drop for each of the 7 tiles, edge to edge: both ends sit at the
// baseline (top-aligned with the heading), dipping down smoothly toward the
// middle. On an items-start row, more margin-top = pushed further down, so
// this traces a valley/"U" curve — the two flanking tiles stay small and
// level with the heading instead of being stretched tall, matching the
// reference collage (its side photos are the same modest size as the rest,
// just positioned higher). Tiered per breakpoint (lg vs xl) alongside the
// tile size/gap tiers below.
const VALLEY_DROP = ["", "mt-8 xl:mt-10", "mt-14 xl:mt-16", "mt-16 xl:mt-20", "mt-14 xl:mt-16", "mt-8 xl:mt-10", ""];

function CropTile({ crop, className = "" }) {
  return (
    <Link
      to={`/products?crop=${crop.slug}`}
      className={`group relative block overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customer-primary ${className}`}
    >
      <img
        src={crop.image}
        alt={crop.imageAlt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <span className="absolute bottom-3 left-3 right-3 text-white font-bold text-sm drop-shadow">
        {crop.name}
      </span>
    </Link>
  );
}

export default function CropExplorer() {
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    getCrops().then(setCrops);
  }, []);

  if (crops.length === 0) return null;

  return (
    <section className="font-customer bg-white py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-10">
        <Reveal className="mx-auto max-w-xl text-center">
          <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-customer-primary">
            <span aria-hidden="true" className="h-px w-6 bg-customer-primary/40" />
            Giải pháp cây trồng
            <span aria-hidden="true" className="h-px w-6 bg-customer-primary/40" />
          </span>
          <h2 className="mt-3 text-2xl md:text-3xl font-extrabold leading-tight text-customer-ink">
            Khám phá theo cây trồng
          </h2>
          <p className="mt-3 text-sm md:text-base leading-relaxed text-customer-secondary">
            Chọn đúng cây trồng để xem sản phẩm và bộ dinh dưỡng phù hợp.
          </p>
        </Reveal>

        {/* lg+ only: a single row of all 7 tiles, same size throughout —
            items-start + the VALLEY_DROP margin-top per tile is what dips
            the middle down while the two end tiles stay level with the
            heading, tracing the collage's valley curve. Tile width/gap are
            tiered (compact at lg, full-size at xl) so the row always fits
            the container's available width — same reasoning as the
            "Gợi ý theo giai đoạn" row elsewhere on this page. */}
        <div className="hidden lg:flex items-start justify-center gap-3 xl:gap-4 mt-10">
          {crops.map((crop, index) => (
            <Reveal key={crop.id} delay={index * 60} className={VALLEY_DROP[index]}>
              <CropTile crop={crop} className="w-28 xl:w-36 aspect-[4/5] rounded-2xl" />
            </Reveal>
          ))}
        </div>

        {/* Below lg: the row above collapses to just the centered heading,
            so every crop still needs a way to appear — this plain grid,
            same as before the redesign. */}
        <div className="lg:hidden mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {crops.map((crop, index) => (
            <Reveal key={crop.id} delay={index * 60}>
              <CropTile crop={crop} className="aspect-[4/5] rounded-2xl" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
