import SectionHeading from "@/components/customer/ui/SectionHeading";
import EmptyState from "@/components/customer/ui/EmptyState";
import Reveal from "@/components/customer/ui/Reveal";
import ProductCard from "@/components/customer/ProductCard";
import CustomerButton from "@/components/customer/ui/CustomerButton";
import { ArrowRight, Package } from "lucide-react";

const SKELETON_COUNT = 8;

export default function FeaturedProducts({ products, loading }) {
  return (
    <section className="font-customer bg-customer-light/50 py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <SectionHeading
            eyebrow="Vật tư mới"
            title="Sản phẩm nổi bật"
            description="Các sản phẩm phân bón được nhiều nhà vườn lựa chọn tại đại lý của bạn."
          />
          <CustomerButton variant="ghost" to="/products" icon={ArrowRight} className="flex-row-reverse">
            Xem tất cả
          </CustomerButton>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-white/80 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Chưa có sản phẩm để hiển thị"
            description="Chọn đại lý khác hoặc quay lại sau."
            action={
              <CustomerButton variant="outline" to="/products">
                Xem toàn bộ danh mục
              </CustomerButton>
            }
          />
        ) : (
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
