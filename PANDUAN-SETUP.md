# Panduan Setup Website BYD Dayu

Website ini statis (HTML/CSS/JS) sehingga bisa di-hosting gratis di GitHub Pages. Data (katalog, artikel, profil, dll) disimpan di Firebase Firestore dan diedit lewat panel admin di `/admin/`.

Selama Firebase belum diisi, website berjalan di **mode demo**: data contoh tampil dan perubahan admin hanya tersimpan di browser Anda sendiri. Jadi Anda bisa mencoba semuanya dulu.

---

## Langkah 0: Coba dulu di komputer (opsional)

1. Ekstrak zip, buka terminal di folder `byd-site`.
2. Jalankan: `python3 -m http.server 8080`
3. Buka `http://localhost:8080` (situs) dan `http://localhost:8080/admin/` (admin, mode demo tanpa login).

## Langkah 1: Buat project Firebase

1. Buka https://console.firebase.google.com lalu klik **Add project**. Beri nama (mis. `byd-dayu`). Google Analytics boleh dimatikan.
2. Di halaman project, klik ikon **Web (`</>`)**, beri nama aplikasi, **tanpa** Firebase Hosting. Salin objek `firebaseConfig` yang muncul.
3. Buka file `js/firebase-config.js`, ganti isi `window.FIREBASE_CONFIG` dengan nilai tersebut (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId).

## Langkah 2: Aktifkan database

1. Menu **Build > Firestore Database > Create database**.
2. Pilih lokasi `asia-southeast2 (Jakarta)`, mode **Production**.

## Langkah 3: Aktifkan login admin

1. Menu **Build > Authentication > Get started > Sign-in method > Email/Password > Enable**.
2. Tab **Users > Add user**: isi email dan password admin (mis. `bydjkt.co.id@gmail.com` dan password yang kuat).
3. Setelah user dibuat, salin nilai **User UID** (kolom paling kanan).

## Langkah 4: Pasang aturan keamanan (WAJIB)

1. Buka `firestore.rules`, ganti `GANTI_DENGAN_UID_ADMIN` dengan UID dari langkah 3.
2. Firestore Database > tab **Rules** > tempel seluruh isi file > **Publish**.

Aturan ini membuat semua orang bisa membaca website, tetapi hanya akun admin tersebut yang bisa mengubah data. Jangan dilewati.

## Langkah 5: Upload ke GitHub dan aktifkan GitHub Pages

1. Buat repository baru di GitHub (mis. `byd-dayu`), publik.
2. Upload seluruh isi folder `byd-site` (termasuk `.nojekyll` dan folder `.github`). Pastikan `index.html` ada di root repository.
3. Repository > **Settings > Pages > Build and deployment**: Source = **Deploy from a branch**, Branch = `main`, folder = `/ (root)`. Simpan.
4. Tunggu 1 sampai 3 menit. Alamat situs: `https://USERNAME.github.io/NAMA-REPO/`.
5. Firebase Console > **Authentication > Settings > Authorized domains > Add domain**: tambahkan `USERNAME.github.io` (dan nanti domain asli Anda). Tanpa ini login admin ditolak.

## Langkah 5b: Update situs lewat upload ZIP (otomatis diekstrak di GitHub)

Setelah repository berisi folder `.github`, Anda tidak perlu upload file satu per satu lagi. Cukup upload satu file zip:

1. Buka folder **`upload`** di repository GitHub, klik **Add file > Upload files**, pilih file `.zip` (huruf kecil `.zip`, maksimal 25 MB lewat browser), lalu **Commit changes**.
2. Buka tab **Actions**: workflow **Extract ZIP upload** berjalan sendiri sekitar 20 detik. Centang hijau berarti berhasil.
3. Isi zip otomatis muncul di root repository, file zip-nya terhapus, dan GitHub Pages memperbarui situs dalam 1 sampai 3 menit.

Aturan yang perlu diketahui:
- Zip boleh berisi file langsung atau dibungkus satu folder (pembungkusnya dibuang otomatis).
- File dengan nama sama akan **ditimpa**; file lain tetap.
- File yang terdaftar di `.extract-ignore` **tidak akan ditimpa** (bawaan: `js/firebase-config.js`, `firestore.rules`, `CNAME`, `robots.txt`, `sitemap.xml`). Jadi upload zip versi baru tidak menghapus konfigurasi Firebase dan domain Anda. Tambahkan nama file lain ke daftar itu jika perlu.
- Folder `.github`, `.git` dan `upload` tidak pernah ditimpa oleh zip.
- Jika workflow gagal dengan "permission denied": **Settings > Actions > General > Workflow permissions > Read and write permissions > Save**, lalu jalankan ulang dari tab Actions.

Upload pertama kali: karena workflow harus sudah ada di repository, upload dulu isi folder `byd-site` secara biasa (drag and drop folder, pastikan `.github` ikut). Jika folder `.github` tidak ikut terupload, buat manual: **Add file > Create new file**, ketik nama `.github/workflows/extract-zip.yml`, lalu tempel isi file tersebut dari zip.

## Langkah 6: Login admin dan isi konten

1. Buka `https://.../admin/`, login dengan email dan password dari langkah 3.
2. Saat pertama login, muncul pertanyaan "Database masih kosong, isi dengan data contoh?" Klik **OK**.
3. Menu yang bisa diedit:
   - **Profil Sales**: foto profil (tampil paling atas di beranda), nama, jabatan, dealer, WhatsApp, Instagram, Facebook, email, alamat, info singkat.
   - **Beranda (Hero)**, **Teks & Section**: semua judul, paragraf, keunggulan, FAQ, ajakan.
   - **Menu & Footer**: menu navigasi, lokasi dealer, media sosial tambahan, website lain, catatan footer.
   - **Popup**, **SEO & Tampilan**: popup, judul/deskripsi SEO, warna aksen, Google Analytics.
   - **Model**, **Promo**, **Delivery**, **Testimoni**, **Artikel**: tambah, ubah, hapus, atur urutan, tandai draft atau tayang.
4. Lengkapi **harga dan spesifikasi** tiap model dari price list resmi dealer. Data contoh sengaja tidak berisi harga.

## Nanti: domain sendiri

1. Beli domain, lalu di GitHub Pages isi **Custom domain** dan atur DNS sesuai petunjuk GitHub (aktifkan Enforce HTTPS).
2. Tambahkan domain itu ke Firebase **Authorized domains**.
3. Ganti `GANTI-DOMAIN.com` di `robots.txt`, lalu buat sitemap: `node tools/build-sitemap.js https://domain-anda.com` (Node 18+), commit hasilnya. Ulangi setiap menambah model atau artikel baru.

## SEO dan trafik

- Daftarkan situs di **Google Search Console**, isi kode verifikasinya di admin (SEO & Tampilan), lalu kirim `sitemap.xml`.
- Pasang **Google Analytics** (isi ID `G-XXXX` di admin) untuk memantau trafik.
- Tiap artikel punya judul, deskripsi, dan data terstruktur sendiri. Tulis artikel rutin (test drive, simulasi kredit, perbandingan model) dan isi **Deskripsi SEO** 140 sampai 160 karakter.
- Bagikan link situs di bio Instagram (@belimobilbyd) dan Facebook agar lead masuk lewat WhatsApp.
- Catatan teknis: konten dimuat lewat JavaScript. Google bisa membacanya, namun pratinjau saat link dibagikan di WhatsApp/Facebook memakai tag bawaan halaman (bukan per artikel). Isi **Gambar share (URL https://)** di admin untuk gambar pratinjau beranda.

## Batasan yang perlu diketahui

- Foto yang di-upload diperkecil otomatis lalu disimpan langsung di Firestore. Satu dokumen dibatasi sekitar 1 MB, jadi untuk galeri model yang banyak foto, gunakan link gambar (`https://...`) atau kurangi jumlah foto. Admin akan memberi peringatan jika terlalu besar.
- Paket gratis Firebase punya batas harian baca/tulis. Cukup untuk trafik kecil sampai menengah; pantau di Firebase Console > Usage.
- Backup rutin: admin > **Backup & Info > Unduh backup**.
