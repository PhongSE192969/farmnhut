# AgriFert Frontend

Frontend React cho hệ thống quản lý chuỗi đại lý/franchise vật tư nông nghiệp — phân bón ("AgriFert"). Gồm 2 mảng: site bán hàng cho khách hàng (customer) và hệ thống vận hành nội bộ đa vai trò (ADMIN, MANAGER, STORE_MANAGER, STAFF).

> Phạm vi của repo này: **chỉ frontend**. Backend thật do đội/repo khác phụ trách — xem [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md).

## Chức năng chính

- **Khách hàng**: trang chủ, danh sách/chi tiết sản phẩm, tìm kiếm, giỏ hàng, checkout (thông tin giao hàng + thanh toán VNPay/MoMo), tra cứu đơn hàng, hồ sơ + lịch sử/điểm loyalty.
- **Admin**: quản lý user, vai trò & phân quyền, đại lý (franchise), tồn kho, danh mục/sản phẩm, khuyến mãi, khách hàng & loyalty, cấu hình AI (search/recommend).
- **Manager** (quản lý tổng): dashboard, đơn hàng, danh mục/sản phẩm, tồn kho, khuyến mãi, nhân sự & lịch ca, báo cáo loyalty, đại lý, khách hàng.
- **Store Manager / Staff**: vận hành 1 đại lý — nhân sự, khách hàng, lịch ca, danh mục/sản phẩm, đơn hàng, khuyến mãi, tồn kho, tạo đơn tại quầy (POS), checkout.

Danh sách trang đầy đủ: [docs/frontend/PAGE_INVENTORY.md](docs/frontend/PAGE_INVENTORY.md).

## Công nghệ chính

React 19 · Vite 7 · Tailwind CSS 3 · React Router 6 · Zustand · Axios · Firebase Authentication · Chart.js/Recharts · Leaflet + Geoapify (bản đồ) · react-hot-toast/react-toastify.

Chi tiết & lý do lựa chọn: [docs/TECH_STACK.md](docs/TECH_STACK.md).

## Cấu trúc source code

```text
src/
├── assets/          # ảnh/svg tĩnh dùng trong component
├── components/      # UI dùng chung: customer, dashboard, form, modal, order, ui
├── config/          # axios client, endpoint map (api.js), env, firebase config
├── constraints/      # hằng số dùng toàn app: ROLES, ORDER_STATUS, HTTP_METHODS...
├── hooks/           # custom hook (useSSE)
├── layouts/         # CustomerLayout, DashboardLayout (khung trang theo vai trò)
├── locales/         # i18n: vi, en, jp
├── mocks/           # mock server (axios adapter) + mock config
├── navigations/     # cấu hình menu sidebar theo từng vai trò
├── pages/           # trang theo vai trò: admin, auth, customer, manager, staff, storeManager
├── routes/          # ProtectedRoute (role-based routing)
├── services/        # gọi API theo domain (auth, product, order, inventory...)
├── stores/          # Zustand store: auth, cart, order, product, franchise...
└── utils/           # helper, error handler, mock data
```

Xem thêm: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/frontend/COMPONENT_INVENTORY.md](docs/frontend/COMPONENT_INVENTORY.md), [docs/frontend/STATE_MANAGEMENT.md](docs/frontend/STATE_MANAGEMENT.md).

## Điều kiện cần trước khi chạy

- Node.js — phiên bản cụ thể **chưa xác định/chưa pin** trong repo (không có `.nvmrc`/`engines`). Khuyến nghị dùng Node LTS tương thích Vite 7 (≥ 18.18). Xác nhận với người phụ trách môi trường trước khi setup máy CI/CD.
- npm (dự án dùng `package-lock.json`).

## Cài đặt và chạy local

```bash
npm install
cp .env.example .env   # rồi chỉnh giá trị nếu cần (mặc định chạy được ngay với mock API)
npm run dev             # http://127.0.0.1:5173
```

Mặc định `VITE_USE_MOCK_API` không set = `true` → toàn bộ API được giả lập bởi `src/mocks/mockServer.js`, không cần backend thật để chạy UI. Xem [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md) để biết cách trỏ sang backend thật.

Tài khoản test (mock): xem [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md#tài-khoản-test-mock).

## Test, lint, build

```bash
npm run lint      # ESLint (flat config, react-hooks + react-refresh rules)
npm run build     # Vite production build
npm run preview   # xem thử bản build
```

Chưa có test suite tự động trong repo — xem [docs/TESTING.md](docs/TESTING.md).

## Tài liệu chi tiết

| Chủ đề | File |
|---|---|
| Bối cảnh sản phẩm/kinh doanh | [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md) |
| Trạng thái hiện tại | [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md) |
| Kiến trúc | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| Quy ước code | [docs/CODE_CONVENTIONS.md](docs/CODE_CONVENTIONS.md) |
| Setup máy mới | [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md) |
| Deploy (Vercel) | [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) |
| Bảo mật | [docs/SECURITY.md](docs/SECURITY.md) |
| Bàn giao | [docs/HANDOVER.md](docs/HANDOVER.md) |
| API contract (suy ra từ code) | [docs/backend/API_CONTRACT.md](docs/backend/API_CONTRACT.md) |
