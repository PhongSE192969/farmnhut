import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { getArticles } from "@/services/customerHomeService";
import SectionHeading from "@/components/customer/ui/SectionHeading";
import CustomerButton from "@/components/customer/ui/CustomerButton";
import Reveal from "@/components/customer/ui/Reveal";
import ArticleCard from "./ArticleCard";

export default function FarmerKnowledge() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    getArticles().then(setArticles);
  }, []);

  if (articles.length === 0) return null;

  const [featured, ...rest] = articles;
  const smallArticles = rest.slice(0, 3);

  return (
    <section className="font-customer bg-customer-light/50 py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <SectionHeading
            eyebrow="Kiến thức nhà nông"
            title="Chăm sóc cây trồng đúng cách"
            description="Kiến thức dinh dưỡng và kỹ thuật canh tác dành cho người trồng."
          />
          <CustomerButton variant="ghost" to="/kien-thuc-nha-nong" icon={ArrowRight} className="flex-row-reverse">
            Xem tất cả bài viết
          </CustomerButton>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Reveal>
            <ArticleCard article={featured} featured />
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-5">
            {smallArticles.map((article, index) => (
              <Reveal key={article.slug} delay={(index + 1) * 80}>
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
