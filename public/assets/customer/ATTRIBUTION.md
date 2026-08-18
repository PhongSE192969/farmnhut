# Asset attribution — customer storefront

All photos below are downloaded locally (no hotlinking) under the free
[Unsplash License](https://unsplash.com/license) (free for commercial and
non-commercial use). None require attribution by license terms, but it is
credited here for transparency and to make future replacement easier.

Every asset referenced from `src/data/customer/*.js` or component props
carries this metadata (not rendered on the customer-facing UI, used
internally so the dev team knows what's stock vs. brand-verified):

```js
{
  assetType: "illustration", // "illustration" | "photo" | "video"
  dataStatus: "stock",       // "stock" | "brand-verified"
  isBrandVerified: false,
}
```

**None of the imagery below depicts real AgriFert fields, customers,
dealers, factories, or product-in-use results.** It is stock content
illustrating the fertilizer/agriculture domain in general. Captions in the
UI use "Hình ảnh minh họa" rather than implying it's AgriFert's own.

## Hero slideshow (`hero/`)

| Local file | Source | Photographer | Role |
|---|---|---|---|
| `hero-farm-field.jpg` (+ `-mobile.jpg` crop) | https://unsplash.com/photos/photo-of-green-grass-field-at-sunrise-4miBe6zg5r0 | Ales Krivec | Slide 1 — LCP, sunrise field |
| `hero-hands-seedling.jpg` | https://unsplash.com/photos/x8ZStukS2PM | Noah Buscher | Slide 2 — hands/seedling close-up |
| `hero-golden-field.jpg` | https://unsplash.com/photos/golden-wheat-field-ready-for-harvest-_rXmtIMnOT8 | Nikolett Emmert | Slide 3 — harvest-season field |

## Crop explorer (`crops/`)

| Local file | Source | Photographer |
|---|---|---|
| `lua.jpg` | https://unsplash.com/photos/close-up-of-ripe-rice-stalks-in-a-field-1V64AO7F0Y0 | N Suma |
| `ca-phe.jpg` | https://unsplash.com/photos/vJ3KldG86Eo | Eduardo Gorghetto |
| `ho-tieu.jpg` | https://unsplash.com/photos/a-bunch-of-green-fruit-hanging-from-a-tree-NfxR-HFRQb4 | Siborey Sean |
| `sau-rieng.jpg` | https://unsplash.com/photos/TxOzkgw1oJg | The Manh |
| `cay-an-trai.jpg` | https://unsplash.com/photos/an-apple-orchard-with-lots-of-trees-in-the-background-grohryGg_kQ | Karin Kim |
| `rau-mau.jpg` | https://unsplash.com/photos/pXJr0AVxO8I | Egor Myznik |
| `cay-cong-nghiep.jpg` | https://unsplash.com/photos/sugar-cane-field-with-a-blue-sky-9A28d24Pyd4 | Emmanuel Appiah |

`hoa-canh.jpg` (Odile, https://unsplash.com/photos/a-person-walks-through-a-lush-green-plant-nursery-iZVU7yLwD8E)
is no longer referenced from `src/data/customer/crops.js` — the "Hoa và cây cảnh" crop was removed from the
homepage crop explorer. File kept on disk in case it's reused elsewhere later.

## Hành trình dinh dưỡng — giai đoạn sinh trưởng (`growth-stages/`)

Theo yêu cầu, 4/6 ảnh đổi sang chủ đề cây chanh cụ thể để đồng nhất xuyên suốt
hành trình. `chuan-bi-dat.jpg` và `phuc-hoi.jpg` giữ ảnh minh họa chung
(ruộng/tưới cây) vì Unsplash không có ảnh cây chanh phù hợp cho 2 giai đoạn
này (chưa xuống giống nên chưa có cây; hành động tưới không đặc thù theo cây).

| Local file | Source | Photographer | Stage | Ghi chú |
|---|---|---|---|---|
| `chuan-bi-dat.jpg` | https://unsplash.com/photos/a-red-tractor-plowing-a-field-under-a-blue-sky-5Yl2TSsqMXk | Kern Morris | Chuẩn bị đất | Minh họa chung |
| `nuoi-cay.jpg` | https://unsplash.com/photos/green-plant-sprouting-at-daytime-fjj7lVpCxRE | Roman Synkevych | Nuôi cây | Minh họa chung — không tìm được ảnh cây chanh con phù hợp |
| `phuc-hoi.jpg` | https://unsplash.com/photos/watering-plants-with-a-watering-can-1VJt-0nyDhg | Benjamin White | Phục hồi | Minh họa chung |
| `truoc-ra-hoa.jpg` | https://unsplash.com/photos/lemon-tree-flower-blossoming-amidst-lush-green-foliage-XMN60jZl4vc | Sajidur Rahman | Trước ra hoa | Hoa chanh thật |
| `ho-tro-dau-trai.jpg` | https://unsplash.com/photos/a-group-of-lemons-on-a-tree-_vspZo6NJ8I | Jacek Ulinski | Hỗ trợ đậu trái | Trái chanh non thật |
| `nuoi-trai.jpg` | https://unsplash.com/photos/a-close-up-of-a-lemon-on-a-tree-branch-SvcqecsuySE | Jason Leung | Nuôi trái | Chanh chín thật, cận cảnh quả to |

## "Vì sao lựa chọn AgriFert?" section

| Local file | Source | Photographer |
|---|---|---|
| `why-agrifert.jpg` | https://unsplash.com/photos/l_5MJnbrmrs | no one cares (@no_one_cares) — aerial shot of farm vehicles during a maize harvest, Germany, no visible logos/branding |

## Trang "Về chúng tôi" (`about/`)

| Local file | Source | Photographer | Vai trò |
|---|---|---|---|
| `hero-farmer-crops.jpg` | https://unsplash.com/photos/a-group-of-people-working-in-a-rice-field-U5ODjFN2pHk | Quang Nguyen Vinh | Hero — nền ảnh full-bleed, không có nút CTA. Ảnh flycam nhiều nông dân cùng cấy lúa trên ruộng bậc thang |
| `about-hands-plant.jpg` | https://unsplash.com/photos/hands-holding-a-plant-NM6mjksWZeo | Sergey Kotenev | Section "Về AgriFert" — ảnh cận cảnh tay chăm sóc cây |
| `support-smallholder-farmer.jpg` | https://unsplash.com/photos/man-in-grey-polo-shirt-carrying-baskets-xj7HV0FvSg0 | Who's Denilo? (@whoisdenilo) | Section "Hỗ trợ những ai" — nông dân canh tác hộ nhỏ, Bali |
| `value-materials.jpg` | https://unsplash.com/photos/a-close-up-of-a-bunch-of-white-balls-jvFgC2F4gf8 | Kenneth Berrios Alvarez | Giá trị cốt lõi — "Lựa chọn nguyên liệu" (hạt phân bón cận cảnh) |
| `value-quality.jpg` | https://unsplash.com/photos/a-person-holding-a-handful-of-dirt-in-their-hand-bQ9y93kdk4c | Alicia Christin Gerald | Giá trị cốt lõi — "Kiểm soát chất lượng" (tay kiểm tra đất) |
| `value-guidance.jpg` | https://unsplash.com/photos/man-in-wicker-conical-hat-raking-on-grassy-field-Ujcwgj1xdbA | Daniel Klein | Giá trị cốt lõi — "Hướng dẫn sử dụng rõ ràng" (nông dân Việt Nam làm ruộng theo đúng phương pháp, thay bản trước không phải bối cảnh Việt Nam) |
| `value-companion.jpg` | https://unsplash.com/photos/DdnLKP_Yc2Y | Marc Hastenteufel | Giá trị cốt lõi — "Đồng hành cùng người trồng" (nhóm nông dân Việt Nam (Bắc Bộ) cùng cấy lúa, thay bản trước không phải bối cảnh Việt Nam) |

Section "Sứ mệnh & Tầm nhìn" tái sử dụng 2 ảnh đã có sẵn trong repo thay vì tải mới: `hero/hero-hands-seedling.jpg` (Sứ mệnh) và `why-agrifert.jpg` (Tầm nhìn) — xem nguồn ở các mục tương ứng phía trên.

## Kiến thức nhà nông — ảnh bìa bài viết (`articles/`)

| Local file | Source | Photographer | Bài viết |
|---|---|---|---|
| `cham-soc-theo-mua-vu.jpg` | https://unsplash.com/photos/a-farmer-works-in-a-lush-green-rice-field-4A2zIMqwG2A | Danielle Suijkerbuijk | Chăm sóc cây trồng theo từng mùa vụ |
| `dinh-duong-can-thiet.jpg` | https://unsplash.com/photos/a-hand-holding-a-seedling-in-a-pot-sq5acw3Q0-o | srinivas bandari | Các nhóm dinh dưỡng cần thiết cho cây trồng |
| `dau-hieu-thieu-chat.jpg` | https://unsplash.com/photos/yellow-and-green-leaves-plant-gdcnd2Iobw8 | Kelly Sikkema | Nhận biết một số dấu hiệu thiếu chất ở cây trồng |
| `huong-dan-su-dung-an-toan.jpg` | https://unsplash.com/photos/spraying-pesticide-on-some-green-foliage-Gg-EIrKByYA | MESTO Sprayers Sprühgeräte | Hướng dẫn sử dụng phân bón an toàn và hiệu quả |

## Video sections (`video/`)

**Video files themselves are NOT included in this PR.** Automated download
of Pexels/Pixabay video files was attempted (see report) but blocked by
their bot-protection/rate-limiting in this environment, and no `ffmpeg`
is available here to compress a fetched file. Both `VideoSection`
placements currently render **poster-image only** (no `<video>` element
mounted) — visually distinct full-bleed image sections, not broken video
players. Swapping in a real compressed `.mp4` later only requires setting
the `videoSrc` prop; no component changes needed.

| Local file | Source | Photographer | Used as poster for |
|---|---|---|---|
| `video/poster-brand-story.jpg` | https://unsplash.com/photos/golden-wheat-field-ready-for-harvest-_rXmtIMnOT8 | Nikolett Emmert | "Đồng hành cùng từng mùa vụ" |
| `video/poster-store-locator.jpg` | https://unsplash.com/photos/IQVFVH0ajag | Dan Meyers | "Tìm sản phẩm phù hợp cho cây trồng của bạn" |

## Notes / still missing

- Ảnh chọn theo mô tả gần nhất với từng cây trồng/chủ đề — không phải ảnh chụp tại vườn, đại lý hay nhà máy AgriFert thật.
- Không dùng ảnh nào có watermark, logo hoặc bao bì thương hiệu khác (đã kiểm tra thủ công từng ảnh qua mô tả nguồn).
- **Chưa có**: 2 video nền thật (chỉ có poster), ảnh cover cho 4 bài viết kiến thức nhà nông — các phần này cần bổ sung khi có công cụ trình duyệt thật hoặc tài khoản Pexels/Pixabay hợp lệ để tải, và cần `ffmpeg` (hoặc công cụ tương đương) để nén video trước khi đưa vào production.
