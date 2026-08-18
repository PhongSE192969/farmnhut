# CURRENT_STATE — Trạng thái hiện tại

_Cập nhật: 2026-08-18_
_Nhánh Git: `feature/home-redesign` (Draft PR #1, chưa merge vào `main`)_
_Phase hiện tại: Redesign trang chủ khách hàng (`HomePage.jsx` + section con) — nhiều thay đổi đã hoàn thiện và verify (lint/build) nhưng **chưa commit**_

## Chức năng đã hoạt động (mock)

Toàn bộ UI cho 5 vai trò (ADMIN, MANAGER, STORE_MANAGER, STAFF, CUSTOMER) đã có và chạy được với `VITE_USE_MOCK_API=true` (mặc định) — xem chi tiết [TASKS.md](TASKS.md) và [REQUIREMENTS.md](REQUIREMENTS.md). Chưa verify tính năng nào đã hoạt động đúng với backend thật (out of scope repo này).

## Chức năng đang triển khai

Redesign trang chủ khách hàng (`src/pages/customer/HomePage.jsx` + `src/components/customer/home/*`) trên nhánh `feature/home-redesign`. Trạng thái hiện tại: code đã hoàn thiện, đã lint + build sạch, dev server chạy được, nhưng **toàn bộ thay đổi vẫn ở working tree, chưa commit** (xem danh sách file ở mục "File quan trọng đang được chỉnh sửa" và chi tiết ở [SESSION_LOG.md](SESSION_LOG.md) mục 2026-08-15).

## Việc cần làm tiếp theo

1. Người dùng xác nhận nội dung khối thay đổi trang chủ hiện tại (13 section, 3 component mới `HighlightProducts`/`StoreShopSplit`/`CustomerReviews`, viết lại `NutritionJourney` + `CropExplorer`) trước khi commit.
2. Quyết định giữ hay xoá 2 thư mục tiếng Việt chưa track ở root (`"ảnh web/"`, `"Hình ảnh sản phẩm/"`) — có vẻ là ảnh tham khảo người dùng thả vào, không thuộc cấu trúc asset chuẩn (`public/assets/...`).
3. Sửa nested `<a>` trong `src/components/customer/ProductCard.jsx` (dòng 251, lồng trong `<Link>`) — tồn đọng từ trước, chưa có task riêng.
4. Đo lại tràn ngang ở viewport 360px (tồn đọng từ trước, chưa re-verify).

## Lỗi hoặc blocker hiện tại

Không có blocker kỹ thuật. Một số điểm cần lưu ý (không chặn tiến độ):

- Node.js version chưa pin trong repo (`.nvmrc`/`engines` không có).
- 3 file rác ở root (`eslint.txt`, `eslint.utf8.txt`, `eslint_output.json`) — có vẻ là output cũ của lệnh lint, chưa rõ có cần giữ lại không.
- 99 lỗi/48 warning ESLint có sẵn từ trước (`TASK-005`), không nằm trong phạm vi các file trang chủ — chưa xử lý.

## Các quyết định đang chờ người dùng

- Nội dung/commit của khối redesign trang chủ hiện tại (mục "Việc cần làm tiếp theo" #1).
- Số phận 2 thư mục chưa track ở root (mục #2).

## Lệnh cần chạy để tiếp tục

```bash
npm install
npm run dev     # http://127.0.0.1:5173, tài khoản test xem SETUP_GUIDE.md
npm run lint
npm run build
```

## File quan trọng đang được chỉnh sửa

Chưa commit (working tree), thuộc redesign trang chủ:

- `src/pages/customer/HomePage.jsx` — thứ tự 13 section cuối cùng; section 7 đổi từ `CropProblems` (đã xoá) sang `CustomerReviews`.
- `src/components/customer/home/HighlightProducts.jsx` (mới) — dải sản phẩm cuộn ngang tự xoay vòng.
- `src/components/customer/home/StoreShopSplit.jsx` (mới) — banner CTA chia đôi retail/online.
- `src/components/customer/home/CustomerReviews.jsx` (mới) — thay thế `CropProblems`; 2 hàng đánh giá khách hàng cuộn ngang vô hạn, mỗi hàng ngược chiều nhau (CSS keyframes `reviews-marquee-left/right` trong `src/index.css`, pause khi hover, tôn trọng `prefers-reduced-motion`). Dữ liệu mock: `src/data/customer/reviews.js` + `getReviews()` trong `customerHomeService.js`.
- `src/components/customer/home/NutritionJourney.jsx` — viết lại lớn: hành trình sinh trưởng cây chanh (desktop: wave ngang lg+; mobile/tablet: timeline dọc zigzag so le trái/phải, dùng chung hook đo-vẽ đường cong `useConnectorPath`).
- `src/components/customer/home/CropExplorer.jsx` — viết lại: 1 hàng 7 ảnh cùng kích thước (lg+), uốn cong dạng thung lũng (`VALLEY_DROP`) lấy cảm hứng từ ảnh tham khảo Lawnx; bỏ nút CTA; xoá crop "Hoa và cây cảnh" khỏi `src/data/customer/crops.js`; đổi ảnh `lua.jpg` sang cận cảnh bông lúa chín (nguồn Unsplash, ghi trong `ATTRIBUTION.md`).
- `CropProblems.jsx` **đã xoá** (không còn nơi nào import; `getCropProblems()`/`cropProblems.js` vẫn giữ vì `ProductFinder.jsx` còn dùng).
- `src/components/customer/home/{TransparencyStory,WhyAgriFert,DealerCTA,FarmerKnowledge,ProductFinder,StoreLocator,HomeHero}.jsx`, `src/components/customer/ui/CustomerButton.jsx`, `src/index.css`, `src/data/customer/growthStages.js` — sửa vừa/nhỏ.
- Asset mới chưa track: `public/assets/customer/growth-stages/`, `public/assets/customer/products/`, `src/data/customer/highlightProducts.js`.

## Trạng thái build/lint/test gần nhất

Đã chạy lại ngày 2026-08-18 cho khối thay đổi trang chủ hiện tại (chưa commit):

- `npm run lint`: 0 lỗi trong phạm vi file trang chủ đã sửa (còn 4 warning `react-hooks/exhaustive-deps` trong `NutritionJourney.jsx`, không chặn build — refs truyền qua tham số hook nên rule không tự nhận diện, đã ghi chú lý do trong code). 99 lỗi + 48 warning baseline cũ (`TASK-005`) ở phạm vi ngoài trang chủ không tăng thêm.
- `npm run build`: thành công (~7–11s tuỳ lần). Cùng 2 cảnh báo cũ: 3 module vừa static vừa dynamic import (`userService.js`, `cartStore.js`, `inventoryService.js`); bundle chính `index-*.js` ~2,094 kB (gzip ~589 kB) — chưa code-split theo route (`TASK-006`).
- `npm run dev`: chạy nền, xác nhận `HTTP 200` tại `http://127.0.0.1:5173/home`.
- `npm install`/`npm audit`: chưa chạy lại trong phiên này — baseline 14 vulnerability ngày 2026-08-04 (`TASK-007`) coi như vẫn còn hiệu lực cho tới khi rà soát lại.
