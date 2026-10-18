# Bộ công cụ chiếu sáng — trang hub (cổng tổng hợp)

Trang web tĩnh gom link các ứng dụng web đã tạo. Chạy 100% trên trình duyệt, không backend, cài được như ứng dụng (PWA) và chạy offline.

- Giao diện: phương án A — "Trạm điều khiển" (nền tối, điểm nhấn cyan/xanh), có nền sáng/tối.
- Tìm kiếm tiếng Việt không dấu + lọc theo nhóm.
- Đường dẫn tương đối → **chạy được ở bất kỳ repo/đường dẫn/tên miền nào** mà không cần sửa.

## 1. Đưa lên GitHub Pages (3 bước)

1. Tạo repo mới trên GitHub, ví dụ **`apps`** (hoặc tên bất kỳ).
2. Tải **toàn bộ file trong thư mục này** lên repo (kéo-thả ở nút **Add file → Upload files**). Không cần tải `node_modules`, `test/`, `tools-make-icons.py` (chỉ dùng để phát triển).
3. Vào **Settings → Pages**: mục *Build and deployment*, chọn **Deploy from a branch**, branch **main**, thư mục **/ (root)** → **Save**.

Sau ~1 phút, trang chạy tại: **`https://neo-era.github.io/apps/`**

> Lần đầu mở nên dùng Chrome/Edge để cài được PWA. Mở xong một lần là chạy offline.

## 2. Cài như ứng dụng (PWA)

- **Máy tính (Chrome/Edge):** bấm nút **Cài đặt** trên trang, hoặc biểu tượng cài ở thanh địa chỉ.
- **Android:** menu trình duyệt → *Thêm vào màn hình chính*.
- **iPhone/iPad (Safari):** nút **Chia sẻ** → **Thêm vào MH chính**.

## 3. Thêm / sửa / bớt app

Chỉ sửa **`apps.js`**. Mỗi app là một dòng:

```js
{ name: "Tên hiển thị", desc: "Mô tả ngắn", group: "Nhóm", icon: "bulb", url: "https://..." },
```

- `group`: gõ tên nhóm bất kỳ — nhóm mới sẽ tự hiện thành một nút lọc.
- `icon`: chọn trong danh sách khoá ở cuối `apps.js` (`bulb, map, mic, filecheck, book, alert, clip, ruler, clock`). Thêm icon mới thì thêm 1 khoá SVG vào `HUB_ICONS`.

**Mỗi lần đẩy bản mới lên GitHub: mở `version.js` tăng số lên 0,1** (ví dụ `1.0` → `1.1`). Việc này làm mới cache để người dùng thấy thanh *"Đã có bản mới — Tải lại"*.

## 4. Gắn tên miền riêng — `www.lavipco.tech` (làm sau khi đã mua domain)

Để link **không còn `github.io`**:

1. Mua tên miền `lavipco.tech` tại một nhà đăng ký (Namecheap, GoDaddy, Mắt Bão, Tenten…).
2. Tại trang quản lý DNS của tên miền, thêm bản ghi:
   - Dạng **www** (khuyến nghị): `CNAME`  tên `www`  trỏ về  `neo-era.github.io`
   - Nếu muốn dùng cả dạng gốc `lavipco.tech`, thêm 4 bản ghi `A` cho `@` trỏ về IP GitHub Pages:
     `185.199.108.153` · `185.199.109.153` · `185.199.110.153` · `185.199.111.153`
3. Trong repo: đổi tên file **`CNAME-doi-ten-thanh-CNAME-khi-co-domain.txt`** thành **`CNAME`** (nội dung đã sẵn `www.lavipco.tech`). *(Chỉ làm bước này sau khi DNS ở bước 2 đã trỏ xong, nếu không trang sẽ tạm không truy cập được.)*
4. **Settings → Pages → Custom domain**: nhập `www.lavipco.tech` → Save → chờ xác thực → bật **Enforce HTTPS**.

Khi xong, trang chạy tại **`https://www.lavipco.tech/`**.

> Lưu ý: 9 app con vẫn ở `neo-era.github.io/...` cho tới khi được chuyển riêng — không ảnh hưởng hoạt động của trang hub.

## 5. Cấu trúc file

```
index.html                 # trang hub (giao diện + logic + đăng ký PWA)
apps.js                    # DANH MỤC APP — chỉ cần sửa file này
version.js                 # NGUỒN PHIÊN BẢN DUY NHẤT (tăng 0,1 mỗi lần đẩy)
manifest.webmanifest       # khai báo PWA
sw.js                      # service worker (offline + báo bản mới)
icons/                     # icon 192 / 512 / maskable 512 / apple-touch 180
test/hub.test.mjs          # test tự động (node --test)
tools-make-icons.py        # script tạo lại icon (không cần đưa lên Pages)
CNAME-doi-ten-...txt        # đổi tên thành CNAME khi gắn tên miền
```

## 6. Chạy test (tùy chọn, khi phát triển)

```
node --test
```
