import { useEffect, useState } from "react";
import { getArticles } from "@/services/customerHomeService";
import SectionHeading from "@/components/customer/ui/SectionHeading";
import ArticleCard from "@/components/customer/home/ArticleCard";
import EmptyState from "@/components/customer/ui/EmptyState";
import { BookOpenText } from "lucide-react";

export default function KnowledgeListPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticles()
      .then(setArticles)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="font-customer bg-customer-cream min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12 lg:py-16">
        <SectionHeading
          eyebrow="Kiến thức nhà nông"
          title="Chăm sóc cây trồng đúng cách"
          description="Kiến thức dinh dưỡng và kỹ thuật canh tác dành cho người trồng, cập nhật định kỳ."
          className="mb-10"
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-white/80 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <EmptyState icon={BookOpenText} title="Chưa có bài viết nào" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
