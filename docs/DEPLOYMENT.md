# DEPLOYMENT — Triển khai

_Cập nhật: 2026-08-04_

## Nền tảng

**Vercel.** Bằng chứng: `vercel.json` ở root, commit thứ 2 của repo là `"Fix Vercel mock deployment"`. Chưa xác nhận: project Vercel cụ thể (tên project, org, domain) — **cần xác nhận với chủ repo `PhongSE192969`**.

## Cấu hình hiện có

`vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Đây là rewrite chuẩn cho SPA dùng client-side routing (React Router) — đảm bảo refresh trang ở route con (vd. `/admin/identity/users`) không bị 404.

## Build command / output

Suy ra từ `package.json` (Vercel tự nhận diện project Vite theo mặc định, không có `builds` tuỳ chỉnh trong `vercel.json`):

- Build command: `npm run build` (chạy `vite build`)
- Output directory: `dist/` (mặc định Vite, đã có trong `.gitignore`)
- Install command: mặc định Vercel (`npm install`)

## Biến môi trường cần cấu hình trên Vercel

Tất cả biến `VITE_*` liệt kê trong [.env.example](../.env.example) phải được set trong Vercel Project Settings → Environment Variables (không commit `.env` thật). Quan trọng nhất khi deploy production:

- `VITE_USE_MOCK_API=false` — **bắt buộc kiểm tra trước mỗi lần deploy môi trường thật**, nếu quên set thì bản deploy sẽ chạy toàn bộ bằng dữ liệu giả (xem CLAUDE.md mục 9 — Bảo mật).
- `VITE_BASE_URL` — trỏ đúng domain backend thật cho từng environment (Preview/Production nên khác nhau nếu backend có multi-env).
- 6 biến `VITE_FIREBASE_*`.

## Môi trường (Preview / Production)

Chưa xác định cách tổ chức environment trên Vercel (có tách Preview riêng biến môi trường không, domain production là gì). **Cần xác nhận.**

## Quy trình deploy hiện tại

Chưa có CI/CD pipeline nào trong repo (không có `.github/workflows/`) — deploy có khả năng đang làm thủ công qua Vercel dashboard hoặc Vercel Git integration tự động theo push lên `main`. **Cần xác nhận** cơ chế trigger deploy thật (Git integration auto-deploy vs deploy thủ công qua CLI).

## Rollback

Dùng cơ chế rollback có sẵn của Vercel (chọn lại deployment cũ trong dashboard) — không có quy trình riêng của dự án.
