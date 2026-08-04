import { useState } from "react";
import { Leaf, ShieldCheck, BookOpenText, Users } from "lucide-react";
import toast from "react-hot-toast";
import SectionHeading from "@/components/customer/ui/SectionHeading";
import CustomerButton from "@/components/customer/ui/CustomerButton";

// See src/components/customer/home/BrandValues.jsx for the same
// intentionally-general copy note — replace with verified content before
// production.
const VALUES = [
  { icon: Leaf, title: "Lựa chọn nguyên liệu", description: "Nguyên liệu đầu vào được lựa chọn phù hợp với từng nhóm sản phẩm phân bón." },
  { icon: ShieldCheck, title: "Kiểm soát chất lượng", description: "Quy trình đóng gói và bảo quản theo hướng dẫn của từng sản phẩm." },
  { icon: BookOpenText, title: "Hướng dẫn sử dụng rõ ràng", description: "Mỗi sản phẩm có hướng dẫn liều lượng và cách dùng cụ thể." },
  { icon: Users, title: "Đồng hành cùng người trồng", description: "Đội ngũ kỹ thuật sẵn sàng hỗ trợ tư vấn khi bạn cần." },
];

export default function AboutPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Vui lòng nhập họ tên và số điện thoại.");
      return;
    }
    // Frontend-only simulation — no backend endpoint wired up yet.
    setSubmitted(true);
    toast.success("Đã gửi yêu cầu tư vấn. AgriFert sẽ liên hệ lại sớm.");
  };

  return (
    <div className="font-customer bg-customer-cream">
      <div className="max-w-5xl mx-auto px-4 py-12 lg:py-16">
        <SectionHeading
          eyebrow="Về chúng tôi"
          title="AgriFert đồng hành cùng người trồng"
          description="AgriFert cung cấp sản phẩm phân bón và hỗ trợ kỹ thuật cho nông dân, chủ vườn và hệ thống đại lý phân phối."
          className="mb-10"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {VALUES.map((item) => (
            <div key={item.title} className="rounded-2xl bg-white border border-customer-primary/10 p-5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-customer-light text-customer-primary mb-3">
                <item.icon size={20} />
              </span>
              <h3 className="font-bold text-sm text-customer-ink mb-1">{item.title}</h3>
              <p className="text-xs text-customer-secondary leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="max-w-lg rounded-2xl bg-white border border-customer-primary/10 p-6">
          <h2 className="font-bold text-customer-ink mb-1">Cần tư vấn kỹ thuật?</h2>
          <p className="text-sm text-customer-secondary mb-4">
            Để lại thông tin, đội ngũ kỹ thuật AgriFert sẽ liên hệ hỗ trợ bạn.
          </p>

          {submitted ? (
            <p className="text-sm font-semibold text-customer-primary">
              Cảm ơn bạn! Đội ngũ AgriFert sẽ liên hệ sớm nhất.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="about-name" className="text-xs font-semibold text-customer-secondary">Họ và tên</label>
                <input
                  id="about-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full h-11 px-3 rounded-xl border border-customer-primary/20 text-sm outline-none focus:border-customer-primary"
                />
              </div>
              <div>
                <label htmlFor="about-phone" className="text-xs font-semibold text-customer-secondary">Số điện thoại</label>
                <input
                  id="about-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full h-11 px-3 rounded-xl border border-customer-primary/20 text-sm outline-none focus:border-customer-primary"
                />
              </div>
              <div>
                <label htmlFor="about-question" className="text-xs font-semibold text-customer-secondary">Câu hỏi (không bắt buộc)</label>
                <textarea
                  id="about-question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={3}
                  className="mt-1 w-full px-3 py-2 rounded-xl border border-customer-primary/20 text-sm outline-none focus:border-customer-primary resize-none"
                />
              </div>
              <CustomerButton variant="primary" type="submit" className="w-full">
                Gửi yêu cầu tư vấn
              </CustomerButton>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
