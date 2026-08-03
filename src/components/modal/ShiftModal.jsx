// src/components/modal/ShiftModal.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CalendarDays,
  Clock,
  MapPin,
  User,
  CheckCircle,
} from "lucide-react";
import { BRANCHES } from "@/constraints";
import { useLanguageStore } from "@/stores";
import { useAuthStore } from "@/stores/authStore";
import { translations } from "@/locales";
import toast from "react-hot-toast";

// Ca cố định — khớp với ShiftConfiguration.name trên BE
const SHIFT_CONFIGS = [
  {
    value: "Ca sáng",
    startTime: "07:00",
    endTime: "11:00",
    color: "text-amber-600  bg-amber-50  border-amber-200",
  },
  {
    value: "Ca chiều",
    startTime: "13:00",
    endTime: "17:00",
    color: "text-blue-600   bg-blue-50   border-blue-200",
  },
  {
    value: "Ca tối",
    startTime: "18:00",
    endTime: "22:00",
    color: "text-purple-600 bg-purple-50 border-purple-200",
  },
];

import { SearchUsers } from "@/services/userService";

// Helper lấy ngày hôm nay dạng local YYYY-MM-DD
const getLocalTodayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const fetchStaffByBranch = async (branch) => {
  let mappedData = [];
  try {
    if (branch) {
      const payload = {
        role: "STAFF",
        status: "ACTIVE",
        size: 50,
      };
      const res = await SearchUsers(payload);
      const data = res?.content || res?.data || [];

      mappedData = data
        .filter(
          (u) =>
            u.status === "ACTIVE" &&
            (u.franchiseId === branch || u.franchise?.id === branch),
        )
        .map((s) => {
          if (s.id === "49faa5ec-3081-7080-6af1-421203165f7f") {
            return {
              id: s.id,
              name: "Nhân viên 1",
              role: "STAFF",
              phone: "0912345678",
              branch: branch,
            };
          }
          return {
            id: s.id,
            name: s.fullName || s.username,
            role: s.role?.name || "STAFF",
            phone: s.phone || "",
            branch: s.franchiseId || branch,
          };
        });
    }
  } catch (e) {
    console.error("Error fetching staff:", e);
  }

  // Nếu API không trả về Nhân viên 1, thêm vào
  if (
    !mappedData.find((s) => s.id === "49faa5ec-3081-7080-6af1-421203165f7f")
  ) {
    mappedData.unshift({
      id: "49faa5ec-3081-7080-6af1-421203165f7f",
      name: "Nhân viên 1",
      role: "STAFF",
      phone: "0912345678",
      branch: branch,
    });
  }

  return mappedData;
};

export default function ShiftModal({
  isOpen,
  onClose,
  onSave,
  loading,
  initialData,
  isStoreManager,
}) {
  const { language } = useLanguageStore();
  const { user } = useAuthStore();
  const t =
    (translations[language] || translations.vi).manager?.shiftSchedule?.modal ||
    {};

  const configLabels = {
    "Ca sáng":
      (translations[language] || translations.vi).manager?.shiftSchedule
        ?.filters?.morning || "Ca sáng",
    "Ca chiều":
      (translations[language] || translations.vi).manager?.shiftSchedule
        ?.filters?.afternoon || "Ca chiều",
    "Ca tối":
      (translations[language] || translations.vi).manager?.shiftSchedule
        ?.filters?.evening || "Ca tối",
  };

  const isEdit = !!initialData;

  const dynamicBranchId =
    user?.franchiseId ||
    localStorage.getItem("franchiseId") ||
    "e263732e-1a68-45ea-8c28-4f55105948a9";
  const defaultBranch = isStoreManager ? dynamicBranchId : BRANCHES?.[0] || "";

  const [form, setForm] = useState({
    shiftType: SHIFT_CONFIGS[0].value,
    startTime: SHIFT_CONFIGS[0].startTime,
    endTime: SHIFT_CONFIGS[0].endTime,
    branch: defaultBranch,
    staffId: "",
    staffName: "",
    staffPhone: "",
    workDate: getLocalTodayStr(),
  });

  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);

  // ── Hôm nay theo local time, cập nhật mỗi phút ──
  const [todayStr, setTodayStr] = useState(getLocalTodayStr);
  const prevTodayRef = useRef(todayStr);
  const setF = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    const tick = () => {
      const currentToday = getLocalTodayStr();
      setTodayStr(currentToday);
    };
    const id = setInterval(tick, 60_000); // cập nhật mỗi 1 phút
    return () => clearInterval(id);
  }, []);

  // ✅ Tự động chuyển ngày khi vừa qua midnight (nếu đang ở chế độ tạo mới và đang chọn ngày hôm nay)
  useEffect(() => {
    if (
      !isEdit &&
      isOpen &&
      form.workDate === prevTodayRef.current &&
      todayStr !== prevTodayRef.current
    ) {
      console.log(
        "🌓 Midnight passed in Modal! Updating workDate from",
        prevTodayRef.current,
        "to",
        todayStr,
      );
      Promise.resolve().then(() => setF("workDate", todayStr));
    }
    prevTodayRef.current = todayStr;
  }, [todayStr, isOpen, isEdit, form.workDate]);

  // Load staff khi branch thay đổi
  useEffect(() => {
    if (!isOpen || !form.branch) return;
    let cancelled = false;

    Promise.resolve().then(() => {
      if (!cancelled) {
        setLoadingStaff(true);
        setStaffList([]);
      }
    });

    fetchStaffByBranch(form.branch)
      .then((data) => {
        if (!cancelled) {
          setStaffList(data);

          // ✅ Nếu đang edit và có staffId, tự động chọn lại staff
          if (isEdit && initialData?.staffId) {
            const existingStaff = data.find(
              (s) => s.id === initialData.staffId,
            );
            if (existingStaff) {
              setForm((p) => ({
                ...p,
                staffId: existingStaff.id,
                staffName: existingStaff.name,
                staffPhone: existingStaff.phone,
              }));
            }
          }
        }
      })
      .catch(() => {
        if (!cancelled)
          toast.error(t.warnings?.noStaff || "Không thể tải nhân viên");
      })
      .finally(() => {
        if (!cancelled) setLoadingStaff(false);
      });
    return () => {
      cancelled = true;
    };
  }, [form.branch, isOpen, isEdit, initialData, t.warnings?.noStaff]);

  // Điền form khi edit (lần đầu)
  useEffect(() => {
    if (!isOpen) return;

    const resetForm = () => {
      if (isEdit && initialData) {
        setForm({
          shiftType: initialData.shiftType || SHIFT_CONFIGS[0].value,
          startTime: initialData.startTime || SHIFT_CONFIGS[0].startTime,
          endTime: initialData.endTime || SHIFT_CONFIGS[0].endTime,
          branch: initialData.branch || defaultBranch,
          staffId: initialData.staffId ? String(initialData.staffId) : "",
          staffName: initialData.staffName || "",
          staffPhone: initialData.staffPhone || "",
          workDate: initialData.workDate || getLocalTodayStr(),
        });
      } else {
        setForm({
          shiftType: SHIFT_CONFIGS[0].value,
          startTime: SHIFT_CONFIGS[0].startTime,
          endTime: SHIFT_CONFIGS[0].endTime,
          branch: defaultBranch,
          staffId: "",
          staffName: "",
          staffPhone: "",
          workDate: getLocalTodayStr(),
        });
      }
    };

    // Wrap in a microtask to avoid "setState synchronously within an effect" error
    Promise.resolve().then(resetForm);
  }, [initialData, isEdit, isOpen, defaultBranch]);

  const handleShiftTypeChange = (type) => {
    const cfg = SHIFT_CONFIGS.find((c) => c.value === type);
    if (cfg) {
      setForm((p) => ({
        ...p,
        shiftType: type,
        startTime: cfg.startTime,
        endTime: cfg.endTime,
      }));
    } else {
      setForm((p) => ({ ...p, shiftType: type }));
    }
  };

  const handleStaffSelect = (staffId) => {
    const s = staffList.find((x) => x.id === staffId);
    if (s) {
      setForm((p) => ({
        ...p,
        staffId: s.id,
        staffName: s.name,
        staffPhone: s.phone,
      }));
    } else {
      setForm((p) => ({ ...p, staffId: "", staffName: "", staffPhone: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.staffId) {
      toast.error(t.warnings?.selectStaff || "Vui lòng chọn nhân viên!");
      return;
    }
    if (!form.workDate) {
      toast.error(t.warnings?.selectDate || "Vui lòng chọn ngày trực!");
      return;
    }

    const [sh, sm] = form.startTime.split(":").map(Number);
    const [eh, em] = form.endTime.split(":").map(Number);
    if (sh * 60 + sm >= eh * 60 + em) {
      toast.error(
        t.warnings?.invalidTime || "Giờ kết thúc phải lớn hơn giờ bắt đầu!",
      );
      return;
    }

    onSave({
      shiftType: form.shiftType,
      startTime: form.startTime,
      endTime: form.endTime,
      staffId: form.staffId,
      staffName: form.staffName,
      staffPhone: form.staffPhone,
      workDate: form.workDate,
      branch: form.branch,
      ...(isEdit && {
        assignmentId: initialData.assignmentId,
        shiftConfigId: initialData.shiftConfigId,
      }),
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-[#d9a13b]/10 text-[#d9a13b] flex items-center justify-center">
                  <CalendarDays size={18} />
                </div>
                <h3 className="font-black text-slate-900">
                  {isEdit
                    ? t.titleEdit || "Cập nhật Ca trực"
                    : t.titleAdd || "Phân ca làm việc mới"}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4 max-h-[78vh] overflow-y-auto"
            >
              {/* Ngày trực */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  <CalendarDays size={12} /> {t.fields?.date || "Ngày trực"}
                </label>
                <input
                  type="date"
                  required
                  value={form.workDate}
                  onChange={(e) => setF("workDate", e.target.value)}
                  min={todayStr}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#d9a13b] focus:ring-2 focus:ring-[#d9a13b]/10"
                />
              </div>

              {/* Loại ca */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  <Clock size={12} /> {t.fields?.type || "Loại ca"}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SHIFT_CONFIGS.map((cfg) => (
                    <button
                      key={cfg.value}
                      type="button"
                      onClick={() => handleShiftTypeChange(cfg.value)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                        form.shiftType === cfg.value
                          ? cfg.color + " ring-2 ring-[#d9a13b]/30"
                          : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {configLabels[cfg.value] || cfg.value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Thời gian */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  <Clock size={12} /> {t.fields?.time || "Thời gian"}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="time"
                      required
                      value={form.startTime}
                      onChange={(e) => setF("startTime", e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#d9a13b]"
                    />
                    <p className="text-[10px] text-gray-400 mt-1 px-1">
                      {t.fields?.startTime || "Giờ bắt đầu"}
                    </p>
                  </div>
                  <div>
                    <input
                      type="time"
                      required
                      value={form.endTime}
                      onChange={(e) => setF("endTime", e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#d9a13b]"
                    />
                    <p className="text-[10px] text-gray-400 mt-1 px-1">
                      {t.fields?.endTime || "Giờ kết thúc"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chi nhánh */}
              {!isStoreManager && (
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-black text-gray-400 uppercase tracking-widest">
                    <MapPin size={12} /> {t.fields?.branch || "Đại lý"}
                  </label>
                  <select
                    value={form.branch}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        branch: e.target.value,
                        staffId: "",
                        staffName: "",
                        staffPhone: "",
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#d9a13b]"
                  >
                    {BRANCHES?.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Nhân viên */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  <User size={12} /> {t.fields?.staff || "Nhân viên"}
                </label>
                <select
                  required
                  disabled={loadingStaff}
                  value={form.staffId}
                  onChange={(e) => handleStaffSelect(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#d9a13b] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loadingStaff
                      ? t.placeholders?.loading || "Đang tải..."
                      : t.placeholders?.selectStaff || "— Chọn nhân viên —"}
                  </option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.role}
                    </option>
                  ))}
                </select>
                {!loadingStaff && staffList.length === 0 && form.branch && (
                  <p className="text-xs text-amber-600">
                    {t.warnings?.noStaff ||
                      "Không có nhân viên ở đại lý này."}
                  </p>
                )}
              </div>

              {/* Preview nhân viên đã chọn */}
              {form.staffId && form.staffName && (
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-black text-sm shrink-0">
                    {form.staffName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-green-800 truncate">
                      {form.staffName}
                    </p>
                    <p className="text-xs text-green-600">{form.staffPhone}</p>
                  </div>
                  <CheckCircle size={16} className="text-green-500 shrink-0" />
                </div>
              )}

              {/* Note luồng tạo */}
              {!isEdit && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-xs text-blue-700 leading-relaxed">
                    {t.guide ||
                      "Luồng tạo 2 bước: Tạo cấu hình ca → Phân công nhân viên. Trạng thái mặc định: Đã phân công."}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {t.actions?.cancel || "Hủy"}
                </button>
                <button
                  type="submit"
                  disabled={loading || loadingStaff}
                  className="flex-[2] px-4 py-2.5 bg-[#d9a13b] hover:bg-[#c48f32] text-white rounded-xl text-sm font-bold shadow-md active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t.actions?.processing || "Đang xử lý..."}
                    </span>
                  ) : isEdit ? (
                    t.actions?.update || "Cập nhật"
                  ) : (
                    t.actions?.confirm || "Xác nhận"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
