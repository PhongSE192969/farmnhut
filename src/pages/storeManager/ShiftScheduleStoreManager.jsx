// src/pages/storeManager/ShiftScheduleStoreManager.jsx
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  Clock,
  AlertCircle,
  Plus,
  Search,
  Edit2,
  Trash2,
  UserCheck,
  Timer,
  Info,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  HelpCircle,
} from "lucide-react";
import useShiftStore from "@/stores/shiftStore";
import { useSSE } from "@/hooks/useSSE";
import { ENDPOINTS } from "@/config/api";
import ShiftModal from "@/components/modal/ShiftModal";
import toast from "react-hot-toast";

// ── Enums từ BE ──
import { useLanguageStore } from "@/stores";
import { translations } from "@/locales";
import { useAuthStore } from "@/stores/authStore";

// Trạng thái KHÔNG thể chỉnh sửa (Bỏ ABSENT ra để cho phép sửa lại)
const TERMINAL_STATUSES = ["CHECKED_OUT", "INCOMPLETE"];

// ── Helper lấy ngày hôm nay dạng local YYYY-MM-DD (không dùng UTC) ──
const getLocalTodayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// ── Confirmation Dialog Component ──
const ConfirmDialog = ({
  open,
  title,
  message,
  confirmText,
  confirmColor,
  icon: Icon,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-4 animate-[fadeInScale_0.18s_ease]"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "fadeInScale 0.18s ease" }}
      >
        <style>{`@keyframes fadeInScale{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}`}</style>
        <div
          className={`size-14 rounded-2xl flex items-center justify-center ${confirmColor === "red" ? "bg-red-50" : confirmColor === "amber" ? "bg-amber-50" : "bg-blue-50"}`}
        >
          {Icon ? (
            <Icon
              size={28}
              className={
                confirmColor === "red"
                  ? "text-red-500"
                  : confirmColor === "amber"
                    ? "text-amber-500"
                    : "text-blue-500"
              }
            />
          ) : (
            <HelpCircle size={28} className="text-blue-500" />
          )}
        </div>
        <div className="text-center">
          <div className="font-black text-slate-900 text-base mb-1">
            {title}
          </div>
          <div className="text-sm text-gray-500 leading-relaxed">{message}</div>
        </div>
        <div className="flex gap-3 w-full mt-1">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Huỷ
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-colors ${
              confirmColor === "red"
                ? "bg-red-500 hover:bg-red-600"
                : confirmColor === "amber"
                  ? "bg-amber-500 hover:bg-amber-600"
                  : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {confirmText || "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Removed unused getName and getPhone
const getDate = (r) => r.workDate || r.work_date || "";
const getShift = (r) => r.shiftName || r.shift_name || r.name || "—";
const getStart = (r) =>
  String(r.shiftStartTime || r.startTime || r.start_time || "").slice(0, 5);
const getEnd = (r) =>
  String(r.shiftEndTime || r.endTime || r.end_time || "").slice(0, 5);

const getEffectiveStatus = (row) => {
  if (row.status === "ASSIGNED") {
    const workDate = getDate(row);
    const start = getStart(row);
    if (workDate && start) {
      const shiftDateTime = new Date(`${workDate}T${start}:00`);
      if ((new Date() - shiftDateTime) / 60000 > 30) return "ABSENT";
    }
  }
  return row.status;
};

const fmtDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return d;
  }
};

const fmtTime = (r) => {
  const s = getStart(r),
    e = getEnd(r);
  return s && e ? `${s} - ${e}` : s || e || "—";
};

const fmtDuration = (r) => {
  const s = getStart(r),
    e = getEnd(r);
  if (!s || !e) return "";
  const [sh, sm] = s.split(":").map(Number);
  const [eh, em] = e.split(":").map(Number);
  const d = eh * 60 + em - (sh * 60 + sm);
  const mins = d > 0 ? d : d + 1440;
  return mins % 60
    ? `${Math.floor(mins / 60)}h${mins % 60}m`
    : `${Math.floor(mins / 60)} giờ`;
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  subtext,
  color,
  bg,
  onClick,
  isActive,
}) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-300 cursor-pointer ${
      isActive ? "ring-2 ring-[#d9a13b] bg-amber-50" : "hover:bg-gray-50"
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`size-11 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0`}
      >
        {Icon && <Icon size={20} />}
      </div>
      <div>
        <div className="text-2xl font-black text-slate-900">{value}</div>
        <div className="text-xs text-gray-500 font-medium">{label}</div>
      </div>
    </div>
    {subtext && (
      <div className="mt-3 text-[11px] text-gray-400 font-semibold">
        {subtext}
      </div>
    )}
  </div>
);

const CW = {
  staff: "22%",
  type: "12%",
  date: "12%",
  time: "17%",
  status: "24%",
  actions: "9%",
};

export default function ShiftScheduleStoreManager() {
  const {
    schedule,
    loading,
    actionLoading,
    fetchSchedule,
    createShift,
    updateShift,
    deleteShift,
    checkIn,
    checkOut,
    markAbsent,
  } = useShiftStore();

  const { user } = useAuthStore();
  const franchiseId = useMemo(
    () =>
      user?.franchiseId ||
      user?.franchise?.id ||
      localStorage.getItem("franchiseId"),
    [user],
  );
  const { language } = useLanguageStore();
  const t =
    (translations[language] || translations.vi).manager?.shiftSchedule || {};
  const tc = t.confirm || {}; // shorthand for confirm dialog strings

  const STATUS_LABELS = {
    ASSIGNED: t.status?.ASSIGNED || "Đã phân công",
    CHECKED_IN: t.status?.CHECKED_IN || "Đang làm việc",
    CHECKED_OUT: t.status?.CHECKED_OUT || "Đã kết thúc",
    ABSENT: t.status?.ABSENT || "Vắng mặt",
    INCOMPLETE: t.status?.INCOMPLETE || "Quên check-out",
  };

  const STATUS_STYLES = {
    ASSIGNED: "bg-slate-100  text-slate-600  border-slate-200",
    CHECKED_IN: "bg-blue-50    text-blue-600   border-blue-200",
    CHECKED_OUT: "bg-green-50   text-green-600  border-green-200",
    ABSENT: "bg-red-50     text-red-500    border-red-200",
    INCOMPLETE: "bg-yellow-50  text-yellow-600 border-yellow-200",
  };

  const SELECTABLE_STATUSES = [
    ["ASSIGNED", t.status?.ASSIGNED || "Đã phân công"],
    ["CHECKED_IN", t.status?.CHECKED_IN || "Đang làm việc"],
    ["CHECKED_OUT", t.status?.CHECKED_OUT || "Đã kết thúc"],
    ["ABSENT", t.status?.ABSENT || "Vắng mặt"],
  ];

  const ALL_STATUSES = [
    ["ASSIGNED", t.status?.ASSIGNED || "Đã phân công"],
    ["CHECKED_IN", t.status?.CHECKED_IN || "Đang làm việc"],
    ["CHECKED_OUT", t.status?.CHECKED_OUT || "Đã kết thúc"],
    ["ABSENT", t.status?.ABSENT || "Vắng mặt"],
    ["INCOMPLETE", t.status?.INCOMPLETE || "Quên check-out"],
  ];

  // Dịch tên loại ca sang ngôn ngữ hiện tại
  const getShiftLabel = (shiftName) => {
    if (!shiftName) return "—";
    if (shiftName === "Ca sáng") return t.filters?.morning || shiftName;
    if (shiftName === "Ca chiều") return t.filters?.afternoon || shiftName;
    if (shiftName === "Ca tối") return t.filters?.evening || shiftName;
    return shiftName;
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [localStatuses, setLocalStatuses] = useState({});
  const [statFilter, setStatFilter] = useState("All");
  const [confirmDialog, setConfirmDialog] = useState(null); // { title, message, icon, confirmColor, confirmText, onConfirm }

  // ── Date handling ── (dùng local time, tránh sai ngày do UTC)
  const [selectedDate, setSelectedDate] = useState(getLocalTodayStr);
  const [viewMode, setViewMode] = useState("day");
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d);
    monday.setDate(diff);
    return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;
  });

  // ── Hôm nay theo local time, cập nhật mỗi phút ──
  const [todayStr, setTodayStr] = useState(getLocalTodayStr);
  const prevTodayRef = useRef(todayStr);

  useEffect(() => {
    const tick = () => {
      const currentToday = getLocalTodayStr();
      setTodayStr(currentToday);
    };
    const id = setInterval(tick, 60_000); // cập nhật mỗi 1 phút
    return () => clearInterval(id);
  }, []);

  // ✅ Tự động chuyển ngày khi vừa qua midnight (nếu đang ở ngày hôm nay)
  useEffect(() => {
    if (
      selectedDate === prevTodayRef.current &&
      todayStr !== prevTodayRef.current
    ) {
      console.log(
        "🌓 Midnight passed! Updating selectedDate from",
        prevTodayRef.current,
        "to",
        todayStr,
      );
      setSelectedDate(todayStr);
    }
    prevTodayRef.current = todayStr;
  }, [todayStr, selectedDate]);

  // State để lưu thông tin nhân viên từ API
  const [staffMap, setStaffMap] = useState({});

  // ── AbortController để hủy request cũ ──
  const abortControllerRef = useRef(null);

  // ── Fetch thông tin nhân viên từ API ──
  const fetchStaffInfo = useCallback(
    async (staffIds) => {
      if (!staffIds.length) return;
      const newMap = { ...staffMap };

      try {
        const payload = {
          role: "STAFF",
          status: "ACTIVE",
          size: 50,
        };

        const { SearchUsers } = await import("@/services/userService");
        const res = await SearchUsers(payload);

        const content = res?.data || res?.content || [];
        const staffList = Array.isArray(content) ? content : [];

        staffList.forEach((staff) => {
          // Chỉ map những nhân viên ACTIVE và thuộc về đúng franchise quản lý
          if (
            staff?.status === "ACTIVE" &&
            (staff?.franchiseId === franchiseId ||
              staff?.franchise?.id === franchiseId)
          ) {
            newMap[staff.id] = {
              name: staff.fullName || staff.username || "Unknown",
              phone: staff.phone || "",
            };
          }
        });
      } catch (error) {
        console.error("Error fetching staff info:", error);
      } finally {
        staffIds.forEach((id) => {
          if (!newMap[id]) {
            newMap[id] = { name: id.slice(0, 8) + "...", phone: "" };
          }
        });
        setStaffMap(newMap);
      }
    },
    [staffMap, franchiseId],
  );

  // ── Khi schedule thay đổi, lấy thông tin nhân viên ──
  useEffect(() => {
    const staffIds = schedule
      .map((r) => r.staffId)
      .filter((id) => id && !staffMap[id] && id !== "—")
      .filter((v, i, a) => a.indexOf(v) === i); // unique

    if (staffIds.length > 0) {
      fetchStaffInfo(staffIds);
    }
  }, [schedule, staffMap, fetchStaffInfo]);

  // ── Helper lấy tên nhân viên ──
  const getStaffDisplay = useCallback(
    (row) => {
      // Nếu API đã trả về tên thì dùng
      if (row.staffName && row.staffName !== row.staffId) {
        return {
          name: row.staffName,
          phone: row.staffPhone || row.contact || "",
        };
      }

      // Nếu có staffId, tra trong map
      if (row.staffId && staffMap[row.staffId]) {
        return staffMap[row.staffId];
      }

      // Fallback: hiển thị ID rút gọn
      return {
        name: row.staffId ? row.staffId.slice(0, 8) + "..." : "—",
        phone: "",
      };
    },
    [staffMap],
  );

  // ── Fetch data ổn định ──
  const fetchDataStable = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      if (viewMode === "day") {
        await fetchSchedule(selectedDate);
      } else if (viewMode === "week") {
        const dates = [];
        const start = new Date(weekStart);
        for (let i = 0; i < 7; i++) {
          const date = new Date(start);
          date.setDate(start.getDate() + i);
          dates.push(date.toISOString().split("T")[0]);
        }
        dates.forEach((date) => fetchSchedule(date));
      } else if (viewMode === "month") {
        const year = parseInt(selectedDate.slice(0, 4));
        const month = parseInt(selectedDate.slice(5, 7));
        const daysInMonth = new Date(year, month, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
          const date = `${selectedDate.slice(0, 7)}-${String(i).padStart(2, "0")}`;
          fetchSchedule(date);
        }
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Request bị hủy");
      } else {
        console.error("Fetch error:", error);
      }
    }
  }, [fetchSchedule, selectedDate, viewMode, weekStart]);

  useEffect(() => {
    if (franchiseId) {
      fetchDataStable();
    }
  }, [selectedDate, viewMode, weekStart, fetchDataStable, franchiseId]);

  // ── Realtime SSE ──
  const { data: realtimeData } = useSSE(ENDPOINTS.PROTECTED.SHIFTS.events);

  useEffect(() => {
    if (!realtimeData) return;

    console.log("📡 Realtime Shift update received:", realtimeData);

    const { type, data: eventData, shiftId } = realtimeData;

    // Hàm merge - GIỮ NGUYÊN dữ liệu cũ và chuẩn hóa
    const mergeShift = (oldShift, newData) => {
      const normalizedData = {
        ...newData,
        shiftStartTime: newData.shiftStartTime || newData.startTime,
        shiftEndTime: newData.shiftEndTime || newData.endTime,
        shiftName: newData.shiftName || newData.name,
      };

      if (!oldShift) return normalizedData;

      // Explicitly protect these 3 fields by falling back to oldShift if newData has them as null/undefined
      return {
        ...oldShift, // Giữ tất cả dữ liệu cũ
        ...normalizedData, // Ghi đè status, note, checkInTime, checkOutTime, BUT...
        shiftName:
          normalizedData.shiftName ||
          oldShift.shiftName ||
          oldShift.shift_name ||
          oldShift.name,
        shiftStartTime:
          normalizedData.shiftStartTime ||
          oldShift.shiftStartTime ||
          oldShift.startTime,
        shiftEndTime:
          normalizedData.shiftEndTime ||
          oldShift.shiftEndTime ||
          oldShift.endTime,
      };
    };

    // 1. Xóa shift config
    if (type === "SHIFT_DELETED" && shiftId) {
      useShiftStore.setState((state) => ({
        schedule: state.schedule.filter((s) => s.shiftConfigId !== shiftId),
      }));
      toast.success("Đã xóa ca làm việc");
    }
    // 2. Tạo shift config mới
    else if (type === "SHIFT_CREATED" && eventData) {
      console.log("New shift config created:", eventData);
      fetchDataStable();
    }
    // 3. Assign shift hoặc Update shift configuration/assignment
    else if (
      (type === "SHIFT_UPDATED" ||
        type === "ASSIGN_SHIFT" ||
        type === "UPDATE_ASSIGNMENT") &&
      (eventData || shiftId || realtimeData?.assignmentId)
    ) {
      console.log(
        "🔄 Shift/Assignment/Staff update received:",
        type,
        eventData?.id || shiftId || realtimeData?.assignmentId,
      );
      fetchDataStable();
      if (type === "ASSIGN_SHIFT" || type === "UPDATE_ASSIGNMENT")
        toast.success("Đã nhận cập nhật phân ca");
    }
    // 4. Cập nhật attendance (check-in/out)
    else if (type === "ATTENDANCE_UPDATED" && eventData) {
      useShiftStore.setState((state) => ({
        schedule: state.schedule.map((s) =>
          s.id === eventData.id ? mergeShift(s, eventData) : s,
        ),
      }));
      if (eventData.status === "CHECKED_IN")
        toast.success("Check-in thành công!");
      else if (eventData.status === "CHECKED_OUT")
        toast.success("Check-out thành công!");
    }
    // 5. MARK_ABSENT - QUAN TRỌNG: giữ nguyên shiftName, shiftStartTime, shiftEndTime
    else if (type === "MARK_ABSENT" && eventData) {
      useShiftStore.setState((state) => ({
        schedule: state.schedule.map((s) => {
          if (s.id === eventData.id) {
            console.log("🔄 Updating shift:", s.id, "status to ABSENT");
            return mergeShift(s, eventData);
          }
          return s;
        }),
      }));
      toast.success("Đã đánh dấu vắng mặt");
    }
    // 7. Fallback: mảng dữ liệu
    else if (Array.isArray(realtimeData)) {
      useShiftStore.setState((state) => {
        const existingMap = new Map(
          state.schedule.map((item) => [item.id, item]),
        );
        const userFranchiseId = franchiseId;

        realtimeData.forEach((item) => {
          if (item?.id) {
            // ✅ CHỈ xử lý nếu shift thuộc về franchise hiện tại
            if (
              item.franchiseId &&
              userFranchiseId &&
              item.franchiseId !== userFranchiseId
            )
              return;

            const existing = existingMap.get(item.id);
            existingMap.set(
              item.id,
              existing ? mergeShift(existing, item) : item,
            );
          }
        });
        return { schedule: Array.from(existingMap.values()) };
      });
    }
  }, [realtimeData, fetchDataStable, franchiseId]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    setLocalStatuses({});
  }, [schedule]);

  // ── Stats ──
  const stats = useMemo(() => {
    let filteredSchedule = schedule;
    if (viewMode === "day") {
      filteredSchedule = schedule.filter((r) => getDate(r) === selectedDate);
    } else if (viewMode === "week") {
      const startTime = new Date(weekStart).getTime();
      const endTime = startTime + 6 * 24 * 60 * 60 * 1000;
      filteredSchedule = schedule.filter((r) => {
        const dateTime = new Date(getDate(r)).getTime();
        return dateTime >= startTime && dateTime <= endTime;
      });
    } else if (viewMode === "month") {
      const monthPrefix = selectedDate.slice(0, 7);
      filteredSchedule = schedule.filter((r) =>
        getDate(r).startsWith(monthPrefix),
      );
    }

    return {
      total: filteredSchedule.length,
      checkedIn: filteredSchedule.filter(
        (r) => (localStatuses[r.id] ?? getEffectiveStatus(r)) === "CHECKED_IN",
      ).length,
      assigned: filteredSchedule.filter(
        (r) => (localStatuses[r.id] ?? getEffectiveStatus(r)) === "ASSIGNED",
      ).length,
      absent: filteredSchedule.filter(
        (r) => (localStatuses[r.id] ?? getEffectiveStatus(r)) === "ABSENT",
      ).length,
      incomplete: filteredSchedule.filter(
        (r) => (localStatuses[r.id] ?? getEffectiveStatus(r)) === "INCOMPLETE",
      ).length,
    };
  }, [schedule, localStatuses, viewMode, selectedDate, weekStart]);

  // ── Filtered rows ──
  const filtered = useMemo(() => {
    let filteredSchedule = schedule;

    if (viewMode === "day") {
      filteredSchedule = schedule.filter((r) => getDate(r) === selectedDate);
    } else if (viewMode === "week") {
      const startTime = new Date(weekStart).getTime();
      const endTime = startTime + 6 * 24 * 60 * 60 * 1000;
      filteredSchedule = schedule.filter((r) => {
        const dateTime = new Date(getDate(r)).getTime();
        return dateTime >= startTime && dateTime <= endTime;
      });
    } else if (viewMode === "month") {
      const monthPrefix = selectedDate.slice(0, 7);
      filteredSchedule = schedule.filter((r) =>
        getDate(r).startsWith(monthPrefix),
      );
    }

    return filteredSchedule
      .filter((r) => {
        const staffInfo = getStaffDisplay(r);
        const nm = staffInfo.name.toLowerCase();
        const cs = localStatuses[r.id] ?? getEffectiveStatus(r);
        const shiftName = getShift(r);

        const matchesSearch =
          !searchTerm || nm.includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === "All" || shiftName === typeFilter;
        const matchesStatus = statusFilter === "All" || cs === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = new Date(getDate(a)).getTime() || 0;
        const dateB = new Date(getDate(b)).getTime() || 0;
        if (dateB !== dateA) return dateB - dateA; // Mới nhất lên đầu

        const startA = getStart(a) || "";
        const startB = getStart(b) || "";
        return startA.localeCompare(startB); // Sớm nhất lên đầu nếu cùng ngày
      });
  }, [
    schedule,
    searchTerm,
    typeFilter,
    statusFilter,
    localStatuses,
    viewMode,
    selectedDate,
    weekStart,
    getStaffDisplay,
  ]);

  // ── Week navigation ──
  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d.toISOString().split("T")[0]);
  };

  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d.toISOString().split("T")[0]);
  };

  const weekRange = () => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return `${start.toLocaleDateString("vi-VN")} - ${end.toLocaleDateString("vi-VN")}`;
  };

  // ── Modal handlers ──
  const handleOpenAdd = () => {
    setEditingRow(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (row) => {
    const staffInfo = getStaffDisplay(row);
    setEditingRow({
      assignmentId: row.id,
      shiftConfigId: row.shiftConfigId,
      shiftType: getShift(row),
      startTime: getStart(row),
      endTime: getEnd(row),
      branch: row.branch || "",
      staffId: row.staffId ? String(row.staffId) : "",
      staffName: staffInfo.name,
      staffPhone: staffInfo.phone,
      workDate: getDate(row) || selectedDate,
    });
    setModalOpen(true);
  };

  const handleSave = async (payload) => {
    try {
      const targetFranchiseId =
        franchiseId || "e263732e-1a68-45ea-8c28-4f55105948a9";

      // Kiểm tra không cho phép TẠO ca trong quá khứ
      if (!payload.assignmentId) {
        const now = new Date();
        const shiftStartDateTime = new Date(
          `${payload.workDate}T${payload.startTime}:00`,
        );
        if (shiftStartDateTime < now) {
          toast.error(
            t.warnings?.pastShift ||
              "Không thể tạo ca cho khoảng thời gian trong quá khứ!",
          );
          return;
        }
      }

      if (payload.assignmentId) {
        await updateShift(payload.assignmentId, payload.shiftConfigId, {
          ...payload,
          franchiseId: targetFranchiseId,
        });
      } else {
        await createShift({ ...payload, franchiseId: targetFranchiseId });
      }
      setModalOpen(false);

      if (viewMode === "day") {
        await fetchSchedule(selectedDate);
      } else if (viewMode === "week") {
        const dates = [];
        const start = new Date(weekStart);
        for (let i = 0; i < 7; i++) {
          const date = new Date(start);
          date.setDate(start.getDate() + i);
          dates.push(date.toISOString().split("T")[0]);
        }
        await Promise.all(dates.map((date) => fetchSchedule(date)));
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleDelete = (row) => {
    const staffInfo = getStaffDisplay(row);
    setConfirmDialog({
      title: tc.deleteTitle || "Xác nhận xoá ca làm việc",
      message: (
        tc.deleteMsg ||
        'Bạn có chắc muốn xoá ca "{shift}" của {name}?\nHành động này không thể hoàn tác.'
      )
        .replace("{shift}", getShift(row))
        .replace("{name}", staffInfo.name),
      icon: Trash2,
      confirmColor: "red",
      confirmText: tc.deleteBtn || "Xoá ca",
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          await deleteShift(row.id, row.shiftConfigId);
          toast.success(tc.successDelete || "Đã xoá ca thành công");
        } catch (error) {
          console.error("Delete error:", error);
          toast.error(tc.failDelete || "Xoá ca thất bại");
        }
      },
    });
  };

  const handleStatusChange = (row, newStatus) => {
    const currentStatus = localStatuses[row.id] ?? getEffectiveStatus(row);
    if (TERMINAL_STATUSES.includes(currentStatus)) return;

    // Không cho phép đổi từ Vắng mặt sang Đã phân công
    if (currentStatus === "ABSENT" && newStatus === "ASSIGNED") {
      toast.error(
        tc.absentCannotReset || "Không thể hoàn tác trạng thái Vắng mặt.",
      );
      return;
    }

    const shiftDate = getDate(row);
    const now = new Date();
    const startTime = getStart(row);
    const endTime = getEnd(row);

    // Chỉ cho phép sửa trong ngày làm
    if (shiftDate !== todayStr) {
      toast.error(
        t.confirm?.onlyToday ||
          "Chỉ được đổi trạng thái trong ngày ca làm việc.",
      );
      return;
    }

    const shiftStart = startTime
      ? new Date(`${shiftDate}T${startTime}:00`)
      : null;
    const shiftEnd = endTime ? new Date(`${shiftDate}T${endTime}:00`) : null;

    // Chưa tới giờ bắt đầu ca → chỉ cho phép reset về Đã phân công (từ Vắng mặt), không cho check-in/out
    if (shiftStart && now < shiftStart) {
      if (newStatus === "CHECKED_IN" || newStatus === "CHECKED_OUT") {
        const diff = Math.round((shiftStart - now) / 60000);
        const h = Math.floor(diff / 60),
          m = diff % 60;
        const timeLeft = h > 0 ? `${h}h${m}m` : `${m}m`;
        const msg = (
          t.confirm?.notStartedYet ||
          "Ca chưa bắt đầu! Còn {time} nữa mới tới giờ ({start})."
        )
          .replace("{time}", timeLeft)
          .replace("{start}", startTime);
        toast.error(msg);
        return;
      }
      // Được phép đổi ABSENT → ASSIGNED trước giờ ca – cho phép
    }

    // Đã qua giờ kết thúc → không cho chuyển về Đã phân công / Đang làm việc
    if (
      shiftEnd &&
      now > shiftEnd &&
      (newStatus === "ASSIGNED" || newStatus === "CHECKED_IN")
    ) {
      const msg = (
        tc.shiftEnded ||
        'Ca đã kết thúc lúc {end}. Không thể chuyển về "{status}".'
      )
        .replace("{end}", endTime)
        .replace("{status}", STATUS_LABELS[newStatus] || newStatus);
      toast.error(msg);
      return;
    }

    // Hiển thị confirm dialog đẹp
    const isDanger = newStatus === "ABSENT";
    setConfirmDialog({
      title: tc.changeStatusTitle || "Xác nhận thay đổi trạng thái",
      message: (tc.changeStatusMsg || 'Chuyển ca này sang "{status}"?').replace(
        "{status}",
        STATUS_LABELS[newStatus] || newStatus,
      ),
      icon: isDanger ? AlertCircle : CheckCircle,
      confirmColor: isDanger ? "red" : "amber",
      confirmText: (tc.changeStatusBtn || 'Đổi thành "{status}"').replace(
        "{status}",
        STATUS_LABELS[newStatus] || newStatus,
      ),
      onConfirm: async () => {
        setConfirmDialog(null);
        setLocalStatuses((p) => ({ ...p, [row.id]: newStatus }));
        if (newStatus === "ASSIGNED") {
          toast.success(
            tc.resetAbsent || "Đã hủy vắng mặt, chuyển về Đã phân công",
          );
          return;
        }
        try {
          if (newStatus === "CHECKED_IN") await checkIn(row.id);
          else if (newStatus === "CHECKED_OUT") await checkOut(row.id);
          else if (newStatus === "ABSENT") await markAbsent(row.id);
          toast.success(
            (tc.successStatus || "Đã cập nhật: {status}").replace(
              "{status}",
              STATUS_LABELS[newStatus],
            ),
          );
        } catch (err) {
          const msg = err?.message || "";
          if (
            msg.toLowerCase().includes("đã xử lý") ||
            msg.toLowerCase().includes("processed") ||
            msg.toLowerCase().includes("already")
          ) {
            toast.success(
              (tc.successStatus || "Đã cập nhật: {status}").replace(
                "{status}",
                STATUS_LABELS[newStatus],
              ),
            );
          } else {
            setLocalStatuses((p) => {
              const n = { ...p };
              delete n[row.id];
              return n;
            });
            toast.error(msg || tc.failStatus || "Cập nhật thất bại");
          }
        }
      },
    });
  };

  // ── Stat card filter handlers ──
  const handleStatFilter = (filterType) => {
    setStatFilter(filterType);
    // Also update the status filter to match
    if (filterType === "All") {
      setStatusFilter("All");
    } else if (filterType === "total") {
      setStatusFilter("All");
    } else if (filterType === "checkedIn") {
      setStatusFilter("CHECKED_IN");
    } else if (filterType === "assigned") {
      setStatusFilter("ASSIGNED");
    } else if (filterType === "absent") {
      setStatusFilter("ABSENT");
    }
  };

  return (
    <div className="space-y-5 pb-10">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            {t.title || "Lịch phân ca"}
          </h2>
          <p className="text-gray-500 text-sm italic mt-0.5">
            {t.subtitle || "Quản lý và theo dõi thời gian làm việc của đội ngũ"}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* View mode tabs */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
            {[
              ["day", t.tabs?.day || "Ngày"],
              ["week", t.tabs?.week || "Tuần"],
              ["month", t.tabs?.month || "Tháng"],
            ].map(([m, l]) => (
              <button
                key={m}
                onClick={() => {
                  setViewMode(m);
                  if (m === "day") {
                    setSelectedDate(new Date().toISOString().split("T")[0]);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  viewMode === m
                    ? "bg-[#d9a13b] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {viewMode === "day" && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#d9a13b]"
            />
          )}

          {viewMode === "week" && (
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl px-2 py-1.5">
              <button
                onClick={prevWeek}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-bold text-gray-700 px-2 min-w-[200px] text-center">
                {weekRange()}
              </span>
              <button
                onClick={nextWeek}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {viewMode === "month" && (
            <input
              type="month"
              value={selectedDate.slice(0, 7)}
              onChange={(e) => setSelectedDate(e.target.value + "-01")}
              className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#d9a13b]"
            />
          )}

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-[#d9a13b] hover:bg-[#c48f32] text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95 whitespace-nowrap"
          >
            <Plus size={17} /> {t.addShift || "Phân ca mới"}
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Clock}
          label={t.stats?.total || "Tổng ca trực"}
          value={stats.total}
          subtext={
            viewMode === "day"
              ? `${t.tabs?.day || "Ngày"} ${new Date(selectedDate).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US")}`
              : viewMode === "week"
                ? `${t.tabs?.week || "Tuần"} ${weekRange()}`
                : `${t.tabs?.month || "Tháng"} ${selectedDate.slice(0, 7)}`
          }
          color="text-blue-600"
          bg="bg-blue-50"
          onClick={() => handleStatFilter("total")}
          isActive={statFilter === "total" || statFilter === "All"}
        />
        <StatCard
          icon={UserCheck}
          label={t.stats?.checkedIn || "Đang làm việc"}
          value={stats.checkedIn}
          subtext={t.stats?.checkedInSub || "Nhân viên có mặt"}
          color="text-green-600"
          bg="bg-green-50"
          onClick={() => handleStatFilter("checkedIn")}
          isActive={statFilter === "checkedIn"}
        />
        <StatCard
          icon={Timer}
          label={t.stats?.assigned || "Đã phân công"}
          value={stats.assigned}
          subtext={t.stats?.assignedSub || "Chờ check-in"}
          color="text-purple-600"
          bg="bg-purple-50"
          onClick={() => handleStatFilter("assigned")}
          isActive={statFilter === "assigned"}
        />
        <StatCard
          icon={AlertCircle}
          label={t.stats?.absent || "Vắng mặt"}
          value={stats.absent}
          subtext={t.stats?.absentSub || "Cần kiểm tra"}
          color="text-red-600"
          bg="bg-red-50"
          onClick={() => handleStatFilter("absent")}
          isActive={statFilter === "absent"}
        />
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder={
                t.filters?.placeholder || "Tìm theo tên nhân viên..."
              }
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d9a13b]/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 focus:outline-none cursor-pointer"
            >
              <option value="All">{t.filters?.allShifts || "Tất cả ca"}</option>
              {[
                { value: "Ca sáng", label: t.filters?.morning || "Ca sáng" },
                {
                  value: "Ca chiều",
                  label: t.filters?.afternoon || "Ca chiều",
                },
                { value: "Ca tối", label: t.filters?.evening || "Ca tối" },
              ].map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setStatFilter("All");
              }}
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 focus:outline-none cursor-pointer"
            >
              <option value="All">
                {t.filters?.allStatus || "Tất cả trạng thái"}
              </option>
              {ALL_STATUSES.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
            {statFilter !== "All" && (
              <button
                onClick={() => {
                  handleStatFilter("All");
                  setStatusFilter("All");
                }}
                className="px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-colors"
              >
                × {t.filters?.reset || "Reset"}
              </button>
            )}
          </div>
        </div>
        {statFilter !== "All" && (
          <div className="mt-2 text-xs text-amber-700 font-medium bg-amber-50 px-2 py-1 rounded-lg">
            {t.filters?.filteringBy || "📊 Đang lọc theo:"}{" "}
            {statFilter === "total"
              ? t.stats?.total || "Tất cả ca trực"
              : statFilter === "checkedIn"
                ? t.stats?.checkedIn || "Đang làm việc"
                : statFilter === "assigned"
                  ? t.stats?.assigned || "Đã phân công"
                  : t.stats?.absent || "Vắng mặt"}
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center w-full bg-gray-50/80 border-b border-gray-100">
          {[
            [CW.staff, t.table?.staff || "Nhân viên"],
            [CW.type, t.table?.type || "Loại ca"],
            [CW.date, t.table?.date || "Ngày trực"],
            [CW.time, t.table?.time || "Thời gian"],
            [CW.status, t.table?.status || "Trạng thái"],
            [CW.actions, t.table?.actions || "Thao tác"],
          ].map(([w, label]) => (
            <div
              key={label}
              style={{ width: w, flexShrink: 0 }}
              className="px-4 py-3.5 text-xs font-black text-gray-400 uppercase tracking-wider"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Body */}
        {loading ? (
          <div className="flex items-center justify-center py-14 text-gray-400 text-sm gap-2">
            <div className="w-4 h-4 border-2 border-[#d9a13b] border-t-transparent rounded-full animate-spin" />
            {t.table?.loading || "Đang tải dữ liệu..."}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-14 text-gray-400 text-sm italic">
            {t.table?.noData || "Không tìm thấy ca trực nào."}
          </div>
        ) : (
          filtered.map((row, idx) => {
            const cs = localStatuses[row.id] ?? getEffectiveStatus(row);
            const staffInfo = getStaffDisplay(row);

            const today = new Date();
            const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
            const shiftDateStr = getDate(row);
            const isToday = shiftDateStr === todayStr;
            const isFuture = shiftDateStr > todayStr;
            const isPast = shiftDateStr < todayStr;

            const canEditStatus =
              isToday && !actionLoading && cs !== "CHECKED_OUT";
            const canEditOrRemove =
              (isToday || isFuture) && cs !== "CHECKED_OUT";

            const disableStatusReason = !isToday
              ? tc.onlyToday || "Chỉ được đổi trạng thái trong ngày làm việc"
              : cs === "CHECKED_OUT"
                ? t.guide?.items?.checkedOut || "Ca đã kết thúc"
                : "";
            const disableActionReason = isPast
              ? tc.noPastAction || "Không thể thao tác phân ca trong quá khứ"
              : cs === "CHECKED_OUT"
                ? t.guide?.items?.checkedOut || "Ca đã kết thúc"
                : "";

            // ✅ KEY UNIQUE
            const uniqueKey = `${row.id}-${row.workDate}-${row.shiftConfigId}-${row.staffId}`;

            return (
              <div
                key={uniqueKey}
                className={`flex items-center w-full hover:bg-gray-50/60 transition-colors ${
                  idx < filtered.length - 1 ? "border-b border-gray-50" : ""
                }`}
              >
                {/* Nhân viên */}
                <div
                  style={{ width: CW.staff, flexShrink: 0 }}
                  className="px-4 py-4 min-w-0"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center font-black text-slate-600 shrink-0 text-xs">
                      {staffInfo.name !== "—" ? staffInfo.name.charAt(0) : "?"}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 text-sm truncate">
                        {staffInfo.name}
                      </div>
                      {staffInfo.phone && (
                        <div className="text-[10px] text-gray-400 truncate">
                          {staffInfo.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Loại ca */}
                <div
                  style={{ width: CW.type, flexShrink: 0 }}
                  className="px-4 py-4"
                >
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg whitespace-nowrap">
                    {getShiftLabel(getShift(row))}
                  </span>
                </div>

                {/* Ngày trực */}
                <div
                  style={{ width: CW.date, flexShrink: 0 }}
                  className="px-4 py-4"
                >
                  <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                    {fmtDate(shiftDateStr)}
                  </span>
                </div>

                {/* Thời gian */}
                <div
                  style={{ width: CW.time, flexShrink: 0 }}
                  className="px-4 py-4"
                >
                  <div className="text-sm font-bold text-slate-900 whitespace-nowrap">
                    {fmtTime(row)}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {fmtDuration(row)}
                    {row.lateMinutes > 0 && (
                      <span className="ml-1.5 text-red-400 font-semibold">
                        {t.table?.late
                          ? t.table.late.replace("{mins}", row.lateMinutes)
                          : `· trễ ${row.lateMinutes}p`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Trạng thái */}
                <div
                  style={{ width: CW.status, flexShrink: 0 }}
                  className="px-4 py-4"
                >
                  {cs === "INCOMPLETE" ? (
                    <span
                      className={`inline-flex items-center w-full text-xs font-semibold border rounded-xl px-3 py-1.5 ${STATUS_STYLES.INCOMPLETE}`}
                    >
                      {STATUS_LABELS.INCOMPLETE}
                    </span>
                  ) : (
                    <select
                      value={cs}
                      onChange={(e) => handleStatusChange(row, e.target.value)}
                      disabled={!canEditStatus}
                      title={disableStatusReason}
                      className={`w-full text-xs font-semibold border rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer transition-colors
                          disabled:cursor-not-allowed disabled:opacity-80 ${STATUS_STYLES[cs] || STATUS_STYLES.ASSIGNED}`}
                    >
                      {SELECTABLE_STATUSES.map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Thao tác */}
                <div
                  style={{ width: CW.actions, flexShrink: 0 }}
                  className="px-4 py-4"
                >
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(row)}
                      disabled={!canEditOrRemove || actionLoading}
                      className="p-2 text-gray-400 hover:text-[#d9a13b] hover:bg-amber-50 rounded-lg transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                      title={
                        !canEditOrRemove
                          ? disableActionReason
                          : t.table?.edit || "Chỉnh sửa"
                      }
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(row)}
                      disabled={!canEditOrRemove || actionLoading}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                      title={
                        !canEditOrRemove
                          ? disableActionReason
                          : t.table?.delete || "Xóa"
                      }
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Tip đẹp và chi tiết ── */}
      <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-sm">
        <div className="flex gap-4 items-start">
          <div className="size-10 bg-white rounded-xl shadow-md flex items-center justify-center text-blue-600 shrink-0">
            <Info size={20} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-black text-blue-900 mb-2">
              {t.guide?.title || "📋 Hướng dẫn quản lý ca làm việc"}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Cột trái - Có thể thay đổi */}
              <div className="space-y-2">
                <p className="text-blue-800 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {t.guide?.canChange || "Có thể thay đổi trạng thái:"}
                </p>
                <ul className="space-y-1.5 text-blue-700">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    {t.guide?.items?.assigned ||
                      "Đã phân công → Chuyển sang làm việc / vắng mặt"}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    {t.guide?.items?.checkedIn ||
                      "Đang làm việc → Check-out hoặc đánh dấu vắng"}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    {t.guide?.items?.absent ||
                      "Vắng mặt → Có thể điều chỉnh nếu nhầm lẫn"}
                  </li>
                </ul>
              </div>

              {/* Cột phải - Không thể thay đổi */}
              <div className="space-y-2">
                <p className="text-blue-800 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  {t.guide?.cannotChange || "Không thể thay đổi:"}
                </p>
                <ul className="space-y-1.5 text-blue-700">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                    {t.guide?.items?.checkedOut ||
                      "Đã kết thúc → Ca đã hoàn thành"}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                    {t.guide?.items?.incomplete ||
                      "Quên check-out → Tự động lúc 0h mỗi ngày"}
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer tip */}
            <div className="mt-4 pt-3 border-t border-blue-200 text-blue-600 text-xs flex items-center gap-2">
              <Clock size={14} />
              <span>
                {t.guide?.footer ||
                  '⏰ Hệ thống tự động chạy lúc 00:00 hàng ngày để chuyển các ca đang làm việc thành "Quên check-out"'}
              </span>
            </div>
            <div className="mt-1 text-blue-600 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
              <span>
                {t.guide?.maxShifts || "Mỗi nhân viên tối đa 6 ca/tuần"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Confirm Dialog ── */}
      <ConfirmDialog
        open={!!confirmDialog}
        title={confirmDialog?.title}
        message={confirmDialog?.message}
        icon={confirmDialog?.icon}
        confirmColor={confirmDialog?.confirmColor}
        confirmText={confirmDialog?.confirmText}
        onConfirm={confirmDialog?.onConfirm}
        onCancel={() => setConfirmDialog(null)}
      />

      {/* ── Modal ── */}
      <ShiftModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        loading={actionLoading}
        initialData={editingRow}
        isStoreManager={true}
      />
    </div>
  );
}
