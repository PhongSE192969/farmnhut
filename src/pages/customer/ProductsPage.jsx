import { useState, useEffect, useCallback, useMemo } from "react";
import { useLanguageStore, useSearchStore } from "@/stores";
import { Search } from "lucide-react";
import { translations } from "@/locales";
import {
  getPaginatedProducts,
  GetAllCategories,
} from "@/services/productService";
import { getStocks } from "@/services/inventoryService";
import { FilterItem, FilterSection, PaginationControls } from "@/components/ui";
import ProductCard from "@/components/customer/ProductCard";

const PACKAGE_UNIT_OPTIONS = ["KG", "G", "L", "ML", "BAG"];
const MAIN_WAREHOUSE_ID = "00000000-0000-0000-0000-000000000000";
const PAGE_SIZE = 12;

const extractData = (res) => {
  return res?.data?.data || res?.data || res;
};

const extractPage = (res) => {
  const data = extractData(res);

  return {
    content: Array.isArray(data?.content)
      ? data.content
      : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data)
          ? data
          : [],
    totalPages: data?.totalPages ?? 1,
    totalElements: data?.totalElements ?? 0,
  };
};

const extractStockContent = (res) => {
  const data = extractData(res);

  return Array.isArray(data?.content)
    ? data.content
    : Array.isArray(res?.data?.data?.content)
      ? res.data.data.content
      : Array.isArray(res?.data?.content)
        ? res.data.content
        : Array.isArray(res?.content)
          ? res.content
          : Array.isArray(data)
            ? data
            : [];
};

const getVariantPrice = (variant) => {
  return Number(
    variant?.salePrice ??
      variant?.sellingPrice ??
      variant?.price ??
      0
  );
};

const productMatchesPackageUnit = (product, selectedPackageUnits) => {
  if (!selectedPackageUnits.length) return true;

  const variants = Array.isArray(product?.variants) ? product.variants : [];

  return variants.some((variant) =>
    selectedPackageUnits.includes(variant.packageUnit)
  );
};

const productMatchesPriceRange = (product, priceRange) => {
  const min = priceRange.min !== "" ? Number(priceRange.min) : null;
  const max = priceRange.max !== "" ? Number(priceRange.max) : null;

  if (min == null && max == null) return true;

  const variants = Array.isArray(product?.variants) ? product.variants : [];

  return variants.some((variant) => {
    const price = getVariantPrice(variant);

    if (min != null && price < min) return false;
    if (max != null && price > max) return false;

    return true;
  });
};

const calculateAvailableStock = (stocks) => {
  return stocks.reduce((sum, stock) => {
    return (
      sum +
      Number(stock.quantity || 0) -
      Number(stock.reservedQuantity || 0)
    );
  }, 0);
};

export default function ProductsPage() {
  const { searchQuery, setSearchQuery } = useSearchStore();
  const { language } = useLanguageStore();
  const t =
    (translations[language] || translations.vi).customer?.products || {};

  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPackageUnits, setSelectedPackageUnits] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  const [variantStocks, setVariantStocks] = useState({});

  useEffect(() => {
    const initCategories = async () => {
      try {
        const res = await GetAllCategories();
        const data = extractData(res);

        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Fetch categories failed:", error);
        setCategories([]);
      }
    };

    initCategories();
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      /*
        FE-only workaround:
        Backend /products/search đang lỗi khi filter.
        Customer page sẽ load nhiều page từ /products/get-all rồi filter tại frontend.
      */
      const maxPagesToLoad = 20;
      let mergedProducts = [];
      let pageIndex = 0;
      let totalApiPages = 1;

      do {
        const res = await getPaginatedProducts(pageIndex);
        const pageData = extractPage(res);

        mergedProducts = [...mergedProducts, ...pageData.content];
        totalApiPages = pageData.totalPages || 1;
        pageIndex += 1;
      } while (pageIndex < totalApiPages && pageIndex < maxPagesToLoad);

      const activeProducts = mergedProducts.filter(
        (product) => !product.status || product.status === "ACTIVE"
      );

      setAllProducts(activeProducts);

      if (activeProducts.length > 0) {
        try {
          const stockRes = await getStocks(null, false, 0, 500);
          const allStocks = extractStockContent(stockRes);

          const stockMap = {};

          activeProducts.forEach((product) => {
            const variants = Array.isArray(product?.variants)
              ? product.variants
              : [];

            variants.forEach((variant) => {
              const stocksByVariant = allStocks.filter(
                (stock) => stock.productVariantId === variant.id
              );

              const franchiseStocks = stocksByVariant.filter(
                (stock) =>
                  stock.locationId !== MAIN_WAREHOUSE_ID &&
                  stock.locationType !== "WAREHOUSE"
              );

              const warehouseStocks = stocksByVariant.filter(
                (stock) =>
                  stock.locationId === MAIN_WAREHOUSE_ID ||
                  stock.locationType === "WAREHOUSE"
              );

              const totalFranchiseStock = calculateAvailableStock(franchiseStocks);
              const totalWarehouseStock = calculateAvailableStock(warehouseStocks);

              /*
                Nếu chưa có tồn kho ở franchise thì fallback dùng warehouse.
                Điều này phù hợp giai đoạn hiện tại vì DB mới của bạn đang có stock WAREHOUSE.
              */
              stockMap[variant.id] = Math.max(
                0,
                totalFranchiseStock > 0 ? totalFranchiseStock : totalWarehouseStock
              );
            });
          });

          setVariantStocks(stockMap);
        } catch (stockError) {
          console.error("Fetch inventory stock failed:", stockError);
          setVariantStocks({});
        }
      } else {
        setVariantStocks({});
      }
    } catch (error) {
      console.error("Fetch products failed:", error);
      setAllProducts([]);
      setVariantStocks({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, selectedPackageUnits, priceRange]);

  const filteredProducts = useMemo(() => {
    const keyword = searchQuery?.trim().toLowerCase();

    return allProducts.filter((product) => {
      const matchesKeyword =
        !keyword ||
        product.name?.toLowerCase().includes(keyword) ||
        product.brand?.toLowerCase().includes(keyword) ||
        product.description?.toLowerCase().includes(keyword);

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category?.name);

      const matchesPackageUnit = productMatchesPackageUnit(
        product,
        selectedPackageUnits
      );

      const matchesPriceRange = productMatchesPriceRange(
        product,
        priceRange
      );

      return (
        matchesKeyword &&
        matchesCategory &&
        matchesPackageUnit &&
        matchesPriceRange
      );
    });
  }, [
    allProducts,
    searchQuery,
    selectedCategories,
    selectedPackageUnits,
    priceRange,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE)
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const toggleFilter = (list, setList, item) => {
    setList((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  return (
    <div className="min-h-screen bg-bg-light">
      <div className="relative bg-gradient-to-br from-emerald-950 via-emerald-800 to-lime-700 text-white px-4 lg:px-20 py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">
            {t.title || "Danh mục phân bón"}
          </h1>
          <p className="max-w-2xl text-sm font-medium leading-6 text-emerald-50/80">
            {t.subtitle ||
              "Lọc nhanh theo nhóm vật tư, quy cách đóng gói và khoảng giá để chọn đúng phân bón cho mùa vụ."}
          </p>
        </div>
      </div>

      <div className="sticky top-[64px] z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm px-4 lg:px-20 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
              placeholder={t.searchPlaceholder || "Tìm phân bón, thương hiệu..."}
            />
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-20 py-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <FilterSection title="Danh mục">
            {categories?.length > 0 ? (
              categories.map((cat) => (
                <FilterItem
                  key={cat.id}
                  label={cat.name}
                  checked={selectedCategories.includes(cat.name)}
                  onChange={() =>
                    toggleFilter(
                      selectedCategories,
                      setSelectedCategories,
                      cat.name
                    )
                  }
                />
              ))
            ) : (
              <p className="text-xs text-gray-400">Chưa có danh mục vật tư</p>
            )}
          </FilterSection>

          <FilterSection title="Quy cách">
            <div className="grid grid-cols-2 gap-2">
              {PACKAGE_UNIT_OPTIONS.map((unit) => (
                <button
                  key={unit}
                  onClick={() =>
                    toggleFilter(
                      selectedPackageUnits,
                      setSelectedPackageUnits,
                      unit
                    )
                  }
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                    selectedPackageUnits.includes(unit)
                      ? "bg-emerald-700 text-white border-emerald-700 shadow-md shadow-emerald-200"
                      : "bg-white text-gray-600 border-gray-100 hover:border-emerald-200"
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Khoảng giá">
            <div className="space-y-3">
              <input
                type="number"
                placeholder="Từ (đ)"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all"
              />

              <input
                type="number"
                placeholder="Đến (đ)"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all"
              />
            </div>
          </FilterSection>
        </div>

        <div className="lg:col-span-4">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-gray-100 animate-pulse rounded-3xl"
                />
              ))}
            </div>
          ) : (
            <>
              {paginatedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                  <Search size={34} className="mb-4 text-emerald-600" />
                  <p className="text-gray-400 font-medium">
                    Không tìm thấy phân bón nào khớp với bộ lọc
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {paginatedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        variantStocks={variantStocks}
                      />
                    ))}
                  </div>

                  <div className="mt-12 flex justify-center">
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={totalPages}
                      setPage={setCurrentPage}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
