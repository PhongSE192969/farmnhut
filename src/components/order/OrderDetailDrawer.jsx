import { useLanguageStore } from '@/stores';
import { translations } from '@/locales';

export default function OrderDetailDrawer({ selectedOrder, setSelectedOrder }) {
  const { language } = useLanguageStore();
  const t = translations[language]?.components?.orderDetailDrawer || translations.vi.components.orderDetailDrawer;

  if (!selectedOrder) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
      <div className="w-[460px] bg-white h-full flex flex-col shadow-xl">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-lg font-bold">{t.title}</h2>

          <button
            onClick={() => setSelectedOrder(null)}
            className="text-xl text-gray-500"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* GENERAL INFO */}
          <div>
            <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
              📄 {t.generalInfo}
            </h3>

            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t.orderId}</span>
                <span className="text-blue-600 font-semibold">
                  {selectedOrder.id}
                </span>
              </div>

              <div className="flex justify-between">
                <span>{t.date}</span>
                <span>{new Date(selectedOrder.createAt).toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>{t.branchId}</span>
                <span>{selectedOrder.franchiseId}</span>
              </div>

              <div className="flex justify-between">
                <span>{t.staffId}</span>
                <span>{selectedOrder.staffId || `N/A`}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>{t.status}</span>

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                  {selectedOrder.orderStatus}
                </span>
              </div>
            </div>
          </div>

          {/* CUSTOMER */}
          <div>
            <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
              👤 {t.customer}
            </h3>

            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full">
                  👤
                </div>

                <div>
                  <p className="font-semibold">
                    {selectedOrder.customerId || t.guest}
                  </p>

                  <p className="text-sm text-gray-500">📞 0912345678</p>
                </div>
              </div>

              <hr className="my-3" />

              <p className="text-sm">
                🏅 {t.loyaltyPoints}
                <span className="text-orange-500 font-semibold ml-1">
                  320
                </span>
              </p>
            </div>
          </div>

          {/* PRODUCTS */}
          <div>
            <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
              🛒 {t.productList}
            </h3>

            <div className="border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">{t.colProduct}</th>
                    <th>{t.colQty}</th>
                    <th>{t.colPrice}</th>
                    <th>{t.colTotal}</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedOrder.orderDetails?.map((item) => (
                    <tr key={item.id} className="border-t text-center">
                      <td className="p-3 text-left">
                        {item.productNameSnapshot}
                      </td>

                      <td>{item.quantity}</td>

                      <td>{item.priceSnapshot?.toLocaleString()} đ</td>

                      <td>{item.cost?.toLocaleString()} đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAYMENT */}
          <div>
            <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
              💳 {t.payment}
            </h3>

            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t.totalDue}</span>
                <span>{selectedOrder.totalDue?.toLocaleString()} đ</span>
              </div>

              <div className="flex justify-between">
                <span>{t.shippingPrice}</span>
                <span>{selectedOrder.priceShip?.toLocaleString()} đ</span>
              </div>

              <div className="flex justify-between text-red-500">
                <span>{t.discount}</span>
                <span>-0 đ</span>
              </div>

              <hr />

              <div className="flex justify-between font-semibold text-blue-600">
                <span>{t.finalAmount}</span>
                <span className="text-lg">
                  {selectedOrder.totalDue?.toLocaleString()} đ
                </span>
              </div>

              <div className="flex justify-between">
                <span>{t.paymentMethod}</span>
                <span className="text-sm">Cash</span>
              </div>
            </div>
          </div>
        </div>

        {/* BUTTON */}
        {selectedOrder.orderStatus === "PENDING" && (
          <div className="flex gap-3 p-5 border-t">
            <button className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold">
              {t.confirmOrder}
            </button>

            <button className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold">
              {t.cancelOrder}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
