import { apiCall, ENDPOINTS } from "@/config/api";
import { HTTP_METHODS } from "@/constraints";

export const getFranchises = async () => {
  try {
    const res = await apiCall(
      HTTP_METHODS.GET,
      ENDPOINTS.PROTECTED.FRANCHISE.list
    );
    return res;
  } catch (error) {
    console.error("Get franchises error:", error);
    throw error;
  }
};

// Lấy franchise theo status
export const getFranchisesByStatus = async (status) => {
  try {
    // BE endpoint: GET /api/franchises/status/{status}
    const url = ENDPOINTS.PROTECTED.FRANCHISE.byStatus(status);
    const res = await apiCall(HTTP_METHODS.GET, url);
    return res;
  } catch (error) {
    console.error("Get franchises by status error:", error);
    throw error;
  }
};

export const getFranchiseById = async (id) => {
  try {
    const res = await apiCall(
      HTTP_METHODS.GET,
      ENDPOINTS.PROTECTED.FRANCHISE.detail(id)
    );
    return res;
  } catch (error) {
    console.error("Get franchise by id error:", error);
    throw error;
  }
};

export const createFranchise = async (payload) => {
  try {
    const res = await apiCall(
      HTTP_METHODS.POST,
      ENDPOINTS.PROTECTED.FRANCHISE.create,
      payload
    );
    return res;
  } catch (error) {
    console.error("Create franchise error:", error);
    throw error;
  }
};

export const updateFranchise = async (id, payload) => {
  try {
    const res = await apiCall(
      HTTP_METHODS.PUT,
      ENDPOINTS.PROTECTED.FRANCHISE.update(id),
      payload
    );
    return res;
  } catch (error) {
    console.error("Update franchise error:", error);
    throw error;
  }
};

export const deleteFranchise = async (id) => {
  try {
    const res = await apiCall(
      HTTP_METHODS.DELETE,
      ENDPOINTS.PROTECTED.FRANCHISE.delete(id)
    );
    return res;
  } catch (error) {
    console.error("Delete franchise error:", error);
    throw error;
  }
};

export const updateFranchiseStatus = async (id, status) => {
  try {
    const res = await apiCall(
      HTTP_METHODS.PATCH,
      ENDPOINTS.PROTECTED.FRANCHISE.status(id),
      `"${status}"`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  } catch (error) {
    console.error("Update franchise status error:", error);
    throw error;
  }
};

export const getAllFranchises = async () => {
  try {
    const res = await apiCall(HTTP_METHODS.GET, "/franchises");
    return res;
  } catch (error) {
    console.error("Get all franchises error:", error);
    throw error;
  }
};


////
export const GetAllFranchises = async () => {
  try {
    const response = apiCall(
      HTTP_METHODS.GET,
      ENDPOINTS.PROTECTED.FRANCHISE.getAll
    );
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to load franchises",
      );
    }
  }
}

export const GetFranchiseActive = async () => {
  try {
    const response = apiCall(
      HTTP_METHODS.GET,
      ENDPOINTS.PROTECTED.FRANCHISE.getActive
    );
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to load franchises",
      );
    }
  }
}
