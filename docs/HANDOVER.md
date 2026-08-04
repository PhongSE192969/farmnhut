# HANDOVER — Bàn giao

_Cập nhật: 2026-08-04. Viết cho một lập trình viên mới tiếp quản phần frontend của dự án AgriFert._

## Tổng quan hệ thống

Frontend React (Vite) cho hệ thống quản lý chuỗi đại lý phân bón "AgriFert" — 5 vai trò (ADMIN, MANAGER, STORE_MANAGER, STAFF, CUSTOMER), chạy độc lập bằng mock API mặc định, có khả năng nối backend thật qua 1 biến môi trường. Backend thật **không nằm trong repo này** — do đội/repo khác phụ trách; phạm vi công việc ở đây giới hạn ở frontend. Đọc [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) trước tiên.

## Điểm vào chính của code

- `index.html` → `src/main.jsx` (mount `BrowserRouter` + `App` + `Toaster`) → `src/App.jsx` (toàn bộ khai báo route).
- Route công khai vào layout tương ứng: `CustomerLayout` (site khách hàng) hoặc `DashboardLayout` (nội bộ, bọc trong `ProtectedRoute` theo `role`).

## Module quan trọng

- `src/config/api.js` — toàn bộ endpoint REST kỳ vọng + hàm gọi API dùng chung. **Đọc file này đầu tiên** khi cần hiểu app "nói chuyện" với backend như thế nào.
- `src/config/axiosClient.js` — auth interceptor, refresh token, chuyển mock/thật.
- `src/mocks/mockServer.js` — toàn bộ dữ liệu giả, cần sửa khi muốn thêm/đổi kịch bản test UI mà không cần backend thật.
- `src/stores/authStore.js` — nguồn sự thật cho trạng thái đăng nhập/role hiện tại, dùng ở hầu hết mọi nơi cần biết "user là ai".
- `src/constraints/index.js` — hằng số dùng toàn app, xem trước khi thêm hằng số mới ở nơi khác (tránh trùng lặp).

## Cách chạy local

```bash
npm install
cp .env.example .env
npm run dev
```

Xem đầy đủ + tài khoản test: [SETUP_GUIDE.md](SETUP_GUIDE.md).

## Cách deploy

Vercel, cấu hình SPA rewrite trong `vercel.json`. Chi tiết + rủi ro cần kiểm tra trước khi deploy (đặc biệt `VITE_USE_MOCK_API`): [DEPLOYMENT.md](DEPLOYMENT.md).

## Dịch vụ bên thứ ba

Firebase Authentication, VNPay, MoMo, Geoapify (bản đồ). Chi tiết trạng thái tích hợp từng dịch vụ: [TECH_STACK.md](TECH_STACK.md) mục cuối.

## Rủi ro đã biết / Technical debt

1. **`localStorage` key `"capital-coffee-auth"`** và các cụm "coffee" còn sót trong ~12 file — dấu vết code tái sử dụng từ dự án khác, chưa dọn (quyết định có chủ đích, xem [DECISIONS.md](DECISIONS.md) ADR-003, không tự sửa nếu chưa có task riêng).
2. **2 thư viện toast** (`react-hot-toast` + `react-toastify`) và **2 thư viện chart** (`chart.js` + `recharts`, kèm 2 file `RevenueChart.jsx` trùng tên ở `components/dashboard/` và `components/ui/`) cùng tồn tại — cần xác nhận bản nào là chuẩn trước khi hợp nhất.
3. **Không có test tự động** — xem [TESTING.md](TESTING.md).
4. **Node.js version chưa pin**, không có CI/CD (`.github/workflows/` không tồn tại).
5. **3 file rác ở root** (`eslint.txt`, `eslint.utf8.txt`, `eslint_output.json`) — có vẻ là output cũ, chưa xác nhận có cần giữ.
6. `@stomp/stompjs`/`sockjs-client` có trong dependency nhưng chưa xác nhận được dùng thực tế ở đâu — cần rà soát trước khi coi là kiến trúc đang hoạt động hoặc gỡ bỏ.
7. `src/config/api.js` là **giả định về backend thật**, chưa được đội backend xác nhận từng field/endpoint — rủi ro lệch contract khi tích hợp thật (`VITE_USE_MOCK_API=false`).

## Việc còn dang dở

Không có task code nào dang dở tại thời điểm bàn giao tài liệu này (2026-08-04) — chỉ mới thiết lập xong bộ tài liệu quản lý ngữ cảnh. Xem [TASKS.md](TASKS.md) mục Backlog cho việc tiếp theo đã biết.

## Checklist bàn giao

- [x] Đọc `CLAUDE.md`, `PROJECT_CONTEXT.md`, `CURRENT_STATE.md`, `TASKS.md`.
- [x] Clone được repo, chạy `npm install && npm run dev` thành công với mock API.
- [ ] Đăng nhập thử cả 5 vai trò bằng tài khoản test (xem SETUP_GUIDE.md) — **cần người tiếp quản tự thực hiện và xác nhận**.
- [ ] Chạy `npm run lint` và `npm run build`, xác nhận không có lỗi mới — **chưa chạy trong phiên thiết lập tài liệu này, xem TASK-002**.
- [ ] Xác nhận với đội backend thật về tính chính xác của `docs/backend/API_CONTRACT.md`.
- [ ] Đọc kỹ mục "Rủi ro đã biết / Technical debt" ở trên trước khi bắt đầu sửa code.
