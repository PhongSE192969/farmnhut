import axios from "axios";
import { USE_MOCK_API } from "@/mocks/mockConfig";
import { mockDashboardData } from "@/mocks/mockServer";

const API_BASE_URL = "http://localhost:3006";

const reportService = {
  getDashboard: async () => {
    if (USE_MOCK_API) {
      return mockDashboardData();
    }

    const response = await axios.get(`${API_BASE_URL}/reports/dashboard`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 15000,
      withCredentials: false,
    });

    return response.data;
  },

  getDashboardByDate: async (fromDate, toDate) => {
    if (USE_MOCK_API) {
      return mockDashboardData();
    }

    const response = await axios.get(`${API_BASE_URL}/reports/dashboard`, {
      params: { from: fromDate, to: toDate },
      timeout: 15000,
    });

    return response.data;
  },
};

export default reportService;
