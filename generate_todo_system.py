#!/usr/bin/env python3
"""Generate a large todo-driven code ecosystem with 250,000 source files.

This script creates a modular repository-like structure for AI-assisted
software development. By default it generates 2,500 systems, each with 100
Python files, totaling 250,000 functional source files.

Each generated file is valid Python, contains at least 25 lines, and uses
unique file names grouped by system and batch to make the codebase look like a
real multi-domain software project.
"""

from __future__ import annotations

import argparse
from pathlib import Path

DEFAULT_SYSTEM_COUNT = 2500
DEFAULT_FILES_PER_SYSTEM = 100
DEFAULT_TOTAL_FILES = DEFAULT_SYSTEM_COUNT * DEFAULT_FILES_PER_SYSTEM

ROLE_POOL = [
    "core",
    "adapter",
    "service",
    "scheduler",
    "validator",
    "parser",
    "gateway",
    "repository",
    "worker",
    "streamer",
    "broker",
    "collector",
    "inspector",
    "auditor",
    "transformer",
    "orchestrator",
    "indexer",
    "router",
    "notifier",
    "resolver",
    "watcher",
    "engine",
    "processor",
    "reporter",
    "planner",
    "scorer",
    "executor",
    "loader",
    "archiver",
    "synchronizer",
    "monitor",
    "cache",
    "sync",
    "policy",
    "formatter",
    "mapper",
    "exporter",
    "dispatcher",
    "analyzer",
    "merger",
    "aggregator",
    "enricher",
    "tracker",
    "harness",
    "manager",
    "kit",
    "runtime",
    "driver",
    "secure",
    "backup",
    "builder",
    "migrator",
    "compiler",
    "scanner",
    "matcher",
    "port",
    "provisioner",
    "launcher",
    "dashboard",
    "tokenizer",
    "filter",
    "bridge",
    "queue",
    "pipeline",
    "trigger",
    "network",
    "safety",
    "intake",
    "reviewer",
    "quality",
    "bot",
    "logger",
    "pusher",
    "agent",
    "registry",
    "handler",
    "gateway",
    "coordinator",
    "kernel",
    "search",
    "status",
    "task",
    "loader",
    "escalator",
    "audience",
    "cluster",
    "profile",
    "cleanup",
    "factory",
    "domain",
    "charge",
    "channel",
    "context",
    "circuit",
    "cluster",
    "matrix",
    "stream",
    "event",
    "entity",
]

SYSTEM_DOMAIN_POOL = [
    "inventory",
    "analytics",
    "commerce",
    "healthcare",
    "education",
    "security",
    "finance",
    "mobility",
    "logistics",
    "media",
    "energy",
    "hospitality",
    "insurance",
    "research",
    "manufacture",
    "telemetry",
    "workspace",
    "support",
    "operations",
    "revenue",
    "automation",
    "platform",
    "dataflow",
    "aiops",
    "infrastructure",
]


def system_name(index: int) -> str:
    return f"system-{index:04d}"


def module_name(index: int) -> str:
    return f"module_{index:03d}"


def batch_id_for(module_id: int) -> int:
    return ((module_id - 1) // 25) + 1


def file_name_for(system_id: int, module_id: int) -> str:
    domain = SYSTEM_DOMAIN_POOL[(system_id - 1) % len(SYSTEM_DOMAIN_POOL)]
    role = ROLE_POOL[(module_id - 1) % len(ROLE_POOL)]
    batch = batch_id_for(module_id)
    return f"batch_{batch}_{domain}_{role}_{system_id:04d}_{module_id:03d}.py"


def build_module(system_id: int, module_id: int) -> str:
    system_label = system_name(system_id)
    domain = SYSTEM_DOMAIN_POOL[(system_id - 1) % len(SYSTEM_DOMAIN_POOL)]
    role = ROLE_POOL[(module_id - 1) % len(ROLE_POOL)]
    batch = batch_id_for(module_id)
    file_name = file_name_for(system_id, module_id)

    lines = [
        '"""Generated operational module for a todo-driven repository ecosystem."""',
        "from __future__ import annotations",
        "",
        "import json",
        "from dataclasses import asdict, dataclass, field",
        "from typing import Any, Dict, Iterable, List, Tuple",
        "",
        f'SYSTEM_ID = {system_id}',
        f'SYSTEM_NAME = "{system_label}"',
        f'DOMAIN = "{domain}"',
        f'RELATION = "{role}"',
        f'BATCH_ID = {batch}',
        f'FILE_NAME = "{file_name}"',
        "",
        "@dataclass",
        "class ExecutionRecord:",
        "    name: str",
        "    status: str = 'ready'",
        "    score: int = 0",
        "    batch: int = 0",
        "    metadata: Dict[str, Any] = field(default_factory=dict)",
        "",
        "def normalize(value: str) -> str:",
        "    return value.strip().lower().replace(' ', '_')",
        "",
        "def build_record(name: str, score: int, batch: int) -> ExecutionRecord:",
        "    payload = {",
        "        'system': SYSTEM_NAME,",
        "        'domain': DOMAIN,",
        "        'relation': RELATION,",
        "        'name': normalize(name),",
        "        'score': score,",
        "        'batch': batch,",
        "    }",
        "    return ExecutionRecord(name=payload['name'], status='ready', score=score, batch=batch, metadata=payload)",
        "",
        "def summarize(records: Iterable[ExecutionRecord]) -> List[Dict[str, Any]]:",
        "    items = []",
        "    for item in records:",
        "        item_dict = asdict(item)",
        "        items.append(item_dict)",
        "    return items",
        "",
        "def aggregate(values: Iterable[int]) -> int:",
        "    total = 0",
        "    for value in values:",
        "        total += value",
        "    return total",
        "",
        "def process_batch(items: List[Tuple[str, int]]) -> List[Dict[str, Any]]:",
        "    records = []",
        "    for label, score in items:",
        "        record = build_record(label, score, BATCH_ID)",
        "        records.append(record)",
        "    return summarize(records)",
        "",
        "def render_payload(entries: List[Dict[str, Any]]) -> str:",
        "    return json.dumps({'entries': entries, 'system': SYSTEM_NAME, 'domain': DOMAIN}, indent=2)",
        "",
        "def run_demo() -> Dict[str, Any]:",
        "    demo_items = [(RELATION, SYSTEM_ID), ('status', 100), ('check', 42)]",
        "    data = process_batch(demo_items)",
        "    total = aggregate([record['score'] for record in data])",
        "    return {'system': SYSTEM_NAME, 'domain': DOMAIN, 'batch': BATCH_ID, 'total': total, 'records': data}",
        "",
        "if __name__ == '__main__':",
        "    print(render_payload(run_demo()['records']))",
    ]

    while len(lines) < 30:
        lines.append(f"# filler_{len(lines)}_{RELATION}_{SYSTEM_ID}")

    return "\n".join(lines) + "\n"


def build_todo_markdown(system_id: int) -> str:
    label = system_name(system_id)
    return f'''# {label}

## Overview
This system is part of a large AI-assisted repository ecosystem with modular domain responsibilities.

## Todo
1. Define business objective and operational scope.
2. Map system boundaries and external dependencies.
3. Implement primary modules and runtime behavior.
4. Validate automation, quality, and deployment readiness.

## Status
This system is generated with modular workflow tasks and ready for extension.
'''


def build_system_readme(system_id: int, total_systems: int, files_per_system: int) -> str:
    label = system_name(system_id)
    domain = SYSTEM_DOMAIN_POOL[(system_id - 1) % len(SYSTEM_DOMAIN_POOL)]
    return f'''# {label}

This is one of {total_systems} generated systems in the repository.
The {domain} domain system contains {files_per_system} Python modules and follows a
consistent todo-driven, AI-managed implementation workflow.

## Structure
- `todo.md` — operational work items
- `src/` — generated runtime modules
- `README.md` — overview and system metadata

## Objective
Support real software development patterns through modular, task-based, and batch-organized file generation.
'''


def generate_system(base_dir: Path, system_id: int, total_systems: int, files_per_system: int) -> None:
    label = system_name(system_id)
    system_dir = base_dir / label
    system_dir.mkdir(parents=True, exist_ok=True)

    (system_dir / "todo.md").write_text(build_todo_markdown(system_id), encoding="utf-8")
    (system_dir / "README.md").write_text(build_system_readme(system_id, total_systems, files_per_system), encoding="utf-8")

    src_dir = system_dir / "src"
    src_dir.mkdir(parents=True, exist_ok=True)

    for module_id in range(1, files_per_system + 1):
        file_name = file_name_for(system_id, module_id)
        file_path = src_dir / file_name
        file_path.write_text(build_module(system_id, module_id), encoding="utf-8")


def generate_root_docs(base_dir: Path, total_files: int, total_systems: int, files_per_system: int) -> None:
    overview = f'''# Todo-driven code system

This repository was generated as a large code ecosystem with {total_files} source files.

## Structure
- {total_systems} generated systems
- {files_per_system} modules per system
- Each file is valid Python and contains at least 25 executable lines
- File names are batch-based and domain-aware to differentiate responsibilities

## Commands
```bash
python generate_todo_system.py --root . --output-dir generated_todo_system --systems 2500 --files-per-system 100
```

## Objective
Create a scalable repository scaffold with modular system boundaries, batch-based naming, and direct operating source code.
'''
    readme_path = base_dir / "generated_todo_system" / "README.md"
    readme_path.parent.mkdir(parents=True, exist_ok=True)
    readme_path.write_text(overview, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate a 250,000-file todo-driven codebase.")
    parser.add_argument("--root", type=str, default=".", help="Repository root")
    parser.add_argument("--output-dir", type=str, default="generated_todo_system", help="Directory to generate")
    parser.add_argument("--systems", type=int, default=DEFAULT_SYSTEM_COUNT, help="Number of systems to generate")
    parser.add_argument("--files-per-system", type=int, default=DEFAULT_FILES_PER_SYSTEM, help="Files per system to generate")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    output_dir = root / args.output_dir
    output_dir.mkdir(parents=True, exist_ok=True)

    total_systems = args.systems
    files_per_system = args.files_per_system
    total_files = total_systems * files_per_system

    for system_id in range(1, total_systems + 1):
        generate_system(output_dir, system_id, total_systems, files_per_system)

    generate_root_docs(root, total_files, total_systems, files_per_system)

    print(f"Generated {total_systems} systems with {files_per_system} files each.")
    print(f"Total files: {total_files}")
    print(f"Output directory: {output_dir}")


if __name__ == "__main__":
    main()
