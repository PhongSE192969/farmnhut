# CURRENT_STATE — Trạng thái hiện tại

_Cập nhật: 2026-08-04_
_Nhánh Git: `main` (đồng bộ với `origin/main`, không có branch nào khác)_
_Phase hiện tại: Thiết lập tài liệu quản lý ngữ cảnh dự án (khởi tạo, chưa có thay đổi code nghiệp vụ)_

## Chức năng đã hoạt động (mock)

Toàn bộ UI cho 5 vai trò (ADMIN, MANAGER, STORE_MANAGER, STAFF, CUSTOMER) đã có và chạy được với `VITE_USE_MOCK_API=true` (mặc định) — xem chi tiết [TASKS.md](TASKS.md) và [REQUIREMENTS.md](REQUIREMENTS.md). Chưa verify tính năng nào đã hoạt động đúng với backend thật (out of scope repo này).

## Chức năng đang triển khai

Không có — chưa có task nghiệp vụ nào được giao trong phiên này ngoài việc thiết lập bộ tài liệu quản lý ngữ cảnh dự án.

## Việc cần làm tiếp theo

1. Người dùng xác nhận mục tiêu "tối ưu frontend" cụ thể (xem REQUIREMENTS.md phần "Việc chưa có yêu cầu rõ ràng").
2. Sau khi có mục tiêu, cập nhật `docs/TASKS.md` với backlog thật.

## Lỗi hoặc blocker hiện tại

Không có blocker kỹ thuật. Một số điểm cần lưu ý (không chặn tiến độ):

- Node.js version chưa pin trong repo (`.nvmrc`/`engines` không có).
- 3 file rác ở root (`eslint.txt`, `eslint.utf8.txt`, `eslint_output.json`) — có vẻ là output cũ của lệnh lint, chưa rõ có cần giữ lại không.

## Các quyết định đang chờ người dùng

- Không có quyết định kiến trúc nào đang chờ tại thời điểm này (3 quyết định ban đầu — cấu trúc thư mục, phạm vi backend, xử lý "coffee" leftover — đã được người dùng xác nhận ngày 2026-08-04, xem [DECISIONS.md](DECISIONS.md)).

## Lệnh cần chạy để tiếp tục

```bash
npm install
npm run dev     # http://127.0.0.1:5173, tài khoản test xem SETUP_GUIDE.md
npm run lint
npm run build
```

## File quan trọng đang được chỉnh sửa

Không có file code nào đang dang dở. Các file tài liệu vừa được tạo mới trong phiên này: xem mục "Đã thực hiện" trong [SESSION_LOG.md](SESSION_LOG.md) mục gần nhất.

## Trạng thái build/lint/test gần nhất

Đã chạy baseline ngày 2026-08-04 (trước khi có bất kỳ thay đổi code nào — phản ánh đúng trạng thái code đã kế thừa từ `PhongSE192969`):

- `npm install`: thành công. **14 vulnerability** theo `npm audit` (2 low, 3 moderate, 8 high, 1 critical) — chưa xử lý, chưa đọc chi tiết từng CVE, **cần rà soát trước khi coi là an toàn để deploy production**.
- `npm run lint`: **100 lỗi, 49 warning** (149 problems). Đa số lỗi là `no-unused-vars` (biến/import không dùng) và một số `react-hooks/exhaustive-deps`, 1 lỗi `no-undef` (`process` chưa định nghĩa trong `vite.config.js`), 1 lỗi React Compiler-style "setState đồng bộ trong effect" ở `PromotionStoreManager.jsx`. Đây là nợ kỹ thuật đã có sẵn, không phải do phiên thiết lập tài liệu này gây ra.
- `npm run build`: **thành công** (`vite build`, 6.67s). 2 cảnh báo đáng chú ý:
  - 3 module (`userService.js`, `cartStore.js`, `inventoryService.js`) vừa được import tĩnh vừa import động ở nơi khác → Vite không tách chunk được, mất tác dụng lazy-load.
  - Bundle chính `index-*.js` = **2,007 kB** (gzip 567 kB) — vượt xa ngưỡng khuyến nghị 500 kB, chưa có code-splitting theo route.

→ Baseline này là ứng viên tốt cho các task "tối ưu frontend" đầu tiên (xem `TASK-005`, `TASK-006` trong TASKS.md) một khi người dùng xác nhận đây đúng là hướng ưu tiên.
