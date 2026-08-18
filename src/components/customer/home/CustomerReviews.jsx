import { useEffect, useState } from "react";
import { BadgeCheck } from "lucide-react";
import { getReviews } from "@/services/customerHomeService";
import SectionHeading from "@/components/customer/ui/SectionHeading";
import Reveal from "@/components/customer/ui/Reveal";

function reviewInitial(name) {
  const lastWord = name.trim().split(/\s+/).pop() || "";
  return lastWord.charAt(0).toUpperCase();
}

function ReviewCard({ review }) {
  return (
    <div className="w-[280px] shrink-0 rounded-2xl border border-customer-primary/10 bg-customer-light/50 p-5 shadow-sm sm:w-[320px]">
      <div className="flex items-center gap-3">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${review.avatarColor}`}
          aria-hidden="true"
        >
          {reviewInitial(review.name)}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <span className="truncate text-sm font-bold text-customer-ink">{review.name}</span>
            <BadgeCheck size={15} className="shrink-0 text-emerald-500" aria-label="Khách hàng đã xác thực" />
          </div>
          <span className="block truncate text-xs text-customer-secondary">{review.location}</span>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-customer-secondary">&ldquo;{review.quote}&rdquo;</p>
    </div>
  );
}

// Renders each row's cards twice back to back and slides the track exactly
// one copy width (see .animate-marquee-* in index.css) — that's what makes
// the loop seamless instead of jumping at the end. overflow-x-auto (not
// hidden) is a deliberate fallback: under prefers-reduced-motion the CSS
// animation turns off and the track goes static, so keeping manual scroll
// available is what still lets a reduced-motion user browse every card.
function ReviewRow({ reviews, direction }) {
  const track = [...reviews, ...reviews];

  return (
    <div
      className="overflow-x-auto scrollbar-hide [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
    >
      <div
        className={`flex w-max gap-4 px-4 lg:gap-5 lg:px-10 ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        }`}
      >
        {track.map((review, index) => (
          <ReviewCard key={`${review.id}-${index}`} review={review} />
        ))}
      </div>
    </div>
  );
}

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getReviews().then(setReviews);
  }, []);

  if (reviews.length === 0) return null;

  const mid = Math.ceil(reviews.length / 2);
  const rowTop = reviews.slice(0, mid);
  const rowBottom = reviews.slice(mid);

  return (
    <section className="font-customer overflow-hidden bg-white py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="Khách hàng nói gì"
            title="Nhà vườn tin dùng AgriFert"
            description="Chia sẻ thực tế từ khách hàng đã sử dụng sản phẩm và dịch vụ của AgriFert."
            align="center"
            className="mx-auto mb-10"
          />
        </Reveal>
      </div>

      <Reveal className="flex flex-col gap-4 lg:gap-5">
        <ReviewRow reviews={rowTop} direction="left" />
        <ReviewRow reviews={rowBottom} direction="right" />
      </Reveal>
    </section>
  );
}
