# OS Suite Generator

This repo now includes a generator that creates 25 OS-named folders and populates each with 10,000 files, totaling 250,000 files.

Run:

```bash
python generate_os_25.py --root . --files-per-folder 10000
```

What it does:
- creates folders such as `os_01_linux`, `os_02_windows`, ... `os_25_bsd`
- creates mixed file extensions such as `.exe`, `.dll`, `.so`, `.sh`, `.py`, `.json`, `.log`, etc.
- writes a minimum of 25 lines of code-like content to each file
- keeps the total scale at 250,000 files without putting everything in the repo root

Important:
- This is a local generation utility and is safer than pushing a 250,000-file mass commit directly to GitHub.
- It is best used in a generated/temporary folder or archived output.

