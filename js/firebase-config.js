/*
  KONFIGURASI FIREBASE
  --------------------
  Selama nilai di bawah masih "ISI_...", website berjalan dalam MODE DEMO:
  data contoh tampil, dan perubahan dari admin hanya tersimpan di browser ini.

  Setelah project Firebase dibuat (lihat PANDUAN-SETUP.md), ganti seluruh isi
  objek di bawah dengan config dari:
  Firebase Console > Project settings > Your apps > Web app > SDK setup (Config).
  Config ini aman ditaruh di sisi publik; keamanan data diatur oleh firestore.rules.
*/
window.FIREBASE_CONFIG = {
  apiKey: 'ISI_API_KEY',
  authDomain: 'ISI_PROJECT_ID.firebaseapp.com',
  projectId: 'ISI_PROJECT_ID',
  storageBucket: '',
  messagingSenderId: '',
  appId: 'ISI_APP_ID'
};
