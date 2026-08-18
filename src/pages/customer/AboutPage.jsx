import { useState } from "react";
import { Leaf, Users, CheckCircle2, Check } from "lucide-react";
import toast from "react-hot-toast";
import SectionHeading from "@/components/customer/ui/SectionHeading";
import CustomerButton from "@/components/customer/ui/CustomerButton";
import Reveal from "@/components/customer/ui/Reveal";

// Intentionally general copy — no fabricated founding year, dealer count,
// or team headcount. Replace with verified content before production.
// Photos (not icons) illustrate each value — see ATTRIBUTION.md for sources.
const VALUES = [
  {
    title: "Lựa chọn nguyên liệu",
    description: "Nguyên liệu đầu vào được lựa chọn phù hợp với từng nhóm sản phẩm phân bón.",
    image: "/assets/customer/about/value-materials.jpg",
    imageAlt: "Cận cảnh hạt phân bón",
  },
  {
    title: "Kiểm soát chất lượng",
    description: "Quy trình đóng gói và bảo quản theo hướng dẫn của từng sản phẩm.",
    image: "/assets/customer/about/value-quality.jpg",
    imageAlt: "Bàn tay kiểm tra chất lượng đất",
  },
  {
    title: "Hướng dẫn sử dụng rõ ràng",
    description: "Mỗi sản phẩm có hướng dẫn liều lượng và cách dùng cụ thể.",
    image: "/assets/customer/about/value-guidance.jpg",
    imageAlt: "Nông dân Việt Nam đội nón lá làm ruộng đúng phương pháp",
  },
  {
    title: "Đồng hành cùng người trồng",
    description: "Đội ngũ kỹ thuật sẵn sàng hỗ trợ tư vấn khi bạn cần.",
    image: "/assets/customer/about/value-companion.jpg",
    imageAlt: "Nhóm nông dân Việt Nam cùng nhau cấy lúa trên ruộng bậc thang",
  },
];

const APPROACH_POINTS = [
  "Sản phẩm được tổ chức theo cây trồng và giai đoạn sinh trưởng, thay vì chỉ liệt kê theo danh mục chung chung.",
  "Thông tin thành phần, liều lượng và cách dùng được trình bày rõ ràng ngay trên từng sản phẩm.",
  "Có đội ngũ kỹ thuật hỗ trợ tư vấn khi người trồng cần thêm hướng dẫn.",
];

const AUDIENCES = [
  "Nông dân canh tác hộ gia đình",
  "Chủ vườn và trang trại quy mô vừa",
  "Hợp tác xã nông nghiệp",
  "Đại lý và cửa hàng vật tư nông nghiệp",
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
      {/* Hero — bespoke (not the shared PageHero, which other pages still
          use) because this page wants the centered/no-CTA/scalloped-edge
          treatment from the reference layout, and PageHero is shared with
          ProductsPage — changing it here would change that page too. */}
      <section className="font-customer relative flex min-h-[440px] lg:min-h-[560px] items-center overflow-hidden bg-customer-primaryDark">
        <img
          src="/assets/customer/about/hero-farmer-crops.jpg"
          alt="Nhiều nông dân Việt Nam đội nón lá cùng cấy lúa trên ruộng bậc thang"
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-customer-primaryDark/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-customer-primaryDark/80 via-customer-primaryDark/25 to-transparent" />

        {/* Centered, unlike the previous single-portrait version of this
            hero: this photo is a wide, evenly busy scene (many workers
            spread across the frame) rather than one off-center subject, so
            there's no single face/hat to dodge — a uniform overlay + center
            alignment reads cleanly from any point in the image. */}
        <Reveal className="relative z-10 mx-auto max-w-2xl px-4 py-16 text-center lg:py-20">
          <span className="mx-auto mb-4 flex size-10 items-center justify-center rounded-full bg-white/10">
            <Leaf size={18} className="text-customer-accent" />
          </span>
          <span className="block text-xs font-bold uppercase tracking-widest text-customer-accent">
            Câu chuyện AgriFert
          </span>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.45)] md:text-5xl">
            Từ hạt giống đến mùa gặt, luôn có AgriFert
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.4)] md:text-base">
            Mỗi sản phẩm AgriFert được xây dựng từ hiểu biết thực tế về cây trồng Việt Nam, để người
            nông dân yên tâm chăm sóc mùa vụ ngay từ những ngày đầu xuống giống.
          </p>
        </Reveal>

        <div aria-hidden="true" className="hero-scallop absolute inset-x-0 bottom-0 z-10 h-5 lg:h-8" />
      </section>

      {/* Về AgriFert — ảnh + danh sách, vị trí ngay sau hero theo đúng bố cục tham khảo */}
      <section className="bg-white py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] lg:aspect-square">
              <img
                src="/assets/customer/about/about-hands-plant.jpg"
                alt="Cận cảnh đôi tay đang chăm sóc cây trồng giữa những tán lá xanh"
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 bg-white/95 backdrop-blur px-4 py-2.5 rounded-xl shadow-lg">
                <Leaf size={18} className="text-customer-primary" />
                <span className="text-xs font-bold text-customer-ink">Đồng hành theo mùa vụ</span>
              </span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <SectionHeading
              eyebrow="Về AgriFert"
              title="Bắt đầu từ cây trồng, không phải từ danh mục sản phẩm"
              description="AgriFert tổ chức thông tin và sản phẩm xoay quanh nhu cầu thực tế của người trồng, để việc lựa chọn phân bón trở nên rõ ràng và bớt phức tạp hơn."
            />

            <ul className="mt-6 space-y-4">
              {APPROACH_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-customer-primary" />
                  <span className="text-sm text-customer-secondary leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <CustomerButton variant="primary" to="/products">
                Khám phá sản phẩm
              </CustomerButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Sứ mệnh & Tầm nhìn — mỗi thẻ mở đầu bằng một ảnh minh họa thay vì
          icon chip, để nội dung trừu tượng ("sứ mệnh", "tầm nhìn") có một
          hình ảnh cụ thể neo vào thay vì chỉ có chữ. */}
      <section className="bg-customer-cream py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-10">
          <Reveal>
            <SectionHeading
              eyebrow="Sứ mệnh & Tầm nhìn"
              title="Vì sao AgriFert tồn tại"
              align="center"
              className="mx-auto mb-10"
            />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <Reveal>
              <div className="h-full overflow-hidden rounded-3xl border border-customer-primary/10 bg-white shadow-sm">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src="/assets/customer/hero/hero-hands-seedling.jpg"
                    alt="Đôi tay nâng niu một cây con mới nảy mầm"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6 lg:p-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-customer-primary">
                    Sứ mệnh
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-customer-secondary">
                    Giúp người trồng chọn đúng sản phẩm dinh dưỡng cho từng cây trồng và giai đoạn sinh
                    trưởng, thay vì phải tự mò mẫm giữa hàng trăm lựa chọn trên thị trường.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="h-full overflow-hidden rounded-3xl bg-customer-primaryDark text-white shadow-sm">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src="/assets/customer/why-agrifert.jpg"
                    alt="Ảnh flycam cánh đồng canh tác quy mô lớn"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6 lg:p-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-customer-accent">
                    Tầm nhìn
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-white/75">
                    Trở thành lựa chọn tin cậy của người trồng và hệ thống đại lý trên hành trình canh
                    tác bền vững, ở bất kỳ vùng miền hay quy mô canh tác nào.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Giá trị cốt lõi — mỗi giá trị minh họa bằng một ảnh thật thay vì
          icon, đặt trên nền sáng để ảnh là điểm nhấn thị giác chính thay vì
          nền tối phủ ảnh như bản trước. */}
      <section className="bg-white py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-10">
          <Reveal>
            <SectionHeading
              eyebrow="Giá trị cốt lõi"
              title="Điều AgriFert theo đuổi trong từng sản phẩm"
              description="Bốn nguyên tắc xuyên suốt cách AgriFert lựa chọn, đóng gói và giới thiệu sản phẩm đến người trồng."
              align="center"
              className="mx-auto mb-10"
            />
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((item, index) => (
              <Reveal key={item.title} delay={index * 70}>
                <div className="group h-full overflow-hidden rounded-2xl border border-customer-primary/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <span className="block h-0.5 w-8 rounded-full bg-customer-accent" />
                    <h3 className="mt-3 font-bold text-sm text-customer-ink">{item.title}</h3>
                    <p className="mt-1.5 text-xs text-customer-secondary leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Hỗ trợ những ai — danh sách + ảnh, đối xứng ngược với section "Về
          AgriFert" phía trên (ảnh bên phải thay vì bên trái). Nền cream để
          xen kẽ với 2 section trắng liền kề phía trên/dưới. */}
      <section className="bg-customer-cream py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <Reveal>
            <SectionHeading
              eyebrow="Hỗ trợ những ai"
              title="Đồng hành cùng nhiều đối tượng người trồng khác nhau"
              description="Dù bạn canh tác quy mô hộ gia đình hay vận hành cả hệ thống đại lý, AgriFert đều có sản phẩm và đội ngũ hỗ trợ phù hợp."
            />

            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {AUDIENCES.map((audience) => (
                <li key={audience} className="flex items-center gap-2.5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-customer-primary text-white">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span className="text-sm font-semibold text-customer-ink">{audience}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <CustomerButton variant="primary" to="/products">
                Xem sản phẩm phù hợp
              </CustomerButton>
            </div>
          </Reveal>

          <Reveal delay={80} className="order-first lg:order-last">
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/5]">
              <img
                src="/assets/customer/about/support-smallholder-farmer.jpg"
                alt="Nông dân canh tác hộ nhỏ tươi cười, gánh giỏ rau vừa thu hoạch"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cần tư vấn kỹ thuật — form giữ nguyên logic, chỉ nâng cấp trình bày */}
      <section className="relative overflow-hidden bg-white py-14 lg:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-customer-primary/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -left-10 size-64 rounded-full bg-customer-accent/25 blur-3xl"
        />

        <Reveal className="relative max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-xl border border-customer-primary/10">
            <div className="bg-customer-primaryDark p-8 lg:p-10 flex flex-col justify-center text-white">
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-customer-accent mb-5">
                <Users size={22} />
              </span>
              <h2 className="text-2xl font-extrabold mb-3">Cần tư vấn kỹ thuật?</h2>
              <p className="text-sm text-white/75 leading-relaxed">
                Để lại thông tin, đội ngũ kỹ thuật AgriFert sẽ liên hệ hỗ trợ bạn chọn đúng sản phẩm
                cho cây trồng và giai đoạn sinh trưởng hiện tại.
              </p>
            </div>

            <div className="bg-white p-8 lg:p-10">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-6">
                  <CheckCircle2 size={40} className="text-customer-primary mb-3" />
                  <p className="text-sm font-semibold text-customer-primary">
                    Cảm ơn bạn! Đội ngũ AgriFert sẽ liên hệ sớm nhất.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="about-name" className="text-xs font-semibold text-customer-secondary">
                      Họ và tên
                    </label>
                    <input
                      id="about-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full h-11 px-3 rounded-xl border border-customer-primary/20 text-sm outline-none focus:border-customer-primary focus:ring-2 focus:ring-customer-primary/10 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="about-phone" className="text-xs font-semibold text-customer-secondary">
                      Số điện thoại
                    </label>
                    <input
                      id="about-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 w-full h-11 px-3 rounded-xl border border-customer-primary/20 text-sm outline-none focus:border-customer-primary focus:ring-2 focus:ring-customer-primary/10 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="about-question" className="text-xs font-semibold text-customer-secondary">
                      Câu hỏi (không bắt buộc)
                    </label>
                    <textarea
                      id="about-question"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      rows={3}
                      className="mt-1 w-full px-3 py-2 rounded-xl border border-customer-primary/20 text-sm outline-none focus:border-customer-primary focus:ring-2 focus:ring-customer-primary/10 transition-all resize-none"
                    />
                  </div>
                  <CustomerButton variant="primary" type="submit" className="w-full">
                    Gửi yêu cầu tư vấn
                  </CustomerButton>
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
