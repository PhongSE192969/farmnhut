# SECURITY — Bảo mật

_Cập nhật: 2026-08-04_

## Authentication

- Firebase Authentication (ID token), không tự lưu mật khẩu người dùng trong frontend.
- Token gắn vào header `Authorization: Bearer <token>` qua interceptor axios (`src/config/axiosClient.js`), tự refresh khi gặp 401 (lấy Firebase ID token mới, retry request 1 lần).
- Zustand `authStore` dùng `persist` middleware, lưu `user`, `accessToken`, `isAuthenticated` vào `localStorage` key `"capital-coffee-auth"` (tên là nợ kỹ thuật, xem DECISIONS.md ADR-003 — không phải lỗ hổng, nhưng cần lưu ý khi audit vì tên không phản ánh đúng nội dung).

## Rủi ro đã biết

| Rủi ro | Mức độ | Ghi chú |
|---|---|---|
| `VITE_USE_MOCK_API` mặc định `true` khi không set | Cao nếu deploy sai | Nếu quên set `false` khi deploy production, app chạy hoàn toàn bằng mock, không kết nối backend thật — không phải lỗ hổng bảo mật trực tiếp nhưng là rủi ro vận hành nghiêm trọng (dữ liệu giả hiển thị cho người dùng thật). Xem DEPLOYMENT.md. |
| `accessToken` lưu trong `localStorage` (qua Zustand persist) | Trung bình | Token trong `localStorage` có thể bị đọc bởi XSS nếu có lỗ hổng XSS khác trong app — đây là trade-off phổ biến của SPA, không phải lỗi cụ thể, nhưng cần lưu ý khi thêm bất kỳ đoạn code nào render HTML không kiểm soát (`dangerouslySetInnerHTML` — hiện chưa thấy dùng trong `src/`, giữ nguyên như vậy). |
| `console.log` request/response khá nhiều trong `src/config/api.js` | Thấp–Trung bình | Chưa thấy log token/mật khẩu trực tiếp, nhưng log toàn bộ `response.data` có thể vô tình lộ dữ liệu nhạy cảm của user (PII) ra console trình duyệt. Cần bọc `import.meta.env.DEV` nhất quán hơn khi có task dọn dẹp logging (xem CODE_CONVENTIONS.md). |
| Không có test/lint rule chặn `console.log` sót lại | Thấp | ESLint hiện tại (`eslint.config.js`) không có rule `no-console`. |

## Không được làm (nhắc lại từ CLAUDE.md)

- Không commit `.env` (đã chặn trong `.gitignore`).
- Không hard-code API key/secret trong code — dùng biến `VITE_*`.
- Không log token, mật khẩu, hoặc toàn bộ object user vào console trong code mới.
- Không đưa response lỗi backend thật (stack trace, chi tiết nội bộ) thẳng ra UI production — chuẩn hoá qua `apiCall()` như hiện tại.
- Không tự thêm endpoint hoặc gọi trực tiếp `fetch`/`axios` ngoài `src/config/` — phá vỡ điểm kiểm soát auth/error tập trung.

## CSRF

`axiosClient`/`publicAxiosClient` có cấu hình `xsrfCookieName: "XSRF-TOKEN"`, `xsrfHeaderName: "X-XSRF-TOKEN"`, `withCredentials: true` — cơ chế CSRF token dựa trên cookie đã được chuẩn bị sẵn ở tầng frontend, nhưng **chưa xác nhận** backend thật có thực sự set cookie `XSRF-TOKEN` và validate header này không (ngoài phạm vi repo, cần hỏi đội backend).

## Dữ liệu nhạy cảm khác

Không thấy lưu thông tin thẻ thanh toán trực tiếp trong frontend — thanh toán qua VNPay/MoMo (redirect flow, chưa xác nhận chi tiết vì `PAYMENT` service/endpoint chưa được đọc kỹ trong phiên phân tích này). Khi làm task liên quan đến thanh toán, phải xác nhận flow thật trước khi code, không giả định.

## Khi phát hiện thay đổi có rủi ro

Theo CLAUDE.md mục 9: cảnh báo người dùng trước khi thực hiện bất kỳ thay đổi nào có thể ảnh hưởng đến auth flow, token storage, hoặc biến môi trường liên quan đến mock/production switch.
