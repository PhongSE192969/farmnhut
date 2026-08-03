import { useState, useEffect } from 'react'
import { XCircle, CheckCircle2, Clock, Package } from 'lucide-react'
import { formatCurrency } from '../../utils/helpers'
import { useLanguageStore, useAuthStore } from '@/stores'
import { translations } from '@/locales'
import toast from 'react-hot-toast'
import { updateOrderStatus, getOrderById } from '@/services/orderService'
import { getPaymentTransaction } from '@/services/paymentService'
import { SearchUsersByIds } from '@/services/userService'

const getFirstImage = (imageStr) => {
  console.log(imageStr);
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

export default function OrderDetailModal({ order, onClose, onRefresh, showActions = true, franchiseMap = {}, showBranch = true, showOrderIdInHeader = true }) {
  const { language } = useLanguageStore();
  const { user } = useAuthStore();
  const t = (translations[language] || translations.vi).staff?.orderManagement || {};
  const rootOrder = (translations[language] || translations.vi).orderManagement || {};

  const [paymentDetails, setPaymentDetails] = useState(null)
  const [staffName, setStaffName] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [orderToCancel, setOrderToCancel] = useState(null)
  const [fullOrder, setFullOrder] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!order?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const promises = [
          getPaymentTransaction(order.id).catch(e => {
            console.error("Failed to fetch payment details", e);
            return null;
          }),
          getOrderById(order.id).catch(e => {
            console.error("Failed to fetch full order details", e);
            return null;
          })
        ];

        const userIdsToFetch = [];
        if (order.staffId) userIdsToFetch.push(order.staffId);
        if (order.customerId && (!order.customerName || order.customerName.toLowerCase() === 'guest')) {
          userIdsToFetch.push(order.customerId);
        }

        if (userIdsToFetch.length > 0) {
          promises.push(SearchUsersByIds(userIdsToFetch).catch(e => {
            console.error("Failed to fetch user names", e);
            return null;
          }));
        }

        const [paymentRes, orderRes, usersRes] = await Promise.all(promises);

        if (paymentRes && paymentRes.data) {
          setPaymentDetails(paymentRes.data);
        }

        if (orderRes && orderRes.data) {
          setFullOrder(orderRes.data);
        }

        if (usersRes && usersRes.data) {
          const staffUser = usersRes.data.find(u => u.id === order.staffId);
          const customerUser = usersRes.data.find(u => u.id === order.customerId);

          if (staffUser) setStaffName(staffUser.fullName || staffUser.username);
          else if (order.staffId) setStaffName(order.staffId);
          
          if (customerUser) setCustomerName(customerUser.fullName || customerUser.username);
          else setCustomerName(order.customerName);
        } else {
          setStaffName(order.staffId || '');
          setCustomerName(order.customerName || (order.customerId ? "Customer" : "Guest"));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [order]);

  const getStatusBadge = (status) => {
    const s = status ? status.toUpperCase() : "CREATED";
    const styles = {
      WAITING_FOR_CONFIRMATION: 'bg-orange-100 text-orange-700 border-orange-200',
      PREPARING: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      SHIPPING: 'bg-teal-100 text-teal-700 border-teal-200',
      COMPLETED: 'bg-green-100 text-green-700 border-green-200',
      CANCELLED: 'bg-red-100 text-red-700 border-red-200',
      FAILED_ORDER: 'bg-red-100 text-red-700 border-red-200',
      REFUNDED: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return styles[s] || styles.CREATED;
  }

  const getStatusIcon = (status) => {
    const s = status ? status.toUpperCase() : "CREATED";
    switch (s) {
      case 'CREATED': return <Clock size={14} />
      case 'WAITING_FOR_CONFIRMATION': return <Clock size={14} />
      case 'PAID': return <CheckCircle2 size={14} />
      case 'PREPARING': return <Package size={14} />
      case 'SHIPPING': return <CheckCircle2 size={14} />
      case 'COMPLETED': return <CheckCircle2 size={14} />
      case 'CANCELLED':
      case 'FAILED_ORDER':
      case 'FAILED_PAYMENT':
      case 'REFUNDED':
        return <XCircle size={14} />
      default: return <Clock size={14} />
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus, user?.id);
      toast.success(`Order status updated to ${newStatus}`);
      if (onRefresh) onRefresh();
      if (onClose) onClose();
    } catch (error) {
      toast.error("Update status failed");
    }
  }

  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h3 className="text-xl font-black text-primary">{t.modal?.title || "Order Details"}</h3>
            {showOrderIdInHeader && <p className="text-xs text-gray-400 font-mono mt-0.5">{order.id}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 p-2 rounded-full"
          >
            <XCircle size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 font-bold animate-pulse">Đang tải chi tiết đơn hàng...</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* General Info */}
              <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  {t.modal?.generalInfo || "General Information"}
                </h4>
                <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                  {showBranch && order.franchiseId && (
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.modal?.branch || "Đại lý"}</label>
                      <p className="text-sm font-semibold text-primary mt-1">{franchiseMap[order.franchiseId] || order.franchiseId}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.table?.customer || "Customer"}</label>
                    <p className="text-sm font-semibold text-primary mt-1">{customerName || (order.customerId ? "Customer" : "Guest")}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.table?.staff || "Staff"}</label>
                    <p className="text-sm font-semibold text-primary mt-1">{staffName || "None"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.table?.time || "Order Time"}</label>
                    <p className="text-sm text-gray-700 mt-1">{order.createAt ? new Date(order.createAt).toLocaleString() : ''}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.table?.status || "Status"}</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border ${getStatusBadge(order.orderStatus)}`}>
                        {getStatusIcon(order.orderStatus)}
                        {rootOrder.statusBadge?.[order.orderStatus] || order.orderStatus}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.modal?.orderType || "Order Type"}</label>
                    <p className="text-sm font-bold text-indigo-600 mt-1 bg-indigo-50 px-2 py-0.5 rounded-md inline-block">{order.typeOrder}</p>
                  </div>
                  {paymentDetails?.paymentMethodResponse?.methodName ? (
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hình thức thanh toán</label>
                      <p className="text-sm font-semibold text-primary mt-1">{paymentDetails.paymentMethodResponse.methodName}</p>
                    </div>
                  ) : order.typeOrder === 'POS' ? (
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hình thức thanh toán</label>
                      <p className="text-sm font-semibold text-primary mt-1">Tiền mặt</p>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Delivery Info */}
              {order.typeOrder === 'Online' && (
                <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                    <Package size={16} className="text-primary" />
                    {t.modal?.deliveryInfo || "Thông tin giao hàng"}
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.modal?.address || "Địa chỉ giao hàng"}</label>
                      <p className="text-sm text-gray-700 mt-1 bg-white p-3 rounded-xl border border-gray-100 shadow-sm leading-relaxed">
                        {order.address || (t.modal?.notUpdated || "Not updated")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Items */}
              <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                  <Package size={16} className="text-primary" />
                  {t.modal?.items || "Danh sách vật tư"}
                </h4>
                <div className="space-y-3">
                  {(fullOrder?.orderDetails || order.orderDetails)?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-white rounded-2xl p-3 border border-gray-100 shadow-sm hover:border-primary/30 transition-colors">
                      <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 flex-shrink-0 overflow-hidden">
                        {item.productImageUrl ? (
                          <img
                            src={getFirstImage(item.productImageUrl)}
                            alt={item.productNameSnapshot}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.log("Image load error for:", item.productImageUrl);
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=400";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Package size={24} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-primary">{item.productNameSnapshot}</h4>
                        <p className="text-xs text-gray-500 mt-1 font-bold">{t.modal?.quantity || "Quantity"}: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-primary">{formatCurrency(item.priceSnapshot * item.quantity)}</p>
                      </div>
                    </div>
                  )) || (
                      <div className="text-sm text-gray-500 text-center py-4 italic">No items details</div>
                    )}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="border-t border-gray-200 pt-6 space-y-3">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span className="font-medium">{t.modal?.subtotal || "Tạm tính"}</span>
                  <span className="font-bold text-gray-900">{formatCurrency((order.totalDue || 0) - (order.priceShip || 0))}</span>
                </div>
                {order.typeOrder === 'Online' && (
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span className="font-medium">{t.modal?.shipping || "Phí giao vật tư"}</span>
                    <span className="font-bold text-gray-900">{formatCurrency(order.priceShip || 0)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-200">
                  <span className="font-black text-primary text-base uppercase tracking-wider">{t.modal?.total || "Total"}</span>
                  <span className="font-black text-primary text-2xl">{formatCurrency(order.totalDue || 0)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              {showActions && (
                <div className="flex gap-3 pt-6 border-t border-gray-100">
                  {['CREATED', 'WAITING_FOR_CONFIRMATION', 'PAID'].includes(order.orderStatus || order.status) && (
                    <button
                      onClick={() => setOrderToCancel(order)}
                      className="px-6 bg-red-50 hover:bg-red-100 text-red-600 font-black py-3 rounded-xl border border-red-200 transition-all text-sm active:scale-95"
                    >
                      Hủy đơn
                    </button>
                  )}

                  {(order.orderStatus || order.status) === 'WAITING_FOR_CONFIRMATION' && order.typeOrder === 'Online' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'PREPARING')}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl transition-all text-sm shadow-lg shadow-indigo-100 active:scale-95"
                    >
                      Duyệt đơn (Chuẩn bị)
                    </button>
                  )}

                  {(order.orderStatus || order.status) === 'PAID' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'PREPARING')}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl transition-all text-sm shadow-lg shadow-indigo-100 active:scale-95"
                    >
                      Chuẩn bị hàng
                    </button>
                  )}

                  {(order.orderStatus || order.status) === 'PREPARING' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'SHIPPING')}
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-black py-3 rounded-xl transition-all text-sm shadow-lg shadow-teal-100 active:scale-95"
                    >
                      Giao hàng
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>


      {/* Cancel Confirmation Modal */}
      {orderToCancel && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-gray-100 animate-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-red-600">
              <XCircle size={28} />
              <h3 className="text-xl font-black italic">Xác nhận hủy đơn</h3>
            </div>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              Bạn có chắc chắn muốn hủy đơn hàng <strong className="text-primary font-mono">{String(orderToCancel.id).substring(0, 8)}...</strong> không? Thao tác này không thể hoàn tác.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setOrderToCancel(null)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
              >
                Đóng
              </button>
              <button
                onClick={async () => {
                  try {
                    await handleStatusChange(orderToCancel.id, 'CANCELLED');
                    setOrderToCancel(null);
                    onClose();
                  } catch (e) { }
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-black shadow-lg shadow-red-200 transition-all active:scale-95"
              >
                Hủy đơn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
