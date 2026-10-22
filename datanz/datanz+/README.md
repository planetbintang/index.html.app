# `datanz/datanz+` — namespace konfigurasi lokal

Folder ini berisi 20 konfigurasi `.nz` yang meneruskan operasi ke `.io/` dan `nz/storage/`. Root default objeknya adalah `datanz/datanz+/objects`; dapat diganti dengan `NZ_STORAGE_ROOT` untuk memakai mount/backend nyata.

Ini hanya namespace logis, **bukan** penambahan kapasitas atau inode. Setiap penulisan tetap dibatasi disk/backend aktual. Uji dan listing dapat dijalankan dengan shell POSIX; GitHub Pages tidak mengeksekusi skrip dan konten yang di-commit ke repo publik dapat diakses publik.

Contoh:

```sh
sh 'datanz/datanz+/konfigurasi-biologi.nz' info
NZ_STORAGE_ROOT=/mnt/data-nz sh 'datanz/datanz+/konfigurasi-biologi.nz' put ./artikel.nz referensi/artikel.nz
```
