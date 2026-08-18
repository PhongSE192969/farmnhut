# SESSION_LOG — Nhật ký phiên làm việc (append-only)

Không xóa lịch sử cũ. Khi file quá dài, chuyển log cũ sang `docs/logs/YYYY-MM.md` và giữ lại tóm tắt + các phiên gần nhất ở đây.

---

## 2026-08-04 20:xx – Thiết lập bộ tài liệu quản lý ngữ cảnh dự án

### Yêu cầu

Người dùng yêu cầu Claude Code đảm nhận vai trò Technical Lead/Architect/Senior Full-stack Developer cho dự án tại `D:\Work Mericy\Agency\web chú nhựt` (repo GitHub `PhongSE192969/farmnhut`, đã clone trước đó cùng phiên), thiết lập bộ tài liệu quản lý ngữ cảnh bắt buộc (`CLAUDE.md`, `docs/*`) trước khi bắt đầu code, theo một bộ quy tắc chi tiết do người dùng cung cấp.

### Phân tích

- Xác nhận thư mục làm việc đúng, git repo sạch, nhánh `main` đồng bộ `origin/main`, 2 commit.
- Repo **đã có code** (không rỗng) → theo đúng quy tắc người dùng đưa ra, bỏ qua 3 câu hỏi khởi tạo dành cho thư mục trống, thay vào đó phân tích code hiện có: đọc `App.jsx` (toàn bộ route), `src/config/api.js` (hợp đồng API ~15 nhóm endpoint), `src/config/axiosClient.js` (luồng auth Firebase + refresh token 401), `src/mocks/*` (mock adapter), `src/constraints/index.js` (ROLES, ORDER_STATUS...), `src/stores/authStore.js`, `src/routes/ProtectedRoute.jsx`, `src/services/authService.js` (xác nhận flow đăng nhập thật dùng Firebase ID token → `POST /auth/sync-user`), `src/layouts/*`, `src/navigations/admin.navigation.js`, `vite.config.js`, `eslint.config.js`, `jsconfig.json`, `package.json`, `.gitignore`, `README.md` gốc (mặc định Vite template, chưa có nội dung thực).
- Phát hiện: không có backend/database trong repo (chỉ có mock server); README gốc là template mặc định; không có `.env.example`; không có test nào; 12 file còn sót cụm `"capital-coffee-auth"`/"coffee" — dấu vết tái sử dụng code từ dự án khác (quán cà phê) chưa dọn hết.
- Đề xuất cấu trúc tích hợp tài liệu (giữ nguyên `src/` ở root, không chuyển monorepo; `docs/backend`, `docs/database` chỉ là tài liệu tham chiếu vì backend thật ngoài phạm vi) và đặt 3 câu hỏi xác nhận cho người dùng trước khi tạo file.

### Đã thực hiện

- Người dùng xác nhận: (1) backend thật đã tồn tại nhưng ngoài phạm vi — nhiệm vụ ở dự án này chỉ tối ưu frontend; (2) giữ nguyên cấu trúc thư mục ở root, không chuyển monorepo; (3) chỉ ghi chú "coffee" leftover vào tài liệu, không sửa code ngay.
- File đã tạo:
  - `CLAUDE.md` (gốc) — hướng dẫn trung tâm cho các phiên sau.
  - `README.md` (ghi đè bản mặc định Vite) — giới thiệu dự án thực tế.
  - `.env.example` — dựa theo biến `VITE_*` thực tế dùng trong `src/config/env.js`, `firebase.config.js`, `mockConfig.js`.
  - `docs/PROJECT_CONTEXT.md`, `docs/REQUIREMENTS.md`, `docs/CURRENT_STATE.md`, `docs/TASKS.md`, `docs/DECISIONS.md` (ADR-001/002/003), `docs/SESSION_LOG.md` (file này).
  - `docs/TECH_STACK.md`, `ARCHITECTURE.md` (kèm sơ đồ Mermaid luồng dữ liệu), `CODE_CONVENTIONS.md`, `SETUP_GUIDE.md`, `DEPLOYMENT.md`, `TESTING.md`, `SECURITY.md`, `HANDOVER.md`.
  - `docs/frontend/PAGE_INVENTORY.md` (trích đầy đủ từ `App.jsx`), `COMPONENT_INVENTORY.md`, `STATE_MANAGEMENT.md`, `UI_UX_GUIDE.md`.
  - `docs/backend/API_CONTRACT.md` (trích đầy đủ từ `src/config/api.js`, đánh dấu rõ "suy ra từ frontend"), `BUSINESS_RULES.md`, `AUTHORIZATION.md`, `ERROR_HANDLING.md`.
  - `docs/database/DATA_MODEL.md`, `DATABASE_RULES.md`, `MIGRATION_LOG.md` (đánh dấu ngoài phạm vi, giữ chỗ theo cấu trúc chuẩn).
- Chạy baseline `npm install` + `npm run lint` + `npm run build` (`TASK-002`), ghi kết quả thật vào `CURRENT_STATE.md` và thêm 3 backlog item mới (`TASK-005` sửa lint, `TASK-006` giảm bundle size, `TASK-007` rà soát `npm audit`) vào `TASKS.md`.
- Không có file code (`src/`) nào bị sửa trong phiên này — chỉ tạo/đổi file `.md`, `.env.example` và cài `node_modules` (không commit).

### Quyết định

- Xem `docs/DECISIONS.md` ADR-001 (giữ cấu trúc root), ADR-002 (backend/database ngoài phạm vi), ADR-003 (không sửa "coffee" leftover ngay).

### Kiểm tra

- `npm install`: thành công, 14 vulnerability (`npm audit`) chưa xử lý.
- `npm run lint`: 100 lỗi / 49 warning — nợ kỹ thuật có sẵn từ trước, không phải do phiên này gây ra (phiên này không sửa file trong `src/`).
- `npm run build`: thành công (6.67s), có cảnh báo bundle chính 2,007 kB chưa code-split.
- Chi tiết đầy đủ: `docs/CURRENT_STATE.md` mục "Trạng thái build/lint/test gần nhất".

### Việc tiếp theo

- Người dùng xác nhận mục tiêu "tối ưu frontend" cụ thể (`TASK-003`) để chuyển các item ở Backlog (đặc biệt `TASK-005`, `TASK-006`, `TASK-007`) sang Ready và bắt đầu code.
- Quyết định số phận 3 file rác ở root (`TASK-004`).

---

## 2026-08-05 → 2026-08-06 – Redesign trang chủ khách hàng (nhánh `feature/home-redesign`, Draft PR #1)

### Yêu cầu

Chuỗi yêu cầu liên tiếp của người dùng, làm việc trên nhánh riêng `feature/home-redesign` (không merge vào `main` khi chưa có xác nhận rõ ràng), theo dõi tiến độ qua Draft PR #1:

1. Redesign toàn bộ trang chủ khách hàng theo bộ spec chi tiết (màu sắc, typography, 13+ section, quy tắc chống bịa nội dung/ảnh, yêu cầu accessibility/SEO/performance).
2. Bổ sung: Hero dạng slideshow ảnh (Ken Burns/crossfade), 2 section xây dựng niềm tin mới ("Vì sao lựa chọn AgriFert?", "Chất lượng bắt đầu từ sự minh bạch"), 1-2 section nền video, sắp xếp lại 14 section theo thứ tự cụ thể, siết chặt quy tắc quản trị asset/nội dung.
3. Sửa Header/Navbar: desktop nav phải luôn 1 hàng, dàn đều, không bao giờ wrap/đè nhau, chuyển sang hamburger đúng lúc trước khi wrap — kiểm tra thật ở các width 1440/1280/1024/768/390/360px bằng Playwright, chỉ được sửa Header.
4. Header vẫn lỗi trên màn hình thật của người dùng (có ảnh chụp bằng chứng) → tìm root cause thật (phát hiện: `max-w-7xl` giới hạn cứng nội dung ở 1280px bất kể viewport rộng bao nhiêu).
5. Mở rộng header để tận dụng khoảng trắng 2 bên trên màn rộng (tham khảo bố cục 1 site khác).
6. Sửa độ tương phản chữ/badge ở Hero trên ảnh nền sáng (có ảnh chụp bằng chứng).
7. Bỏ hẳn hiệu ứng slideshow Hero, chỉ giữ 1 ảnh tĩnh "2 bàn tay giữ đất/cây con", đặt ảnh lệch sang phải để cân bằng bố cục — làm rõ vẫn phải là ảnh nền full-bleed (không phải card 2 cột đóng khung).
8. Yêu cầu redesign toàn trang theo phong cách 1 ảnh tham khảo mới (site diệt côn trùng Nga, hero isometric nổi bật) — người dùng làm rõ: **"Toàn bộ home page, tuy nhiên cân nhắc cái nào phù hợp thì làm giống như vậy, không thì giữ nguyên"**.
9. **Người dùng từ chối** bản redesign Hero (nền đặc + card ảnh nổi): "quá xấu, giúp tôi phục hồi lại cái nãy" → đã `git revert` commit đó, khôi phục về bản slideshow đã sửa tương phản.
10. Xóa badge "GIẢI PHÁP DINH DƯỠNG CÂY TRỒNG" khỏi Hero (theo ảnh chụp minh họa cụ thể).
11. Khởi động lại local server + đọc lại toàn bộ hội thoại để nắm context + ghi log vào file `.md` (yêu cầu hiện tại).

### Phân tích / Lỗi & cách sửa

- **Bug Tailwind dynamic class**: dùng biến JS nội suy vào class (`` `hidden ${VAR}:flex` ``) khiến Tailwind JIT không sinh CSS tương ứng, nav "biến mất" y hệt lỗi gốc. Sửa bằng cách viết cứng literal string `"xl:flex"` mọi nơi, có comment cảnh báo không tái phạm.
- **Bug `max-w-7xl` false-room (Header #1)**: từng thêm các biến thể `2xl:` (search full, chữ giỏ hàng, padding rộng hơn) với giả định "màn rộng hơn = nhiều chỗ hơn" — sai vì container bị khoá cứng ở 1280px bất kể viewport. Sửa: bỏ hết biến thể `2xl:`, layout compact cố định từ `xl` trở lên, verify bằng Playwright ở 1280/1440/1536/1920/2560px.
- **Bug padding-widening tại đúng 1280px (Header #2)**: khi mở rộng container sang `max-w-[1920px]`, lúc đầu tăng padding luôn ở mọi breakpoint kể cả `xl:px-14`, ăn vào ngân sách vốn đã rất hẹp ở 1280px → 1 link nav lại đè lên cụm actions. Sửa: chỉ tăng padding ở `2xl:px-14`, giữ nguyên `xl:px-6` đã verify an toàn.
- **`object-position` không có tác dụng trên ảnh nền full-bleed**: do `object-fit: cover` bị width-bound với ảnh gần vuông (4:3) trong container rất rộng/thấp, không còn khoảng crop ngang. Thử fix bằng Unsplash focal-point crop API — chưa xác nhận hiệu quả tốt trước khi bị chuyển hướng bởi yêu cầu #8, sau đó bị thay thế hoàn toàn bởi bản card đóng khung (không còn bị giới hạn này).
- **Hiểu sai yêu cầu #7 lần đầu**: tưởng người dùng muốn layout 2 cột đóng khung — bị từ chối qua tool-call rejection + làm rõ lại là vẫn giữ ảnh nền full-bleed, chỉ chỉnh vị trí crop sang phải.
- **Redesign Hero bản nền đặc + card nổi (commit `301f509`)** bị người dùng đánh giá "quá xấu" → revert bằng `git revert 301f509` (không dùng `reset` để giữ lịch sử, khôi phục sạch cả 3 file ảnh hero đã bị xoá).

### Đã thực hiện (theo commit trên `feature/home-redesign`)

- `0b3c45c` feat(home): redesign trang chủ khách hàng AgriFert (bản đầu tiên theo spec chi tiết).
- `e9db250` feat(home): hero slideshow, các section video, rà soát nội dung theo addendum.
- `16a8140` refactor(home): sắp xếp lại thứ tự section theo hành trình khách hàng yêu cầu.
- `a9c27d0` fix(header): dừng nav wrap/đè nhau, hợp nhất breakpoint hamburger.
- `489c202` fix(header): bỏ các tier `2xl` "an toàn giả", vẫn lỗi trên màn rộng thật → điều tra tiếp.
- `985a7f2` style(header): mở rộng container để nội dung tận dụng hết chiều rộng thanh header.
- `736ed12` fix(hero): sửa tương phản chữ/badge thấp trên ảnh slideshow sáng.
- `301f509` redesign(hero): nền đặc + card ảnh nổi, tham khảo ảnh mới → **bị từ chối**.
- `b24d809` Revert "redesign(hero): nền đặc + card ảnh nổi..." → khôi phục về trạng thái `736ed12`.
- *(chưa commit)* Xóa badge "GIẢI PHÁP DINH DƯỠNG CÂY TRỒNG" khỏi `HomeHero.jsx` + dọn import `Leaf` không dùng.

### File chính bị ảnh hưởng

- `src/components/customer/home/HomeHero.jsx` — file bị sửa nhiều nhất; hiện tại (sau revert + xoá badge): nền full-bleed slideshow 3 ảnh crossfade + Ken Burns (`SLIDES` array, `activeIndex`/`slidesReady` state, `setInterval` 7s), overlay 2 lớp (tint phẳng + gradient), không còn badge eyebrow, có text-shadow cho H1/paragraph để đảm bảo tương phản.
- `src/components/customer/layout/CustomerHeader.jsx` — breakpoint `xl` (1280px) duy nhất gate desktop row, `justify-evenly` + `whitespace-nowrap`, search thu gọn thành icon + panel nổi, container mở rộng `max-w-[1920px]` với padding scoped theo breakpoint (`xl:px-6`, `2xl:px-14`).
- `src/components/customer/layout/MobileNav.jsx` — mở rộng thêm search, language switcher, cart button (do drawer giờ bao phủ toàn bộ `<1280px`).
- `src/pages/customer/HomePage.jsx` — thứ tự section cuối cùng: Hero → WhyAgriFert → VideoSection(brand story) → TransparencyStory → franchise-selector → FeaturedProducts + Recommendation → CropExplorer → CropProblems → NutritionJourney → FarmerKnowledge → VideoSection(store-locator) → StoreLocator → ProductFinder (cuối cùng) → DealerCTA.
- `public/assets/customer/hero/` — 3 ảnh slideshow đã khôi phục lại (từng bị xoá ở `301f509`).
- Toàn bộ danh sách component mới khác (`MegaMenu`, `WhyAgriFert`, `VideoSection`, `TransparencyStory`, `CropExplorer`, `CropProblems`, `NutritionJourney`, `FarmerKnowledge`, `StoreLocator`, `DealerCTA`, v.v.) — xem chi tiết code, không lặp lại ở đây.

### Việc còn tồn đọng / chưa xử lý (đã báo người dùng nhưng ngoài phạm vi lúc phát hiện)

- Nested `<a>` trong `ProductCard.jsx` (link "Hỏi kỹ thuật viên" lồng trong `<Link>`) — gây warning React, chưa sửa.
- Tràn ngang ~29px ở viewport 360px, từng truy vết đến 1 badge Hero `whitespace-nowrap` — badge đó đã đổi/xoá nhiều lần từ lúc phát hiện, **cần kiểm tra lại** xem còn tồn tại không.
- 2 file video nền thật cho `VideoSection.jsx` chưa có (chỉ có poster) — bị chặn bởi bot-protection khi tải tự động từ Pexels/Pixabay, cần công cụ khác hoặc tải thủ công.
- Bundle chính ~2MB chưa nén (`TASK-006`), 99 lỗi/49 warning lint có sẵn từ trước — chưa động vào, ngoài phạm vi các task Hero/Header.
- Thư mục `"ảnh web/"` (untracked, ở root repo) — có vẻ là ảnh tham khảo người dùng thả vào, **chưa rõ có cần giữ trong repo hay không**, chưa commit/xoá.

### Kiểm tra

- `npm run build`: thành công sau revert (7.51s), cùng cảnh báo bundle-size đã biết trước đó (không phải regression mới).
- Chưa chạy `npm run lint` riêng cho thay đổi mới nhất (xoá badge) — nên chạy trước khi commit.
- Dev server đã restart, xác nhận `HTTP 200` tại `http://127.0.0.1:5173/home`.

### Việc tiếp theo

- Xác nhận với người dùng: giữ slideshow Hero (bản vừa phục hồi) hay vẫn muốn bỏ hiệu ứng chuyển động, chỉ dùng 1 ảnh tĩnh "2 bàn tay" như từng yêu cầu ở bước #7 (yêu cầu này chưa được thực hiện lại sau revert).
- Commit thay đổi xoá badge hiện đang ở trạng thái chưa commit (`M src/components/customer/home/HomeHero.jsx`).
- Quyết định số phận thư mục `"ảnh web/"` chưa track.
- Chạy `npm run lint` cho thay đổi mới nhất trước khi commit.

---

## 2026-08-15 – Đọc lại context + rà soát khối thay đổi lớn chưa được ghi log trên trang chủ

### Yêu cầu

Người dùng yêu cầu đọc lại toàn bộ tài liệu `.md` để nắm lại context (mục 1 CLAUDE.md), sau đó "hoàn thành các việc còn lại" và khởi chạy local dev server để xem trực tiếp.

### Phân tích

- Đọc `CLAUDE.md`, `PROJECT_CONTEXT.md`, `CURRENT_STATE.md`, `TASKS.md`, `SESSION_LOG.md`, `DECISIONS.md`. Đối chiếu với `git status`/`git diff --stat` thực tế thì phát hiện: `SESSION_LOG.md` (dù đang ở trạng thái modified trong working tree) chỉ dừng log ở việc sửa Hero/Header (mục 2026-08-05→08-06), trong khi code đã có thêm một khối thay đổi lớn hơn nhiều **chưa từng được ghi log ở phiên nào trước đó** — không rõ do phiên trước bị ngắt giữa chừng trước khi kịp cập nhật log.
- Khối thay đổi chưa log gồm: `HomePage.jsx` viết lại thứ tự 13 section; 2 component mới `HighlightProducts.jsx` (dải sản phẩm cuộn ngang, tự xoay vòng card "nổi bật" bằng FLIP animation + đo chiều cao theo cột text) và `StoreShopSplit.jsx` (banner CTA chia đôi "Điểm bán lẻ"/"Cửa hàng trực tuyến", thay cho 1 `VideoSection` transition cũ); `NutritionJourney.jsx` viết lại lớn (+380 dòng, đổi sang minh hoạ hành trình sinh trưởng cây chanh với ảnh mới `growth-stages/`); sửa vừa/nhỏ ở `TransparencyStory.jsx`, `WhyAgriFert.jsx`, `CustomerButton.jsx` (thêm variant `white`, hiệu ứng icon hover), `DealerCTA.jsx`, `CropProblems.jsx`; đổi nền `bg-customer-light/50` → `bg-white` ở `CropExplorer.jsx`/`FarmerKnowledge.jsx`/`ProductFinder.jsx` (đồng bộ màu nền xen kẽ giữa các section); thêm `focus-within` ring cho ô chọn khu vực ở `StoreLocator.jsx`; asset mới chưa track (`growth-stages/`, `products/`, `highlightProducts.js`) + cập nhật nguồn ảnh Unsplash trong `ATTRIBUTION.md`.
- Xác nhận lại 2 mục tồn đọng cũ trong log trước: nested `<a>` trong `ProductCard.jsx` (dòng 251, vẫn lồng trong `<Link>` ở dòng 137–262) — **vẫn còn tồn tại**, chưa sửa (ngoài phạm vi yêu cầu hiện tại, không tự ý sửa); chưa đo lại tràn ngang 360px trong phiên này.

### Đã thực hiện

- `npm run lint`: chạy toàn repo, lọc riêng các file thuộc khối thay đổi trang chủ (`src/components/customer/home/*`, `HomePage.jsx`, `CustomerButton.jsx`) → **0 lỗi/warning**. 99 lỗi + 48 warning còn lại nằm ngoài phạm vi (nợ kỹ thuật có sẵn, đã ghi nhận ở `TASK-005`), không đụng tới.
- `npm run build`: thành công (7.53s), cùng 2 cảnh báo cũ đã biết (3 module vừa static vừa dynamic import; bundle chính 2,070.94 kB / gzip 582.90 kB) — không phải regression mới.
- Khởi động `npm run dev` (nền), xác nhận `HTTP 200` tại `http://127.0.0.1:5173/home`.
- Không sửa file code nào trong phiên này — chỉ kiểm tra (lint/build/dev) và cập nhật tài liệu.

### Kiểm tra

- `npm run lint`: xem trên — sạch với phạm vi trang chủ.
- `npm run build`: thành công.
- Dev server: `http://127.0.0.1:5173/home` → 200.

### Việc tiếp theo

- Khối thay đổi lớn ở trên vẫn **chưa commit** — cần người dùng xác nhận nội dung trước khi tạo commit (theo mục 8 CLAUDE.md, không tự ý commit).
- Quyết định số phận 2 thư mục tiếng Việt chưa track ở root (`"ảnh web/"`, `"Hình ảnh sản phẩm/"`) và 2 thư mục asset mới (`public/assets/customer/growth-stages/`, `public/assets/customer/products/`) — giữ trong repo hay không.
- Nested `<a>` trong `ProductCard.jsx` vẫn còn, chưa sửa (ngoài phạm vi phiên này).
- Chưa đo lại tràn ngang ở viewport 360px.

---

## 2026-08-18 – Bật local dev server + chỉnh 3 section trang chủ (Gợi ý theo giai đoạn / Khám phá theo cây trồng / thay Cần định hướng bằng đánh giá khách hàng)

### Yêu cầu

Chuỗi yêu cầu trong 1 phiên: (1) bật `npm run dev` để xem trực tiếp; (2) chuẩn hoá "Gợi ý theo giai đoạn" (`NutritionJourney.jsx`) — bỏ thanh cuộn ngang ở desktop, sau đó đổi timeline dọc mobile/tablet từ đường thẳng sang zigzag so le uốn lượn; (3) thiết kế lại "Khám phá theo cây trồng" (`CropExplorer.jsx`) dựa trên ảnh tham khảo (Lawnx "About Our Company") — qua nhiều vòng chỉnh: bố cục collage → bỏ nút CTA + đổi so le thành vòng cung → sửa lại hướng cong (thung lũng, không phải gò lên) + bỏ ảnh "Hoa và cây cảnh" + đổi ảnh lúa → tăng nhẹ kích thước card; (4) xoá section "Cần định hướng" (`CropProblems.jsx`), thay bằng section đánh giá khách hàng mới (`CustomerReviews.jsx`) với 2 hàng cuộn ngang vô hạn, ngược chiều nhau. Yêu cầu áp dụng skill "UI/UX Pro Max" xuyên suốt — skill này **không** có trong danh sách skill được đăng ký cho project (không gọi được qua lệnh `/`), nên đã đọc trực tiếp tài liệu hướng dẫn từ thư mục `ui-ux-pro-max-skill-main/` ở root repo (không thuộc `src/`) để áp dụng thủ công.

### Đã thực hiện

- **Dev server**: `npm run dev` chạy nền tại `http://127.0.0.1:5173`, giữ chạy xuyên suốt phiên để người dùng xem trực tiếp sau mỗi lần sửa.
- **`NutritionJourney.jsx`**: đổi ngưỡng chuyển layout ngang/dọc từ `sm` (640px) sang `lg` (1024px) + chia tầng kích thước cột/gap theo `lg`/`xl` để hàng ngang luôn vừa khít container (hết tràn ngang, bỏ `overflow-x-auto`/`scrollbar-hide` không cần thiết ở giữa dải breakpoint). Sau đó viết lại toàn bộ layout mobile/tablet (`<lg`) từ timeline dọc đường thẳng sang **zigzag so le uốn lượn**: tách logic đo DOM + vẽ đường cong SVG thành hook dùng chung `useConnectorPath` (dùng cho cả hướng ngang lẫn dọc, thêm hàm `smoothPathThroughVertical`), mở rộng `StageCard` hỗ trợ mũi tên trái/phải, thêm `MobileStageRow` cho từng hàng (ảnh + card lệch trái/phải xen kẽ, card rộng cố định — không kéo full-width — để tạo so le thật). Vướng lỗi lint `react-hooks/refs`/`react-compiler` khi hook trả về object chứa ref (bị coi "nhiễm ref" toàn bộ) → sửa bằng cách khai báo ref trực tiếp ở component cha, hook chỉ trả state thuần.
- **`CropExplorer.jsx`**: viết lại nhiều vòng theo phản hồi người dùng. Bản cuối: bỏ hẳn cách chia grid 3 cột trái/giữa/phải (từng khiến 2 ảnh biên bị kéo giãn theo chiều cao — nguyên nhân "2 hình 2 bên quá to"); gộp toàn bộ 7 ảnh cây trồng vào **1 hàng duy nhất, cùng kích thước** (`w-28 xl:w-36`, `aspect-[4/5]`), tạo hiệu ứng uốn cong **hình thung lũng** (2 đầu cao ngang tiêu đề, trũng dần vào giữa) bằng mảng `VALLEY_DROP` (margin-top tăng dần, item `items-start`) — không dùng animation/JS đo đạc, thuần Tailwind. Bỏ nút CTA "Xem tất cả cây trồng". Xoá crop "Hoa và cây cảnh" khỏi `src/data/customer/crops.js` (đã kiểm tra không còn nơi nào khác trong `src/` tham chiếu `hoa-canh`, an toàn khi xoá; giữ lại file ảnh `hoa-canh.jpg` trên đĩa). Đổi ảnh `lua.jpg`: tìm trên Unsplash (giấy phép Unsplash License, ảnh cận cảnh bông lúa chín trĩu hạt của N Suma), tải về local `public/assets/customer/crops/lua.jpg`, cập nhật `imageAlt` + `public/assets/customer/ATTRIBUTION.md`.
- **`CustomerReviews.jsx` (mới)**: thay thế hoàn toàn `CropProblems.jsx` trong `HomePage.jsx` (section 7). Layout theo ảnh tham khảo: card trắng bo góc, avatar chữ cái đầu tô màu (không dùng ảnh người thật — tránh dựng ảnh giả làm khách hàng thật), tên + badge check màu xanh + handle, trích dẫn đánh giá. 2 hàng cuộn ngang vô hạn, **mỗi hàng ngược chiều nhau** (trái/phải) và tốc độ khác nhau (45s/55s) cho cảm giác tự nhiên hơn — kỹ thuật: mỗi hàng render danh sách card **2 lần liên tiếp**, animate `translateX` đúng 1 lần độ rộng bản sao (`-50%`) để điểm lặp liền mạch, không giật. Thêm keyframes `reviews-marquee-left/right` vào `src/index.css` (pause khi hover, tắt animation khi `prefers-reduced-motion: reduce` — theo đúng pattern các animation khác đã có sẵn trong file). Container vẫn giữ `overflow-x-auto` (không phải `hidden`) làm phương án dự phòng cho người dùng tắt hiệu ứng chuyển động vẫn cuộn tay xem hết được. Dữ liệu mock 10 đánh giá: `src/data/customer/reviews.js` (đúng convention `isMock`/`dataStatus`), thêm `getReviews()` vào `src/services/customerHomeService.js`.
- Xoá `src/components/customer/home/CropProblems.jsx` (không còn nơi nào import sau khi thay bằng `CustomerReviews` — dead code). **Giữ lại** `src/data/customer/cropProblems.js` + `getCropProblems()` vì `ProductFinder.jsx` vẫn dùng.
- Cập nhật `docs/CURRENT_STATE.md` phản ánh toàn bộ thay đổi trên.

### Kiểm tra

- `npx eslint` theo từng file/lượt sửa: 0 lỗi mỗi lần. `NutritionJourney.jsx` còn 4 warning `react-hooks/exhaustive-deps` không chặn build (refs truyền qua tham số hook, rule không tự nhận diện — đã ghi chú lý do trong code).
- `npm run build`: chạy lại sau mỗi vòng sửa, luôn thành công (~7–11s), bundle chính tăng nhẹ theo từng section mới (~2,070kB → ~2,094kB gzip ~589kB), không có lỗi mới.
- Chưa test thực tế trên trình duyệt thật (chỉ dựa vào tính toán chiều rộng theo breakpoint + review code) — người dùng xác nhận từng bước qua ảnh chụp màn hình.

### Việc tiếp theo

- Toàn bộ thay đổi phiên này **chưa commit** (cùng batch với các thay đổi trang chủ trước đó, xem `CURRENT_STATE.md`).
- Người dùng cần mở trình duyệt xem trực tiếp `CustomerReviews` (đặc biệt hiệu ứng 2 hàng cuộn ngược chiều + pause khi hover) trước khi coi là hoàn tất.
- Cân nhắc dọn ảnh `hoa-canh.jpg` không còn dùng (hiện vẫn giữ trên đĩa, ghi chú trong `ATTRIBUTION.md`) nếu chắc chắn không tái sử dụng.
- Các mục tồn đọng cũ (nested `<a>` trong `ProductCard.jsx`, tràn ngang 360px, 2 thư mục ảnh tham khảo chưa track ở root) vẫn chưa xử lý, ngoài phạm vi phiên này.
