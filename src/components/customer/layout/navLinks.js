// Primary navigation for the customer-facing storefront.
// "Giải pháp cây trồng" intentionally points at /products — crop-based
// solutions live inside the product catalog rather than a separate page.
export const getNavLinks = (t = {}) => [
  { key: "menu", label: t.menu || "Sản phẩm", href: "/products", megaMenu: true },
  { key: "solutions", label: t.solutions || "Giải pháp cây trồng", href: "/products" },
  { key: "knowledge", label: t.knowledge || "Kiến thức nhà nông", href: "/kien-thuc-nha-nong" },
  { key: "locations", label: t.locations || "Tìm điểm bán", href: "/tim-diem-ban" },
  { key: "about", label: t.about || "Về chúng tôi", href: "/gioi-thieu" },
  { key: "forDealers", label: t.forDealers || "Dành cho đại lý", href: "/danh-cho-dai-ly" },
];
