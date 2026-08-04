# TECH_STACK — Công nghệ sử dụng

_Cập nhật: 2026-08-04, dựa trên `package.json` hiện tại trong repo._

## Ngôn ngữ & runtime

| Mục | Giá trị | Ghi chú |
|---|---|---|
| Ngôn ngữ | JavaScript (JSX), 1 file TypeScript (`src/hooks/useSSE.ts`) | Không có `tsconfig.json` — dự án chủ yếu JS thuần, TS chỉ xuất hiện lẻ tẻ |
| Node.js | Chưa xác định/chưa pin | Không có `.nvmrc` hay `engines` trong `package.json`. Khuyến nghị Node LTS ≥ 18.18 (yêu cầu tối thiểu của Vite 7) — **cần xác nhận với người phụ trách môi trường** |
| Package manager | npm | Có `package-lock.json`, không có `yarn.lock`/`pnpm-lock.yaml` |

## Frontend framework & build

| Mục | Version (package.json) | Lý do lựa chọn |
|---|---|---|
| React | ^19.2.0 | Đã có sẵn khi tiếp nhận dự án — chưa rõ lý do ban đầu |
| React DOM | ^19.2.0 | |
| Vite | ^7.2.4 | Build tool, dev server nhanh |
| @vitejs/plugin-react | ^5.2.0 | Fast Refresh cho React (Babel-based, không dùng SWC) |
| React Router DOM | ^6.30.3 | Routing, khai báo toàn bộ route trong `src/App.jsx` |
| Tailwind CSS | ^3.4.4 | Styling utility-first, cấu hình tại `tailwind.config.js` + `postcss.config.js` |

## State management

| Mục | Version | Ghi chú |
|---|---|---|
| Zustand | ^5.0.11 | Toàn bộ store trong `src/stores/`, dùng middleware `persist` cho `authStore` (localStorage key `capital-coffee-auth` — xem DECISIONS.md ADR-003) |

## Networking & Auth

| Mục | Version | Ghi chú |
|---|---|---|
| Axios | ^1.13.6 | `src/config/axiosClient.js` — có interceptor gắn Firebase token, tự refresh khi 401 |
| Firebase | ^12.12.1 | Chỉ dùng `firebase/auth` (`getAuth`) trong `src/config/firebase.config.js`, chưa thấy dùng Firestore/Storage |
| @stomp/stompjs + sockjs-client | ^7.3.0 / ^1.6.1 | Khai báo trong dependency nhưng **chưa xác nhận** đã được dùng thực tế ở đâu trong `src/` — cần rà soát khi động tới realtime |

## UI/UX phụ trợ

| Mục | Version | Dùng cho |
|---|---|---|
| lucide-react | ^0.460.0 | Icon set toàn app |
| framer-motion | ^11.18.2 | Animation |
| clsx | ^2.1.1 | Ghép class Tailwind có điều kiện |
| react-hot-toast | ^2.6.0 | Toast chính (đăng ký ở `main.jsx`) |
| react-toastify | ^11.0.5 | Có cài nhưng **trùng chức năng với react-hot-toast** — cần xác nhận đang dùng cái nào là chuẩn, tránh 2 hệ thống toast song song |

## Biểu đồ & bản đồ

| Mục | Version | Dùng cho |
|---|---|---|
| chart.js + react-chartjs-2 | ^4.5.1 / ^5.3.1 | Biểu đồ (RevenueChart...) |
| recharts | ^3.8.0 | Biểu đồ — **trùng chức năng với chart.js**, cần xác nhận chuẩn hoá về 1 thư viện khi tối ưu |
| leaflet + react-leaflet | ^1.9.4 / ^5.0.0 | Bản đồ chọn vị trí đại lý (`MapPickerModal`, `MapGeoApiFyModal`) |
| Geoapify | — (gọi qua fetch/API key, không phải npm package) | Địa lý hoá địa chỉ, dùng cùng leaflet |

## Lint & format

| Mục | Version | Ghi chú |
|---|---|---|
| ESLint | ^9.39.1 | Flat config (`eslint.config.js`), `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` |
| Prettier hoặc format tool khác | Không có | Không tìm thấy cấu hình Prettier/`.editorconfig` — **cần xác nhận** có muốn thêm không |

Kiểm tra version đang cài: `npm ls <package>` hoặc mở `package-lock.json`.

## Testing framework

Chưa xác định — không có Jest/Vitest/Testing Library nào trong `devDependencies`. Xem [TESTING.md](TESTING.md).

## Deployment

Vercel (có `vercel.json` với SPA rewrite `/(.*) → /index.html`). Xem [DEPLOYMENT.md](DEPLOYMENT.md).

## Database / ORM / Backend framework / Storage

Chưa xác định trong repo này — nằm ngoài phạm vi (xem [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md), [DECISIONS.md](DECISIONS.md) ADR-002).

## Dịch vụ bên thứ ba đã tích hợp/định hướng tích hợp

| Dịch vụ | Trạng thái | Ghi chú |
|---|---|---|
| Firebase Authentication | Tích hợp (có mock fallback) | `src/config/firebase.config.js` |
| VNPay, MoMo | Có asset (`public/vnpay*.png`, `public/momo.png`) + `paymentService.js`, `PAYMENT` endpoints | Chưa xác nhận đã tích hợp SDK/redirect flow thật hay chỉ UI |
| Geoapify | Có asset + `MapGeoApiFyModal` | Cần API key thật khi tắt mock — biến môi trường tương ứng **chưa thấy khai báo** trong `env.js`, cần bổ sung khi làm task liên quan |
| AI search/recommend | `aiApi` trong `src/config/api.js` | Backend AI service cụ thể (mô hình, hạ tầng) — chưa xác định, ngoài phạm vi frontend |
