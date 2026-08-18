# TASKS — Quản lý công việc

_Cập nhật: 2026-08-15_

Quy tắc: mỗi thời điểm chỉ nên có **một** task chính ở trạng thái `In progress`, trừ khi giải thích rõ. ID tăng dần `TASK-0XX`.

## In progress

_Không có._

## Ready

| ID | Mô tả | Mục tiêu | File/module liên quan | Dependency | Cập nhật |
|---|---|---|---|---|---|
| TASK-008 | Commit khối thay đổi redesign trang chủ hiện tại (đã lint/build sạch, chưa commit) sau khi người dùng xác nhận nội dung | Chốt tiến độ trên `feature/home-redesign`, tránh mất việc đã làm | `HomePage.jsx` + `src/components/customer/home/*` — danh sách đầy đủ ở CURRENT_STATE.md | Xác nhận người dùng | 2026-08-15 |
| TASK-009 | Quyết định giữ/xoá 2 thư mục tiếng Việt chưa track ở root (`"ảnh web/"`, `"Hình ảnh sản phẩm/"`) | Dọn repo, tránh commit nhầm asset tham khảo không cần thiết | root | Xác nhận người dùng | 2026-08-15 |
| TASK-010 | Sửa nested `<a>` trong `ProductCard.jsx` (dòng 251, lồng trong `<Link>` dòng 137–262) | HTML hợp lệ, hết warning React | `src/components/customer/ProductCard.jsx` | — | 2026-08-15 |

## Backlog

| ID | Mô tả | Mục tiêu | File/module liên quan | Dependency | Cập nhật |
|---|---|---|---|---|---|
| TASK-003 | Xác nhận với người dùng phạm vi "tối ưu frontend" (hiệu năng / UI-UX / chuẩn hoá code / chuyển mock→API thật / test) | Có backlog thật thay vì suy đoán | docs/REQUIREMENTS.md | — | 2026-08-04 |
| TASK-004 | Rà soát và quyết định số phận 3 file rác ở root (`eslint.txt`, `eslint.utf8.txt`, `eslint_output.json`) | Dọn dẹp repo | root | Xác nhận người dùng trước khi xoá | 2026-08-04 |
| TASK-005 | Sửa 100 lỗi / 49 warning ESLint hiện có (chủ yếu `no-unused-vars`, `react-hooks/exhaustive-deps`, 1 lỗi `no-undef` trong `vite.config.js`, 1 lỗi setState-in-effect ở `PromotionStoreManager.jsx`) | Code sạch lint, giảm nguy cơ bug ẩn | Nhiều file — xem CURRENT_STATE.md baseline 2026-08-04 | TASK-003 (xác nhận đây là ưu tiên) | 2026-08-04 |
| TASK-006 | Giảm kích thước bundle chính (hiện 2,007 kB / gzip 567 kB) bằng code-splitting theo route + xử lý 3 module vừa import tĩnh vừa import động (`userService.js`, `cartStore.js`, `inventoryService.js`) | Cải thiện thời gian tải trang | `src/App.jsx` (lazy route), `src/services/userService.js`, `src/stores/cartStore.js`, `src/services/inventoryService.js` | TASK-003 (xác nhận đây là ưu tiên) | 2026-08-04 |
| TASK-007 | Rà soát 14 vulnerability từ `npm audit` (2 low, 3 moderate, 8 high, 1 critical) | Đảm bảo an toàn dependency trước khi deploy production | `package.json`/`package-lock.json` | Xác nhận người dùng trước khi `npm audit fix`/nâng version (có thể breaking) | 2026-08-04 |

## Blocked

_Không có._

## Done

| ID | Mô tả | File/module liên quan | Ngày hoàn thành |
|---|---|---|---|
| TASK-001 | Thiết lập bộ tài liệu quản lý ngữ cảnh dự án (CLAUDE.md, README.md, .env.example, docs/*) dựa trên phân tích code thực tế trong repo | root, docs/ | 2026-08-04 |
| TASK-002 | Chạy baseline `npm install` + `npm run lint` + `npm run build`, ghi lại kết quả vào CURRENT_STATE.md | toàn repo | 2026-08-04 |
