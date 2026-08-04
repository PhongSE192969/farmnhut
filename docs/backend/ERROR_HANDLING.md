# ERROR_HANDLING — Xử lý lỗi

_Cập nhật: 2026-08-04. Mô tả cách **frontend** xử lý lỗi khi gọi API (thật hoặc mock) — không mô tả cách backend thật tạo ra lỗi (ngoài phạm vi)._

## Tầng axios (`src/config/axiosClient.js`)

- 2 instance: `axiosClient` (có interceptor auth + retry) và `publicAxiosClient` (không retry, chuẩn hoá lỗi đơn giản hơn).
- **`axiosClient` — lỗi 401**: nếu request gốc chưa `_retry`, thử lấy Firebase ID token mới (`getCurrentFirebaseToken(true)`), gắn lại header, retry request đó **đúng 1 lần**. Nếu đang có 1 request khác cũng đang refresh (`isRefreshing`), các request 401 tiếp theo được xếp hàng (`failedQueue`) chờ token mới thay vì refresh trùng lặp. Nếu refresh thất bại: `authStore.logout()`, xoá `localStorage["capital-coffee-auth"]`, redirect theo path hiện tại (`/admin/*` → `/admin/login`, còn lại → `/login`).
- **`axiosClient` — lỗi khác 401**: reject nguyên trạng, không xử lý tập trung — để service/component tự bắt.
- **`publicAxiosClient`**: mọi lỗi được chuẩn hoá thành `{ ...error.response?.data, status, message }` trước khi reject — không có logic retry.

## Tầng `apiCall()` (`src/config/api.js`)

Bọc quanh cả 2 axios instance. Khi lỗi:

```js
const errorMessage = error.response?.data?.message || error.message || "API Call Failed";
console.error(`❌ API Error [${method}] ${endpoint}:`, errorMessage);
if (error instanceof Error) error.message = errorMessage;
throw error;
```

→ Message hiển thị cho người dùng ưu tiên lấy từ `error.response.data.message` (giả định backend luôn trả field `message` khi lỗi — **cần xác nhận với backend thật**, nếu không có field này thì message sẽ rơi về `error.message` mặc định của Axios, thường không thân thiện với người dùng cuối, vd. "Request failed with status code 400").

## Tầng service (`src/services/*.js`)

Pattern lặp lại: `try { ... } catch (error) { console.error("<ngữ cảnh>:", error); throw error; }` — không nuốt lỗi, luôn re-throw để tầng UI xử lý hiển thị.

## Tầng UI (`pages/`, `components/`)

Hiển thị lỗi qua `react-hot-toast` (`toast.error(...)`) — pattern thấy trong `DashboardLayout.jsx`, `CustomerLayout.jsx` cho logout flow. **Chưa xác nhận** mức độ nhất quán ở toàn bộ ~90 trang (không đọc hết trong phiên phân tích này) — khi sửa 1 trang, kiểm tra trang đó có xử lý lỗi hiển thị cho người dùng hay chỉ log console.

## Ngoại lệ cố ý (không phải bug)

Logout flow (`handleLogout` trong cả 2 layout) cố tình bắt lỗi từ `firebaseLogout()` và `Logout()` (backend) riêng biệt, `console.warn` rồi **vẫn tiếp tục** xoá local state + điều hướng — vì mục tiêu là đảm bảo người dùng luôn thoát được khỏi phiên hiện tại ở phía client dù 1 trong 2 lời gọi logout thất bại. Không coi đây là "catch rỗng" vi phạm CODE_CONVENTIONS.md.

## Việc cần backend xác nhận

- Cấu trúc lỗi chuẩn (`{ message, code?, errors?[] }`) cho mọi endpoint — hiện frontend chỉ giả định có `message`.
- Danh sách status code có ý nghĩa nghiệp vụ riêng ngoài 401 (vd. 403 khi sai quyền theo franchise, 409 khi conflict tồn kho...) để frontend có thể xử lý UX tốt hơn thay vì hiển thị message chung chung.
