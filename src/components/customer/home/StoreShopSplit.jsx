import { Link } from "react-router-dom";
import { MapPin, ShoppingBag } from "lucide-react";

// Full-bleed split CTA banner — layout borrowed from a reference mockup,
// recolored to the existing AgriFert palette. Replaces the earlier
// VideoSection transition here since both served the same "pick your next
// step" purpose; this offers two concrete destinations instead of one.
const PANELS = [
  {
    title: "Điểm bán lẻ",
    subtitle: "Tìm đại lý gần bạn",
    image: "/assets/customer/crops/cay-cong-nghiep.jpg",
    imageAlt: "Vườn cây công nghiệp dài ngày — hình ảnh minh họa",
    to: "/tim-diem-ban",
    icon: MapPin,
    cta: "Tìm điểm bán",
  },
  {
    title: "Cửa hàng trực tuyến",
    subtitle: "Mua sắm trực tiếp",
    image: "/assets/customer/crops/rau-mau.jpg",
    imageAlt: "Luống rau màu xanh non — hình ảnh minh họa",
    to: "/products",
    icon: ShoppingBag,
    cta: "Xem cửa hàng",
  },
];

export default function StoreShopSplit() {
  return (
    <section className="font-customer grid grid-cols-1 md:grid-cols-2 h-[420px] md:h-[520px]">
      {PANELS.map((panel) => (
        <Link key={panel.title} to={panel.to} className="group relative overflow-hidden">
          <img
            src={panel.image}
            alt={panel.imageAlt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-customer-primaryDark/55 group-hover:bg-customer-primaryDark/45 transition-colors duration-300" />

          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-6">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-wide mb-3">{panel.title}</h2>
            <p className="text-xs uppercase tracking-[0.2em] text-white/80 mb-8">{panel.subtitle}</p>
            <span className="inline-flex items-center gap-2 border border-white/70 rounded-full px-6 py-3 text-xs uppercase tracking-widest font-bold transition-all duration-300 group-hover:bg-white group-hover:text-customer-primaryDark">
              {panel.cta}
              <panel.icon size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}
