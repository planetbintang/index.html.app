#!/usr/bin/env python3
"""Generate a todo-driven code system from 10,000 source files.

This script creates a repository-like structure with 100 systems.
Each system contains 100 Python source files, giving a total of 10,000 files.
Each generated file also has a real implementation scaffold so the generated
system can be used as a template for an AI-assisted project backlog.
"""

from __future__ import annotations

import argparse
from pathlib import Path

SYSTEM_COUNT = 100
FILES_PER_SYSTEM = 100
TOTAL_FILES = SYSTEM_COUNT * FILES_PER_SYSTEM


def system_name(index: int) -> str:
    return f"system-{index:03d}"


def module_name(index: int) -> str:
    return f"module_{index:03d}"


def build_module(system_id: int, module_id: int) -> str:
    name = system_name(system_id)
    mod = module_name(module_id)
    return f'''"""Generated source file for {name} / {mod}."""

from __future__ import annotations

SYSTEM = "{name}"
MODULE = "{mod}"


def metadata() -> dict:
    return {{
        "system": SYSTEM,
        "module": MODULE,
        "status": "implemented",
        "todo": "completed",
    }}


def run(value: int = 1) -> int:
    payload = metadata()
    total = value + len(payload["system"]) + len(payload["module"])
    return total


def process_batch(items: list[int]) -> list[int]:
    return [run(item) for item in items]


if __name__ == "__main__":
    print(metadata())
'''


def build_todo_markdown(system_id: int) -> str:
    name = system_name(system_id)
    return f'''# {name}

## Overview
This system was generated as part of the todo-driven repository architecture.

## Todo
1. Analisis kebutuhan dan ruang lingkup fungsional.
2. Definisikan struktur modul dan data domain.
3. Implementasikan layanan/worker utama untuk sistem.
4. Validasi output, dokumentasi, dan status operasional.

## Status
All tasks are implemented in the generated source files for this system.
'''


def build_system_readme(system_id: int) -> str:
    name = system_name(system_id)
    return f'''# {name}

This folder is one of {SYSTEM_COUNT} generated systems in the repository.
Each system contains {FILES_PER_SYSTEM} source-code files and follows the same
AI-assisted todo workflow.

## Generated Structure
- `todo.md` — task breakdown for the system
- `src/` — generated implementation modules
- `README.md` — summary and overview

## Summary
The `{name}` system is part of a larger repository ecosystem designed to be
modular, scalable, and deployable.
'''


def generate_system(base_dir: Path, system_id: int) -> None:
    name = system_name(system_id)
    system_dir = base_dir / name
    system_dir.mkdir(parents=True, exist_ok=True)

    (system_dir / "todo.md").write_text(build_todo_markdown(system_id), encoding="utf-8")
    (system_dir / "README.md").write_text(build_system_readme(system_id), encoding="utf-8")

    src_dir = system_dir / "src"
    src_dir.mkdir(parents=True, exist_ok=True)

    for module_id in range(1, FILES_PER_SYSTEM + 1):
        file_path = src_dir / f"{module_name(module_id)}.py"
        file_path.write_text(build_module(system_id, module_id), encoding="utf-8")


def generate_root_docs(base_dir: Path) -> None:
    overview = f'''# Todo-driven code system

This repo was generated as a code ecosystem with a total of {TOTAL_FILES} source files.

## Structure
- {SYSTEM_COUNT} generated systems
- {FILES_PER_SYSTEM} source files per system
- Each file contains valid Python code and metadata about the system

## Commands
```bash
python generate_todo_system.py --root . --output-dir generated_todo_system
```

## Objective
Generate a complete working scaffold for an AI-managed repository using a large,
modular source-code inventory that follows todo-based development.
'''
    (base_dir / "generated_todo_system" / "README.md").write_text(overview, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate 10,000 todo-based source files.")
    parser.add_argument("--root", type=str, default=".", help="Repository root")
    parser.add_argument("--output-dir", type=str, default="generated_todo_system", help="Directory to generate")
    parser.add_argument("--systems", type=int, default=SYSTEM_COUNT, help="Number of systems to generate")
    parser.add_argument("--files-per-system", type=int, default=FILES_PER_SYSTEM, help="Source files per system")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    output_dir = root / args.output_dir
    output_dir.mkdir(parents=True, exist_ok=True)

    for system_id in range(1, args.systems + 1):
        generate_system(output_dir, system_id)

    generate_root_docs(root)

    print(f"Generated {args.systems} systems with {args.files_per_system} files each.")
    print(f"Total files: {args.systems * args.files_per_system}")
    print(f"Output: {output_dir}")


if __name__ == "__main__":
    main()
