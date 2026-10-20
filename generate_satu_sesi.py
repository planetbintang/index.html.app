#!/usr/bin/env python3
"""Generate a massive modular repository scaffold.

Tujuan:
- membuat 1.500 sistem
- tiap sistem berisi 1.000 modul
- total 1.500.000 file
- nama file TIDAK memakai angka

Contoh:
    python generate_satu_sesi.py --root . --systems 1500 --files-per-system 1000 --output-dir generated_repo
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

DEFAULT_SYSTEM_COUNT = 1500
DEFAULT_FILES_PER_SYSTEM = 1000

SYSTEM_TYPES = [
    "analytics",
    "finance",
    "security",
    "healthcare",
    "education",
    "commerce",
    "logistics",
    "telemetry",
    "workspace",
    "research",
]

ROLE_TYPES = [
    "core",
    "service",
    "gateway",
    "worker",
    "adapter",
    "validator",
    "scheduler",
    "reporter",
    "processor",
    "manager",
]

SYSTEM_PREFIXES = [
    "aether",
    "alpine",
    "amber",
    "atlas",
    "aurora",
    "basil",
    "beacon",
    "brim",
    "brook",
    "cabin",
    "calyx",
    "cedar",
    "cinder",
    "cobalt",
    "coral",
    "crest",
    "dawn",
    "delta",
    "drift",
    "ember",
    "falcon",
    "field",
    "flare",
    "frost",
    "glade",
    "glimmer",
    "harbor",
    "horizon",
    "icicle",
    "jade",
]

SYSTEM_SUFFIXES = [
    "atlas",
    "aurora",
    "bloom",
    "bravo",
    "brook",
    "canyon",
    "cedar",
    "chime",
    "cinder",
    "cliff",
    "cloud",
    "crest",
    "dune",
    "echo",
    "ember",
    "field",
    "flora",
    "forge",
    "foss",
    "frost",
    "glow",
    "grain",
    "grove",
    "harbor",
    "hollow",
    "hush",
    "ivy",
    "jasmine",
    "jet",
    "lagoon",
    "lark",
    "lattice",
    "lumen",
    "meadow",
    "mirth",
    "moss",
    "nectar",
    "nexus",
    "oasis",
    "orbit",
    "orchid",
    "palm",
    "pearl",
    "petal",
    "pine",
    "quartz",
    "raven",
    "reef",
    "river",
    "rock",
    "rose",
    "sable",
    "saffron",
    "salt",
    "satin",
    "scout",
    "shadow",
    "silk",
    "solace",
    "sonar",
    "spark",
    "spruce",
    "summit",
    "terra",
    "thistle",
    "torrent",
    "vale",
    "vapor",
    "vein",
    "velvet",
    "verve",
    "willow",
    "zephyr",
]

MODULE_PREFIXES = [
    "alpha",
    "amaranth",
    "amber",
    "apex",
    "arc",
    "atlas",
    "aurora",
    "beacon",
    "bloom",
    "brisk",
    "brook",
    "cabin",
    "cinder",
    "cliff",
    "coral",
    "crest",
    "dawn",
    "delta",
    "drift",
    "echo",
    "ember",
    "falcon",
    "flora",
    "forge",
    "frost",
    "glade",
    "glow",
    "harbor",
    "hollow",
    "hush",
    "ivy",
    "jasmine",
    "lagoon",
    "lark",
    "lumen",
    "meadow",
    "mirth",
    "moss",
    "nectar",
    "nexus",
    "oasis",
    "orbit",
    "orchid",
    "palm",
    "pearl",
    "petal",
    "pine",
    "quartz",
    "raven",
    "reef",
    "river",
    "rose",
    "saffron",
    "satin",
    "scout",
    "shadow",
    "silk",
    "solace",
    "sonar",
    "spark",
    "spruce",
    "summit",
    "terra",
    "thistle",
    "torrent",
    "vale",
    "vapor",
    "vein",
    "velvet",
    "verve",
    "willow",
    "zephyr",
]

MODULE_SUFFIXES = [
    "atlas",
    "aurora",
    "bloom",
    "brook",
    "canopy",
    "cedar",
    "chime",
    "cinder",
    "crest",
    "dune",
    "echo",
    "ember",
    "field",
    "flora",
    "forge",
    "foss",
    "frost",
    "glade",
    "glow",
    "grain",
    "grove",
    "harbor",
    "hollow",
    "hush",
    "ivy",
    "lagoon",
    "lark",
    "lattice",
    "lumen",
    "meadow",
    "mirth",
    "moss",
    "nectar",
    "nexus",
    "oasis",
    "orbit",
    "orchid",
    "palm",
    "pearl",
    "petal",
    "pine",
    "quartz",
    "raven",
    "reef",
    "river",
    "rose",
    "saffron",
    "satin",
    "scout",
    "shadow",
    "silk",
    "solace",
    "sonar",
    "spark",
    "spruce",
    "summit",
    "terra",
    "thistle",
    "torrent",
    "vale",
    "vapor",
    "vein",
    "velvet",
    "verve",
    "willow",
    "zephyr",
]


def system_alias(index: int) -> str:
    prefix = SYSTEM_PREFIXES[(index - 1) // len(SYSTEM_SUFFIXES)]
    suffix = SYSTEM_SUFFIXES[(index - 1) % len(SYSTEM_SUFFIXES)]
    return f"{prefix}_{suffix}"


def module_alias(module_id: int) -> str:
    prefix = MODULE_PREFIXES[(module_id - 1) // len(MODULE_SUFFIXES)]
    suffix = MODULE_SUFFIXES[(module_id - 1) % len(MODULE_SUFFIXES)]
    return f"{prefix}_{suffix}"


def system_label(index: int) -> str:
    return f"system-{system_alias(index)}"


def domain_for(system_id: int) -> str:
    return SYSTEM_TYPES[(system_id - 1) % len(SYSTEM_TYPES)]


def role_for(module_id: int) -> str:
    return ROLE_TYPES[(module_id - 1) % len(ROLE_TYPES)]


def build_todo_markdown(system_id: int, domain: str) -> str:
    label = system_label(system_id)
    return f'''# {label}

## Overview
Sistem {label} berada di domain `{domain}` dan dibangun untuk mendukung ekosistem kerja modular.

## Todo
1. Pahami kebutuhan bisnis dan ruang lingkup sistem.
2. Definisikan struktur data dan arsitektur modul utama.
3. Implementasikan logika inti dan integrasi antar komponen.
4. Validasi hasil, dokumentasi, dan kesiapan deployment.

## Status
Ready for orchestration and extension.
'''


def build_system_readme(system_id: int, domain: str) -> str:
    label = system_label(system_id)
    return f'''# {label}

Sistem ini terdaftar dalam domain `{domain}` dan berfungsi sebagai unit kerja modular yang siap diintegrasikan ke ekosistem yang lebih besar.

## Struktur
- `todo.md` — daftar tugas operasional
- `src/` — modul implementasi
- `README.md` — ringkasan sistem

## Tujuan
Menyediakan komponen kerja yang rapi, dapat diperluas, dan siap untuk AI-assisted development.
'''


def build_python_module(system_id: int, module_id: int, domain: str, role: str) -> str:
    label = system_label(system_id)
    lines = [
        '"""Generated module for system automation."""',
        "from __future__ import annotations",
        "",
        "import json",
        "from dataclasses import dataclass, field",
        "from typing import Any, Dict, Iterable, List",
        "",
        f"SYSTEM_ID = {system_id}",
        f"SYSTEM_LABEL = '{label}'",
        f"DOMAIN = '{domain}'",
        f"ROLE = '{role}'",
        f"MODULE_ID = {module_id}",
        "",
        "@dataclass",
        "class RuntimeEntry:",
        "    system: str",
        "    domain: str",
        "    role: str",
        "    module_id: int",
        "    score: int = 0",
        "    metadata: Dict[str, Any] = field(default_factory=dict)",
        "",
        "def normalize(value: str) -> str:",
        "    return value.strip().lower().replace(' ', '_')",
        "",
        "def build_entry(name: str, score: int) -> RuntimeEntry:",
        "    payload = {",
        "        'system': SYSTEM_LABEL,",
        "        'domain': DOMAIN,",
        "        'role': ROLE,",
        "        'module_id': MODULE_ID,",
        "        'name': normalize(name),",
        "        'score': score,",
        "    }",
        "    return RuntimeEntry(",
        "        system=SYSTEM_LABEL,",
        "        domain=DOMAIN,",
        "        role=ROLE,",
        "        module_id=MODULE_ID,",
        "        score=score,",
        "        metadata=payload,",
        "    )",
        "",
        "def summarize(entries: Iterable[RuntimeEntry]) -> List[Dict[str, Any]]:",
        "    return [entry.metadata for entry in entries]",
        "",
        "def aggregate(values: Iterable[int]) -> int:",
        "    total = 0",
        "    for value in values:",
        "        total += value",
        "    return total",
        "",
        "def run_demo() -> Dict[str, Any]:",
        "    demo_items = [('status', 25), ('health', 30), ('scale', 40)]",
        "    entries = [build_entry(label, score) for label, score in demo_items]",
        "    total = aggregate(item.score for item in entries)",
        "    return {",
        "        'system': SYSTEM_LABEL,",
        "        'domain': DOMAIN,",
        "        'role': ROLE,",
        "        'module_id': MODULE_ID,",
        "        'total': total,",
        "        'entries': summarize(entries),",
        "    }",
        "",
        "if __name__ == '__main__':",
        "    print(json.dumps(run_demo(), indent=2))",
    ]

    while len(lines) < 30:
        lines.append(f"# filler_{domain}_{role}")

    return "\n".join(lines) + "\n"


def build_manifest(total_systems: int, total_files: int) -> dict:
    return {
        "total_systems": total_systems,
        "total_files": total_files,
        "structure": "system folders with src modules, todo.md, README.md",
        "naming_rule": "no numeric characters in filenames or folder labels",
        "notes": [
            "Setiap sistem dibangun dengan label kata, bukan angka.",
            "Ketika 1.500.000 file dihasilkan, file tetap aman dibaca dan dipindahkan dalam batch terpisah.",
        ],
    }


def generate_system(base_dir: Path, system_id: int, files_per_system: int) -> None:
    domain = domain_for(system_id)
    label = system_label(system_id)
    system_dir = base_dir / label
    system_dir.mkdir(parents=True, exist_ok=True)

    (system_dir / "README.md").write_text(build_system_readme(system_id, domain), encoding="utf-8")
    (system_dir / "todo.md").write_text(build_todo_markdown(system_id, domain), encoding="utf-8")

    src_dir = system_dir / "src"
    src_dir.mkdir(parents=True, exist_ok=True)

    for module_id in range(1, files_per_system + 1):
        role = role_for(module_id)
        name = f"{domain}_{role}_{system_alias(system_id)}_{module_alias(module_id)}.py"
        content = build_python_module(system_id, module_id, domain, role)
        (src_dir / name).write_text(content, encoding="utf-8")


def generate_root_docs(base_dir: Path, total_systems: int, total_files: int) -> None:
    overview = f'''# Repository Overview

Repositori ini berisi {total_files} file modul dari {total_systems} sistem yang dibangun secara terstruktur.

## Struktur
- setiap sistem mempunyai `README.md` dan `todo.md`
- setiap sistem mempunyai folder `src/`
- file modul mengikuti pola: `<domain>_<role>_<system_alias>_<module_alias>.py`
- nama file dan folder tidak menggunakan angka

## Cara generate
```bash
python generate_satu_sesi.py --root . --systems 1500 --files-per-system 1000 --output-dir generated_repo
```
'''
    (base_dir / "README_GENERATED.md").write_text(overview, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate a massive modular repository scaffold without numeric file names.")
    parser.add_argument("--root", type=str, default=".", help="Directory root project")
    parser.add_argument("--output-dir", type=str, default="generated_repo", help="Folder tujuan output")
    parser.add_argument("--systems", type=int, default=DEFAULT_SYSTEM_COUNT, help="Jumlah sistem yang ingin dibuat")
    parser.add_argument("--files-per-system", type=int, default=DEFAULT_FILES_PER_SYSTEM, help="Jumlah file per sistem")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    output_dir = root / args.output_dir
    output_dir.mkdir(parents=True, exist_ok=True)

    total_systems = args.systems
    files_per_system = args.files_per_system
    total_files = total_systems * files_per_system

    for system_id in range(1, total_systems + 1):
        generate_system(output_dir, system_id, files_per_system)

    generate_root_docs(root, total_systems, total_files)

    manifest_path = root / args.output_dir / "manifest.json"
    manifest_path.write_text(json.dumps(build_manifest(total_systems, total_files), indent=2), encoding="utf-8")

    print(f"Generated {total_systems} systems")
    print(f"Total files: {total_files}")
    print(f"Output directory: {output_dir}")
    print("Nama file dan folder menggunakan kata, tanpa angka.")


if __name__ == "__main__":
    main()
