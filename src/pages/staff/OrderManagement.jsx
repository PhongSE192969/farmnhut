import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, Eye, CheckCircle2, Clock, Package, XCircle, BellIcon, RefreshCw } from 'lucide-react'
import { formatCurrency } from '../../utils/helpers'
import { useLanguageStore, useAuthStore } from '@/stores'
import { translations } from '@/locales'
import { Client } from '@stomp/stompjs'
import ENV from "@/config/env"
import { USE_MOCK_API } from "@/mocks/mockConfig"
import toast from 'react-hot-toast'
import { getOrdersByFranchise, updateOrderStatus, searchOrders } from '@/services/orderService'
import { SearchUsersByIds } from '@/services/userService'
import OrderDetailModal from '@/components/order/OrderDetailModal'

export default function OrderManagement() {
  const { user } = useAuthStore();
  const { language } = useLanguageStore();
  const t = (translations[language] || translations.vi).staff?.orderManagement || {};
  const rootOrder = (translations[language] || translations.vi).orderManagement || {};

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [typeOrderFilter, setTypeOrderFilter] = useState('ALL')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [expandedOrderId, setExpandedOrderId] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [staffMap, setStaffMap] = useState({})
  const notificationRef = useRef(null)

  const franchiseId = user?.franchise?.id;

  useEffect(() => {
    if (!franchiseId || USE_MOCK_API) return;

    const stompClient = new Client({
      brokerURL: `${ENV.BASE_URL.replace(/^http/, 'ws')}/api/inventory/ws-inventory`,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.log("Stomp Debug: ", str),
    });

    stompClient.onConnect = () => {
      console.log('Connected to WebSocket!');
      stompClient.subscribe(`/topic/franchise/${franchiseId}/orders`, (message) => {
        console.log('WebSocket Message Received:', message.body);
        if (message.body === 'NEW_ORDER') {
          toast.success("Có đơn hàng trực tuyến mới!", { icon: "🔔" });
          setRefreshTrigger(prev => prev + 1);
        } else if (message.body === 'ORDER_UPDATED') {
          // Refresh list for any status update or deletion
          setRefreshTrigger(prev => prev + 1);
        } else {
          // Fallback refresh for other potential status strings
          setRefreshTrigger(prev => prev + 1);
        }
      });
    };

    stompClient.onStompError = (frame) => {
      console.error('WebSocket Error:', frame.headers['message']);
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [franchiseId]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Fetch orders from backend
  const fetchOrders = async () => {
    if (!franchiseId) return;
    setLoading(true);
    try {
      let res;
      if (searchQuery.trim()) {
        res = await searchOrders(franchiseId, searchQuery.trim());
      } else {
        res = await getOrdersByFranchise(
          franchiseId,
          statusFilter === 'ALL' ? 'all' : statusFilter,
          typeOrderFilter === 'ALL' ? 'all' : typeOrderFilter,
          page,
          10
        );
      }
      const data = res.data;
      console.log("🚀 DEBUG Search Response Data:", data);
      setOrders(Array.isArray(data) ? data : data?.content || []);
      setTotalPages(Array.isArray(data) ? 1 : data?.totalPages || 1);
    } catch (error) {
      console.error("Load orders failed:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, typeOrderFilter, page, franchiseId, searchQuery, refreshTrigger, user?.franchise?.id]);

  useEffect(() => {
    const fetchUserNames = async () => {
      const uids = new Set();
      orders.forEach(o => {
        if (o.staffId) uids.add(o.staffId);
        if (o.customerId) uids.add(o.customerId);
      });

      const missingIds = Array.from(uids).filter(uid => !staffMap[uid]);

      if (missingIds.length > 0) {
        try {
          const res = await SearchUsersByIds(missingIds);
          if (res && res.data) {
            const newNames = {};
            res.data.forEach(user => {
              newNames[user.id] = user.fullName || user.username || user.id;
            });
            setStaffMap(prev => ({
              ...prev,
              ...newNames
            }));
          }
        } catch (e) {
          console.error("Failed to fetch user names", e);
        }
      }
    };

    if (orders.length > 0) {
      fetchUserNames();
    }
  }, [orders, staffMap]);

  const filteredOrders = useMemo(() => orders, [orders]);

  const unhandledOnlineOrdersList = useMemo(() => {
    return orders.filter(order =>
      order.typeOrder === 'Online' &&
      ['CREATED', 'WAITING_FOR_CONFIRMATION', 'PAID'].includes(order.orderStatus || order.status)
    )
  }, [orders])
  const unhandledOnlineOrdersCount = unhandledOnlineOrdersList.length;

  const getStatusBadge = (status) => {
    const s = status ? status.toUpperCase() : "WAITING_FOR_CONFIRMATION";
    const styles = {
      WAITING_FOR_CONFIRMATION: 'bg-orange-100 text-orange-700 border-orange-200',
      PREPARING: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      SHIPPING: 'bg-teal-100 text-teal-700 border-teal-200',
      COMPLETED: 'bg-green-100 text-green-700 border-green-200',
      CANCELLED: 'bg-red-100 text-red-700 border-red-200',
      FAILED_ORDER: 'bg-red-100 text-red-700 border-red-200',
      REFUNDED: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return styles[s] || styles.WAITING_FOR_CONFIRMATION;
  }

  // Get status icon
  const getStatusIcon = (status) => {
    const s = status ? status.toUpperCase() : "WAITING_FOR_CONFIRMATION";
    switch (s) {
      case 'WAITING_FOR_CONFIRMATION': return <Clock size={14} />
      case 'PREPARING': return <Package size={14} />
      case 'SHIPPING': return <CheckCircle2 size={14} />
      case 'COMPLETED': return <CheckCircle2 size={14} />
      case 'CANCELLED':
      case 'FAILED_ORDER':
        return <XCircle size={14} />
      default: return <Clock size={14} />
    }
  }

  // Handle status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders(); // Re-fetch to update view
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
    } catch (error) {
      toast.error("Update status failed");
    }
  }

  // Handle delete order (Cancel for server data)
  const handleDeleteOrder = async (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (order) setOrderToCancel(order);
  }


  // Order statistics (based on current page or total if known)
  const stats = {
    total: orders.length,
    pending: orders.filter(o => ['WAITING_FOR_CONFIRMATION'].includes(o.orderStatus || o.status)).length,
    preparing: orders.filter(o => (o.orderStatus || o.status) === 'PREPARING').length,
    ready: orders.filter(o => (o.orderStatus || o.status) === 'SHIPPING').length,
    completed: orders.filter(o => (o.orderStatus || o.status) === 'COMPLETED').length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.totalDue || o.total || 0), 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center relative z-20">
        <div>
          <h1 className="text-2xl font-black text-primary">{t.title || "Order Management"}</h1>
          <p className="text-gray-500 text-sm mt-1">{t.subtitle || "View and manage all orders"}</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={fetchOrders}
            className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-slate-600 border border-gray-200 px-4 py-2.5 rounded-xl font-bold transition-all active:scale-95 text-sm"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>{t.refresh || "Refresh"}</span>
          </button>

          {/* Notification Bell */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-orange-50 transition-colors relative"
            >
              <BellIcon size={20} className={unhandledOnlineOrdersCount > 0 ? "text-orange-500" : "text-gray-400"} />
              {unhandledOnlineOrdersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex justify-center items-center font-bold border-2 border-white animate-pulse">
                  {unhandledOnlineOrdersCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden z-50">
                <div className="bg-orange-50 px-4 py-3 border-b border-orange-100 flex justify-between items-center">
                  <span className="font-bold text-orange-900 text-sm">Online Orders Waiting</span>
                  <span className="bg-orange-200 text-orange-800 text-xs font-bold px-2 py-0.5 rounded-full">{unhandledOnlineOrdersCount}</span>
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                  {unhandledOnlineOrdersCount === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-400">
                      <BellIcon size={32} className="mx-auto mb-2 opacity-20" />
                      <p>Không có đơn hàng online mới nào.</p>
                    </div>
                  ) : (
                    unhandledOnlineOrdersList.map(order => (
                      <div
                        key={order.id}
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowNotifications(false);
                        }}
                        className="p-4 border-b border-gray-50 hover:bg-orange-50/50 cursor-pointer transition-colors"
                      >
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="font-bold text-primary">{String(order.id).substring(0, 8)}...</span>
                          <span className="text-[10px] text-orange-600 font-bold bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-full">
                            {rootOrder.statusBadge?.[order.orderStatus] || order.orderStatus}
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-gray-800">{order.customerId || "Guest"}</div>
                        <div className="text-xs text-gray-500 mt-1 flex justify-between items-center">
                          <span>{order.orderDetails?.length || 0} items</span>
                          <span className="font-bold text-primary">{formatCurrency(order.totalDue || 0)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm đơn hàng theo mã đơn"
              value={searchInput}
              onChange={(e) => { setPage(0); setSearchInput(e.target.value); }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#d9a13b]/20 focus:border-[#d9a13b] transition-all outline-none"
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            {/* Type Filter */}
            <select
              value={typeOrderFilter}
              onChange={(e) => { setPage(0); setTypeOrderFilter(e.target.value); }}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#d9a13b]/20 focus:border-[#d9a13b] cursor-pointer"
            >
              {rootOrder.typeOptions?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              )) || (
                  <>
                    <option value="ALL">All Types</option>
                    <option value="POS">Tại đại lý (POS)</option>
                    <option value="Online">Giao về nông trại</option>
                  </>
                )}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => { setPage(0); setStatusFilter(e.target.value); }}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#d9a13b]/20 focus:border-[#d9a13b] cursor-pointer"
            >
              {rootOrder.statusOptions?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              )) || (
                  <>
                    <option value="ALL">All Statuses</option>
                    <option value="WAITING_FOR_CONFIRMATION">Waiting For Confirmation</option>
                    <option value="PREPARING">Preparing</option>
                    <option value="SHIPPING">Đang giao</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="FAILED_ORDER">Failed Order</option>
                    <option value="REFUNDED">Refunded</option>
                  </>
                )}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <RefreshCw size={48} className="mx-auto mb-3 animate-spin opacity-50" />
            <p className="font-medium">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Package size={48} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium">{t.empty?.title || "No orders found"}</p>
            <p className="text-sm mt-1">{t.empty?.subtitle || "Orders will appear here after checkout"}</p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">{t.table?.orderId || "Order ID"}</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">{t.table?.customer || "Customer"}</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">{t.table?.total || "Total"}</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">{t.table?.time || "Time"}</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">{t.table?.status || "Status"}</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">{t.table?.actions || "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td
                        className="px-6 py-4 font-bold text-primary text-sm font-mono cursor-pointer hover:text-primary/80 transition-colors"
                        onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                        title={order.id}
                      >
                        {expandedOrderId === order.id ? order.id : `${String(order.id).substring(0, 8)}...`}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">
                          {(!order.customerName || order.customerName.toLowerCase() === 'guest')
                            ? (staffMap[order.customerId] || (order.customerId ? "Customer" : "Guest"))
                            : order.customerName}
                        </span>
                        <div className="text-[10px] text-gray-400 mt-0.5">{t.table?.staff}: {staffMap[order.staffId] || order.staffId || t.table?.notAssigned}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-primary">{formatCurrency(order.totalDue || 0)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">{order.createAt ? new Date(order.createAt).toLocaleString() : ''}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)}
                          {rootOrder.statusBadge?.[order.orderStatus] || order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1"
                        >
                          <Eye size={16} />
                          {t.table?.view || "View"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between bg-white px-6 py-3 border-t border-gray-100">
              <div className="text-sm text-gray-500 font-bold">
                Trang <span className="text-primary">{page + 1}</span> / {totalPages}
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
                      ? 'bg-primary text-white border-primary'
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
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onRefresh={fetchOrders}
          showActions={true}
          showBranch={false}
          showOrderIdInHeader={false}
        />
      )}

    </div>
  )
}
