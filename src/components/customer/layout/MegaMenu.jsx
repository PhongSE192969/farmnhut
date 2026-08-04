import { useRef } from "react";
import { Link } from "react-router-dom";
import crops from "@/data/customer/crops";

/**
 * Dropdown panel for the "Sản phẩm" nav item.
 * Opens on hover (desktop) and on focus-within so it stays reachable by
 * keyboard (Tab into it, Escape to close and return focus to the trigger).
 */
export default function MegaMenu({ labels = {} }) {
  const panelRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      panelRef.current?.querySelector("a")?.blur();
      e.currentTarget.closest("li")?.querySelector("button,a")?.focus();
    }
  };

  return (
    <div
      ref={panelRef}
      onKeyDown={handleKeyDown}
      className="invisible absolute left-0 top-full z-40 w-[560px] translate-y-1 rounded-2xl border border-customer-primary/10 bg-white opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-2 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-2 group-focus-within:opacity-100"
    >
      <div className="grid grid-cols-2 gap-1 p-4">
        <Link
          to="/products"
          className="col-span-2 rounded-xl px-4 py-3 text-sm font-bold text-customer-primary hover:bg-customer-light"
        >
          {labels.allProducts || "Tất cả sản phẩm"}
        </Link>

        <p className="col-span-2 px-4 pt-2 text-xs font-bold uppercase tracking-widest text-customer-secondary">
          {labels.browseByCrops || "Khám phá theo cây trồng"}
        </p>

        {crops.slice(0, 6).map((crop) => (
          <Link
            key={crop.id}
            to={`/products?crop=${crop.slug}`}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-customer-ink hover:bg-customer-light hover:text-customer-primary transition-colors"
          >
            {crop.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
