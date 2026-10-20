#!/usr/bin/env python3
from pathlib import Path
import random
import string
import argparse

OS_NAMES = [
    "nova", "aether", "cinder", "vanta", "orbit", "sylva",
    "echo", "quartz", "atlas", "mira", "zenith", "luma",
    "solis", "prism", "kairo", "lyra", "nexus", "vapor",
    "riven", "aurora", "glint", "ember", "cobalt", "pixel", "flux"
]

FILE_EXTS = [
    ".exe", ".dll", ".so", ".dylib", ".bin", ".img", ".iso", ".tar",
    ".gz", ".zip", ".sh", ".ps1", ".bat", ".cmd", ".vbs", ".py",
    ".js", ".html", ".css", ".json", ".xml", ".yaml", ".toml", ".ini",
    ".cfg", ".log", ".db", ".sqlite", ".dat", ".bak", ".tmp", ".cache",
    ".app", ".pkg", ".deb", ".rpm", ".raw", ".txt", ".md"
]


def rand_token(length=8):
    alphabet = string.ascii_lowercase + string.digits
    return ''.join(random.choice(alphabet) for _ in range(length))


def build_lines(index, os_name):
    lines = [
        "# generated custom os package",
        f"# file_index={index}",
        f"# os_target={os_name}",
        "const systemName = '" + os_name + "';",
        "const status = 'ready';",
        "const runtime = 'local';",
        "let counter = 0;",
        "",
        "function addStep(value) {",
        "  counter += value;",
        "  return counter;",
        "}",
        "",
        "function stamp(label) {",
        "  return { label, state: 'active', count: counter };",
        "}",
        "",
        "const sample = ['kernel', 'shell', 'driver', 'boot', 'runtime'];",
        "for (const item of sample) {",
        "  console.log(item);",
        "}",
        "",
        "const token = '" + rand_token(14) + "';",
        "const metadata = { systemName, status, runtime, token };",
        "console.log(metadata);",
        "",
        "const result = addStep(9);",
        "const record = stamp('batch');",
        "console.log(result);",
        "console.log(record);",
        "",
        "const list = [1, 2, 3, 4, 5, 6, 7, 8, 9];",
        "list.forEach((value) => {",
        "  console.log(value);",
        "});",
        "",
        "module.exports = { metadata, record, result };",
        "// end-of-file",
    ]

    while len(lines) < 25:
        s = rand_token(6)
        lines.append(f"const filler_{s} = '{s}';")
        lines.append(f"const stage_{s} = {len(lines) * 2};")
        lines.append(f"const note_{s} = 'custom-os-ready-{s}';")

    return "\n".join(lines) + "\n"


def main():
    parser = argparse.ArgumentParser(description="Generate 25 custom OS folders, each with 10,000 files.")
    parser.add_argument("--root", type=str, default=".")
    parser.add_argument("--files-per-folder", type=int, default=10000)
    parser.add_argument("--output-dir", type=str, default="generated_custom_os")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    base = root / args.output_dir
    base.mkdir(parents=True, exist_ok=True)

    total = 0
    for idx, os_name in enumerate(OS_NAMES, start=1):
        folder = base / f"os_{idx:02d}_{os_name}"
        folder.mkdir(parents=True, exist_ok=True)

        for n in range(1, args.files_per_folder + 1):
            total += 1
            ext = random.choice(FILE_EXTS)
            safe_name = f"{os_name}_{n:06d}_{rand_token(8)}{ext}"
            file_path = folder / safe_name
            file_path.write_text(build_lines(total, os_name), encoding="utf-8")

        print(f"Created {folder.name}: {args.files_per_folder} files")

    print(f"Done. Total files created: {total}")


if __name__ == "__main__":
    main()
