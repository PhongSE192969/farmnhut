// Data access layer for the customer homepage.
//
// Every getter here currently resolves mock data (see src/data/customer/*),
// but returns a Promise and a stable shape on purpose so callers don't
// change when these are swapped for real API calls later — only the
// function bodies below need to change.
import crops from "@/data/customer/crops";
import cropProblems from "@/data/customer/cropProblems";
import growthStages from "@/data/customer/growthStages";
import articles from "@/data/customer/articles";
import reviews from "@/data/customer/reviews";
import { getFranchises } from "@/services/franchiseService";
import { getProvinces } from "@/utils/mockData";

export const getCrops = async () => {
  return crops;
};

export const getCropProblems = async () => {
  return cropProblems;
};

export const getReviews = async () => {
  return reviews;
};

export const getGrowthStages = async () => {
  return growthStages;
};

export const getArticles = async () => {
  return articles;
};

export const getArticleBySlug = async (slug) => {
  return articles.find((article) => article.slug === slug) || null;
};

/**
 * Real franchise/dealer list — NOT mock data. Reuses the existing
 * franchiseService so the store locator never shows fabricated dealers.
 */
export const getDealers = async () => {
  const res = await getFranchises();
  return Array.isArray(res) ? res : res?.data || [];
};

/**
 * Vietnam provinces for the store-locator region picker — reuses the
 * existing getProvinces() utility (backed by provinces.open-api.vn / a
 * small local fallback), not a new hardcoded list.
 */
export const getRegions = async () => {
  return getProvinces();
};
