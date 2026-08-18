// Data access layer for the customer storefront's product catalog page and
// detail page. Resolves the real MeriFarm product line (src/data/customer/
// products.js) rather than the generic mock catalog in src/mocks/mockServer
// used by admin/staff/manager inventory — the two are intentionally separate
// datasets (see products.js header comment). Returns Promises so this can
// be swapped for a real API call later without touching callers.
import products, { PRODUCT_CATEGORIES, CROP_TYPES, USAGE_NEEDS } from "@/data/customer/products";

export const getCustomerProducts = async () => {
  return products;
};

export const getCustomerProductById = async (id) => {
  return products.find((product) => product.id === id) || null;
};

export const getRelatedCustomerProducts = async (id, limit = 4) => {
  const current = products.find((product) => product.id === id);
  if (!current) return [];

  return products
    .filter((product) => product.id !== id && product.category === current.category)
    .slice(0, limit);
};

export const getCustomerProductCategories = async () => {
  return PRODUCT_CATEGORIES;
};

export const getCustomerProductCropTypes = async () => {
  return CROP_TYPES;
};

export const getCustomerProductUsageNeeds = async () => {
  return USAGE_NEEDS;
};
