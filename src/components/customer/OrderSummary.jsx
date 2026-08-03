import {formatCurrency} from "../../utils/helpers"
import { useLanguageStore } from "../../stores"
import { translations } from "../../locales"

export default function OrderSummary({items}) {
    const { language } = useLanguageStore();
    const t = (translations[language] || translations.vi).customer?.checkoutInfo?.orderSummary || {};

    const subtotal = items.reduce(
        (sum, i) => (sum + i.price * i.qty),
        0
    )

    const total = subtotal

    return (

        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">

            {/* HEADER */}
            <h2 className="font-semibold text-gray-700 mb-4">
                {t.title || "Items"}
            </h2>

            {/* LIST ITEMS */}
            <div className="space-y-4">
                {items.map(item => (

                    <div
                        key={item.key}
                        className="flex items-center gap-4 border-b last:border-none pb-4 last:pb-0"
                    >

                        {/* IMAGE */}
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg border"
                        />

                        {/* INFO */}
                        <div className="flex-1 space-y-1">

                            <p className="font-medium text-gray-800 line-clamp-2">
                                {item.name}
                            </p>

                            <p className="text-xs text-gray-400">
                                {item.options?.color && `Màu: ${item.options.color}`}
                                {item.options?.size && ` · Size: ${item.options.size}`}
                            </p>

                            <p className="text-orange-500 font-semibold">
                                {formatCurrency(item.price)}
                            </p>

                        </div>

                        {/* QTY */}
                        <div className="text-sm text-gray-500 font-medium">
                            x{item.qty}
                        </div>

                    </div>

                ))}
            </div>

            {/* TOTAL */}
            <div className="flex justify-between items-center mt-5 pt-4 border-t">

        <span className="text-gray-600 font-medium">
            {t.total || "Total"}
        </span>

                <span className="text-orange-500 text-lg font-bold">
            {formatCurrency(total)}
        </span>

            </div>

        </div>

    )

}