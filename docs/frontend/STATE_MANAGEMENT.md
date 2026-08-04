# STATE_MANAGEMENT — Quản lý state (Zustand)

_Cập nhật: 2026-08-04_

Toàn bộ state toàn cục dùng **Zustand** (không dùng Redux/Context API cho state lớn). Store đặt tại `src/stores/`, export tập trung qua `src/stores/index.js` (một số store như `cartStore` được import trực tiếp bằng đường dẫn đầy đủ thay vì qua `index.js` ở vài nơi — không nhất quán 100%, giữ nguyên trừ khi có task chuẩn hoá).

## Danh sách store

| Store | File | Persist? | Trách nhiệm |
|---|---|---|---|
| `useAuthStore` | `authStore.js` | Có (`localStorage`, key `capital-coffee-auth` — xem DECISIONS.md ADR-003) | User hiện tại, `accessToken`, `isAuthenticated`, các hàm kiểm tra role (`isAdmin`, `isStaff`, `hasRole`, `hasGlobalAccess`, `hasStoreAccess`...), `franchiseId` của user. Là store quan trọng nhất — gần như mọi trang/route đều phụ thuộc. |
| `useCartStore` | `cartStore.js` | Chưa xác nhận (không thấy trong `stores/index.js`, import trực tiếp `@/stores/cartStore`) | Giỏ hàng khách hàng (`items`, `fetchCart`, `clearCart`) — dùng ở `CustomerLayout`, `App.jsx` (lazy-load khi login thành công với role CUSTOMER) |
| `useOrderStore` | `orderStore.js` | Chưa xác nhận | State liên quan đơn hàng (tên gợi ý — cần đọc code khi làm task liên quan đến order) |
| `useShiftStore` (`shiftStore`) | `shiftStore.js` | Chưa xác nhận | State ca làm việc/chấm công, phối hợp với `shiftApi` trong `config/api.js` |
| `useUserStore` | `userStore.js` | Chưa xác nhận | State danh sách/quản lý user (khác với `authStore` — đó là user *đang đăng nhập*) |
| `useLanguageStore` | `useLanguageStore.js` | Chưa xác nhận (khả năng có, vì ngôn ngữ nên nhớ giữa các lần load) | Ngôn ngữ hiện tại (`vi`/`en`/`jp`), dùng ở hầu hết layout/page qua `translations[currentLangCode]` |
| `useProductStore` | `useProductStore.js` | Chưa xác nhận | State sản phẩm dùng chung giữa các trang |
| `useSearchStore` | `useSearchStore.js` | Không (state tìm kiếm tạm thời) | `searchQuery`, `isSearching`, `searchResults`, `performSearch()`, `clearSearch()` — dùng ở thanh tìm kiếm trong `CustomerLayout` |
| `useFranchiseStore` | `useFranchiseStore.js` | Chưa xác nhận | Danh sách/franchise đang chọn, dùng cho các trang có scope theo đại lý |
| `useLoyaltyStore` | `useLoyaltyStore.js` | Chưa xác nhận | State điểm/lịch sử loyalty |
| `useRecommendationStore` | `useRecommendationStore.js` | Chưa xác nhận | State gợi ý sản phẩm (AI recommend), dùng ở `RecommendationSection.jsx` |

> Cột "Chưa xác nhận" nghĩa là chưa đọc kỹ nội dung file trong phiên phân tích này — chỉ suy đoán từ tên. Khi làm task chạm tới store nào, đọc file thật và cập nhật lại dòng tương ứng thay vì tin vào bảng này.

## Quy tắc

- Component **không tự quản lý state nên thuộc về domain** (vd. giỏ hàng, user hiện tại) bằng `useState` cục bộ — phải qua store tương ứng để tránh state rời rạc giữa các trang.
- Chỉ persist (`zustand/middleware persist`) khi state cần sống sót qua reload trang và không nhạy cảm quá mức (hiện tại `authStore` là store persist rõ ràng nhất, có `accessToken` — xem SECURITY.md về rủi ro liên quan).
- `authStore.hasHydrated` dùng để tránh render sai trạng thái đăng nhập trước khi Zustand persist load xong từ `localStorage` — `ProtectedRoute` chờ `hasHydrated` trước khi quyết định redirect (xem `src/routes/ProtectedRoute.jsx`). Khi thêm store persist mới có ảnh hưởng tới route guard, áp dụng lại pattern này.
