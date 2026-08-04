# DECISIONS — Architecture Decision Records

## ADR-001: Giữ nguyên cấu trúc source ở root, không chuyển sang monorepo

- Ngày: 2026-08-04
- Trạng thái: Accepted
- Bối cảnh: Cần thêm bộ tài liệu quản lý ngữ cảnh (`docs/`) theo chuẩn có thể mở rộng tới backend/database. Template đề xuất chuẩn có cấu trúc `frontend/`, `backend/`, `shared/`.
- Các phương án:
  1. Di chuyển toàn bộ `src/`, `public/`, config Vite hiện tại vào thư mục `frontend/` để chuẩn bị cho monorepo.
  2. Giữ nguyên `src/`, `public/`, config Vite ở root như hiện tại, chỉ thêm `docs/` và file gốc mới (`CLAUDE.md`, `.env.example`).
- Quyết định: Chọn phương án 2.
- Lý do: Repo này là 1 Vite app đơn, không phải monorepo thật; di chuyển sẽ phải sửa `vite.config.js` alias, `vercel.json`, mọi import tương đối, và rủi ro làm hỏng build/deploy hiện có mà không mang lại lợi ích ngay lập tức. Người dùng xác nhận chọn phương án này.
- Hệ quả: `docs/backend/`, `docs/database/` chỉ là tài liệu, không có thư mục source `backend/`, `database/` tương ứng ở root.
- Phương án quay lại: Nếu sau này backend được đưa vào cùng repo (monorepo thật), sẽ cần ADR mới để di chuyển `src/` vào `frontend/apps/...` hoặc tương đương.

## ADR-002: Backend/database thật ngoài phạm vi sửa đổi của repo này

- Ngày: 2026-08-04
- Trạng thái: Accepted
- Bối cảnh: `src/config/api.js` định nghĩa đầy đủ ~15 nhóm REST endpoint nhưng không có backend/database nào trong repo. Cần biết: xây backend mới trong dự án này, hay backend đã tồn tại nơi khác?
- Các phương án:
  1. Coi backend/database là chưa xác định hoàn toàn, đợi quyết định sau.
  2. Backend thật đã tồn tại (ngoài repo), nhiệm vụ của người dùng trong dự án `farmnhut` chỉ giới hạn tối ưu frontend.
- Quyết định: Chọn phương án 2, theo xác nhận của người dùng.
- Lý do: Người dùng cho biết "đã có backend rồi, nhưng trong dự án này thì nhiệm vụ của tôi là chỉ cần tối ưu lại frontend".
- Hệ quả: `docs/backend/API_CONTRACT.md` và `docs/database/DATA_MODEL.md` được viết ở dạng **tài liệu tham chiếu suy ra từ code frontend**, đánh dấu rõ là chưa xác nhận với đội backend thật — không phải nguồn sự thật. Claude Code không tự ý implement/sửa backend hay database thật trong repo này.
- Phương án quay lại: Nếu sau này người dùng cung cấp thông tin backend thật (repo, Swagger/OpenAPI, schema DB), cập nhật lại 2 file trên thành nguồn xác nhận và bỏ nhãn "chưa xác nhận".

## ADR-003: Không sửa các dấu vết "coffee" còn sót lại từ project cũ

- Ngày: 2026-08-04
- Trạng thái: Accepted
- Bối cảnh: Phát hiện 12 file còn chứa cụm `"capital-coffee-auth"` / "coffee" (ví dụ: key `localStorage` trong `authStore.js`, `CustomerLayout.jsx`, `DashboardLayout.jsx`) — dấu hiệu code được tái sử dụng từ một dự án quán cà phê khác rồi đổi thương hiệu sang AgriFert mà chưa dọn hết.
- Các phương án:
  1. Đổi tên ngay các cụm "coffee" sang tên đúng dự án trong đợt setup tài liệu này.
  2. Chỉ ghi chú vào tài liệu (DECISIONS.md này + HANDOVER.md), không sửa code ngay.
- Quyết định: Chọn phương án 2, theo xác nhận của người dùng.
- Lý do: Đây không phải lỗi chức năng (localStorage key hoạt động bình thường dù tên không khớp thương hiệu), sửa ngay có thể lẫn vào tác vụ khác ngoài phạm vi được yêu cầu ở phiên này.
- Hệ quả: Technical debt được note rõ trong [HANDOVER.md](HANDOVER.md) và [CLAUDE.md](../CLAUDE.md) mục 9, để không ai vô tình sửa/xoá mà không biết lý do lịch sử.
- Phương án quay lại: Khi có task riêng liên quan đến các file này, đổi tên key `localStorage` (và các cụm "coffee" khác nếu có) sang tên phù hợp với AgriFert, kèm kế hoạch migrate dữ liệu đã lưu cục bộ của user hiện tại (invalidate session cũ là chấp nhận được vì đây là mock/dev).
