import {apiCall} from "@/config/api";
import {ENDPOINTS} from "@/config/api";
import {HTTP_METHODS} from "@/constraints/index.js";

/**
 * Chọn phương thức thanh toán và tạo QR / payUrl
 */
export const optionPaymentMethod = async (data) => {
    try {
        const endpoint = ENDPOINTS.PROTECTED.PAYMENT.option;
        const res = await apiCall(HTTP_METHODS.POST, endpoint, data);
        return res;
    } catch (error) {
        console.error("Option payment method error:", error);
        throw error;
    }
};


/**
 * Lấy danh sách payment method khả dụng
 */
export const getPaymentMethods = async () => {
    try {

        const endpoint = ENDPOINTS.PROTECTED.PAYMENT.getMethods;

        const res = await apiCall(HTTP_METHODS.GET, endpoint);

        return res;

    } catch (error) {
        console.error("Get payment methods error:", error);
        throw error;
    }
};


/**
 * Kiểm tra trạng thái giao dịch theo orderId
 */
export const checkPaymentStatus = async (orderId) => {
    try {

        const endpoint =
            ENDPOINTS.PROTECTED.PAYMENT.checkStatus(orderId);

        const res = await apiCall(HTTP_METHODS.GET, endpoint);

        return res;

    } catch (error) {
        console.error("Check payment status error:", error);
        throw error;
    }
};

/**
 * Lấy chi tiết giao dịch theo orderId
 */
export const getPaymentTransaction = async (orderId) => {
    try {
        const endpoint = ENDPOINTS.PROTECTED.PAYMENT.getTransaction(orderId);
        const res = await apiCall(HTTP_METHODS.GET, endpoint);
        return res;
    } catch (error) {
        console.error("Get payment transaction error:", error);
        throw error;
    }
};

export const getPaymentUrl = async (orderId) => {
    try {
        const endpoint = ENDPOINTS.PROTECTED.PAYMENT.getPayUrl(orderId);
        const res = await apiCall(HTTP_METHODS.GET, endpoint);
        return res;
    } catch (error) {
        console.error("Get payment url transaction error:", error);
        throw error;
    }
};
