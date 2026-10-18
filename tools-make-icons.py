"""Tạo bộ icon PWA cho trang hub — phong cách A (nền tối xanh đêm + bóng đèn cyan)."""
from PIL import Image, ImageDraw
import math, os

OUT = os.path.join(os.path.dirname(__file__), "icons")
os.makedirs(OUT, exist_ok=True)

BG_TOP = (11, 19, 36)      # #0b1324
BG_BOT = (6, 12, 22)       # #060c16
CYAN   = (54, 214, 231)    # #36d6e7
BLUE   = (79, 140, 255)    # #4f8cff


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def draw_icon(size, maskable=False):
    # Vẽ ở độ phân giải 4x rồi thu nhỏ để khử răng cưa
    S = size * 4
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # Nền bo góc (maskable: full-bleed, không bo để an toàn safe-zone)
    radius = 0 if maskable else int(S * 0.22)
    for y in range(S):
        col = lerp(BG_TOP, BG_BOT, y / S)
        d.line([(0, y), (S, y)], fill=col + (255,))
    if radius:
        mask = Image.new("L", (S, S), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, S - 1, S - 1], radius=radius, fill=255)
        img.putalpha(mask)
        d = ImageDraw.Draw(img)

    cx, cy = S / 2, S / 2
    # Vùng an toàn cho maskable: thu nhỏ hoạ tiết vào ~62%
    scale = 0.62 if maskable else 0.74

    # Quầng sáng cyan sau bóng đèn
    glow = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gr = int(S * 0.30 * scale)
    for r in range(gr, 0, -1):
        a = int(70 * (1 - r / gr) ** 2)
        gd.ellipse([cx - r, cy - r * 1.05, cx + r, cy + r * 1.05], fill=CYAN + (a,))
    img.alpha_composite(glow)
    d = ImageDraw.Draw(img)

    # Bóng đèn (đường nét) — bầu tròn + đế
    lw = max(2, int(S * 0.028 * (scale / 0.74)))
    bulb_r = S * 0.18 * scale
    by = cy - S * 0.045 * scale
    d.ellipse([cx - bulb_r, by - bulb_r, cx + bulb_r, by + bulb_r], outline=CYAN + (255,), width=lw)
    # Đế đèn
    base_w = bulb_r * 0.9
    base_top = by + bulb_r * 0.75
    d.line([(cx - base_w * 0.55, base_top), (cx - base_w * 0.55, base_top + bulb_r * 0.55)], fill=CYAN + (255,), width=lw)
    d.line([(cx + base_w * 0.55, base_top), (cx + base_w * 0.55, base_top + bulb_r * 0.55)], fill=CYAN + (255,), width=lw)
    for i, yy in enumerate([base_top + bulb_r * 0.2, base_top + bulb_r * 0.42, base_top + bulb_r * 0.62]):
        d.line([(cx - base_w * 0.55, yy), (cx + base_w * 0.55, yy)], fill=BLUE + (255,), width=max(2, lw - 1))
    # Tim đèn
    d.line([(cx - bulb_r * 0.3, by + bulb_r * 0.1), (cx, by - bulb_r * 0.2), (cx + bulb_r * 0.3, by + bulb_r * 0.1)],
           fill=BLUE + (255,), width=max(2, lw - 1), joint="curve")
    # Tia sáng
    for ang in range(0, 360, 45):
        rad = math.radians(ang)
        r1 = bulb_r * 1.25
        r2 = bulb_r * 1.55
        d.line([(cx + r1 * math.cos(rad), by + r1 * math.sin(rad)),
                (cx + r2 * math.cos(rad), by + r2 * math.sin(rad))], fill=CYAN + (170,), width=max(2, lw - 1))

    return img.resize((size, size), Image.LANCZOS)


draw_icon(192).save(os.path.join(OUT, "icon-192.png"))
draw_icon(512).save(os.path.join(OUT, "icon-512.png"))
draw_icon(512, maskable=True).save(os.path.join(OUT, "icon-maskable-512.png"))
draw_icon(180).save(os.path.join(OUT, "apple-touch-icon.png"))
print("Icons written to", OUT)
for f in sorted(os.listdir(OUT)):
    p = os.path.join(OUT, f)
    print(" ", f, Image.open(p).size, os.path.getsize(p), "bytes")
