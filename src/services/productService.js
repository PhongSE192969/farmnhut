import { productApi } from "@/config/api";
import { apiCall, ENDPOINTS } from "@/config/api.js";
import { HTTP_METHODS } from "@/constraints/index.js";

const extractData = (res) => {
  return res?.data?.data || res?.data || res;
};

const extractPageData = (res) => {
  const data = extractData(res);
  return data;
};

const normalizeSearchParams = (payload = {}) => {
  const status =
    payload.status && payload.status !== "All" && payload.status !== "ALL"
      ? String(payload.status).toUpperCase()
      : undefined;

  return {
    keyword: payload.keyword?.trim() || undefined,
    categoryName: payload.categoryName?.trim() || undefined,
    status,
    packageUnit: payload.packageUnit?.trim() || undefined,
    fromPrice:
      payload.fromPrice !== "" && payload.fromPrice != null
        ? payload.fromPrice
        : undefined,
    toPrice:
      payload.toPrice !== "" && payload.toPrice != null
        ? payload.toPrice
        : undefined,
    page: payload.page ?? 0,
    sizePage: payload.sizePage ?? 10,
    sortBy: payload.sortBy || "name",
    sortDir: payload.sortDir || "asc",
  };
};

export const getAllProducts = async () => {
  const res = await productApi.getAllProducts();
  const data = extractData(res);

  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.content)
      ? data.content
      : [];

  return list.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    brand: p.brand,
    status: p.status,
    category: p.category,
    categoryId: p.category?.id,
    categoryName: p.category?.name,
    variants: p.variants || [],
  }));
};

export const getProducts = async () => {
  try {
    const endpoint = ENDPOINTS.PROTECTED.PRODUCTS.getAll;
    const res = await apiCall(HTTP_METHODS.GET, endpoint, null, {
      params: { page: 0 },
    });
    return res;
  } catch (error) {
    console.error("Get all product error:", error);
    throw error;
  }
};

export const GetAllCategories = async () => {
  try {
    const response = await apiCall(
      HTTP_METHODS.GET,
      ENDPOINTS.PROTECTED.PRODUCTS.categoryGetAll
    );

    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to load categories"
      );
    }
    throw error;
  }
};

export const SearchProducts = async (payload = {}) => {
  try {
    const params = normalizeSearchParams(payload);

    console.log("payload search normalized: ", params);

    const response = await apiCall(
      HTTP_METHODS.GET,
      ENDPOINTS.PROTECTED.PRODUCTS.search,
      null,
      { params }
    );

    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to search products"
      );
    }
    throw error;
  }
};

export const SearchProductsByIds = async (ids) => {
  try {
    const response = await apiCall(
      HTTP_METHODS.POST,
      "/products/search-by-ids",
      ids
    );

    return extractData(response);
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to search products by ids"
      );
    }
    throw error;
  }
};

export const getProductDetail = async (id) => {
  try {
    const response = await apiCall(
      HTTP_METHODS.GET,
      ENDPOINTS.PROTECTED.PRODUCTS.detail(id)
    );

    return extractData(response);
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to get product detail"
      );
    }
    throw error;
  }
};

export const createProduct = async (payload) => {
  try {
    const response = await apiCall(
      HTTP_METHODS.POST,
      ENDPOINTS.PROTECTED.PRODUCTS.create,
      payload
    );

    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Create product failed");
    }
    throw error;
  }
};

export const updateProduct = async (id, payload) => {
  try {
    const response = await apiCall(
      HTTP_METHODS.PUT,
      `${ENDPOINTS.PROTECTED.PRODUCTS.update}/${id}`,
      payload
    );

    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Update product failed");
    }
    throw error;
  }
};

export const DeleteProduct = async (id) => {
  try {
    const response = await apiCall(
      HTTP_METHODS.DELETE,
      ENDPOINTS.PROTECTED.PRODUCTS.delete(id)
    );

    console.log("response del api: ", response);
    return response;
  } catch (error) {
    console.log("DELETE ERROR STATUS:", error.response?.status);
    console.log("DELETE ERROR DATA:", error.response?.data);
    throw error;
  }
};

export const deleteVariant = async (productId, variantId) => {
  try {
    const response = await apiCall(
      HTTP_METHODS.DELETE,
      `${ENDPOINTS.PROTECTED.PRODUCTS.deleteVariant}/${productId}/inactive-variant/${variantId}`
    );

    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Delete variant failed");
    }
    throw error;
  }
};

export const uploadImages = async (files) => {
  try {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await apiCall(
      HTTP_METHODS.POST,
      ENDPOINTS.PROTECTED.PRODUCTS.upload,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return extractData(response);
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Upload failed");
    }
    throw error;
  }
};

export const getPaginatedProducts = async (page = 0) => {
  try {
    const response = await apiCall(
      HTTP_METHODS.GET,
      ENDPOINTS.PROTECTED.PRODUCTS.list,
      null,
      { params: { page } }
    );

    return extractPageData(response);
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to get paginated products"
      );
    }
    throw error;
  }
};

export const getProductsByFranchise = async (locationId, payload = {}) => {
  try {
    const params = normalizeSearchParams(payload);

    const response = await apiCall(
      HTTP_METHODS.GET,
      `/products/franchise/${locationId}`,
      null,
      { params }
    );

    return extractPageData(response);
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to get products by franchise"
      );
    }
    throw error;
  }
};

export const filterProductsByCustomer = async (params = {}) => {
  try {
    const response = await apiCall(
      HTTP_METHODS.GET,
      ENDPOINTS.PUBLIC.filterProduct,
      null,
      { params }
    );

    return extractPageData(response);
  } catch (error) {
    console.error("Filter products error:", error);
    throw error;
  }
};