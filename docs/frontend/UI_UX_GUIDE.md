# UI_UX_GUIDE — Hướng dẫn UI/UX

_Cập nhật: 2026-08-04. Rút ra từ code hiện có, không phải design system chính thức được phê duyệt — **cần xác nhận với người có brand guideline thật (nếu có) trước khi coi đây là chuẩn cuối cùng**._

## Design token quan sát được

- **Font chính**: `'DM Sans', system-ui, sans-serif` (khai báo trong `DashboardLayout.jsx`). Site khách hàng (`CustomerLayout.jsx`) dùng class `font-display` (định nghĩa trong Tailwind config — **cần đọc `tailwind.config.js` kỹ hơn khi làm task về typography**).
- **Màu theo vai trò** (dashboard nội bộ, khai báo trong `src/navigations/*.js`):

| Vai trò | Gradient sidebar | Accent |
|---|---|---|
| ADMIN | `from-[#123524] to-[#2f7d32]` | `#b6d645` |
| MANAGER, STORE_MANAGER, STAFF | Chưa đọc chi tiết — xem file navigation tương ứng khi cần |

- **Site khách hàng**: dùng token Tailwind tuỳ chỉnh `bg-primary`, `text-gold`, `bg-gold`, `bg-bg-light` (định nghĩa trong `tailwind.config.js` — không phải màu Tailwind mặc định, xác nhận giá trị hex thật trong file config khi cần dùng chính xác).
- **Icon**: `lucide-react` xuyên suốt — không trộn icon set khác.

## Trạng thái bắt buộc cho UI có gọi API/mock

Theo CLAUDE.md mục 5, mọi màn hình có thao tác bất đồng bộ phải xử lý đủ:

- Loading (có ví dụ chuẩn: spinner tròn viền trong `ProtectedRoute.jsx`, icon `Loader2` xoay trong `CustomerLayout.jsx`).
- Empty (vd. "Không tìm thấy phân bón phù hợp" trong kết quả tìm kiếm `CustomerLayout.jsx`).
- Error (hiển thị qua `react-hot-toast`, không để lỗi câm lặng).
- Disabled (nút submit/logout có `disabled` khi đang xử lý, kèm đổi icon sang spinner — xem `handleLogout` trong cả 2 layout).
- Success (toast thành công, ví dụ `toast.success(...)` sau logout).

## Responsive

Tailwind breakpoint chuẩn (`md:`, `lg:`) dùng nhất quán trong `CustomerLayout.jsx` (menu mobile riêng qua `mobileMenuOpen`, ẩn/hiện phần tử bằng `hidden md:flex`...). `DashboardLayout` có sidebar thu gọn được (`sidebarOpen`, đổi từ `w-64` sang `w-[72px]`) nhưng **chưa thấy xử lý riêng cho màn hình mobile** ở dashboard nội bộ (sidebar cố định, không có menu overlay mobile như site khách hàng) — cần xác nhận đây có phải yêu cầu thật (nội bộ luôn dùng desktop) hay là thiếu sót cần bổ sung khi tối ưu.

## Accessibility

Quan sát hiện tại: có `alt` cho ảnh sản phẩm/logo, dùng `<button>`/`<Link>` đúng ngữ nghĩa cho phần tử tương tác. **Chưa thấy** xử lý focus-visible tuỳ chỉnh, `aria-label` cho icon-only button (vd. nút logout icon-only trong `CustomerLayout.jsx` có `title="Logout"` nhưng không có `aria-label`), hay kiểm tra contrast màu chính thức. Đây là điểm cần cải thiện nếu phạm vi tối ưu frontend bao gồm accessibility — **cần xác nhận có nằm trong phạm vi không**.

## Component tái sử dụng

Ưu tiên dùng lại từ `src/components/ui/`, `src/components/modal/` trước khi tạo mới — xem [COMPONENT_INVENTORY.md](COMPONENT_INVENTORY.md). Lưu ý đã có ít nhất 3 cặp component nghi trùng chức năng (`RevenueChart` x2, `StatCard`/`StatCardDashboard`, `InputField`/`InputTextField`) — không tạo thêm bản thứ 3 cho cùng chức năng, xác nhận hợp nhất trước.

## Nội dung & bản dịch

Site có 3 ngôn ngữ (vi/en/jp) qua `src/locales/`. Khi thêm UI text mới, ưu tiên đi qua `t.<namespace>?.<key> || "<fallback tiếng Việt>"` (pattern đã dùng nhất quán trong `DashboardLayout.jsx`, `CustomerLayout.jsx`) thay vì hard-code chuỗi trực tiếp, để không tạo thêm nợ dịch thuật (xem REQUIREMENTS.md REQ-015 — hiện đã có một số chỗ hard-code tiếng Việt chưa qua `t.*`).
