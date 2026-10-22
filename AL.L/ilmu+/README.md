# Ilmu+

Folder ini menetapkan spesifikasi target sistem ilmu pengetahuan: 10.000.000 file `.nz` di 10.000 folder. Spesifikasi yang diwarisi dari permintaan sebelumnya menargetkan sekurang-kurangnya 100 poin per file dan kira-kira 100 baris per poin.

**Status saat ini: rencana saja.** Belum ada 10.000.000 file pengetahuan atau konten media yang dibuat di sini. `sistem-data-utama.nz` dan `rencana-manifest.json` adalah berkas spesifikasi/metadata, bukan dataset.

Namespace penyimpanan yang direncanakan adalah `datanz/datanz+/objects`. Folder itu tidak menambah inode atau kapasitas; penulisan baru tetap memerlukan object-storage/backend nyata dengan kuota terukur. Untuk situs, gunakan manifest bertahap dan pemuatan sesuai permintaan—GitHub Pages tidak menjalankan skrip shell atau menyediakan API tulis.
