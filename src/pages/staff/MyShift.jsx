// src/pages/staff/MyShift.jsx
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  Clock,
  AlertCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  LogIn,
  LogOut,
  UserCheck,
  Timer,
  Info,
  CalendarDays,
  CheckCircle,
  XCircle,
  Award,
  TrendingUp,
  Moon,
  Sun,
  List,
  Grid3x3,
  RefreshCw,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useLanguageStore } from "@/stores";
import { translations } from "@/locales";
import toast from "react-hot-toast";
import { motion as Motion, AnimatePresence } from "framer-motion";

import { shiftApi, ENDPOINTS } from "@/config/api";
import { useSSE } from "@/hooks/useSSE";

// ── Enums ──
const STATUS_STYLES = {
  ASSIGNED: "bg-purple-50 text-purple-600 border-purple-200",
  CHECKED_IN: "bg-indigo-50 text-indigo-600 border-indigo-200",
  CHECKED_OUT: "bg-emerald-50 text-emerald-600 border-emerald-200",
  ABSENT: "bg-rose-50 text-rose-500 border-rose-200",
  INCOMPLETE: "bg-amber-50 text-amber-600 border-amber-200",
};

const SHIFT_ICONS = {
  morning: Sun,
  afternoon: Timer,
  evening: Moon,
};

const getShiftType = (name) => {
  if (!name) return "morning";
  const n = name.toLowerCase();
  if (n.includes("sáng") || n.includes("morning")) return "morning";
  if (n.includes("chiều") || n.includes("afternoon")) return "afternoon";
  if (n.includes("tối") || n.includes("evening")) return "evening";
  return "morning";
};

const translateShift = (name, t) => {
  const type = getShiftType(name);
  return t.shifts?.[type] || name;
};

// ── Helpers ──
const getDate = (r) => r.workDate || r.work_date || "";
const getStart = (r) =>
  String(r.shiftStartTime || r.startTime || r.start_time || "").slice(0, 5);
const getEnd = (r) =>
  String(r.shiftEndTime || r.end_time || r.end_time || "").slice(0, 5);

const getLocalDateStr = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const fmtDate = (d, lang = "vi") => {
  if (!d) return { full: "", day: "", month: "", year: "", short: "", iso: "" };
  const parts = d.split("-");
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  const locale = lang === "en" ? "en-US" : lang === "jp" ? "ja-JP" : "vi-VN";
  return {
    full: date.toLocaleDateString(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    short: `${date.getDate()}/${date.getMonth() + 1}`,
    iso: d,
    weekday: date.toLocaleDateString(locale, { weekday: "short" }),
    weekdayLong: date.toLocaleDateString(locale, { weekday: "long" }),
    monthName: date.toLocaleDateString(locale, { month: "long" }),
  };
};

const fmtTime = (r) => {
  const s = getStart(r),
    e = getEnd(r);
  return s && e ? `${s} - ${e}` : s || e || "—";
};

// ── Stat Card ──
const StatCard = ({
  icon,
  label,
  value,
  subtext,
  trend,
  onClick,
  isActive,
}) => {
  const CardIcon = icon;
  return (
    <Motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-white rounded-2xl border-2 p-5 shadow-sm transition-all cursor-pointer ${
        isActive
          ? "border-purple-500 ring-2 ring-purple-100"
          : "border-purple-50 hover:border-purple-200"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="size-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-200">
          {CardIcon && <CardIcon size={20} />}
        </div>
        {trend && (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
            +{trend}%
          </span>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-black text-slate-900">{value}</div>
        <div className="text-xs text-purple-600 font-medium">{label}</div>
        {subtext && (
          <div className="text-[11px] text-gray-400 font-medium">{subtext}</div>
        )}
      </div>
    </Motion.div>
  );
};

// ── Calendar Cell ──
const CalendarCell = ({
  date,
  shifts,
  isCurrentMonth,
  onSelect,
  selectedDate,
  lt,
}) => {
  const dayShifts = shifts.filter((s) => getDate(s) === date);
  const isToday = date === getLocalDateStr();
  const isSelected = date === selectedDate;

  const getStatusColor = (status) => {
    const s = status?.toUpperCase();
    switch (s) {
      case "CHECKED_IN":
        return "border-indigo-200 bg-indigo-50";
      case "CHECKED_OUT":
        return "border-emerald-200 bg-emerald-50";
      case "ABSENT":
        return "border-rose-200 bg-rose-50";
      default:
        return "border-purple-200 bg-purple-50";
    }
  };

  return (
    <Motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`
                min-h-[100px] p-2 border-2 rounded-xl transition-all cursor-pointer
                ${isCurrentMonth ? "bg-white" : "bg-gray-50/50"}
                ${isSelected ? "ring-2 ring-purple-500 border-purple-500" : "border-purple-100"}
                ${isToday ? "bg-gradient-to-br from-purple-50 to-indigo-50" : ""}
            `}
      onClick={() => onSelect(date)}
    >
      <div
        className={`
                text-sm font-bold mb-2 flex items-center justify-between
                ${isToday ? "text-purple-600" : isCurrentMonth ? "text-slate-700" : "text-gray-400"}
            `}
      >
        <span>{date.split("-")[2].replace(/^0/, "")}</span>
        {isToday && (
          <span className="text-[8px] font-bold px-1.5 py-0.5 bg-purple-200 text-purple-700 rounded-full">
            {lt.todayBadge}
          </span>
        )}
      </div>

      {dayShifts.length > 0 ? (
        <div className="space-y-1">
          {dayShifts.slice(0, 2).map((shift) => {
            const status = shift.status;
            const type = getShiftType(shift.shiftName || shift.shift_name);
            const SIcon = SHIFT_ICONS[type] || Clock;
            const uniqueKey = `${shift.id}-${shift.workDate}-${shift.shiftConfigId}`;

            return (
              <div
                key={uniqueKey}
                className={`
                                text-[10px] p-1 rounded-lg flex items-center gap-1 font-medium
                                ${getStatusColor(status)}
                            `}
              >
                <SIcon size={8} />
                <span className="truncate flex-1">{fmtTime(shift)}</span>
                <span
                  className={`w-1 h-1 rounded-full ${
                    status === "CHECKED_IN"
                      ? "bg-indigo-500 animate-pulse"
                      : status === "CHECKED_OUT"
                        ? "bg-emerald-500"
                        : status === "ABSENT"
                          ? "bg-rose-500"
                          : "bg-purple-500"
                  }`}
                />
              </div>
            );
          })}
          {dayShifts.length > 2 && (
            <div className="text-[8px] text-purple-400 font-semibold text-center">
              +{dayShifts.length - 2}
            </div>
          )}
        </div>
      ) : (
        <div className="h-[40px] flex items-center justify-center">
          <span className="text-[8px] text-gray-300">—</span>
        </div>
      )}
    </Motion.div>
  );
};

// ── List View Component ──
const ListView = ({ shifts, t, language, onSelect, filterStatus, lt }) => {
  const sortedShifts = useMemo(() => {
    return [...shifts].sort((a, b) => {
      return new Date(getDate(b)) - new Date(getDate(a));
    });
  }, [shifts]);

  const groupedShifts = useMemo(() => {
    const groups = {};
    sortedShifts.forEach((shift) => {
      const dStr = getDate(shift);
      const date = fmtDate(dStr, language);
      const monthYear = (t.listView?.monthYear || "{month} {year}")
        .replace("{month}", date.monthName)
        .replace("{year}", date.year);

      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push({ ...shift, formattedDate: date });
    });
    return groups;
  }, [sortedShifts, language, t]);

  return (
    <div className="p-6">
      <h3 className="font-black text-slate-800 flex items-center gap-2">
        <List size={20} className="text-purple-600" />
        {t.listView?.title || "Danh sách ca làm việc"}
        {filterStatus !== "ALL" && (
          <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] rounded uppercase font-black">
            {filterStatus === "COMPLETED" ? lt.completedLabel : lt.absentLabel}
          </span>
        )}
      </h3>

      {sortedShifts.length === 0 ? (
        <div className="text-center py-12">
          <div className="size-20 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center mx-auto mb-4">
            <CalendarDays
              size={48}
              className="mx-auto text-slate-300 mb-3"
              strokeWidth={1.5}
            />
          </div>
          <p className="font-bold text-slate-400">
            {t.listView?.empty || "Chưa có ca làm việc nào"}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {t.listView?.emptySub || "Bạn sẽ được phân công ca sớm thôi!"}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedShifts).map(([monthYear, monthShifts]) => (
            <div key={monthYear}>
              <h4 className="text-sm font-black text-purple-800 mb-4 pb-2 border-b border-purple-100">
                {monthYear}
              </h4>
              <div className="space-y-3">
                {monthShifts.map((shift) => {
                  const status = shift.status;
                  const type = getShiftType(
                    shift.shiftName || shift.shift_name,
                  );
                  const ShiftIcon = SHIFT_ICONS[type] || Clock;
                  const date = fmtDate(getDate(shift));
                  const color =
                    STATUS_STYLES[status] || "bg-purple-100 text-purple-600";
                  const uniqueKey = `${shift.id}-${shift.workDate}-${shift.shiftConfigId}`;

                  return (
                    <Motion.div
                      key={uniqueKey}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => onSelect(getDate(shift))}
                      className="flex items-center gap-4 p-4 bg-purple-50/30 rounded-xl hover:bg-purple-50 transition-colors border border-purple-100 cursor-pointer"
                    >
                      <div
                        className={`
                                                size-12 rounded-xl flex items-center justify-center shrink-0
                                                ${STATUS_STYLES[status] || "bg-purple-100"}
                                            `}
                      >
                        <ShiftIcon
                          size={20}
                          className={
                            status === "CHECKED_IN"
                              ? "text-indigo-600"
                              : status === "CHECKED_OUT"
                                ? "text-emerald-600"
                                : status === "ABSENT"
                                  ? "text-rose-600"
                                  : "text-purple-600"
                          }
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-slate-900">
                            {translateShift(
                              shift.shiftName || shift.shift_name,
                              t,
                            )}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full">
                            {date.weekday}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <CalendarDays size={12} />
                            {shift.formattedDate.full}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {fmtTime(shift)}
                          </span>
                        </div>

                        {shift.checkInTime && (
                          <div className="mt-1 text-xs text-emerald-600 flex items-center gap-1">
                            <LogIn size={10} />
                            Check-in: {shift.checkInTime}
                          </div>
                        )}
                      </div>

                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${color}`}
                      >
                        {t.status?.[status] || status}
                      </span>
                    </Motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function MyShift() {
  const { language } = useLanguageStore();

  const LOCAL_TRANSLATIONS = useMemo(
    () => ({
      vi: {
        tipsTitle: "📋 Mẹo nhỏ",
        policyTip:
          "Đi muộn quá 30' hệ thống sẽ tự động chuyển trạng thái Vắng mặt (Absent). Hãy lưu ý thời gian nhé!",
        tipCheckIn: "Check-in đúng giờ để tránh bị tính muộn",
        tipCheckOut: "Check-out khi kết thúc ca làm việc",
        tipView: "Xem lịch để chuẩn bị cho các ca tiếp theo",
        statTotalSub: "Tổng số ca đã làm",
        statCompletedSub: "{rate}% hoàn thành",
        statAbsentSub: "Đi muộn >30' tính vắng",
        statLateSub: "{count} lần đi trễ",
        statViewAll: "Xem tất cả",
        statViewCompleted: "Xem ca đã hoàn thành",
        statViewAbsent: "Xem ca vắng mặt",
        loadingMore: "Đang tải thêm...",
        loading: "Đang tải...",
        countShifts: "{count} ca trực",
        caTruc: "ca",
        todayBadge: "Hôm nay",
        completedLabel: "Đã hoàn thành",
        absentLabel: "Vắng mặt",
        titleToday: "Ca trực hôm nay",
        titleDate: "Ca trực ngày {day}",
        emptyToday: "Hôm nay bạn được nghỉ",
        emptyDate: "Ngày này không có ca",
        emptySubToday: "Không có ca trực nào được phân công",
        emptySubDate: "Không có lịch làm việc trong ngày này",
        monthFormat: "Tháng {month}, {year}",
        errorLoad: "Không thể tải dữ liệu lịch làm việc",
        successDelete: "Ca làm việc đã được xóa",
        newAssignment: "Đã nhận phân ca mới",
        earlyCheckIn: "Chưa đến giờ bắt đầu ca làm việc",
        checkInSuccess: "Check-in thành công!",
        checkInFail: "Check-in thất bại",
        earlyCheckOut: "Không thể check-out trước 30 phút so với giờ kết thúc",
        lateCheckOut: "Check-out quá trễ! Ca đã bị đánh dấu quên check-out",
        checkOutSuccess: "Check-out thành công!",
        checkOutFail: "Check-out thất bại",
        todaySuccess: "Đã chuyển đến hôm nay",
      },
      en: {
        tipsTitle: "📋 Tips",
        policyTip:
          "Late > 30 mins will automatically be marked as Absent. Please be punctual!",
        tipCheckIn: "Check-in on time to avoid being late",
        tipCheckOut: "Check-out at the end of your shift",
        tipView: "View schedule to prepare for next shifts",
        statTotalSub: "Total shifts worked",
        statCompletedSub: "{rate}% completed",
        statAbsentSub: "Late >30' = Absent",
        statLateSub: "{count} times late",
        statViewAll: "See all",
        statViewCompleted: "See completed shifts",
        statViewAbsent: "See absent shifts",
        loadingMore: "Loading more...",
        loading: "Loading...",
        countShifts: "{count} shifts",
        caTruc: "shifts",
        todayBadge: "Today",
        completedLabel: "Completed",
        absentLabel: "Absent",
        titleToday: "Today's Shifts",
        titleDate: "Shifts on {day}",
        emptyToday: "You have today off",
        emptyDate: "No shifts on this date",
        emptySubToday: "No shifts assigned for today",
        emptySubDate: "No working schedule for this day",
        monthFormat: "{month}, {year}",
        errorLoad: "Unable to load schedule data",
        successDelete: "Shift has been deleted",
        newAssignment: "New shift assigned",
        earlyCheckIn: "Shift hasn't started yet",
        checkInSuccess: "Check-in successful!",
        checkInFail: "Check-in failed",
        earlyCheckOut: "Cannot check-out more than 30 mins early",
        lateCheckOut: "Check-out too late! Marked as Incomplete",
        checkOutSuccess: "Check-out successful!",
        checkOutFail: "Check-out failed",
        todaySuccess: "Moved to today",
      },
      jp: {
        tipsTitle: "📋 ヒント",
        policyTip:
          "30分以上の遅刻は自動的に欠勤（Absent）としてマークされます。時間を守ってください！",
        tipCheckIn: "遅れないように時間通りにチェックインしてください",
        tipCheckOut: "シフト終了時にチェックアウトしてください",
        tipView: "次のシフトに備えてスケジュールを確認してください",
        statTotalSub: "合計勤務シフト数",
        statCompletedSub: "{rate}% 完了",
        statAbsentSub: "30分以上の遅刻 = 欠勤",
        statLateSub: "{count} 回の遅刻",
        statViewAll: "すべて見る",
        statViewCompleted: "完了したシフトを見る",
        statViewAbsent: "欠勤したシフトを見る",
        loadingMore: "読み込み中...",
        loading: "読み込み中...",
        countShifts: "{count} シフト",
        caTruc: "シフト",
        todayBadge: "今日",
        completedLabel: "完了",
        absentLabel: "欠員",
        titleToday: "今日のシフト",
        titleDate: "{day}日のシフト",
        emptyToday: "今日は休みです",
        emptyDate: "この日のシフトはありません",
        emptySubToday: "今日のシフトは割り当てられていません",
        emptySubDate: "この日の勤務スケジュールはありません",
        monthFormat: "{year}年 {month}",
        errorLoad: "スケジュールデータを読み込めませんでした",
        successDelete: "シフトが削除されました",
        newAssignment: "新しいシフトを割り当てました",
        earlyCheckIn: "シフトはまだ開始されていません",
        checkInSuccess: "チェックインに成功しました！",
        checkInFail: "チェックインに失敗しました",
        earlyCheckOut: "終了30分前より早くチェックアウトすることはできません",
        lateCheckOut:
          "チェックアウトが遅すぎます！未完了としてマークされました",
        checkOutSuccess: "チェックアウトに成功しました！",
        checkOutFail: "チェックアウトに失敗しました",
        todaySuccess: "今日に移動しました",
      },
    }),
    [],
  );

  const t = useMemo(
    () => (translations[language] || translations.vi).staff?.myShift || {},
    [language],
  );
  const lt = useMemo(
    () => LOCAL_TRANSLATIONS[language] || LOCAL_TRANSLATIONS.vi,
    [language, LOCAL_TRANSLATIONS],
  );

  const { user } = useAuthStore();
  const staffId = user?.id;

  // ========== STATE ==========
  const [allShifts, setAllShifts] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [todayShiftsData, setTodayShiftsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState(getLocalDateStr());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const dataLoadedRef = useRef(false);
  const abortControllerRef = useRef(null);

  const loadAllShifts = useCallback(async () => {
    if (!staffId || dataLoadedRef.current) return;

    setLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const currentYear = new Date().getFullYear();
      const startDate = `${currentYear - 1}-01-01`;
      const endDate = `${currentYear + 1}-12-31`;

      const allData = await shiftApi.getScheduleRange(
        staffId,
        startDate,
        endDate,
      );

      setAllShifts(allData || []);
      dataLoadedRef.current = true;
    } catch (error) {
      if (error.name !== "AbortError") {
        const msg =
          error.response?.data?.message ||
          error?.message ||
          lt?.errorLoad ||
          "Error";
        toast.error(msg);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [staffId, lt]);

  const updateShiftsByMonth = useCallback(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;

    const monthShifts = allShifts.filter((shift) => {
      const shiftDate = getDate(shift);
      if (!shiftDate) return false;
      const [shiftYear, shiftMonth] = shiftDate.split("-");
      return parseInt(shiftYear) === year && parseInt(shiftMonth) === month;
    });

    setShifts(monthShifts);
  }, [currentMonth, allShifts]);

  const fetchStats = useCallback(async () => {
    if (!staffId) return;
    setStatsLoading(true);
    try {
      const data = await shiftApi.getPersonalStats(staffId);
      setStats(data);
    } catch (err) {
      console.error("Stats error:", err);
    } finally {
      setStatsLoading(false);
    }
  }, [staffId]);

  const fetchTodayShifts = useCallback(async () => {
    if (!staffId) return;
    try {
      const todayStr = getLocalDateStr();
      const data = await shiftApi.getSchedule(todayStr, staffId);
      setTodayShiftsData(data || []);
    } catch (err) {
      console.error("Fetch today shifts error:", err);
    }
  }, [staffId]);

  const mergeShift = useCallback((oldShift, newData) => {
    const normalizedData = {
      ...newData,
      shiftStartTime: newData.shiftStartTime || newData.startTime,
      shiftEndTime: newData.shiftEndTime || newData.endTime,
      shiftName: newData.shiftName || newData.name,
    };

    if (!oldShift) return normalizedData;

    return {
      ...oldShift,
      ...normalizedData,
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
  }, []);

  // ── Realtime SSE ──
  const { data: realtimeUpdate } = useSSE(ENDPOINTS.PROTECTED.SHIFTS.events);

  useEffect(() => {
    if (!realtimeUpdate) return;

    const { type, data: eventData, shiftId } = realtimeUpdate;

    const updateShiftInAllData = (updatedShift) => {
      setAllShifts((prev) => {
        const existing = prev.find((s) => s.id === updatedShift.id);
        if (existing) {
          return prev.map((s) =>
            s.id === updatedShift.id ? mergeShift(s, updatedShift) : s,
          );
        }
        return [...prev, updatedShift];
      });

      const shiftDate = getDate(updatedShift);
      if (shiftDate) {
        const [year, month] = shiftDate.split("-");
        if (
          parseInt(year) === currentMonth.getFullYear() &&
          parseInt(month) === currentMonth.getMonth() + 1
        ) {
          setShifts((prev) => {
            const existing = prev.find((s) => s.id === updatedShift.id);
            if (existing) {
              return prev.map((s) =>
                s.id === updatedShift.id ? mergeShift(s, updatedShift) : s,
              );
            }
            return [...prev, updatedShift];
          });
        }
      }
    };

    if (type === "SHIFT_DELETED" && shiftId) {
      setAllShifts((prev) => prev.filter((s) => s.id !== shiftId));
      setShifts((prev) => prev.filter((s) => s.id !== shiftId));
      setTodayShiftsData((prev) => prev.filter((s) => s.id !== shiftId));
      toast.success(lt.successDelete);
    } else if (
      (type === "CHECK_IN" ||
        type === "CHECK_OUT" ||
        type === "ATTENDANCE_UPDATED" ||
        type === "MARK_ABSENT") &&
      eventData
    ) {
      updateShiftInAllData(eventData);
      setTodayShiftsData((prev) =>
        prev.map((s) => (s.id === eventData.id ? mergeShift(s, eventData) : s)),
      );
      fetchStats();

      if (type === "CHECK_IN") toast.success(lt.checkInSuccess);
      else if (type === "CHECK_OUT") {
        if (eventData.status === "INCOMPLETE") {
          toast.error(lt.lateCheckOut);
        } else {
          toast.success(lt.checkOutSuccess);
        }
      } else if (type === "MARK_ABSENT") {
        toast.success(lt.absentLabel);
      }
    } else if (
      (type === "SHIFT_UPDATED" ||
        type === "ASSIGN_SHIFT" ||
        type === "UPDATE_ASSIGNMENT") &&
      (eventData || shiftId || realtimeUpdate.assignmentId)
    ) {
      const targetShiftId =
        eventData?.id ||
        eventData?.assignmentId ||
        eventData?.shiftId ||
        realtimeUpdate.assignmentId ||
        shiftId;
      const eventStaffId =
        eventData?.staffId ||
        eventData?.staff_id ||
        eventData?.employeeId ||
        eventData?.staff?.id;

      const currentStaffIdStr = String(staffId);
      const isMine = eventStaffId && String(eventStaffId) === currentStaffIdStr;
      const wasMine =
        targetShiftId &&
        allShifts.some((s) => String(s.id) === String(targetShiftId));

      if (isMine || wasMine || (type === "SHIFT_UPDATED" && !eventStaffId)) {
        dataLoadedRef.current = false;
        loadAllShifts();
        fetchTodayShifts();
        fetchStats();
        if (type === "ASSIGN_SHIFT" && isMine)
          toast.success(lt?.newAssignment || "New shift assigned");
      }
    }
  }, [
    realtimeUpdate,
    staffId,
    currentMonth,
    mergeShift,
    loadAllShifts,
    fetchTodayShifts,
    fetchStats,
    lt,
    allShifts,
  ]);

  useEffect(() => {
    if (staffId) {
      loadAllShifts();
      fetchStats();
      fetchTodayShifts();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [staffId, loadAllShifts, fetchStats, fetchTodayShifts]);

  useEffect(() => {
    updateShiftsByMonth();
  }, [allShifts, currentMonth, updateShiftsByMonth]);

  // ========== CALENDAR HELPERS ==========
  const getDaysInMonth = useCallback((date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);

    const days = [];
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      days.push(`${y}-${m}-${d}`);
    }
    return days;
  }, []);

  const monthDays = useMemo(
    () => getDaysInMonth(currentMonth),
    [currentMonth, getDaysInMonth],
  );
  const currentViewMonthName = useMemo(() => {
    const locale =
      language === "en" ? "en-US" : language === "jp" ? "ja-JP" : "vi-VN";
    return currentMonth.toLocaleDateString(locale, { month: "long" });
  }, [currentMonth, language]);

  const isCurrentMonth = useCallback(
    (dateStr) => {
      const date = new Date(dateStr);
      return (
        date.getMonth() === currentMonth.getMonth() &&
        date.getFullYear() === currentMonth.getFullYear()
      );
    },
    [currentMonth],
  );

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const goToToday = () => {
    const today = getLocalDateStr();
    setSelectedDate(today);
    setCurrentMonth(new Date());
    toast.success(lt.todaySuccess);
  };

  // Get shifts for selected date
  const selectedDateShifts = useMemo(() => {
    return allShifts
      .filter((s) => getDate(s) === selectedDate)
      .sort((a, b) => getStart(a).localeCompare(getStart(b)));
  }, [allShifts, selectedDate]);

  const isSelectedDateToday = selectedDate === getLocalDateStr();

  const handleCheckIn = async (assignmentId) => {
    const shift = allShifts.find((s) => s.id === assignmentId);
    if (shift) {
      const now = new Date();
      const start = getStart(shift);
      if (start) {
        const shiftStartDateTime = new Date(
          `${new Date().toISOString().split("T")[0]}T${start}:00`,
        );
        if (now < shiftStartDateTime) {
          toast.error(lt.earlyCheckIn);
          return;
        }
      }
    }

    setActionLoading(true);
    try {
      const updated = await shiftApi.checkIn(assignmentId);
      setAllShifts((prev) =>
        prev.map((s) => (s.id === assignmentId ? mergeShift(s, updated) : s)),
      );
      setShifts((prev) =>
        prev.map((s) => (s.id === assignmentId ? mergeShift(s, updated) : s)),
      );
      setTodayShiftsData((prev) =>
        prev.map((s) => (s.id === assignmentId ? mergeShift(s, updated) : s)),
      );
      fetchStats();
      toast.success(lt.checkInSuccess);
    } catch (err) {
      const errMsg =
        err.response?.data?.message || err.message || lt.checkInFail;
      toast.error(errMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async (assignmentId) => {
    const shift = allShifts.find((s) => s.id === assignmentId);
    if (shift) {
      const now = new Date();
      const end = getEnd(shift);
      if (end) {
        const shiftEndDateTime = new Date(
          `${new Date().toISOString().split("T")[0]}T${end}:00`,
        );
        const diffMs = shiftEndDateTime - now;
        const diffMins = diffMs / 60000;
        if (diffMins > 30) {
          toast.error(lt.earlyCheckOut);
          return;
        }
      }
    }

    setActionLoading(true);
    try {
      const updated = await shiftApi.checkOut(assignmentId);
      setAllShifts((prev) =>
        prev.map((s) => (s.id === assignmentId ? mergeShift(s, updated) : s)),
      );
      setShifts((prev) =>
        prev.map((s) => (s.id === assignmentId ? mergeShift(s, updated) : s)),
      );
      setTodayShiftsData((prev) =>
        prev.map((s) => (s.id === assignmentId ? mergeShift(s, updated) : s)),
      );
      fetchStats();

      if (updated.status === "INCOMPLETE") {
        toast.error(lt.lateCheckOut);
      } else {
        toast.success(lt.checkOutSuccess);
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.message || err.message || lt.checkOutFail;
      toast.error(errMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    const [y, m] = date.split("-").map(Number);
    if (m !== currentMonth.getMonth() + 1 || y !== currentMonth.getFullYear()) {
      setCurrentMonth(new Date(y, m - 1, 1));
    }
  };

  // Current and next shift
  const currentShift = useMemo(() => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    return (
      todayShiftsData.find((shift) => {
        const start = getStart(shift);
        const end = getEnd(shift);
        return currentTime >= start && currentTime <= end;
      }) || null
    );
  }, [todayShiftsData]);

  const nextShift = useMemo(() => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    return (
      todayShiftsData
        .filter(
          (shift) => getStart(shift) > currentTime && shift.status !== "ABSENT",
        )
        .sort((a, b) => getStart(a).localeCompare(getStart(b)))[0] || null
    );
  }, [todayShiftsData]);

  const currentFmtDate = useMemo(
    () => fmtDate(selectedDate, language),
    [selectedDate, language],
  );

  // Stats cards
  const statsCards = useMemo(() => {
    const handleStatClick = (filter) => {
      setFilterStatus(filter);
      setViewMode("list");
    };

    if (stats) {
      const completionRate =
        stats.totalShifts > 0
          ? Math.round((stats.totalCompleted / stats.totalShifts) * 100)
          : 0;

      return [
        {
          id: "total",
          icon: Clock,
          label: t.stats?.totalShifts || "Total Shifts",
          value: stats.totalShifts || 0,
          subtext: lt.statTotalSub,
          isActive: filterStatus === "ALL",
          onClick: () => handleStatClick("ALL"),
        },
        {
          id: "completed",
          icon: Award,
          label: t.stats?.completed || "Completed",
          value: stats.totalCompleted || 0,
          subtext: lt.statCompletedSub.replace("{rate}", completionRate),
          isActive: filterStatus === "COMPLETED",
          onClick: () => handleStatClick("COMPLETED"),
        },
        {
          id: "absent",
          icon: AlertCircle,
          label: t.stats?.absent || "Absent",
          value: stats.totalAbsent || 0,
          subtext: stats.totalLate
            ? lt.statLateSub.replace("{count}", stats.totalLate)
            : lt.statAbsentSub,
          isActive: filterStatus === "ABSENT",
          onClick: () => handleStatClick("ABSENT"),
        },
      ];
    }

    return [
      {
        id: "total",
        icon: Clock,
        label: t.stats?.totalShifts || "Total Shifts",
        value: statsLoading ? "..." : allShifts.length || 0,
        subtext: statsLoading ? lt.loading : lt.statViewAll,
        onClick: () => handleStatClick("ALL"),
        isActive: filterStatus === "ALL",
      },
      {
        id: "completed",
        icon: Award,
        label: t.stats?.completed || "Completed",
        value: statsLoading ? "..." : 0,
        subtext: statsLoading ? lt.loading : lt.statViewCompleted,
        onClick: () => handleStatClick("COMPLETED"),
        isActive: filterStatus === "COMPLETED",
      },
      {
        id: "absent",
        icon: AlertCircle,
        label: t.stats?.absent || "Absent",
        value: statsLoading ? "..." : 0,
        subtext: statsLoading ? lt.loading : lt.statViewAbsent,
        onClick: () => handleStatClick("ABSENT"),
        isActive: filterStatus === "ABSENT",
      },
    ];
  }, [stats, t, lt, allShifts.length, statsLoading, filterStatus]);

  // Loading state
  const isCalendarLoading = loading && allShifts.length === 0;

  // Lọc shifts theo filter cho ListView
  const filteredShifts = useMemo(() => {
    if (filterStatus === "ALL") return allShifts;
    const st =
      filterStatus === "COMPLETED"
        ? ["CHECKED_OUT", "COMPLETED", "INCOMPLETE"]
        : ["ABSENT", "MARK_ABSENT"];
    return allShifts.filter((s) => st.includes(s.status?.toUpperCase()));
  }, [allShifts, filterStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-lg mb-6">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black">
              {t.title || "Lịch làm việc"}
            </h1>
            <div className="flex items-center gap-3">
              {loading && (
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
                  <RefreshCw size={14} className="animate-spin" />
                  <span className="text-xs">{lt.loading}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Cards - Three Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
              <div className="text-xs text-purple-200 mb-1">
                {t.quickInfo?.currentShift || "Ca hiện tại"}
              </div>
              <div className="font-bold flex items-center gap-2 text-sm">
                <Sun size={16} />
                <span className="truncate">
                  {currentShift
                    ? `${translateShift(currentShift.shiftName, t)} (${fmtTime(currentShift)})`
                    : t.quickInfo?.noShift || "Không có ca"}
                </span>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
              <div className="text-xs text-purple-200 mb-1">
                {t.quickInfo?.status || "Trạng thái"}
              </div>
              <div className="font-bold flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    currentShift ? "bg-emerald-400" : "bg-gray-400"
                  }`}
                ></span>
                <span>
                  {currentShift
                    ? t.status?.[currentShift.status] || currentShift.status
                    : t.quickInfo?.outOfShift || "Ngoài ca"}
                </span>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
              <div className="text-xs text-purple-200 mb-1">
                {t.quickInfo?.nextShift || "Ca tiếp theo"}
              </div>
              <div className="font-bold text-sm truncate">
                {nextShift
                  ? `${translateShift(nextShift.shiftName, t)} (${fmtTime(nextShift)})`
                  : t.quickInfo?.noShift || "Không có ca"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {!statsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {statsCards.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar/List Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* View Controls */}
          <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {viewMode === "month" && (
                  <>
                    <button
                      onClick={prevMonth}
                      className="p-2 hover:bg-purple-50 rounded-xl transition-colors text-purple-600"
                      disabled={loading}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <h3 className="text-lg font-black text-purple-900">
                      {lt.monthFormat
                        .replace("{month}", currentViewMonthName)
                        .replace("{year}", currentMonth.getFullYear())}
                    </h3>
                    <button
                      onClick={nextMonth}
                      className="p-2 hover:bg-purple-50 rounded-xl transition-colors text-purple-600"
                      disabled={loading}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={goToToday}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                >
                  {t.controls?.today || "Hôm nay"}
                </button>
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
                  <button
                    onClick={() => setViewMode("month")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "month" ? "bg-white text-purple-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    <Grid3x3 size={14} />
                    {t.controls?.monthView || "Lịch tháng"}
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "list" ? "bg-white text-purple-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    <List size={14} />
                    {t.controls?.listView || "Danh sách"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
            {isCalendarLoading ? (
              <div className="p-4">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className="h-4 bg-purple-100 rounded animate-pulse"
                    />
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(42)].map((_, i) => (
                    <div
                      key={i}
                      className="min-h-[100px] bg-purple-50/50 border-2 border-purple-100 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              </div>
            ) : viewMode === "month" ? (
              <div className="p-4">
                <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-bold text-purple-400 py-2 border-b border-purple-50">
                  {(
                    t.calendar?.days || [
                      "CN",
                      "T2",
                      "T3",
                      "T4",
                      "T5",
                      "T6",
                      "T7",
                    ]
                  ).map((day) => (
                    <div key={day}>{day}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {monthDays.map((date) => (
                    <CalendarCell
                      key={date}
                      date={date}
                      shifts={shifts}
                      isCurrentMonth={isCurrentMonth(date)}
                      onSelect={handleSelectDate}
                      selectedDate={selectedDate}
                      lt={lt}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <ListView
                shifts={filteredShifts}
                t={t}
                language={language}
                onSelect={setSelectedDate}
                filterStatus={filterStatus}
                lt={lt}
              />
            )}
          </div>
        </div>

        {/* Selected Date Shifts */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <CalendarDays size={24} />
              </div>
              <div>
                <div className="text-sm text-purple-100">
                  {currentFmtDate.weekdayLong}
                </div>
                <div className="text-2xl font-black">{currentFmtDate.full}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-purple-100">
              <Clock size={14} />
              <span>
                {lt.countShifts.replace("{count}", selectedDateShifts.length)}
              </span>
              {isSelectedDateToday && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  Hôm nay
                </span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5 min-h-[300px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-purple-900">
                {isSelectedDateToday
                  ? "Ca trực hôm nay"
                  : `Ca trực ngày ${currentFmtDate.day}`}
              </h3>
              <span className="text-xs font-bold px-2 py-1 bg-purple-100 text-purple-600 rounded-lg">
                {selectedDateShifts.length} ca
              </span>
            </div>

            <AnimatePresence mode="wait">
              {selectedDateShifts.length === 0 ? (
                <Motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <div className="size-16 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center mx-auto mb-3">
                    <Calendar size={24} className="text-purple-400" />
                  </div>
                  <p className="text-purple-600 font-medium">
                    {isSelectedDateToday ? lt.emptyToday : lt.emptyDate}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {isSelectedDateToday ? lt.emptySubToday : lt.emptySubDate}
                  </p>
                </Motion.div>
              ) : (
                <Motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {selectedDateShifts.map((shift) => {
                    const status = shift.status;
                    const canCheckIn =
                      status === "ASSIGNED" && isSelectedDateToday;
                    const canCheckOut =
                      status === "CHECKED_IN" && isSelectedDateToday;
                    const uniqueKey = `${shift.id}-${shift.workDate}-${shift.shiftConfigId}`;

                    return (
                      <Motion.div
                        key={uniqueKey}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`
                                            p-4 rounded-xl border-2 transition-all
                                            ${STATUS_STYLES[status] || "border-purple-100 bg-white"}
                                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`
                                            size-12 rounded-xl flex items-center justify-center shrink-0
                                            ${STATUS_STYLES[status] || "bg-purple-100"}
                                            `}
                          >
                            {(() => {
                              const type = getShiftType(
                                shift.shiftName || shift.shift_name,
                              );
                              const Icon = SHIFT_ICONS[type] || Clock;
                              return (
                                <Icon
                                  size={24}
                                  className={
                                    status === "CHECKED_IN"
                                      ? "text-indigo-600"
                                      : status === "CHECKED_OUT"
                                        ? "text-emerald-600"
                                        : status === "ABSENT"
                                          ? "text-rose-600"
                                          : "text-purple-600"
                                  }
                                />
                              );
                            })()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-black text-slate-900">
                                {translateShift(
                                  shift.shiftName || shift.shift_name,
                                  t,
                                )}
                              </h4>
                              <span
                                className={`
                                                text-xs font-bold px-2 py-1 rounded-lg
                                                ${STATUS_STYLES[status]}
                                                `}
                              >
                                {t.status?.[status] || status}
                              </span>
                            </div>

                            <div className="space-y-1 text-sm mb-3">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock size={14} />
                                <span className="font-medium">
                                  {fmtTime(shift)}
                                </span>
                              </div>
                              {shift.checkInTime && (
                                <div className="flex items-center gap-2 text-emerald-600">
                                  <LogIn size={14} />
                                  <span className="text-xs">
                                    Check-in: {shift.checkInTime}
                                  </span>
                                </div>
                              )}
                              {shift.checkOutTime && (
                                <div className="flex items-center gap-2 text-rose-600">
                                  <LogOut size={14} />
                                  <span className="text-xs">
                                    Check-out: {shift.checkOutTime}
                                  </span>
                                </div>
                              )}
                            </div>

                            {isSelectedDateToday && (
                              <div className="flex gap-2">
                                {canCheckIn && (
                                  <button
                                    onClick={() => handleCheckIn(shift.id)}
                                    disabled={actionLoading}
                                    className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1 shadow-md shadow-purple-200"
                                  >
                                    <LogIn size={14} />
                                    Check-in
                                  </button>
                                )}
                                {canCheckOut && (
                                  <button
                                    onClick={() => handleCheckOut(shift.id)}
                                    disabled={actionLoading}
                                    className="flex-1 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1 shadow-md shadow-emerald-200"
                                  >
                                    <LogOut size={14} />
                                    Check-out
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </Motion.div>
                    );
                  })}
                </Motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 p-5">
            <div className="flex gap-3">
              <div className="size-10 rounded-xl bg-white shadow-md flex items-center justify-center text-purple-600 shrink-0">
                <Info size={18} />
              </div>
              <div>
                <h4 className="text-sm font-black text-purple-900 mb-2">
                  {lt.tipsTitle}
                </h4>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-center gap-2 text-purple-700">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                    <span>
                      <span className="font-bold">Check-in</span>{" "}
                      {lt.tipCheckIn}
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-purple-700">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                    <span>
                      <span className="font-bold">Check-out</span>{" "}
                      {lt.tipCheckOut}
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-purple-700">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                    <span>{lt.tipView}</span>
                  </li>
                  <li className="flex items-center gap-2 text-purple-700">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                    <span>{lt.policyTip}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
