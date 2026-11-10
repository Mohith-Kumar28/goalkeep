"""Recolour the Decision Infrastructure hexagon in the supplied missing-layer video.

Nov 10 review: the hexagon fill matched the input pills, so it did not stand out.
The fill becomes a deep coral from the border's family and the text turns cream.
Run with: uv run --with numpy --with pillow python -I scripts/recolor-hexagon.py <src_dir> <out_dir>
"""

import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

W, H = 1520, 1020
FILL = np.array([0xB0, 0x54, 0x40], dtype=np.float32)
TITLE = np.array([0xFF, 0xF8, 0xF2], dtype=np.float32)
SUB = np.array([0xF8, 0xDC, 0xD2], dtype=np.float32)
OLD_FILL = 234.0
OLD_TITLE = 63.0
OLD_SUB_T = 0.26

INSET = 5
OUTER = [(680, 336), (856, 437), (856, 643), (680, 744), (504, 643), (504, 437)]


def inset_polygon(points, d):
    cx = sum(p[0] for p in points) / len(points)
    cy = sum(p[1] for p in points) / len(points)
    out = []
    for x, y in points:
        vx, vy = x - cx, y - cy
        n = (vx * vx + vy * vy) ** 0.5
        out.append((x - vx / n * d * 1.15, y - vy / n * d * 1.15))
    return out


mask_img = Image.new('L', (W, H), 0)
ImageDraw.Draw(mask_img).polygon(inset_polygon(OUTER, INSET), fill=255)
MASK = np.asarray(mask_img) > 0


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def recolor(frame: np.ndarray) -> np.ndarray:
    px = frame.astype(np.int16)
    border = (px[..., 0] - px[..., 2] > 45) & (px.mean(axis=2) < 225)
    mask = MASK & ~border
    region = frame[mask].astype(np.float32)
    t = np.clip((region.mean(axis=1) - OLD_TITLE) / (OLD_FILL - OLD_TITLE), 0, 1)
    ink_mix = np.clip(t / OLD_SUB_T, 0, 1)[:, None]
    ink = TITLE * (1 - ink_mix) + SUB * ink_mix
    a = (1 - smoothstep(0.3, 0.92, t))[:, None]
    out = frame.copy()
    out[mask] = np.clip(FILL * (1 - a) + ink * a, 0, 255).astype(np.uint8)
    return out


def recolor_image(src: Path, dst: Path):
    img = np.asarray(Image.open(src).convert('RGB'))
    Image.fromarray(recolor(img)).save(dst, quality=88)


def recolor_video(src: Path, encode_args: list[str], dst: Path):
    dec = subprocess.Popen(
        ['ffmpeg', '-v', 'error', '-i', str(src), '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
        stdout=subprocess.PIPE,
    )
    enc = subprocess.Popen(
        ['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}',
         '-r', '30', '-i', '-', *encode_args, str(dst)],
        stdin=subprocess.PIPE,
    )
    size = W * H * 3
    while True:
        buf = dec.stdout.read(size)
        if len(buf) < size:
            break
        frame = np.frombuffer(buf, dtype=np.uint8).reshape(H, W, 3)
        enc.stdin.write(recolor(frame).tobytes())
    enc.stdin.close()
    assert enc.wait() == 0 and dec.wait() == 0, f'ffmpeg failed for {dst}'


if __name__ == '__main__':
    src, out = Path(sys.argv[1]), Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    for name in ['missing-layer-poster.jpg', 'missing-layer-still.jpg']:
        recolor_image(src / name, out / name)
    if '--images-only' in sys.argv:
        sys.exit()
    recolor_video(src / 'missing-layer.mp4',
                  ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', '-preset', 'slow',
                   '-movflags', '+faststart', '-an'],
                  out / 'missing-layer.mp4')
    recolor_video(src / 'missing-layer.mp4',
                  ['-c:v', 'libvpx-vp9', '-pix_fmt', 'yuv420p', '-crf', '38', '-b:v', '0', '-row-mt', '1', '-an'],
                  out / 'missing-layer.webm')
