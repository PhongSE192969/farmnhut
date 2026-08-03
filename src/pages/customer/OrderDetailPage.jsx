import {
  ShoppingBag,
  Package,
  Truck,
  CheckCircle,
  Phone,
  MapPin,
  ArrowLeft,
  XCircle,
  Clock,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/helpers";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrderById, updateOrderStatus } from "@/services/orderService";
import {getPaymentUrl} from "@/services/paymentService";
import { useLanguageStore, useAuthStore } from "@/stores";
import { translations } from "@/locales";
import toast from "react-hot-toast";
import {Client} from "@stomp/stompjs";
import ENV from "@/config/env";
import { USE_MOCK_API } from "@/mocks/mockConfig";

const getFirstImage = (imageStr) => {
  if (!imageStr) return null;
  if (imageStr.startsWith('http')) return imageStr;
  try {
    const images = JSON.parse(imageStr);
    if (Array.isArray(images) && images.length > 0) {
      return images[0];
    }
  } catch (e) {
    return imageStr;
  }
  return null;
};

export default function OrderDetailPage() {
  const navigate = useNavigate();
  const { id: orderId } = useParams();
  const { language } = useLanguageStore();
  const { user } = useAuthStore();
  const t = (translations[language] || translations.vi).customer?.orderDetail || {};

  const [order, setOrder] = useState(null);
  const [payUrl, setPayUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await getOrderById(orderId);
                const data = res.data?.data || res.data;
                setOrder(data);
            } catch (error) {
                console.error("Fetch order error:", error);
            } finally {
                setLoading(false);
            }
        };
        if (orderId) fetchOrder();
    }, [orderId]);

  useEffect(() => {
    if (!orderId || USE_MOCK_API) return;

    const stompClient = new Client({
      brokerURL: `${ENV.BASE_URL.replace(/^http/, "ws")}/api/inventory/ws-inventory`,
      reconnectDelay: 5000,
      debug: (str) => console.log("Stomp Debug: ", str),
    });

    stompClient.onConnect = () => {
      console.log("Connected to WebSocket (OrderDetail)!");
      stompClient.subscribe(`/topic/order/${orderId}`, (message) => {
        console.log("WebSocket Status Update:", message.body);
        const newStatus = message.body;
        setOrder((prev) => (prev ? { ...prev, orderStatus: newStatus } : prev));
        toast.success(
          t.toasts?.statusUpdate
            ? t.toasts.statusUpdate.replace("{status}", newStatus)
            : `Trạng thái đơn hàng: ${newStatus}`,
          { icon: "🔔" },
        );
      });
    };

    stompClient.onStompError = (frame) => {
      console.error("WebSocket Error (OrderDetail):", frame.headers["message"]);
    };

    stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, [orderId]);

    useEffect(() => {
        const fetchPayUrl = async () => {
            try {
                const res = await getPaymentUrl(orderId);
                const data = res.data?.data || res.data;

                if (data?.payUrl) {
                    setPayUrl(data.payUrl);
                }
            } catch (error) {
                // Quan trọng: nếu BE throw NOT_FOUND hoặc ORDER_NOT_PAYABLE
                // thì KHÔNG cần báo lỗi cho user
                console.log("No payment URL available");
                setPayUrl(null);
            }
        };

        if (orderId) {
            fetchPayUrl();
        }
    }, [orderId]);

    const handleCancelOrder = () => {
        setIsCancelModalOpen(true);
    };

  const handleConfirmReceipt = async () => {
    try {
      setIsConfirming(true); // <-- Bật loading
      await updateOrderStatus(orderId, "COMPLETED");
      setOrder((prev) => ({ ...prev, orderStatus: "COMPLETED" }));
    } catch (error) {
      toast.error(t.toasts?.confirmFailed || "Xác nhận thất bại!");
    } finally {
      setIsConfirming(false);
    }
  };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-primary font-semibold">
                {t.loading || "Loading order..."}
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                {t.notFound || "Order not found"}
            </div>
        );
    }

  const steps = [
    {
      label: t.steps?.waiting_for_confirmation || "Chờ xác nhận",
      icon: ShoppingBag,
    },
    { label: t.steps?.preparing || "Đang chuẩn bị", icon: Package },
    { label: t.steps?.shipping || "Đang giao", icon: Truck },
    { label: t.steps?.completed || "Hoàn thành", icon: CheckCircle },
  ];

    const statusIndex = {
        WAITING_FOR_CONFIRMATION: 0,
        PREPARING: 1,
        SHIPPING: 2,
        COMPLETED: 3,
    };

    const currentStep = statusIndex[order.orderStatus] ?? 0;

    const canCancel =
        order.orderStatus === "CREATED" ||
        order.orderStatus === "WAITING_FOR_CONFIRMATION" ||
        order.orderStatus === "PAID";

    return (
        <div className="min-h-screen bg-bg-light px-4 lg:px-20 py-10">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* BACK */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary"
                >
                    <ArrowLeft size={16}/>
                    {t.back || "Back"}
                </button>

                {/* HEADER */}
                <div className="bg-white rounded-2xl border shadow-sm p-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black text-primary">
                            {t.detailsTitle || "Chi tiết đơn hàng"}
                        </h1>

            <p className="text-sm text-gray-400 mt-1 flex items-center gap-1.5">
              <Clock size={14} className="text-gray-400/80" />
              {t.orderedAt
                ? t.orderedAt.replace(
                    "{date}",
                    new Date(order.createAt).toLocaleDateString(),
                  ) +
                  ` - ${new Date(order.createAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
                : `Ordered at ${new Date(order.createAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - ${new Date(order.createAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {(() => {
              const statusConfig = {
                waiting_for_confirmation: {
                  label: t.steps?.waiting_for_confirmation || "Chờ xác nhận",
                  class:
                    "bg-amber-100 text-amber-800 border-amber-200 shadow-sm",
                },
                waiting_payment: {
                  label: t.steps?.waiting_for_confirmation || "Chờ xác nhận",
                  class:
                    "bg-amber-100 text-amber-800 border-amber-200 shadow-sm",
                },
                preparing: {
                  label: t.steps?.preparing || "Đang chuẩn bị",
                  class:
                    "bg-indigo-100 text-indigo-800 border-indigo-200 shadow-sm",
                },
                shipping: {
                  label: t.steps?.shipping || "Đang giao",
                  class: "bg-blue-100 text-blue-800 border-blue-200 shadow-sm",
                },
                completed: {
                  label: t.steps?.completed || "Hoàn thành",
                  class:
                    "bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm",
                },
                cancelled: {
                  label: t.steps?.cancelled || "Đã hủy",
                  class: "bg-rose-100 text-rose-800 border-rose-200 shadow-sm",
                },
                failed_order: {
                  label: t.steps?.failed_order || "Thất bại",
                  class: "bg-red-100 text-red-800 border-red-200 shadow-sm",
                },
                failed_payment: {
                  label: t.steps?.failed_order || "Thất bại",
                  class: "bg-red-100 text-red-800 border-red-200 shadow-sm",
                },
                refunded: {
                  label: t.steps?.refunded || "Đã hoàn tiền",
                  class: "bg-gray-200 text-gray-800 border-gray-300 shadow-sm",
                },
              };

              const currentStatus =
                order.orderStatus?.toLowerCase() || "created";
              const config = statusConfig[currentStatus] || {
                label: order.orderStatus,
                class: "bg-gray-50 text-gray-600 border border-gray-100",
              };

              return (
                <span
                  className={`text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full ${config.class}`}
                >
                  {config.label}
                </span>
                            );
                        })()}

            {order.orderStatus === "SHIPPING" && (
              <button
                disabled={isConfirming}
                onClick={handleConfirmReceipt}
                className={`flex items-center gap-1 text-xs font-bold text-white px-3 py-2 rounded-lg transition ${
                  isConfirming
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isConfirming ? (
                  <span className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <CheckCircle size={14} />
                )}
                {isConfirming
                  ? t.confirming || "Đang xác nhận..."
                  : t.confirmReceipt || "Xác nhận đã nhận"}
              </button>
            )}

                        {canCancel && (
                            <button
                                onClick={handleCancelOrder}
                                className="flex items-center gap-1 text-xs font-bold bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
                            >
                                <XCircle size={14}/>
                                {t.cancelOrder || "Cancel Order"}
                            </button>
                        )}

                        {payUrl && (
                            <button
                                onClick={() => window.location.href = payUrl}
                                className="flex items-center gap-2 text-xs font-bold bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                            >
                                💳 {t.repay || "Thanh toán lại"}
                            </button>
                        )}
                    </div>
                </div>

        {/* PRODUCTS */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="font-bold text-primary mb-6">
            {t.productList || "Danh sách vật tư"}
          </h2>
          <div className="space-y-4">
            {order.orderDetails?.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 border-b last:border-0 border-gray-50 hover:bg-gray-50/50 transition-colors rounded-xl px-2"
              >
                <div className="size-14 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {item.productImageUrl ? (
                    <img
                      src={getFirstImage(item.productImageUrl)}
                      alt={item.productNameSnapshot}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=400";
                      }}
                    />
                  ) : (
                    <div className="text-primary/50">
                      <ShoppingBag size={22} />
                    </div>
                  )}
                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-primary truncate">
                                        {item.productNameSnapshot}
                                    </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {t.quantity
                      ? t.quantity.replace("{count}", item.quantity)
                      : `Số lượng: ${item.quantity}`}
                  </p>
                </div>

                                <div className="font-black text-lg text-primary">
                                    {formatCurrency(item.cost)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

        {/* ORDER STATUS */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="font-bold text-primary mb-6">
            {t.orderStatus || "Order Status"}
          </h2>

                    <div className="relative flex items-center justify-between">
                        <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-200"></div>

                        {steps.map((step, index) => {
                            const active = index <= currentStep;

              return (
                <div
                  key={index}
                  className="relative flex flex-col items-center flex-1 text-center"
                >
                  <div
                    className={`size-10 rounded-full flex items-center justify-center z-10 shadow
                    ${
                      active
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <step.icon size={16} />
                  </div>

                                    <p
                                        className={`text-xs font-bold mt-2
                    ${active ? "text-primary" : "text-gray-400"}`}
                                    >
                                        {step.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* CUSTOMER */}
                    <div className="bg-white rounded-2xl border shadow-sm p-6">
                        <h3 className="font-bold text-primary mb-4">
                            {t.customerInfo?.title || "Customer Information"}
                        </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">{t.customerInfo?.name || "Tên khách hàng"}</span>
                <span className="font-semibold">{user?.fullName || order.customerName || "Khách hàng"}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">
                  {t.customerInfo?.address || "Address"}
                </span>
                <span className="font-semibold">{order.address}</span>
              </div>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h3 className="font-bold text-primary mb-4">
              {t.paymentInfo?.title || "Payment Information"}
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">
                  {t.paymentInfo?.subtotal || "Tạm tính"}
                </span>
                <span>{formatCurrency(order.totalDue - order.priceShip)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">
                  {t.paymentInfo?.shipping || "Phí giao vật tư"}
                </span>

                                <span>
                  {order.priceShip === 0
                    ? t.paymentInfo?.free || "Free"
                    : formatCurrency(order.priceShip)}
                </span>
                            </div>

                            <div className="border-t pt-3 flex justify-between font-bold text-lg text-primary">
                                <span>{t.paymentInfo?.total || "Total"}</span>
                                <span>{formatCurrency(order.totalDue)}</span>
                            </div>
                        </div>
                    </div>
                </div>

        {/* Cancel Confirmation Modal */}
        {isCancelModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-sans">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-gray-100">
              <div className="flex items-center gap-2 text-red-600">
                <XCircle size={24} />
                <h3 className="text-lg font-black">
                  {t.cancelConfirm || "Hủy đơn hàng"}
                </h3>
              </div>
              <p className="text-sm text-gray-500">
                {t.cancelConfirmDesc ||
                  "Bạn có chắc chắn muốn hủy đơn hàng này không? Thao tác này không thể hoàn tác."}
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                >
                  {t.close || "Đóng"}
                </button>
                <button
                  onClick={async () => {
                    try {
                      await updateOrderStatus(orderId, "CANCELLED");
                      setIsCancelModalOpen(false);
                    } catch (e) {
                      toast.error(
                        t.toasts?.cancelFailed || "Hủy đơn thất bại!",
                      );
                    }
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-lg shadow-red-200 transition-all"
                >
                  {t.cancelButton || "Hủy đơn"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
