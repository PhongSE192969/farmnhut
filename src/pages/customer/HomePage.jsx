import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Star,
  Sprout,
  Zap,
  Award,
  Users,
} from "lucide-react";
import { useLanguageStore, useFranchiseStore } from "@/stores";
import { translations } from "@/locales";
import { getProductsByFranchise } from "@/services/productService";
import { getFranchises } from "@/services/franchiseService";
import ProductCard from "../../components/customer/ProductCard";
import RecommendationSection from "@/components/customer/RecommendationSection";

export default function HomePage() {
  const { language } = useLanguageStore();
  const t = (translations[language] || translations.vi).customer?.home || {};
  const { selectedFranchiseId, selectedFranchiseName, setFranchise } =
    useFranchiseStore();

  const [products, setProducts] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setLoading(true);
      const res = await getProductsByFranchise(locationId);
      const list = Array.isArray(res)
        ? res
        : res?.content || res?.data?.content || [];

      // Lọc bỏ sản phẩm: INACTIVE, hoặc variants rỗng, hoặc tất cả variants đều INACTIVE
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
      setLoading(false);
    }
  };
  const featured = products.slice(0, 4);
  const bestsellers = [...products]
    .sort((a, b) => b.price - a.price)
    .slice(0, 3);
  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }
  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      {/* Hero */}
      <section className="relative min-h-[520px] lg:min-h-[600px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(
                            90deg, 
                            rgba(15,23,42,0.92) 0%, 
                            rgba(15,23,42,0.5) 60%, 
                            rgba(15,23,42,0.1) 100%), 
                            url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1600&auto=format&fit=crop')
                        `,
          }}
        />
        <div className="relative z-10 px-4 lg:px-20 py-16 max-w-7xl mx-auto w-full">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 bg-gold/20 text-gold border border-gold/30 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
              <Zap size={12} /> {t.hero?.newArrival || "Mùa vụ mới"}
            </span>
            <h1
              className="text-white text-5xl lg:text-7xl font-black leading-[0.9] tracking-tight mb-6"
              dangerouslySetInnerHTML={{
                __html:
                  t.hero?.title || "Dinh dưỡng cây trồng<br/>chuẩn mùa vụ",
              }}
            />
            <p className="text-white/80 text-lg font-medium leading-relaxed mb-8 max-w-sm">
              {t.hero?.subtitle ||
                "Quản lý danh mục phân bón, vật tư canh tác và đơn hàng cho từng đại lý nông nghiệp trong một trải nghiệm thống nhất."}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="flex items-center gap-2 h-12 px-8 bg-gold text-primary font-black rounded-xl hover:bg-yellow-400 transition-all shadow-2xl shadow-gold/30 text-sm"
              >
                {t.hero?.orderNow || "Đặt phân bón"} <ArrowRight size={16} />
              </Link>
              <Link
                to="/products"
                className="flex items-center gap-2 h-12 px-8 bg-white/10 text-white border border-white/20 backdrop-blur-md font-bold rounded-xl hover:bg-white/20 transition-all text-sm"
              >
                {t.hero?.viewMenu || "Xem danh mục"}
              </Link>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 lg:px-20 py-4 grid grid-cols-3 gap-4">
            {[
              {
                icon: MapPin,
                value: "12",
                label: t.stats?.locations || "Đại lý",
              },
              {
                icon: Sprout,
                value: "80+",
                label: t.stats?.menuItems || "Vật tư",
              },
              { icon: Star, value: "4.9", label: t.stats?.rating || "Đánh giá" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <stat.icon size={20} className="text-gold hidden sm:block" />
                <div>
                  <div className="text-white font-black text-lg leading-tight">
                    {stat.value}
                  </div>
                  <div className="text-white/60 text-xs">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Type */}
      <section className="bg-white border-b border-gray-100 px-4 lg:px-20 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2">
            {[
              t.orderType?.pickup || "Nhận tại đại lý",
              t.orderType?.delivery || "Giao tới nông trại",
            ].map((type, i) => (
              <button
                key={type}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${i === 0
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
              >
                {i === 0 ? (
                  <div className="size-14 flex items-center justify-center rounded-full">
                    <Sprout size={18} />
                  </div>
                ) : (
                  <MapPin size={16} />
                )}
                {type}
              </button>
            ))}
          </div>
          <div className="flex-1 md:max-w-md flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 h-11">
            <MapPin size={16} className="text-gray-400" />
            <select
              value={selectedFranchiseId || ""}
              onChange={(e) => {
                const fr = franchises.find((f) => f.id === e.target.value);
                if (fr) setFranchise(fr.id, fr.name);
              }}
              className="w-full bg-transparent border-none text-sm text-gray-600 font-medium focus:outline-none cursor-pointer"
            >
              {!selectedFranchiseId && (
                <option value="">Chọn đại lý...</option>
              )}
              {franchises.map((fr) => (
                <option key={fr.id} value={fr.id}>
                  {fr.name || fr.locationName || "Đại lý"}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="px-4 lg:px-20 py-14 bg-bg-light">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-gold font-bold text-xs uppercase tracking-widest">
                {t.featured?.subtitle || "Vật tư mới"}
              </span>
              <h2 className="text-3xl font-black text-primary mt-1">
                {t.featured?.title || "Phân bón nổi bật"}
              </h2>
            </div>
            <Link
              to="/products"
              className="text-sm font-bold text-primary hover:text-gold transition-colors flex items-center gap-1"
            >
              {t.featured?.viewAll || "Xem tất cả"} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Banner */}
      <section className="bg-primary text-white px-4 lg:px-20 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-gold font-bold text-xs uppercase tracking-widest">
              {t.whyUs?.subtitle || "Vì sao chọn AgriFert"}
            </span>
            <h2 className="text-3xl font-black mt-2">
              {t.whyUs?.title || "Quản lý vật tư nông nghiệp gọn và rõ"}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Sprout,
                title: t.whyUs?.flavors?.title || "Danh mục đúng mùa vụ",
                desc:
                  t.whyUs?.flavors?.desc ||
                  "Theo dõi nhóm phân bón, quy cách đóng gói và tồn kho theo từng đại lý để tư vấn đúng nhu cầu canh tác.",
              },
              {
                icon: Zap,
                title: t.whyUs?.quick?.title || "Xử lý đơn nhanh",
                desc:
                  t.whyUs?.quick?.desc ||
                  "Đặt trước, giữ hàng và giao đến trang trại với trạng thái đơn hàng rõ ràng từ lúc xác nhận đến hoàn tất.",
              },
              {
                icon: Award,
                title: t.whyUs?.rewards?.title || "Ưu đãi đại lý",
                desc:
                  t.whyUs?.rewards?.desc ||
                  "Quản lý chương trình điểm thưởng, mã ưu đãi và quyền lợi khách hàng thân thiết trong mùa cao điểm.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="size-14 rounded-xl bg-gold/20 text-gold flex items-center justify-center border border-gold/30">
                  <item.icon size={24} />
                </div>
                <h3 className="font-black text-lg">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="px-4 lg:px-20 py-14 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-gold font-bold text-xs uppercase tracking-widest">
                {t.bestsellers?.subtitle || "Nhà vườn tin dùng"}
              </span>
              <h2 className="text-3xl font-black text-primary mt-1">
                {t.bestsellers?.title || "Phân bón bán chạy"}
              </h2>
            </div>
            <Link
              to="/products"
              className="text-sm font-bold text-primary hover:text-gold transition-colors flex items-center gap-1"
            >
              {t.bestsellers?.fullMenu || "Toàn bộ danh mục"} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bestsellers.map((product, i) => (
              <div key={product.id} className="relative">
                {i === 0 && (
                  <div className="absolute -top-3 left-4 z-10 bg-gold text-primary text-xs font-black px-3 py-1 rounded-full shadow">
                    {t.bestsellers?.topSeller || "#1 bán chạy"}
                  </div>
                )}
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <RecommendationSection franchiseId={selectedFranchiseId} topK={20} />

      {/* CTA */}
      <section className="bg-bg-light px-4 lg:px-20 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="size-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/30">
            <div className="size-14 flex items-center justify-center rounded-full">
              <img
                src="/agri-logo.svg"
                alt="AgriFert"
                className="size-full object-contain"
              />
            </div>
          </div>
          <h2 className="text-4xl font-black text-primary mb-4">
            {t.members?.title || "Trở thành khách hàng thân thiết"}
          </h2>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            {t.members?.desc ||
              "Tích lũy điểm trên mỗi đơn vật tư, nhận ưu đãi theo mùa vụ và theo dõi lịch sử mua hàng cho trang trại của bạn."}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              className="flex items-center gap-2 h-12 px-8 bg-gold text-primary font-black rounded-xl hover:bg-yellow-400 transition-all shadow-xl shadow-gold/20 text-sm"
            >
              {t.members?.joinFree || "Tham gia miễn phí"} <Users size={16} />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 h-12 px-8 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all text-sm"
            >
              {t.members?.signIn || "Đăng nhập"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
