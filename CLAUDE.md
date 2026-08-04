# CLAUDE.md — Hướng dẫn trung tâm cho dự án AgriFert Frontend

Đây là file hướng dẫn bắt buộc phải tuân thủ trong **tất cả các phiên Claude Code** làm việc trên dự án này. Ngôn ngữ tài liệu: tiếng Việt (tên kỹ thuật, class, function, route, command giữ nguyên tiếng Anh).

## 0. Bối cảnh nhanh

- Dự án: frontend React cho hệ thống quản lý chuỗi đại lý/franchise phân bón "AgriFert".
- **Phạm vi công việc của người dùng trong dự án này: chỉ tối ưu frontend.** Backend thật đã tồn tại và do đội khác/repo khác phụ trách — Claude Code KHÔNG tự tạo, sửa hay giả định kiến trúc backend/database thật. Xem [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md).
- Repo gốc: `https://github.com/PhongSE192969/farmnhut` (nhánh `main`). Thư mục làm việc local: `D:\Work Mericy\Agency\web chú nhựt`.
- Cấu trúc source giữ nguyên như hiện tại (Vite app tại root) — không chuyển sang monorepo. Xem ADR-001 trong [docs/DECISIONS.md](docs/DECISIONS.md).

## 1. Trình tự bắt đầu phiên làm việc

Mỗi khi bắt đầu một phiên hoặc nhận một yêu cầu mới, đọc theo thứ tự:

1. `CLAUDE.md` (file này).
2. [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md)
3. [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md)
4. [docs/TASKS.md](docs/TASKS.md)
5. Các mục mới nhất trong [docs/SESSION_LOG.md](docs/SESSION_LOG.md)
6. Tài liệu chuyên môn liên quan trực tiếp đến tác vụ (frontend/backend/database tương ứng)
7. Kiểm tra code thực tế trước khi đưa ra kết luận (đừng tin tài liệu 100%, đối chiếu với `src/`)
8. Tóm tắt ngắn gọn cho người dùng: dự án đang ở trạng thái nào, công việc gần nhất đã làm, công việc hiện tại cần tiếp tục, các vấn đề/quyết định còn chờ xác nhận.

Không yêu cầu người dùng kể lại lịch sử nếu thông tin đã có trong tài liệu.

## 2. Trình tự kết thúc công việc

Sau mỗi tác vụ có thay đổi thực tế:

1. Chạy kiểm tra phù hợp: `npm run lint`, và `npm run build` nếu thay đổi có khả năng ảnh hưởng build. Chưa có test suite (xem [docs/TESTING.md](docs/TESTING.md)).
2. Cập nhật [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md).
3. Cập nhật trạng thái nhiệm vụ trong [docs/TASKS.md](docs/TASKS.md).
4. Ghi một mục mới vào [docs/SESSION_LOG.md](docs/SESSION_LOG.md) theo đúng mẫu quy định trong file đó.
5. Nếu có quyết định kiến trúc/thư viện/convention, cập nhật [docs/DECISIONS.md](docs/DECISIONS.md) (ADR mới).
6. Nếu API contract phía backend (nhận biết được qua `src/config/api.js`) hoặc biến môi trường thay đổi, cập nhật [docs/backend/API_CONTRACT.md](docs/backend/API_CONTRACT.md) và `.env.example`.
7. Báo cáo rõ: file đã thay đổi, chức năng đã hoàn thành, kiểm tra nào đã chạy, kết quả kiểm tra, rủi ro hoặc việc còn lại — theo mẫu ở mục 7 bên dưới.

## 3. Nguyên tắc đối chiếu thông tin

Nếu tài liệu và code không giống nhau:

- Code đang chạy trong `src/` là bằng chứng về implementation hiện tại.
- Tài liệu (docs/) là nguồn cho hành vi mong muốn / bối cảnh nghiệp vụ.
- Không âm thầm chọn một phía — chỉ ra sự khác biệt cho người dùng, xác định phần nào cần sửa, và sau khi thống nhất thì đồng bộ lại cả code và tài liệu.

## 4. Quy tắc viết code

1. Đặt tên rõ nghĩa, chia module hợp lý; không comment tràn lan.
2. Bắt buộc comment khi: business rule không suy ra được từ code, thuật toán phức tạp, workaround, giới hạn của API/dịch vụ bên thứ ba, quyết định bảo mật, đoạn code dễ gây hiểu nhầm.
3. Comment giải thích "tại sao", không lặp lại "đang làm gì".
4. Không để lại code chết, import thừa, debug `console.log` dư thừa (dự án hiện có khá nhiều `console.log` debug trong `src/config/api.js`, `App.jsx` — không xoá hàng loạt ngoài phạm vi task đang làm, nhưng không thêm mới).
5. TODO phải theo định dạng `TODO(TASK-ID): nội dung`.
6. Không hard-code secret/API key/URL môi trường — dùng biến `VITE_*` qua `import.meta.env`, khai báo mẫu trong `.env.example`.
7. Validate input ở boundary (form, trước khi gọi API).
8. Không `catch` rỗng — nếu phải nuốt lỗi (như một số chỗ trong `authService.js`/layout logout flow), phải có `console.warn`/comment giải thích lý do.
9. Khi thêm dependency mới: kiểm tra đã có giải pháp tương đương trong `package.json` chưa, giải thích lý do cần, không tự ý nâng/hạ version thư viện đang dùng nếu chưa giải thích trước và được đồng ý.

## 5. Quy tắc riêng cho frontend (áp dụng toàn bộ vì dự án này scope = frontend)

- Responsive trên mobile, tablet, desktop.
- Có đủ trạng thái loading, empty, error, disabled, success cho các thao tác gọi API/mock.
- Không để layout shift hoặc overflow không kiểm soát.
- Semantic HTML, có label/alt text/focus state cho phần tử tương tác.
- Tái sử dụng component trong `src/components/ui`, `src/components/modal` khi phù hợp; không tạo abstraction mới khi chưa có nhu cầu thực tế lặp lại.
- Tách UI, state (Zustand store trong `src/stores`) và logic gọi API (`src/services`) — không gọi `axiosClient`/`apiCall` trực tiếp trong component.
- Không hard-code dữ liệu giả vào component production ngoài `src/mocks/` (mock data phải nằm trong `src/mocks/`, bật/tắt qua `VITE_USE_MOCK_API`).
- Cập nhật [docs/frontend/PAGE_INVENTORY.md](docs/frontend/PAGE_INVENTORY.md) khi thêm/xoá trang, [docs/frontend/COMPONENT_INVENTORY.md](docs/frontend/COMPONENT_INVENTORY.md) khi thêm component dùng chung.

Trước khi báo hoàn thành 1 giao diện: kiểm tra desktop/tablet/mobile, nội dung dài, nội dung trống, lỗi API (thử tắt mock hoặc giả lập lỗi), loading, nút/form, console trình duyệt sạch lỗi.

## 6. Backend/Database — ngoài phạm vi sửa đổi

Repo này **không chứa** backend hay database thật. `src/config/api.js` định nghĩa "hợp đồng API" mà frontend kỳ vọng — đây là tài liệu tham chiếu suy ra từ code, **không phải nguồn sự thật của backend thật**. Khi cần xác nhận hành vi backend thật (field response, status code, business rule), phải hỏi người dùng thay vì tự suy đoán và code cứng theo giả định. Xem [docs/backend/API_CONTRACT.md](docs/backend/API_CONTRACT.md) và [docs/database/DATA_MODEL.md](docs/database/DATA_MODEL.md) để biết rõ ranh giới "đã xác nhận" vs "suy đoán từ code".

## 7. Quy trình xử lý một yêu cầu

1. **Hiểu yêu cầu**: đọc tài liệu + code liên quan, nêu giả định, hỏi lại nếu thiếu thông tin ảnh hưởng lớn đến kết quả — không hỏi lại điều đã có trong tài liệu.
2. **Phân tích phạm vi**: phần nào thay đổi/không thay đổi, file dự kiến tác động, rủi ro, acceptance criteria.
3. **Lập kế hoạch** cho việc lớn: state/contract cần dùng → UI → tích hợp mock/API thật → kiểm tra → tài liệu.
4. **Thực hiện** đúng phạm vi, không refactor diện rộng ngoài yêu cầu, không xoá hành vi cũ ngoài yêu cầu.
5. **Kiểm tra**: `npm run lint`, `npm run build` khi phù hợp; không tuyên bố hoàn thành nếu lint/build lỗi trừ khi giải thích rõ lỗi không liên quan kèm bằng chứng.
6. **Đồng bộ tài liệu** bị ảnh hưởng trong cùng tác vụ.
7. **Báo cáo** theo mẫu:

```markdown
## Kết quả
- Đã hoàn thành:
- File chính đã thay đổi:
- Kiểm tra đã chạy:
- Kết quả:

## Cần lưu ý
- Rủi ro:
- Việc chưa làm:
- Bước tiếp theo:
```

## 8. Quy tắc Git

- Không commit `.env` hoặc secret.
- Không tự ý xóa thay đổi chưa commit; không dùng lệnh destructive (`reset --hard`, `push --force`...) trừ khi được yêu cầu rõ ràng.
- Kiểm tra `git status` trước và sau khi sửa.
- Mỗi commit một mục tiêu rõ ràng, theo Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
- Không tự động commit hoặc push nếu người dùng chưa yêu cầu.

## 9. Bảo mật

- Không đọc/in/ghi secret vào log hay console.
- Không commit `.env` (đã có trong `.gitignore`).
- `VITE_USE_MOCK_API` mặc định `true` khi không set — cảnh báo người dùng nếu chuẩn bị deploy production mà biến này chưa được set `false` rõ ràng, vì sẽ khiến app chạy toàn bộ bằng dữ liệu giả.
- Không đưa stack trace nội bộ hoặc response lỗi backend thật vào UI production.
- Cảnh báo nếu yêu cầu có thể gây mất dữ liệu người dùng cục bộ (Zustand persist trong `localStorage` key `capital-coffee-auth` — tên gọi là nợ kỹ thuật, xem [docs/DECISIONS.md](docs/DECISIONS.md) ADR-003, KHÔNG tự đổi tên nếu chưa được yêu cầu).

## 10. Chất lượng tài liệu

- Tài liệu ưu tiên tiếng Việt, giữ nguyên tên kỹ thuật bằng tiếng Anh.
- Không ghi thông tin suy đoán như sự thật — dùng "Chưa xác định", "Cần xác nhận", "Giả định".
- Đồng bộ với code, có ngày cập nhật, dùng liên kết đến file nguồn thay vì sao chép nội dung dài.
