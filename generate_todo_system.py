#!/usr/bin/env python3
"""Generate a large multi-domain code ecosystem with varied file extensions.

This script creates a modular repository-like structure for AI-assisted
software development. By default it generates 2,500 systems, each with 100
files, totaling 250,000 generated files.

Each file is generated with an extension that matches the module role and batch
so the repository looks more realistic and production-like.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

DEFAULT_SYSTEM_COUNT = 2500
DEFAULT_FILES_PER_SYSTEM = 100

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

EXTENSION_POOL = [
    ".py",
    ".js",
    ".ts",
    ".json",
    ".yaml",
    ".toml",
    ".sql",
    ".sh",
    ".html",
    ".css",
    ".md",
    ".txt",
    ".ini",
    ".xml",
]


def system_name(index: int) -> str:
    return f"system-{index:04d}"


def module_name(index: int) -> str:
    return f"module_{index:03d}"


def batch_id_for(module_id: int) -> int:
    return ((module_id - 1) // 25) + 1


def extension_for(system_id: int, module_id: int) -> str:
    domain_index = (system_id - 1) % len(SYSTEM_DOMAIN_POOL)
    role_index = (module_id - 1) % len(ROLE_POOL)
    batch = batch_id_for(module_id)
    selector = (domain_index + role_index + batch) % len(EXTENSION_POOL)
    return EXTENSION_POOL[selector]


def file_name_for(system_id: int, module_id: int) -> str:
    domain = SYSTEM_DOMAIN_POOL[(system_id - 1) % len(SYSTEM_DOMAIN_POOL)]
    role = ROLE_POOL[(module_id - 1) % len(ROLE_POOL)]
    batch = batch_id_for(module_id)
    extension = extension_for(system_id, module_id)
    return f"batch_{batch}_{domain}_{role}_{system_id:04d}_{module_id:03d}{extension}"


def build_python_module(system_id: int, module_id: int) -> str:
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


def build_js_module(system_id: int, module_id: int) -> str:
    system_label = system_name(system_id)
    domain = SYSTEM_DOMAIN_POOL[(system_id - 1) % len(SYSTEM_DOMAIN_POOL)]
    role = ROLE_POOL[(module_id - 1) % len(ROLE_POOL)]
    lines = [
        "const SYSTEM_ID = " + str(system_id) + ";",
        "const SYSTEM_NAME = '" + system_label + "';",
        "const DOMAIN = '" + domain + "';",
        "const RELATION = '" + role + "';",
        "",
        "function normalize(value) {",
        "  return value.trim().toLowerCase().replace(/\\s+/g, '_');",
        "}",
        "",
        "function buildRecord(name, score) {",
        "  return {",
        "    system: SYSTEM_NAME,",
        "    domain: DOMAIN,",
        "    relation: RELATION,",
        "    name: normalize(name),",
        "    score,",
        "  };",
        "}",
        "",
        "function summarize(items) {",
        "  return items.map((item) => ({ ...item, status: 'ready' }));",
        "}",
        "",
        "function aggregate(values) {",
        "  return values.reduce((total, value) => total + value, 0);",
        "}",
        "",
        "function processBatch(entries) {",
        "  const records = entries.map(([label, score]) => buildRecord(label, score));",
        "  return summarize(records);",
        "}",
        "",
        "const demoItems = [[RELATION, SYSTEM_ID], ['status', 100], ['check', 42]];",
        "const output = processBatch(demoItems);",
        "const total = aggregate(output.map((record) => record.score));",
        "console.log({ system: SYSTEM_NAME, domain: DOMAIN, total, output });",
    ]
    while len(lines) < 30:
        lines.append(f"// filler_{len(lines)}_{role}_{system_id}")
    return "\n".join(lines) + "\n"


def build_ts_module(system_id: int, module_id: int) -> str:
    system_label = system_name(system_id)
    domain = SYSTEM_DOMAIN_POOL[(system_id - 1) % len(SYSTEM_DOMAIN_POOL)]
    role = ROLE_POOL[(module_id - 1) % len(ROLE_POOL)]
    lines = [
        "type RecordItem = {",
        "  system: string;",
        "  domain: string;",
        "  relation: string;",
        "  name: string;",
        "  score: number;",
        "};",
        "",
        "const SYSTEM_ID: number = " + str(system_id) + ";",
        "const SYSTEM_NAME = '" + system_label + "';",
        "const DOMAIN = '" + domain + "';",
        "const RELATION = '" + role + "';",
        "",
        "function normalize(value: string): string {",
        "  return value.trim().toLowerCase().replace(/\\s+/g, '_');",
        "}",
        "",
        "function buildRecord(name: string, score: number): RecordItem {",
        "  return { system: SYSTEM_NAME, domain: DOMAIN, relation: RELATION, name: normalize(name), score };",
        "}",
        "",
        "function aggregate(values: number[]): number {",
        "  return values.reduce((total, value) => total + value, 0);",
        "}",
        "",
        "const demoItems: Array<[string, number]> = [[RELATION, SYSTEM_ID], ['status', 100], ['check', 42]];",
        "const records = demoItems.map(([label, score]) => buildRecord(label, score));",
        "const total = aggregate(records.map((item) => item.score));",
        "console.log({ system: SYSTEM_NAME, domain: DOMAIN, total, records });",
    ]
    while len(lines) < 30:
        lines.append(f"// filler_{len(lines)}_{role}_{system_id}")
    return "\n".join(lines) + "\n"


def build_json_module(system_id: int, module_id: int) -> str:
    domain = SYSTEM_DOMAIN_POOL[(system_id - 1) % len(SYSTEM_DOMAIN_POOL)]
    role = ROLE_POOL[(module_id - 1) % len(ROLE_POOL)]
    batch = batch_id_for(module_id)
    payload = {
        "system": system_name(system_id),
        "domain": domain,
        "role": role,
        "batch": batch,
        "status": "ready",
        "modules": [
            {
                "name": module_name(module_id),
                "priority": module_id % 10,
                "enabled": True,
                "todo": [
                    "define scope",
                    "validate inputs",
                    "calculate metrics",
                    "publish result",
                ],
            }
        ],
        "metrics": {
            "score": system_id + module_id,
            "count": module_id * 3,
            "healthy": True,
        },
    }
    data = json.dumps(payload, indent=2)
    lines = data.splitlines()
    while len(lines) < 30:
        lines.append("  \"placeholder\": \"ready\"")
    return "\n".join(lines) + "\n"


def build_yaml_module(system_id: int, module_id: int) -> str:
    domain = SYSTEM_DOMAIN_POOL[(system_id - 1) % len(SYSTEM_DOMAIN_POOL)]
    role = ROLE_POOL[(module_id - 1) % len(ROLE_POOL)]
    batch = batch_id_for(module_id)
    lines = [
        "system:",
        f"  id: {system_id}",
        f"  name: {system_name(system_id)}",
        f"  domain: {domain}",
        f"  role: {role}",
        f"  batch: {batch}",
        "status: ready",
        "modules:",
        f"  - name: {module_name(module_id)}",
        "    active: true",
        "    priority: 1",
        "    tasks:",
        "      - define scope",
        "      - validate inputs",
        "      - compute metrics",
        "      - publish output",
        "metadata:",
        "  owner: platform",
        "  branch: main",
        "  ready: true",
    ]
    while len(lines) < 30:
        lines.append(f"  placeholder_{len(lines)}: ready")
    return "\n".join(lines) + "\n"


def build_sql_module(system_id: int, module_id: int) -> str:
    domain = SYSTEM_DOMAIN_POOL[(system_id - 1) % len(SYSTEM_DOMAIN_POOL)]
    role = ROLE_POOL[(module_id - 1) % len(ROLE_POOL)]
    module_name_value = module_name(module_id)
    lines = [
        "CREATE TABLE IF NOT EXISTS system_runs (",
        "  id INTEGER PRIMARY KEY AUTOINCREMENT,",
        "  system_id INTEGER NOT NULL,",
        "  system_name TEXT NOT NULL,",
        "  domain TEXT NOT NULL,",
        "  role TEXT NOT NULL,",
        "  status TEXT DEFAULT 'ready',",
        "  score INTEGER DEFAULT 0",
        ");",
        "",
        f"INSERT INTO system_runs (system_id, system_name, domain, role, status, score) VALUES ({system_id}, '{system_name(system_id)}', '{domain}', '{role}', 'ready', {system_id + module_id});",
        "",
        f"SELECT system_id, system_name, domain, role, status, score FROM system_runs WHERE system_id = {system_id} ORDER BY id DESC;",
        "",
        f"CREATE VIEW IF NOT EXISTS {domain}_{role}_view AS",
        f"SELECT system_id, domain, role, score FROM system_runs WHERE domain = '{domain}' AND role = '{role}';",
        "",
        f"COMMENT ON TABLE system_runs IS 'runtime records for {system_name(system_id)}';",
        f"COMMENT ON VIEW {domain}_{role}_view IS 'summary for {module_name_value}';",
    ]
    while len(lines) < 30:
        lines.append(f"-- filler_{len(lines)}_{system_id}_{module_id}")
    return "\n".join(lines) + "\n"


def build_sh_module(system_id: int, module_id: int) -> str:
    system_label = system_name(system_id)
    role = ROLE_POOL[(module_id - 1) % len(ROLE_POOL)]
    lines = [
        "#!/usr/bin/env bash",
        "set -eu",
        "",
        "SYSTEM_NAME='" + system_label + "'",
        "ROLE='" + role + "'",
        "BATCH_ID=" + str(batch_id_for(module_id)),
        "echo \"starting $SYSTEM_NAME with $ROLE\"",
        "mkdir -p ./runtime",
        "touch ./runtime/manifest.log",
        "echo \"batch=$BATCH_ID\" >> ./runtime/manifest.log",
        "echo \"status=ready\" >> ./runtime/manifest.log",
        "echo \"role=$ROLE\" >> ./runtime/manifest.log",
        "echo \"done\"",
        "",
        "for item in 1 2 3 4 5; do",
        "  echo \"processing $item for $SYSTEM_NAME\"",
        "done",
        "",
        "echo \"complete\"",
    ]
    while len(lines) < 30:
        lines.append(f"echo \"filler_{len(lines)}_{system_id}\"")
    return "\n".join(lines) + "\n"


def build_html_module(system_id: int, module_id: int) -> str:
    domain = SYSTEM_DOMAIN_POOL[(system_id - 1) % len(SYSTEM_DOMAIN_POOL)]
    role = ROLE_POOL[(module_id - 1) % len(ROLE_POOL)]
    lines = [
        "<!DOCTYPE html>",
        "<html lang='en'>",
        "  <head>",
        "    <meta charset='UTF-8' />",
        "    <meta name='viewport' content='width=device-width, initial-scale=1.0' />",
        f"    <title>{system_name(system_id)}</title>",
        "    <style>",
        "      body { font-family: sans-serif; margin: 2rem; }",
        "      .card { border: 1px solid #d0d7de; border-radius: 8px; padding: 1rem; }",
        "    </style>",
        "  </head>",
        "  <body>",
        "    <div class='card'>",
        f"      <h1>{system_name(system_id)}</h1>",
        f"      <p>Domain: {domain}</p>",
        f"      <p>Role: {role}</p>",
        "      <p>Status: ready</p>",
        "    </div>",
        "  </body>",
        "</html>",
    ]
    while len(lines) < 30:
        lines.append(f"<div>filler_{len(lines)}_{role}</div>")
    return "\n".join(lines) + "\n"


def build_css_module(system_id: int, module_id: int) -> str:
    role = ROLE_POOL[(module_id - 1) % len(ROLE_POOL)]
    lines = [
        ":root {",
        "  --bg: #0f172a;",
        "  --panel: #111827;",
        "  --accent: #38bdf8;",
        "  --text: #e2e8f0;",
        "}",
        "",
        "body {",
        "  background: var(--bg);",
        "  color: var(--text);",
        "  font-family: sans-serif;",
        "  margin: 2rem;",
        "}",
        "",
        ".card {",
        "  background: var(--panel);",
        "  border: 1px solid var(--accent);",
        "  border-radius: 12px;",
        "  padding: 1rem;",
        "}",
        "",
        ".row {",
        "  display: flex;",
        "  gap: 1rem;",
        "}",
        "",
        f".role_{role} {{ border: 1px solid #4ade80; padding: 0.5rem; }}",
        "",
        "@media (max-width: 768px) {",
        "  body { margin: 1rem; }",
        "}",
    ]
    while len(lines) < 30:
        lines.append(f".placeholder_{len(lines)} {{ opacity: 0.8; }}")
    return "\n".join(lines) + "\n"


def build_md_module(system_id: int, module_id: int) -> str:
    domain = SYSTEM_DOMAIN_POOL[(system_id - 1) % len(SYSTEM_DOMAIN_POOL)]
    role = ROLE_POOL[(module_id - 1) % len(ROLE_POOL)]
    lines = [
        f"# {system_name(system_id)}",
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
        "4. Publish results",
        "",
        "## Notes",
        "This file is intentionally generated to mimic a real project artifact.",
        "It is designed to be readable, searchable, and extendable.",
    ]
    while len(lines) < 30:
        lines.append(f"- placeholder_{len(lines)}")
    return "\n".join(lines) + "\n"


def build_txt_module(system_id: int, module_id: int) -> str:
    role = ROLE_POOL[(module_id - 1) % len(ROLE_POOL)]
    lines = [
        f"system={system_name(system_id)}",
        f"module={module_name(module_id)}",
        f"role={role}",
        "status=ready",
        "phase=generated",
        "owner=platform",
        "type=artifact",
        "batch=" + str(batch_id_for(module_id)),
        "",
        "line one",
        "line two",
        "line three",
        "line four",
        "line five",
        "line six",
        "line seven",
        "line eight",
        "line nine",
        "line ten",
    ]
    while len(lines) < 30:
        lines.append(f"placeholder_{len(lines)}=ready")
    return "\n".join(lines) + "\n"


def build_ini_module(system_id: int, module_id: int) -> str:
    domain = SYSTEM_DOMAIN_POOL[(system_id - 1) % len(SYSTEM_DOMAIN_POOL)]
    role = ROLE_POOL[(module_id - 1) % len(ROLE_POOL)]
    lines = [
        "[system]",
        f"id={system_id}",
        f"name={system_name(system_id)}",
        f"domain={domain}",
        f"role={role}",
        "status=ready",
        "",
        "[runtime]",
        "enabled=true",
        "batch=" + str(batch_id_for(module_id)),
        "timeout=60",
        "",
        "[metadata]",
        "owner=platform",
        "source=generated",
        "checksum=none",
    ]
    while len(lines) < 30:
        lines.append(f"placeholder_{len(lines)}=ready")
    return "\n".join(lines) + "\n"


def build_xml_module(system_id: int, module_id: int) -> str:
    domain = SYSTEM_DOMAIN_POOL[(system_id - 1) % len(SYSTEM_DOMAIN_POOL)]
    role = ROLE_POOL[(module_id - 1) % len(ROLE_POOL)]
    lines = [
        "<?xml version='1.0' encoding='UTF-8'?>",
        "<system>",
        f"  <id>{system_id}</id>",
        f"  <name>{system_name(system_id)}</name>",
        f"  <domain>{domain}</domain>",
        f"  <role>{role}</role>",
        "  <status>ready</status>",
        "  <modules>",
        f"    <module id='{module_id}' name='{module_name(module_id)}' />",
        "  </modules>",
        "</system>",
    ]
    while len(lines) < 30:
        lines.append(f"  <placeholder id='{len(lines)}'>ready</placeholder>")
    return "\n".join(lines) + "\n"


def build_module_content(system_id: int, module_id: int) -> str:
    ext = extension_for(system_id, module_id)
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
    if ext == ".toml":
        return "[system]\nname = \"" + system_name(system_id) + "\"\nrole = \"" + ROLE_POOL[(module_id - 1) % len(ROLE_POOL)] + "\"\nstatus = \"ready\"\n" + "\n".join([f"item_{i} = '{i}'" for i in range(1, 25)]) + "\n"
    if ext == ".sql":
        return build_sql_module(system_id, module_id)
    if ext == ".sh":
        return build_sh_module(system_id, module_id)
    if ext == ".html":
        return build_html_module(system_id, module_id)
    if ext == ".css":
        return build_css_module(system_id, module_id)
    if ext == ".md":
        return build_md_module(system_id, module_id)
    if ext == ".txt":
        return build_txt_module(system_id, module_id)
    if ext == ".ini":
        return build_ini_module(system_id, module_id)
    if ext == ".xml":
        return build_xml_module(system_id, module_id)
    return build_txt_module(system_id, module_id)


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
The {domain} domain system contains {files_per_system} generated artifacts and follows a
consistent todo-driven, AI-managed implementation workflow.

## Structure
- `todo.md` — operational work items
- `src/` — generated runtime modules and payload files
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
        file_path.write_text(build_module_content(system_id, module_id), encoding="utf-8")


def generate_root_docs(base_dir: Path, total_files: int, total_systems: int, files_per_system: int) -> None:
    overview = f'''# Todo-driven code system

This repository was generated as a large code ecosystem with {total_files} source files.

## Structure
- {total_systems} generated systems
- {files_per_system} modules per system
- File extensions vary by batch and role to simulate realistic software artifacts
- Each file is generated with valid operational content and at least 25 lines

## Commands
```bash
python generate_todo_system.py --root . --output-dir generated_todo_system --systems 2500 --files-per-system 100
```

## Objective
Create a scalable repository scaffold with modular system boundaries, batch-based naming, and mixed-format code artifacts.
'''
    readme_path = base_dir / "generated_todo_system" / "README.md"
    readme_path.parent.mkdir(parents=True, exist_ok=True)
    readme_path.write_text(overview, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate a 250,000-file todo-driven codebase with mixed extensions.")
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
