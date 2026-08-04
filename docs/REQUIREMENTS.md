# REQUIREMENTS — Quản lý yêu cầu

_Cập nhật: 2026-08-04_

Chưa có backlog/yêu cầu kinh doanh chính thức nào được người dùng cung cấp. Bảng dưới đây là **kiểm kê ngược (reverse inventory)** các nhóm chức năng đã có UI trong codebase, dùng làm điểm khởi đầu — không phải acceptance criteria được khách hàng phê duyệt. Đánh dấu trạng thái là **"Implemented (mock)"**: có giao diện hoạt động với dữ liệu giả từ `src/mocks/`, chưa xác minh với backend thật.

Khi có yêu cầu mới từ người dùng, thêm dòng mới với mã `REQ-0XX` tăng dần, điền đầy đủ acceptance criteria cụ thể trước khi bắt đầu code.

| Mã | Mô tả | Ưu tiên | Acceptance criteria | Trạng thái | Dependency | Ghi chú |
|---|---|---|---|---|---|---|
| REQ-001 | Khách hàng duyệt, tìm kiếm, xem chi tiết sản phẩm phân bón | Cần xác nhận | Chưa có tiêu chí chính thức | Implemented (mock) | `productApi`, `AI.search` | Có tìm kiếm bằng AI semantic search song song tìm kiếm thường |
| REQ-002 | Khách hàng thêm giỏ hàng, checkout (thông tin giao hàng + thanh toán) | Cần xác nhận | Chưa có tiêu chí chính thức | Implemented (mock) | `cartApi`, `paymentService`, `deliveryApi` | Hỗ trợ VNPay/MoMo theo asset trong `public/` |
| REQ-003 | Khách hàng theo dõi đơn hàng, xem lịch sử & điểm loyalty | Cần xác nhận | Chưa có tiêu chí chính thức | Implemented (mock) | `orderApi`, `loyaltyApi` | |
| REQ-004 | Đăng nhập/đăng ký bằng Firebase (customer + nội bộ dùng chung cơ chế, khác trang) | Cần xác nhận | Chưa có tiêu chí chính thức | Implemented (mock) | Firebase Auth, `POST /auth/sync-user` | Có `AdminLoginPage` riêng cho nội bộ, `LoginPage` cho customer |
| REQ-005 | ADMIN quản lý user, vai trò & phân quyền (permission theo module/API path) | Cần xác nhận | Chưa có tiêu chí chính thức | Implemented (mock) | `userService`, `identityService` | Mock permission có `apiPath` + `httpMethod`, gợi ý mô hình RBAC dạng route-based |
| REQ-006 | ADMIN/MANAGER quản lý đại lý (franchise): tạo, trạng thái, danh sách | Cần xác nhận | Chưa có tiêu chí chính thức | Implemented (mock) | `franchiseService` | |
| REQ-007 | ADMIN/MANAGER/STORE_MANAGER quản lý catalog (danh mục + sản phẩm, biến thể màu/size) | Cần xác nhận | Chưa có tiêu chí chính thức | Implemented (mock) | `productService`, `categoryService` | `AVAILABLE_COLORS`/`AVAILABLE_SIZES` trong constraints gợi ý sản phẩm có variant |
| REQ-008 | Quản lý tồn kho theo franchise + ngưỡng cảnh báo tồn thấp | Cần xác nhận | Chưa có tiêu chí chính thức | Implemented (mock) | `inventoryService` | |
| REQ-009 | Yêu cầu nhập/điều chuyển hàng giữa các kho (restock request) với luồng duyệt | Cần xác nhận | Chưa có tiêu chí chính thức | Implemented (mock) | `storeRequestApi` | Có trạng thái approve/ship/receive/reject |
| REQ-010 | Quản lý khuyến mãi (tạo, phạm vi áp dụng theo scope) | Cần xác nhận | Chưa có tiêu chí chính thức | Implemented (mock) | `promotionService` | |
| REQ-011 | Quản lý ca làm việc: cấu hình ca, xếp lịch, check-in/out, thống kê chấm công | Cần xác nhận | Chưa có tiêu chí chính thức | Implemented (mock) | `shiftApi`, `shiftStore` | |
| REQ-012 | POS: nhân viên tạo đơn tại quầy, checkout tại quầy | Cần xác nhận | Chưa có tiêu chí chính thức | Implemented (mock) | `cartApi` (Pos endpoints), `orderApi` | |
| REQ-013 | Báo cáo/dashboard doanh thu theo khoảng thời gian, theo franchise | Cần xác nhận | Chưa có tiêu chí chính thức | Implemented (mock) | `reportApi` | |
| REQ-014 | Cấu hình AI: bật/tắt, train model gợi ý, xem trạng thái | Cần xác nhận | Chưa có tiêu chí chính thức | Implemented (mock) | `aiApi` | |
| REQ-015 | Đa ngôn ngữ vi/en/jp cho toàn UI | Cần xác nhận | Chưa có tiêu chí chính thức (một số chuỗi còn hard-code tiếng Việt thay vì qua `t.*`) | Partially implemented | `src/locales` | Cần audit coverage dịch thuật khi có yêu cầu cụ thể |

## Việc chưa có yêu cầu rõ ràng (cần người dùng xác nhận trước khi làm)

- Mục tiêu tối ưu frontend cụ thể là gì trước tiên: hiệu năng, UI/UX, chuẩn hoá code, chuyển từ mock sang gọi backend thật, hay bổ sung test? **Cần xác nhận.**
- Có backlog/ticket hệ thống nào (Jira, Linear...) cần đồng bộ vào `TASKS.md` không? **Cần xác nhận.**
