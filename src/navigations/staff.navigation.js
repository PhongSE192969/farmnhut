import {
  Calendar,
  ClipboardList,
  ShoppingBag,
  UserPlus,
} from "lucide-react";

export const staffNavigation = {
  color: "from-[#123524] to-[#255d2d]",
  accent: "#b6d645",
  title: "Staff Portal",
  items: [
    { icon: Calendar, label: "My Schedule", href: "/staff/my-shift" },
    { icon: ClipboardList, label: "Order Management", href: "/staff/queue" },
    { icon: ShoppingBag, label: "New Order", href: "/staff/new-order" },
    { icon: UserPlus, label: "New Customer", href: "/staff/create-customer" },
  ],
};
