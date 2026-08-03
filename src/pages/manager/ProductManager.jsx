import React, { useState, useEffect, useMemo } from "react";
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Image as ImageIcon,
  Eye
} from "lucide-react";

import {
  StatCard,
  SearchInput,
  Table,
  PaginationControls,
  SelectOption // ✅ giống admin
} from "@/components/ui";

import { ProductDetailModal } from "@/components/modal"; // ✅ modal detail
import { useProductStore } from "@/stores";

// options giống admin
const COLOR_OPTIONS = ['WHITE', 'BLACK', 'BLUE', 'RED', 'PINK', 'GRAY', 'NUDE'];
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const ProductManager = () => {

  const {
    products,
    isLoading,
    totalPages,
    statsCounts,
    fetchProductsList,
    categories,
    fetchCategoriesList
  } = useProductStore();

  // ================= STATE =================
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  const [categoryName, setCategoryName] = useState("All");
  const [status, setStatus] = useState("All");
  const [color, setColor] = useState("All");
  const [size, setSize] = useState("All");
  const [fromPrice, setFromPrice] = useState("");
  const [toPrice, setToPrice] = useState("");

  const [page, setPage] = useState(1);

  // 👁️ VIEW DETAIL
  const [viewingProduct, setViewingProduct] = useState(null);

  // ================= INIT =================
  useEffect(() => {
    fetchCategoriesList();
  }, []);

  // ================= DEBOUNCE =================
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [keyword]);

  // ================= FETCH =================
  useEffect(() => {
    fetchProductsList({
      keyword: debouncedKeyword,
      categoryName,
      status,
      color,
      size,
      fromPrice,
      toPrice,
      page,
      sizePage: 10,
      sortBy: "createdAt",
      sortDir: "desc"
    });
  }, [debouncedKeyword, page, categoryName, status, color, size, fromPrice, toPrice]);

  // ================= UTILS =================
  const getPriceRange = (variants) => {
    if (!variants?.length) return "N/A";
    const prices = variants.map(v => v.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    const format = (val) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND"
        }).format(val);

    return min === max ? format(min) : `${format(min)} - ${format(max)}`;
  };

  const getStock = (variants) =>
      variants?.reduce((sum, v) => sum + (v.quantity || 0), 0) || 0;

  // ================= FIX IMAGE (QUAN TRỌNG) =================
  const getImage = (variant) => {
    if (!variant) return null;

    // admin style
    if (variant.images?.image01) return variant.images.image01;

    // fallback JSON string
    if (variant.imageUrl) {
      try {
        const parsed = JSON.parse(variant.imageUrl);
        return parsed?.[0];
      } catch {
        return variant.imageUrl;
      }
    }

    return null;
  };

  // ================= STATS =================
  const stats = useMemo(() => ({
    total: statsCounts.totalElements,
    active: statsCounts.active,
    outOfStock: products.filter(p => getStock(p.variants) === 0).length,
    lowStock: products.filter(p => getStock(p.variants) < 15).length
  }), [products, statsCounts]);

  // ================= TABLE =================
  const columns = [
    { id: "info", label: "Thông tin phân bón" },
    { id: "category", label: "Danh mục" },
    { id: "price", label: "Khoảng giá" },
    { id: "stock", label: "Tồn kho" },
    { id: "status", label: "Trạng thái" },
    { id: "actions", label: "" } // 👈 thêm
  ];

  return (
      <div className="space-y-6 pb-10 p-4 sm:p-6 bg-gray-50 min-h-screen">

        {/* HEADER */}
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Quản lý phân bón
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Xem và tìm kiếm phân bón trong hệ thống
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          <StatCard icon={Package} label="Tổng phân bón" value={stats.total} color="text-blue-600" bg="bg-blue-50" />
          <StatCard icon={CheckCircle2} label="Đang bán" value={stats.active} color="text-green-600" bg="bg-green-50" />
          <StatCard icon={AlertTriangle} label="Sắp hết" value={stats.lowStock} color="text-orange-600" bg="bg-orange-50" />
          <StatCard icon={TrendingUp} label="Hết hàng" value={stats.outOfStock} color="text-red-600" bg="bg-red-50" />
        </div>

        {/* FILTER (GIỐNG ADMIN) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

            <SelectOption
                value={categoryName}
                onChange={(val) => setCategoryName(val)}
                placeholder="Tất cả danh mục"
                options={categories.map(c => ({ value: c.name, label: c.name }))}
            />

            <SelectOption
                value={status}
                onChange={(val) => setStatus(val)}
                placeholder="Tất cả trạng thái"
                options={[
                  { value: "ACTIVE", label: "Đang bán" },
                  { value: "INACTIVE", label: "Ngừng bán" }
                ]}
            />

            <SelectOption
                value={color}
                onChange={(val) => setColor(val)}
                placeholder="Tất cả quy cách"
                options={COLOR_OPTIONS.map(c => ({ value: c, label: c }))}
            />

            <SelectOption
                value={size}
                onChange={(val) => setSize(val)}
                placeholder="Tất cả kích cỡ"
                options={SIZE_OPTIONS.map(s => ({ value: s, label: s }))}
            />

          </div>

          <div className="flex gap-3 flex-wrap">
            <SearchInput value={keyword} onChange={setKeyword} placeholder="Tìm phân bón..." />
            <input type="number" placeholder="Giá từ" value={fromPrice} onChange={(e) => setFromPrice(e.target.value)} className="px-4 py-2 bg-gray-50 border rounded-xl text-sm w-40" />
            <input type="number" placeholder="Giá đến" value={toPrice} onChange={(e) => setToPrice(e.target.value)} className="px-4 py-2 bg-gray-50 border rounded-xl text-sm w-40" />
          </div>

        </div>

        {/* TABLE */}
        <div className="relative">

          <Table
              columns={columns}
              visibleColumns={columns.map(c => c.id)}
          >

            {products.map((prod) => {
              const variants = prod?.variants || [];
              const stock = getStock(variants);
              const firstImage = getImage(variants[0]);

              return (
                  <tr key={prod.id} className="hover:bg-gray-50">

                    <td className="px-6 py-5">
                      <div className="flex gap-3">
                        <div className="size-12 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                          {firstImage ? (
                              <img src={firstImage} className="w-full h-full object-cover" />
                          ) : (
                              <ImageIcon size={16} />
                          )}
                        </div>

                        <div>
                          <div className="font-bold">{prod.name}</div>
                          <div className="text-xs text-gray-400">{prod.brand}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">{prod.category?.name}</td>

                    <td className="px-6 py-5 font-black text-[#d9a13b]">
                      {getPriceRange(variants)}
                    </td>

                    <td className="px-6 py-5">
                      <span className={stock < 15 ? "text-red-500 font-bold" : ""}>
                        {stock}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          prod.status === "ACTIVE"
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-600"
                      }`}>
                        {prod.status === "ACTIVE" ? "Đang bán" : "Ngừng bán"}
                      </span>
                    </td>

                    {/* 👁️ VIEW */}
                    <td className="px-6 py-5 text-right">
                      <button
                          onClick={() => setViewingProduct(prod)}
                          className="p-2 text-gray-400 hover:text-black"
                      >
                        <Eye size={16} />
                      </button>
                    </td>

                  </tr>
              );
            })}

          </Table>

          <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              setPage={setPage}
          />

        </div>

        {/* MODAL */}
        <ProductDetailModal
            selectedProduct={viewingProduct}
            onClose={() => setViewingProduct(null)}
        />

      </div>
  );
};

export default ProductManager;
