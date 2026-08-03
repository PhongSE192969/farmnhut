import { useState, useRef, useEffect } from "react";
import { useLanguageStore } from '@/stores';
import { translations } from '@/locales';

const ResizableHeader = ({ width, onResize, children }) => {
  const [isResizing, setIsResizing] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    startX.current = e.clientX;
    startWidth.current = width;
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e) => {
      const newWidth = Math.max(50, startWidth.current + (e.clientX - startX.current));
      onResize(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, onResize]);

  return (
    <th
      className="p-4 text-left relative group select-none hover:bg-gray-100 transition-colors"
      style={{ width: width ? `${width}px` : undefined }}
    >
      <div className="flex items-center justify-between">
        <span className="truncate">{children}</span>
      </div>
      <div
        onMouseDown={handleMouseDown}
        className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 z-10
          ${isResizing ? "bg-blue-500" : "bg-transparent group-hover:bg-gray-300"}
        `}
      />
    </th>
  );
};

export default function OrderTable({
  orders,
  loading,
  showBranch = false,
  setSelectedOrder,
}) {
  const { language } = useLanguageStore();
  const t = translations[language]?.components?.orderTable || translations.vi.components.orderTable;
  const [widths, setWidths] = useState({
    id: 150,
    date: 180,
    branch: 150,
    customer: 150,
    total: 120,
    payment: 120,
    status: 120,
    action: 100,
  });

  const handleResize = (col, newWidth) => {
    setWidths((prev) => ({ ...prev, [col]: newWidth }));
  };

  if (loading) {
    return <div className="p-10 text-center">{t.loading}</div>;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
      <table className="w-full table-fixed min-w-[1000px]">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <ResizableHeader width={widths.id} onResize={(w) => handleResize("id", w)}>{t.colOrderId}</ResizableHeader>
            <ResizableHeader width={widths.date} onResize={(w) => handleResize("date", w)}>{t.colDate}</ResizableHeader>

            {showBranch && (
              <ResizableHeader width={widths.branch} onResize={(w) => handleResize("branch", w)}>{t.colBranch}</ResizableHeader>
            )}

            <ResizableHeader width={widths.customer} onResize={(w) => handleResize("customer", w)}>{t.colCustomer}</ResizableHeader>
            <ResizableHeader width={widths.total} onResize={(w) => handleResize("total", w)}>{t.colTotal}</ResizableHeader>
            <ResizableHeader width={widths.payment} onResize={(w) => handleResize("payment", w)}>{t.colPayment}</ResizableHeader>
            <ResizableHeader width={widths.status} onResize={(w) => handleResize("status", w)}>{t.colStatus}</ResizableHeader>
            <ResizableHeader width={widths.action} onResize={(w) => handleResize("action", w)}>{t.colAction}</ResizableHeader>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t">
              <td className="p-4 text-blue-600 font-bold truncate">
                {order.id}
              </td>

              <td className="p-4 truncate">
                {new Date(order.createAt).toLocaleString() || t.na}
              </td>

              {showBranch && (
                <td className="p-4 truncate">{order.franchiseId || t.na}</td>
              )}

              <td className="p-4 truncate">{order.customerId || t.guest}</td>

              <td className="p-4 truncate">{order.totalDue?.toLocaleString()} đ</td>

              <td className="p-4 truncate">{order.typeOrder || t.na}</td>

              <td className="p-4 truncate">
                <span
                  className={`
                    px-3 py-1 rounded-full text-xs font-bold
                    ${
                      order.orderStatus === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : ""
                    }
                    ${
                      order.orderStatus === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : ""
                    }
                    ${
                      order.orderStatus === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : ""
                    }
                  `}
                >
                  {order.orderStatus}
                </span>
              </td>

              <td className="p-4 flex gap-3 truncate">
                <button
                  className="text-blue-500 text-2xl px-2 py-1 hover:bg-blue-50 rounded-lg"
                  onClick={() => setSelectedOrder(order)}
                >
                  👁
                </button>

                {order.orderStatus === "PENDING" && (
                  <button className="text-red-500">❌</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
