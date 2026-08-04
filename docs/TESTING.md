# TESTING — Kiểm thử

_Cập nhật: 2026-08-04_

## Trạng thái hiện tại

**Chưa có test tự động nào trong repo.** Không có Jest/Vitest/React Testing Library/Cypress/Playwright trong `devDependencies`, không có thư mục `tests/` hay file `*.test.*`/`*.spec.*`. Đây là khoảng trống cần người dùng xác nhận có nằm trong phạm vi "tối ưu frontend" của dự án này không (xem `docs/REQUIREMENTS.md`).

## Kiểm thử thủ công hiện có

Không có test plan/checklist chính thức. Cách kiểm thử khả dĩ hiện tại: chạy `npm run dev` với mock API bật (mặc định), đăng nhập bằng 5 tài khoản test theo vai trò (xem [SETUP_GUIDE.md](SETUP_GUIDE.md)) và thao tác thủ công trên UI.

## Đề xuất khi bắt đầu thêm test (chưa thực hiện — chờ xác nhận phạm vi)

Nếu người dùng xác nhận cần bổ sung test, các lựa chọn phù hợp với stack hiện tại (Vite + React 19):

- **Unit/component test**: Vitest + React Testing Library — tích hợp tự nhiên với Vite, không cần thêm build tool riêng.
- **E2E**: Playwright — phù hợp để test các luồng nhiều vai trò (login → checkout, login → tạo đơn POS...).

Đây là gợi ý kỹ thuật, **không phải quyết định đã chốt** — cần ADR riêng trong `docs/DECISIONS.md` khi được chọn chính thức.

## Quy tắc khi có test (áp dụng ngay khi bắt đầu thêm)

- Không tuyên bố một tính năng "đã test" nếu chưa thực sự chạy được test đó thành công — theo CLAUDE.md mục 7 (Quy trình xử lý yêu cầu, bước Kiểm tra).
- Test phải chạy được ở cả 2 chế độ liên quan tới mock (`VITE_USE_MOCK_API=true`) trước khi tính đến test nối backend thật.
- Không dùng dữ liệu/token thật trong test — dùng mock data có sẵn trong `src/mocks/`.
