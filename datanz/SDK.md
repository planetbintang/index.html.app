# DataNZ SDK bergaya Supabase

Gunakan `createClient()` untuk antarmuka `from(table).select/insert/update/delete`, `auth.signUp`, `auth.signInWithPassword`, `auth.getSession`, antrean sinkronisasi, export data, dan monitoring lokal. `engine.js` menyediakan pembacaan manifest gzip serta filter rentang.

## Batas keamanan

Implementasi ini adalah lapisan kompatibilitas untuk situs statis. Akun dan CRUD disimpan di browser pengguna, bukan database pusat. Hash kata sandi hanya mencegah teks biasa tersimpan, tetapi tidak menggantikan provider auth. Untuk produksi, arahkan `url` ke API backend HTTPS dengan database dan validasi server. Jangan simpan rahasia backend di JavaScript publik.
