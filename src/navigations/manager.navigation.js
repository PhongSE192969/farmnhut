import {
  Award,
  ClipboardList,
  LayoutDashboard,
  Package,
  Users,
  UserCog,
  MapPin
} from "lucide-react";

export const managerNavigation = {
  color: "from-[#123524] to-[#1b5e20]",
  accent: "#b6d645",
  title: "Manager Panel",
  items: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/manager" },
    { icon: ClipboardList, label: "Orders", href: "/manager/orders" },
    { icon: MapPin, label: "Franchises", href: "/manager/franchises" },
    {
      icon: Users,
      label: "Customers & Loyalty",
      href: "/manager/customers-loyalty",
      children: [
        { icon: Award, label: "Customers", href: "/manager/customers-loyalty/customers" },
        { icon: Award, label: "Loyalty", href: "/manager/customers-loyalty/loyalty" },
      ]
    },
    {
      icon: Package,
      label: "Catalog",
      href: "/manager/catalog",
      children: [
        { icon: Package, label: "Products", href: "/manager/catalog/products" },
        { icon: Package, label: "Categories", href: "/manager/catalog/categories" }
      ]
    },
    { icon: Package, label: "Inventories", href: "/manager/inventory" },
    { icon: Award, label: "Promotions", href: "/manager/promotions" },
    {
      icon: UserCog,
      label: "Shift Manager",
      href: "/manager/shift",
      children: [
        { icon: Package, label: "Staff", href: "/manager/shift/staff" },
        { icon: Package, label: "Shift Schedule", href: "/manager/shift/schedule" },
      ]
    },
  ],
};
