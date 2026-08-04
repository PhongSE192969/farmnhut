# SESSION_LOG — Nhật ký phiên làm việc (append-only)

Không xóa lịch sử cũ. Khi file quá dài, chuyển log cũ sang `docs/logs/YYYY-MM.md` và giữ lại tóm tắt + các phiên gần nhất ở đây.

---

## 2026-08-04 20:xx – Thiết lập bộ tài liệu quản lý ngữ cảnh dự án

### Yêu cầu

Người dùng yêu cầu Claude Code đảm nhận vai trò Technical Lead/Architect/Senior Full-stack Developer cho dự án tại `D:\Work Mericy\Agency\web chú nhựt` (repo GitHub `PhongSE192969/farmnhut`, đã clone trước đó cùng phiên), thiết lập bộ tài liệu quản lý ngữ cảnh bắt buộc (`CLAUDE.md`, `docs/*`) trước khi bắt đầu code, theo một bộ quy tắc chi tiết do người dùng cung cấp.

### Phân tích

- Xác nhận thư mục làm việc đúng, git repo sạch, nhánh `main` đồng bộ `origin/main`, 2 commit.
- Repo **đã có code** (không rỗng) → theo đúng quy tắc người dùng đưa ra, bỏ qua 3 câu hỏi khởi tạo dành cho thư mục trống, thay vào đó phân tích code hiện có: đọc `App.jsx` (toàn bộ route), `src/config/api.js` (hợp đồng API ~15 nhóm endpoint), `src/config/axiosClient.js` (luồng auth Firebase + refresh token 401), `src/mocks/*` (mock adapter), `src/constraints/index.js` (ROLES, ORDER_STATUS...), `src/stores/authStore.js`, `src/routes/ProtectedRoute.jsx`, `src/services/authService.js` (xác nhận flow đăng nhập thật dùng Firebase ID token → `POST /auth/sync-user`), `src/layouts/*`, `src/navigations/admin.navigation.js`, `vite.config.js`, `eslint.config.js`, `jsconfig.json`, `package.json`, `.gitignore`, `README.md` gốc (mặc định Vite template, chưa có nội dung thực).
- Phát hiện: không có backend/database trong repo (chỉ có mock server); README gốc là template mặc định; không có `.env.example`; không có test nào; 12 file còn sót cụm `"capital-coffee-auth"`/"coffee" — dấu vết tái sử dụng code từ dự án khác (quán cà phê) chưa dọn hết.
- Đề xuất cấu trúc tích hợp tài liệu (giữ nguyên `src/` ở root, không chuyển monorepo; `docs/backend`, `docs/database` chỉ là tài liệu tham chiếu vì backend thật ngoài phạm vi) và đặt 3 câu hỏi xác nhận cho người dùng trước khi tạo file.

### Đã thực hiện

- Người dùng xác nhận: (1) backend thật đã tồn tại nhưng ngoài phạm vi — nhiệm vụ ở dự án này chỉ tối ưu frontend; (2) giữ nguyên cấu trúc thư mục ở root, không chuyển monorepo; (3) chỉ ghi chú "coffee" leftover vào tài liệu, không sửa code ngay.
- File đã tạo:
  - `CLAUDE.md` (gốc) — hướng dẫn trung tâm cho các phiên sau.
  - `README.md` (ghi đè bản mặc định Vite) — giới thiệu dự án thực tế.
  - `.env.example` — dựa theo biến `VITE_*` thực tế dùng trong `src/config/env.js`, `firebase.config.js`, `mockConfig.js`.
  - `docs/PROJECT_CONTEXT.md`, `docs/REQUIREMENTS.md`, `docs/CURRENT_STATE.md`, `docs/TASKS.md`, `docs/DECISIONS.md` (ADR-001/002/003), `docs/SESSION_LOG.md` (file này).
  - `docs/TECH_STACK.md`, `ARCHITECTURE.md` (kèm sơ đồ Mermaid luồng dữ liệu), `CODE_CONVENTIONS.md`, `SETUP_GUIDE.md`, `DEPLOYMENT.md`, `TESTING.md`, `SECURITY.md`, `HANDOVER.md`.
  - `docs/frontend/PAGE_INVENTORY.md` (trích đầy đủ từ `App.jsx`), `COMPONENT_INVENTORY.md`, `STATE_MANAGEMENT.md`, `UI_UX_GUIDE.md`.
  - `docs/backend/API_CONTRACT.md` (trích đầy đủ từ `src/config/api.js`, đánh dấu rõ "suy ra từ frontend"), `BUSINESS_RULES.md`, `AUTHORIZATION.md`, `ERROR_HANDLING.md`.
  - `docs/database/DATA_MODEL.md`, `DATABASE_RULES.md`, `MIGRATION_LOG.md` (đánh dấu ngoài phạm vi, giữ chỗ theo cấu trúc chuẩn).
- Chạy baseline `npm install` + `npm run lint` + `npm run build` (`TASK-002`), ghi kết quả thật vào `CURRENT_STATE.md` và thêm 3 backlog item mới (`TASK-005` sửa lint, `TASK-006` giảm bundle size, `TASK-007` rà soát `npm audit`) vào `TASKS.md`.
- Không có file code (`src/`) nào bị sửa trong phiên này — chỉ tạo/đổi file `.md`, `.env.example` và cài `node_modules` (không commit).

### Quyết định

- Xem `docs/DECISIONS.md` ADR-001 (giữ cấu trúc root), ADR-002 (backend/database ngoài phạm vi), ADR-003 (không sửa "coffee" leftover ngay).

### Kiểm tra

- `npm install`: thành công, 14 vulnerability (`npm audit`) chưa xử lý.
- `npm run lint`: 100 lỗi / 49 warning — nợ kỹ thuật có sẵn từ trước, không phải do phiên này gây ra (phiên này không sửa file trong `src/`).
- `npm run build`: thành công (6.67s), có cảnh báo bundle chính 2,007 kB chưa code-split.
- Chi tiết đầy đủ: `docs/CURRENT_STATE.md` mục "Trạng thái build/lint/test gần nhất".

### Việc tiếp theo

- Người dùng xác nhận mục tiêu "tối ưu frontend" cụ thể (`TASK-003`) để chuyển các item ở Backlog (đặc biệt `TASK-005`, `TASK-006`, `TASK-007`) sang Ready và bắt đầu code.
- Quyết định số phận 3 file rác ở root (`TASK-004`).
