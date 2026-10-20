# Custom OS Suite Generator

This repository includes a generator for custom OS-named folders instead of using standard OS names from the world.

Run:

```bash
python generate_os_25.py --root . --files-per-folder 10000 --output-dir generated_custom_os
```

What it creates:
- 25 custom OS folders
- each folder contains 10,000 files
- total output: 250,000 files
- each file contains at least 25 lines of code-like content

Example folder names:
- os_01_nova
- os_02_aether
- os_03_cinder
- os_04_vanta
- os_05_orbit
- os_06_sylva
- os_07_echo
- os_08_quartz
- os_09_atlas
- os_10_mira
- os_11_zenith
- os_12_luma
- os_13_solis
- os_14_prism
- os_15_kairo
- os_16_lyra
- os_17_nexus
- os_18_vapor
- os_19_riven
- os_20_aurora
- os_21_glint
- os_22_ember
- os_23_cobalt
- os_24_pixel
- os_25_flux

Important:
- This is designed for local generation and archive workflows.
- It is safer than pushing 250,000 small files directly to a GitHub repo.
- The output directory is kept separate from the main app root to reduce repository bloat.

