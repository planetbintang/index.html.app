# Format file `.nz` yang dibaca AL.L

AL.L memakai filesystem virtual **baca-saja** di browser. File diambil melalui HTTP GET dari repository statis; GitHub Pages tidak menyediakan operasi tulis. Path absolut, URL eksternal, dan segmen `..` ditolak.

## Format lama: pointer

Berkas pointer adalah teks UTF-8 dengan metadata `key=value`:

```text
# Pointer mesin nz
corpus=nz/korpus-ilmu-pengetahuan-10000.nz
rentang_poin=1-10
jumlah_poin=10000
format=gzip+utf8
```

`corpus` harus path relatif di repository. `rentang_poin` inklusif; pembaca memvalidasi batas, jumlah baris, dan nomor setiap baris sebelum menampilkan. Korpus lama dapat berupa gzip UTF-8, satu baris `Poin N: ...` per rekaman. Baris lama tidak otomatis memiliki judul terpisah atau sitasi.

## Format artikel terstruktur untuk konten baru

Gunakan UTF-8 teks biasa. Satu bagian `Poin` memiliki judul khusus dan paragraf isi. Cantumkan sumber pada tingkat artikel atau poin; jangan memberi status editorial terverifikasi tanpa penelaahan sumber yang nyata.

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

Pembaca mempertahankan isi berkas, menampilkan judul/isi/sumber yang ada, dan menghitung elemen yang hilang. Parser tidak melakukan fact-check otomatis. Rekaman lama tidak diberi judul atau sitasi sintetis dan ditandai belum terverifikasi.
