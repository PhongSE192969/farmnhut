import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { getArticleBySlug } from "@/services/customerHomeService";
import CustomerButton from "@/components/customer/ui/CustomerButton";

export default function KnowledgeArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(undefined);

  useEffect(() => {
    let active = true;
    getArticleBySlug(slug).then((result) => {
      if (active) setArticle(result);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (article === null) {
    return <Navigate to="/kien-thuc-nha-nong" replace />;
  }

  if (article === undefined) {
    return (
      <div className="font-customer max-w-3xl mx-auto px-4 py-16 animate-pulse space-y-4">
        <div className="h-6 w-40 bg-customer-light rounded" />
        <div className="aspect-video bg-customer-light rounded-2xl" />
        <div className="h-8 w-2/3 bg-customer-light rounded" />
      </div>
    );
  }

  const dateLabel = new Date(article.publishedAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <article className="font-customer bg-customer-cream min-h-[60vh]">
      <div className="max-w-3xl mx-auto px-4 py-10 lg:py-14">
        <Link
          to="/kien-thuc-nha-nong"
          className="inline-flex items-center gap-2 text-sm font-semibold text-customer-primary hover:text-customer-primaryDark mb-6"
        >
          <ArrowLeft size={16} /> Tất cả bài viết
        </Link>

        <div className="aspect-video rounded-2xl overflow-hidden bg-customer-light mb-6">
          <img
            src={article.coverImage}
            alt={article.coverImageAlt}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        <span className="flex items-center gap-1.5 text-xs text-customer-secondary mb-3">
          <Calendar size={12} /> {dateLabel}
        </span>

        <h1 className="text-2xl md:text-3xl font-extrabold text-customer-ink leading-tight mb-4">
          {article.title}
        </h1>

        <p className="text-customer-secondary text-base leading-relaxed mb-6">
          {article.excerpt}
        </p>

        <div className="text-customer-ink leading-relaxed text-sm md:text-base whitespace-pre-line">
          {article.content}
        </div>

        <div className="mt-10 pt-6 border-t border-customer-primary/10">
          <CustomerButton variant="outline" to="/gioi-thieu">
            Cần tư vấn thêm? Liên hệ đội ngũ AgriFert
          </CustomerButton>
        </div>
      </div>
    </article>
  );
}
