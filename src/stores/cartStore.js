import { create } from "zustand";
import { useAuthStore } from "./authStore";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
} from "../services/cartService";
import { SearchProductsByIds } from "../services/productService";
import toast from "react-hot-toast";

const MAIN_WAREHOUSE_ID = "00000000-0000-0000-0000-000000000000";

const getVariantImage = (variant, product) => {
  if (variant?.images && typeof variant.images === "object") {
    const keys = Object.keys(variant.images).sort();
    const firstKey = keys[0];

    if (firstKey && variant.images[firstKey]) {
      return variant.images[firstKey];
    }
  }

  return (
    variant?.imageUrl ||
    product?.imageUrl ||
    product?.image ||
    product?.thumbnailUrl ||
    "/agri-logo.svg"
  );
};

const getVariantPrice = (variant, product) => {
  return Number(
    variant?.salePrice ??
      variant?.sellingPrice ??
      variant?.price ??
      product?.price ??
      0
  );
};

const getVariantLabel = (variant) => {
  const variantName = variant?.variantName || "";

  const packageText =
    variant?.packageSize && variant?.packageUnit
      ? `${variant.packageSize} ${variant.packageUnit}`
      : variant?.packageUnit || "";

  return variantName || packageText || variant?.sku || "Default";
};

const extractData = (res) => {
  return res?.data?.data || res?.data || res;
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

const calculateAvailableStock = (stocks) => {
  return stocks.reduce((sum, stock) => {
    return (
      sum +
      Number(stock.quantity || 0) -
      Number(stock.reservedQuantity || 0)
    );
  }, 0);
};

const buildVariantStockMap = (allStocks = []) => {
  const grouped = {};

  allStocks.forEach((stock) => {
    if (!stock.productVariantId) return;

    if (!grouped[stock.productVariantId]) {
      grouped[stock.productVariantId] = {
        franchiseStocks: [],
        warehouseStocks: [],
      };
    }

    const isWarehouse =
      stock.locationId === MAIN_WAREHOUSE_ID ||
      stock.locationType === "WAREHOUSE";

    if (isWarehouse) {
      grouped[stock.productVariantId].warehouseStocks.push(stock);
    } else {
      grouped[stock.productVariantId].franchiseStocks.push(stock);
    }
  });

  const stockMap = {};

  Object.entries(grouped).forEach(([variantId, group]) => {
    const franchiseQty = calculateAvailableStock(group.franchiseStocks);
    const warehouseQty = calculateAvailableStock(group.warehouseStocks);

    stockMap[variantId] = Math.max(
      0,
      franchiseQty > 0 ? franchiseQty : warehouseQty
    );
  });

  return stockMap;
};

export const useCartStore = create((set, get) => ({
  items: [],
  loading: false,

  addItem: async (product, options = {}, maxStock = 999) => {
    const items = get().items;

    const variantId = options.variantId || options.productVariantId;
    const key = variantId
      ? `${product.id}-${variantId}`
      : `${product.id}-${JSON.stringify(options)}`;

    const existing = items.find((i) => i.key === key);
    const user = useAuthStore.getState().user;

    if (existing) {
      const newQty = existing.qty + 1;

      if (newQty > maxStock) {
        toast.error(`Số lượng được giới hạn tối đa ${maxStock} cái.`);
        return false;
      }

      set({
        items: items.map((i) =>
          i.key === key ? { ...i, qty: newQty, maxStock } : i
        ),
      });

      if (user?.id && variantId) {
        try {
          await updateCartItem(user.id, variantId, newQty);
        } catch (e) {
          console.error("Failed to sync quantity to server", e);
        }
      }
    } else {
      if (maxStock <= 0) {
        toast.error("Phân bón này hiện đang hết hàng.");
        return false;
      }

      const normalizedOptions = {
        ...options,
        variantId,
        productVariantId: variantId,
      };

      set({
        items: [
          ...items,
          {
            ...product,
            qty: 1,
            options: normalizedOptions,
            key,
            price: Number(product.price || 0),
            image: product.imageUrl || product.image || "/agri-logo.svg",
            imageUrl: product.imageUrl || product.image || "/agri-logo.svg",
            maxStock,
          },
        ],
      });

      if (user?.id && variantId) {
        try {
          await addToCart(user.id, product.id, variantId, 1);
        } catch (e) {
          console.error("Failed to add item to server", e);
        }
      }
    }

    return true;
  },

  removeItem: async (key) => {
    const items = get().items;
    const itemToRemove = items.find((i) => i.key === key);
    const user = useAuthStore.getState().user;

    set({ items: items.filter((i) => i.key !== key) });

    const variantId =
      itemToRemove?.options?.variantId ||
      itemToRemove?.options?.productVariantId;

    if (user?.id && variantId) {
      try {
        await removeFromCart(user.id, variantId);
      } catch (e) {
        console.error("Failed to remove item from server", e);
      }
    }
  },

  updateQty: async (key, qty) => {
    const items = get().items;
    const item = items.find((i) => i.key === key);

    if (!item) return;

    const user = useAuthStore.getState().user;
    const max = item.maxStock || 999;
    const finalQty = Math.max(1, Math.min(qty, max));

    set({
      items: items.map((i) =>
        i.key === key ? { ...i, qty: finalQty } : i
      ),
    });

    const variantId = item.options?.variantId || item.options?.productVariantId;

    if (user?.id && variantId) {
      try {
        await updateCartItem(user.id, variantId, finalQty);
      } catch (e) {
        console.error("Failed to update quantity on server", e);
      }
    }
  },

  increaseQty: (key) => {
    const items = get().items;
    const item = items.find((i) => i.key === key);

    if (item) {
      get().updateQty(key, item.qty + 1);
    }
  },

  decreaseQty: (key) => {
    const items = get().items;
    const item = items.find((i) => i.key === key);

    if (item) {
      if (item.qty > 1) {
        get().updateQty(key, item.qty - 1);
      } else {
        get().removeItem(key);
      }
    }
  },

  clearCart: async () => {
    set({ items: [] });
  },

  fetchCart: async (customerId) => {
    if (!customerId) return;

    set({ loading: true });

    try {
      const backendCart = await getCart(customerId);
      const cartItemsList = backendCart.data || backendCart || [];

      if (cartItemsList.length === 0) {
        set({ items: [] });
        return;
      }

      const productIds = [
        ...new Set(cartItemsList.map((item) => item.productId)),
      ];

      const productsData = await SearchProductsByIds(productIds);
      const products = productsData.data || productsData || [];

      let stockMap = {};

      try {
        const { getStocks } = await import("../services/inventoryService");
        const stockRes = await getStocks(null, false, 0, 500);
        const allStocks = extractStockContent(stockRes);

        stockMap = buildVariantStockMap(allStocks);
      } catch (err) {
        console.error("Failed to load initial stocks for cart sync", err);
      }

      const enrichedItems = cartItemsList
        .map((cartItem) => {
          const product = products.find((p) => p.id === cartItem.productId);

          if (!product) return null;

          const variant = product.variants?.find(
            (v) => v.id === cartItem.variantId
          );

          if (!variant) return null;

          const variantId = cartItem.variantId;
          const variantLabel = getVariantLabel(variant);
          const variantImage = getVariantImage(variant, product);
          const price = getVariantPrice(variant, product);

          const options = {
            variantId,
            productVariantId: variantId,
            variantName: variant.variantName,
            packageSize: variant.packageSize,
            packageUnit: variant.packageUnit,
            sku: variant.sku,
          };

          const key = `${product.id}-${variantId}`;

          const maxStock =
            stockMap[variantId] !== undefined
              ? stockMap[variantId]
              : variant.quantity ?? 999;

          return {
            ...product,
            qty: cartItem.quantity,
            options,
            key,
            price,
            selectedVariantName: variantLabel,
            image: variantImage,
            imageUrl: variantImage,
            maxStock,
          };
        })
        .filter(Boolean);

      set({ items: enrichedItems });
    } catch (error) {
      console.error("Fetch cart failed:", error);
    } finally {
      set({ loading: false });
    }
  },

  syncStock: (stockMap) => {
    const items = get().items;

    set({
      items: items.map((item) => {
        const variantId =
          item.options?.variantId || item.options?.productVariantId;

        if (variantId && stockMap[variantId] !== undefined) {
          return { ...item, maxStock: stockMap[variantId] };
        }

        return item;
      }),
    });
  },

  removeSelected: async (keys) => {
    for (const key of keys) {
      await get().removeItem(key);
    }
  },
}));
