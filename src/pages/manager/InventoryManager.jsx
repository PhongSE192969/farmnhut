import React, { useState, useMemo } from "react";
import {
  Search,
  AlertTriangle,
  History,
  MapPin,
  LayoutDashboard,
  Package,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  X,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguageStore, useAuthStore } from "@/stores";
import { translations } from "@/locales";
import {
  addInitialStock,
  getStocks,
  getTransactions,
  createTransfer,
} from "@/services/inventoryService";
import { getAllFranchises } from "@/services/franchiseService";
import ProductCatalogModal from "@/components/modal/ProductCatalogModal";
import PaginationControls from "@/components/ui/PaginationControls";

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

// --- Sub-components ---
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
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider text-center">{t.table?.actual || "Thực tế"}</th>
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

const TransactionLog = ({ t, language, franchises = [] }) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const fromISO = fromDate ? `${fromDate}T00:00:00Z` : null;
      const toISO = toDate ? `${toDate}T23:59:59Z` : null;
      const res = await getTransactions(
        null,
        fromISO,
        toISO,
        currentPage - 1,
        10
      );
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
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-3 text-slate-800">
          <div className="p-2.5 rounded-xl bg-slate-50 border text-slate-500 shadow-sm">
            <Calendar size={20} />
          </div>
          <div>
            <h4 className="font-black text-sm text-slate-900 leading-tight">{t.logs?.title || "Lịch sử giao dịch kho"}</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{t.logs?.subtitle || "Lọc theo khoảng ngày"}</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col sm:flex-row gap-3 items-center w-full md:max-w-xl">
          <div className="relative flex-1 w-full">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                if (toDate && e.target.value > toDate)
                  setToDate(e.target.value);
              }}
              className="w-full pl-4 pr-12 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-bold text-slate-700"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black pointer-events-none bg-white px-1.5 py-0.5 rounded border shadow-sm">{t.logs?.from || "Từ"}</div>
          </div>
          <span className="text-gray-300 font-black hidden sm:block">→</span>
          <div className="relative flex-1 w-full">
            <input
              type="date"
              value={toDate}
              min={fromDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full pl-4 pr-12 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-bold text-slate-700"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black pointer-events-none bg-white px-1.5 py-0.5 rounded border shadow-sm">{t.logs?.to || "Đến"}</div>
          </div>
        </div>
        {(fromDate || toDate) && (
          <button
            onClick={() => {
              setFromDate("");
              setToDate("");
            }}
            className="p-2.5 rounded-xl bg-red-50 hover:bg-red-500 text-red-500 hover:text-white transition-all border flex items-center justify-center shadow-sm"
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
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">{t.logs?.time || "Thời gian"}</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">{t.logs?.branch || "Đại lý"}</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">{t.logs?.product || "Phân bón"}</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase text-center">{t.logs?.change || "Thay đổi"}</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase text-center">{t.logs?.balance || "Tồn trước/sau"}</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase text-right">{t.logs?.type || "Loại"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase">
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
                      <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                        {tx.size && `${t.logs?.size || 'Quy cách'}: ${tx.size}`} {tx.color && `| ${t.logs?.color || 'Phân loại'}: ${tx.color}`}
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
                    <td colSpan="5" className="text-center py-10 text-gray-400 font-bold text-sm">{t.logs?.empty || "Chưa có giao dịch kho"}</td>
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

const InventoryManager = () => {
  const { language } = useLanguageStore();
  const { user } = useAuthStore();
  const t =
    (translations[language] || translations.vi).admin?.inventoryManagement ||
    {};
  const [activeTab, setActiveTab] = useState("overview");
  const [stocks, setStocks] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const fetchStocks = async (locationId = null) => {
    setIsLoading(true);
    try {
      const res = await getStocks(locationId, false, 0, 100);
      const dataPage = res && res.data ? res.data : res;
      if (dataPage && dataPage.content) {
        const mapped = dataPage.content.map((s) => ({
          id: `${s.productVariantId}-${s.locationId || 'system'}`,
          productVariantId: s.productVariantId,
          productName: s.productName
            ? `${s.productName} - ${s.color} - ${s.size}`
            : "Phân bón " + s.productVariantId.substring(0, 6).toUpperCase(),
          locationId: s.locationId,
          locationType: s.locationType,
          actual: s.quantity,
          reserved: s.reservedQuantity || 0,
          minStock: s.minStock || 10,
          sku:
            s.sku || `SKU-${s.productVariantId.substring(0, 6).toUpperCase()}`,
        }));
        setStocks(mapped);
      }
    } catch (error) {
      console.error("Fetch stocks error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFranchises = async () => {
    try {
      const res = await getAllFranchises();
      const list = Array.isArray(res) ? res : res && res.data ? res.data : [];
      setFranchises(list);
    } catch (error) {
      console.error("Fetch franchises error:", error);
    }
  };

  React.useEffect(() => {
    fetchFranchises();
  }, []);
  React.useEffect(() => {
    const fetchLocationId = locationFilter === "ALL" ? null : locationFilter;
    fetchStocks(fetchLocationId);
  }, [locationFilter]);

  const handleImportSubmit = async ({ items, notes }) => {
    const userId = user ? user.id : null;
    try {
      await Promise.all(
        items.map((item) => {
          return addInitialStock({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            locationId: null,
            notes: notes,
            createdBy: userId,
          });
        })
      );
      fetchStocks();
    } catch (error) {
      console.error("Import fail:", error);
      throw error;
    }
  };

  const handleExportSubmit = async ({ items, notes, locationId }) => {
    const userId = user ? user.id : null;
    try {
      await createTransfer({
        fromLocationId: "00000000-0000-0000-0000-000000000000",
        toLocationId: locationId,
        type: "WAREHOUSE_TO_FRANCHISE",
        notes: notes,
        createdBy: userId,
        items: items.map((i) => ({
          productVariantId: i.productVariantId,
          quantity: i.quantity,
        })),
      });
      fetchStocks();
    } catch (error) {
      console.error("Export fail:", error);
      throw error;
    }
  };

  const lowStockCount = useMemo(
    () => stocks.filter((s) => s.actual <= s.minStock).length,
    [stocks]
  );

  const tabs = [
    {
      id: "overview",
      label: t.tabs?.overview || "Tổng quan tồn kho",
      icon: LayoutDashboard,
    },
    { id: "tx", label: t.tabs?.logs || "Nhật ký giao dịch", icon: History },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            {t.title || "Quản lý Kho"}
          </h2>
          <p className="text-gray-500 text-sm">
            {t.subtitle || "Theo dõi mức độ tồn kho và lịch sử giao dịch tổng thể"}
          </p>
        </div>
        <div className="flex gap-3">
        </div>
      </div>

      {lowStockCount > 0 && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-gradient-to-r from-red-50 via-rose-50/30 to-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between overflow-hidden shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 animate-bounce">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="font-black text-red-900 text-sm">
                  {t.alerts?.lowStockTitle || "Cảnh báo tồn kho thấp"}
                </h4>
                <p className="text-red-700/70 text-[11px] font-bold">
                  {(t.alerts?.lowStockDesc || "Có {count} vật tư ở mức cảnh báo.").replace('{count}', lowStockCount)}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveTab("overview");
                setShowLowStockOnly(true);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase"
            >
              {t.alerts?.viewNow || "Xem ngay"}
            </button>
          </motion.div>
        </AnimatePresence>
      )}

      <div className="flex gap-1.5 p-1 bg-gray-100 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id
                ? "bg-white text-slate-900 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="mt-4"
        >
          {isLoading && <LoadingSpinner t={t} />}
          {!isLoading && activeTab === "overview" && (
            <InventoryOverview
              t={t}
              language={language}
              stocks={stocks}
              franchises={franchises}
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              showLowStockOnly={showLowStockOnly}
              setShowLowStockOnly={setShowLowStockOnly}
            />
          )}
          {activeTab === "tx" && <TransactionLog t={t} language={language} franchises={franchises} />}
        </motion.div>
      </AnimatePresence>

    </div>
  );
};

export default InventoryManager;
