# COMPONENT_INVENTORY — Component dùng chung

_Cập nhật: 2026-08-04. Mục đích mỗi component suy đoán từ tên file — đánh dấu (giả định) khi chưa đọc code chi tiết. Cập nhật lại mô tả khi thực sự làm việc với component đó._

## `src/components/customer/`

| Component | Mục đích (giả định theo tên) |
|---|---|
| `CustomerInfo.jsx` | Hiển thị/nhập thông tin khách hàng trong checkout |
| `LoyaltyCell.jsx` | Ô hiển thị điểm loyalty (dạng cell trong bảng/list) |
| `LoyaltyDetailCard.jsx` | Card chi tiết chương trình/điểm loyalty |
| `OrderSummary.jsx` | Tóm tắt đơn hàng (checkout, chi tiết đơn) |
| `PaymentMethod.jsx` | Chọn phương thức thanh toán (VNPay/MoMo...) |
| `ProductCard.jsx` | Card hiển thị 1 sản phẩm trong danh sách |
| `RecommendationSection.jsx` | Khối gợi ý sản phẩm (liên quan `aiApi.getRecommendations`) |
| `ShippingInfo.jsx` | Thông tin giao hàng trong checkout |

## `src/components/dashboard/`

| Component | Mục đích |
|---|---|
| `NavItem.jsx` | 1 mục menu trong sidebar `DashboardLayout`, hỗ trợ `children` (submenu) |
| `RevenueChart.jsx` | Biểu đồ doanh thu — **trùng tên với `components/ui/RevenueChart.jsx`**, cần xác nhận bản nào đang được dùng thật trước khi sửa (xem CODE_CONVENTIONS.md) |
| `StatCardDashboard.jsx` | Card thống kê số liệu trên dashboard |

## `src/components/form/`

| Component | Mục đích |
|---|---|
| `InputField.jsx` | Input form dùng chung |

## `src/components/ui/`

| Component | Mục đích |
|---|---|
| `FilterItem.jsx` | 1 mục filter |
| `FilterSection.jsx` | Nhóm filter (danh mục, trạng thái...) |
| `InputTextField.jsx` | Input text dùng chung — **trùng chức năng khả dĩ với `form/InputField.jsx`**, cần xác nhận khác biệt trước khi hợp nhất |
| `PaginationControls.jsx` | Điều khiển phân trang, đi cùng `PAGE_SIZE` trong `constraints/index.js` |
| `RevenueChart.jsx` | Xem lưu ý trùng tên ở `dashboard/RevenueChart.jsx` |
| `SearchInput.jsx` | Ô tìm kiếm dùng chung |
| `SelectOption.jsx` | Select/dropdown dùng chung |
| `StatCard.jsx` | Card thống kê — có thể trùng vai trò với `dashboard/StatCardDashboard.jsx`, cần xác nhận |
| `Table.jsx` | Bảng dữ liệu dùng chung |
| `index.jsx` | Export tập trung các component trên |

## `src/components/order/`

| Component | Mục đích |
|---|---|
| `OrderDetailDrawer.jsx` | Drawer xem nhanh chi tiết đơn hàng |
| `OrderDetailModal.jsx` | Modal chi tiết đơn hàng |
| `OrderTable.jsx` | Bảng danh sách đơn hàng |

## `src/components/modal/` (export tập trung qua `index.js`)

30 modal CRUD/thao tác, đặt tên theo domain — quy ước: `<Domain><Action>Modal.jsx`.

| Nhóm | Modal |
|---|---|
| Identity/User | `AddUserModal`, `UserDetailModal`, `ChangePasswordModal`, `AddRoleModal`, `PermissionFormModal`, `ManagePermissionModal` |
| Customer | `AddCustomerModal`, `CustomerDetaiModal` (**typo "Detai" trong tên file — giữ nguyên, không đổi tên nếu chưa có task riêng vì sẽ phá import**) |
| Catalog | `AddEditProduct`, `ProductDetailModal`, `ProductCatalogModal`, `CategoryAddUpdateModal`, `CategoryCRUDModal`, `CategoryDetailModal` |
| Promotion | `PromotionAddUpdateModal`, `PromotionDetailModal`, `GenerateCouponModal` |
| Inventory | `RestockRequestModal`, `MyRestockRequestsModal` |
| Franchise/Map | `FranchiseModal`, `MapPickerModal`, `MapGeoApiFyModal` |
| Shift | `ShiftModal` |
| Chung | `ConfirmModal`, `ConfirmDeleteModal` |

## Khi thêm component dùng chung mới

Thêm dòng mới vào bảng tương ứng ở trên trong cùng lần commit — theo CLAUDE.md mục 5. Trước khi tạo component mới, kiểm tra danh sách này để tránh trùng lặp (đã có ít nhất 3 cặp nghi trùng — xem ghi chú ở trên).
