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
import WhyAgriFert from "@/components/customer/home/WhyAgriFert";
import VideoSection from "@/components/customer/home/VideoSection";
import TransparencyStory from "@/components/customer/home/TransparencyStory";
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
      {/* 1. Hero — khách hàng biết ngay AgriFert là ai (renders the page's single <h1>) */}
      <HomeHero />

      {/* 2. Vì sao lựa chọn AgriFert? — điểm nổi bật, ngay sau Hero theo đúng hành trình mong muốn */}
      <WhyAgriFert />

      {/* 3. Video "Đồng hành cùng từng mùa vụ" — tiếp nối câu chuyện thương hiệu */}
      <VideoSection
        posterSrc="/assets/customer/video/poster-brand-story.jpg"
        posterAlt="Hình ảnh minh họa cánh đồng vào mùa vụ"
        eyebrow="Câu chuyện thương hiệu"
        title="Đồng hành cùng từng mùa vụ"
        description="Từ nhu cầu của cây trồng đến lựa chọn của người canh tác, AgriFert hướng đến những giải pháp dễ tiếp cận, rõ ràng và phù hợp với hành trình chăm sóc từng mùa vụ."
        ctaLabel="Tìm hiểu về AgriFert"
        ctaTo="/gioi-thieu"
      />

      {/* 4. Chất lượng bắt đầu từ sự minh bạch — điểm nổi bật về chất lượng/độ tin cậy */}
      <TransparencyStory />

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

      {/* 5. Sản phẩm nổi bật (+ gợi ý cá nhân hoá — logic cũ giữ nguyên), đúng sau phần "vì sao chọn tôi" */}
      <FeaturedProducts products={products} loading={loadingProducts} />
      <RecommendationSection franchiseId={selectedFranchiseId} topK={20} />

      {/* 6. Khám phá theo cây trồng */}
      <CropExplorer />

      {/* 7. Vấn đề / nhu cầu cây trồng */}
      <CropProblems />

      {/* 8. Hành trình dinh dưỡng theo giai đoạn */}
      <NutritionJourney />

      {/* 9. Kiến thức nhà nông */}
      <FarmerKnowledge />

      {/* 10. Video transition trước phần tìm điểm bán */}
      <VideoSection
        posterSrc="/assets/customer/video/poster-store-locator.jpg"
        posterAlt="Hình ảnh minh họa cánh đồng cây trồng theo hàng lối"
        title="Tìm sản phẩm phù hợp cho cây trồng của bạn"
        ctaLabel="Tìm điểm bán"
        ctaTo="/tim-diem-ban"
      />

      {/* 11. Tìm điểm bán */}
      <StoreLocator />

      {/* 12. Product Finder — chuyển xuống cuối theo yêu cầu: công cụ "chốt" cho ai chưa quyết định được */}
      <ProductFinder />

      {/* 13. CTA hợp tác đại lý — CTA cuối cùng trước Footer */}
      <DealerCTA />
    </div>
  );
}
