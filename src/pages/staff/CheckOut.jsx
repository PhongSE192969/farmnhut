import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Phone,
  CheckCircle,
  UserPlus,
  ShoppingBag,
  Printer,
  Plus,
} from "lucide-react";
import { formatCurrency } from "../../utils/helpers";
import { useAuthStore } from "../../stores/authStore";
import { createOrder, abandonOrder } from "@/services/orderService";
import {
  customerService,
  SaveCustomerFranchise,
} from "@/services/customerService";
import { loyaltyApi } from "@/services/loyaltyApi";
import PaymentMethod from "../../components/customer/PaymentMethod";
import { useLanguageStore } from "@/stores";
import { translations } from "@/locales";
import toast from "react-hot-toast";

export default function CheckOut() {
  const { language } = useLanguageStore();
  const t = (translations[language] || translations.vi).staff?.checkout || {};

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const orderData = location.state?.order;
  const orderId = location.state?.orderId;
  useEffect(() => {
    if (!orderData || !orderData.items || orderData.items.length === 0) {
      toast.error("No items in order. Redirecting...");
      navigate("/staff/new-order");
    }
  }, [orderData, navigate]);

  const [customerPhone, setCustomerPhone] = useState("");
  const [customerInfo, setCustomerInfo] = useState(null);
  const [checkingCustomer, setCheckingCustomer] = useState(false);
  const [loyaltyInfo, setLoyaltyInfo] = useState(null);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [isPointsChecked, setIsPointsChecked] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [pendingOrderId, setPendingOrderId] = useState(null);

  useEffect(() => {
    if (location.state?.newCustomer && location.state?.phone) {
      setCustomerPhone(location.state.phone);
      setCustomerInfo(location.state.newCustomer);
      toast.success(`Customer ${location.state.newCustomer.fullName} loaded!`, {
        icon: "✅",
      });
    }
  }, [location.state]);

  useEffect(() => {
    if (!customerPhone || customerPhone.length < 10) {
      setCustomerInfo(null);
      setLoyaltyInfo(null);
      return;
    }

    setCheckingCustomer(true);
    const timer = setTimeout(async () => {
      try {
        const results = await customerService.searchUsers(customerPhone);
        const matched = (results || []).find(
          (u) => u.phone === customerPhone || u.phone?.includes(customerPhone),
        );

        if (matched) {
          const transformedCustomer = {
            userId: matched.id,
            id: matched.id,
            fullName: matched.fullName || matched.username,
            phone: matched.phone,
            email: matched.email,
          };
          setCustomerInfo(transformedCustomer);
          let loyalty = matched.loyaltyInfo;
          if (!loyalty) {
            try {
              const loyaltyRes = await loyaltyApi.getCustomerTierInfo(
                matched.id,
                user?.franchise?.id,
              );
              loyalty = loyaltyRes.data?.data || loyaltyRes.data;
            } catch (err) {
              console.error("Manual loyalty fetch failed:", err);
            }
          }
          setLoyaltyInfo(loyalty || { loyaltyTier: "BRONZE", currentPoint: 0 });

          toast.success(`Found customer: ${transformedCustomer.fullName}`, {
            icon: "✅",
          });
        } else {
          setCustomerInfo(null);
          setLoyaltyInfo(null);
        }
      } catch (error) {
        console.error("Customer lookup failed:", error);
        setCustomerInfo(null);
        setLoyaltyInfo(null);
      } finally {
        setCheckingCustomer(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [customerPhone]);

  const handleCreateCustomer = () => {
    navigate("/staff/create-customer", {
      state: {
        phone: customerPhone,
        returnTo: "/staff/checkout",
        order: orderData,
        orderId: orderId,
      },
    });
  };
  const subtotal = orderData?.total || 0;
  const loyaltyDiscount = isPointsChecked ? pointsToUse * 1000 : 0;
  const finalTotal = Math.max(0, subtotal - loyaltyDiscount);

  const handleCharge = async () => {
    if (!paymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod) {
        try {
          const createOrderRequest = {
            paymentMethodId: paymentMethod,
            franchiseId: user?.franchise?.id,
            customerId: customerInfo?.id || null,
            staffId: user?.id || null,
            promotionId: null,
            point: isPointsChecked ? pointsToUse : null,
            address: null,
            distance: 0,
            typeOrder: "POS",
            items: orderData.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId || null,
              quantity: item.quantity,
            })),
          };

          if (pendingOrderId) {
            try {
              await abandonOrder(pendingOrderId);
            } catch (e) {}
          }

          const res = await createOrder(createOrderRequest);

          if (res.data && res.data.orderId) {
            setPendingOrderId(res.data.orderId);
            localStorage.setItem("pos_current_paying_tab", orderId);
          }

          if (res.data && res.data.paymentUrl) {
            toast.success("Order created! Redirecting to payment...");
            window.location.assign(res.data.paymentUrl);
            return;
          }

          if (res.data && res.data.orderId) {
            toast.success("Order completed successfully!", { icon: "🎉" });

            // 1. Lưu lịch sử khách hàng mua tại Franchise
            const payload = {
              franchiseId: user?.franchise?.id,
              customerId: customerInfo?.userId || null,
            };
            await SaveCustomerFranchise(payload);

            // 2. KHỞI TẠO VÍ ĐIỂM
            if (customerInfo?.userId || customerInfo?.id) {
              const targetUserId = customerInfo.userId || customerInfo.id;
              // Check xem họ đã có hạng thẻ chưa (nếu chưa = chưa có ví)
              if (!loyaltyInfo?.loyaltyTier) {
                try {
                  console.log("Đang tạo ví Loyalty cho User ID:", targetUserId);
                  await loyaltyApi.createWallet(targetUserId);
                  console.log("Tạo ví điểm thành công!");
                } catch (walletError) {
                  // Bỏ qua lỗi nếu backend báo 400 LOYALTY_WALLET_ALREADY_EXISTS
                  console.warn(
                    "Lỗi khi tạo ví (có thể ví đã tồn tại):",
                    walletError,
                  );
                }
              }
            }

            navigate(`/staff/order-success?orderId=${res.data.orderId}`);
          }
        } catch (paymentError) {
          console.error("Payment error", paymentError);
          throw new Error("Failed to initiate payment gateway.");
        }
      }
    } catch (error) {
      toast.error(error.message || "Charge failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    if (!completedOrder) return;

    const receiptWindow = window.open("", "_blank");
    const receiptHtml = `
            <html>
                <head>
                    <title>Receipt #${completedOrder.id}</title>
                    <style>
                        body { font-family: 'Courier New', Courier, monospace; width: 300px; margin: 0 auto; padding: 20px; color: #333; }
                        .header { text-align: center; border-bottom: 2px dashed #ccc; padding-bottom: 15px; margin-bottom: 15px; }
                        .store-name { font-size: 20px; font-weight: bold; margin-bottom: 5px; }
                        .info { font-size: 12px; margin-bottom: 5px; }
                        table { width: 100%; font-size: 12px; margin-bottom: 15px; border-collapse: collapse; }
                        th { text-align: left; border-bottom: 1px solid #eee; padding: 5px 0; }
                        td { padding: 5px 0; }
                        .total-row { border-top: 2px dashed #ccc; padding-top: 10px; font-weight: bold; font-size: 16px; margin-top: 10px; display: flex; justify-content: space-between; }
                        .footer { text-align: center; font-size: 10px; color: #777; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; }
                        .tag { display: inline-block; background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-size: 10px; margin-top: 5px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="store-name">AgriFert</div>
                        <div class="info">${user?.franchise?.name || "Đại lý AgriFert"}</div>
                        <div class="info">${new Date().toLocaleString()}</div>
                        <div class="info">Order ID: # ${completedOrder.id.substring(0, 8)}...</div>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Vật tư</th>
                                <th style="text-align: right">SL</th>
                                <th style="text-align: right">Giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${completedOrder.items
                              .map((item) => {
                                const variantInfo =
                                  item.selectedVariantName ||
                                  [item.packageSize, item.packageUnit].filter(Boolean).join(" ") ||
                                  [item.size, item.color].filter(Boolean).join(" / ") ||
                                  "Quy cách";
                                return `
                                <tr>
                                    <td>${item.name} <br/><span style="font-size: 10px; color: #666">(${variantInfo})</span></td>
                                    <td style="text-align: right">x${item.quantity}</td>
                                    <td style="text-align: right">${formatCurrency(item.price * item.quantity)}</td>
                                </tr>
                            `;
                              })
                              .join("")}
                        </tbody>
                    </table>
                    
                    <div style="font-size: 12px; display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span>Tạm tính:</span>
                        <span>${formatCurrency(subtotal)}</span>
                    </div>
                    ${
                      isPointsChecked
                        ? `
                    <div style="font-size: 12px; display: flex; justify-content: space-between; margin-bottom: 5px; color: #d00;">
                        <span>Points Discount:</span>
                        <span>-${formatCurrency(pointsToUse * 100)}</span>
                    </div>
                    `
                        : ""
                    }
                    
                    <div class="total-row">
                        <span>TOTAL:</span>
                        <span>${formatCurrency(completedOrder.total)}</span>
                    </div>
                    
                    <div style="font-size: 11px; margin-top: 10px; color: #555;">
                        Payment: ${completedOrder.paymentMethod}
                    </div>
                    
                    ${
                      completedOrder.customer
                        ? `
                    <div class="tag">Customer: ${completedOrder.customer.fullName}</div>
                    `
                        : ""
                    }
                    
                    <div class="footer">
                        Thank you for shopping with us!<br/>
                        See you again.
                    </div>
                    
                    <script>
                        window.onload = () => { window.print(); window.close(); };
                    </script>
                </body>
            </html>
        `;
    receiptWindow.document.write(receiptHtml);
    receiptWindow.document.close();
  };

  const handleNewOrder = () => {
    setShowSuccessModal(false);
    navigate("/staff/new-order", {
      state: { orderCompleted: true, completedOrderId: orderId },
    });
  };

  // Handle back
  const handleBack = async () => {
    if (pendingOrderId) {
      try {
        await abandonOrder(pendingOrderId);
      } catch (e) {}
      setPendingOrderId(null);
    }
    navigate("/staff/new-order", {
      state: {
        orderId: orderId,
        restoredOrder: orderData,
      },
    });
  };

  if (!orderData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-2 sm:p-4 lg:p-6 font-sans selection:bg-primary/20">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="group flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-all duration-300 w-fit"
          >
            <div className="p-2 bg-white rounded-full shadow-sm border border-gray-200 group-hover:shadow-md group-hover:-translate-x-1 transition-all">
              <ArrowLeft size={18} />
            </div>
            <span className="font-semibold tracking-tight">
              {t.back || "Back to Order"}
            </span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 text-primary flex items-center justify-center shadow-inner">
                <ShoppingBag size={28} strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                  {t.title || "Checkout"}
                </h1>
                <p className="text-sm font-medium text-gray-500 mt-1.5 flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-gray-100 rounded-md text-gray-700 font-bold uppercase tracking-wider text-xs">
                    {orderData.name ? orderData.name : `ORDER #${orderId}`}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
          {/* Left - Order Items */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-5 md:p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <ShoppingBag size={20} />
                  </div>
                  {t.orderItems || "Danh sách vật tư"}
                </h2>
                <span className="bg-gray-100 text-gray-700 text-sm font-bold px-3 py-1 rounded-full">
                  {t.itemsCount
                    ? t.itemsCount.replace("{count}", orderData.items.length)
                    : `${orderData.items.length} items`}
                </span>
              </div>

              <div className="space-y-4">
                {orderData.items.map((item) => (
                  <div
                    key={item.id}
                    className="group flex gap-4 p-3.5 bg-white hover:bg-slate-50 rounded-2xl border border-gray-50 hover:border-blue-100 hover:shadow-sm transition-all duration-300"
                  >
                    <div className="relative overflow-hidden rounded-xl border border-gray-100 w-20 h-20 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=400";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="font-bold text-gray-900 text-lg line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-sm font-medium text-gray-500 mt-1 bg-white inline-block px-2 py-0.5 rounded-md border border-gray-100 w-fit">
                        {item.size} • {item.color}
                      </p>
                      <div className="flex items-end justify-between mt-3">
                        <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                          {t.qty
                            ? t.qty.replace("{qty}", item.quantity)
                            : `SL: ${item.quantity}`}
                        </span>
                        <span className="font-bold text-primary text-lg tracking-tight">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Checkout Form */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6 lg:self-start">
            {/* Order Summary */}
            <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-5 md:p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-primary to-blue-600"></div>
              <h3 className="font-bold text-gray-900 mb-5 text-xl tracking-tight">
                {t.summary?.title || "Order Summary"}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <span className="text-gray-500 font-medium">
                    {t.summary?.subtotal || "Tạm tính"}
                  </span>
                  <span className="font-bold text-gray-900 text-base">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                {isPointsChecked && pointsToUse > 0 && (
                  <div className="flex justify-between items-center p-2 rounded-xl bg-red-50 text-red-700">
                    <span className="text-sm font-medium">
                      Loyalty Discount
                    </span>
                    <span className="font-bold">
                      -{formatCurrency(pointsToUse * 1000)}
                    </span>
                  </div>
                )}

                <div className="border-t border-dashed border-gray-200 mt-4 pt-5 flex justify-between items-end">
                  <span className="font-bold text-gray-500 text-sm mb-1 uppercase tracking-wider">
                    {t.summary?.totalDue || "Total Due"}
                  </span>
                  <span className="font-black text-3xl text-primary tracking-tight">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Phone */}
            <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-5 md:p-6">
              <h3 className="font-bold text-gray-900 mb-5 text-lg tracking-tight flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Phone size={18} />
                </div>
                {t.customer?.title || "Customer Info"}
              </h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t.customer?.phoneLabel || "Phone Number (Optional)"}
                </label>
                <div className="relative group/input">
                  <input
                    type="tel"
                    placeholder={
                      t.customer?.placeholder || "Enter phone number..."
                    }
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-5 py-3.5 pr-12 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary bg-gray-50/50 hover:bg-gray-50 transition-all text-sm font-medium"
                  />
                  {checkingCustomer && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <p className="text-xs font-medium text-gray-400 mt-2 ml-1">
                  {customerPhone.length > 0 && customerPhone.length < 10
                    ? t.customer?.digitsNeed
                      ? t.customer.digitsNeed.replace(
                          "{count}",
                          10 - customerPhone.length,
                        )
                      : `Need ${10 - customerPhone.length} more digits`
                    : t.customer?.autoSearch ||
                      "System will auto-search when you type"}
                </p>

                {/* Customer Found */}
                {customerInfo && (
                  <div className="mt-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50/30 border border-green-200/60 rounded-2xl flex items-center gap-3">
                    <div className="p-2 bg-white rounded-full shadow-sm">
                      <CheckCircle size={20} className="text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-bold text-green-900">
                        {customerInfo.fullName}
                      </p>
                      <p className="text-xs font-medium text-green-600/80 mt-0.5">
                        {customerInfo.phone} • {customerInfo.email}
                      </p>
                      {loyaltyInfo && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-wider border border-primary/20">
                            {loyaltyInfo.loyaltyTier || "Bronze"}
                          </span>
                          <span className="text-xs font-bold text-primary flex items-center gap-1">
                            <ShoppingBag size={12} />
                            {loyaltyInfo.currentPoint || 0} pts
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Loyalty Points Section */}
                {customerInfo && loyaltyInfo && (
                  <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50/30 border border-blue-200/60 rounded-2xl">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                          <ShoppingBag size={14} />
                        </div>
                        <span className="text-sm font-bold text-blue-900">
                          {t.customer?.loyaltyPoints || "Loyalty Points"}
                        </span>
                      </div>
                      <span className="text-sm font-black text-blue-600">
                        {loyaltyInfo.currentPoint || 0} pts
                      </span>
                    </div>

                    {(loyaltyInfo.currentPoint || 0) > 0 && (
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isPointsChecked}
                            onChange={(e) => {
                              setIsPointsChecked(e.target.checked);
                              if (e.target.checked)
                                setPointsToUse(loyaltyInfo.currentPoint);
                            }}
                            className="w-4 h-4 rounded text-primary focus:ring-primary/20 border-gray-300"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Use points
                          </span>
                        </label>

                        {isPointsChecked && (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="number"
                              value={pointsToUse}
                              onChange={(e) => {
                                const val = Math.min(
                                  parseInt(e.target.value) || 0,
                                  loyaltyInfo.currentPoint,
                                );
                                setPointsToUse(Math.max(0, val));
                              }}
                              max={loyaltyInfo.currentPoint}
                              className="w-full px-3 py-1 border border-blue-200 rounded-lg text-sm font-bold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                            />
                            <span className="text-xs font-bold text-red-500 whitespace-nowrap">
                              -{formatCurrency(pointsToUse * 1000)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Customer Not Found */}
                {!customerInfo &&
                  customerPhone.length >= 10 &&
                  !checkingCustomer && (
                    <div className="mt-4 p-5 bg-gradient-to-br from-amber-50 to-orange-50/30 border border-amber-200/60 rounded-xl relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 text-amber-500/10">
                        <UserPlus size={100} />
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg">
                            <UserPlus size={16} />
                          </div>
                          <p className="text-sm font-bold text-amber-900">
                            {t.customer?.notFound || "Customer not found"}
                          </p>
                        </div>
                        <p className="text-xs font-medium text-amber-700/80 mb-4">
                          {t.customer?.suggestCreate ||
                            "Would you like to create a new customer profile?"}
                        </p>
                        <button
                          type="button"
                          onClick={handleCreateCustomer}
                          className="w-full py-3 bg-white hover:bg-amber-50 text-amber-700 border border-amber-200 font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 shadow-sm focus:ring-4 focus:ring-amber-500/10"
                        >
                          <UserPlus size={18} />
                          {t.customer?.createBtn || "Create New Profile"}
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-5 md:p-6">
              <h3 className="font-bold text-gray-900 mb-5 text-lg tracking-tight flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <CreditCard size={18} />
                </div>
                {t.payment?.title || "Thanh toán"}
              </h3>

              <PaymentMethod
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-6 pt-3">
              <button
                onClick={handleCharge}
                disabled={loading}
                className="group relative w-full py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-black text-lg rounded-2xl transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden z-10"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent -z-10" />

                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    {t.payment?.processing || "Processing..."}
                  </>
                ) : (
                  <>
                    <CreditCard
                      size={22}
                      className="group-hover:scale-110 transition-transform"
                    />
                    {t.payment?.complete || "Place Order"} •{" "}
                    {formatCurrency(finalTotal)}
                  </>
                )}
              </button>
              <button
                onClick={handleBack}
                disabled={loading}
                className="w-full py-3.5 bg-white hover:bg-gray-100 text-gray-700 font-bold border border-gray-200 rounded-2xl transition-all disabled:opacity-50 hover:shadow-sm"
              >
                {t.cancel || "Cancel and Go Back"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 text-center flex flex-col items-center">
            <div className="w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>

            <div className="p-8 md:p-12 flex flex-col items-center w-full">
              <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 rounded-full bg-green-200 animate-ping opacity-20"></div>
                <CheckCircle size={56} className="text-green-500" />
              </div>

              <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
                Order Successful!
              </h2>
              <p className="text-gray-500 font-medium mb-8">
                The transaction has been completed and archived.
              </p>

              <div className="w-full bg-slate-50 rounded-3xl p-6 mb-8 border border-gray-100 text-left space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-semibold uppercase tracking-wider">
                    Order ID
                  </span>
                  <span className="font-bold text-gray-900">
                    #{completedOrder?.id.substring(0, 8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-semibold uppercase tracking-wider">
                    Amount Paid
                  </span>
                  <span className="font-black text-primary text-xl">
                    {formatCurrency(completedOrder?.total)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-semibold uppercase tracking-wider">
                    Method
                  </span>
                  <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg font-bold text-gray-700">
                    {completedOrder?.paymentMethod}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <button
                  onClick={handlePrintReceipt}
                  className="flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                  <Printer size={20} />
                  Print Receipt
                </button>
                <button
                  onClick={handleNewOrder}
                  className="flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                  <Plus size={20} />
                  New Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
