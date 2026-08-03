import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {checkPaymentStatus} from '@/services/paymentService'
import { useCartStore } from "../../stores/cartStore";
import { useLanguageStore } from "@/stores";
import { translations } from "@/locales";


export default function OrderSuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");
    const { language } = useLanguageStore();
    const t = (translations[language] || translations.vi).customer?.orderResult || {};

    const [status, setStatus] = useState(t.loading || "Loading...");
    const { clearCart, removeSelected } = useCartStore();

    useEffect(() => {

        if (!orderId) return;

        const fetchStatus = async () => {
            try {

                const res = await checkPaymentStatus(orderId);

                setStatus(res.data);

            } catch (error) {

                console.error("Failed to get payment status", error);
                setStatus("UNKNOWN");

            }
        };

        fetchStatus();

    }, [orderId]);
    const isSuccess = status === "SUCCESS" || status === "PAID";

    useEffect(() => {
        if (isSuccess) {
            try {
                const purchasedItems = JSON.parse(localStorage.getItem("checkoutItems") || "[]");
                const keysToRemove = purchasedItems.map(i => i.key).filter(Boolean);
                
                if (keysToRemove.length > 0) {
                    removeSelected(keysToRemove);
                } else {
                    clearCart(); // Fallback if no checkout items found in localStorage
                }
                localStorage.removeItem("checkoutItems");
            } catch (error) {
                console.error("Failed to clear purchased items", error);
                clearCart();
            }
        }
    }, [isSuccess]);
    const statusColor =
        (status === "PAID" || status === "SUCCESS" || status === "PENDING")
            ? "text-green-600"
            : "text-red-600";
    return (
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
            <div className="text-6xl mb-6">
                {isSuccess ? "🎉" : "❌"}
            </div>

            <h1 className="text-3xl font-bold mb-4">
                {isSuccess 
                    ? (t.success?.title || "Order Placed Successfully!") 
                    : (t.failed?.title || "Order Placed Failed!")}
            </h1>

            <p className="text-gray-500 mb-2">
                {isSuccess
                    ? (t.success?.subtitle || "Thank you for your purchase.")
                    : (t.failed?.subtitle || "Your payment was not successful.")}
            </p>

            <p className="text-gray-500 mb-2">
                {t.orderId || "Your Order ID:"}
                <span className="font-bold ml-2">#{orderId}</span>
            </p>

            <p className="text-gray-500 mb-8">
                {t.status || "Payment Status:"}
                <span className={`font-bold ml-2 ${statusColor}`}>{status}</span>
            </p>

            <div className="flex justify-center gap-4">
                {isSuccess && (
                    <button
                        onClick={() => navigate(`/orders/${orderId}`)}
                        className="px-6 py-3 bg-gold rounded-xl font-bold hover:bg-yellow-400 transition"
                    >
                        {t.viewOrder || "View Order Details"}
                    </button>
                )}
                <button
                    onClick={() => navigate(isSuccess ? "/products" : "/checkout-payment")}
                    className="px-6 py-3 border rounded-xl font-bold"
                >
                    {isSuccess 
                        ? (t.continueShopping || "Continue Shopping") 
                        : (t.backToCheckout || "Back to Checkout")}
                </button>
            </div>
        </div>
    );
}
