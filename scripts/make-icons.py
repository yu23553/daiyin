#!/usr/bin/env python3
"""Generate RianThai brand icons (coastal teal + ไ) for Safari / PWA."""
from PIL import Image, ImageDraw, ImageFont

C_HI = (0x6F, 0xC4, 0xE0)
C_MID = (0x2F, 0x7E, 0xAB)
C_LO = (0x1D, 0x5F, 0x86)
FONT = "/usr/share/fonts/truetype/noto/NotoSansThai-Bold.ttf"


def lerp(a, b, t):
    return a + (b - a) * t


def mix(c1, c2, t):
    return tuple(int(lerp(c1[i], c2[i], t)) for i in range(3))


def make(size, path, rounded=False, radius_ratio=0.22):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    px = img.load()
    for y in range(size):
        for x in range(size):
            t = (x * 0.55 + y * 0.85) / (size * 1.4)
            t = max(0.0, min(1.0, t))
            if t < 0.52:
                c = mix(C_HI, C_MID, t / 0.52)
            else:
                c = mix(C_MID, C_LO, (t - 0.52) / 0.48)
            px[x, y] = (*c, 255)

    overlay = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    cx, cy = int(size * 0.28), int(size * 0.22)
    r = int(size * 0.42)
    for i in range(r, 0, -1):
        a = int(90 * (i / r) ** 2)
        od.ellipse([cx - i, cy - i, cx + i, cy + i], fill=(255, 255, 255, a // 3))
    img = Image.alpha_composite(img, overlay)

    draw = ImageDraw.Draw(img)
    font = ImageFont.truetype(FONT, int(size * 0.62))
    text = "ไ"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (size - tw) / 2 - bbox[0]
    y = (size - th) / 2 - bbox[1] + size * 0.02
    draw.text((x, y), text, font=font, fill=(255, 255, 255, 255))

    if rounded:
        mask = Image.new("L", (size, size), 0)
        md = ImageDraw.Draw(mask)
        md.rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * radius_ratio), fill=255)
        out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        out.paste(img, (0, 0), mask)
        img = out

    img.save(path, "PNG", optimize=True)
    print(path, img.size)


if __name__ == "__main__":
    # iOS applies its own mask — keep apple-touch-icon square / full-bleed.
    make(180, "apple-touch-icon.png", rounded=False)
    make(192, "icon-192.png", rounded=True)
    make(512, "icon-512.png", rounded=True)
    make(32, "favicon-32.png", rounded=True, radius_ratio=0.24)
