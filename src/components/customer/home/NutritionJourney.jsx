import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Shovel,
  Sprout,
  HeartPulse,
  Flower,
  CircleDot,
  Apple,
  HelpCircle,
} from "lucide-react";
import { getGrowthStages } from "@/services/customerHomeService";
import SectionHeading from "@/components/customer/ui/SectionHeading";
import Reveal from "@/components/customer/ui/Reveal";

const ICON_MAP = { Shovel, Sprout, HeartPulse, Flower, CircleDot, Apple };

export default function NutritionJourney() {
  const [stages, setStages] = useState([]);

  useEffect(() => {
    getGrowthStages().then(setStages);
  }, []);

  if (stages.length === 0) return null;

  return (
    <section className="font-customer bg-customer-cream py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="Gợi ý theo giai đoạn"
            title="Hành trình dinh dưỡng cho cây trồng"
            description="Mỗi giai đoạn sinh trưởng cần một nhóm dinh dưỡng khác nhau — chọn đúng giai đoạn để xem nhóm sản phẩm khuyến nghị."
            className="mb-8"
          />
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stages.map((stage, index) => {
            const Icon = ICON_MAP[stage.icon] || HelpCircle;

            return (
              <Reveal key={stage.id} delay={index * 50}>
                <Link
                  to={`/products?stage=${stage.id}`}
                  className="group flex flex-col items-center text-center gap-3 rounded-2xl bg-white border border-customer-primary/10 p-5 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-customer-primary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customer-primary"
                >
                  <span className="flex size-12 items-center justify-center rounded-full bg-customer-accent/15 text-customer-primaryDark group-hover:bg-customer-accent/25 transition-colors">
                    <Icon size={22} />
                  </span>
                  <span className="font-bold text-sm text-customer-ink">{stage.label}</span>
                  <span className="text-xs text-customer-secondary leading-relaxed">
                    {stage.description}
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
