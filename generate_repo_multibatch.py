#!/usr/bin/env python3
"""Generate a multi-file repository scaffold.

This script creates a real repository tree with multiple systems,
not just a single standalone file. It writes:
- root README
- manifest.json
- system folders
- per-system README.md and todo.md
- src modules inside each system

Example:
    python generate_repo_multibatch.py --root . --systems 12 --files-per-system 6 --output-dir generated_repo_multibatch
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

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


def system_label(system_id: int) -> str:
    return f"system-{system_id:03d}"


def domain_for(system_id: int) -> str:
    return SYSTEM_TYPES[(system_id - 1) % len(SYSTEM_TYPES)]


def role_for(module_id: int) -> str:
    return ROLE_TYPES[(module_id - 1) % len(ROLE_TYPES)]


def build_root_readme(total_systems: int, total_files: int) -> str:
    return f'''# AI-Generated Repository

This repository was generated with a multi-file scaffold.

## Summary
- total systems: {total_systems}
- total files: {total_files}
- each system has README.md and todo.md
- each system contains a src/ folder with generated Python modules

## Structure
- `systems/` — system folders
- `manifest.json` — generation metadata
- `apps/` — app-level integration entry points
'''


def build_system_readme(system_id: int, domain: str) -> str:
    label = system_label(system_id)
    return f'''# {label}

## Overview
System `{label}` belongs to the `{domain}` domain and is part of a broader modular repository.

## Todo
1. Define operational scope.
2. Map system dependencies.
3. Build core modules.
4. Validate output and deployment readiness.

## Status
Ready for orchestration and extension.
'''


def build_todo_markdown(system_id: int, domain: str) -> str:
    label = system_label(system_id)
    return f'''# {label}

## Overview
This system is designed for AI-assisted workflow orchestration in the `{domain}` domain.

## Tasks
- [ ] Define scope and business intent
- [ ] Model system dependencies
- [ ] Build core runtime modules
- [ ] Validate integration and readiness
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


def build_app_index(total_systems: int) -> str:
    return f'''"""App-level repository bootstrap."""

SYSTEM_COUNT = {total_systems}

if __name__ == "__main__":
    print(f"Repository contains {{SYSTEM_COUNT}} generated systems.")
'''


def generate_system(base_dir: Path, system_id: int, files_per_system: int) -> None:
    domain = domain_for(system_id)
    label = system_label(system_id)
    system_dir = base_dir / "systems" / label
    system_dir.mkdir(parents=True, exist_ok=True)

    (system_dir / "README.md").write_text(build_system_readme(system_id, domain), encoding="utf-8")
    (system_dir / "todo.md").write_text(build_todo_markdown(system_id, domain), encoding="utf-8")

    src_dir = system_dir / "src"
    src_dir.mkdir(parents=True, exist_ok=True)

    for module_id in range(1, files_per_system + 1):
        role = role_for(module_id)
        filename = f"{domain}_{role}_{label}.py"
        content = build_python_module(system_id, module_id, domain, role)
        (src_dir / filename).write_text(content, encoding="utf-8")


def generate_repo(root: Path, total_systems: int, files_per_system: int) -> None:
    root.mkdir(parents=True, exist_ok=True)

    (root / "systems").mkdir(exist_ok=True)
    (root / "apps").mkdir(exist_ok=True)

    for system_id in range(1, total_systems + 1):
        generate_system(root, system_id, files_per_system)

    (root / "apps" / "README.md").write_text("# Application Layer\n\nThis directory contains integration points for the generated repository.\n", encoding="utf-8")
    (root / "apps" / "index.py").write_text(build_app_index(total_systems), encoding="utf-8")

    total_files = total_systems * files_per_system + 2
    (root / "README.md").write_text(build_root_readme(total_systems, total_files), encoding="utf-8")

    manifest = {
        "total_systems": total_systems,
        "total_files": total_files,
        "structure": [
            "systems/<system>/README.md",
            "systems/<system>/todo.md",
            "systems/<system>/src/*.py",
            "apps/index.py",
            "README.md",
        ],
        "notes": [
            "This is a generated multi-file repository scaffold.",
            "Each system is modular and can be extended independently.",
        ],
    }
    (root / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate a multi-file modular repository scaffold.")
    parser.add_argument("--root", type=str, default=".", help="Root directory of the generated repo")
    parser.add_argument("--output-dir", type=str, default="generated_repo_multibatch", help="Output directory")
    parser.add_argument("--systems", type=int, default=12, help="Number of system folders to generate")
    parser.add_argument("--files-per-system", type=int, default=6, help="Number of files per system")
    args = parser.parse_args()

    root = Path(args.root).resolve() / args.output_dir
    generate_repo(root, args.systems, args.files_per_system)

    print(f"Generated repository tree at: {root}")
    print(f"Systems: {args.systems}")
    print(f"Files per system: {args.files_per_system}")


if __name__ == "__main__":
    main()
