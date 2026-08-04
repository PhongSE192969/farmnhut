# AUTHORIZATION — Phân quyền

_Cập nhật: 2026-08-04_

## Cơ chế thực tế trong frontend (đã xác nhận từ code)

Phân quyền ở tầng frontend là **role-based theo route**, không phải permission-based chi tiết (dù dữ liệu mock có mô hình permission dạng route+method — xem [BUSINESS_RULES.md](BUSINESS_RULES.md) — UI hiện tại chưa dùng nó để ẩn/hiện chức năng chi tiết, chỉ dùng `role` ở cấp route).

### `ProtectedRoute` (`src/routes/ProtectedRoute.jsx`)

- Nhận prop `role` (string hoặc mảng string) = vai trò được phép truy cập route.
- Chờ `authStore.hasHydrated` trước khi quyết định (tránh flash sai trạng thái khi vừa reload trang).
- Nếu chưa đăng nhập (`!isAuthenticated || !user`) → redirect tới `/login` (nếu route chỉ cho `CUSTOMER`) hoặc `/admin/login` (mọi trường hợp còn lại).
- Nếu đã đăng nhập nhưng role không khớp `allowedRoles` → redirect tới dashboard đúng role hiện tại của user (không phải trang lỗi 403 — user luôn được đưa về nơi họ *có quyền*, không thấy màn "Access Denied" riêng).

### Ma trận route → role (trích từ `src/App.jsx`)

| Route prefix | Role yêu cầu |
|---|---|
| `/profile` | `CUSTOMER` |
| `/manager/**` | `MANAGER` |
| `/admin/**` | `ADMIN` |
| `/store-manager/**` | `STORE_MANAGER` |
| `/staff/**` | `STAFF` |
| Còn lại (`/home`, `/products`, `/checkout`...) | Công khai |

Không có route nào cho phép nhiều role cùng lúc (`role` luôn là 1 giá trị string trong `App.jsx` hiện tại, dù `ProtectedRoute` đã hỗ trợ mảng) — nếu cần route dùng chung cho nhiều role (vd. `MANAGER` và `ADMIN` cùng xem 1 trang), phải chủ động dùng `role={["MANAGER", "ADMIN"]}`.

### `authStore` — helper kiểm tra quyền

`hasRole(roles)`, `isAdmin()`, `isManager()`, `isStoreManager()`, `isStaff()`, `isCustomer()`, `hasGlobalAccess()` (ADMIN/MANAGER), `hasStoreAccess()` (STORE_MANAGER/STAFF + có `franchiseId`), `isInternalUser()` (mọi role trừ CUSTOMER). Dùng các helper này trong component thay vì so sánh `user.role` thủ công.

## Điều **chưa có** ở tầng frontend

- Không có kiểm tra quyền ở cấp **hành động cụ thể trong trang** (vd. trong `UserManagement.jsx`, không thấy ẩn nút "Xoá user" dựa theo permission chi tiết — chỉ có kiểm soát ở cấp route/trang). Nếu nghiệp vụ thật cần phân quyền mịn hơn theo permission (như mô hình mock gợi ý), đây là việc cần làm thêm — **ngoài phạm vi đã implement hiện tại**.
- Không có cơ chế permission lấy từ backend rồi cache ở frontend để dùng cho UI (chưa thấy gọi `GetPermissions`/`GetRoles` để build menu động — `NAV_CONFIG` hiện là cấu hình tĩnh trong code, không phải theo permission trả về từ API).

## Authorization thật ở tầng backend

**Ngoài phạm vi repo này.** Frontend chỉ kiểm soát UI/UX (ẩn route, redirect) — không thể coi là lớp bảo mật thật sự. Mọi endpoint nhạy cảm phải được backend thật tự kiểm tra quyền độc lập với những gì frontend hiển thị (nguyên tắc "không tin dữ liệu/quyết định từ client" — xem SECURITY.md). Đây là giả định an toàn tiêu chuẩn, **cần xác nhận với đội backend** rằng mọi endpoint trong [API_CONTRACT.md](API_CONTRACT.md) đều có kiểm tra quyền phía server tương ứng với role/franchise của token gửi lên.
