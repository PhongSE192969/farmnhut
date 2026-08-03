import React, { useState, useEffect } from "react";
import {
  Briefcase,
  PackageIcon,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { useProductStore } from "@/stores/useProductStore";
import { uploadToCloudinary } from "@/services/cloudinaryService";
import toast from "react-hot-toast";
import { useLanguageStore } from "@/stores";
import translations from "@/locales";

const PACKAGE_UNIT_OPTIONS = ["KG", "G", "L", "ML", "BAG"];

const getFirstImageUrl = (variant) => {
  return (
    variant?.images?.image01 ||
    variant?.images?.image1 ||
    variant?.imageUrl ||
    ""
  );
};

const AddEditProduct = ({ selectedProduct, categories = [], setIsModalOpen }) => {
  const { language } = useLanguageStore();
  const t =
    (translations[language] || translations.vi).modals?.addEditProduct || {};

  const { createProduct, updateProduct } = useProductStore();

  const initialCategoryId =
    selectedProduct?.category?.id || categories?.[0]?.id || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId);

  const [formData, setFormData] = useState({
    name: selectedProduct?.name || "",
    brand: selectedProduct?.brand || "",
    categoryId: initialCategoryId,
    description:
      selectedProduct?.description || selectedProduct?.descriptionEn || "",
  });

  const [variants, setVariants] = useState(() => {
    if (selectedProduct?.variants && selectedProduct.variants.length > 0) {
      return selectedProduct.variants.map((v, index) => ({
        id: v.id || null,
        sku: v.sku || `SKU_${Date.now()}_${index}`,
        variantName: v.variantName || "",
        packageSize: v.packageSize || "",
        packageUnit: v.packageUnit || "KG",
        importPrice: v.importPrice ?? "",
        sellingPrice: v.sellingPrice ?? v.price ?? "",
        salePrice: v.salePrice ?? v.sellingPrice ?? v.price ?? "",
        imageUrl: getFirstImageUrl(v),
      }));
    }

    return [
      {
        sku: `SKU_${Date.now()}_0`,
        variantName: "",
        packageSize: "",
        packageUnit: "KG",
        importPrice: "",
        sellingPrice: "",
        salePrice: "",
        imageUrl: "",
      },
    ];
  });

  useEffect(() => {
    if (categories.length > 0) {
      const firstId = selectedProduct?.category?.id || categories[0].id;

      setSelectedCategory(firstId);

      setFormData((prev) => ({
        ...prev,
        categoryId: firstId,
      }));
    }
  }, [categories, selectedProduct]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleUpload = async (index, file) => {
    if (!file) return;

    try {
      const urls = await uploadToCloudinary([file]);
      const newVariants = [...variants];

      newVariants[index].imageUrl = urls[0];
      setVariants(newVariants);

      toast.success("Upload thành công");
    } catch (err) {
      console.error(err);
      toast.error("Upload thất bại");
    }
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        sku: `SKU_${Date.now()}_${variants.length}`,
        variantName: "",
        packageSize: "",
        packageUnit: "KG",
        importPrice: "",
        sellingPrice: "",
        salePrice: "",
        imageUrl: "",
      },
    ]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const validatePayload = () => {
    if (!formData.categoryId) {
      toast.error("Vui lòng chọn danh mục");
      return false;
    }

    if (!formData.name?.trim()) {
      toast.error("Thiếu tên phân bón");
      return false;
    }

    if (!variants || variants.length === 0) {
      toast.error("Phải có ít nhất 1 quy cách");
      return false;
    }

    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];

      if (!v.sku?.trim()) {
        toast.error(`Quy cách ${i + 1}: thiếu SKU`);
        return false;
      }

      if (!v.variantName?.trim()) {
        toast.error(`Quy cách ${i + 1}: thiếu tên quy cách`);
        return false;
      }

      if (!v.packageSize || Number(v.packageSize) <= 0) {
        toast.error(`Quy cách ${i + 1}: khối lượng/dung tích phải > 0`);
        return false;
      }

      if (!v.packageUnit?.trim()) {
        toast.error(`Quy cách ${i + 1}: thiếu đơn vị đóng gói`);
        return false;
      }

      if (v.sellingPrice === "" || Number(v.sellingPrice) < 0) {
        toast.error(`Quy cách ${i + 1}: giá bán không hợp lệ`);
        return false;
      }
    }

    return true;
  };

  const buildPayload = () => {
    return {
      name: formData.name.trim(),
      brand: formData.brand?.trim() || "No Brand",

      // Required by backend Product entity / DB
      productType: "FERTILIZER",
      unit: "BAG",

      categoryId: formData.categoryId,
      description: formData.description?.trim() || "No description",

      variants: variants.map((v, index) => {
        const sellingPrice = Number(v.sellingPrice || 0);
        const salePrice =
          v.salePrice !== "" && v.salePrice != null
            ? Number(v.salePrice)
            : sellingPrice;

        return {
          ...(v.id ? { id: v.id } : {}),
          sku: v.sku?.trim() || `SKU_${Date.now()}_${index}`,
          variantName:
            v.variantName?.trim() ||
            `${v.packageSize || ""} ${v.packageUnit || ""}`.trim(),
          packageSize: Number(v.packageSize),
          packageUnit: String(v.packageUnit || "BAG").toUpperCase(),
          importPrice:
            v.importPrice !== "" && v.importPrice != null
              ? Number(v.importPrice)
              : 0,
          sellingPrice,
          salePrice,
          imageUrls: v.imageUrl ? [v.imageUrl] : [],
        };
      }),
    };
  };

  const handleSubmit = async () => {
    try {
      if (!validatePayload()) return;

      const payload = buildPayload();

      console.log("CREATE/UPDATE PRODUCT PAYLOAD:", payload);

      if (selectedProduct) {
        await updateProduct(selectedProduct.id, payload);
        toast.success("Update thành công");
      } else {
        await createProduct(payload);
        toast.success("Tạo phân bón thành công");
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Submit lỗi");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-2xl flex flex-col max-h-[90vh] shadow-2xl">
        <div className="p-5 border-b flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#d9a13b]/10 text-[#d9a13b] flex items-center justify-center">
              <PackageIcon size={20} />
            </div>

            <div>
              <h3 className="font-black text-slate-900 text-lg">
                {(selectedProduct ? t.title?.update : t.title?.add) ||
                  (selectedProduct ? "Cập nhật phân bón" : "Thêm phân bón mới")}
              </h3>

              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                {t.subtitle || "Danh mục phân bón"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {t.form?.name || "Tên phân bón"}{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder={t.form?.namePlaceholder || "e.g. NPK 20-20-15"}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#d9a13b] focus:ring-1 focus:ring-[#d9a13b] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {t.form?.brand || "Nhà sản xuất"}{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  required
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleChange("brand", e.target.value)}
                  placeholder={t.form?.brandPlaceholder || "e.g. Bình Điền"}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#d9a13b] focus:ring-1 focus:ring-[#d9a13b] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {t.form?.category || "Danh mục"}
                </label>

                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    handleChange("categoryId", e.target.value);
                  }}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl"
                >
                  <option value="" disabled>
                    Chọn danh mục
                  </option>

                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="flex text-[10px] font-black text-gray-400 uppercase tracking-widest items-center gap-1.5">
                <Briefcase size={12} /> {t.form?.description || "Mô tả"}
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder={
                  t.form?.descriptionPlaceholder ||
                  "Mô tả công dụng, cây trồng phù hợp, hướng dẫn sử dụng..."
                }
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#d9a13b] focus:ring-1 focus:ring-[#d9a13b] transition-all h-24 resize-none"
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-black text-slate-800">Quy cách đóng gói</h3>
                <p className="text-xs text-gray-400">
                  Thêm khối lượng, đơn vị, giá và hình ảnh cho từng quy cách.
                </p>
              </div>

              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-1.5 bg-[#d9a13b]/10 text-[#d9a13b] hover:bg-[#d9a13b]/20 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
              >
                <Plus size={16} /> Thêm quy cách
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start justify-center">
              {variants.map((v, index) => (
                <div
                  key={index}
                  className="relative grid grid-cols-1 md:grid-cols-5 bg-gray-50 border border-gray-200 p-4 rounded-xl gap-4 group"
                >
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="absolute -top-3 -right-3 bg-red-50 text-red-500 p-2 rounded-full border border-red-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                      title="Xóa quy cách"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}

                  <div className="col-span-2 flex flex-col items-start gap-4 pt-2">
                    {v.imageUrl && (
                      <div className="size-38 rounded-lg border border-gray-200 overflow-hidden shrink-0 bg-white">
                        <img
                          src={v.imageUrl}
                          className="w-full h-full object-cover"
                          alt="Variant"
                        />
                      </div>
                    )}

                    <div className="flex-1 w-full">
                      <label className="flex items-center justify-center w-full px-4 py-3 bg-white border border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#d9a13b] hover:bg-[#d9a13b]/5 transition-all text-sm text-gray-500 font-medium gap-2">
                        <UploadCloud size={18} />
                        {v.imageUrl ? "Đổi ảnh" : "Tải ảnh"}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) =>
                            handleUpload(index, e.target.files?.[0])
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <div className="col-span-3 grid grid-cols-1 gap-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        SKU
                      </label>

                      <input
                        type="text"
                        value={v.sku}
                        onChange={(e) =>
                          handleVariantChange(index, "sku", e.target.value)
                        }
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#d9a13b] focus:ring-1 focus:ring-[#d9a13b] transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Tên quy cách
                      </label>

                      <input
                        type="text"
                        placeholder="Bao 25kg, Chai 1L..."
                        value={v.variantName}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "variantName",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#d9a13b] focus:ring-1 focus:ring-[#d9a13b] transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Khối lượng/Dung tích
                        </label>

                        <input
                          type="number"
                          placeholder="25"
                          value={v.packageSize}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "packageSize",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#d9a13b] focus:ring-1 focus:ring-[#d9a13b] transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Đơn vị
                        </label>

                        <select
                          value={v.packageUnit}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "packageUnit",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#d9a13b] focus:ring-1 focus:ring-[#d9a13b] transition-all"
                        >
                          {PACKAGE_UNIT_OPTIONS.map((unit) => (
                            <option key={unit} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Giá nhập
                        </label>

                        <input
                          type="number"
                          placeholder="0"
                          value={v.importPrice}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "importPrice",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#d9a13b] focus:ring-1 focus:ring-[#d9a13b] transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Giá bán
                        </label>

                        <input
                          type="number"
                          placeholder="0"
                          value={v.sellingPrice}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "sellingPrice",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#d9a13b] focus:ring-1 focus:ring-[#d9a13b] transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Giá ưu đãi
                        </label>

                        <input
                          type="number"
                          placeholder="0"
                          value={v.salePrice}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "salePrice",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#d9a13b] focus:ring-1 focus:ring-[#d9a13b] transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 border-t flex justify-end gap-3 shrink-0 bg-gray-50/50 rounded-b-2xl">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
          >
            {t.actions?.cancel || "Cancel"}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 text-sm font-bold text-white bg-[#d9a13b] hover:bg-[#c28e34] rounded-xl shadow-sm shadow-[#d9a13b]/20 transition-all active:scale-[0.98]"
          >
            {selectedProduct
              ? t.actions?.save || "Cập nhật phân bón"
              : t.actions?.create || "Tạo phân bón"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditProduct;
