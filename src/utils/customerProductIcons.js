// Maps the icon name strings stored in src/data/customer/products.js
// (benefits/symptoms arrays) to actual lucide-react components — keeps the
// data file JSON-serializable (plain strings) instead of importing React
// components into a data module.
import { Leaf, Sun, Sprout, ShieldCheck, Sparkles, AlertTriangle, Zap } from "lucide-react";

export const CUSTOMER_PRODUCT_ICONS = {
  Leaf,
  Sun,
  Sprout,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Zap,
};

export const getCustomerProductIcon = (name) => CUSTOMER_PRODUCT_ICONS[name] || Leaf;
