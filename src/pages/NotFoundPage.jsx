import { Sprout } from "lucide-react";
import CustomerButton from "@/components/customer/ui/CustomerButton";

export default function NotFoundPage() {
  return (
    <div className="font-customer min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-customer-cream">
      <span className="flex size-16 items-center justify-center rounded-full bg-customer-light text-customer-primary mb-6">
        <Sprout size={30} />
      </span>

      <h1 className="text-3xl font-extrabold text-customer-ink mb-2">Không tìm thấy trang</h1>
      <p className="text-customer-secondary text-sm max-w-sm mb-8">
        Trang bạn đang tìm không tồn tại hoặc đã được di chuyển. Hãy quay về
        trang chủ hoặc xem danh mục sản phẩm.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <CustomerButton variant="primary" to="/home">
          Về trang chủ
        </CustomerButton>
        <CustomerButton variant="outline" to="/products">
          Xem sản phẩm
        </CustomerButton>
      </div>
    </div>
  );
}
