# DATA_MODEL — Mô hình dữ liệu

_Cập nhật: 2026-08-04_

## Trạng thái: Chưa xác định — ngoài phạm vi repo này

Database thật **không nằm trong repo này**, do đội/repo backend phụ trách (xem [PROJECT_CONTEXT.md](../PROJECT_CONTEXT.md), [DECISIONS.md](../DECISIONS.md) ADR-002). Không có schema, ORM, hay migration nào trong `farmnhut`.

## Thực thể suy đoán được từ frontend (chỉ để tham khảo, KHÔNG phải schema thật)

Dựa trên `src/mocks/mockServer.js` (dữ liệu giả) và các endpoint trong `src/config/api.js`, các thực thể nghiệp vụ có khả năng tồn tại ở backend thật:

- `User` (có `role` dạng object `{ id, name, permissions[] }` theo mock — hoặc string, code xử lý cả 2 kiểu qua `user?.role?.name || user?.role`)
- `Role`, `Permission` (permission có `apiPath`, `httpMethod` — mô hình route-based)
- `Franchise` (đại lý/chi nhánh)
- `Product`, `ProductVariant` (có `color`, `size`), `Category`
- `Inventory` (theo `franchiseId`), `InventoryRequest`/"restock request" (có luồng approve/ship/receive/reject)
- `Order`, `OrderItem` (có `typeOrder`: Online/POS)
- `Cart` (tách `CartOnline` theo `customerId` và `CartPos` theo `terminalId`)
- `Promotion`, `PromotionScope`
- `Customer` (khác `User` — có endpoint riêng `/customers/*`, có thể là bảng riêng hoặc 1 dạng của `User` với role CUSTOMER, **chưa xác định**)
- `Shift`, `ShiftAssignment` (check-in/out/absent)
- `Delivery`, `Payment`/`PaymentTransaction`
- `LoyaltyPoint`/`LoyaltyHistory`

**Không dùng danh sách này để code logic phụ thuộc cấu trúc field cụ thể** (tên field, kiểu dữ liệu) mà chưa xác nhận với backend — chỉ dùng để định hướng khi đọc code frontend nhanh hơn.

## Khi có thông tin database thật

Cập nhật file này thành ER diagram/bảng thật (có thể dùng Mermaid `erDiagram`) khi được cung cấp schema chính thức từ đội backend, và bỏ nhãn "chưa xác định" ở trên.
