# Repository Overview

Repositori ini berisi 6 file modul dari 2 sistem yang dibangun secara terstruktur.

## Struktur
- setiap sistem mempunyai `README.md` dan `todo.md`
- setiap sistem mempunyai folder `src/`
- file modul mengikuti pola: `<domain>_<role>_<system>_<module>.py`

## Cara generate
```bash
python generate_satu_sesi.py --root . --systems 25 --files-per-system 10 --output-dir generated_repo
```
