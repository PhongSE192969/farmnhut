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

## Hero (`hero/`)

Solid dark background (no full-bleed photo, no slideshow) with a single
framed portrait photo card on the right — text stays on a flat color, so
there's no image-contrast risk to manage.

| Local file | Source | Photographer | Role |
|---|---|---|---|
| `hero-hands-seedling.jpg` | https://unsplash.com/photos/x8ZStukS2PM | Noah Buscher | Framed card, right side of Hero |

## Crop explorer (`crops/`)

| Local file | Source | Photographer |
|---|---|---|
| `lua.jpg` | https://unsplash.com/photos/a-farmer-plants-rice-in-a-muddy-paddy-field-fj3ihxjJutU | Danielle Suijkerbuijk |
| `ca-phe.jpg` | https://unsplash.com/photos/vJ3KldG86Eo | Eduardo Gorghetto |
| `ho-tieu.jpg` | https://unsplash.com/photos/a-bunch-of-green-fruit-hanging-from-a-tree-NfxR-HFRQb4 | Siborey Sean |
| `sau-rieng.jpg` | https://unsplash.com/photos/TxOzkgw1oJg | The Manh |
| `cay-an-trai.jpg` | https://unsplash.com/photos/an-apple-orchard-with-lots-of-trees-in-the-background-grohryGg_kQ | Karin Kim |
| `rau-mau.jpg` | https://unsplash.com/photos/pXJr0AVxO8I | Egor Myznik |
| `cay-cong-nghiep.jpg` | https://unsplash.com/photos/sugar-cane-field-with-a-blue-sky-9A28d24Pyd4 | Emmanuel Appiah |
| `hoa-canh.jpg` | https://unsplash.com/photos/a-person-walks-through-a-lush-green-plant-nursery-iZVU7yLwD8E | Odile |

## "Vì sao lựa chọn AgriFert?" section

| Local file | Source | Photographer |
|---|---|---|
| `why-agrifert.jpg` | https://unsplash.com/photos/l_5MJnbrmrs | no one cares (@no_one_cares) — aerial shot of farm vehicles during a maize harvest, Germany, no visible logos/branding |

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
