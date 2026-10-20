#!/usr/bin/env python3
"""Generate a large repository suite with realistic mixed file types.

This script creates a large multi-directory repo structure aligned with a
modular app architecture:
- apps/
- systems/
- os/
- services/

It can generate many files in batches and split large directories to keep
operations manageable.

Example:
    python generate_full_repo_suite.py \
        --root . \
        --systems 1500 \
        --files-per-system 1000 \
        --os-count 25 \
        --service-count 100 \
        --max-files-per-dir 250 \
        --output-dir generated_repo_suite
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

FILE_TYPES = [".py", ".js", ".json", ".yaml"]
OS_NAMES = [
    "nova",
    "aether",
    "cinder",
    "vanta",
    "orbit",
    "sylva",
    "echo",
    "quartz",
    "atlas",
    "mira",
    "zenith",
    "luma",
    "solis",
    "prism",
    "kairo",
    "lyra",
    "nexus",
    "vapor",
    "riven",
    "aurora",
    "glint",
    "ember",
    "cobalt",
    "pixel",
    "flux",
]


def system_label(index: int) -> str:
    return f"system-{index:04d}"


def service_label(index: int) -> str:
    return f"service-{index:04d}"


def os_label(index: int) -> str:
    return f"os_{index:02d}_{OS_NAMES[(index - 1) % len(OS_NAMES)]}"


def domain_for(system_id: int) -> str:
    return SYSTEM_TYPES[(system_id - 1) % len(SYSTEM_TYPES)]


def role_for(module_id: int) -> str:
    return ROLE_TYPES[(module_id - 1) % len(ROLE_TYPES)]


def file_kind_for(module_id: int) -> str:
    idx = (module_id - 1) % len(FILE_TYPES)
    return FILE_TYPES[idx]


def slug(value: str) -> str:
    return value.strip().lower().replace(" ", "-")


def build_python_module(system_id: int, module_id: int, domain: str, role: str) -> str:
    label = system_label(system_id)
    lines = [
        '"""Generated module for the ' + domain + ' domain."""',
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
        "class RuntimeRecord:",
        "    system: str",
        "    domain: str",
        "    role: str",
        "    module_id: int",
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
        "        'module_id': MODULE_ID,",
        "        'name': normalize(name),",
        "        'score': score,",
        "    }",
        "    return RuntimeRecord(",
        "        system=SYSTEM_LABEL,",
        "        domain=DOMAIN,",
        "        role=ROLE,",
        "        module_id=MODULE_ID,",
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
        "        'module_id': MODULE_ID,",
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


def build_js_module(system_id: int, module_id: int, domain: str, role: str) -> str:
    label = system_label(system_id)
    lines = [
        "const SYSTEM_ID = " + str(system_id) + ";",
        "const SYSTEM_LABEL = '" + label + "';",
        "const DOMAIN = '" + domain + "';",
        "const ROLE = '" + role + "';",
        "const MODULE_ID = " + str(module_id) + ";",
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
        "    module_id: MODULE_ID,",
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
        "  return { system: SYSTEM_LABEL, domain: DOMAIN, role: ROLE, module_id: MODULE_ID, total, records };",
        "}",
        "",
        "console.log(runDemo());",
    ]
    while len(lines) < 30:
        lines.append(f"// filler_{len(lines)}_{domain}_{role}")
    return "\n".join(lines) + "\n"


def build_json_module(system_id: int, module_id: int, domain: str, role: str) -> str:
    payload = {
        "system": system_label(system_id),
        "domain": domain,
        "role": role,
        "module_id": module_id,
        "status": "ready",
        "tasks": [
            "define scope",
            "validate inputs",
            "compute output",
            "publish result",
        ],
        "metrics": {"score": system_id + module_id, "healthy": True},
    }
    text = json.dumps(payload, indent=2)
    lines = text.splitlines()
    while len(lines) < 30:
        lines.append('  "placeholder": "ready"')
    return "\n".join(lines) + "\n"


def build_yaml_module(system_id: int, module_id: int, domain: str, role: str) -> str:
    lines = [
        "system:",
        f"  id: {system_id}",
        f"  name: {system_label(system_id)}",
        f"  domain: {domain}",
        f"  role: {role}",
        f"  module_id: {module_id}",
        "status: ready",
        "tasks:",
        "  - define scope",
        "  - validate inputs",
        "  - report result",
        "metrics:",
        "  score: 100",
        "  healthy: true",
    ]
    while len(lines) < 30:
        lines.append(f"placeholder_{len(lines)}: ready")
    return "\n".join(lines) + "\n"


def build_module_by_extension(system_id: int, module_id: int, domain: str, role: str, ext: str) -> str:
    if ext == ".py":
        return build_python_module(system_id, module_id, domain, role)
    if ext == ".js":
        return build_js_module(system_id, module_id, domain, role)
    if ext == ".json":
        return build_json_module(system_id, module_id, domain, role)
    if ext == ".yaml":
        return build_yaml_module(system_id, module_id, domain, role)
    return build_python_module(system_id, module_id, domain, role)


def build_system_readme(system_id: int, domain: str) -> str:
    label = system_label(system_id)
    return f'''# {label}

This system belongs to the `{domain}` domain and is part of an AI-generated repository ecosystem.

## Structure
- `todo.md` — operational todo list
- `src/` — generated modules
- `README.md` — summary

## Summary
The system is modular, production-like, and designed for orchestration workflows.
'''


def build_system_todo(system_id: int, domain: str) -> str:
    label = system_label(system_id)
    return f'''# {label}

## Overview
{domain} system generated as part of a multi-domain repository suite.

## Todo
1. Define business objective and scope.
2. Identify system dependencies.
3. Implement operational modules.
4. Validate output and deployment readiness.
'''


def build_service_readme(service_index: int) -> str:
    label = service_label(service_index)
    return f'''# {label}

This service is part of the generated repo suite.

## Purpose
Coordination, runtime orchestration, and platform integration.
'''


def build_os_readme(os_index: int) -> str:
    label = os_label(os_index)
    return f'''# {label}

This generated OS directory acts as a lightweight runtime bundle for automated deployment flows.
'''


def generate_system_bundle(root: Path, system_id: int, files_per_system: int, max_files_per_dir: int) -> None:
    domain = domain_for(system_id)
    label = system_label(system_id)
    system_dir = root / "systems" / label
    system_dir.mkdir(parents=True, exist_ok=True)

    (system_dir / "README.md").write_text(build_system_readme(system_id, domain), encoding="utf-8")
    (system_dir / "todo.md").write_text(build_system_todo(system_id, domain), encoding="utf-8")

    src_dir = system_dir / "src"
    src_dir.mkdir(parents=True, exist_ok=True)

    batch_count = 0
    batch_dir = src_dir

    for module_id in range(1, files_per_system + 1):
        ext = file_kind_for(module_id)
        filename = f"{domain}_{role_for(module_id)}_{module_id:04d}{ext}"

        if module_id % max_files_per_dir == 1 and module_id != 1:
            batch_count += 1
            batch_dir = src_dir / f"batch_{batch_count:03d}"
            batch_dir.mkdir(parents=True, exist_ok=True)

        content = build_module_by_extension(system_id, module_id, domain, role_for(module_id), ext)
        (batch_dir / filename).write_text(content, encoding="utf-8")


def generate_service_bundle(root: Path, service_count: int, max_files_per_dir: int) -> None:
    services_dir = root / "services"
    services_dir.mkdir(parents=True, exist_ok=True)

    for service_id in range(1, service_count + 1):
        service_dir = services_dir / service_label(service_id)
        service_dir.mkdir(parents=True, exist_ok=True)
        (service_dir / "README.md").write_text(build_service_readme(service_id), encoding="utf-8")

        batch_dir = service_dir
        batch_count = 0

        for item in range(1, 6):
            if item % max_files_per_dir == 1 and item != 1:
                batch_count += 1
                batch_dir = service_dir / f"batch_{batch_count:03d}"
                batch_dir.mkdir(parents=True, exist_ok=True)
            ext = FILE_TYPES[(service_id + item - 2) % len(FILE_TYPES)]
            filename = f"runtime_{item:03d}{ext}"
            content = build_module_by_extension(service_id, item, "services", "service", ext)
            (batch_dir / filename).write_text(content, encoding="utf-8")


def generate_os_bundle(root: Path, os_count: int, max_files_per_dir: int) -> None:
    os_dir_root = root / "os"
    os_dir_root.mkdir(parents=True, exist_ok=True)

    for os_index in range(1, os_count + 1):
        os_name = os_label(os_index)
        os_dir = os_dir_root / os_name
        os_dir.mkdir(parents=True, exist_ok=True)
        (os_dir / "README.md").write_text(build_os_readme(os_index), encoding="utf-8")

        batch_dir = os_dir
        batch_count = 0
        for item in range(1, 9):
            if item % max_files_per_dir == 1 and item != 1:
                batch_count += 1
                batch_dir = os_dir / f"batch_{batch_count:03d}"
                batch_dir.mkdir(parents=True, exist_ok=True)
            ext = FILE_TYPES[(os_index + item - 2) % len(FILE_TYPES)]
            filename = f"os_{item:03d}{ext}"
            content = build_module_by_extension(os_index, item, "os", "runtime", ext)
            (batch_dir / filename).write_text(content, encoding="utf-8")


def generate_apps_bundle(root: Path, total_systems: int) -> None:
    apps_dir = root / "apps"
    apps_dir.mkdir(parents=True, exist_ok=True)

    (apps_dir / "README.md").write_text("# App layer\n\nThis directory holds the repo-level app bootstrap and integration hooks.\n", encoding="utf-8")
    (apps_dir / "index.py").write_text(
        '"""App bootstrap."""\n\nSYSTEM_COUNT = ' + str(total_systems) + '\n\nprint(f"Repository contains {SYSTEM_COUNT} systems.")\n',
        encoding="utf-8",
    )
    (apps_dir / "runtime.js").write_text(
        "const SYSTEM_COUNT = " + str(total_systems) + ";\nconsole.log(`Repository contains ${SYSTEM_COUNT} systems.`);\n",
        encoding="utf-8",
    )
    (apps_dir / "config.json").write_text(json.dumps({"system_count": total_systems, "status": "ready"}, indent=2), encoding="utf-8")
    (apps_dir / "deploy.yaml").write_text(
        "apps:\n  - name: generated-suite\n    system_count: " + str(total_systems) + "\n    status: ready\n",
        encoding="utf-8",
    )


def write_root_summary(root: Path, total_systems: int, files_per_system: int, os_count: int, service_count: int) -> None:
    manifest = {
        "total_systems": total_systems,
        "files_per_system": files_per_system,
        "os_count": os_count,
        "service_count": service_count,
        "structure": [
            "apps/",
            "systems/",
            "os/",
            "services/",
        ],
        "notes": [
            "The repository contains mixed language artifacts (.py, .js, .json, .yaml).",
            "File generation is chunked by batch to keep large output directories manageable.",
        ],
    }
    (root / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    (root / "README.md").write_text(
        f"# Generated Repo Suite\n\n"
        f"This repository contains {total_systems} systems, {os_count} OS bundles, and {service_count} service folders.\n\n"
        "It is designed to simulate a real-world repo with layered application, system, OS, and service concerns.\n",
        encoding="utf-8",
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate a large multi-file repo suite with mixed file types.")
    parser.add_argument("--root", type=str, default=".", help="Output root directory")
    parser.add_argument("--output-dir", type=str, default="generated_repo_suite", help="Directory name for the generated repo")
    parser.add_argument("--systems", type=int, default=1500, help="Number of systems")
    parser.add_argument("--files-per-system", type=int, default=1000, help="Number of generated files per system")
    parser.add_argument("--os-count", type=int, default=25, help="Number of OS bundles")
    parser.add_argument("--service-count", type=int, default=100, help="Number of service directories")
    parser.add_argument("--max-files-per-dir", type=int, default=250, help="Chunk size for splitting generated files per directory")
    args = parser.parse_args()

    root = Path(args.root).resolve() / args.output_dir
    root.mkdir(parents=True, exist_ok=True)

    (root / "systems").mkdir(exist_ok=True)
    (root / "apps").mkdir(exist_ok=True)
    (root / "os").mkdir(exist_ok=True)
    (root / "services").mkdir(exist_ok=True)

    for system_id in range(1, args.systems + 1):
        generate_system_bundle(root, system_id, args.files_per_system, args.max_files_per_dir)

    generate_apps_bundle(root, args.systems)
    generate_os_bundle(root, args.os_count, args.max_files_per_dir)
    generate_service_bundle(root, args.service_count, args.max_files_per_dir)
    write_root_summary(root, args.systems, args.files_per_system, args.os_count, args.service_count)

    print(f"Generated repository at: {root}")
    print(f"Systems: {args.systems}")
    print(f"Files per system: {args.files_per_system}")
    print(f"OS bundles: {args.os_count}")
    print(f"Services: {args.service_count}")
    print("Mixed file types: .py, .js, .json, .yaml")


if __name__ == "__main__":
    main()
