import { useEffect } from "react";
import { useFranchiseStore } from "@/stores";
import { getFranchises } from "@/services/franchiseService";
import HomeHero from "@/components/customer/home/HomeHero";
import ProductFinder from "@/components/customer/home/ProductFinder";
import CropExplorer from "@/components/customer/home/CropExplorer";
import CustomerReviews from "@/components/customer/home/CustomerReviews";
import HighlightProducts from "@/components/customer/home/HighlightProducts";
import NutritionJourney from "@/components/customer/home/NutritionJourney";
import WhyAgriFert from "@/components/customer/home/WhyAgriFert";
import VideoSection from "@/components/customer/home/VideoSection";
import TransparencyStory from "@/components/customer/home/TransparencyStory";
import FarmerKnowledge from "@/components/customer/home/FarmerKnowledge";
import StoreShopSplit from "@/components/customer/home/StoreShopSplit";
import StoreLocator from "@/components/customer/home/StoreLocator";

const PAGE_TITLE = "AgriFert - Dinh dưỡng cây trồng đúng mùa vụ";
const PAGE_DESCRIPTION =
  "Tìm phân bón phù hợp theo cây trồng, giai đoạn sinh trưởng và nhu cầu canh tác. Đặt hàng, nhận tư vấn kỹ thuật và tìm điểm bán gần bạn.";

export default function HomePage() {
  const { selectedFranchiseId, setFranchise } = useFranchiseStore();

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

  const loadFranchises = async () => {
    try {
      const res = await getFranchises();
      const list = Array.isArray(res) ? res : res?.data || [];
      if (list.length > 0 && !selectedFranchiseId) {
        setFranchise(list[0].id, list[0].name);
      }
    } catch (error) {
      console.error("Failed to load franchises:", error);
    }
  };

  useEffect(() => {
    loadFranchises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col">
      {/* 1. Hero — khách hàng biết ngay AgriFert là ai (renders the page's single <h1>) */}
      <HomeHero />

      {/* 2. Vì sao lựa chọn AgriFert? — điểm nổi bật, ngay sau Hero theo đúng hành trình mong muốn */}
      <WhyAgriFert />

      {/* 3. Sản phẩm nổi bật — gộp "sản phẩm nổi bật" + "gợi ý dành cho bạn" thành 1 row cuộn ngang tự động */}
      <HighlightProducts />

      {/* 4. Chất lượng bắt đầu từ sự minh bạch — điểm nổi bật về chất lượng/độ tin cậy */}
      <TransparencyStory />

      {/* 5. Hành trình dinh dưỡng theo giai đoạn */}
      <NutritionJourney />

      {/* 6. Khám phá theo cây trồng */}
      <CropExplorer />

      {/* 7. Khách hàng nói gì — đánh giá thực tế, 2 hàng cuộn ngang ngược chiều liên tục */}
      <CustomerReviews />

      {/* 8. Kiến thức nhà nông */}
      <FarmerKnowledge />

      {/* 9. Video "Đồng hành cùng từng mùa vụ" — câu chuyện thương hiệu */}
      <VideoSection
        posterSrc="/assets/customer/video/poster-brand-story.jpg"
        posterAlt="Hình ảnh minh họa cánh đồng vào mùa vụ"
        eyebrow="Câu chuyện thương hiệu"
        title="Đồng hành cùng từng mùa vụ"
        description="Từ nhu cầu của cây trồng đến lựa chọn của người canh tác, AgriFert hướng đến những giải pháp dễ tiếp cận, rõ ràng và phù hợp với hành trình chăm sóc từng mùa vụ."
        ctaLabel="Tìm hiểu về AgriFert"
        ctaTo="/gioi-thieu"
      />

      {/* 10. Split CTA — chọn hướng "điểm bán lẻ" hoặc "cửa hàng trực tuyến",
          thay cho VideoSection transition cũ (cùng mục đích, trực quan hơn) */}
      <StoreShopSplit />

      {/* 11. Tìm điểm bán */}
      <StoreLocator />

      {/* 12. Product Finder — chuyển xuống cuối theo yêu cầu: công cụ "chốt" cho ai chưa quyết định được */}
      <ProductFinder />
    </div>
  );
}
