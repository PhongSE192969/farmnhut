// src/stores/shiftStore.js
import { create } from "zustand";
import { shiftApi } from "@/config/api";
import toast from "react-hot-toast";

const DEFAULT_FRANCHISE_ID = "123e4567-e89b-12d3-a456-426614174000";

// Spring Boot có thể serialize LocalDate thành [2026,3,12] hoặc "2026-03-12"
const normalizeDate = (d) => {
  if (!d) return "";
  if (Array.isArray(d)) {
    // [year, month, day]
    const [y, m, day] = d;
    return `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }
  return String(d).slice(0, 10); // "2026-03-12T..." → "2026-03-12"
};

// Spring Boot có thể serialize LocalTime thành [7,0] hoặc [7,0,0] hoặc "07:00:00"
const normalizeTime = (t) => {
  if (!t) return "";
  if (Array.isArray(t)) {
    // [hour, minute] hoặc [hour, minute, second]
    const [h, m] = t;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  return String(t).slice(0, 5); // "07:00:00" → "07:00"
};

const useShiftStore = create((set, get) => ({
  // ── State ──────────────────────────────────────
  schedule: [], // StaffShiftResponse[] — dữ liệu hiển thị ở ShiftSchedule
  shifts: [], // ShiftConfiguration[] — cho backward compatibility
  loading: false,
  actionLoading: false,
  error: null,
  currentDate: new Date().toISOString().split("T")[0],

  // Filter state
  searchQuery: "",
  statusFilter: "all",
  typeFilter: "all",
  page: 1,
  pageSize: 10,

  // ── FETCH SCHEDULE (StaffShift) ─────────────────
  fetchSchedule: async (date, staffId = null) => {
    const targetDate = date || get().currentDate;
    set({ loading: true, error: null });
    try {
      const data = await shiftApi.getSchedule(targetDate, staffId);
      const rows = Array.isArray(data) ? data : [];
      console.log("data", data);

      const normalized = rows.map((r) => ({
        ...r,
        workDate: normalizeDate(r.workDate),
        shiftStartTime: normalizeTime(r.shiftStartTime),
        shiftEndTime: normalizeTime(r.shiftEndTime),
        checkInTime: normalizeTime(r.checkInTime),
        checkOutTime: normalizeTime(r.checkOutTime),
      }));

      console.log(
        `✅ fetchSchedule for ${targetDate}:`,
        normalized.length,
        "rows",
      );
      if (normalized.length > 0)
        console.log("📋 sample:", JSON.stringify(normalized[0]));

      // Merge với schedule cũ để giữ data các ngày khác
      set((state) => {
        const existingMap = new Map(
          state.schedule.map((item) => [item.id, item]),
        );
        normalized.forEach((item) => existingMap.set(item.id, item));
        return {
          schedule: Array.from(existingMap.values()),
          loading: false,
        };
      });
    } catch (error) {
      console.error("❌ fetchSchedule:", error);
      set({
        error: error?.message || "Không thể tải lịch",
        loading: false,
      });
      toast.error("Không thể tải lịch ca");
    }
  },

  // ── FETCH SHIFT CONFIGURATIONS ─────────────────
  fetchShifts: async (franchiseId) => {
    set({ loading: true });
    try {
      const data = await shiftApi.getByFranchise(franchiseId);
      set({ shifts: Array.isArray(data) ? data : [], loading: false });
    } catch (error) {
      console.error("❌ fetchShifts:", error);
      set({ shifts: [], loading: false });
      toast.error("Không thể tải danh sách ca");
    }
  },

  // ── CREATE SHIFT (2 bước) ──────────────────────
  createShift: async ({
    shiftType,
    startTime,
    endTime,
    breakMinutes,
    staffId,
    workDate,
    franchiseId,
    staffName,
    staffPhone,
  }) => {
    set({ actionLoading: true });
    try {
      // Bước 1: tạo ShiftConfiguration
      const shiftConfig = await shiftApi.createConfig({
        name: shiftType,
        startTime,
        endTime,
        breakMinutes: breakMinutes ?? null,
        franchiseId: franchiseId || DEFAULT_FRANCHISE_ID,
      });
      console.log("✅ ShiftConfig created:", shiftConfig.id);

      // Bước 2: assign nhân viên
      const assignment = await shiftApi.assign({
        staffId,
        shiftConfigId: shiftConfig.id,
        workDate,
      });
      console.log("✅ Assignment created:", assignment.id);

      const UI_Assignment = {
        ...assignment,
        staffName,
        staffPhone,
        shiftName: shiftType,
        shiftStartTime: startTime,
        shiftEndTime: endTime,
      };

      // Thêm vào store
      set((state) => ({
        schedule: [UI_Assignment, ...state.schedule],
        actionLoading: false,
      }));

      toast.success("Tạo ca thành công!");
      return assignment;
    } catch (error) {
      console.error("❌ createShift:", error);
      toast.error(error?.message || "Tạo ca thất bại");
      throw error;
    } finally {
      set({ actionLoading: false });
    }
  },

  // ── UPDATE SHIFT (2 bước) ──────────────────────
  updateShift: async (
    assignmentId,
    shiftConfigId,
    {
      shiftType,
      startTime,
      endTime,
      breakMinutes,
      staffId,
      workDate,
      franchiseId,
      staffName,
      staffPhone,
    },
  ) => {
    set({ actionLoading: true });
    try {
      // Bước 1: update ShiftConfiguration
      await shiftApi.updateConfig(shiftConfigId, {
        name: shiftType,
        startTime,
        endTime,
        breakMinutes: breakMinutes ?? null,
        franchiseId: franchiseId || DEFAULT_FRANCHISE_ID,
      });

      // Bước 2: update Assignment
      const updated = await shiftApi.updateAssignment(assignmentId, {
        staffId,
        shiftConfigId,
        workDate,
      });

      // Cập nhật lên UI luôn với details đã có
      const UI_Updated = {
        ...updated,
        staffName,
        staffPhone,
        shiftName: shiftType,
        shiftStartTime: startTime,
        shiftEndTime: endTime,
      };

      set((state) => ({
        schedule: state.schedule.map((s) =>
          s.id === assignmentId ? { ...s, ...UI_Updated } : s,
        ),
        actionLoading: false,
      }));

      toast.success("Cập nhật ca thành công!");
      return updated;
    } catch (error) {
      console.error("❌ updateShift:", error);
      toast.error(error?.message || "Cập nhật thất bại");
      throw error;
    } finally {
      set({ actionLoading: false });
    }
  },

  // ── DELETE SHIFT ───────────────────────────────
  deleteShift: async (assignmentId, shiftConfigId) => {
    set({ actionLoading: true });
    try {
      await shiftApi.deleteConfig(shiftConfigId);
      set((state) => ({
        schedule: state.schedule.filter((s) => s.id !== assignmentId),
        actionLoading: false,
      }));
      toast.success("Xóa ca thành công!");
    } catch (error) {
      console.error("❌ deleteShift:", error);
      toast.error(error?.message || "Xóa ca thất bại");
      throw error;
    } finally {
      set({ actionLoading: false });
    }
  },

  // ── ATTENDANCE ─────────────────────────────────
  checkIn: async (assignmentId) => {
    try {
      const updated = await shiftApi.checkIn(assignmentId);
      set((state) => ({
        schedule: state.schedule.map((s) => {
          if (s.id === assignmentId) {
            return {
              ...s,
              ...updated,
              shiftName: updated.shiftName || s.shiftName,
              shiftStartTime:
                updated.shiftStartTime || s.shiftStartTime || s.startTime,
              shiftEndTime: updated.shiftEndTime || s.shiftEndTime || s.endTime,
            };
          }
          return s;
        }),
      }));
      toast.success("Check-in thành công!");
      return updated;
    } catch (error) {
      console.error("❌ checkIn:", error);
      toast.error("Check-in thất bại");
      throw error;
    }
  },

  checkOut: async (assignmentId) => {
    try {
      const updated = await shiftApi.checkOut(assignmentId);
      set((state) => ({
        schedule: state.schedule.map((s) => {
          if (s.id === assignmentId) {
            return {
              ...s,
              ...updated,
              shiftName: updated.shiftName || s.shiftName,
              shiftStartTime:
                updated.shiftStartTime || s.shiftStartTime || s.startTime,
              shiftEndTime: updated.shiftEndTime || s.shiftEndTime || s.endTime,
            };
          }
          return s;
        }),
      }));
      toast.success("Check-out thành công!");
      return updated;
    } catch (error) {
      console.error("❌ checkOut:", error);
      toast.error("Check-out thất bại");
      throw error;
    }
  },

  markAbsent: async (assignmentId) => {
    try {
      const updated = await shiftApi.markAbsent(assignmentId);
      set((state) => ({
        schedule: state.schedule.map((s) => {
          if (s.id === assignmentId) {
            return {
              ...s,
              ...updated,
              shiftName: updated.shiftName || s.shiftName,
              shiftStartTime:
                updated.shiftStartTime || s.shiftStartTime || s.startTime,
              shiftEndTime: updated.shiftEndTime || s.shiftEndTime || s.endTime,
            };
          }
          return s;
        }),
      }));
      toast.success("Đã đánh dấu vắng mặt");
      return updated;
    } catch (error) {
      console.error("❌ markAbsent:", error);
      toast.error("Đánh dấu thất bại");
      throw error;
    }
  },

  // ── FILTER ACTIONS ─────────────────────────────
  setSearchQuery: (v) => set({ searchQuery: v, page: 1 }),
  setStatusFilter: (v) => set({ statusFilter: v, page: 1 }),
  setTypeFilter: (v) => set({ typeFilter: v, page: 1 }),
  setPage: (p) => set({ page: p }),

  getFilteredShifts: () => {
    const { schedule, searchQuery, statusFilter, typeFilter } = get();
    const q = searchQuery.toLowerCase();
    return schedule.filter((row) => {
      const name = (row.staffName || row.shiftName || "").toLowerCase();
      return (
        (!q || name.includes(q)) &&
        (statusFilter === "all" || row.status === statusFilter) &&
        (typeFilter === "all" || row.shiftName === typeFilter)
      );
    });
  },

  getPaginatedShifts: () => {
    const filtered = get().getFilteredShifts();
    const { page, pageSize } = get();
    const start = (page - 1) * pageSize;
    return {
      data: filtered.slice(start, start + pageSize),
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize) || 1,
    };
  },

  resetFilters: () =>
    set({
      searchQuery: "",
      statusFilter: "all",
      typeFilter: "all",
      page: 1,
    }),
}));

export default useShiftStore;
