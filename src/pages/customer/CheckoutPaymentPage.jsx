import {useState, useEffect} from "react"
import {useLocation, useNavigate} from "react-router-dom"
import toast from "react-hot-toast"

import {formatCurrency} from "../../utils/helpers"
import {createOrder} from "@/services/orderService"
import {getAvailablePromotions} from "@/services/promotionService.js"
import {loyaltyApi} from "@/services/loyaltyApi.js"
import PaymentMethod from "../../components/customer/PaymentMethod"
import {useAuthStore, useLanguageStore} from "@/stores"
import {translations} from "@/locales"
import {useCartStore} from "@/stores/cartStore"

export default function CheckoutPaymentPage() {

    // ================= NAVIGATION =================
    const navigate = useNavigate()
    const {state} = useLocation()

    // ================= STORE =================
    const {user} = useAuthStore()
    const {language} = useLanguageStore()
    const t = (translations[language] || translations.vi).customer?.checkoutPayment || {}
    const {removeSelected} = useCartStore()

    // ================= STATE =================
    const [agree, setAgree] = useState(false)

    const [promotions, setPromotions] = useState([])
    const [selectedPromotion, setSelectedPromotion] = useState(null)
    const [isPromoOpen, setIsPromoOpen] = useState(false)
    const [loadingPromo, setLoadingPromo] = useState(false)
    const [tierInfo, setTierInfo] = useState(null)
    const [point, setPoint] = useState(0)
    const [paymentMethod, setPaymentMethod] = useState(null)
    const [isCreating, setIsCreating] = useState(false)

    // ================= DATA =================
    const data =
        state?.checkoutData ||
        JSON.parse(localStorage.getItem("checkoutData") || "{}")

    const {customer = {}, shipping = {}, items = [], franchiseId} = data

    // ================= COMPUTED =================
    const pointDiscount = point * 1000
    const canCheckout =
        agree &&
        paymentMethod &&
        shipping.address

    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    )

    const discount = selectedPromotion
        ? (() => {
            let rawDiscount = selectedPromotion.discountType === "PERCENT"
                ? subtotal * (selectedPromotion.discountValue / 100)
                : selectedPromotion.discountValue;
            if (selectedPromotion.maxDiscountValue != null) {
                rawDiscount = Math.min(rawDiscount, selectedPromotion.maxDiscountValue);
            }
            // Không cho vượt subtotal
            rawDiscount = Math.min(rawDiscount, subtotal);
            return rawDiscount;
        })()
        : 0;

    const total = Math.max(0, subtotal - discount - pointDiscount + 20000)
    const maxUsablePoint = Math.floor((subtotal - discount) / 1000)

    // ================= EFFECT =================
    useEffect(() => {
        const fetchPromotions = async () => {
            if (!user?.id || !franchiseId) return

            try {
                setLoadingPromo(true)

                const res = await getAvailablePromotions({
                    userId: user.id,
                    franchiseId,
                    orderValue: subtotal
                })

                const list = Array.isArray(res) ? res : res?.data || []
                setPromotions(list)

            } catch (e) {
                console.error("Load promotions failed", e)
            } finally {
                setLoadingPromo(false)
            }
        }

        fetchPromotions()
    }, [user?.id, franchiseId, subtotal])

    useEffect(() => {
        if (selectedPromotion && subtotal < selectedPromotion.minOrderValue) {
            setSelectedPromotion(null)
        }
    }, [subtotal])

    useEffect(() => {
            const fetchCustomerTier = async () => {
                if (!customer?.customer_id || !franchiseId) return
                try {
                    const res = await loyaltyApi.getCustomerTierInfo(customer.customer_id, franchiseId)
                    const data = res?.data?.data || res
                    setTierInfo(data)
                } catch (err) {
                    console.error("Load Tier infomation failed", err)
                }
            }
            fetchCustomerTier()
        }, [customer?.customer_id, franchiseId]
    )

    useEffect(() => {
        if (selectedPromotion) {
            setPoint(0)
        }
    }, [selectedPromotion])

    useEffect(() => {
        if (point > 0) {
            setSelectedPromotion(null)
        }
    }, [point])

    // ================= ACTION =================
    const handleBuy = async () => {
        if (isCreating) return

        try {
            setIsCreating(true)

            const request = {
                franchiseId,
                paymentMethodId: paymentMethod,
                customerId: customer.customer_id,
                staffId: null,
                promotionId: selectedPromotion?.id || null,
                point: point || null,
                address:
                    shipping.address + ", " +
                    shipping.ward + ", " +
                    shipping.district + ", " +
                    shipping.province,
                distance: 1,
                typeOrder: "Online",
                items: items.map(item => ({
                    productId: item.id,
                    variantId: item.options?.variantId || null,
                    quantity: item.qty
                }))
            }

            console.log("payment request:", request)

            const res = await createOrder(request)
            const payUrl = res.data?.paymentUrl || res.paymentUrl
            const orderId = res.data?.orderId || res.orderId

            if (payUrl) {
                // Xóa các sản phẩm đã mua khỏi giỏ hàng trước khi chuyển sang cổng thanh toán
                const purchasedKeys = items.map(item => item.key).filter(Boolean)
                if (purchasedKeys.length > 0) await removeSelected(purchasedKeys)
                window.location.assign(payUrl)
            } else if (orderId) {
                // Xóa các sản phẩm đã mua khỏi giỏ hàng
                const purchasedKeys = items.map(item => item.key).filter(Boolean)
                if (purchasedKeys.length > 0) await removeSelected(purchasedKeys)
                toast.success("Đặt hàng thành công!")
                navigate(`/order-success?orderId=${orderId}`)
            } else {
                console.error("Không tìm thấy thông tin URL hoặc Mã Đơn Hàng", res)
                toast.error("Tạo đơn hàng không thành công!")
            }

        } catch (error) {
            console.error("Payment error", error)
            toast.error(error.message || "Có lỗi xảy ra khi thanh toán")
        } finally {
            setIsCreating(false)
        }
    }

    // ================= RENDER =================
    return (
        <div className="max-w-3xl mx-auto py-10 px-6 bg-gray-50 min-h-screen">

            {/* ================= STEP HEADER ================= */}
            <div className="flex items-center mb-10">

                {/* STEP 1 - DONE */}
                <div className="flex items-center flex-1">
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate("/checkout-info")}>
                        {/*<div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white text-sm font-bold shadow-sm">*/}
                        {/*    ✓*/}
                        {/*</div>*/}

                        <span className="text-green-600 font-semibold whitespace-nowrap group-hover:underline">
                                {t.steps?.info || "1. THÔNG TIN"}
                        </span>
                    </div>
                    <div className="flex-1 h-[2px] bg-green-500 rounded-full mx-4"/>
                </div>

                {/* STEP 2 - ACTIVE */}
                <div className="flex items-center flex-1 justify-end">

                    <div className="flex-1 h-[2px] bg-red-500 rounded-full mx-4"/>

                    <div className="flex items-center gap-3">

                        {/* FIX: thiếu số step */}
                        {/*<div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white text-sm font-bold shadow-sm">*/}
                        {/*    2*/}
                        {/*</div>*/}

                        <span className="text-red-500 font-semibold whitespace-nowrap">
                {t.steps?.payment || "2. THANH TOÁN"}
            </span>
                    </div>
                </div>

            </div>

            {/* ================= ORDER SUMMARY ================= */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 space-y-4 shadow-sm">

                {/* PROMOTION */}
                <div className="flex gap-3">
                    <div className="relative w-full">

                        <button
                            disabled={point > 0} //disable khi có point
                            onClick={() => {
                                if (point > 0) return
                                setIsPromoOpen(prev => !prev)
                            }}
                            className={`w-full border p-3 rounded-lg flex justify-between items-center transition
                                ${point > 0 ? "bg-gray-100 cursor-not-allowed text-gray-400"
                                : "hover:border-gray-400 border-gray-300"}`}>
                    <span className="text-sm">
                        {selectedPromotion
                            ? `${selectedPromotion.discountType} - ${selectedPromotion.name}`
                            : (t.coupon?.placeholder || "Chọn mã giảm giá")}
                    </span>
                            <span
                                className={`text-sm transition-transform duration-200 ${isPromoOpen ? "rotate-180" : ""}`}>▼</span>
                        </button>

                        {isPromoOpen && (
                            <div
                                className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">

                                {loadingPromo && (
                                    <div className="p-3 text-center text-sm text-gray-500">
                                        Đang tải...
                                    </div>
                                )}

                                {!loadingPromo && promotions.length === 0 && (
                                    <div className="p-3 text-center text-sm text-gray-400">
                                        Không có voucher
                                    </div>
                                )}

                                {!loadingPromo && promotions.map(p => {
                                    const isSelected = selectedPromotion?.id === p.id

                                    return (
                                        <button
                                            key={p.id}
                                            onClick={() => {
                                                if (isSelected) {
                                                    setSelectedPromotion(null)
                                                } else {
                                                    setSelectedPromotion(p)
                                                    setPoint(0) //reset point khi chọn promotion
                                                }
                                                setIsPromoOpen(false)
                                            }}
                                            className={`w-full text-left p-3 border-b last:border-none hover:bg-gray-50 transition
                                    ${isSelected ? "bg-orange-50" : ""}`}
                                        >
                                            <div className="font-semibold text-sm">{p.code}</div>

                                            <div className="text-xs text-gray-500">
                                                {p.discountType === "PERCENT"
                                                    ? `Giảm ${p.discountValue}%`
                                                    : `Giảm ${formatCurrency(p.discountValue)}`}
                                            </div>

                                            <div className="text-[11px] text-gray-400">
                                                Đơn tối thiểu: {formatCurrency(p.minOrderValue)} - Tối Đa
                                                Giảm: {formatCurrency(p.maxDiscountValue) || "Không có hạn mức"}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* ================= POINT INPUT ================= */}
                <div className={`border rounded-lg p-3 flex items-center justify-between transition
                            ${selectedPromotion ? "bg-gray-100 opacity-60 cursor-not-allowed border-gray-200"
                    : "border-gray-300"}`}>
                    {/* LEFT */}
                    <div>
                        <p className="text-sm font-medium text-gray-700">
                            Dùng điểm
                        </p>
                        <p className="text-xs text-gray-400">
                            Bạn
                            có: {formatCurrency((tierInfo?.currentPoints || 0) * 1000)} ({tierInfo?.currentPoints || 0} điểm)
                        </p>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-2">

                        <input
                            // type="number"
                            min={0}
                            max={Math.min(tierInfo?.currentPoints || 0, maxUsablePoint)}
                            value={point}
                            disabled={!!selectedPromotion}
                            onChange={(e) => {
                                let value = Number(e.target.value) || 0
                                const maxPoint = Math.min(
                                    tierInfo?.currentPoints || 0,
                                    maxUsablePoint
                                )
                                if (value > maxPoint) value = maxPoint
                                if (value < 0) value = 0
                                setPoint(value)
                                setSelectedPromotion(null) //clear promotion nếu nhập điểm
                            }}
                            className="w-24 border border-gray-300 rounded px-2 py-1 text-sm text-right focus:outline-none focus:border-red-400 disabled:bg-gray-200"
                            placeholder="0"
                        />

                        <span className="text-sm text-gray-500">điểm</span>
                    </div>
                </div>

                {/* SUMMARY */}
                <div className="flex justify-between text-sm text-gray-600">
                    <span>{t.summary?.productCount || "Số lượng vật tư"}</span>
                    <span className="font-medium text-black">{items.length.toString().padStart(2)}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                    <span>{t.summary?.subtotal || "Tổng tiền hàng"}</span>
                    <span className="font-medium text-black">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                    <span>{t.summary?.shipping || "Phí vận chuyển"}</span>
                    <span className="font-medium text-black">{formatCurrency(20000)}</span>
                </div>

                <div className="flex justify-between text-sm text-red-500">
                    <span>{t.summary?.discount || "Giảm giá trực tiếp"}</span>
                    <span>- {formatCurrency(discount || pointDiscount)}</span>
                </div>

                <hr className="border-gray-200"/>

                <div className="flex justify-between font-semibold text-lg">
                    <span>{t.summary?.total || "Tổng tiền"}</span>
                    <span className="text-red-500">{formatCurrency(total)}</span>
                </div>

                <p className="text-xs text-gray-400">
                    {t.summary?.vat || "Đã gồm VAT và được làm tròn"}
                </p>
            </div>

            {/* ================= PAYMENT METHOD ================= */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
                <h3 className="font-semibold mb-4 text-gray-700">
                    {t.paymentInfo?.title || "THÔNG TIN THANH TOÁN"}
                </h3>

                <PaymentMethod
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                />
            </div>

            {/* ================= DELIVERY ================= */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 space-y-4 shadow-sm">

                {/* ROW */}
                <div className="grid grid-cols-3 gap-4 text-sm items-start">
                    <span className="text-gray-500 col-span-1">
                        {t.delivery?.customer || "Khách Hàng"}
                    </span>
                    <span className="font-medium text-black col-span-2 text-right break-words">{customer?.name}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm items-start">
                    <span className="text-gray-500 col-span-1">
                        {t.delivery?.phone || "Số điện thoại"}
                    </span>
                    <span className="font-medium text-black col-span-2 text-right">{customer?.phone}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm items-start">
                    <span className="text-gray-500 col-span-1">
                        {t.delivery?.email || "Email"}
                    </span>
                    <span
                        className="font-medium text-black col-span-2 text-right break-all">{customer?.email?.toString()}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm items-start">
                    <span className="text-gray-500 col-span-1">
                        {t.delivery?.address || "Nhận Hàng Tại"}
                    </span>
                    <span className="font-medium text-black col-span-2 text-right break-words">
                        {shipping?.address}, {shipping?.ward}, {shipping?.district}, {shipping?.province}
                    </span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm items-start">
                    <span className="text-gray-500 col-span-1">
                        {t.delivery?.receiver || "Người nhận"}
                    </span>
                    <span
                        className="font-medium text-black col-span-2 text-right">{shipping?.name} - {shipping?.phone}</span>
                </div>

                <hr className="border-gray-200"/>

                {/* TERMS */}
                <label className="flex items-start gap-3 cursor-pointer mt-2">
                    <input
                        type="checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="mt-1"
                    />

                    <span className="text-sm text-gray-500 leading-relaxed">
                        {t.terms?.agree || "Tôi đồng ý với"}{" "}
                        <a href="#" className="text-primary font-semibold hover:underline">
                            {t.terms?.tos || "Điều khoản dịch vụ"}
                        </a>{" "}
                        {t.terms?.and || "và"}{" "}
                        <a href="#" className="text-primary font-semibold hover:underline">
                        {t.terms?.privacy || "Chính sách bảo mật"}
                        </a>
                     </span>
                </label>
            </div>

            {/* ================= FOOTER ================= */}
            <div className="border-t pt-6">

                <div className="flex justify-between mb-4 font-semibold text-gray-700">
                    <span>{t.footer?.total || "Tổng tiền:"}</span>
                    <span className="text-red-500 text-xl">
                {formatCurrency(total)}
            </span>
                </div>

                <button
                    disabled={!canCheckout || isCreating}
                    onClick={handleBuy}
                    className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-3 rounded-lg font-semibold shadow-sm"
                >
                    Thanh toán
                </button>

                <p className="text-center text-sm text-gray-400 mt-3">
                    {t.footer?.checkItems
                        ? t.footer.checkItems.replace("{count}", items.length)
                        : `Kiểm tra danh sách vật tư (${items.length})`}
                </p>
            </div>
        </div>
    )
}
