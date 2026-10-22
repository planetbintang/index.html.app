#!/usr/bin/env python3
"""Build the compact, deterministic path catalog used by the static .nz browser."""
from __future__ import annotations

import gzip
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "datanz" / "nz-catalog.txt.gz"
SUMMARY = ROOT / "datanz" / "nz-catalog-summary.json"
LEGACY_CORPUS = "nz/korpus-ilmu-pengetahuan-10000.nz"


def main() -> None:
    raw = subprocess.check_output(["git", "ls-files", "-z", "--", "*.nz"], cwd=ROOT)
    all_paths = sorted({item.decode("utf-8") for item in raw.split(b"\0") if item})
    if not all(path.lower().endswith(".nz") for path in all_paths):
        raise SystemExit("Git returned a non-.nz path")
    catalog_paths = [path for path in all_paths if path != LEGACY_CORPUS]
    tmp_catalog = CATALOG.with_suffix(CATALOG.suffix + ".tmp")
    with tmp_catalog.open("wb") as raw_file:
        with gzip.GzipFile(filename="", mode="wb", fileobj=raw_file, mtime=0, compresslevel=9) as compressed:
            for path in catalog_paths:
                compressed.write(path.encode("utf-8") + b"\n")
    tmp_catalog.replace(CATALOG)

    summary = {
        "schema": "AL.L-NZFS-catalog-v1",
        "repo_nz_file_count": len(all_paths),
        "catalog_nz_file_count": len(catalog_paths),
        "excluded_legacy_corpus": LEGACY_CORPUS,
        "actual_verified_title_count": None,
        "count_note": "Jumlah path file .nz bukan jumlah judul unik atau judul ilmiah terverifikasi.",
        "growth_note": "Tambahkan file .nz ke repository lalu jalankan ulang datanz/build_nz_catalog.py untuk memperbarui katalog."
    }
    tmp_summary = SUMMARY.with_suffix(SUMMARY.suffix + ".tmp")
    tmp_summary.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    tmp_summary.replace(SUMMARY)
    print(json.dumps({"repo_nz_file_count": len(all_paths), "catalog_nz_file_count": len(catalog_paths), "catalog_bytes": CATALOG.stat().st_size}, ensure_ascii=False))


if __name__ == "__main__":
    main()
