import React from 'react';
import { X, Package, Layers, Shield, Tag, AlignLeft, Hash, DollarSign } from 'lucide-react';

const ProductDetailModal = ({ selectedProduct, onClose }) => {
  if (!selectedProduct) return null;

  // Lấy hình ảnh đầu tiên của variant đầu tiên làm hình ảnh main
  const mainImage = selectedProduct?.variants?.[0]?.images?.image01;

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-[10px] font-bold">ĐANG BÁN</span>;
      case 'INACTIVE':
      case 'SUSPENDED':
        return <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-[10px] font-bold">TẠM DỪNG</span>;
      case 'DELETED':
        return <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold">ĐÃ XÓA</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px] font-bold">{status}</span>;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  const getVariantLabel = (variant) => {
    const packageLabel =
      variant?.packageSize && variant?.packageUnit
        ? `${variant.packageSize} ${variant.packageUnit}`
        : variant?.packageUnit || "";

    return variant?.variantName || packageLabel || variant?.size || "Quy cách";
  };

  const getVariantPrice = (variant) =>
    variant?.salePrice ?? variant?.sellingPrice ?? variant?.price ?? 0;

  return (
    <div className="w-full h-full fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">

        {/* Header Section */}
        <div className="relative h-44 bg-gradient-to-r from-emerald-950 to-emerald-700 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 size-8 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>

          <div className="absolute top-8 left-8 flex items-end gap-5">
            <div className="size-28 rounded-3xl bg-white p-1 shadow-xl shrink-0">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt="Phân bón"
                  className="size-full rounded-2xl object-cover bg-gray-100"
                />
              ) : (
                <div className="size-full rounded-2xl bg-lime-200 flex items-center justify-center text-emerald-900">
                  <Package size={40} />
                </div>
              )}
            </div>
            <div className="mb-2">
              <div className="flex items-center gap-3">
                <h3 className="text-md font-bold text-white leading-tight line-clamp-1 max-w-[350px] md:max-w-[450px]" title={selectedProduct.name}>
                  {selectedProduct.name}
                </h3>
                {renderStatusBadge(selectedProduct.status)}
              </div>
              <div className="mt-2 flex items-center gap-3 text-sm text-slate-300 font-semibold">
                <div className="flex items-center gap-1"><Layers size={14} className="text-lime-200" /> {selectedProduct.category?.name || 'N/A'}</div>
                <div className="flex items-center gap-1"><Shield size={14} className="text-lime-200" /> {selectedProduct.brand || 'N/A'}</div>
              </div>
              <div className="flex mt-1.5 items-center gap-1 text-xs text-slate-400 font-mono">
                <Hash size={10} /> ID: {selectedProduct.id}
              </div>
            </div>
          </div>
        </div>

        {/* Body Section */}
        <div className="pt-14 p-8 overflow-y-auto custom-scrollbar flex-1">
          <div className="space-y-6">
            {/* General Info */}
            <div>
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <AlignLeft size={14} /> Mô tả phân bón
              </h4>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-slate-600 leading-relaxed font-medium">
                {selectedProduct.description || "Chưa có mô tả cho phân bón này."}
              </div>
            </div>

            {/* Variants Detail */}
            <div>
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Tag size={14} /> Quy cách đóng gói ({selectedProduct.variants?.length || 0})
              </h4>

              <div className="space-y-3">
                {selectedProduct.variants?.length > 0 ? (
                  selectedProduct.variants.map((variant) => (
                    <div key={variant.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-white border border-gray-200 overflow-hidden shrink-0">
                          {variant.images?.image01 ? (
                            <img src={variant.images.image01} alt="variant" className="w-full h-full object-cover" />
                          ) : (
                            <Package size={20} className="m-auto mt-3 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-800">{getVariantLabel(variant)}</span>
                            <span className="text-xs font-bold text-slate-500 border-l border-gray-300 pl-2">{variant.packageUnit || variant.sku || "N/A"}</span>
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono mt-0.5">SKU: {variant.sku || variant.id.substring(0, 8)}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-right">
                        <div className="min-w-[100px]">
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Giá</div>
                          <div className="text-sm font-black text-emerald-700">{formatPrice(getVariantPrice(variant))}</div>
                        </div>
                        <div>
                          {renderStatusBadge(variant.status)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-400 text-center italic font-medium">
                    Chưa có quy cách đang hoạt động cho phân bón này.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailModal;
