# Format file `.nz` yang dibaca AL.L

AL.L memakai filesystem virtual **baca-saja** di browser. File dibaca melalui HTTP dari repository statis; GitHub Pages tidak menyediakan operasi tulis. Path absolut, URL eksternal, segmen `..`, dan file korpus lama ditolak reader.

## Katalog dan sumber data

`datanz/nz-catalog.txt.gz` memuat path relatif file `.nz` yang terlacak Git. Beranda mencari nama/path, lalu membaca isi file yang dipilih. Jumlah path bukan jumlah judul unik atau judul ilmu pengetahuan yang terverifikasi. Korpus lama `nz/korpus-ilmu-pengetahuan-10000.nz` telah dihapus; pointer historis yang masih mencantumkannya hanya ditampilkan sebagai metadata dan tidak diikuti.

Setelah menambahkan file `.nz`, jalankan `python3 datanz/build_nz_catalog.py`, commit katalog beserta file sumbernya, lalu push ke branch Pages. Manifest `datanz/manifest.jsonl.gz` adalah indeks backup; perbarui manifest setelah commit kode atau konten.

## Format satu baris per poin: `NZ-POINTS/1`

Format ini ditujukan untuk artikel ilmu pengetahuan dengan **10.000 baris data, satu record JSON per poin**. Tidak ada baris header terpisah. Setiap baris wajib berisi format, nomor berurutan, bidang ilmu, judul, isi, dan sumber. Sumber dapat berupa URL, DOI, atau rujukan bibliografi yang dapat ditelusuri. String isi yang memiliki pergantian paragraf harus meng-escape newline sebagai `\n` di dalam JSON agar record tetap satu baris fisik.

Cuplikan berikut hanya contoh bentuk dua record; file lengkap harus memiliki tepat 10.000 record bernomor 1 sampai 10.000, bukan hanya dua:

```jsonl
{"format":"NZ-POINTS/1","nomor":1,"bidang":"Biologi","judul":"Judul poin pertama","isi":"Klaim yang spesifik beserta konteks dan batas berlakunya.","sumber":["https://contoh.org/rujukan-1"]}
{"format":"NZ-POINTS/1","nomor":2,"bidang":"Biologi","judul":"Judul poin kedua","isi":"Uraian yang dapat ditelusuri dan tidak mengulang poin pertama.","sumber":["https://contoh.org/rujukan-2"]}
```

Reader memeriksa JSON, urutan nomor, keberadaan bidang/judul/isi/sumber, dan apakah jumlah record tepat 10.000. Bila jumlahnya berbeda, reader melaporkan file belum memenuhi target jumlah; record tidak ditambah otomatis. Pemeriksaan format **bukan** verifikasi kebenaran ilmiah. Penulis tetap harus menilai sumber, bukti, konteks, tanggal, dan batas klaim.

## Format artikel lama: `NZ-ARTICLE/1`

Format teks lama juga dapat dibaca. Setiap bagian `Poin` memiliki judul, paragraf isi, dan sumber opsional. Berbeda dari `NZ-POINTS/1`, bagian ini tidak menetapkan jumlah 10.000 dan tidak menjamin satu poin satu baris.

```text
# NZ-ARTICLE/1
id=contoh-id
category=Fisika
title=Judul artikel yang spesifik
abstract=Ringkasan singkat dengan batas cakupan yang jelas.
status=draft
source=https://contoh.org/sumber-utama

## Poin 001 | Judul poin yang menyatakan gagasan khusus
Paragraf pertama menjelaskan klaim secara terbatas dan bisa ditelusuri.

Paragraf kedua memberi konteks, batasan, atau pengecualian.
source=https://contoh.org/sumber-poin
```

## Pointer dan integritas

File pointer/metadata bukan artikel dan tidak boleh diubah menjadi bacaan dengan menebak judul atau isi. Baris lama seperti `Poin 12: ...` tanpa judul terpisah tidak dianggap sebagai poin artikel yang lengkap. Reader menyaring poin tanpa judul atau isi dari kartu bacaan. Jangan memberi label “terverifikasi” tanpa penelaahan sumber nyata.

Audit repository saat spesifikasi ini diperbarui menemukan **0** file `.nz` dalam format artikel terstruktur dan **0** file dengan baris poin lama `Poin N:`. Karena itu tidak ada kumpulan poin ilmu yang dapat dikonversi menjadi 10.000 record bersumber per file. File target 10.000 poin tetap berstatus rencana sampai konten dan rujukannya benar-benar ditulis serta diperiksa.
