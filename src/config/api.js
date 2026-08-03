import { HTTP_METHODS } from "@/constraints/index.js";
import { axiosClient, publicAxiosClient } from "./axiosClient";
import ENV from "./env";

export const ENDPOINTS = {
  PUBLIC: {
    login: "/auth/login",
    register: "/auth/register",
    verify: "/auth/verify",
    resendCode: "/auth/resend-code",
    forgotPassword: "/auth/forgot-password",
    confirmForgotPassword: "/auth/forgot-password/confirm",

    // Firebase Auth
    syncUser: "/auth/sync-user",
    me: "/auth/me",

    list: "/products/getall",
    categories: "/products/categories/get-all",
    filterProduct: "/products/filter",
  },
  PROTECTED: {
    USER: {
      logout: "/auth/logout",
      profile: "/auth/users/profile",
      refresh: "/auth/refresh",
      counts: "/auth/users/counts",
      getAll: "/auth/users",
      search: "/auth/users/search",
      searchByIds: "/auth/users/bulk",
      create: "/auth/users",
      changePassword: "/auth/change-password",
      assignRole: (userId) => `/auth/users/${userId}/assign-role`,
      update: (userId) => `/auth/users/${userId}/update`,
      updateProfile: "/auth/users/update-profile",
      delete: (userId) => `/auth/users/delete-account/${userId}`,
      changeStatus: (userId) => `/auth/users/${userId}/update-status`,
      getStaffByFranchise: "/auth/users/franchise/staff",
    },
    PRODUCTS: {
     list: "/products/get-all",
      detail: (id) => `/products/detail/${id}`,
      getAll: "/products/get-all",
      search: "/products/search",
      create: "/products",
      update: "/products",
      delete: (id) => `/products/inactive/${id}`,
      deleteVariant: "/products",
      upload: "/uploads",

      categories: "/products/categories",
      categoryGetAll: "/products/categories/get-all",
      categoryUpdate: (id) => `/products/categories/update/${id}`,
      categoryDelete: (id) => `/products/categories/delete/${id}`,
    },
    INVENTORY: {
      list: "/inventory/franchise",
      franchise: "/inventory/franchise",
      lowStock: "/inventory/low-stock",
      threshold: "/inventory/threshold",
      search: "/inventory/search",
    },
    PROMOTIONS: {
      list: "/promotions",
      detail: (id) => `/promotions/${id}`,
      delete: (id) => `/promotions/${id}`,
      create: "/promotions",
      update: (id) => `/promotions/${id}`,
      available: (userId, franchiseId, orderValue) =>
        `/promotions/available?userId=${userId}&franchiseId=${franchiseId}&orderValue=${orderValue}`,
      scopesByPromotion: (promotionId) => `/promotions/scopes/${promotionId}`,
      createScope: "/promotions/scopes",
      updateScope: (id) => `/promotions/scopes/${id}`,
    },
    ORDER: {
      create: "/orders/create-order",
      list: "/orders",
      detail: (id) => `/orders/detail/${id}`,
      assignStaff: (orderId, staffId) =>
        `/orders/${orderId}/assign-staff/${staffId}`,
      abandon: (orderId) => `/orders/${orderId}/abandon`,
    },
    CART: {
      get: (customerId) => `/carts/online/${customerId}`,
      add: "/carts/online/add",
      update: (customerId, variantId) =>
        `/carts/online/${customerId}/update/${variantId}`,
      remove: (customerId, variantId) =>
        `/carts/online/${customerId}/remove/${variantId}`,
      addPos: "/carts/pos/add",
      getPos: (terminalId) => `/carts/pos/${terminalId}`,
      removePos: (terminalId, productId) =>
        `/carts/pos/${terminalId}/remove/${productId}`,
    },
    ADMIN: {
      dashboard: "/admin/dashboard",
      users: "/admin/users",
      branches: "/admin/branches",
      reports: "/admin/reports",
    },
    FRANCHISE: {
      list: "/franchises",
      detail: (id) => `/franchises/${id}`,
      create: "/franchises",
      update: (id) => `/franchises/${id}`,
      delete: (id) => `/franchises/${id}`,
      status: (id) => `/franchises/${id}/status`,
      byStatus: (status) => `/franchises/status/${status}`,
      getAll: "/franchises/get-all",
      getActive: "/franchises/get-active",
      events: "/franchises/events",
    },
    MANAGER: {
      dashboard: "/reports/dashboard",
      staff: "/manager/staff",
      inventory: "/manager/inventory",
    },
    STAFF: {
      dashboard: "/staff/dashboard",
      orders: "/staff/orders",
      queue: "/staff/queue",
    },
    SHIFTS: {
      list: (franchiseId) => `/shifts/franchise/${franchiseId}`,
      create: "/shifts",
      update: (id) => `/shifts/${id}`,
      delete: (id) => `/shifts/${id}`,

      assign: "/shifts/assignments",
      updateAssignment: (assignmentId) => `/shifts/assignments/${assignmentId}`,

      getSchedule: (date, staffId) =>
        `/shifts/assignments?date=${date}${
          staffId ? `&staffId=${staffId}` : ""
        }`,

      getScheduleRange: (staffId, startDate, endDate) =>
        `/shifts/assignments/range?staffId=${staffId}&startDate=${startDate}&endDate=${endDate}`,

      checkIn: (id) => `/shifts/assignments/${id}/check-in`,
      checkOut: (id) => `/shifts/assignments/${id}/check-out`,
      markAbsent: (id) => `/shifts/assignments/${id}/absent`,

      statistics: (date) => `/shifts/statistics?date=${date}`,
      personalStatistics: (staffId) => `/shifts/statistics/${staffId}`,

      incompleteShifts: (date) => `/shifts/attendance/incomplete?date=${date}`,
      attendanceSummary: (date) => `/shifts/attendance/summary?date=${date}`,
      events: "/shifts/events",
    },
    PAYMENT: {
      option: "/payments/option",
      getMethods: "/payments/get-method",
      checkStatus: (id) => `/payments/status/${id}`,
      getTransaction: (id) => `/payments/${id}/get-transaction`,
      getPayUrl: (id) => `/payments/pay-url/${id}`,
    },
    DELIVERY: {
      listAll: "/delivery/getall",
      byOrderId: (orderId) => `/delivery/get-by-order-id/${orderId}`,
      create: "/delivery/create",
      update: (deliveryId) => `/delivery/update/${deliveryId}`,
    },
    AI: {
      search: "/ai/search",
      update: "/ai/update",
      translate: "/ai/translate",
      recommendSystem: "/ai/recommendsystem",
      trainAsync: "/ai/recommend/train",
      trainSync: "/ai/recommend/train/sync",
      status: "/ai/recommend/status",
      similar: "/ai/recommend/similar",
      getConfig: "/ai/config",
      updateConfig: "/ai/config",
    },
    REPORTS: {
      dashboard: "/reports/dashboard",
      events: "/reports/events",
    },
    STORE_REQUESTS: {
      create: "/inventory/requests",
      getAll: "/inventory/requests",
      getById: (id) => `/inventory/requests/${id}`,
      getByFranchise: (franchiseId) =>
        `/inventory/requests?franchiseId=${franchiseId}`,
      getByStatus: (status) => `/inventory/requests/status/${status}`,
      getPending: "/inventory/requests/pending",
      getMyRequests: (createdBy) => `/inventory/requests/my-requests/${createdBy}`,
      getMyRequestsByStatus: (createdBy, status) =>
        `/inventory/requests/my-requests/${createdBy}/status/${status}`,
      approve: (id, sourceId, approvedBy) =>
        `/inventory/requests/${id}/approve?sourceLocationId=${sourceId}${
          approvedBy ? `&approvedBy=${approvedBy}` : ""
        }`,
      ship: (id, sourceId) =>
        `/inventory/requests/${id}/ship${
          sourceId ? `?sourceLocationId=${sourceId}` : ""
        }`,
      receive: (id) => `/inventory/requests/${id}/receive`,
      reject: (id, reason) =>
        `/inventory/requests/${id}/reject?reason=${reason}`,
    },
  CUSTOMER: {
    getAll: "/customers/get-all",

    // ADMIN
    adminAll: "/customers/admin/all",
    adminSearch: "/customers/admin/search",

    // MANAGER / FRANCHISE
    franchiseAll: "/customers/franchise/all",
    franchiseSearch: "/customers/franchise/search",

    // BACKWARD COMPATIBLE SEARCH
    search: "/customers/search",
    searching: "/customers/searching",

    // READ
    bulk: "/customers/bulk",
    detail: (id) => `/customers/${id}`,
    detailByUserFranchise: "/customers/customer-franchise",

    // CREATE / SYNC
    syncInternal: "/customers/internal/sync",
    syncToFranchise: "/customers/sync-to-franchise",
    createAtFranchise: (franchiseId) => `/customers/franchises/${franchiseId}`,

    // ADMIN UPDATE / DELETE
    update: (id) => `/customers/${id}`,
    updateStatus: (id) => `/customers/${id}/status`,
    delete: (id) => `/customers/${id}`,

    // MANAGER UPDATE / DELETE
    managerUpdateStatus: (id) => `/customers/manager/${id}/status`,
    managerDelete: (id) => `/customers/manager/${id}`,
  },
  },
};

export const apiCall = async (method, endpoint, data = null, config = {}) => {
  const isPublic = Object.values(ENDPOINTS.PUBLIC).includes(endpoint);
  const isLoginAction = endpoint === ENDPOINTS.PUBLIC.login;

  const request = isPublic && !isLoginAction ? publicAxiosClient : axiosClient;

  try {
    console.log("ENV.BASE_URL 01", ENV.BASE_URL);
    console.log("request: ", request);
    console.log(`🚀 [${method}] ${endpoint}`, data || "");

    const response = await request({
      method,
      url: endpoint,
      data,
      ...config,
    });

    if (import.meta.env.DEV) {
      console.log("response.data: ", response.data);
      console.log("response.headers: ", response.headers);
    }

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "API Call Failed";

    console.error(`❌ API Error [${method}] ${endpoint}:`, errorMessage);

    if (error instanceof Error) {
      error.message = errorMessage;
    }

    throw error;
  }
};

export const orderApi = {
  createOrder: (data) =>
    apiCall(HTTP_METHODS.POST, ENDPOINTS.PROTECTED.ORDER.create, data),

  assignStaff: (orderId, staffId) =>
    apiCall(
      HTTP_METHODS.PUT,
      ENDPOINTS.PROTECTED.ORDER.assignStaff(orderId, staffId)
    ),

  updateStatus: (orderId, status, staffId) => {
    let url = `${ENDPOINTS.PROTECTED.ORDER.list}/${orderId}/status?status=${status}`;
    if (staffId) url += `&staffId=${staffId}`;
    return apiCall(HTTP_METHODS.PATCH, url);
  },

  getOrdersByFranchise: (franchiseId, status, typeOrder, page, size) => {
    let endpoint = `${ENDPOINTS.PROTECTED.ORDER.list}/franchise/${franchiseId}?page=${page}&size=${size}`;

    if (status && status !== "all" && status !== "ALL") {
      endpoint += `&status=${status.toUpperCase()}`;
    }

    if (typeOrder && typeOrder !== "all" && typeOrder !== "ALL") {
      const mappedType =
        typeOrder.toUpperCase() === "ONLINE" ? "Online" : typeOrder;
      endpoint += `&typeOrder=${mappedType}`;
    }

    return apiCall(HTTP_METHODS.GET, endpoint);
  },

  searchOrders: (franchiseId, keyword) => {
    let endpoint = `${ENDPOINTS.PROTECTED.ORDER.list}/search?keyword=${keyword}`;
    if (franchiseId) endpoint += `&franchiseId=${franchiseId}`;
    return apiCall(HTTP_METHODS.GET, endpoint);
  },

  getOrdersByStatus: (status, typeOrder, page, size) => {
    let endpoint = `${ENDPOINTS.PROTECTED.ORDER.list}/status?page=${page}&size=${size}`;

    if (status && status !== "ALL") {
      endpoint += `&status=${status.toUpperCase()}`;
    }

    if (typeOrder && typeOrder !== "ALL") {
      const mappedType =
        typeOrder.toUpperCase() === "ONLINE" ? "Online" : typeOrder;
      endpoint += `&typeOrder=${mappedType}`;
    }

    return apiCall(HTTP_METHODS.GET, endpoint);
  },

  searchOrdersById: (keyword) =>
    apiCall(
      HTTP_METHODS.GET,
      `${ENDPOINTS.PROTECTED.ORDER.list}/search?keyword=${keyword}`
    ),

  searchOrdersByIdAndFranchise: (franchiseId, keyword) =>
    apiCall(
      HTTP_METHODS.GET,
      `${ENDPOINTS.PROTECTED.ORDER.list}/search?franchiseId=${franchiseId}&keyword=${keyword}`
    ),

  getOrdersByCustomer: (customerId, status, page, size) => {
    let endpoint = `${ENDPOINTS.PROTECTED.ORDER.list}/customer/${customerId}?page=${page}&size=${size}`;
    if (status && status !== "all") endpoint += `&status=${status.toUpperCase()}`;
    return apiCall(HTTP_METHODS.GET, endpoint);
  },

  getOrderById: (orderId) =>
    apiCall(HTTP_METHODS.GET, ENDPOINTS.PROTECTED.ORDER.detail(orderId)),

  abandonOrder: (orderId) =>
    apiCall(HTTP_METHODS.DELETE, ENDPOINTS.PROTECTED.ORDER.abandon(orderId)),
};

export const shiftApi = {
  getByFranchise: (franchiseId) =>
    apiCall(HTTP_METHODS.GET, ENDPOINTS.PROTECTED.SHIFTS.list(franchiseId)),

  createConfig: (data) =>
    apiCall(HTTP_METHODS.POST, ENDPOINTS.PROTECTED.SHIFTS.create, data),

  updateConfig: (id, data) =>
    apiCall(HTTP_METHODS.PUT, ENDPOINTS.PROTECTED.SHIFTS.update(id), data),

  deleteConfig: (id) =>
    apiCall(HTTP_METHODS.DELETE, ENDPOINTS.PROTECTED.SHIFTS.delete(id)),

  assign: (data) =>
    apiCall(HTTP_METHODS.POST, ENDPOINTS.PROTECTED.SHIFTS.assign, data),

  updateAssignment: (assignmentId, data) =>
    apiCall(
      HTTP_METHODS.PUT,
      ENDPOINTS.PROTECTED.SHIFTS.updateAssignment(assignmentId),
      data
    ),

  getSchedule: (date, staffId = null) =>
    apiCall(
      HTTP_METHODS.GET,
      ENDPOINTS.PROTECTED.SHIFTS.getSchedule(date, staffId)
    ),

  getScheduleRange: (staffId, startDate, endDate) =>
    apiCall(
      HTTP_METHODS.GET,
      ENDPOINTS.PROTECTED.SHIFTS.getScheduleRange(staffId, startDate, endDate)
    ),

  checkIn: (id) =>
    apiCall(HTTP_METHODS.PUT, ENDPOINTS.PROTECTED.SHIFTS.checkIn(id)),

  checkOut: (id) =>
    apiCall(HTTP_METHODS.PUT, ENDPOINTS.PROTECTED.SHIFTS.checkOut(id)),

  markAbsent: (id) =>
    apiCall(HTTP_METHODS.PUT, ENDPOINTS.PROTECTED.SHIFTS.markAbsent(id)),

  getStatsByDate: (date) =>
    apiCall(HTTP_METHODS.GET, ENDPOINTS.PROTECTED.SHIFTS.statistics(date)),

  getPersonalStats: (staffId) =>
    apiCall(
      HTTP_METHODS.GET,
      ENDPOINTS.PROTECTED.SHIFTS.personalStatistics(staffId)
    ),

  getIncompleteShifts: (date) =>
    apiCall(
      HTTP_METHODS.GET,
      ENDPOINTS.PROTECTED.SHIFTS.incompleteShifts(date)
    ),

  getAttendanceSummary: (date) =>
    apiCall(
      HTTP_METHODS.GET,
      ENDPOINTS.PROTECTED.SHIFTS.attendanceSummary(date)
    ),
};

export const deliveryApi = {
  getAllDeliveries: () =>
    apiCall(HTTP_METHODS.GET, ENDPOINTS.PROTECTED.DELIVERY.listAll),

  getDeliveryByOrderId: (id) =>
    apiCall(HTTP_METHODS.GET, ENDPOINTS.PROTECTED.DELIVERY.byOrderId(id)),

  createDelivery: (payload) =>
    apiCall(HTTP_METHODS.POST, ENDPOINTS.PROTECTED.DELIVERY.create, payload),

  updateDeliveryById: (deliveryId, payload) =>
    apiCall(
      HTTP_METHODS.PUT,
      ENDPOINTS.PROTECTED.DELIVERY.update(deliveryId),
      payload
    ),
};

export const cartApi = {
  addItemPos: (data) =>
    apiCall(HTTP_METHODS.POST, ENDPOINTS.PROTECTED.CART.addPos, data),

  getCartPos: (terminalId) =>
    apiCall(HTTP_METHODS.GET, ENDPOINTS.PROTECTED.CART.getPos(terminalId)),

  removeItemPos: (terminalId, productId) =>
    apiCall(
      HTTP_METHODS.DELETE,
      ENDPOINTS.PROTECTED.CART.removePos(terminalId, productId)
    ),
};

export const productApi = {
  getAllProducts: () => apiCall(HTTP_METHODS.GET, ENDPOINTS.PUBLIC.list),
};

export const categoryApi = {
  getAll: () => apiCall(HTTP_METHODS.GET, ENDPOINTS.PUBLIC.categories),
};

export const aiApi = {
  semanticSearch: (payload) =>
    apiCall(HTTP_METHODS.POST, ENDPOINTS.PROTECTED.AI.search, payload),

  updateVectorStore: () =>
    apiCall(HTTP_METHODS.POST, ENDPOINTS.PROTECTED.AI.update),

  translateTexts: (payload) =>
    apiCall(HTTP_METHODS.POST, ENDPOINTS.PROTECTED.AI.translate, payload),

  getRecommendations: (payload) =>
    apiCall(HTTP_METHODS.POST, ENDPOINTS.PROTECTED.AI.recommendSystem, payload),

  trainRecommendModelAsync: () =>
    apiCall(HTTP_METHODS.POST, ENDPOINTS.PROTECTED.AI.trainAsync),

  trainRecommendModelSync: () =>
    apiCall(HTTP_METHODS.POST, ENDPOINTS.PROTECTED.AI.trainSync),

  getRecommendModelStatus: () =>
    apiCall(HTTP_METHODS.GET, ENDPOINTS.PROTECTED.AI.status),

  getSimilarProducts: (payload) =>
    apiCall(HTTP_METHODS.POST, ENDPOINTS.PROTECTED.AI.similar, payload),

  getConfig: () => apiCall(HTTP_METHODS.GET, ENDPOINTS.PROTECTED.AI.getConfig),

  updateConfig: (payload) =>
    apiCall(HTTP_METHODS.POST, ENDPOINTS.PROTECTED.AI.updateConfig, payload),
};

export const reportApi = {
  getDashboard: () =>
    apiCall(HTTP_METHODS.GET, ENDPOINTS.PROTECTED.REPORTS.dashboard),

  getDashboardByDate: (fromDate, toDate, franchiseId = null) => {
    const params = { from: fromDate, to: toDate };
    if (franchiseId) params.franchiseId = franchiseId;

    return apiCall(HTTP_METHODS.GET, ENDPOINTS.PROTECTED.REPORTS.dashboard, null, {
      params,
    });
  },
};

export const storeRequestApi = {
  create: (data) =>
    apiCall(HTTP_METHODS.POST, ENDPOINTS.PROTECTED.STORE_REQUESTS.create, {
      createdBy: data.createdBy,
      createdByName: data.createdByName,
      franchiseId: data.franchiseId,
      items: data.items,
      notes: data.notes,
      totalAmount: data.totalAmount,
    }),

  getAll: () =>
    apiCall(HTTP_METHODS.GET, ENDPOINTS.PROTECTED.STORE_REQUESTS.getAll),

  getById: (id) =>
    apiCall(HTTP_METHODS.GET, ENDPOINTS.PROTECTED.STORE_REQUESTS.getById(id)),

  getByFranchise: (franchiseId) =>
    apiCall(
      HTTP_METHODS.GET,
      ENDPOINTS.PROTECTED.STORE_REQUESTS.getByFranchise(franchiseId)
    ),

  getByStatus: (status) =>
    apiCall(
      HTTP_METHODS.GET,
      ENDPOINTS.PROTECTED.STORE_REQUESTS.getByStatus(status)
    ),

  getPending: () =>
    apiCall(HTTP_METHODS.GET, ENDPOINTS.PROTECTED.STORE_REQUESTS.getPending),

  getMyRequests: (createdBy) =>
    apiCall(
      HTTP_METHODS.GET,
      ENDPOINTS.PROTECTED.STORE_REQUESTS.getMyRequests(createdBy)
    ),

  getMyRequestsByStatus: (createdBy, status) =>
    apiCall(
      HTTP_METHODS.GET,
      ENDPOINTS.PROTECTED.STORE_REQUESTS.getMyRequestsByStatus(
        createdBy,
        status
      )
    ),

  review: (id, reviewData) =>
    apiCall(
      HTTP_METHODS.PATCH,
      ENDPOINTS.PROTECTED.STORE_REQUESTS.review(id),
      reviewData
    ),

  complete: (id) =>
    apiCall(HTTP_METHODS.PATCH, ENDPOINTS.PROTECTED.STORE_REQUESTS.complete(id)),
};