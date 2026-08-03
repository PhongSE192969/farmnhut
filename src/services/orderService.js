import { orderApi } from "@/config/api";

/**
 * Lấy danh sách order theo franchiseId + status + pagination
 */
export const getOrdersByFranchise = async (
  franchiseId,
  status = "all",
  typeOrder = "all",
  page = 0,
  size = 10
) => {
  try {
    return await orderApi.getOrdersByFranchise(franchiseId, status, typeOrder, page, size);
  } catch (error) {
    console.error("Get orders by franchise error:", error);
    throw error;
  }
};

export const searchOrders = async (franchiseId, keyword) => {
  try {
    return await orderApi.searchOrders(franchiseId, keyword);
  } catch (error) {
    console.error("Search orders error:", error);
    throw error;
  }
};

/**
 * Cập nhật trạng thái order
 */
export const updateOrderStatus = async (orderId, status, staffId) => {
  try {
    return await orderApi.updateStatus(orderId, status, staffId);
  } catch (error) {
    console.error("Update order status error:", error);
    throw error;
  }
};

/**
 * Lấy danh sách order theo status + pagination
 */
export const getOrdersByStatus = async (status, typeOrder, page = 0, size = 10) => {
  try {
    return await orderApi.getOrdersByStatus(status, typeOrder, page, size);
  } catch (error) {
    console.error("Get orders by status error:", error);
    throw error;
  }
};

/**
 * Tìm order theo orderId gần đúng
 */
export const searchOrdersById = async (keyword) => {
  try {
    return await orderApi.searchOrdersById(keyword);
  } catch (error) {
    console.error("Search order error:", error);
    throw error;
  }
};

/**
 * Tìm order gần đúng theo orderId + franchiseId
 */
export const searchOrdersByIdAndFranchise = async (franchiseId, keyword) => {
  try {
    return await orderApi.searchOrdersByIdAndFranchise(franchiseId, keyword);
  } catch (error) {
    console.error("Search order by franchise error:", error);
    throw error;
  }
};

/**
 * Lấy danh sách order theo customerId + status + pagination
 */
export const getOrdersByCustomer = async (
  customerId,
  status = "all",
  page = 0,
  size = 10
) => {
  try {
    return await orderApi.getOrdersByCustomer(customerId, status, page, size);
  } catch (error) {
    console.error("Get orders by customer error:", error);
    throw error;
  }
};

/**
 * Lấy thông tin chi tiết order theo orderId
 */
export const getOrderById = async (orderId) => {
  try {
    return await orderApi.getOrderById(orderId);
  } catch (error) {
    console.error("Get order by id error:", error);
    throw error;
  }
};

/**
 * Tạo mới một order
 */
export const createOrder = async (orderData) => {
  try {
    return await orderApi.createOrder(orderData);
  } catch (error) {
    console.error("Create order error:", error);
    throw error;
  }
};

/**
 * Hủy và xóa đơn hàng vĩnh viễn (dành cho Staff abandon)
 */
export const abandonOrder = async (orderId) => {
  try {
    return await orderApi.abandonOrder(orderId);
  } catch (error) {
    console.error("Abandon order error:", error);
    throw error;
  }
};
