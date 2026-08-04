export default function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
  align = "left",
  className = "",
}) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`font-customer max-w-2xl ${alignClass} ${className}`}>
      {eyebrow && (
        <span
          className={`block text-xs font-bold uppercase tracking-widest mb-2 ${
            dark ? "text-customer-accent" : "text-customer-primary"
          }`}
        >
          {eyebrow}
        </span>
      )}
      {title && (
        <h2
          className={`text-2xl md:text-3xl font-extrabold leading-tight ${
            dark ? "text-white" : "text-customer-ink"
          }`}
        >
          {title}
        </h2>
      )}
      {description && (
        <p
          className={`mt-3 text-sm md:text-base leading-relaxed ${
            dark ? "text-white/70" : "text-customer-secondary"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
