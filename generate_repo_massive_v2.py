#!/usr/bin/env python3
"""Massive mixed-format repository generator.

Creates a large repository tree with realistic structure:
- apps/
- systems/
- os/
- services/

It generates a mix of Python, JavaScript, JSON, and YAML files and groups
large output into batch folders to stay manageable.
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

WORD_BANK = [
    "aether", "alpine", "amber", "atlas", "aurora", "basil", "beacon",
    "bloom", "brook", "cabin", "calyx", "cedar", "chime", "cinder",
    "cobalt", "coral", "crest", "dawn", "delta", "drift", "echo", "ember",
    "falcon", "field", "flora", "forge", "frost", "glade", "glow", "harbor",
    "hollow", "hush", "ivy", "jasmine", "jet", "lagoon", "lark", "lattice",
    "lumen", "meadow", "mirth", "moss", "nectar", "nexus", "oasis", "orbit",
    "orchid", "palm", "pearl", "petal", "pine", "quartz", "raven", "reef",
    "river", "rose", "saffron", "satin", "scout", "shadow", "silk", "solace",
    "sonar", "spark", "spruce", "summit", "terra", "thistle", "torrent", "vale",
    "vapor", "vein", "velvet", "verve", "willow", "zephyr",
]


def system_alias(index: int) -> str:
    first = WORD_BANK[(index - 1) % len(WORD_BANK)]
    second = WORD_BANK[(index * 3) % len(WORD_BANK)]
    return f"{first}-{second}"


def service_alias(index: int) -> str:
    first = WORD_BANK[(index * 2) % len(WORD_BANK)]
    second = WORD_BANK[(index * 5 + 1) % len(WORD_BANK)]
    return f"{first}-{second}"


def os_alias(index: int) -> str:
    first = WORD_BANK[(index - 1) % len(WORD_BANK)]
    second = WORD_BANK[(index * 7) % len(WORD_BANK)]
    return f"os-{first}-{second}"


def domain_for(system_id: int) -> str:
    return SYSTEM_TYPES[(system_id - 1) % len(SYSTEM_TYPES)]


def role_for(module_id: int) -> str:
    return ROLE_TYPES[(module_id - 1) % len(ROLE_TYPES)]


def ext_for(module_id: int) -> str:
    return FILE_TYPES[(module_id - 1) % len(FILE_TYPES)]


# --- content builders --------------------------------------------------------

def build_python_module(system_id: int, module_id: int, domain: str, role: str) -> str:
    label = f"system-{system_alias(system_id)}"
    lines = [
        f'"""Generated module for {domain} domain."""',
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
        lines.append(f"# filler_{domain}_{role}")
    return "\n".join(lines) + "\n"


def build_js_module(system_id: int, module_id: int, domain: str, role: str) -> str:
    label = f"system-{system_alias(system_id)}"
    lines = [
        f"const SYSTEM_ID = {system_id};",
        f"const SYSTEM_LABEL = '{label}';",
        f"const DOMAIN = '{domain}';",
        f"const ROLE = '{role}';",
        f"const MODULE_ID = {module_id};",
        "",
        "function normalize(value) {",
        "  return value.trim().toLowerCase().replace(/\\s+/g, '_');",
        "}",
        "",
        "function buildRecord(name, score) {",
        "  return { system: SYSTEM_LABEL, domain: DOMAIN, role: ROLE, module_id: MODULE_ID, name: normalize(name), score, status: 'ready' };",
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
    while len(lines) < 20:
        lines.append(f"// filler_{domain}_{role}")
    return "\n".join(lines) + "\n"


def build_json_module(system_id: int, module_id: int, domain: str, role: str) -> str:
    payload = {
        "system": f"system-{system_alias(system_id)}",
        "domain": domain,
        "role": role,
        "module_id": module_id,
        "status": "ready",
        "tasks": ["define scope", "validate inputs", "compute output", "publish result"],
        "metrics": {"score": system_id + module_id, "healthy": True},
    }
    text = json.dumps(payload, indent=2)
    lines = text.splitlines()
    while len(lines) < 20:
        lines.append('  "placeholder": "ready"')
    return "\n".join(lines) + "\n"


def build_yaml_module(system_id: int, module_id: int, domain: str, role: str) -> str:
    lines = [
        "system:",
        f"  id: {system_id}",
        f"  name: system-{system_alias(system_id)}",
        f"  domain: {domain}",
        f"  role: {role}",
        f"  module_id: {module_id}",
        "status: ready",
        "tasks:",
        "  - define scope",
        "  - validate input",
        "  - report result",
        "metrics:",
        "  score: 100",
        "  healthy: true",
    ]
    while len(lines) < 20:
        lines.append(f"placeholder_{len(lines)}: ready")
    return "\n".join(lines) + "\n"


def build_module_content(system_id: int, module_id: int, domain: str, role: str, ext: str) -> str:
    if ext == ".py":
        return build_python_module(system_id, module_id, domain, role)
    if ext == ".js":
        return build_js_module(system_id, module_id, domain, role)
    if ext == ".json":
        return build_json_module(system_id, module_id, domain, role)
    if ext == ".yaml":
        return build_yaml_module(system_id, module_id, domain, role)
    return build_python_module(system_id, module_id, domain, role)


# --- repo writers ------------------------------------------------------------

def write_root_docs(root: Path, systems: int, files_per_system: int, os_count: int, service_count: int) -> None:
    summary = f'''# Generated Repository Suite

This repository contains {systems} systems, {os_count} OS bundles, and {service_count} service groups.

## Structure
- `apps/` — application bootstrap and integration layer
- `systems/` — modular system folders
- `os/` — OS-style runtime bundles
- `services/` — service-oriented modules

## Notes
- Mixed file types are used: .py, .js, .json, .yaml
- Large outputs are split into batch folders when necessary
- Target generation volume: {systems * files_per_system} files
'''
    (root / "README.md").write_text(summary, encoding="utf-8")

    manifest = {
        "total_systems": systems,
        "files_per_system": files_per_system,
        "os_count": os_count,
        "service_count": service_count,
        "file_types": [".py", ".js", ".json", ".yaml"],
        "structure": ["apps", "systems", "os", "services"],
    }
    (root / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")


def write_apps_bundle(root: Path, system_count: int) -> None:
    apps_dir = root / "apps"
    apps_dir.mkdir(parents=True, exist_ok=True)
    (apps_dir / "README.md").write_text("# App layer\n\nThis directory holds the top-level application bootstrap and integration files.\n", encoding="utf-8")
    (apps_dir / "index.py").write_text(
        f'"""Application bootstrap."""\n\nSYSTEM_COUNT = {system_count}\n\nprint(f"Repository contains {{SYSTEM_COUNT}} systems.")\n',
        encoding="utf-8",
    )
    (apps_dir / "runtime.js").write_text(
        f"const SYSTEM_COUNT = {system_count};\nconsole.log(`Repository contains ${{SYSTEM_COUNT}} systems.`);\n",
        encoding="utf-8",
    )
    (apps_dir / "runtime.json").write_text(json.dumps({"system_count": system_count}, indent=2), encoding="utf-8")
    (apps_dir / "deploy.yaml").write_text(f"apps:\n  - name: generated-suite\n    system_count: {system_count}\n    status: ready\n", encoding="utf-8")


def write_systems_bundle(root: Path, system_count: int, files_per_system: int, max_files_per_dir: int) -> None:
    systems_dir = root / "systems"
    systems_dir.mkdir(parents=True, exist_ok=True)

    for system_id in range(1, system_count + 1):
        domain = domain_for(system_id)
        label = f"system-{system_alias(system_id)}"
        sdir = systems_dir / label
        sdir.mkdir(parents=True, exist_ok=True)

        (sdir / "README.md").write_text(
            f"# {label}\n\nThis system belongs to `{domain}` and is part of a larger generated ecosystem.\n",
            encoding="utf-8",
        )
        (sdir / "todo.md").write_text(
            f"# {label}\n\n## Todo\n1. Define system scope\n2. Build core modules\n3. Validate deployment readiness\n",
            encoding="utf-8",
        )

        src_dir = sdir / "src"
        src_dir.mkdir(parents=True, exist_ok=True)

        current_batch = src_dir
        batch_index = 0

        for module_id in range(1, files_per_system + 1):
            if module_id % max_files_per_dir == 1 and module_id != 1:
                batch_index += 1
                current_batch = src_dir / f"batch_{batch_index:03d}"
                current_batch.mkdir(parents=True, exist_ok=True)

            role = role_for(module_id)
            ext = ext_for(module_id)
            file_name = f"{domain}_{role}_{system_alias(system_id)}_{module_id:04d}{ext}"
            file_path = current_batch / file_name
            content = build_module_content(system_id, module_id, domain, role, ext)
            file_path.write_text(content, encoding="utf-8")


def write_os_bundle(root: Path, os_count: int, max_files_per_dir: int) -> None:
    os_root = root / "os"
    os_root.mkdir(parents=True, exist_ok=True)

    for os_id in range(1, os_count + 1):
        label = os_alias(os_id)
        odir = os_root / label
        odir.mkdir(parents=True, exist_ok=True)
        (odir / "README.md").write_text(f"# {label}\n\nRuntime bundle generated for orchestration workflows.\n", encoding="utf-8")

        current_batch = odir
        batch_index = 0
        for module_id in range(1, 9):
            if module_id % max_files_per_dir == 1 and module_id != 1:
                batch_index += 1
                current_batch = odir / f"batch_{batch_index:03d}"
                current_batch.mkdir(parents=True, exist_ok=True)

            ext = ext_for(module_id)
            filename = f"runtime_{module_id:03d}{ext}"
            content = build_module_content(os_id, module_id, "os", "runtime", ext)
            (current_batch / filename).write_text(content, encoding="utf-8")


def write_services_bundle(root: Path, service_count: int, max_files_per_dir: int) -> None:
    services_root = root / "services"
    services_root.mkdir(parents=True, exist_ok=True)

    for service_id in range(1, service_count + 1):
        label = f"service-{service_alias(service_id)}"
        sdir = services_root / label
        sdir.mkdir(parents=True, exist_ok=True)
        (sdir / "README.md").write_text(f"# {label}\n\nService bundle generated for integration and runtime orchestration.\n", encoding="utf-8")

        current_batch = sdir
        batch_index = 0
        for module_id in range(1, 7):
            if module_id % max_files_per_dir == 1 and module_id != 1:
                batch_index += 1
                current_batch = sdir / f"batch_{batch_index:03d}"
                current_batch.mkdir(parents=True, exist_ok=True)

            ext = ext_for(module_id)
            filename = f"service_{module_id:03d}{ext}"
            content = build_module_content(service_id, module_id, "services", "service", ext)
            (current_batch / filename).write_text(content, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate a massive mixed-format repository suite.")
    parser.add_argument("--root", type=str, default=".", help="Root directory")
    parser.add_argument("--output-dir", type=str, default="generated_massive_repo", help="Output directory")
    parser.add_argument("--systems", type=int, default=1500, help="Number of systems")
    parser.add_argument("--files-per-system", type=int, default=1000, help="Generated files per system")
    parser.add_argument("--os-count", type=int, default=25, help="Number of OS bundles")
    parser.add_argument("--service-count", type=int, default=100, help="Number of service bundles")
    parser.add_argument("--max-files-per-dir", type=int, default=250, help="Maximum files per directory before batching")
    args = parser.parse_args()

    root = Path(args.root).resolve() / args.output_dir
    root.mkdir(parents=True, exist_ok=True)

    write_root_docs(root, args.systems, args.files_per_system, args.os_count, args.service_count)
    write_apps_bundle(root, args.systems)
    write_systems_bundle(root, args.systems, args.files_per_system, args.max_files_per_dir)
    write_os_bundle(root, args.os_count, args.max_files_per_dir)
    write_services_bundle(root, args.service_count, args.max_files_per_dir)

    print(f"Repository generated at: {root}")
    print(f"Systems: {args.systems}")
    print(f"Files per system: {args.files_per_system}")
    print(f"OS bundles: {args.os_count}")
    print(f"Services: {args.service_count}")
    print("Mixed file types: .py, .js, .json, .yaml")


if __name__ == "__main__":
    main()
