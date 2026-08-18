import Reveal from "./Reveal";

/**
 * Shared static page-header hero for customer-facing pages other than the
 * homepage (which has its own slideshow HomeHero). Same visual language —
 * full-bleed image, dark overlay tuned for white text, accent eyebrow — but
 * without the crossfade/Ken-Burns motion, since sub-pages only need one photo.
 */
export default function PageHero({
  image,
  imageAlt,
  eyebrow,
  title,
  description,
  children,
  minHeightClassName = "min-h-[320px] lg:min-h-[380px]",
}) {
  return (
    <section
      className={`font-customer relative flex items-center overflow-hidden bg-customer-primaryDark ${minHeightClassName}`}
    >
      <img
        src={image}
        alt={imageAlt}
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-customer-primaryDark/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-customer-primaryDark/50 via-customer-primaryDark/10 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 lg:px-10 py-16 lg:py-20">
        <Reveal className="max-w-2xl">
          {eyebrow && (
            <span className="block text-xs font-bold uppercase tracking-widest text-customer-accent mb-3">
              {eyebrow}
            </span>
          )}
          <h1 className="text-white text-3xl md:text-5xl font-extrabold leading-tight tracking-tight [text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-white/90 text-sm md:text-base leading-relaxed max-w-xl [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]">
              {description}
            </p>
          )}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
