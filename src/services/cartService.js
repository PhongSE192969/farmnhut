import { axiosClient } from "@/config/axiosClient";
import { ENDPOINTS } from "@/config/api";

export const getCart = async (customerId) => {
  const response = await axiosClient.get(ENDPOINTS.PROTECTED.CART.get(customerId));
  return response.data; // Thường có data chính nằm trong response.data.data nếu bọc bởi ApiResponse
};

export const addToCart = async (customerId, productId, variantId, quantity) => {
  const response = await axiosClient.post(ENDPOINTS.PROTECTED.CART.add, {
    customerId,
    productId,
    variantId,
    quantity
  });
  return response.data;
};

export const updateCartItem = async (customerId, variantId, quantity) => {
  const response = await axiosClient.put(
    `${ENDPOINTS.PROTECTED.CART.update(customerId, variantId)}?quantity=${quantity}`
  );
  return response.data;
};

export const removeFromCart = async (customerId, variantId) => {
  const response = await axiosClient.delete(ENDPOINTS.PROTECTED.CART.remove(customerId, variantId));
  return response.data;
};

export const clearCartOnline = async (customerId) => {
  const response = await axiosClient.delete(`/api/carts/online/${customerId}/clear`);
  return response.data;
};
