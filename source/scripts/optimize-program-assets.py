# -*- coding: utf-8 -*-
"""Resize oversized photos and convert raster images in program/assets to WebP."""
from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / "program" / "assets"
LOG_PATH = Path(__file__).resolve().parent / "optimize-program-assets-log.json"

MAX_EDGE = 1920
RASTER = {".png", ".jpg", ".jpeg", ".jpe", ".webp"}
SKIP_DIR_NAMES = {"js"}


def has_useful_alpha(im: Image.Image) -> bool:
    if im.mode in ("RGBA", "LA"):
        extrema = im.getextrema()
        alpha = extrema[-1]
        return not (alpha[0] == 255 and alpha[1] == 255)
    if im.mode == "P" and "transparency" in im.info:
        return True
    return False


def prepare(im: Image.Image) -> tuple[Image.Image, bool]:
    im = ImageOps.exif_transpose(im) or im
    alpha = has_useful_alpha(im)
    if im.mode == "P":
        im = im.convert("RGBA" if alpha else "RGB")
        alpha = has_useful_alpha(im)
    elif im.mode == "LA":
        im = im.convert("RGBA")
        alpha = True
    elif im.mode == "CMYK":
        im = im.convert("RGB")
        alpha = False
    elif im.mode not in ("RGB", "RGBA"):
        im = im.convert("RGBA" if alpha else "RGB")
    if im.mode == "RGBA" and not alpha:
        im = im.convert("RGB")
    w, h = im.size
    longest = max(w, h)
    if longest > MAX_EDGE:
        scale = MAX_EDGE / longest
        im = im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.Resampling.LANCZOS)
    return im, alpha


def save_webp(im: Image.Image, dest: Path, alpha: bool) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_name(dest.name + ".tmp")
    opts = {"format": "WEBP", "method": 6}
    if alpha:
        opts.update(quality=92)
    else:
        opts.update(quality=88)
    im.save(tmp, **opts)
    tmp.replace(dest)


def iter_images() -> list[Path]:
    files = []
    for path in ASSETS.rglob("*"):
        if not path.is_file():
            continue
        if any(part in SKIP_DIR_NAMES for part in path.parts):
            continue
        if path.suffix.lower() in RASTER:
            files.append(path)
    return files


def main() -> int:
    if not ASSETS.is_dir():
        print(f"missing assets dir: {ASSETS}", file=sys.stderr)
        return 1

    records = []
    before_total = 0
    after_total = 0
    converted = 0
    skipped = 0

    for src in iter_images():
        before = src.stat().st_size
        before_total += before
        dest = src.with_suffix(".webp")
        try:
            with Image.open(src) as opened:
                im, alpha = prepare(opened)
                size = list(im.size)
                save_webp(im, dest, alpha)
        except Exception as exc:  # noqa: BLE001
            skipped += 1
            records.append({
                "file": str(src.relative_to(ASSETS)).replace("\\", "/"),
                "error": str(exc),
                "before": before,
            })
            print(f"SKIP {src.name}: {exc}")
            continue

        after = dest.stat().st_size
        after_total += after
        converted += 1
        rel = str(src.relative_to(ASSETS)).replace("\\", "/")
        records.append({
            "file": rel,
            "before": before,
            "after": after,
            "size": size,
            "alpha": alpha,
        })
        if dest.resolve() != src.resolve():
            src.unlink()
        saved = (before - after) / 1048576
        print(f"OK {rel}  {before/1048576:.2f}MB -> {after/1048576:.2f}MB  ({saved:+.2f}MB)  {size[0]}x{size[1]}")

    summary = {
        "converted": converted,
        "skipped": skipped,
        "before_bytes": before_total,
        "after_bytes": after_total,
        "saved_bytes": before_total - after_total,
        "files": records,
    }
    LOG_PATH.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print(
        f"\nDone. {converted} converted, {skipped} skipped. "
        f"{before_total/1048576:.1f}MB -> {after_total/1048576:.1f}MB "
        f"(saved {(before_total-after_total)/1048576:.1f}MB)"
    )
    print(f"log: {LOG_PATH}")
    return 0 if skipped == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())
