# API_CONTRACT — Hợp đồng API (suy ra từ frontend)

_Cập nhật: 2026-08-04_

> **⚠️ Nguồn của tài liệu này**: toàn bộ nội dung dưới đây được trích xuất từ `src/config/api.js` — tức là **những gì frontend kỳ vọng backend cung cấp**, KHÔNG phải tài liệu chính thức do đội backend xác nhận. Backend thật nằm ngoài repo này (xem [PROJECT_CONTEXT.md](../PROJECT_CONTEXT.md), [DECISIONS.md](../DECISIONS.md) ADR-002). Trước khi dựa vào bảng này để code tính năng nối backend thật (`VITE_USE_MOCK_API=false`), **phải đối chiếu với đội backend** — có thể lệch path, field, status code.

## Quy ước chung (áp dụng cho mọi endpoint trừ khi ghi chú khác)

- **Base URL**: `/api` (proxy tới `VITE_BASE_URL` khi tắt mock — xem `vite.config.js`).
- **Auth**: header `Authorization: Bearer <Firebase ID token>`, tự gắn bởi `axiosClient` interceptor. Endpoint trong nhóm `PUBLIC` (trừ `login`) dùng `publicAxiosClient` (không gắn token).
- **Success response**: **Chưa xác định** cấu trúc chuẩn — code frontend xử lý linh hoạt nhiều dạng (`res?.data?.data || res?.data || res`, xem `authService.js extractData()`), gợi ý backend có thể bọc response trong `{ data: ... }` nhưng không phải mọi endpoint đồng nhất.
- **Error response**: `apiCall()` (api.js) đọc `error.response?.data?.message` làm message hiển thị — gợi ý backend trả lỗi dạng `{ message: string }`, nhưng **chưa xác nhận** structure đầy đủ (có `code`, `errors[]` chi tiết field hay không).
- **Status code**: chỉ có `401` được xử lý đặc biệt (thử refresh Firebase token, retry 1 lần, nếu vẫn lỗi thì logout) — các status khác (400/403/404/409/500) chưa có xử lý riêng ở tầng axios, để nguyên cho từng service/component xử lý.
- **Validation**: **Chưa xác định** — không thấy schema validation phía frontend trước khi gửi (xem CODE_CONVENTIONS.md mục Validation).
- **Versioning**: **Chưa xác định** — không thấy tiền tố version (`/v1/...`) trong path nào.

## Auth (`ENDPOINTS.PUBLIC` + sync flow thật trong `authService.js`)

| Method | Path | Mục đích | Ghi chú |
|---|---|---|---|
| POST | `/auth/sync-user` | Đồng bộ user Firebase với backend (dùng làm login/register thật) | Header `Authorization: Bearer <firebaseIdToken>`, body = profile data khi register |
| GET | `/auth/me` | Lấy user hiện tại bằng Firebase token | |
| POST | `/auth/login` | Login kiểu cũ | `Login()` trong `authService.js` hiện **không gọi endpoint này nữa** — đã chuyển sang Firebase flow. Giữ lại trong `ENDPOINTS` để tránh vỡ code cũ, cần xác nhận có thể xoá không |
| POST | `/auth/register` | Register kiểu cũ | Tương tự — có khả năng không còn dùng |
| POST | `/auth/verify` | Xác thực (flow cũ, giữ lại tránh vỡ import) | |
| POST | `/auth/resend-code` | Gửi lại mã xác thực | |
| POST | `/auth/forgot-password` | Quên mật khẩu | |
| POST | `/auth/forgot-password/confirm` | Xác nhận đặt lại mật khẩu | |
| POST | `/auth/logout` | Logout | `Logout()` trong `authService.js` hiện chỉ `return true`, **không thực sự gọi endpoint này** — cần xác nhận có cần gọi thật không |
| GET | `/auth/refresh` | Refresh token (flow cũ) | Flow refresh thật hiện tại dùng Firebase (`getCurrentFirebaseToken(true)`), không rõ endpoint này còn cần không |

## User / Identity (`ENDPOINTS.PROTECTED.USER`)

| Method | Path | Mục đích |
|---|---|---|
| GET | `/auth/users/profile` | Hồ sơ user |
| GET | `/auth/users/counts` | Đếm số lượng user |
| GET | `/auth/users` | Danh sách user |
| GET | `/auth/users/search` | Tìm kiếm user |
| POST | `/auth/users/bulk` | Lấy nhiều user theo danh sách ID |
| POST | `/auth/users` | Tạo user |
| POST | `/auth/change-password` | Đổi mật khẩu |
| PUT/PATCH | `/auth/users/{userId}/assign-role` | Gán vai trò |
| PUT/PATCH | `/auth/users/{userId}/update` | Cập nhật user |
| PUT/PATCH | `/auth/users/update-profile` | Cập nhật hồ sơ bản thân |
| DELETE | `/auth/users/delete-account/{userId}` | Xoá user |
| PUT/PATCH | `/auth/users/{userId}/update-status` | Đổi trạng thái user (active/inactive) |
| GET | `/auth/users/franchise/staff` | Danh sách nhân viên theo franchise |

Role & Permission: nhóm endpoint tương ứng nằm trong `identityService.js` (chưa đọc chi tiết trong phiên này — cần đọc khi làm task RoleManagement/PermissionFormModal).

## Products & Categories

| Method | Path | Mục đích |
|---|---|---|
| GET | `/products/getall`, `/products/get-all` | Danh sách sản phẩm (public/protected — 2 path khác nhau, cần xác nhận khác biệt) |
| GET | `/products/detail/{id}` | Chi tiết sản phẩm |
| GET | `/products/search` | Tìm kiếm sản phẩm |
| GET | `/products/filter` | Lọc sản phẩm (public) |
| POST | `/products` | Tạo sản phẩm |
| PUT/PATCH | `/products` | Cập nhật sản phẩm |
| DELETE | `/products/inactive/{id}` | Vô hiệu hoá sản phẩm (soft delete) |
| — | `/products` (deleteVariant) | Xoá variant sản phẩm — path giống create, phân biệt bằng method/payload, cần xác nhận |
| POST | `/uploads` | Upload ảnh sản phẩm |
| GET | `/products/categories/get-all` | Danh mục (public) |
| — | `/products/categories` | CRUD danh mục (protected) |
| PATCH | `/products/categories/update/{id}` | Cập nhật danh mục |
| DELETE | `/products/categories/delete/{id}` | Xoá danh mục |

## Inventory

| Method | Path | Mục đích |
|---|---|---|
| GET | `/inventory/franchise` | Tồn kho theo franchise |
| GET | `/inventory/low-stock` | Sản phẩm sắp hết hàng |
| GET/PUT | `/inventory/threshold` | Ngưỡng cảnh báo tồn kho |
| GET | `/inventory/search` | Tìm kiếm tồn kho |

### Restock request (`STORE_REQUESTS`)

| Method | Path | Mục đích |
|---|---|---|
| POST | `/inventory/requests` | Tạo yêu cầu nhập hàng |
| GET | `/inventory/requests` | Danh sách yêu cầu |
| GET | `/inventory/requests/{id}` | Chi tiết |
| GET | `/inventory/requests?franchiseId=...` | Theo franchise |
| GET | `/inventory/requests/status/{status}` | Theo trạng thái |
| GET | `/inventory/requests/pending` | Đang chờ duyệt |
| GET | `/inventory/requests/my-requests/{createdBy}[/status/{status}]` | Yêu cầu của tôi |
| PATCH | `/inventory/requests/{id}/approve?sourceLocationId=...&approvedBy=...` | Duyệt |
| PATCH | `/inventory/requests/{id}/ship?sourceLocationId=...` | Xuất kho |
| PATCH | `/inventory/requests/{id}/receive` | Nhận hàng |
| PATCH | `/inventory/requests/{id}/reject?reason=...` | Từ chối |

## Promotions

| Method | Path | Mục đích |
|---|---|---|
| GET | `/promotions` | Danh sách |
| GET | `/promotions/{id}` | Chi tiết |
| POST | `/promotions` | Tạo |
| PUT/PATCH | `/promotions/{id}` | Cập nhật |
| DELETE | `/promotions/{id}` | Xoá |
| GET | `/promotions/available?userId=&franchiseId=&orderValue=` | Khuyến mãi khả dụng cho 1 đơn |
| GET/POST/PUT | `/promotions/scopes[/{promotionId}][/{id}]` | Phạm vi áp dụng khuyến mãi |

## Orders

| Method | Path | Mục đích |
|---|---|---|
| POST | `/orders/create-order` | Tạo đơn |
| PUT | `/orders/{orderId}/assign-staff/{staffId}` | Gán nhân viên xử lý |
| PATCH | `/orders/{orderId}/status?status=&staffId=` | Cập nhật trạng thái đơn |
| GET | `/orders/franchise/{franchiseId}?page=&size=&status=&typeOrder=` | Đơn theo franchise |
| GET | `/orders/search?keyword=&franchiseId=` | Tìm kiếm đơn |
| GET | `/orders/status?page=&size=&status=&typeOrder=` | Đơn theo trạng thái (toàn hệ thống) |
| GET | `/orders/customer/{customerId}?page=&size=&status=` | Đơn theo khách hàng |
| GET | `/orders/detail/{orderId}` | Chi tiết đơn |
| DELETE | `/orders/{orderId}/abandon` | Huỷ/bỏ đơn |

## Cart

| Method | Path | Mục đích |
|---|---|---|
| GET | `/carts/online/{customerId}` | Giỏ hàng online |
| POST | `/carts/online/add` | Thêm vào giỏ online |
| PUT | `/carts/online/{customerId}/update/{variantId}` | Cập nhật số lượng |
| DELETE | `/carts/online/{customerId}/remove/{variantId}` | Xoá khỏi giỏ |
| POST | `/carts/pos/add` | Thêm vào giỏ POS |
| GET | `/carts/pos/{terminalId}` | Giỏ POS theo terminal |
| DELETE | `/carts/pos/{terminalId}/remove/{productId}` | Xoá khỏi giỏ POS |

## Franchise

| Method | Path | Mục đích |
|---|---|---|
| GET | `/franchises`, `/franchises/get-all`, `/franchises/get-active` | Danh sách (toàn bộ/active) |
| GET | `/franchises/{id}` | Chi tiết |
| POST | `/franchises` | Tạo |
| PUT/PATCH | `/franchises/{id}` | Cập nhật |
| DELETE | `/franchises/{id}` | Xoá |
| PUT/PATCH | `/franchises/{id}/status` | Đổi trạng thái |
| GET | `/franchises/status/{status}` | Theo trạng thái |
| — | `/franchises/events` | Có thể là SSE/stream sự kiện franchise — **chưa xác nhận**, liên quan `src/hooks/useSSE.ts` |

## Shifts

| Method | Path | Mục đích |
|---|---|---|
| GET | `/shifts/franchise/{franchiseId}` | Danh sách ca theo franchise |
| POST | `/shifts` | Tạo cấu hình ca |
| PUT | `/shifts/{id}` | Cập nhật |
| DELETE | `/shifts/{id}` | Xoá |
| POST | `/shifts/assignments` | Xếp lịch (gán nhân viên vào ca) |
| PUT | `/shifts/assignments/{assignmentId}` | Cập nhật lịch |
| GET | `/shifts/assignments?date=&staffId=` | Lịch theo ngày |
| GET | `/shifts/assignments/range?staffId=&startDate=&endDate=` | Lịch theo khoảng ngày |
| PUT | `/shifts/assignments/{id}/check-in` | Check-in |
| PUT | `/shifts/assignments/{id}/check-out` | Check-out |
| PUT | `/shifts/assignments/{id}/absent` | Đánh dấu vắng |
| GET | `/shifts/statistics?date=` | Thống kê theo ngày |
| GET | `/shifts/statistics/{staffId}` | Thống kê cá nhân |
| GET | `/shifts/attendance/incomplete?date=` | Ca chưa hoàn tất |
| GET | `/shifts/attendance/summary?date=` | Tổng hợp chấm công |
| — | `/shifts/events` | SSE/stream — liên quan `useSSE.ts`, **chưa xác nhận** |

## Payment / Delivery

| Method | Path | Mục đích |
|---|---|---|
| — | `/payments/option`, `/payments/get-method` | Phương thức thanh toán |
| GET | `/payments/status/{id}` | Trạng thái thanh toán |
| GET | `/payments/{id}/get-transaction` | Chi tiết giao dịch |
| GET | `/payments/pay-url/{id}` | URL thanh toán (redirect VNPay/MoMo — **chưa xác nhận flow chi tiết**) |
| GET | `/delivery/getall` | Danh sách giao hàng |
| GET | `/delivery/get-by-order-id/{orderId}` | Giao hàng theo đơn |
| POST | `/delivery/create` | Tạo giao hàng |
| PUT | `/delivery/update/{deliveryId}` | Cập nhật |

## AI

| Method | Path | Mục đích |
|---|---|---|
| POST | `/ai/search` | Semantic search |
| POST | `/ai/update` | Cập nhật vector store |
| POST | `/ai/translate` | Dịch text |
| POST | `/ai/recommendsystem` | Lấy gợi ý sản phẩm |
| POST | `/ai/recommend/train` | Train model (async) |
| POST | `/ai/recommend/train/sync` | Train model (sync) |
| GET | `/ai/recommend/status` | Trạng thái train |
| POST | `/ai/recommend/similar` | Sản phẩm tương tự |
| GET/POST | `/ai/config` | Đọc/cập nhật cấu hình AI |

## Reports / Customer / Admin (tổng quát)

| Method | Path | Mục đích |
|---|---|---|
| GET | `/reports/dashboard` | Dashboard báo cáo (có tham số `from`/`to`/`franchiseId`) |
| — | `/reports/events` | SSE/stream — chưa xác nhận |
| GET | `/customers/get-all`, `/customers/admin/all`, `/customers/franchise/all` | Danh sách khách hàng theo phạm vi truy cập |
| GET | `/customers/admin/search`, `/customers/franchise/search`, `/customers/search`, `/customers/searching` | Nhiều biến thể tìm kiếm khách hàng — **chưa xác nhận khác biệt**, khả năng có endpoint cũ chưa dọn |
| — | `/customers/{id}`, `/customers/customer-franchise` | Chi tiết/cập nhật/xoá khách hàng, theo franchise |
| — | `/admin/dashboard`, `/admin/users`, `/admin/branches`, `/admin/reports` | Nhóm `ADMIN` legacy trong `ENDPOINTS` — **chưa xác nhận còn dùng hay đã thay bằng nhóm khác (REPORTS, USER...)** |

## Việc cần làm khi tích hợp backend thật

1. Đối chiếu từng nhóm ở trên với tài liệu/Swagger của backend thật.
2. Đánh dấu endpoint nào không tồn tại/đã đổi path.
3. Xác nhận cấu trúc success/error response chuẩn, cập nhật `apiCall()`/`extractData()` nếu cần.
4. Cập nhật lại file này thành nguồn xác nhận, bỏ nhãn "suy ra từ code".
