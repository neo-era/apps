import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const exists = (p) => fs.existsSync(path.join(ROOT, p));

/* Đọc kích thước PNG từ IHDR (byte 16–24) */
function pngSize(p) {
  const b = fs.readFileSync(path.join(ROOT, p));
  assert.equal(b.toString("ascii", 1, 4), "PNG", p + " không phải PNG");
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

/* ---- version.js: nguồn phiên bản duy nhất ---- */
test("version.js khai báo APP_VERSION hợp lệ", () => {
  const v = read("version.js");
  const m = v.match(/APP_VERSION\s*=\s*"(\d+\.\d+)"/);
  assert.ok(m, "APP_VERSION phải dạng số x.y");
  global.__V = m[1];
});

/* ---- apps.js: danh mục app ---- */
test("apps.js có đủ app, mỗi app hợp lệ, icon tồn tại", () => {
  const src = read("apps.js");
  const sandbox = { self: {}, window: {} };
  // nạp apps.js trong phạm vi an toàn
  new Function("self", "window", src)(sandbox.self, sandbox.window);
  const APPS = sandbox.window.HUB_APPS, IC = sandbox.window.HUB_ICONS;
  assert.ok(Array.isArray(APPS), "HUB_APPS phải là mảng");
  assert.ok(APPS.length >= 9, "phải có ít nhất 9 app, đang có " + APPS.length);
  const seen = new Set();
  for (const a of APPS) {
    for (const f of ["name", "desc", "group", "icon", "url"])
      assert.ok(a[f] && typeof a[f] === "string", `app "${a.name||'?'}" thiếu trường ${f}`);
    assert.match(a.url, /^https:\/\//, `URL app "${a.name}" phải là https`);
    assert.ok(IC[a.icon], `icon "${a.icon}" của app "${a.name}" chưa định nghĩa trong HUB_ICONS`);
    assert.ok(!seen.has(a.url), "URL trùng: " + a.url);
    seen.add(a.url);
  }
  global.__N = APPS.length;
});

/* ---- manifest ---- */
test("manifest.webmanifest hợp lệ & đủ trường PWA", () => {
  const m = JSON.parse(read("manifest.webmanifest"));
  for (const f of ["name", "short_name", "start_url", "scope", "display", "theme_color", "background_color", "icons"])
    assert.ok(f in m, "manifest thiếu " + f);
  assert.ok(["standalone", "minimal-ui"].includes(m.display), "display phải standalone/minimal-ui");
  const sizes = m.icons.map((i) => i.sizes);
  assert.ok(sizes.includes("192x192"), "thiếu icon 192");
  assert.ok(sizes.includes("512x512"), "thiếu icon 512");
  assert.ok(m.icons.some((i) => (i.purpose || "").includes("maskable")), "thiếu icon maskable");
  for (const i of m.icons) {
    assert.ok(exists(i.src), "file icon không tồn tại: " + i.src);
    const [w, h] = i.sizes.split("x").map(Number);
    const sz = pngSize(i.src);
    assert.equal(sz.w, w, i.src + " sai bề rộng");
    assert.equal(sz.h, h, i.src + " sai chiều cao");
  }
});

test("có apple-touch-icon 180x180", () => {
  assert.ok(exists("icons/apple-touch-icon.png"));
  const s = pngSize("icons/apple-touch-icon.png");
  assert.deepEqual(s, { w: 180, h: 180 });
});

/* ---- service worker ---- */
test("sw.js dùng version.js, precache đủ shell, file tồn tại", () => {
  const sw = read("sw.js");
  assert.match(sw, /importScripts\("\.\/version\.js"\)/, "sw phải importScripts version.js");
  assert.match(sw, /self\.APP_VERSION/, "sw phải dùng self.APP_VERSION");
  assert.match(sw, /skipWaiting/, "sw thiếu skipWaiting (cập nhật)");
  assert.match(sw, /caches\.open/, "sw thiếu caches.open");
  const shell = [...sw.matchAll(/"(\.\/[^"]+)"/g)].map((m) => m[1])
    .filter((s) => s !== "./version.js" || true);
  for (const f of ["./index.html", "./apps.js", "./version.js", "./manifest.webmanifest"])
    assert.ok(shell.includes(f), "sw precache thiếu " + f);
  // mọi mục precache phải tồn tại trên đĩa
  for (const s of shell) {
    const rel = s.replace(/^\.\//, "");
    if (rel === "" ) continue; // "./" = trang gốc
    assert.ok(exists(rel), "precache trỏ file không tồn tại: " + s);
  }
});

/* ---- index.html ---- */
test("index.html nối đúng tài nguyên & thành phần PWA", () => {
  const h = read("index.html");
  assert.match(h, /<script src="version\.js">/, "thiếu nạp version.js");
  assert.match(h, /<script src="apps\.js">/, "thiếu nạp apps.js");
  assert.match(h, /rel="manifest" href="manifest\.webmanifest"/, "thiếu link manifest");
  assert.match(h, /serviceWorker\.register\('sw\.js'\)/, "thiếu đăng ký service worker");
  assert.match(h, /apple-touch-icon/, "thiếu apple-touch-icon");
  assert.match(h, /name="theme-color"/, "thiếu theme-color");
  assert.match(h, /viewport-fit=cover/, "viewport thiếu safe-area (viewport-fit)");
  assert.match(h, /beforeinstallprompt/, "thiếu xử lý nút cài đặt");
  assert.match(h, /id="updbar"/, "thiếu thanh báo bản mới");
  assert.match(h, /id="themeBtn"/, "thiếu nút đổi nền");
  assert.match(h, /id="q"/, "thiếu ô tìm kiếm");
  // không dùng đường dẫn tuyệt đối /… (để chạy mọi domain/subpath)
  assert.ok(!/href="\/[^\/]/.test(h) && !/src="\/[^\/]/.test(h), "không được dùng đường dẫn tuyệt đối bắt đầu bằng /");
});

test("tổng kết", () => {
  console.log(`  ✔ ${global.__N} app · phiên bản ${global.__V}`);
});
