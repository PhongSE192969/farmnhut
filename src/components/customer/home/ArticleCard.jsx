import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return null;
  }
};

export default function ArticleCard({ article }) {
  const dateLabel = formatDate(article.publishedAt);

  return (
    <Link
      to={`/kien-thuc-nha-nong/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white border border-customer-primary/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-video overflow-hidden bg-customer-light">
        <img
          src={article.coverImage}
          alt={article.coverImageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      <div className="flex flex-col gap-2 p-5">
        {dateLabel && (
          <span className="flex items-center gap-1.5 text-xs text-customer-secondary">
            <Calendar size={12} /> {dateLabel}
          </span>
        )}
        <h3 className="text-sm font-bold leading-snug text-customer-ink transition-colors group-hover:text-customer-primary">
          {article.title}
        </h3>
        <p className="text-xs leading-relaxed text-customer-secondary line-clamp-2">{article.excerpt}</p>
      </div>
    </Link>
  );
}
