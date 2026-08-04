# PAGE_INVENTORY — Danh sách trang

_Cập nhật: 2026-08-04, trích xuất trực tiếp từ `src/App.jsx`._

## Site khách hàng (`CustomerLayout`)

| Route | Trang | File | Bảo vệ |
|---|---|---|---|
| `/` | Redirect → `/home` | — | Công khai |
| `/home` | Trang chủ | `pages/customer/HomePage.jsx` | Công khai |
| `/products` | Danh sách sản phẩm | `pages/customer/ProductsPage.jsx` | Công khai |
| `/products/:id` | Chi tiết sản phẩm | `pages/customer/ProductDetailPage.jsx` | Công khai |
| `/checkout` | Giỏ hàng/checkout | `pages/customer/CheckoutPage.jsx` | Công khai |
| `/checkout-info` | Thông tin giao hàng | `pages/customer/CheckoutInfoPage.jsx` | Công khai |
| `/checkout-payment` | Thanh toán | `pages/customer/CheckoutPaymentPage.jsx` | Công khai |
| `/order-success` | Đặt hàng thành công | `pages/customer/OrderSuccessPage.jsx` | Công khai |
| `/orders/:id` | Chi tiết đơn hàng | `pages/customer/OrderDetailPage.jsx` | Công khai |
| `/profile` | Hồ sơ cá nhân | `pages/customer/ProfilePage.jsx` | `ProtectedRoute role="CUSTOMER"` |

## Auth

| Route | Trang | File |
|---|---|---|
| `/login` | Đăng nhập khách hàng | `pages/auth/LoginPage.jsx` |
| `/register` | Đăng ký | `pages/auth/RegisterPage.jsx` |
| `/verify-email` | Xác thực email | `pages/auth/VerifyEmailPage.jsx` |
| `/forgot-password` | Quên mật khẩu | `pages/auth/ForgotPasswordPage.jsx` |
| `/forgot-password/confirm` | Xác nhận đặt lại mật khẩu | `pages/auth/ConfirmForgotPasswordPage.jsx` |
| `/admin/login` | Đăng nhập nội bộ (ADMIN/MANAGER/STORE_MANAGER/STAFF) | `pages/auth/AdminLoginPage.jsx` |

## MANAGER (`/manager`, `ProtectedRoute role="MANAGER"`, `DashboardLayout`)

| Route | Trang | File |
|---|---|---|
| `/manager` (index) | Dashboard quản lý tổng | `pages/manager/ManagerDashboard.jsx` |
| `/manager/orders` | Đơn hàng | `pages/manager/ManagerOrder.jsx` |
| `/manager/catalog/products` | Sản phẩm | `pages/manager/ProductManager.jsx` |
| `/manager/catalog/categories` | Danh mục | `pages/manager/CategoryManager.jsx` |
| `/manager/inventory` | Tồn kho | `pages/manager/InventoryManager.jsx` |
| `/manager/promotions` | Khuyến mãi | `pages/manager/PromotionManager.jsx` |
| `/manager/shift/staff` | Nhân sự | `pages/manager/StaffManager.jsx` |
| `/manager/shift/schedule` | Lịch ca | `pages/manager/ShiftSchedule.jsx` |
| `/manager/customers-loyalty/loyalty` | Báo cáo loyalty | `pages/manager/LoyaltyReport.jsx` |
| `/manager/customers-loyalty/customers` | Khách hàng | `pages/manager/CustomerManager.jsx` |
| `/manager/franchises` | Đại lý | `pages/manager/FranchiseManager.jsx` |

## ADMIN (`/admin`, `ProtectedRoute role="ADMIN"`, `DashboardLayout`)

| Route | Trang | File |
|---|---|---|
| `/admin` (index) | Redirect → `/admin/identity/users` | — |
| `/admin/identity/users` | Quản lý user | `pages/admin/UserManagement.jsx` |
| `/admin/identity/roles` | Vai trò & phân quyền | `pages/admin/RoleManagement.jsx` |
| `/admin/franchises` | Đại lý | `pages/admin/FranchiseManagement.jsx` |
| `/admin/inventories` | Tồn kho | `pages/admin/InventoryManagement.jsx` |
| `/admin/catalog/products` | Sản phẩm | `pages/admin/ProductManagement.jsx` |
| `/admin/catalog/categories` | Danh mục | `pages/admin/CategoryManagement.jsx` |
| `/admin/promotions` | Khuyến mãi | `pages/admin/PromotionManagement.jsx` |
| `/admin/ai-settings` | Cấu hình AI | `pages/admin/AISettingsManagement.jsx` |
| `/admin/customers-loyalty/customers` | Khách hàng | `pages/admin/CustomersManagement.jsx` |
| `/admin/customers-loyalty/loyalty` | Loyalty | `pages/admin/LoyaltyManagement.jsx` |
| `/admin/catalog`, `/admin/identity`, `/admin/customers-loyalty` | Redirect tới route con mặc định | — |

## STORE_MANAGER (`/store-manager`, `ProtectedRoute role="STORE_MANAGER"`, `DashboardLayout`)

| Route | Trang | File |
|---|---|---|
| `/store-manager` (index) | Dashboard đại lý | `pages/storeManager/StoreManagerDashboard.jsx` |
| `/store-manager/users/staff` | Nhân sự | `pages/storeManager/StaffStoreManager.jsx` |
| `/store-manager/users/customers` | Khách hàng | `pages/storeManager/CustomerStoreManager.jsx` |
| `/store-manager/shift-schedule` | Lịch ca | `pages/storeManager/ShiftScheduleStoreManager.jsx` |
| `/store-manager/catalog/products` | Sản phẩm | `pages/storeManager/ProductStoreManager.jsx` |
| `/store-manager/catalog/categories` | Danh mục | `pages/storeManager/CategoryStoreManager.jsx` |
| `/store-manager/orders` | Đơn hàng | `pages/storeManager/OrderStoreManagement.jsx` |
| `/store-manager/promotions` | Khuyến mãi | `pages/storeManager/PromotionStoreManager.jsx` |
| `/store-manager/inventory` | Tồn kho | `pages/storeManager/InventoryStoreManager.jsx` |

## STAFF (`/staff`, `ProtectedRoute role="STAFF"`, `DashboardLayout`)

| Route | Trang | File |
|---|---|---|
| `/staff` (index) | Redirect → `/staff/new-order` | — |
| `/staff/new-order` | Tạo đơn (POS) | `pages/staff/CreateOrder.jsx` |
| `/staff/queue` | Trạng thái đơn | `pages/staff/OrderManagement.jsx` |
| `/staff/customers` | Khách hàng | `pages/staff/CustomerManagement.jsx` |
| `/staff/my-shift` | Ca làm việc của tôi | `pages/staff/MyShift.jsx` |
| `/staff/checkout` | Checkout tại quầy | `pages/staff/CheckOut.jsx` |
| `/staff/create-customer` | Tạo khách hàng mới | `pages/staff/CreateCustomer.jsx` |
| `/staff/order-success` | Đơn POS thành công | `pages/staff/PosOrderSuccessPage.jsx` |

## Fallback

| Route | Hành vi |
|---|---|
| `*` | Redirect → `/home` |

## Khi thêm/xoá trang

Cập nhật bảng tương ứng ở trên **trong cùng lần commit** thay đổi `src/App.jsx` — theo CLAUDE.md mục 5.
