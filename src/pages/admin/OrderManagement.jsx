import { useState, useEffect } from "react";
import { formatCurrency } from "../../utils/helpers";
import { getOrdersByStatus, searchOrdersById } from "@/services/orderService";
import { getFranchises } from "@/services/franchiseService";
import {
  Search,
  Eye,
} from "lucide-react";
import OrderDetailModal from "@/components/order/OrderDetailModal";
import { useLanguageStore } from "@/stores";
import { translations } from "@/locales";

export default function OrderManagement() {
  const { language } = useLanguageStore();
  const t = (translations[language] || translations.vi).orderManagement;
  const staffT = (translations[language] || translations.vi).staff?.orderManagement || {};
  const STATUS_OPTIONS = t.statusOptions;
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("ALL");
  const [typeOrder, setTypeOrder] = useState("ALL");
  const [franchiseMap, setFranchiseMap] = useState({});

  useEffect(() => {
    const loadFranchises = async () => {
      try {
        const res = await getFranchises();
        const map = {};
        (Array.isArray(res) ? res : []).forEach(f => {
          map[f.id] = f.name || f.franchiseName || f.id;
        });
        setFranchiseMap(map);
      } catch (error) {
        console.error("Failed to fetch franchises:", error);
      }
    };
    loadFranchises();
  }, []);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let response;
      if (keyword.trim() !== "") {
        response = await searchOrdersById(keyword);
        setOrders(response.data || []);
        setTotalPages(1);
      } else {
        response = await getOrdersByStatus(status, typeOrder, page, pageSize);
        setOrders(response.data?.content || []);
        setTotalPages(response.data?.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status, typeOrder, page, pageSize, keyword]);

  const getStatusBadge = (orderStatus) => {
    const s = orderStatus ? orderStatus.toUpperCase() : "WAITING_FOR_CONFIRMATION";
    const base = "text-[10px] font-black px-2.5 py-1 rounded-full uppercase ";

    const textDict = t.statusBadge || {};
    const txt = textDict[s] || s;

    switch (s) {
      case "WAITING_FOR_CONFIRMATION": return <span className={`${base} bg-amber-50 text-amber-600`}>{txt}</span>;
      case "PREPARING": return <span className={`${base} bg-teal-50 text-teal-600`}>{txt}</span>;
      case "SHIPPING": return <span className={`${base} bg-purple-50 text-purple-600`}>{txt}</span>;
      case "COMPLETED": return <span className={`${base} bg-green-500 text-white`}>{txt}</span>;
      case "CANCELLED": return <span className={`${base} bg-red-100 text-red-600`}>{txt}</span>;
      case "FAILED_ORDER": return <span className={`${base} bg-red-500 text-white`}>{txt}</span>;
      case "REFUNDED": return <span className={`${base} bg-gray-50 text-gray-600`}>{txt}</span>;
      default: return <span className={`${base} bg-gray-50 text-gray-600`}>{s}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">{t.title}</h2>
          <p className="text-gray-500 text-sm italic">{t.subtitle}</p>
        </div>
      </div>


      {/* Filter Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d9a13b]/20 transition-all"
              value={keyword}
              onChange={(e) => { setPage(0); setKeyword(e.target.value); }}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 focus:outline-none cursor-pointer"
              value={status}
              onChange={(e) => { setPage(0); setStatus(e.target.value); }}
            >
              {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>

            <select
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 focus:outline-none cursor-pointer"
              value={typeOrder}
              onChange={(e) => { setPage(0); setTypeOrder(e.target.value); }}
            >
              {t.typeOptions?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              )) || (
                  <>
                    <option value="ALL">All Types</option>
                    <option value="POS">Tại đại lý (POS)</option>
                    <option value="Online">Giao về nông trại</option>
                  </>
                )}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                {t.columns.filter((_, idx) => idx !== 1).map((h) => (
                  <th key={h} className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="8" className="p-10 text-center text-sm font-semibold text-gray-400">{t.loading}</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="8" className="p-10 text-center text-sm font-semibold text-gray-400">{t.empty}</td></tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="group hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#d9a13b] text-sm font-mono truncate max-w-[120px]">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-800 max-w-[150px] truncate">
                    {order.franchiseId ? (
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                        {franchiseMap[order.franchiseId] || order.franchiseId}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">
                    {order.customerName || t.guest}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                    <span className="bg-slate-100 px-2 py-1 rounded-md">{order.typeOrder || t.defaultType}</span>
                  </td>
                  <td className="px-6 py-4 font-black text-slate-900 border-l border-gray-50">
                    {formatCurrency(order.totalDue || 0)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(order.orderStatus)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-[#d9a13b] hover:text-[#d9a13b]/80 font-medium text-sm flex items-center gap-1"
                    >
                      <Eye size={16} />
                      {staffT.table?.view || "View"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between bg-white px-6 py-4 border-t border-gray-100">
          <div className="text-sm text-gray-500 font-semibold">
            Trang <span className="text-slate-900 font-bold">{page + 1}</span> / {totalPages}
          </div>
          <div className="flex gap-1">
            <button
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${page === i
                  ? 'bg-[#d9a13b] text-white border-[#d9a13b]'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onRefresh={fetchOrders}
          showActions={true}
          franchiseMap={franchiseMap}
        />
      )}
    </div>
  );
}
