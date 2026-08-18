// Primary navigation for the customer-facing storefront.
export const getNavLinks = (t = {}) => [
  { key: "menu", label: t.menu || "Sản phẩm", href: "/products", megaMenu: true },
  { key: "about", label: t.about || "Về chúng tôi", href: "/gioi-thieu" },
  { key: "knowledge", label: t.knowledge || "Kiến thức nhà nông", href: "/kien-thuc-nha-nong" },
  { key: "forDealers", label: t.forDealers || "Dành cho đại lý", href: "/danh-cho-dai-ly" },
];
