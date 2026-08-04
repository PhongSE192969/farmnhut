import { useEffect, useState } from "react";
import {
  TrendingDown,
  Leaf,
  Flower2,
  CircleDashed,
  Grape,
  RotateCcw,
  HelpCircle,
} from "lucide-react";
import { getCropProblems } from "@/services/customerHomeService";
import SectionHeading from "@/components/customer/ui/SectionHeading";
import CustomerButton from "@/components/customer/ui/CustomerButton";
import Reveal from "@/components/customer/ui/Reveal";

const ICON_MAP = {
  TrendingDown,
  Leaf,
  Flower2,
  CircleDashed,
  Grape,
  RotateCcw,
};

export default function CropProblems() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    getCropProblems().then(setProblems);
  }, []);

  if (problems.length === 0) return null;

  return (
    <section className="font-customer bg-white py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="Cần định hướng?"
            title="Vườn của bạn đang gặp vấn đề gì?"
            description="Chọn biểu hiện gần nhất để xem sản phẩm gợi ý — mỗi biểu hiện có thể do nhiều nguyên nhân khác nhau, nên tham khảo thêm ý kiến kỹ thuật khi cần."
            className="mb-8"
          />
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {problems.map((problem, index) => {
            const Icon = ICON_MAP[problem.icon] || HelpCircle;

            return (
              <Reveal key={problem.id} delay={index * 60}>
                <a
                  href={`/products?issue=${problem.id}`}
                  className="flex flex-col gap-3 h-full rounded-2xl border border-customer-primary/10 bg-customer-cream p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-customer-primary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customer-primary"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-customer-primary/10 text-customer-primary">
                    <Icon size={20} />
                  </span>
                  <span className="font-bold text-customer-ink text-sm">{problem.label}</span>
                  <span className="text-xs text-customer-secondary leading-relaxed">
                    {problem.description}
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={200} className="mt-8 text-center">
          <CustomerButton variant="outline" to="/gioi-thieu">
            Nhận tư vấn kỹ thuật
          </CustomerButton>
        </Reveal>
      </div>
    </section>
  );
}
