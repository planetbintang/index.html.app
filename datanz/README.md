# DATA NZ

`datanz/` adalah lapisan data statis untuk GitHub Pages. `manifest.jsonl.gz` berisi daftar path pada commit sumber. Panel `index.html` menyediakan pencarian, fetch manifest, serta CRUD lokal melalui `localStorage`.

GitHub Pages tidak menjalankan PHP, MySQL, atau Twig. Karena itu, `schema.sql`, `shell.sh`, `template.twig`, dan `style.scss` disediakan sebagai kontrak dan template untuk backend PHP/MySQL eksternal. Data yang benar-benar berubah di GitHub harus diperbarui melalui commit atau GitHub API berizin.
