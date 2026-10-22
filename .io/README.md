# Konfigurasi storage `.io`

Folder ini berisi 20 konfigurasi shard untuk kategori ilmu pengetahuan. Setiap konfigurasi meneruskan operasi ke mesin `.nz` di `nz/storage/`, dengan root default `datanz/objects` (dapat diganti memakai `NZ_STORAGE_ROOT`). Data ditulis hanya saat perintah `put` dijalankan; `info`, `status`, `check`, `estimate`, dan `list` tersedia untuk pemeriksaan.

Contoh dari root repo:

```sh
sh .io/konfigurasi-biologi.nz info
sh .io/konfigurasi-biologi.nz estimate 1048576
NZ_STORAGE_ROOT=/mnt/data-nz sh .io/konfigurasi-biologi.nz put ./artikel.nz biologi/artikel.nz
```

Kapasitas tidak unlimited: setiap operasi dibatasi disk/backend yang benar-benar terpasang. Skrip berjalan di shell POSIX; GitHub Pages hanya menyajikan berkas statis dan tidak mengeksekusinya.
