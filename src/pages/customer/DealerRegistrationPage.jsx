import { useState } from "react";
import { Handshake } from "lucide-react";
import toast from "react-hot-toast";
import SectionHeading from "@/components/customer/ui/SectionHeading";
import CustomerButton from "@/components/customer/ui/CustomerButton";

const initialForm = { name: "", phone: "", email: "", location: "", message: "" };

export default function DealerRegistrationPage() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Vui lòng nhập họ tên và số điện thoại.");
      return;
    }

    // Frontend-only simulation — no backend endpoint wired up yet.
    setSubmitted(true);
    toast.success("Đã gửi đăng ký. Đội ngũ AgriFert sẽ liên hệ trong thời gian sớm nhất.");
  };

  return (
    <div className="font-customer bg-customer-cream min-h-[70vh]">
      <div className="max-w-2xl mx-auto px-4 py-12 lg:py-16">
        <span className="inline-flex items-center justify-center size-12 rounded-full bg-customer-accent/20 text-customer-primary mb-5">
          <Handshake size={22} />
        </span>

        <SectionHeading
          eyebrow="Dành cho đại lý"
          title="Đồng hành phát triển thị trường nông nghiệp bền vững"
          description="Để lại thông tin, đội ngũ AgriFert sẽ liên hệ trao đổi cụ thể về mô hình hợp tác đại lý phù hợp với khu vực của bạn."
          className="mb-8"
        />

        {submitted ? (
          <div className="rounded-2xl bg-white border border-customer-primary/10 p-6">
            <p className="font-bold text-customer-ink mb-1">Cảm ơn bạn đã quan tâm hợp tác cùng AgriFert!</p>
            <p className="text-sm text-customer-secondary">
              Đội ngũ AgriFert sẽ liên hệ với bạn qua số điện thoại đã cung cấp.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-customer-primary/10 p-6 space-y-4">
            <div>
              <label htmlFor="dealer-name" className="text-xs font-semibold text-customer-secondary">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                id="dealer-name"
                value={form.name}
                onChange={handleChange("name")}
                required
                className="mt-1 w-full h-11 px-3 rounded-xl border border-customer-primary/20 text-sm outline-none focus:border-customer-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dealer-phone" className="text-xs font-semibold text-customer-secondary">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  id="dealer-phone"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  required
                  className="mt-1 w-full h-11 px-3 rounded-xl border border-customer-primary/20 text-sm outline-none focus:border-customer-primary"
                />
              </div>
              <div>
                <label htmlFor="dealer-email" className="text-xs font-semibold text-customer-secondary">Email</label>
                <input
                  id="dealer-email"
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  className="mt-1 w-full h-11 px-3 rounded-xl border border-customer-primary/20 text-sm outline-none focus:border-customer-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="dealer-location" className="text-xs font-semibold text-customer-secondary">Khu vực dự kiến kinh doanh</label>
              <input
                id="dealer-location"
                value={form.location}
                onChange={handleChange("location")}
                placeholder="Tỉnh/thành, quận/huyện"
                className="mt-1 w-full h-11 px-3 rounded-xl border border-customer-primary/20 text-sm outline-none focus:border-customer-primary"
              />
            </div>

            <div>
              <label htmlFor="dealer-message" className="text-xs font-semibold text-customer-secondary">Chia sẻ thêm (không bắt buộc)</label>
              <textarea
                id="dealer-message"
                value={form.message}
                onChange={handleChange("message")}
                rows={3}
                className="mt-1 w-full px-3 py-2 rounded-xl border border-customer-primary/20 text-sm outline-none focus:border-customer-primary resize-none"
              />
            </div>

            <CustomerButton variant="primary" type="submit" className="w-full">
              Gửi đăng ký hợp tác
            </CustomerButton>
          </form>
        )}
      </div>
    </div>
  );
}
