import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Leaf } from "lucide-react";
import {
  getCustomerProducts,
  getCustomerProductCategories,
  getCustomerProductCropTypes,
  getCustomerProductUsageNeeds,
} from "@/services/customerProductService";
import { useSearchStore } from "@/stores";
import { useCartStore } from "@/stores/cartStore";
import { formatCurrency } from "@/utils/helpers";
import PageHero from "@/components/customer/ui/PageHero";
import toast from "react-hot-toast";

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
];

const BADGE_STYLES = {
  "Bán chạy": "bg-customer-earth text-white",
  Mới: "bg-customer-primary text-white",
};

function FilterGroup({ title, options, active, onChange }) {
  return (
    <div className="rounded-2xl bg-white border border-customer-primary/10 p-5">
      <h3 className="text-xs font-bold uppercase tracking-widest text-customer-secondary mb-3">
        {title}
      </h3>
      <div className="flex flex-col gap-1">
        <button
          onClick={() => onChange(null)}
          className={`text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
            active === null
              ? "bg-customer-primary text-white"
              : "text-customer-secondary hover:bg-customer-light"
          }`}
        >
          Tất cả
        </button>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
              active === option
                ? "bg-customer-primary text-white"
                : "text-customer-secondary hover:bg-customer-light"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const { addItem } = useCartStore();
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setAdding(true);
    const success = await addItem(
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

    if (success) {
      toast.success(`${product.name} (${product.unit}) đã được thêm vào giỏ vật tư!`);
    }
    setTimeout(() => setAdding(false), 500);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-customer-primary/10 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-customer-light">
        <img
          src={product.image}
          alt={product.imageAlt}
          loading="lazy"
          className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />

        {product.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badges.map((badge) => (
              <span
                key={badge}
                className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg shadow-sm ${BADGE_STYLES[badge] || "bg-customer-primary text-white"}`}
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-bold text-customer-primaryDark shadow-sm">
          <Leaf size={11} className="text-customer-primary" />
          {product.brand}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-[11px] font-semibold text-customer-secondary uppercase tracking-wide">
          {product.unit}
        </span>
        <h3 className="mt-1 font-bold text-sm text-customer-ink leading-snug line-clamp-1">
          {product.name}
        </h3>
        <p className="mt-1.5 text-xs text-customer-secondary leading-relaxed line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-base font-extrabold text-customer-accent">
            {formatCurrency(product.price)}
          </span>
          <button
            onClick={handleAdd}
            disabled={adding}
            aria-label={`Thêm ${product.name} vào giỏ`}
            className={`shrink-0 flex items-center justify-center size-9 rounded-full transition-all ${
              adding
                ? "bg-customer-primary/60 text-white scale-90"
                : "bg-customer-primary text-white hover:bg-customer-primaryDark hover:-translate-y-0.5"
            }`}
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </Link>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cropTypes, setCropTypes] = useState([]);
  const [usageNeeds, setUsageNeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  const { searchQuery, setSearchQuery } = useSearchStore();
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeCropType, setActiveCropType] = useState(null);
  const [activeUsageNeed, setActiveUsageNeed] = useState(null);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    Promise.all([
      getCustomerProducts(),
      getCustomerProductCategories(),
      getCustomerProductCropTypes(),
      getCustomerProductUsageNeeds(),
    ])
      .then(([productList, categoryList, cropTypeList, usageNeedList]) => {
        setProducts(productList);
        setCategories(categoryList);
        setCropTypes(cropTypeList);
        setUsageNeeds(usageNeedList);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesKeyword =
        !keyword ||
        product.name.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword);
      const matchesCategory = !activeCategory || product.category === activeCategory;
      const matchesCropType = !activeCropType || product.cropTypes.includes(activeCropType);
      const matchesUsageNeed = !activeUsageNeed || product.usageNeeds.includes(activeUsageNeed);

      return matchesKeyword && matchesCategory && matchesCropType && matchesUsageNeed;
    });

    const sorted = [...filtered];
    if (sortBy === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") sorted.sort((a, b) => b.price - a.price);

    return sorted;
  }, [products, searchQuery, activeCategory, activeCropType, activeUsageNeed, sortBy]);

  return (
    <div className="font-customer min-h-screen bg-customer-cream">
      <PageHero
        image="/assets/customer/crops/rau-mau.jpg"
        imageAlt="Luống rau màu xanh non — hình ảnh minh họa"
        eyebrow="Catalog"
        title="Sản phẩm phân bón"
        description="Vật tư nông nghiệp thương hiệu MeriFarm — lọc theo danh mục, loại cây trồng và nhu cầu sử dụng để tìm đúng sản phẩm cho vườn của bạn."
        minHeightClassName="min-h-[260px] lg:min-h-[300px]"
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-customer-secondary" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm sản phẩm..."
              className="w-full h-11 pl-10 pr-4 rounded-full border border-customer-primary/15 bg-white focus:border-customer-primary focus:ring-2 focus:ring-customer-primary/10 outline-none transition-all text-sm"
            />
          </div>

          <div className="flex items-center justify-between md:justify-end gap-4">
            <span className="text-sm text-customer-secondary font-medium whitespace-nowrap">
              {filteredProducts.length} sản phẩm
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-11 pl-4 pr-8 rounded-full border border-customer-primary/15 bg-white text-sm font-semibold text-customer-ink outline-none focus:border-customer-primary cursor-pointer"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          <div className="lg:col-span-1 space-y-5">
            <FilterGroup title="Danh mục" options={categories} active={activeCategory} onChange={setActiveCategory} />
            <FilterGroup title="Loại cây trồng" options={cropTypes} active={activeCropType} onChange={setActiveCropType} />
            <FilterGroup title="Nhu cầu sử dụng" options={usageNeeds} active={activeUsageNeed} onChange={setActiveUsageNeed} />
          </div>

          <div className="lg:col-span-4">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-customer-light animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-customer-primary/20">
                <Search size={34} className="mb-4 text-customer-primary" />
                <p className="text-customer-secondary font-medium text-sm">
                  Không tìm thấy sản phẩm nào khớp với bộ lọc
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
