# CODE_CONVENTIONS — Quy ước code

_Cập nhật: 2026-08-04. Quy ước được rút ra bằng cách quan sát code hiện có trong repo — không phải chuẩn được viết sẵn từ đầu dự án, nên có một số điểm **không nhất quán đã biết** được ghi rõ bên dưới thay vì che giấu._

## Đặt tên file & thư mục

- Component React (`.jsx`): PascalCase, trùng tên default export — ví dụ `ProductCard.jsx`, `DashboardLayout.jsx`.
- Trang (`src/pages/<role>/...`): PascalCase, đặt trong thư mục con theo vai trò (`admin`, `manager`, `storeManager`, `staff`, `customer`, `auth`).
- Service (`src/services/*.js`): camelCase kết thúc bằng `Service`/`Api` — ví dụ `authService.js`, `loyaltyApi.js` (không nhất quán 100% giữa "Service" và "Api", giữ theo file đã có, không đổi tên hàng loạt nếu không có task riêng).
- Store Zustand (`src/stores/*.js`): camelCase, phần lớn có tiền tố `use` — ví dụ `useProductStore.js`; ngoại lệ: `authStore.js`, `cartStore.js`, `orderStore.js`, `shiftStore.js`, `userStore.js` không có tiền tố `use` trong tên file (nhưng hook export vẫn là `useXxxStore`). **Không tự ý đổi tên file để "chuẩn hoá"** nếu chưa có task riêng — sẽ phá vỡ import ở nhiều nơi.
- Alias import: dùng `@/` cho `src/` (khai báo tại `vite.config.js` và `jsconfig.json`) — ưu tiên dùng alias thay vì đường dẫn tương đối dài (`../../../`).

## Quy tắc import

- Import React/thư viện ngoài trước, sau đó đến import nội bộ (`@/...`), theo thứ tự đã thấy trong hầu hết file hiện có.
- Không import ngược từ `pages/` vào `components/`, `stores/`, `services/` (xem ARCHITECTURE.md — "Dependency bị cấm").
- Export dùng named export cho service/store/util; `pages`/`layouts`/`components` dùng default export.

## Phân chia module

- Domain nghiệp vụ tách theo file trong `src/services/` (1 file/domain), không gộp nhiều domain vào 1 service file.
- Modal dùng chung đặt tại `src/components/modal/`, export tập trung qua `src/components/modal/index.js`.

## Xử lý type

Dự án dùng JS thuần (không TypeScript, trừ 1 file `.ts`). Không có PropTypes hay JSDoc type annotation phổ biến. Khi thêm function public/phức tạp, khuyến khích JSDoc ngắn mô tả tham số/trả về (xem ví dụ đã có trong `authService.js`) — không bắt buộc phải thêm TypeScript toàn bộ nếu chưa có quyết định riêng.

## Xử lý lỗi

- Trong `services/`: bọc `try/catch`, `console.error` kèm ngữ cảnh, rồi `throw error` tiếp lên trên (không nuốt lỗi âm thầm) — xem mẫu trong `authService.js`.
- Trong `components`/`pages`: bắt lỗi từ service call, hiển thị `toast.error(...)` (react-hot-toast), không để lỗi rơi ra console mà không có phản hồi UI cho người dùng thao tác.
- Ngoại lệ đã biết và chấp nhận được: logout flow (`DashboardLayout.jsx`, `CustomerLayout.jsx`) cố tình `catch` và tiếp tục (Firebase logout lỗi vẫn phải clear local state) — có `console.warn` giải thích, không phải lỗi bị nuốt vô cớ.

## Validation

Validate ở form trước khi gọi service (chưa thấy dùng thư viện validation chung như Zod/Yup/React Hook Form — form hiện tại tự quản lý state bằng `useState` và validate thủ công). Khi thêm form mới, giữ nhất quán với cách hiện có trừ khi có quyết định đổi sang thư viện validation, phải ghi ADR.

## Async code

Dùng `async/await` nhất quán (không thấy `.then()` chaining dài trong service layer, trừ vài chỗ dynamic `import()` như trong `App.jsx` để lazy-load `cartStore`).

## Logging

`console.log`/`console.error`/`console.warn` cho debug — **không** log token, mật khẩu, hoặc toàn bộ object user nhạy cảm. `src/config/api.js` hiện log khá nhiều (`console.log` mỗi request/response) — chấp nhận được cho môi trường dev/mock, nhưng cần bọc điều kiện `import.meta.env.DEV` khi dọn dẹp cho production (một số chỗ đã làm, một số chưa — không nhất quán, xem TASKS.md).

## Test

Chưa có convention vì chưa có test nào trong repo. Xem [TESTING.md](TESTING.md).

## Quy tắc comment

- Không comment giải thích code hiển nhiên.
- Bắt buộc comment khi: business rule ẩn (vd. tại sao `Logout()` trong `authService.js` chỉ `return true`), workaround (vd. alias `ConfirmForrgotPassword` để tránh vỡ import cũ bị typo), giới hạn API bên thứ ba, quyết định bảo mật.
- Giữ comment bằng tiếng Việt (đúng phong cách đã có trong `authStore.js`, `authService.js`, `DashboardLayout.jsx`) — nhất quán với phần còn lại của code.

## Ngôn ngữ dùng trong code và tài liệu

- Tên biến/hàm/component: tiếng Anh.
- Comment trong code: tiếng Việt (theo thực tế đã có).
- Tài liệu (`docs/`, `README.md`, `CLAUDE.md`): tiếng Việt, giữ thuật ngữ kỹ thuật bằng tiếng Anh.

## Vấn đề nhất quán đã biết (không tự ý "dọn" nếu chưa có task riêng)

- 2 thư viện toast cùng tồn tại: `react-hot-toast` (đang dùng ở `main.jsx`, hầu hết chỗ khác) và `react-toastify` (có cài, chưa rõ còn dùng ở đâu) — xem TECH_STACK.md.
- 2 thư viện chart cùng tồn tại: `chart.js`/`react-chartjs-2` và `recharts` — có cả `src/components/dashboard/RevenueChart.jsx` và `src/components/ui/RevenueChart.jsx` (2 file trùng tên khác thư mục) — cần xác nhận cái nào là bản dùng thật trước khi xoá cái còn lại.
- Tên hàm service pha trộn PascalCase (`Login`, `GetProfile`, `CreateOne`) và camelCase (`getAllProducts`, `categoryService`) — giữ theo file gốc, không đổi hàng loạt ngoài phạm vi task.
