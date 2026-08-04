import { useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Lightweight fade-up-on-scroll wrapper for the customer storefront.
 * No animation library — IntersectionObserver + CSS transition only.
 * Honors prefers-reduced-motion by starting already-visible (set via lazy
 * initial state, not a setState call inside the effect).
 */
export default function Reveal(props) {
  const { children, className = "", delay = 0, as: Component = "div" } = props;

  const ref = useRef(null);
  const [visible, setVisible] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Component
      ref={ref}
      className={`transition-all duration-500 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
      style={visible ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Component>
  );
}
