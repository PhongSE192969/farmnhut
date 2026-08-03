import {useLocation, useNavigate} from "react-router-dom"
import {useState, useEffect, useRef, useMemo} from "react"
import toast from "react-hot-toast"
import {useLanguageStore} from "@/stores";
import {translations} from "@/locales";
import OrderSummary from "../../components/customer/OrderSummary"
import CustomerInfo from "../../components/customer/CustomerInfo"
import ShippingInfo from "../../components/customer/ShippingInfo"
import {getAllFranchises} from "@/services/franchiseService";
import {getCapableBranches} from "@/services/inventoryService";
import {MapPin, ChevronDown, ArrowLeft} from "lucide-react"
import {useAuthStore} from "@/stores/authStore"


export default function CheckoutInfoPage() {

    const navigate = useNavigate()
    const {state} = useLocation()
    const [franchises, setFranchises] = useState([])
    const [selectedFranchise, setSelectedFranchise] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [stockLoading, setStockLoading] = useState(false)
    const [capableBranchIds, setCapableBranchIds] = useState([])
    const dropdownRef = useRef(null)
    const {language} = useLanguageStore();
    const t = (translations[language] || translations.vi).customer?.checkoutInfo || {};
    const [items] = useState(() => state?.items || JSON.parse(localStorage.getItem("checkoutItems") || "[]"))
    const {user} = useAuthStore()
    const [customer, setCustomer] = useState(() => ({
        name: user?.fullName || "",
        phone: user?.phone || "",
        email: user?.email || "",
        customer_id: user?.id || ""
    }))
    const [shipping, setShipping] = useState(() => ({
        name: user?.fullName || "",
        phone: user?.phone || "",
        province: "",
        district: "",
        ward: "",
        address: "",
        lat: null,
        lng: null,
        distance: 0,
        fee: 0,
        isFromMap: false
    }))

    useEffect(() => {
        const fetchCapableBranches = async () => {
            if (items.length === 0) return;
            try {
                setStockLoading(true)
                const payload = items.filter(i => i.options?.variantId).map(item => ({
                    productVariantId: item.options.variantId,
                    quantity: item.qty
                }));
                const res = await getCapableBranches(payload);
                if (res && res.data) {
                    setCapableBranchIds(res.data);
                }
            } catch (e) {
                console.error("Fetch capable branches failed", e);
            } finally {
                setStockLoading(false);
            }
        }
        fetchCapableBranches();
    }, [items]);

    const filteredFranchises = useMemo(() => {
        if (!capableBranchIds || capableBranchIds.length === 0) return [];
        return franchises.filter(f => capableBranchIds.includes(f.id));
    }, [franchises, capableBranchIds]);

    useEffect(() => {
        if (filteredFranchises.length > 0 && !selectedFranchise) {
            setSelectedFranchise(filteredFranchises[0]);
        }
    }, [filteredFranchises, selectedFranchise]);

    useEffect(() => {
        const fetchFranchises = async () => {
            try {
                setLoading(true)
                const res = await getAllFranchises()
                const list = Array.isArray(res) ? res : res?.data || []
                setFranchises(list)
            } catch (e) {
                console.error("Load franchise failed", e)
            } finally {
                setLoading(false)
            }
        }

        fetchFranchises()
    }, [])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleContinue = async () => {

        if (!selectedFranchise) {
            toast.error("Vui lòng chọn đại lý hợp lệ")
            return
        }

        if (!customer.name || !customer.phone) {
            toast.error(t.toasts?.fillAll || "Vui lòng nhập đầy đủ thông tin")
            return
        }

        if (!customer.phone.match(/^[0-9]{9,11}$/)) {
            toast.error(t.toasts?.invalidPhone || "Số điện thoại không hợp lệ")
            return
        }
        if (!shipping.name || !shipping.phone) {
            toast.error(t.toasts?.shippingInfo || "Vui lòng nhập thông tin người nhận")
            return
        }
        if (!shipping.province || !shipping.district || !shipping.ward) {
            toast.error(t.toasts?.addressSelect || "Vui lòng chọn đầy đủ địa chỉ")
            return
        }
        if (!shipping.address) {
            toast.error(t.toasts?.addressDetail || "Vui lòng nhập địa chỉ cụ thể")
            return
        }
        const checkoutData = {
            customer,
            shipping,
            items,
            franchiseId: selectedFranchise.id,
            franchiseName: selectedFranchise.name
        }
        localStorage.setItem("checkoutData", JSON.stringify(checkoutData))
        navigate("/checkout-payment", {
            state: {checkoutData}
        })

    }

    return (

        <div className="max-w-3xl mx-auto py-10 px-6">
            <button
                onClick={() => navigate("/checkout")}
                className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary mb-6 transition-colors"
            >
                <ArrowLeft size={16}/>
                {t.actions?.backToCart || "Quay lại giỏ hàng"}
            </button>

            {/* STEP HEADER */}
            <div className="flex items-center mb-10">

                {/* STEP 1 */}
                <div className="flex items-center flex-1">
                    <div className="flex-1 h-[2px] bg-red-500 rounded-full mr-4"></div>

                    <div
                        className="flex items-center gap-2 text-red-500 font-semibold whitespace-nowrap transition-all duration-300 shadow-sm px-2 py-1 rounded-md bg-red-50">
                        {t.steps?.info || "1. THÔNG TIN"}
                    </div>

                    <div className="flex-1 h-[2px] bg-red-500 rounded-full ml-4"></div>
                </div>

                {/* STEP 2 */}
                <div className="flex items-center flex-1 justify-end">

                    <div className="flex-1 h-[2px] bg-gray-300 rounded-full mr-4"></div>

                    <div
                        onClick={() => navigate("/checkout-info")}
                        className="flex items-center gap-2 text-gray-500 font-semibold whitespace-nowrap cursor-pointer
                       transition-all duration-300 hover:text-black hover:scale-105 active:scale-95"
                    >
                        {t.steps?.payment || "2. THANH TOÁN"}
                    </div>

                    <div className="flex-1 h-[2px] bg-gray-300 rounded-full ml-4"></div>
                </div>

            </div>

            <OrderSummary items={items}/>

            <CustomerInfo
                customer={customer}
                setCustomer={setCustomer}
            />
            {/* Chọn đại lý */}
            <div className="mb-6 relative" ref={dropdownRef}>
                <label className="block text-sm font-semibold mb-2">
                    Chọn đại lý
                </label>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 border rounded-xl bg-white shadow-sm"
                >
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-orange-500"/>
                        <span>
                {loading
                    ? "Đang tải..."
                    : selectedFranchise?.name || "Chọn đại lý"}
            </span>
                    </div>

                    <ChevronDown
                        size={16}
                        className={`transition ${isOpen ? "rotate-180" : ""}`}
                    />
                </button>

                {isOpen && (
                    <div
                        className="absolute top-full mt-2 w-full bg-white border rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                        {filteredFranchises.map((f) => (
                            <button
                                key={f.id}
                                onClick={() => {
                                    setSelectedFranchise(f)
                                    setIsOpen(false)
                                }}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-100
                        ${selectedFranchise?.id === f.id
                                    ? "bg-orange-100 font-semibold"
                                    : ""
                                }`}
                            >
                                {f.name}
                            </button>
                        ))}
                    </div>
                )}

                {!stockLoading && capableBranchIds.length === 0 && (
                    <div className="mt-2 p-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
                        Không có đại lý nào đáp ứng đủ tất cả các mặt hàng trong giỏ của bạn. Vui lòng liên hệ hỗ
                        trợ.
                    </div>
                )}
            </div>

            <ShippingInfo
                shipping={{
                    ...shipping,
                    franchiseId: selectedFranchise?.id
                }}
                setShipping={setShipping}
            />
            <button
                // disabled={!customer.name || !customer.phone || !isValidShipping}
                onClick={handleContinue}
                className={`w-full py-3 rounded font-semibold text-white
                    ${!customer.name || !customer.phone
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"}`}>
                {t.actions?.continue || "Tiếp tục"}
            </button>
        </div>

    )

}
