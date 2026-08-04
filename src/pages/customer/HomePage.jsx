import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { useFranchiseStore } from "@/stores";
import { getProductsByFranchise } from "@/services/productService";
import { getFranchises } from "@/services/franchiseService";
import HomeHero from "@/components/customer/home/HomeHero";
import ProductFinder from "@/components/customer/home/ProductFinder";
import CropExplorer from "@/components/customer/home/CropExplorer";
import CropProblems from "@/components/customer/home/CropProblems";
import FeaturedProducts from "@/components/customer/home/FeaturedProducts";
import NutritionJourney from "@/components/customer/home/NutritionJourney";
import BrandValues from "@/components/customer/home/BrandValues";
import FarmerKnowledge from "@/components/customer/home/FarmerKnowledge";
import StoreLocator from "@/components/customer/home/StoreLocator";
import DealerCTA from "@/components/customer/home/DealerCTA";
import RecommendationSection from "@/components/customer/RecommendationSection";

const PAGE_TITLE = "AgriFert - Dinh dưỡng cây trồng đúng mùa vụ";
const PAGE_DESCRIPTION =
  "Tìm phân bón phù hợp theo cây trồng, giai đoạn sinh trưởng và nhu cầu canh tác. Đặt hàng, nhận tư vấn kỹ thuật và tìm điểm bán gần bạn.";

export default function HomePage() {
  const { selectedFranchiseId, selectedFranchiseName, setFranchise } = useFranchiseStore();

  const [products, setProducts] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    document.title = PAGE_TITLE;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = PAGE_DESCRIPTION;
  }, []);

  useEffect(() => {
    loadFranchises();
  }, []);

  useEffect(() => {
    if (selectedFranchiseId) {
      loadProducts(selectedFranchiseId);
    }
  }, [selectedFranchiseId]);

  const loadFranchises = async () => {
    try {
      const res = await getFranchises();
      const list = Array.isArray(res) ? res : res?.data || [];
      setFranchises(list);
      if (list.length > 0 && !selectedFranchiseId) {
        setFranchise(list[0].id, list[0].name);
      }
    } catch (error) {
      console.error("Failed to load franchises:", error);
    }
  };

  const loadProducts = async (locationId) => {
    try {
      setLoadingProducts(true);
      const res = await getProductsByFranchise(locationId);
      const list = Array.isArray(res) ? res : res?.content || res?.data?.content || [];

      const filteredList = list.filter(
        (p) =>
          p.status === "ACTIVE" &&
          p.variants &&
          p.variants.length > 0 &&
          p.variants.some((v) => v.status === "ACTIVE")
      );

      setProducts(
        filteredList.map((p) => ({
          ...p,
          variants: p.variants.filter((v) => v.status === "ACTIVE"),
          price: Number(p.price || 0),
        }))
      );
    } catch (error) {
      console.error("Load products error:", error);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="sr-only">AgriFert - Dinh dưỡng cây trồng đúng mùa vụ</h1>

      <HomeHero />
      <ProductFinder />
      <CropExplorer />
      <CropProblems />

      {franchises.length > 0 && (
        <div className="font-customer bg-white border-y border-customer-primary/10 px-4 lg:px-10 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
            <MapPin size={14} className="text-customer-primary shrink-0" />
            <span className="text-customer-secondary">Đang xem sản phẩm tại:</span>
            <select
              value={selectedFranchiseId || ""}
              onChange={(e) => {
                const fr = franchises.find((f) => f.id === e.target.value);
                if (fr) setFranchise(fr.id, fr.name);
              }}
              className="bg-transparent font-bold text-customer-primary outline-none cursor-pointer"
            >
              {franchises.map((fr) => (
                <option key={fr.id} value={fr.id}>
                  {fr.name || fr.locationName || selectedFranchiseName || "Đại lý"}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <FeaturedProducts products={products} loading={loadingProducts} />
      <NutritionJourney />
      <RecommendationSection franchiseId={selectedFranchiseId} topK={20} />
      <BrandValues />
      <FarmerKnowledge />
      <StoreLocator />
      <DealerCTA />
    </div>
  );
}
