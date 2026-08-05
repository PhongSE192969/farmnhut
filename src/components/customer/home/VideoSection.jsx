import { useEffect, useRef, useState } from "react";
import CustomerButton from "@/components/customer/ui/CustomerButton";
import Reveal from "@/components/customer/ui/Reveal";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const prefersSaveData = () =>
  typeof navigator !== "undefined" && navigator.connection?.saveData === true;

/**
 * Full-bleed background section — video if a source is provided (and the
 * viewport/network/motion preferences allow it), poster image otherwise.
 * `videoSrc` is optional on purpose: pass it once a real, compressed local
 * video file exists (see public/assets/customer/video/ + ATTRIBUTION.md —
 * neither placement currently ships a video file).
 */
export default function VideoSection({
  posterSrc,
  posterAlt,
  videoSrc,
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaTo,
}) {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const canPlayVideo =
    Boolean(videoSrc) && !videoFailed && !prefersReducedMotion() && !prefersSaveData();

  useEffect(() => {
    if (!canPlayVideo) return;

    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoSrc]);

  return (
    <section
      ref={sectionRef}
      className="font-customer relative min-h-[420px] lg:min-h-[480px] flex items-center overflow-hidden bg-customer-primaryDark"
    >
      <img
        src={posterSrc}
        alt={posterAlt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {canPlayVideo && inView && (
        <video
          key={videoSrc}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          autoPlay
          loop
          preload="none"
          poster={posterSrc}
          onError={() => setVideoFailed(true)}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      <div className="absolute inset-0 bg-customer-primaryDark/60" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 lg:px-10 py-16 text-center">
        <Reveal>
          {eyebrow && (
            <span className="text-customer-accent text-xs font-bold uppercase tracking-widest">
              {eyebrow}
            </span>
          )}
          <h2 className="mt-2 text-2xl md:text-3xl font-extrabold text-white leading-tight">
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-white/80 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              {description}
            </p>
          )}
          {ctaLabel && ctaTo && (
            <CustomerButton variant="accent" size="lg" to={ctaTo} className="mt-7">
              {ctaLabel}
            </CustomerButton>
          )}
        </Reveal>
      </div>
    </section>
  );
}
