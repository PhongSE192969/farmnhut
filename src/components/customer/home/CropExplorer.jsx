import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCrops } from "@/services/customerHomeService";
import SectionHeading from "@/components/customer/ui/SectionHeading";
import Reveal from "@/components/customer/ui/Reveal";

export default function CropExplorer() {
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    getCrops().then(setCrops);
  }, []);

  if (crops.length === 0) return null;

  return (
    <section className="font-customer bg-customer-light/50 py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="Giải pháp cây trồng"
            title="Khám phá theo cây trồng"
            description="Chọn đúng cây trồng để xem sản phẩm và bộ dinh dưỡng phù hợp."
            className="mb-8"
          />
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {crops.map((crop, index) => (
            <Reveal key={crop.id} delay={index * 60}>
              <Link
                to={`/products?crop=${crop.slug}`}
                className="group relative block aspect-[4/5] rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customer-primary"
              >
                <img
                  src={crop.image}
                  alt={crop.imageAlt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute bottom-3 left-3 right-3 text-white font-bold text-sm md:text-base drop-shadow">
                  {crop.name}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
