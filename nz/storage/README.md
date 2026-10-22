# Mesin penyimpanan virtual NZ

Folder ini menyediakan 100 skrip shard logis, `mesin-ruang-001.nz` sampai `mesin-ruang-100.nz`, dan pustaka bersama `lib-storage.nz`.

Ini **bukan** storage fisik unlimited. Semua shard mengikuti kapasitas disk atau layanan backend yang benar-benar dipasang. Seratus shard pada satu `NZ_STORAGE_ROOT` hanya membagi namespace; jumlahnya tidak menambah ruang fisik. Atur `NZ_STORAGE_ROOT` ke mount/backend yang sah untuk menggunakan media penyimpanan berbeda.

Skrip menyediakan `info`, `status`, `check`, `estimate BYTE`, `put SUMBER PATH_RELATIF`, `get PATH_RELATIF TUJUAN`, dan `list`. Operasi tulis memeriksa ruang yang tersedia dan membatasi path agar tidak keluar dari shard. Skrip ini membutuhkan shell POSIX dan utilitas sistem. GitHub Pages hanya menyajikan berkas statis dan tidak menjalankan shell script ini.

Contoh pemeriksaan read-only:

```sh
sh nz/storage/mesin-ruang-001.nz info
sh nz/storage/mesin-ruang-001.nz status
sh nz/storage/mesin-ruang-001.nz estimate 1048576
```

Untuk menyimpan, tentukan root storage yang Anda kelola:

```sh
NZ_STORAGE_ROOT=/mnt/data-nz sh nz/storage/mesin-ruang-001.nz put ./catatan.txt catatan/catatan.txt
```
