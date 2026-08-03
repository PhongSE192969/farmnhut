// src/pages/manager/shift/ShiftSchedule.jsx
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  Clock,
  AlertCircle,
  Search,
  UserCheck,
  Timer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useShiftStore from "@/stores/shiftStore";
import { useAuthStore } from "@/stores/authStore";
import { useSSE } from "@/hooks/useSSE";
import { ENDPOINTS } from "@/config/api";
import toast from "react-hot-toast";

// ── Enums từ BE ──
import { useLanguageStore } from "@/stores";
import { translations } from "@/locales";

// Trạng thái không thể chỉnh sửa
const TERMINAL_STATUSES = ["CHECKED_OUT", "INCOMPLETE"];

// ── Helpers ──
const getLocalTodayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

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

// eslint-disable-next-line no-unused-vars
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
        <Icon size={20} />
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
  staff: "28%",
  type: "15%",
  date: "15%",
  time: "20%",
  status: "22%",
};

export default function ShiftSchedule() {
  const { schedule, loading, fetchSchedule } = useShiftStore();

  const { user } = useAuthStore();
  const { language } = useLanguageStore();
  const t =
    (translations[language] || translations.vi).manager?.shiftSchedule || {};

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

  const [localStatuses, setLocalStatuses] = useState({});
  const [statFilter, setStatFilter] = useState("All"); // New state for stat card filtering

  // State để lưu thông tin nhân viên từ API
  const [staffMap, setStaffMap] = useState({});
  const [loadingStaff, setLoadingStaff] = useState(false);

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

  // ── AbortController để hủy request cũ ──
  const abortControllerRef = useRef(null);

  // ── Fetch thông tin nhân viên từ API ──
  const fetchStaffInfo = async (staffIds) => {
    if (!staffIds.length) return;

    setLoadingStaff(true);
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
        if (staff?.status === "ACTIVE") {
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
      setLoadingStaff(false);
    }
  };

  // ── Khi schedule thay đổi, lấy thông tin nhân viên ──
  useEffect(() => {
    const staffIds = schedule
      .map((r) => r.staffId)
      .filter((id) => id && !staffMap[id] && id !== "—")
      .filter((v, i, a) => a.indexOf(v) === i); // unique

    if (staffIds.length > 0) {
      fetchStaffInfo(staffIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule]);

  // ── Helper lấy tên nhân viên ──
  const getStaffDisplay = (row) => {
    // Nếu API trả về nguyên object staff
    if (row.staff && typeof row.staff === "object") {
      return {
        name:
          row.staff.name ||
          row.staff.fullName ||
          row.staff.username ||
          row.staffName ||
          row.staffId ||
          "—",
        phone:
          row.staff.phonenumber ||
          row.staff.phoneNumber ||
          row.staff.phone ||
          row.staffPhone ||
          row.contact ||
          "",
      };
    }

    // Nếu API đã trả về tên ở cấp độ row thì dùng
    if (row.staffName && row.staffName !== row.staffId) {
      return {
        name: row.staffName,
        phone: row.staffPhone || row.contact || row.phonenumber || "",
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
  };

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
        const userFranchiseId =
          user?.franchiseId || localStorage.getItem("franchiseId");

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
  }, [realtimeData, fetchDataStable]);

  useEffect(() => {
    fetchDataStable();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchDataStable]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    schedule,
    searchTerm,
    typeFilter,
    statusFilter,
    localStatuses,
    viewMode,
    selectedDate,
    weekStart,
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
        {loading || loadingStaff ? (
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
            const uniqueKey = `${row.id}-${row.workDate}-${row.shiftConfigId}-${row.staffId}`;
            const cs = localStatuses[row.id] ?? getEffectiveStatus(row);
            const staffInfo = getStaffDisplay(row);

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
                    {fmtDate(getDate(row))}
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
                  className="px-4 py-4 pr-6"
                >
                  <span
                    className={`inline-flex min-w-max justify-center items-center w-full text-xs font-semibold border rounded-xl px-3 py-1.5 ${STATUS_STYLES[cs] || STATUS_STYLES.ASSIGNED}`}
                  >
                    {STATUS_LABELS[cs] || cs}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
