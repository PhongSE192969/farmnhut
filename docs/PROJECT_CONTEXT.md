# PROJECT_CONTEXT — Bối cảnh sản phẩm

_Cập nhật: 2026-08-04_

## Tên dự án

AgriFert Frontend (tên package.json: `franchise_fe`).

## Chủ sở hữu / khách hàng

- Repo GitHub: `PhongSE192969/farmnhut` — chủ sở hữu tài khoản GitHub `PhongSE192969`.
- Người dùng hiện tại (chủ phiên làm việc này) là collaborator được mời vào repo, tài khoản GitHub `acnibh`.
- Quan hệ tổ chức/khách hàng thật đứng sau dự án: **Chưa xác định** — chưa có thông tin công ty/agency chủ quản được xác nhận trong phiên làm việc này.

## Lĩnh vực kinh doanh

Phân phối vật tư nông nghiệp — trọng tâm **phân bón** (NPK, hữu cơ, phân bón lá, cải tạo đất) — theo mô hình **chuỗi đại lý/franchise** (nhiều điểm bán, quản lý tập trung).

## Mục tiêu kinh doanh

Suy ra từ tính năng đã xây dựng trong code (chưa có tài liệu yêu cầu kinh doanh chính thức nào được cung cấp):

- Bán hàng trực tuyến cho nông dân/khách hàng lẻ (site customer).
- Vận hành bán hàng tại quầy (POS) ở từng đại lý.
- Quản lý tập trung nhiều đại lý: tồn kho liên kho, điều chuyển/yêu cầu nhập hàng (restock request), khuyến mãi, chương trình khách hàng thân thiết (loyalty).
- Quản lý nhân sự theo ca làm việc (shift/chấm công) tại từng đại lý.
- Cá nhân hoá/tìm kiếm sản phẩm bằng AI (semantic search, recommend) — có trang cấu hình AI cho admin.

## Đối tượng người dùng (5 vai trò, xem `src/constraints/index.js` → `ROLES`)

| Vai trò | Mô tả suy ra từ navigation/route |
|---|---|
| `ADMIN` | Quản trị hệ thống toàn cục: user, vai trò & phân quyền, đại lý, catalog, tồn kho, khuyến mãi, khách hàng & loyalty, cấu hình AI. |
| `MANAGER` | "Quản lý tổng" — quyền cao nhất về vận hành kinh doanh: dashboard, đơn hàng, catalog, tồn kho, khuyến mãi, nhân sự & lịch ca, loyalty, đại lý. |
| `STORE_MANAGER` | Quản lý 1 đại lý cụ thể: nhân sự, khách hàng, lịch ca, catalog, đơn hàng, khuyến mãi, tồn kho của đại lý đó. |
| `STAFF` | Nhân viên tại đại lý: tạo đơn (POS), quản lý khách hàng, ca làm việc của bản thân, checkout. |
| `CUSTOMER` | Khách hàng mua vật tư: duyệt sản phẩm, giỏ hàng, checkout, theo dõi đơn, hồ sơ & loyalty cá nhân. |

## Vấn đề cần giải quyết

**Chưa xác định** — chưa có brief/backlog kinh doanh chính thức được người dùng cung cấp trong phiên này ngoài phạm vi công việc đã nêu ("tối ưu frontend").

## Phạm vi phiên bản hiện tại / phạm vi công việc của Claude Code trong dự án này

- Codebase hiện có (2 commit: "Initial AgriFert frontend mock app", "Fix Vercel mock deployment") là **bản mock/prototype đầy đủ tính năng UI** cho cả 5 vai trò, chạy độc lập bằng `src/mocks/mockServer.js` (axios mock adapter) — không cần backend thật để chạy.
- **Backend thật đã tồn tại** (theo xác nhận của người dùng ngày 2026-08-04) nhưng nằm ngoài repo này, do đội/repo khác phụ trách. `src/config/api.js` phản ánh hợp đồng API mà frontend *kỳ vọng*, không phải tài liệu chính thức của backend thật.
- **Nhiệm vụ của người dùng trong dự án này giới hạn ở tối ưu frontend** — Claude Code không tự tạo/sửa backend hoặc database thật, không tự quyết định kiến trúc backend.

## Ngoài phạm vi (out of scope)

- Xây dựng/sửa backend, database thật.
- Quyết định hạ tầng/DevOps cho backend.
- Thiết kế lại tổng thể kiến trúc hệ thống (multi-repo vs monorepo) trừ khi được yêu cầu rõ ràng.

## Yêu cầu về thương hiệu

- Tên hiển thị: "AgriFert". Logo: `public/agri-logo.svg`, `public/logo.png`, `public/logo01.png` (có nhiều biến thể — chưa rõ cái nào là chính thức, **cần xác nhận**).
- Font UI: `'DM Sans'` (theo `DashboardLayout.jsx`).
- Guideline màu sắc/thương hiệu chính thức: **chưa xác định**, hiện chỉ có màu Tailwind tự chọn theo từng vai trò trong `src/navigations/*.js`.

## Yêu cầu phi chức năng

Chưa có yêu cầu phi chức năng chính thức (hiệu năng, SLA, khả năng chịu tải, đa ngôn ngữ bắt buộc...) được xác nhận. Quan sát từ code: hỗ trợ 3 ngôn ngữ vi/en/jp (`src/locales`), responsive Tailwind, không thấy cấu hình accessibility/test coverage tối thiểu.

## Ràng buộc

- Không có ràng buộc hạ tầng được xác nhận (repo hiện deploy thử trên Vercel — xem `vercel.json`).
- Node.js version chưa pin (không có `.nvmrc`/`engines` trong `package.json`) — **cần xác nhận**.

## Giả định đang sử dụng

- Giả định repo `farmnhut` là nguồn duy nhất cho phần frontend của dự án AgriFert (chưa có xác nhận có repo frontend nào khác song song).
- Giả định "backend thật" mà người dùng nhắc tới tương thích (hoặc sẽ được điều chỉnh để tương thích) với hợp đồng endpoint đã định nghĩa trong `src/config/api.js`; nếu không khớp cần cập nhật lại `src/config/api.js` và services liên quan.

## Thuật ngữ nghiệp vụ

| Thuật ngữ | Ý nghĩa |
|---|---|
| Franchise | Đại lý/chi nhánh bán hàng trong chuỗi, có `franchiseId` riêng, dữ liệu tồn kho/nhân sự/khách hàng thường được scope theo franchise. |
| Restock request | Yêu cầu nhập/điều chuyển hàng từ kho khác về 1 franchise (`storeRequestApi`, `MyRestockRequestsModal`). |
| Shift | Ca làm việc của nhân viên tại 1 franchise, có check-in/check-out/absent. |
| Loyalty | Chương trình tích điểm/ưu đãi cho khách hàng (customer & admin/manager đều có trang riêng). |
| POS order | Đơn hàng tạo tại quầy bởi `STAFF`, phân biệt với đơn "Online" do khách tự đặt (`typeOrder`). |
