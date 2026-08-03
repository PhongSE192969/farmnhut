import React, { useState, useMemo } from 'react';
import {
  Search,
  AlertTriangle,
  History,
  MapPin,
  Package,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRight,
  Plus,
  Clock,
  Calendar,
  X,
  LayoutGrid,
  Inbox,
  ArrowLeftRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore, useAuthStore } from "@/stores";
import { translations } from "@/locales";
import ENV from "@/config/env";
import { Client } from '@stomp/stompjs';
import { USE_MOCK_API } from "@/mocks/mockConfig";
import SockJS from 'sockjs-client';
import { addInitialStock, getStocks, getTransactions, getTransfers, createTransfer, getStockRequests, approveStockRequest, rejectStockRequest, shipStockRequest } from "@/services/inventoryService";
import { getAllFranchises } from "@/services/franchiseService";

const LoadingSpinner = ({ t }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="size-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full shadow-lg shadow-blue-600/10"
    />
    <p className="text-sm font-bold text-slate-400 animate-pulse uppercase tracking-widest">{t.alerts?.loading || "Đang tải dữ liệu..."}</p>
  </div>
);
import ProductCatalogModal from "@/components/modal/ProductCatalogModal";
import PaginationControls from "@/components/ui/PaginationControls";




const InventoryOverview = ({ t, language, stocks = [], franchises = [], locationFilter, setLocationFilter, showLowStockOnly, setShowLowStockOnly }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [locationFilter, searchTerm, showLowStockOnly]);

  const filteredStocks = stocks.filter(stock => {
    const matchesLocation = locationFilter === 'ALL' ||
      String(stock.locationId) === locationFilter;

    const matchesSearch = (stock.productName || '').toLowerCase().includes(searchTerm.toLowerCase()) || (stock.sku && stock.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLowStock = !showLowStockOnly || (stock.actual <= stock.minStock);
    return matchesLocation && matchesSearch && matchesLowStock;
  });

  return (
    <div className="space-y-4">

      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={t.overview?.searchPlaceholder || "Tìm kiếm phân bón..."}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border ${showLowStockOnly
              ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20'
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
          >
            <AlertTriangle size={14} /> {showLowStockOnly ? (t.overview?.filterLowStockActive || 'Đang lọc tồn kho thấp') : (t.overview?.filterLowStock || 'Lọc tồn kho thấp')}
          </button>
          <select
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-black text-gray-600 focus:outline-none min-w-[200px]"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="ALL">{t.overview?.allLocations || "Tất cả vị trí"}</option>
            <option value="00000000-0000-0000-0000-000000000000">{t.overview?.mainWarehouse || "Kho tổng hệ thống"}</option>
            {franchises.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">{t.table?.product || "Phân bón"}</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">{t.table?.location || "Vị trí"}</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider text-center">{t.table?.actual || "Tồn thực tế"}</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider text-center">{t.table?.reserved || "Đã giữ"}</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider text-center">{t.table?.available || "Có thể bán"}</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider text-right">{t.table?.status || "Trạng thái"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStocks.slice((currentPage - 1) * 10, currentPage * 10).map(stock => {
                const available = stock.actual - stock.reserved;
                const isLow = stock.actual <= stock.minStock;
                return (
                  <tr key={stock.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-gray-50 flex items-center justify-center text-slate-400 border border-gray-100 group-hover:text-blue-500 transition-colors">
                          <Package size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{stock.productName}</div>
                          <div className="text-[10px] text-gray-400 font-mono tracking-tight uppercase">SKU: {stock.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase">
                        <MapPin size={12} className="text-slate-300" /> {
                          stock.locationType === 'WAREHOUSE'
                            ? (t.overview?.mainWarehouseShort || 'Kho tổng')
                            : (franchises.find(f => String(f.id) === String(stock.locationId))?.name || (t.overview?.branchDefault || 'Đại lý'))
                        }
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center font-black text-slate-900">{stock.actual}</td>
                    <td className="px-6 py-5 text-center font-bold text-gray-400 italic">{stock.reserved}</td>
                    <td className="px-6 py-5 text-center">
                      <span className={`text-sm font-black ${available <= stock.minStock ? 'text-red-500' : 'text-blue-600'}`}>
                        {available}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase border ${isLow ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' : 'bg-green-50 text-green-600 border-green-100'
                          }`}>
                          {isLow ? (t.overview?.statusLow || 'Sắp hết') : (t.overview?.statusSafe || 'Ổn định')}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <PaginationControls
        currentPage={currentPage}
        totalPages={Math.ceil(filteredStocks.length / 10)}
        setPage={setCurrentPage}
      />
    </div>
  );
};

const RequestManagement = ({ t, language, requests = [], franchises = [], onApprove, onReject, onShip }) => {
  const hasInsufficientStock = (req) => {
    return req.items?.some(item => item.currentQuantity !== undefined && item.currentQuantity < item.quantity);
  };

  const getLocName = (id) => {
    const f = franchises.find(f => String(f.id) === String(id));
    return f ? f.name : (t.overview?.branchDefault || 'Đại lý') + ' ' + (id?.substring(0, 8) || id);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h3 className="font-black text-slate-900 uppercase tracking-tighter">{t.requests?.title || "Danh sách yêu cầu nhập phân bón"}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase w-32">{t.requests?.code || "Mã yêu cầu"}</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase w-44">{t.requests?.unit || "Đại lý yêu cầu"}</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">{t.requests?.details || "Chi tiết"}</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase w-40">{t.requests?.notes || "Ghi chú"}</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase text-right">{t.requests?.actions || "Thao tác"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {requests.map(req => {
              const isPending = req.status === 'PENDING';
              return (
                <tr key={req.id} className={`transition-all border-b border-gray-50/50 ${isPending ? 'bg-amber-50/20 border-l-4 border-l-amber-500 hover:bg-amber-50/40' : 'hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-5">
                    <div className="font-mono font-bold text-slate-900">{req.requestCode}</div>
                    <div className="text-[10px] text-gray-400 mt-1 uppercase flex items-center gap-1">
                      <Clock size={10} /> {req.createdAt ? new Date(req.createdAt).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US') : (t.requests?.na || 'N/A')}
                    </div>
                  </td>
                  <td className="px-6 py-5 font-bold text-slate-700">{getLocName(req.franchiseId)}</td>
                  <td className="px-6 py-5">
                    {req.items && req.items.map((item, i) => (
                      <div key={i} className="text-xs font-bold text-gray-500 flex items-center flex-wrap gap-1">
                        <span>{item.productName ? `${item.productName} - ${item.color} - ${item.size}` : (t.requests?.productDefault || 'Phân bón')}</span>
                        x <span className="text-slate-900">{item.quantity}</span>
                        {req.status === 'APPROVED' && item.currentQuantity !== undefined && (
                          <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${item.currentQuantity < item.quantity ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-gray-50 text-gray-500'}`}>
                            ({(t.requests?.warehouseInfo || "Tồn kho tổng: {qty}").replace('{qty}', item.currentQuantity)})
                          </span>
                        )}
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-600">
                    {req.notes || "-"}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end items-center gap-2">
                      {isPending ? (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => onApprove && onApprove(req)}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[10px] font-black uppercase rounded-lg transition-all shadow-sm active:scale-95"
                          >
                            {t.requests?.approve || "Duyệt"}
                          </button>
                          <button
                            onClick={() => onReject && onReject(req)}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-black uppercase rounded-lg transition-all active:scale-95"
                          >
                            {t.requests?.reject || "Từ chối"}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {req.status === 'APPROVED' && (
                            <div className="flex gap-1.5">
                              {/* Chỉ hiện nút Ship/Từ chối cấp độ Admin nếu nguồn là Kho Tổng. Nếu nguồn là Franchise khác, SM bên kia sẽ xử lý */}
                              {(!req.sourceLocationId || req.sourceLocationId === '00000000-0000-0000-0000-000000000000') ? (
                                <>
                                  <button
                                    onClick={() => onShip && onShip(req)}
                                    disabled={hasInsufficientStock(req)}
                                    className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all shadow-sm active:scale-95 ${hasInsufficientStock(req)
                                      ? 'bg-amber-50 text-amber-600 cursor-not-allowed border border-amber-200 font-bold'
                                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                                      }`}
                                    title={hasInsufficientStock(req) ? (t.requests?.insufficientStock || "Không đủ tồn kho") : ""}
                                  >
                                    {t.requests?.ship || "Xuất hàng"}
                                  </button>
                                  <button
                                    onClick={() => onReject && onReject(req)}
                                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-black uppercase rounded-lg transition-all active:scale-95"
                                  >
                                    {t.requests?.reject || "Từ chối"}
                                  </button>
                                </>
                              ) : (
                                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100 italic">
                                  {t.requests?.waitingFranchise || "Đang chờ đại lý xử lý"}
                                </span>
                              )}
                            </div>
                          )}
                          {req.status !== 'APPROVED' && (
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase inline-flex items-center gap-1.5 ${req.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse' :
                              req.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                req.status === 'SHIPPED' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                  req.status === 'RECEIVED' ? 'bg-green-50 text-green-600 border border-green-100' :
                                    req.status === 'REJECTED' ? 'bg-red-50 text-red-600 border border-red-100' :
                                      'bg-gray-50 text-gray-500'
                              }`}>
                              {isPending && <span className="size-1.5 rounded-full bg-amber-500 animate-ping" />}
                              {t.status?.[req.status?.toLowerCase()] || req.status}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {requests.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-400 font-bold text-sm">{t.requests?.empty || "Chưa có yêu cầu nhập nào"}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TransferManagement = ({ t, language, transfers = [], currentPage = 1, totalPages = 1, setPage, franchises = [], onShip, onReject, onReceive }) => {
  const getLocName = (id) => {
    if (id === '00000000-0000-0000-0000-000000000000' || !id) return t.overview?.mainWarehouseShort || 'Kho tổng';
    const f = franchises.find(f => f.id === id);
    return f ? f.name : (t.overview?.branchDefault || 'Đại lý');
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">{t.transfers?.code || "Mã điều chuyển"}</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">{t.transfers?.route || "Tuyến chuyển"}</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase text-center">{t.transfers?.status || "Trạng thái"}</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase text-right">{t.transfers?.details || "Chi tiết"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transfers.map(trn => (
                <tr key={trn.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="font-mono font-bold text-slate-900">{trn.transferCode}</div>
                    <div className="text-[10px] text-gray-400 mt-1 uppercase flex items-center gap-1">
                      <Clock size={10} /> {trn.createdAt ? new Date(trn.createdAt).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US') : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-bold text-slate-800">{getLocName(trn.fromLocationId)}</span>
                      <ArrowRight size={14} className="text-gray-300" />
                      <span className="font-bold text-slate-800">{getLocName(trn.toLocationId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    {!(
                      ((trn.status === 'PENDING' || trn.status === 'APPROVED') && trn.fromLocationId === '00000000-0000-0000-0000-000000000000') ||
                      (trn.status === 'IN_TRANSIT' && trn.toLocationId === '00000000-0000-0000-0000-000000000000')
                    ) && (
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${trn.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse' :
                          trn.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            trn.status === 'IN_TRANSIT' ? 'bg-blue-50 text-blue-600 border border-blue-100 transition-all' :
                              trn.status === 'COMPLETED' ? 'bg-green-50 text-green-600 border border-green-100' :
                                'bg-gray-50 text-gray-500'
                          }`}>
                          {t.status?.[trn.status?.toLowerCase()] || trn.status}
                        </span>
                      )}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex gap-1.5 justify-end items-center">
                      {(trn.status === 'PENDING' || trn.status === 'APPROVED') && trn.fromLocationId === '00000000-0000-0000-0000-000000000000' && (
                        <>
                          <button
                            onClick={() => onShip && onShip(trn)}
                            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase rounded-lg shadow-sm transition-all active:scale-95"
                          >
                            {t.requests?.ship || "Xuất hàng"}
                          </button>
                          <button
                            onClick={() => onReject && onReject(trn)}
                            className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-black uppercase rounded-lg transition-all"
                          >
                            {t.requests?.reject || "Từ chối"}
                          </button>
                        </>
                      )}
                      {trn.status === 'IN_TRANSIT' && trn.toLocationId === '00000000-0000-0000-0000-000000000000' && (
                        <button
                          onClick={() => onReceive && onReceive(trn.id)}
                          className="px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[10px] font-black uppercase rounded-lg shadow-sm"
                        >
                          {t.requests?.confirmReceipt || "Nhận hàng"}
                        </button>
                      )}
                      <div className="text-xs font-bold text-gray-400">
                        {(t.transfers?.itemsCount || "{count} vật tư").replace('{count}', trn.items?.length || 0)}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {transfers.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-400 font-bold text-sm">{t.transfers?.empty || "Chưa có lệnh điều chuyển nào"}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        setPage={setPage}
      />
    </div>
  );
};

const TransactionLog = ({ t, language, franchises = [] }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const fromISO = fromDate ? `${fromDate}T00:00:00Z` : null;
      const toISO = toDate ? `${toDate}T23:59:59Z` : null;
      const res = await getTransactions(null, fromISO, toISO, currentPage - 1, 10);
      // Gỡ bọc api format
      const dataPage = res && res.data ? res.data : res;
      if (dataPage && dataPage.content) {
        setTransactions(dataPage.content);
        setTotalPages(dataPage.totalPages || 1);
      } else {
        setTransactions([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Fetch transactions error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTransactions();
  }, [fromDate, toDate, currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [fromDate, toDate]);

  return (
    <div className="space-y-4">
      {/* Date Filters */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-3 text-slate-800">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-gray-100 text-slate-500 shadow-sm">
            <Calendar size={20} />
          </div>
          <div>
            <h4 className="font-black text-sm text-slate-900 leading-tight">{t.logs?.title || "Transaction History"}</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{t.logs?.subtitle || "Filter by date range"}</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col sm:flex-row gap-3 items-center w-full md:max-w-xl">
          <div className="relative flex-1 w-full">
            <input
              type="date"
              value={fromDate}
              onChange={e => {
                setFromDate(e.target.value);
                if (toDate && e.target.value > toDate) {
                  setToDate(e.target.value);
                }
              }}
              className="w-full pl-4 pr-12 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all cursor-pointer hover:bg-white"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-gray-400 pointer-events-none bg-white px-1.5 py-0.5 rounded-md border shadow-sm">{t.logs?.from || "From"}</div>
          </div>

          <span className="text-gray-300 font-black hidden sm:block">→</span>

          <div className="relative flex-1 w-full">
            <input
              type="date"
              value={toDate}
              min={fromDate}
              onChange={e => setToDate(e.target.value)}
              className="w-full pl-4 pr-12 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all cursor-pointer hover:bg-white"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-gray-400 pointer-events-none bg-white px-1.5 py-0.5 rounded-md border shadow-sm">{t.logs?.to || "To"}</div>
          </div>
        </div>

        {(fromDate || toDate) && (
          <button
            onClick={() => { setFromDate(''); setToDate(''); }}
            className="p-2.5 h-[42px] aspect-square rounded-xl bg-red-50 hover:bg-red-500 text-red-500 hover:text-white transition-all border border-red-100 flex items-center justify-center shadow-sm"
            title={t.logs?.clearFilter || "Clear Filter"}
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative min-h-[400px]">
        {isLoading ? (
          <LoadingSpinner t={t} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">{t.logs?.time || "Time"}</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">{t.logs?.branch || "Đại lý"}</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">{t.logs?.product || "Phân bón"}</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase text-center">{t.logs?.change || "Change"}</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase text-center">{t.logs?.balance || "Balance (Before/After)"}</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase text-right">{t.logs?.type || "Category"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US') : 'N/A'}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 uppercase">
                        <MapPin size={12} className="text-slate-300" /> {
                          (tx.locationId === '00000000-0000-0000-0000-000000000000' || !tx.locationId)
                            ? (t.overview?.mainWarehouseShort || 'Kho tổng')
                            : (franchises.find(f => String(f.id) === String(tx.locationId))?.name || (t.overview?.branchDefault || 'Đại lý'))
                        }
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-800 text-sm">{tx.productName || 'N/A'}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                        {tx.size && `${t.logs?.size || 'Size'}: ${tx.size}`} {tx.color && `| ${t.logs?.color || 'Color'}: ${tx.color}`}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-flex items-center gap-1 font-black px-2 py-1 rounded-lg text-xs ${(tx.changeQuantity || 0) > 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                        {(tx.changeQuantity || 0) > 0 ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />} {tx.changeQuantity}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs font-bold text-gray-400">{tx.beforeQuantity ?? 0}</span>
                        <span className="text-slate-300">→</span>
                        <span className="text-xs font-black text-slate-900">{tx.afterQuantity ?? 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right font-mono text-gray-400 text-xs uppercase">
                      {t.logs?.types?.[tx.type] || tx.type}
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-400 font-bold text-sm">{t.logs?.empty || "No transactions found"}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        setPage={setCurrentPage}
      />
    </div>
  );
};

// Removed local ImportStockModal in favor of shared component

const InventoryManagement = () => {
  const { language } = useLanguageStore();
  const { user } = useAuthStore();
  const fullT = translations[language] || translations.vi;
  const t = fullT.admin?.inventoryManagement || {};
  const catalogModalT = fullT.admin?.catalogModal || {};
  const [activeTab, setActiveTab] = useState('overview');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [isLoadingTransfers, setIsLoadingTransfers] = useState(false);
  const [locationFilter, setLocationFilter] = useState('ALL');


  // States cho Lệnh điều chuyển
  const [transfers, setTransfers] = useState([]);
  const [transfersCurrentPage, setTransfersCurrentPage] = useState(1);
  const [transfersTotalPages, setTransfersTotalPages] = useState(1);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const fetchRequests = async (silent = false) => {
    if (!silent) setIsLoadingRequests(true);
    try {
      const res = await getStockRequests();
      const list = Array.isArray(res) ? res : (res && res.data ? res.data : []);
      setRequests(list);
    } catch (error) {
      console.error("Fetch requests error:", error);
    } finally {
      if (!silent) setIsLoadingRequests(false);
    }
  };

  const locationFilterRef = React.useRef(locationFilter);
  React.useEffect(() => {
    locationFilterRef.current = locationFilter;
  }, [locationFilter]);

  // Real-time WebSocket connection
  React.useEffect(() => {
    if (USE_MOCK_API) {
      return;
    }

    const stompClient = new Client({
      brokerURL: `${ENV.BASE_URL.replace(/^http/, 'ws')}/api/inventory/ws-inventory`,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: function (str) { console.log('STOMP_DEBUG (Admin):', str); }
    });

    stompClient.onStompError = (frame) => {
      console.error('STOMP Error (Admin):', frame.headers['message'], frame.body);
    };

    stompClient.onWebSocketError = (event) => {
      console.error('STOMP WebSocket Error (Admin):', event);
    };

    stompClient.onWebSocketClose = (event) => {
      console.warn('STOMP WebSocket Closed (Admin):', event);
    };

    stompClient.onConnect = (frame) => {
      console.log('STOMP Connected to inventory-service:', frame);
      stompClient.subscribe('/topic/admin/notifications', (message) => {
        const notif = JSON.parse(message.body);
        console.log('Admin Socket Notification:', notif);

        if (notif.type === 'NEW_STOCK_REQUEST') {
          if (notif.payload) {
            setRequests(prev => {
              const newList = [notif.payload, ...prev];
              return newList.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));
            });
          }
        } else if (notif.payload && notif.payload.id) {
          setRequests(prev => prev.map(req => req.id === notif.payload.id ? { ...req, status: notif.payload.status, notes: notif.payload.notes } : req));
        }

        if (['STOCK_REQUEST_APPROVED', 'STOCK_REQUEST_SHIPPED', 'STOCK_REQUEST_REJECTED', 'STOCK_REQUEST_RECEIVED', 'STOCK_REQUEST_REJECTED_BY_SOURCE', 'NEW_STOCK_REQUEST'].includes(notif.type)) {
          if (window.adminRefreshTimer) clearTimeout(window.adminRefreshTimer);
          window.adminRefreshTimer = setTimeout(() => {
            fetchRequests(true);
            fetchTransfers(true);
          }, 500);
        } else if (['NEW_STOCK_TRANSFER', 'STOCK_TRANSFER_SHIPPED', 'STOCK_TRANSFER_COMPLETED', 'STOCK_TRANSFER_CANCELLED'].includes(notif.type)) {
          if (window.adminRefreshTimer) clearTimeout(window.adminRefreshTimer);
          window.adminRefreshTimer = setTimeout(() => {
            fetchRequests(true);
            fetchTransfers(true);
            const currentLoc = locationFilterRef.current;
            fetchStocks(currentLoc === 'ALL' ? null : currentLoc, true);
          }, 500);
        }
      });
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  React.useEffect(() => {
    if (activeTab === 'requests') {
      fetchRequests();
    }
  }, [activeTab]);

  const fetchTransfers = async (silent = false) => {
    if (!silent) setIsLoadingTransfers(true);
    try {
      const res = await getTransfers(transfersCurrentPage - 1, 10);
      const dataPage = res && res.data ? res.data : res;
      if (dataPage && dataPage.content) {
        setTransfers(dataPage.content);
        setTransfersTotalPages(dataPage.totalPages || 1);
      }
    } catch (error) {
      console.error("Fetch transfers error:", error);
    } finally {
      if (!silent) setIsLoadingTransfers(false);
    }
  };
  Stream:

  React.useEffect(() => {
    if (activeTab === 'transfers') {
      fetchTransfers();
    }
  }, [activeTab, transfersCurrentPage]);




  const fetchStocks = async (locationId = null, silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const res = await getStocks(locationId, false, 0, 100);
      const dataPage = res && res.data ? res.data : res;
      if (dataPage && dataPage.content) {
        const mapped = dataPage.content.map(s => ({
          id: `${s.productVariantId}-${s.locationId || 'system'}`,
          productVariantId: s.productVariantId,
          productName: s.productName
            ? `${s.productName} - ${s.color} - ${s.size}`
            : (t.requests?.productDefault || 'Phân bón') + ' ' + s.productVariantId.substring(0, 6).toUpperCase(),
          locationId: s.locationId,
          locationType: s.locationType,
          actual: s.quantity,
          reserved: s.reservedQuantity || 0,
          minStock: s.minStock || 10,
          sku: s.sku || `SKU-${s.productVariantId.substring(0, 6).toUpperCase()}`
        }));
        setStocks(mapped);
      }
    } catch (error) {
      console.error("Fetch stocks error:", error);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  const fetchFranchises = async () => {
    try {
      const res = await getAllFranchises();
      console.log("Franchise: ", res);
      const list = Array.isArray(res) ? res : (res && res.data ? res.data : []);
      setFranchises(list);
    } catch (error) {
      console.error("Fetch franchises error:", error);
    }
  };

  React.useEffect(() => {
    fetchFranchises();
    fetchRequests();
  }, []);

  React.useEffect(() => {
    if (activeTab === 'overview') {
      const fetchLocationId = locationFilter === 'ALL' ? null : locationFilter;
      fetchStocks(fetchLocationId);
    }
  }, [locationFilter, activeTab]);

  const handleImportSubmit = async ({ items, notes }) => {
    const userId = user ? user.id : null;

    try {
      await Promise.all(items.map(item => {
        return addInitialStock({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
          locationId: null,
          notes: notes,
          createdBy: userId
        });
      }));
      fetchStocks();
      fetchRequests(true);
    } catch (error) {
      console.error("Import fail:", error);
      throw error;
    }
  };

  const handleExportSubmit = async ({ items, notes, locationId }) => {
    const userId = user ? user.id : null;

    try {
      await createTransfer({
        fromLocationId: '00000000-0000-0000-0000-000000000000', // Kho Tổng
        toLocationId: locationId,
        type: 'WAREHOUSE_TO_FRANCHISE',
        notes: notes,
        createdBy: userId,
        items: items.map(i => ({
          productVariantId: i.productVariantId,
          quantity: i.quantity
        }))
      });
      if (activeTab === 'transfers') fetchTransfers();
      fetchStocks();
      fetchRequests(true);
    } catch (error) {
      console.error("Export fail:", error);
      throw error;
    }
  };

  const pendingRequestsCount = useMemo(() => requests.filter(r => r.status === 'PENDING').length, [requests]);
  const lowStockCount = useMemo(() => stocks.filter(s => s.actual <= s.minStock).length, [stocks]);

  const tabs = [
    { id: 'overview', label: t.tabs?.overview || 'Overview', icon: LayoutGrid },
    { id: 'requests', label: t.tabs?.requests || 'Yêu cầu nhập', icon: Inbox },
    { id: 'transfers', label: t.tabs?.transfers || 'Điều chuyển', icon: ArrowLeftRight },
    { id: 'tx', label: t.tabs?.logs || 'Logs', icon: History },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            {t.title || "System Inventory Management"}
          </h2>
          <p className="text-gray-500 text-sm">
            {t.subtitle || "Monitor, approve, and coordinate goods across all branches"}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 bg-[#1e293b] hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm"
          >
            <Plus size={18} /> {t.actions?.importWarehouse || "Nhập kho tổng"}
          </button>
        </div>
      </div>
      {/* Vùng Cảnh báo Tổng hợp (Alert Grid) */}
      {(lowStockCount > 0 || pendingRequestsCount > 0) && (
        <div className={`grid grid-cols-1 ${lowStockCount > 0 && pendingRequestsCount > 0 ? 'md:grid-cols-2' : ''} gap-4`}>
          <AnimatePresence>
            {lowStockCount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                className="bg-gradient-to-r from-red-50 via-rose-50/30 to-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between overflow-hidden shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 animate-bounce">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-red-900 text-sm">{t.alerts?.lowStockTitle || "Cảnh báo tồn kho thấp"}</h4>
                    <p className="text-red-700/70 text-[11px] font-bold italic">{(t.alerts?.lowStockDesc || "Có {count} vật tư ở mức cảnh báo.").replace('{count}', lowStockCount)}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setActiveTab('overview'); setShowLowStockOnly(true); }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
                >
                  {t.alerts?.viewNow || "View Now"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {pendingRequestsCount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                className="bg-gradient-to-r from-amber-50 via-orange-50/30 to-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between overflow-hidden shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 animate-bounce">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-amber-900 text-sm">{t.alerts?.pendingRequestsTitle || "Cần duyệt yêu cầu nhập"}</h4>
                    <p className="text-amber-700/80 text-[11px] font-bold">{(t.alerts?.pendingRequestsDesc || "Có {count} yêu cầu đang chờ duyệt.").replace('{count}', pendingRequestsCount)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('requests')}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  {t.alerts?.processNow || "Process Now"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}



      {/* Modern Tabs Switcher */}
      <div className="flex gap-1.5 p-1 bg-gray-100 rounded-2xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all relative ${activeTab === tab.id
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            <tab.icon size={18} /> {tab.label}
            {tab.id === 'requests' && pendingRequestsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-black text-[9px] size-4 rounded-full flex items-center justify-center animate-pulse shadow-sm shadow-amber-500/30 border border-white">
                {pendingRequestsCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Contextual Render with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {isLoading && <LoadingSpinner t={t} />}
          {!isLoading && activeTab === 'overview' && <InventoryOverview t={t} language={language} stocks={stocks} franchises={franchises} locationFilter={locationFilter} setLocationFilter={setLocationFilter} showLowStockOnly={showLowStockOnly} setShowLowStockOnly={setShowLowStockOnly} />}
          {activeTab === 'requests' && (
            isLoadingRequests ? <LoadingSpinner t={t} /> : (
              <RequestManagement
                t={t}
                language={language}
                requests={requests}
                franchises={franchises}
                onApprove={(req) => { setSelectedRequest(req); setIsApproveOpen(true); }}
                onReject={(req) => { setSelectedRequest(req); setRejectReason(""); setIsRejectOpen(true); }}
                onShip={async (req) => {
                  try {
                    await shipStockRequest(req.id, req.sourceLocationId);
                    fetchRequests(true);
                    fetchTransfers(true);
                  } catch (e) {
                    console.error(e);
                    window.alert((t.alerts?.shipError || "Lỗi xuất hàng: {error}").replace('{error}', (e.response?.data?.message || e.message)));
                  }
                }}
              />
            )
          )}
          {activeTab === 'transfers' && (
            isLoadingTransfers ? <LoadingSpinner t={t} /> : (
              <TransferManagement
                t={t}
                language={language}
                transfers={transfers}
                currentPage={transfersCurrentPage}
                totalPages={transfersTotalPages}
                setPage={setTransfersCurrentPage}
                franchises={franchises}
                onShip={async (req) => {
                  try {
                    await shipStockTransfer(req.id);
                    fetchRequests(true);
                    fetchTransfers(true);
                  } catch (e) {
                    console.error(e);
                  }
                }}
                onReject={async (req) => {
                  if (window.confirm(t.modals?.confirmReject || 'Are you sure?')) {
                    try {
                      await rejectStockRequest(req.id, "Từ chối từ tab điều chuyển");
                      fetchRequests(true);
                      fetchTransfers(true);
                    } catch (e) {
                      console.error(e);
                    }
                  }
                }}
                onReceive={async (id) => {
                  try {
                    await receiveStockRequest(id);
                    fetchRequests(true);
                    fetchTransfers(true);
                  } catch (e) {
                    console.error(e);
                  }
                }}
              />
            )
          )}
          {activeTab === 'tx' && <TransactionLog t={t} language={language} franchises={franchises} />}
        </motion.div>
      </AnimatePresence>

      <ProductCatalogModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title={t.modals?.importTitle || "Nhập kho tổng"}
        submitText={t.actions?.confirmImport || "Confirm Import"}
        onSubmit={handleImportSubmit}
        t={catalogModalT}
        initialItems={stocks
          .filter(s => s.actual <= s.minStock && (!s.locationId || s.locationId === '00000000-0000-0000-0000-000000000000'))
          .map(s => ({
            productVariantId: s.productVariantId,
            name: s.productName,
            quantity: 10
          }))
        }
      />

      <ProductCatalogModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        title={t.modals?.transferTitle || "Export / Transfer"}
        submitText={t.actions?.confirmExport || "Confirm Export"}
        showLocationPicker={true}
        locations={franchises}
        onSubmit={handleExportSubmit}
        t={catalogModalT}
      />

      {/* Approve Request Inner Modal */}
      <AnimatePresence>
        {isApproveOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-5"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-black text-xl text-slate-900 tracking-tight">{t.modals?.approveTitle || "Duyệt yêu cầu nhập"}</h3>
                <button onClick={() => setIsApproveOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
              </div>
              <div>
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1 block">{t.modals?.sourceLabel || "Select Supply Source"}</label>
                <select
                  id="sourceSelect"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                >
                  <option value="00000000-0000-0000-0000-000000000000">{t.overview?.mainWarehouse || "Kho tổng hệ thống"}</option>
                  {franchises.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setIsApproveOpen(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-slate-600 hover:bg-gray-50 transition-colors">{t.modals?.cancel || "Cancel"}</button>
                <button
                  onClick={async () => {
                    const sourceId = document.getElementById('sourceSelect').value;
                    try {
                      await approveStockRequest(selectedRequest.id, sourceId, user?.id);
                      setIsApproveOpen(false);
                      fetchRequests(true);
                    } catch (e) { console.error(e); }
                  }}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                >
                  {t.modals?.confirm || "Confirm"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isRejectOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-5"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-black text-xl text-slate-900 tracking-tight">{t.modals?.rejectTitle || "Từ chối yêu cầu"}</h3>
                <button onClick={() => setIsRejectOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
              </div>
              <div>
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1 block text-red-500">{t.modals?.reasonLabel || "Reason for rejection (optional)"}</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder={t.modals?.reasonPlaceholder || "Enter reason here..."}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/5 transition-all resize-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setIsRejectOpen(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-slate-600 hover:bg-gray-50 transition-colors">{t.modals?.cancel || "Cancel"}</button>
                <button
                  onClick={async () => {
                    try {
                      await rejectStockRequest(selectedRequest.id, rejectReason);
                      setIsRejectOpen(false);
                      fetchRequests(true);
                    } catch (e) { console.error(e); }
                  }}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black shadow-lg shadow-red-600/20 transition-all active:scale-95"
                >
                  {t.modals?.confirm || "Confirm"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InventoryManagement;
