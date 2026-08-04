import { Handshake } from "lucide-react";
import CustomerButton from "@/components/customer/ui/CustomerButton";
import Reveal from "@/components/customer/ui/Reveal";

export default function DealerCTA() {
  return (
    <section className="font-customer bg-customer-accent/15 py-14 lg:py-20">
      <Reveal className="max-w-3xl mx-auto px-4 text-center">
        <span className="inline-flex items-center justify-center size-12 rounded-full bg-white text-customer-primary shadow-sm mb-5">
          <Handshake size={22} />
        </span>

        <h2 className="text-2xl md:text-3xl font-extrabold text-customer-ink mb-3">
          Đồng hành phát triển thị trường nông nghiệp bền vững
        </h2>

        <p className="text-customer-secondary text-sm md:text-base leading-relaxed mb-7 max-w-xl mx-auto">
          AgriFert tìm kiếm đối tác đại lý cùng phát triển thị trường vật tư
          nông nghiệp tại địa phương. Để lại thông tin, đội ngũ AgriFert sẽ
          liên hệ trao đổi cụ thể về mô hình hợp tác.
        </p>

        <CustomerButton variant="primary" size="lg" to="/danh-cho-dai-ly">
          Đăng ký hợp tác đại lý
        </CustomerButton>
      </Reveal>
    </section>
  );
}
