# BUSINESS_RULES — Quy tắc nghiệp vụ (suy ra từ frontend)

_Cập nhật: 2026-08-04_

> Nguồn: suy ra từ `src/constraints/index.js`, `src/mocks/mockServer.js`, và luồng route/component trong `src/`. **Chưa được đội backend/nghiệp vụ xác nhận** — dùng để hiểu bối cảnh, không dùng làm đặc tả chính thức. Xem [PROJECT_CONTEXT.md](../PROJECT_CONTEXT.md).

## Vai trò & phạm vi truy cập dữ liệu

- 5 vai trò cố định: `ADMIN`, `MANAGER`, `STORE_MANAGER`, `STAFF`, `CUSTOMER` (`ROLES` trong `constraints/index.js`).
- `MANAGER` và `ADMIN` có `hasGlobalAccess()` = true — không bị giới hạn theo `franchiseId` (xem `authStore.js`).
- `STORE_MANAGER` và `STAFF` bắt buộc phải có `franchiseId` để có quyền truy cập (`hasStoreAccess()`) — gợi ý mọi thao tác của 2 vai trò này chỉ tác động trong phạm vi 1 đại lý.
- `CUSTOMER` không thuộc nhóm nội bộ (`isInternalUser()` loại trừ `CUSTOMER`).

## Đơn hàng

- Có 2 loại đơn: **Online** (khách tự đặt qua site customer) và **POS** (nhân viên tạo tại quầy) — phân biệt bằng `typeOrder` (xem `orderApi.getOrdersByFranchise`, mapping `"ONLINE"` → `"Online"`).
- Trạng thái đơn hàng dùng trong UI mock (`ORDER_STATUS` trong `constraints/index.js`): `pending`, `confirmed`, `preparing`, `shipping`, `completed`, `cancelled`. **Lưu ý**: các giá trị này viết thường, trong khi nhiều lệnh gọi API lại `.toUpperCase()` status trước khi gửi (`orderApi.updateStatus`, `getOrdersByFranchise`) — cần xác nhận backend thật dùng chuẩn hoa hay thường để tránh lệch.
- Đơn có thể bị "abandon" (huỷ bỏ, khác với "cancelled") — 2 khái niệm riêng, cần xác nhận ý nghĩa khác biệt với backend.

## Tồn kho & yêu cầu nhập hàng

- Tồn kho được scope theo `franchiseId`. Có khái niệm "kho chính" (`MAIN_WAREHOUSE_ID` cố định trong mock — `00000000-0000-0000-0000-000000000000`) làm nguồn điều chuyển hàng tới các đại lý.
- Restock request có luồng trạng thái: tạo → pending → approve (kèm `sourceLocationId`, `approvedBy`) → ship → receive, hoặc reject (kèm `reason`). Đây là quy trình duyệt 2 bước (duyệt rồi mới xuất kho), không phải duyệt 1 bước.
- Có ngưỡng cảnh báo tồn kho thấp (`inventory/low-stock`, `inventory/threshold`) — logic tính ngưỡng cụ thể (theo sản phẩm, theo franchise, hay global) **chưa xác định**.

## Khuyến mãi

- Khuyến mãi có khái niệm "scope" riêng (`promotions/scopes`) — gợi ý 1 khuyến mãi có thể áp dụng cho nhiều phạm vi (sản phẩm/danh mục/franchise cụ thể) thay vì áp dụng toàn hệ thống mặc định. Chi tiết mô hình scope **chưa xác định** — cần đọc `PromotionScopes`/service liên quan khi làm task.
- Có endpoint tính khuyến mãi khả dụng cho 1 đơn cụ thể theo `userId + franchiseId + orderValue` — gợi ý logic áp dụng khuyến mãi phụ thuộc cả khách hàng, đại lý và giá trị đơn.

## Phân quyền (permission model)

Dữ liệu mock (`mockServer.js`) mô tả permission theo dạng **route-based**: mỗi permission có `apiPath` (hỗ trợ wildcard `/**`) + `httpMethod` (hoặc `ALL`), không phải permission dạng CRUD trừu tượng (`create`/`read`/`update`/`delete` chung chung). Ví dụ: permission `PRODUCTS_MANAGE` gắn với `apiPath: "/products/**"`, `httpMethod: "ALL"`. Vai trò `ADMIN`/`MANAGER` mock có toàn bộ permission; các vai trò còn lại chỉ có tập con (`DASHBOARD_VIEW`, `ORDERS_MANAGE`, `INVENTORY_MANAGE`). **Đây là dữ liệu mock để dựng UI, chưa chắc phản ánh đúng mô hình phân quyền backend thật** — xem [AUTHORIZATION.md](AUTHORIZATION.md).

## Ca làm việc

- 3 loại ca cố định trong mock (`SHIFT_TYPES`): Ca sáng (06:00–14:00), Ca chiều (14:00–22:00), Ca tối (22:00–06:00) — có thể là dữ liệu mẫu, không phải cấu hình cố định của hệ thống thật (trang `ShiftConfiguration.jsx` gợi ý ca có thể cấu hình được).
- Trạng thái ca (`SHIFT_STATUS`): `active`, `paused`, `check-in`, `check-out`, `absent`.

## Loyalty

Có cả trang cho `CUSTOMER` (xem điểm/lịch sử của mình) và cho `ADMIN`/`MANAGER` (quản lý/báo cáo chương trình loyalty toàn hệ thống) — mô hình tính điểm cụ thể (theo giá trị đơn, theo sản phẩm...) **chưa xác định**, cần đọc `loyaltyApi`/`LoyaltyManagement.jsx` khi làm task liên quan.

## Việc cần backend xác nhận trước khi coi là quy tắc chính thức

Toàn bộ mục trên — tài liệu này chỉ là điểm khởi đầu để hiểu nhanh bối cảnh khi đọc code, không thay thế việc hỏi trực tiếp đội backend/nghiệp vụ khi cần độ chính xác cao (vd. trước khi code logic tính giá/khuyến mãi).
