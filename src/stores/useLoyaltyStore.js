import { create } from "zustand";
import { USE_MOCK_API } from "@/mocks/mockConfig";
import { mockLoyaltyTierList } from "@/mocks/mockServer";

export const useLoyaltyStore = create((set, get) => ({
  tiers: [],

  fetchTiers: async () => {
    if (get().tiers.length > 0) return;

    try {
      if (USE_MOCK_API) {
        set({
          tiers: mockLoyaltyTierList().sort(
            (a, b) => a.requiredPoints - b.requiredPoints,
          ),
        });
        return;
      }

      const response = await fetch("http://localhost:3005/api/loyalty/tiers");
      const result = await response.json();
      if (result.data) {
        const sorted = result.data.sort(
          (a, b) => a.requiredPoints - b.requiredPoints,
        );
        set({ tiers: sorted });
      }
    } catch (error) {
      console.error("Không thể lấy cấu hình Tier:", error);
    }
  },
}));
