# DATABASE_RULES — Quy tắc database

_Cập nhật: 2026-08-04_

## Chưa xác định — ngoài phạm vi repo này

Database thật do đội/repo backend phụ trách (xem [DATA_MODEL.md](DATA_MODEL.md), [DECISIONS.md](../DECISIONS.md) ADR-002). Repo `farmnhut` không chứa migration, schema, hay kết nối database trực tiếp nào — mọi truy cập dữ liệu đi qua REST API (`src/config/api.js`).

File này giữ chỗ theo cấu trúc tài liệu chuẩn của dự án; sẽ được điền khi:

1. Có xác nhận chính thức về công nghệ database thật (loại DB, ORM, quy tắc migration, index, foreign key...) từ đội backend, hoặc
2. Phạm vi công việc trong dự án `farmnhut` được mở rộng sang backend/database (yêu cầu ADR mới, xem DECISIONS.md).
