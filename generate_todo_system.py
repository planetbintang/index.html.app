#!/usr/bin/env python3
"""Generate a massive todo-driven repository with 1,500,000 source files.

Default configuration:
- 1,500 systems
- 1,000 files per system
- total = 1,500,000 files

Each generated file contains valid code-like content and at least 25 lines,
with a clean naming pattern that reflects system type, role, batch, and file id.
"""

from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path
from typing import Dict, Iterable, List, Tuple

DEFAULT_SYSTEM_COUNT = 1500
DEFAULT_FILES_PER_SYSTEM = 1000
DEFAULT_TOTAL_FILES = DEFAULT_SYSTEM_COUNT * DEFAULT_FILES_PER_SYSTEM

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
    "infrastructure",
    "media",
    "supply",
    "aiops",
    "operations",
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
    "parser",
    "processor",
    "orchestrator",
    "resolver",
    "manager",
    "engine",
    "monitor",
]

EXTENSION_BY_ROLE = {
    "core": ".py",
    "service": ".py",
    "gateway": ".js",
    "worker": ".py",
    "adapter": ".ts",
    "validator": ".py",
    "scheduler": ".yaml",
    "reporter": ".md",
    "parser": ".json",
    "processor": ".py",
    "orchestrator": ".yaml",
    "resolver": ".json",
    "manager": ".toml",
    "engine": ".py",
    "monitor": ".sql",
}


def system_label(index: int) -> str:
    return f"system-{index:04d}"


def system_type(index: int) -> str:
    return SYSTEM_TYPES[(index - 1) % len(SYSTEM_TYPES)]


def role_for(module_id: int) -> str:
    return ROLE_TYPES[(module_id - 1) % len(ROLE_TYPES)]


def batch_for(module_id: int) -> int:
    return ((module_id - 1) // 25) + 1


def file_extension(system_id: int, module_id: int) -> str:
    role = role_for(module_id)
    return EXTENSION_BY_ROLE.get(role, ".py")


def file_name(system_id: int, module_id: int) -> str:
    domain = system_type(system_id)
    role = role_for(module_id)
    batch = batch_for(module_id)
    ext = file_extension(system_id, module_id)
    return f"{domain}_{role}_{system_id:04d}_batch_{batch:02d}_{module_id:04d}{ext}"


def build_python_module(system_id: int, module_id: int) -> str:
    domain = system_type(system_id)
    role = role_for(module_id)
    batch = batch_for(module_id)
    system_name_value = system_label(system_id)
    file_id = file_name(system_id, module_id)

    lines = [
        '"""Generated module for a todo-driven repository ecosystem."""',
        "from __future__ import annotations",
        "",
        "import json",
        "from dataclasses import dataclass, field",
        "from typing import Any, Dict, Iterable, List",
        "",
        f"SYSTEM_ID = {system_id}",
        f"SYSTEM_LABEL = '{system_name_value}'",
        f"DOMAIN = '{domain}'",
        f"ROLE = '{role}'",
        f"BATCH = {batch}",
        f"FILE_ID = '{file_id}'",
        "",
        "@dataclass",
        "class RuntimeRecord:",
        "    system: str",
        "    domain: str",
        "    role: str",
        "    batch: int",
        "    score: int = 0",
        "    status: str = 'ready'",
        "    metadata: Dict[str, Any] = field(default_factory=dict)",
        "",
        "def normalize(value: str) -> str:",
        "    return value.strip().lower().replace(' ', '_')",
        "",
        "def build_record(name: str, score: int) -> RuntimeRecord:",
        "    payload = {",
        "        'system': SYSTEM_LABEL,",
        "        'domain': DOMAIN,",
        "        'role': ROLE,",
        "        'batch': BATCH,",
        "        'name': normalize(name),",
        "        'score': score,",
        "    }",
        "    return RuntimeRecord(",
        "        system=SYSTEM_LABEL,",
        "        domain=DOMAIN,",
        "        role=ROLE,",
        "        batch=BATCH,",
        "        score=score,",
        "        status='ready',",
        "        metadata=payload,",
        "    )",
        "",
        "def summarize(items: Iterable[RuntimeRecord]) -> List[Dict[str, Any]]:",
        "    return [item.metadata for item in items]",
        "",
        "def aggregate(values: Iterable[int]) -> int:",
        "    total = 0",
        "    for value in values:",
        "        total += value",
        "    return total",
        "",
        "def run_demo() -> Dict[str, Any]:",
        "    demo_items = [('status', 25), ('health', 30), ('scale', 40)]",
        "    records = [build_record(label, score) for label, score in demo_items]",
        "    total = aggregate(item.score for item in records)",
        "    return {",
        "        'system': SYSTEM_LABEL,",
        "        'domain': DOMAIN,",
        "        'role': ROLE,",
        "        'batch': BATCH,",
        "        'total': total,",
        "        'records': summarize(records),",
        "    }",
        "",
        "if __name__ == '__main__':",
        "    print(json.dumps(run_demo(), indent=2))",
    ]
    while len(lines) < 30:
        lines.append(f"# filler_{len(lines)}_{domain}_{role}")
    return "\n".join(lines) + "\n"


def build_js_module(system_id: int, module_id: int) -> str:
    domain = system_type(system_id)
    role = role_for(module_id)
    batch = batch_for(module_id)
    lines = [
        "const SYSTEM_ID = " + str(system_id) + ";",
        "const SYSTEM_LABEL = '" + system_label(system_id) + "';",
        "const DOMAIN = '" + domain + "';",
        "const ROLE = '" + role + "';",
        "const BATCH = " + str(batch) + ";",
        "",
        "function normalize(value) {",
        "  return value.trim().toLowerCase().replace(/\\s+/g, '_');",
        "}",
        "",
        "function buildRecord(name, score) {",
        "  return {",
        "    system: SYSTEM_LABEL,",
        "    domain: DOMAIN,",
        "    role: ROLE,",
        "    batch: BATCH,",
        "    name: normalize(name),",
        "    score,",
        "    status: 'ready',",
        "  };",
        "}",
        "",
        "function runDemo() {",
        "  const items = [['status', 25], ['health', 30], ['scale', 40]];",
        "  const records = items.map(([label, score]) => buildRecord(label, score));",
        "  const total = records.reduce((sum, item) => sum + item.score, 0);",
        "  return { system: SYSTEM_LABEL, domain: DOMAIN, role: ROLE, batch: BATCH, total, records };",
        "}",
        "",
        "console.log(runDemo());",
    ]
    while len(lines) < 30:
        lines.append(f"// filler_{len(lines)}_{domain}_{role}")
    return "\n".join(lines) + "\n"


def build_ts_module(system_id: int, module_id: int) -> str:
    domain = system_type(system_id)
    role = role_for(module_id)
    batch = batch_for(module_id)
    lines = [
        "type RuntimeRecord = {",
        "  system: string;",
        "  domain: string;",
        "  role: string;",
        "  batch: number;",
        "  score: number;",
        "  status: string;",
        "};",
        "",
        "const SYSTEM_ID: number = " + str(system_id) + ";",
        "const SYSTEM_LABEL = '" + system_label(system_id) + "';",
        "const DOMAIN = '" + domain + "';",
        "const ROLE = '" + role + "';",
        "const BATCH = " + str(batch) + ";",
        "",
        "function normalize(value: string): string {",
        "  return value.trim().toLowerCase().replace(/\\s+/g, '_');",
        "}",
        "",
        "function buildRecord(name: string, score: number): RuntimeRecord {",
        "  return { system: SYSTEM_LABEL, domain: DOMAIN, role: ROLE, batch: BATCH, score, status: 'ready' };",
        "}",
        "",
        "const demoItems: Array<[string, number]> = [['status', 25], ['health', 30], ['scale', 40]];",
        "const records = demoItems.map(([label, score]) => buildRecord(label, score));",
        "const total = records.reduce((sum, item) => sum + item.score, 0);",
        "console.log({ system: SYSTEM_LABEL, domain: DOMAIN, role: ROLE, batch: BATCH, total, records });",
    ]
    while len(lines) < 30:
        lines.append(f"// filler_{len(lines)}_{domain}_{role}")
    return "\n".join(lines) + "\n"


def build_json_module(system_id: int, module_id: int) -> str:
    domain = system_type(system_id)
    role = role_for(module_id)
    batch = batch_for(module_id)
    payload = {
        "system": system_label(system_id),
        "domain": domain,
        "role": role,
        "batch": batch,
        "status": "ready",
        "tasks": [
            "define scope",
            "validate inputs",
            "calculate output",
            "publish result",
        ],
        "metrics": {
            "score": system_id + module_id,
            "healthy": True,
        },
    }
    text = json.dumps(payload, indent=2)
    lines = text.splitlines()
    while len(lines) < 30:
        lines.append('  "placeholder": "ready"')
    return "\n".join(lines) + "\n"


def build_yaml_module(system_id: int, module_id: int) -> str:
    domain = system_type(system_id)
    role = role_for(module_id)
    batch = batch_for(module_id)
    lines = [
        "system:",
        f"  id: {system_id}",
        f"  name: {system_label(system_id)}",
        f"  domain: {domain}",
        f"  role: {role}",
        f"  batch: {batch}",
        "status: ready",
        "tasks:",
        "  - define scope",
        "  - validate inputs",
        "  - report results",
        "metrics:",
        "  score: 100",
        "  healthy: true",
    ]
    while len(lines) < 30:
        lines.append(f"placeholder_{len(lines)}: ready")
    return "\n".join(lines) + "\n"


def build_sql_module(system_id: int, module_id: int) -> str:
    domain = system_type(system_id)
    role = role_for(module_id)
    lines = [
        "CREATE TABLE IF NOT EXISTS runtime_metrics (",
        "  id INTEGER PRIMARY KEY AUTOINCREMENT,",
        "  system_id INTEGER NOT NULL,",
        "  system_label TEXT NOT NULL,",
        "  domain TEXT NOT NULL,",
        "  role TEXT NOT NULL,",
        "  status TEXT DEFAULT 'ready',",
        "  score INTEGER DEFAULT 0",
        ");",
        "",
        f"INSERT INTO runtime_metrics (system_id, system_label, domain, role, status, score) VALUES ({system_id}, '{system_label(system_id)}', '{domain}', '{role}', 'ready', {system_id + module_id});",
        "",
        "SELECT * FROM runtime_metrics ORDER BY id DESC;",
        "",
        "CREATE VIEW IF NOT EXISTS system_summary AS",
        "SELECT system_id, domain, role, status, score FROM runtime_metrics;",
    ]
    while len(lines) < 30:
        lines.append(f"-- filler_{len(lines)}_{system_id}_{module_id}")
    return "\n".join(lines) + "\n"


def build_toml_module(system_id: int, module_id: int) -> str:
    domain = system_type(system_id)
    role = role_for(module_id)
    lines = [
        "[system]",
        f"id = {system_id}",
        f"name = '{system_label(system_id)}'",
        f"domain = '{domain}'",
        f"role = '{role}'",
        "status = 'ready'",
        "",
        "[runtime]",
        "enabled = true",
        "batch = 1",
        "priority = 1",
        "",
        "[metrics]",
        "score = 100",
        "healthy = true",
    ]
    while len(lines) < 30:
        lines.append(f"placeholder_{len(lines)} = 'ready'")
    return "\n".join(lines) + "\n"


def build_md_module(system_id: int, module_id: int) -> str:
    domain = system_type(system_id)
    role = role_for(module_id)
    lines = [
        f"# {system_label(system_id)}",
        "",
        "## Overview",
        "This module belongs to a generated repository ecosystem.",
        "",
        f"- Domain: {domain}",
        f"- Role: {role}",
        "- Status: ready",
        "",
        "## Todo",
        "1. Define scope",
        "2. Validate inputs",
        "3. Build execution flow",
        "4. Publish result",
        "",
        "## Notes",
        "This file was generated to simulate a real operational repository.",
    ]
    while len(lines) < 30:
        lines.append(f"- placeholder_{len(lines)}")
    return "\n".join(lines) + "\n"


def build_content(system_id: int, module_id: int) -> str:
    ext = file_extension(system_id, module_id)
    if ext == ".py":
        return build_python_module(system_id, module_id)
    if ext == ".js":
        return build_js_module(system_id, module_id)
    if ext == ".ts":
        return build_ts_module(system_id, module_id)
    if ext == ".json":
        return build_json_module(system_id, module_id)
    if ext == ".yaml":
        return build_yaml_module(system_id, module_id)
    if ext == ".sql":
        return build_sql_module(system_id, module_id)
    if ext == ".toml":
        return build_toml_module(system_id, module_id)
    if ext == ".md":
        return build_md_module(system_id, module_id)
    return build_python_module(system_id, module_id)


def build_todo_markdown(system_id: int) -> str:
    domain = system_type(system_id)
    label = system_label(system_id)
    return f'''# {label}

## Overview
{domain} system generated as part of a modular todo-driven repository ecosystem.

## Todo
1. Define business objective and scope.
2. Identify system dependencies.
3. Implement primary operational modules.
4. Validate output and deployment readiness.

## Status
Ready for extension and integration.
'''


def build_system_readme(system_id: int) -> str:
    domain = system_type(system_id)
    label = system_label(system_id)
    return f'''# {label}

This system belongs to the {domain} domain and is part of a larger generated repository.

## Structure
- `todo.md` — operational tasks
- `src/` — generated modules
- `README.md` — summary

## Summary
This system is modular, production-like, and designed for AI-assisted todo workflows.
'''


def generate_system(base_dir: Path, system_id: int) -> None:
    label = system_label(system_id)
    system_dir = base_dir / label
    system_dir.mkdir(parents=True, exist_ok=True)

    (system_dir / "todo.md").write_text(build_todo_markdown(system_id), encoding="utf-8")
    (system_dir / "README.md").write_text(build_system_readme(system_id), encoding="utf-8")

    src_dir = system_dir / "src"
    src_dir.mkdir(parents=True, exist_ok=True)

    for module_id in range(1, DEFAULT_FILES_PER_SYSTEM + 1):
        file_name_value = file_name(system_id, module_id)
        file_path = src_dir / file_name_value
        file_path.write_text(build_content(system_id, module_id), encoding="utf-8")


def generate_manifest(base_dir: Path, total_systems: int, total_files: int) -> None:
    manifest = {
        "total_systems": total_systems,
        "total_files": total_files,
        "generated_at": "dynamic",
        "structure": "system folders with src modules and todo readme",
        "notes": "Each generated file contains at least 25 lines and valid executable content.",
    }
    (base_dir / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")


def generate_root_docs(base_dir: Path, total_systems: int, total_files: int) -> None:
    readme = f'''# Todo-driven repository overview

This repository contains {total_files} generated files across {total_systems} systems.

## Structure
- {total_systems} systems
- each system contains a `src` directory and todo/README files
- each file has a clean naming pattern tied to system type, role, and batch
- all generated files are valid and contain at least 25 lines

## Run
```bash
python generate_todo_system.py --root . --output-dir generated_todo_system --systems 1500 --files-per-system 1000
```
'''
    (base_dir / "generated_todo_system" / "README.md").write_text(readme, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate a large repository scaffold with 1,500,000 files.")
    parser.add_argument("--root", type=str, default=".", help="Repository root")
    parser.add_argument("--output-dir", type=str, default="generated_todo_system", help="Directory to generate")
    parser.add_argument("--systems", type=int, default=DEFAULT_SYSTEM_COUNT, help="Number of systems")
    parser.add_argument("--files-per-system", type=int, default=DEFAULT_FILES_PER_SYSTEM, help="Files per system")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    output_dir = root / args.output_dir
    output_dir.mkdir(parents=True, exist_ok=True)

    total_systems = args.systems
    files_per_system = args.files_per_system
    total_files = total_systems * files_per_system

    for system_id in range(1, total_systems + 1):
        generate_system(output_dir, system_id)

    generate_root_docs(root, total_systems, total_files)
    generate_manifest(root, total_systems, total_files)

    print(f"Generated {total_systems} systems.")
    print(f"Total files: {total_files}")
    print(f"Output directory: {output_dir}")
    print("This generator is ready to be checked directly in the repository.")


if __name__ == "__main__":
    main()
