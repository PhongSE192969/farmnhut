import { createElement, useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  MessageCircleQuestion,
  FlaskConical,
  MapPin,
  Package,
  Boxes,
  Sparkles,
  Archive,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/stores/cartStore";
import { formatCurrency } from "@/utils/helpers";
import { getCustomerProductById, getRelatedCustomerProducts } from "@/services/customerProductService";
import { getCustomerProductIcon } from "@/utils/customerProductIcons";
import CustomerButton from "@/components/customer/ui/CustomerButton";
import Reveal from "@/components/customer/ui/Reveal";

const BADGE_STYLES = {
  "Bán chạy": "bg-customer-earth text-white",
  Mới: "bg-customer-primary text-white",
};

const TABS = [
  { key: "overview", label: "Tổng quan" },
  { key: "ingredients", label: "Thành phần" },
  { key: "usage", label: "Công dụng" },
  { key: "crops", label: "Cây phù hợp" },
  { key: "howToUse", label: "Cách sử dụng" },
  { key: "storage", label: "Bảo quản" },
];

function SpecItem({ icon, label, value }) {
  return (
    <div className="rounded-xl bg-customer-cream/60 border border-customer-primary/10 p-4">
      <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-customer-secondary mb-1.5">
        {createElement(icon, { size: 13, className: "text-customer-primary" })}
        {label}
      </span>
      <p className="text-sm font-semibold text-customer-ink">{value}</p>
    </div>
  );
}

function InfoCard({ item }) {
  return (
    <div className="h-full rounded-2xl bg-white border border-customer-primary/10 p-5">
      <span className="flex size-10 items-center justify-center rounded-xl bg-customer-light text-customer-primary mb-3">
        {createElement(getCustomerProductIcon(item.icon), { size: 19 })}
      </span>
      <h3 className="font-bold text-sm text-customer-ink mb-1">{item.title}</h3>
      <p className="text-xs text-customer-secondary leading-relaxed">{item.description}</p>
    </div>
  );
}

// Keyed by `id` from the default export below — a route param change fully
// remounts this component instead of resetting loading/activeTab/qty by hand,
// so there's no setState-in-effect cascade to reason about.
function ProductDetailPageContent({ id }) {
  const navigate = useNavigate();
  const { addItem } = useCartStore();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    Promise.all([getCustomerProductById(id), getRelatedCustomerProducts(id)]).then(
      ([productData, relatedList]) => {
        setProduct(productData);
        setRelated(relatedList);
        setLoading(false);
      }
    );
  }, [id]);

  const totalPrice = useMemo(() => (product ? product.price * qty : 0), [product, qty]);

  const addToCart = async (quantity) => {
    if (!product) return false;

    let success = true;
    for (let i = 0; i < quantity; i++) {
      const added = await addItem(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.image,
          selectedVariantName: product.unit,
        },
        {
          variantId: `${product.id}-default`,
          productVariantId: `${product.id}-default`,
          variantName: product.unit,
          sku: product.id,
        },
        999
      );
      if (!added) {
        success = false;
        break;
      }
    }
    return success;
  };

  const handleAddToCart = async () => {
    const success = await addToCart(qty);
    if (success) {
      toast.success(`Đã thêm ${qty}x ${product.name} vào giỏ vật tư!`);
    }
  };

  const handleBuyNow = async () => {
    const success = await addToCart(qty);
    if (success) {
      navigate("/checkout");
    }
  };

  if (loading) {
    return (
      <div className="font-customer min-h-screen flex items-center justify-center text-customer-primary font-bold">
        Đang tải...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="font-customer min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-customer-ink">Không tìm thấy sản phẩm</h2>
          <div className="mt-4">
            <CustomerButton variant="primary" to="/products" icon={ArrowLeft}>
              Quay lại danh mục
            </CustomerButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-customer min-h-screen bg-customer-cream">
      <div className="bg-white border-b border-customer-primary/10 px-4 lg:px-10 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-customer-secondary">
          <Link to="/" className="hover:text-customer-primary transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-customer-primary transition-colors">
            Sản phẩm
          </Link>
          <span>/</span>
          <span className="text-customer-ink font-semibold">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Reveal>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-customer-primary/10 shadow-lg">
              <img
                src={product.image}
                alt={product.imageAlt}
                className="w-full h-full object-contain p-8"
              />
              {product.badges.length > 0 && (
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.badges.map((badge) => (
                    <span
                      key={badge}
                      className={`text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg shadow ${BADGE_STYLES[badge] || "bg-customer-primary text-white"}`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={80} className="flex flex-col gap-6">
            <div>
              <span className="text-customer-primary font-bold text-xs uppercase tracking-widest">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-customer-ink mt-2 leading-tight">
                {product.name}
              </h1>
              <p className="text-customer-secondary mt-3 leading-relaxed text-sm">{product.tagline}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <SpecItem icon={FlaskConical} label="Thành phần chính" value={product.mainIngredients} />
              <SpecItem icon={MapPin} label="Xuất xứ" value={product.origin} />
              <SpecItem icon={Boxes} label="Quy cách" value={product.unit} />
              <SpecItem icon={Package} label="Dạng sản phẩm" value={product.form} />
              <SpecItem icon={Sparkles} label="Công dụng chính" value={product.mainUse} />
              <SpecItem icon={Archive} label="Bảo quản" value="Nơi khô ráo, thoáng mát" />
            </div>

            <div className="flex flex-col gap-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-customer-accent">{formatCurrency(totalPrice)}</span>
                <span className="text-sm text-customer-secondary">/ {product.unit}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-white border border-customer-primary/15 rounded-xl p-1">
                  <button
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                    className="size-10 rounded-lg flex items-center justify-center hover:bg-customer-light transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-bold text-lg w-6 text-center">{qty}</span>
                  <button
                    onClick={() => setQty((prev) => prev + 1)}
                    className="size-10 rounded-lg flex items-center justify-center hover:bg-customer-light transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <CustomerButton variant="accent" size="lg" onClick={handleBuyNow} className="flex-1">
                  Mua ngay
                </CustomerButton>
                <CustomerButton variant="primary" size="lg" icon={ShoppingCart} onClick={handleAddToCart} className="flex-1">
                  Thêm vào giỏ
                </CustomerButton>
              </div>

              <CustomerButton
                variant="outline"
                size="lg"
                icon={MessageCircleQuestion}
                to="/gioi-thieu"
                className="w-full"
              >
                Tư vấn sản phẩm này
              </CustomerButton>
            </div>
          </Reveal>
        </div>

        {/* Tabs */}
        <Reveal className="mt-14">
          <div className="flex flex-wrap gap-2 border-b border-customer-primary/10 mb-6">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 text-sm font-bold rounded-t-lg transition-colors border-b-2 -mb-px ${
                  activeTab === tab.key
                    ? "border-customer-primary text-customer-primary"
                    : "border-transparent text-customer-secondary hover:text-customer-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-customer-primary/10 p-6 lg:p-8 text-sm leading-relaxed text-customer-secondary">
            {activeTab === "overview" && (
              <div className="space-y-3">
                <p>{product.overview}</p>
                <p>{product.overviewExtra}</p>
              </div>
            )}
            {activeTab === "ingredients" && (
              <p>
                <span className="font-bold text-customer-ink">Thành phần chính: </span>
                {product.mainIngredients}
              </p>
            )}
            {activeTab === "usage" && (
              <ul className="space-y-2 list-disc pl-5">
                {product.benefits.map((benefit) => (
                  <li key={benefit.title}>
                    <span className="font-bold text-customer-ink">{benefit.title}: </span>
                    {benefit.description}
                  </li>
                ))}
              </ul>
            )}
            {activeTab === "crops" && (
              <div className="flex flex-wrap gap-2">
                {product.cropTypes.map((crop) => (
                  <span
                    key={crop}
                    className="px-3 py-1.5 rounded-lg bg-customer-light text-customer-primaryDark text-xs font-bold"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            )}
            {activeTab === "howToUse" && <p>{product.howToUse}</p>}
            {activeTab === "storage" && <p>{product.storage}</p>}
          </div>
        </Reveal>

        {/* Lợi ích của sản phẩm */}
        <section className="mt-14 -mx-4 lg:-mx-10 px-4 lg:px-10 py-12 bg-customer-light">
          <Reveal>
            <span className="block text-xs font-bold uppercase tracking-widest text-customer-earth">Nổi bật</span>
            <h2 className="mt-2 text-2xl font-extrabold text-customer-ink">Lợi ích của sản phẩm</h2>
          </Reveal>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {product.benefits.map((item, index) => (
              <Reveal key={item.title} delay={index * 70}>
                <InfoCard item={item} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Gợi ý theo dấu hiệu */}
        <section className="-mx-4 lg:-mx-10 px-4 lg:px-10 py-12 bg-customer-cream">
          <Reveal>
            <span className="block text-xs font-bold uppercase tracking-widest text-customer-earth">Gợi ý</span>
            <h2 className="mt-2 text-2xl font-extrabold text-customer-ink">
              Sản phẩm phù hợp khi cây có dấu hiệu
            </h2>
          </Reveal>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {product.symptoms.map((item, index) => (
              <Reveal key={item.title} delay={index * 60}>
                <InfoCard item={item} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Thông tin sản phẩm */}
        <Reveal className="mt-14">
          <span className="block text-xs font-bold uppercase tracking-widest text-customer-earth">Chi tiết</span>
          <h2 className="mt-2 text-2xl font-extrabold text-customer-ink mb-6">Thông tin sản phẩm</h2>

          <div className="rounded-2xl border border-customer-primary/10 overflow-hidden bg-white">
            {[
              ["Thương hiệu", product.brand],
              ["Tên sản phẩm", product.name],
              ["Nhóm sản phẩm", product.category],
              ["Quy cách", product.unit],
              ["Dạng sản phẩm", product.form],
              ["Xuất xứ", product.origin],
              ["Đơn vị phân phối", product.distributor],
            ].map(([label, value], index) => (
              <div
                key={label}
                className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 px-5 py-3.5 text-sm ${
                  index % 2 === 1 ? "bg-customer-cream/60" : ""
                }`}
              >
                <span className="sm:w-48 shrink-0 font-bold text-customer-ink">{label}</span>
                <span className="text-customer-secondary">{value}</span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Sản phẩm liên quan */}
        {related.length > 0 && (
          <Reveal className="mt-14">
            <h2 className="text-2xl font-extrabold text-customer-ink mb-6">Sản phẩm cùng nhóm</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/products/${item.id}`}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-customer-primary/10 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-square bg-customer-light">
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-customer-ink line-clamp-1">{item.name}</h3>
                    <span className="text-sm font-extrabold text-customer-accent mt-1 block">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  return <ProductDetailPageContent key={id} id={id} />;
}
