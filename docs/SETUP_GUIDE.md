# SETUP_GUIDE — Hướng dẫn setup từ máy mới

_Cập nhật: 2026-08-04_

## Phần mềm cần cài

- Node.js — bản LTS gần nhất tương thích Vite 7 (≥ 18.18). **Chưa pin version chính thức trong repo**, cần xác nhận với team trước khi cấu hình CI.
- npm (đi kèm Node.js). Repo dùng `package-lock.json` — không dùng yarn/pnpm.
- Git.

## Clone / mở project

```bash
git clone https://github.com/PhongSE192969/farmnhut.git
cd farmnhut
```

(Trong máy hiện tại, thư mục đã clone sẵn tại `D:\Work Mericy\Agency\web chú nhựt`.)

## Tạo file môi trường

```bash
cp .env.example .env
```

Mặc định chạy được ngay với mock API mà không cần chỉnh gì. Chỉ cần điền các biến `VITE_FIREBASE_*` và set `VITE_USE_MOCK_API=false` khi muốn nối vào backend thật — xem [.env.example](../.env.example) để biết ý nghĩa từng biến.

## Cài dependency

```bash
npm install
```

## Khởi tạo database / chạy migration

Không áp dụng cho repo này — không có database trong phạm vi frontend. Xem [docs/database/DATA_MODEL.md](database/DATA_MODEL.md).

## Chạy frontend

```bash
npm run dev
```

Mặc định chạy tại `http://127.0.0.1:5173` (cấu hình cố định host/port trong `package.json` script và `vite.config.js`, `--strictPort` nên sẽ báo lỗi thay vì tự đổi port nếu 5173 đang bận).

## Chạy backend

Không áp dụng — backend thật nằm ngoài repo này (xem PROJECT_CONTEXT.md). Nếu cần trỏ frontend sang backend thật đang chạy local, set trong `.env`:

```bash
VITE_USE_MOCK_API=false
VITE_BASE_URL=http://localhost:<port-backend-that>
```

Khi đó `vite.config.js` sẽ tự bật dev proxy `/api → VITE_BASE_URL`.

## Tài khoản test (mock)

Dùng khi `VITE_USE_MOCK_API=true` (mặc định), đăng nhập qua `/login` (customer) hoặc `/admin/login` (nội bộ):

| Email | Mật khẩu | Vai trò |
|---|---|---|
| admin@agrifert.vn | 123456 | ADMIN |
| manager@agrifert.vn | 123456 | MANAGER |
| store@agrifert.vn | 123456 | STORE_MANAGER |
| staff@agrifert.vn | 123456 | STAFF |
| customer@agrifert.vn | 123456 | CUSTOMER |

Lưu ý: đây là tài khoản để test luồng UI theo vai trò trong môi trường mock, không phải tài khoản trên hệ thống backend thật.

## Chạy test

Chưa có test suite — xem [TESTING.md](TESTING.md).

## Lint & build

```bash
npm run lint
npm run build
npm run preview   # xem thử bản build production
```

## Lỗi setup thường gặp

| Triệu chứng | Nguyên nhân khả dĩ | Cách xử lý |
|---|---|---|
| `npm run dev` báo lỗi port 5173 đang dùng | Script dùng `--strictPort`, không tự chuyển port | Tắt tiến trình đang chiếm port 5173, hoặc sửa tạm `--port` trong `package.json` script `dev` (nhớ revert nếu chỉ test tạm) |
| Đăng nhập không thấy dữ liệu gì / lỗi mạng liên tục dù đang mock | Quên set lại `.env` sau khi từng set `VITE_USE_MOCK_API=false` | Kiểm tra `.env`, đảm bảo `VITE_USE_MOCK_API` khác `"false"` hoặc không set |
| Cảnh báo "Missing Firebase environment variables" trên console | Đang tắt mock (`VITE_USE_MOCK_API=false`) nhưng chưa điền `VITE_FIREBASE_*` | Điền đủ 6 biến Firebase trong `.env`, lấy từ Firebase Console của dự án thật (**cần xác nhận ai giữ project Firebase thật**) |
