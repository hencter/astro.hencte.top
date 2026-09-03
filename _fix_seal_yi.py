"""Replace wrong 「赤」 seal on home banner with brand 「亦」 stamp.

Idempotent-ish: prefers bak-chi-seal if present, else current home.webp.
Writes home.webp + hencte-top.png + docs/qa seal crops.
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent
home_path = ROOT / "public/img/sections/home.webp"
out_card = ROOT / "public/img/projects/hencte-top.png"
backup = ROOT / "public/img/sections/home.webp.bak-chi-seal"
verify_dir = ROOT / "docs/qa/assets"
verify_dir.mkdir(parents=True, exist_ok=True)

if not backup.exists() and home_path.exists():
    backup.write_bytes(home_path.read_bytes())
    print("backed up to", backup)

base = Image.open(backup if backup.exists() else home_path).convert("RGB")
arr = np.array(base)

# Old seal + secondary blotch cluster
cx1, cy1, cx2, cy2 = 1080, 760, 1220, 940
pad = 28
x1, y1 = max(0, cx1 - pad), max(0, cy1 - pad)
x2, y2 = min(base.width, cx2 + pad), min(base.height, cy2 + pad)

ring = 55
sx1, sy1 = max(0, x1 - ring), max(0, y1 - ring)
sx2, sy2 = min(base.width, x2 + ring), min(base.height, y2 + ring)
region = arr[sy1:sy2, sx1:sx2].copy()
rx1, ry1 = x1 - sx1, y1 - sy1
rx2, ry2 = x2 - sx1, y2 - sy1
h, w = region.shape[:2]
yy, xx = np.mgrid[0:h, 0:w]
inside = (xx >= rx1) & (xx < rx2) & (yy >= ry1) & (yy < ry2)
r = region[:, :, 0].astype(int)
g = region[:, :, 1].astype(int)
b = region[:, :, 2].astype(int)
reddish = (r > 130) & (r > g + 18) & (r > b + 22)
sample_mask = (~inside) & (~reddish)
if sample_mask.sum() < 80:
    sample_mask = ~inside
samples = region[sample_mask]
mean = samples.mean(axis=0)
std = samples.std(axis=0).clip(min=1)
rng = np.random.default_rng(7)
fill = rng.normal(mean, std * 0.5, size=region.shape).clip(0, 255).astype(np.uint8)

red_u8 = (reddish.astype(np.uint8) * 255)
red_img = Image.fromarray(red_u8, mode="L").filter(ImageFilter.MaxFilter(9))
red_dil = np.array(red_img) > 0
cover = (inside | red_dil).astype(np.float32)
cover_img = Image.fromarray((cover * 255).astype(np.uint8), mode="L").filter(
    ImageFilter.GaussianBlur(5)
)
alpha = np.array(cover_img).astype(np.float32) / 255.0
alpha3 = alpha[..., None]
blended = (
    fill.astype(np.float32) * alpha3 + region.astype(np.float32) * (1 - alpha3)
).clip(0, 255).astype(np.uint8)
arr[sy1:sy2, sx1:sx2] = blended
cleaned = Image.fromarray(arr)

# Crystal-clear 「亦」 cinnabar seal (朱印色正确；字形必须是亦)
SIZE = 220
seal = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
draw = ImageDraw.Draw(seal)
CIN = (176, 48, 42, 255)
margin = 14
draw.rounded_rectangle(
    [margin, margin, SIZE - margin, SIZE - margin], radius=28, outline=CIN, width=10
)
font = None
for fp, idx in [
    (r"C:\Windows\Fonts\simsun.ttc", 0),
    (r"C:\Windows\Fonts\msyh.ttc", 0),
    (r"C:\Windows\Fonts\simhei.ttf", None),
]:
    try:
        font = (
            ImageFont.truetype(fp, 118, index=idx)
            if idx is not None
            else ImageFont.truetype(fp, 118)
        )
        break
    except OSError as e:
        print("font fail", fp, e)
if font is None:
    raise SystemExit("no Chinese font available for seal")

text = "亦"
bbox = draw.textbbox((0, 0), text, font=font)
tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
tx = (SIZE - tw) / 2 - bbox[0]
ty = (SIZE - th) / 2 - bbox[1] - 4
draw.text((tx, ty), text, font=font, fill=CIN)

sa = np.array(seal).astype(np.float32)
noise = rng.random((SIZE, SIZE)) * 0.35 + 0.65
edge = (
    np.array(
        Image.fromarray((sa[:, :, 3] > 0).astype(np.uint8) * 255).filter(
            ImageFilter.GaussianBlur(0.8)
        )
    ).astype(np.float32)
    / 255.0
)
sa[:, :, 3] = sa[:, :, 3] * noise * (0.75 + 0.25 * edge)
holes = rng.random((SIZE, SIZE)) > 0.97
sa[:, :, 3] = np.where(holes & (sa[:, :, 3] > 0), sa[:, :, 3] * 0.35, sa[:, :, 3])
seal = Image.fromarray(sa.astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.4))

target = 132
seal = seal.resize((target, target), Image.Resampling.LANCZOS)
ocx, ocy = (cx1 + cx2) // 2, (cy1 + cy2) // 2
px, py = ocx - target // 2, ocy - target // 2
canvas = cleaned.convert("RGBA")
canvas.alpha_composite(seal, dest=(px, py))
final = canvas.convert("RGB")

final.save(home_path, "WEBP", quality=90, method=6)
print("wrote", home_path, final.size)

card = final.resize((1536, 1024), Image.Resampling.LANCZOS)
card.save(out_card, "PNG", optimize=True)
print("wrote", out_card, card.size)

seal_crop = final.crop((px - 8, py - 8, px + target + 8, py + target + 8))
seal_crop.save(verify_dir / "banner-seal-yi-crop-20260903.png")
sx, sy = 1536 / final.width, 1024 / final.height
card.crop(
    (
        int((px - 8) * sx),
        int((py - 8) * sy),
        int((px + target + 8) * sx),
        int((py + target + 8) * sy),
    )
).save(verify_dir / "hencte-top-seal-crop-20260903.png")
final.crop(
    (
        int(final.width * 0.35),
        int(final.height * 0.35),
        int(final.width * 0.75),
        int(final.height * 0.85),
    )
).save(verify_dir / "banner-seal-yi-context-20260903.png")
print("seal placed at", px, py, "size", target)
print("verify ok")
