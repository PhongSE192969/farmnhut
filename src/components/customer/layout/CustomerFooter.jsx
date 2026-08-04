import { Link } from "react-router-dom";
import { Sprout } from "lucide-react";
import { useLanguageStore } from "@/stores";
import { translations } from "@/locales";

const COMPANY_LINKS = [
  { label: "aboutUs", to: "/gioi-thieu" },
  { label: "franchise", to: "/tim-diem-ban" },
  { label: "careers", to: "/danh-cho-dai-ly" },
  { label: "press", to: "/kien-thuc-nha-nong" },
];

// No real customer-support / policy pages exist yet — point everything to
// the contact-adjacent destinations we do have rather than dead "#" links.
// Replace with real /chinh-sach/* routes once those pages are built (P1).
const SUPPORT_LINKS = [
  { label: "helpCenter", to: "/danh-cho-dai-ly" },
  { label: "contactUs", to: "/gioi-thieu" },
];

export default function CustomerFooter() {
  const { language: currentLangCode } = useLanguageStore();
  const t = translations[currentLangCode]?.customer || translations.vi?.customer || {};

  return (
    <footer className="font-customer bg-customer-primaryDark text-white px-4 lg:px-20 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-full bg-customer-accent/20 text-customer-accent flex items-center justify-center border border-customer-accent/30">
              <Sprout size={22} />
            </div>
            <span className="text-2xl font-extrabold">AgriFert</span>
          </div>

          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            {t.footer?.brandDesc ||
              "AgriFert giúp quản lý đại lý nông nghiệp, phân bón và vật tư canh tác từ danh mục, kho hàng đến đơn vật tư."}
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-customer-accent uppercase text-xs tracking-widest">
            {t.footer?.company || "Công ty"}
          </h4>
          <ul className="space-y-2">
            {COMPANY_LINKS.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="text-white/60 hover:text-customer-accent text-sm transition-colors">
                  {t.footer?.[item.label] || item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-customer-accent uppercase text-xs tracking-widest">
            {t.footer?.support || "Hỗ trợ"}
          </h4>
          <ul className="space-y-2">
            {SUPPORT_LINKS.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="text-white/60 hover:text-customer-accent text-sm transition-colors">
                  {t.footer?.[item.label] || item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-2 justify-between items-center text-center sm:text-left">
        <p className="text-white/40 text-xs">
          {t.footer?.rights || "© 2026 AgriFert. Đã đăng ký bản quyền."}
        </p>
        <Link to="/admin/login" className="text-white/30 hover:text-white/60 text-xs transition-colors">
          {t.footer?.staffPortal || "Cổng nhân viên"}
        </Link>
      </div>
    </footer>
  );
}
