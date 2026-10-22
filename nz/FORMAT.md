# Format file `.nz` yang dibaca AL.L

AL.L memakai filesystem virtual **baca-saja** di browser. File dibaca melalui HTTP dari repository statis; GitHub Pages tidak menyediakan operasi tulis. Path absolut, URL eksternal, segmen `..`, dan file korpus lama ditolak oleh reader.

## Katalog file

`datanz/nz-catalog.txt.gz` adalah daftar path relatif untuk file `.nz` yang terlacak Git. Beranda mencari **nama/path**, lalu mengambil isi file `.nz` hanya ketika pembaca membukanya. Jumlah path adalah jumlah file, bukan jumlah judul unik atau judul ilmiah terverifikasi. Sasaran `100.000.000+` pada beranda adalah target pengembangan, bukan jumlah yang sudah tercapai.

Saat menambahkan file `.nz`, stage file tersebut lalu jalankan:

```sh
python3 datanz/build_nz_catalog.py
```

Generator memperbarui katalog dan `datanz/nz-catalog-summary.json`. File korpus historis `nz/korpus-ilmu-pengetahuan-10000.nz` telah dihapus dari repository. Sejumlah pointer `.nz` lama masih menyebut path tersebut di metadata; reader menampilkan pointer sebagai metadata saja dan tidak mengikuti atau mengambil target itu.

## Format lama: pointer

Pointer adalah teks UTF-8 dengan metadata `key=value`, misalnya:

```text
# Pointer mesin nz
corpus=nz/korpus-ilmu-pengetahuan-10000.nz
rentang_poin=1-10
jumlah_poin=10000
format=gzip+utf8
```

Beranda hanya menampilkan isi pointer sebagai metadata. Reader **tidak mengikuti** nilai `corpus`, sehingga data target tidak tersaji seolah-olah berasal dari file pointer itu sendiri.

## Format artikel terstruktur untuk konten baru

Gunakan UTF-8 teks biasa. Setiap bagian `Poin` sebaiknya mempunyai judul khusus, paragraf isi, dan sumber yang bisa ditelusuri. Jangan memberi status editorial terverifikasi tanpa penelaahan sumber yang nyata.

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

Reader mempertahankan isi yang tersimpan, menampilkan judul/isi/sumber yang ada, dan menghitung elemen yang hilang. Parser tidak melakukan fact-check otomatis. Nama file tidak dianggap sebagai judul editorial, dan rekaman lama tidak diberi judul atau sitasi sintetis.
