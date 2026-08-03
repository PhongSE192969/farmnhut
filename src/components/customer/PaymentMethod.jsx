import {useState, useEffect, useRef} from "react"
import {getPaymentMethods} from '@/services/paymentService'
import {useLanguageStore} from "../../stores"
import {translations} from "../../locales"

export default function PaymentMethod({paymentMethod, setPaymentMethod}) {
    const {language} = useLanguageStore();
    const t = (translations[language] || translations.vi).customer?.paymentMethods || {};

    const [methods, setMethods] = useState([])
    const hasFetched = useRef(false)

    const icons = {
        MOMO: '../public/momo.png',
        VNPAY: '../public/vnpay-1.jpg',
        COD: '../public/cash-money.png'
    }

    useEffect(() => {
        if (hasFetched.current) return
        hasFetched.current = true
        loadPaymentMethods()
    }, [])

    useEffect(() => {
        if (methods.length > 0 && !paymentMethod) {
            const codMethod = methods.find(m => m.methodName === "COD" || m.methodName === "Tiền mặt");
            if (codMethod) {
                setPaymentMethod(codMethod.id);
            }
        }
    }, [methods, paymentMethod, setPaymentMethod]);

    const loadPaymentMethods = async () => {
        try {
            const res = await getPaymentMethods()
            setMethods(res.data)

        } catch (error) {
            console.error("Cannot load payment methods", error)
        }
    }
    return (

        <div className="space-y-3">

            {methods.map(method => {

                const isSelected = paymentMethod === method.id

                return (
                    <label
                        key={method.id}
                        className={`flex items-center gap-4 border rounded-xl p-4 cursor-pointer transition-all duration-200
                ${isSelected
                            ? "border-red-500 bg-red-50 shadow-sm"
                            : "border-gray-200 hover:border-gray-400 hover:shadow-sm"}`}
                    >

                        {/* RADIO */}
                        <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={isSelected}
                            onChange={() => setPaymentMethod(method.id)}
                            className="accent-red-500"
                        />

                        {/* ICON */}
                        <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-lg border">
                            <img
                                src={icons[method.methodName]}
                                alt={method.methodName}
                                className="w-7 h-7 object-contain"
                            />
                        </div>
                        {/* CONTENT */}
                        <div className="flex-1">

                            <p className="font-semibold text-gray-800">
                                {t[method.methodName] || method.methodName}
                            </p>

                            <p className="text-sm text-gray-500">
                                {method.provider}
                            </p>

                        </div>

                        {/* CHECK INDICATOR */}
                        {isSelected && (
                            <div className="text-red-500 text-lg">
                                ✓
                            </div>
                        )}

                    </label>
                )
            })}

        </div>

    )
}