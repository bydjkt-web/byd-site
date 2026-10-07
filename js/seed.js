/*
  Data awal. Semua isi di sini hanya CONTOH/PLACEHOLDER dan bisa diubah dari panel admin.
  Harga dan spesifikasi sengaja dikosongkan: isi dari price list resmi dealer.
*/
window.DEFAULT_SETTINGS = {
  /* SEO & situs */
  siteName: 'Dayu BYD',
  metaTitle: 'Sales Consultant BYD Jakarta - Harga, Promo, Test Drive | Dayu BYD',
  metaDescription:
    'Konsultan penjualan BYD di Jakarta (TB Simatupang). Info harga, promo, simulasi kredit dan test drive mobil listrik BYD. Hubungi Dayu Ghassani lewat WhatsApp.',
  ogImage: '',
  accentColor: '#e5182d',
  gaId: '',
  gscVerify: '',

  /* Profil sales */
  salesName: 'Dayu Ghassani',
  salesTitle: 'Sales Consultant BYD',
  dealerName: 'BYD TB Simatupang',
  salesPhoto: '',
  whatsapp: '6285715555644',
  waText: 'Halo Kak Dayu, saya tertarik dengan mobil BYD. Boleh minta info harga dan promo terbaru?',
  instagram: 'belimobilbyd',
  facebookName: 'BYD TB Simatupang',
  facebookUrl: 'https://www.facebook.com/search/top?q=BYD%20TB%20Simatupang',
  email: 'bydjkt.co.id@gmail.com',
  address: 'BYD TB Simatupang, Jakarta Selatan',
  mapUrl: '',
  stats: [
    { label: 'Lokasi', value: 'TB Simatupang' },
    { label: 'Test Drive', value: 'Jadwal fleksibel' },
    { label: 'Simulasi Kredit', value: 'Gratis, tanpa ribet' }
  ],

  /* Hero */
  heroEyebrow: 'Sales Consultant BYD - Jakarta',
  heroTitle: 'Mobil listrik *BYD* modern, konsultasi mudah dan cepat.',
  heroText:
    'Cari info harga, promo, simulasi kredit dan jadwal test drive mobil listrik BYD. Langsung tanya saya, respon cepat lewat WhatsApp.',
  ctaPrimary: 'Tanya Harga & Promo',
  ctaSecondary: 'Lihat Semua Model',

  /* Judul section */
  modelTitle: 'Pilihan Model *BYD*',
  modelSub: 'Dari hatchback listrik kompak sampai SUV dan MPV keluarga, pilih yang paling cocok dengan kebutuhan Anda.',
  promoTitle: 'Promo *BYD* Terbaru',
  promoSub: 'Penawaran yang sedang berlaku. Tanyakan syarat dan ketentuannya ke saya.',
  deliveryTitle: 'Momen Serah Terima Unit',
  deliverySub: 'Kebahagiaan pelanggan saat menerima kunci BYD barunya.',
  whyTitle: 'Kenapa beli lewat saya?',
  benefits: [
    { icon: '💬', title: 'Respon cepat', text: 'Tanya lewat WhatsApp, saya jawab langsung tanpa berbelit.' },
    { icon: '💰', title: 'Simulasi kredit jelas', text: 'DP, tenor dan cicilan dihitung terbuka sebelum Anda memutuskan.' },
    { icon: '🚗', title: 'Test drive mudah', text: 'Atur jadwal sesuai waktu Anda di dealer.' },
    { icon: '🤝', title: 'Pendampingan sampai serah terima', text: 'Dari pilih model, pengajuan, sampai mobil sampai ke tangan Anda.' }
  ],
  testiTitle: 'Kata Pelanggan',
  testiSub: 'Cerita dari pelanggan yang sudah membeli BYD lewat saya.',
  artikelTitle: 'Artikel Terbaru',
  artikelSub: 'Tips, panduan dan kabar terbaru seputar mobil listrik BYD.',
  faqTitle: 'Pertanyaan yang sering ditanyakan',
  faq: [
    {
      q: 'Bagaimana cara test drive BYD?',
      a: 'Hubungi saya lewat WhatsApp, sebutkan model yang ingin dicoba dan waktu yang Anda inginkan. Saya bantu atur jadwalnya.'
    },
    {
      q: 'Apakah bisa simulasi kredit BYD?',
      a: 'Bisa. Kirim pilihan model, besar DP dan tenor yang diinginkan lewat WhatsApp, lalu saya kirimkan simulasi cicilannya.'
    },
    { q: 'Di mana lokasi dealer BYD?', a: 'Dealer kami berada di area TB Simatupang, Jakarta Selatan.' }
  ],
  ctaTitle: 'Siap konsultasi?',
  ctaText: 'Kirim pesan sekarang, saya bantu pilihkan model dan skema pembelian yang paling pas.',
  ctaButton: 'Chat WhatsApp Sekarang',

  /* Menu & footer */
  navItems: [
    { label: 'Beranda', url: 'index.html' },
    { label: 'Model', url: 'model.html' },
    { label: 'Promo', url: 'promo.html' },
    { label: 'Delivery', url: 'delivery.html' },
    { label: 'Testimoni', url: 'testimoni.html' },
    { label: 'Artikel', url: 'artikel.html' },
    { label: 'Kontak', url: 'kontak.html' }
  ],
  locations: [{ name: 'BYD TB Simatupang', address: 'TB Simatupang, Jakarta Selatan' }],
  otherSites: [],
  socials: [],
  footerNote:
    'Website ini dikelola oleh sales consultant BYD. Harga, promo dan spesifikasi dapat berubah sewaktu-waktu, silakan konfirmasi ke sales.',

  /* Popup */
  popupOn: false,
  popupTitle: 'Mau test drive BYD?',
  popupText: 'Konsultasi dan simulasi kredit. Hubungi saya sekarang, saya bantu pilihkan model dan skema yang paling pas.',
  popupImage: '',
  popupButton: 'Chat via WhatsApp'
};

window.SEED = {
  models: [
    { id: 'byd-atto-1', slug: 'byd-atto-1', name: 'BYD Atto 1', category: 'Hatchback Listrik', tagline: 'Hatchback listrik kompak yang lincah untuk pemakaian harian di kota.', desc: 'Lengkapi deskripsi, harga dan spesifikasi model ini dari panel admin.', price: '', image: '', gallery: [], variants: [], specs: [], features: [], brochureUrl: '', order: 1, published: true },
    { id: 'byd-dolphin', slug: 'byd-dolphin', name: 'BYD Dolphin', category: 'Hatchback Listrik', tagline: 'Hatchback listrik modern dengan kabin nyaman dan fitur lengkap.', desc: 'Lengkapi deskripsi, harga dan spesifikasi model ini dari panel admin.', price: '', image: '', gallery: [], variants: [], specs: [], features: [], brochureUrl: '', order: 2, published: true },
    { id: 'byd-atto-3', slug: 'byd-atto-3', name: 'BYD Atto 3', category: 'SUV Listrik', tagline: 'SUV listrik yang lega untuk keluarga dengan desain modern.', desc: 'Lengkapi deskripsi, harga dan spesifikasi model ini dari panel admin.', price: '', image: '', gallery: [], variants: [], specs: [], features: [], brochureUrl: '', order: 3, published: true },
    { id: 'byd-seal', slug: 'byd-seal', name: 'BYD Seal', category: 'Sedan Listrik', tagline: 'Sedan listrik berperforma tinggi dengan tampilan sporty.', desc: 'Lengkapi deskripsi, harga dan spesifikasi model ini dari panel admin.', price: '', image: '', gallery: [], variants: [], specs: [], features: [], brochureUrl: '', order: 4, published: true },
    { id: 'byd-sealion-7', slug: 'byd-sealion-7', name: 'BYD Sealion 7', category: 'SUV Listrik Premium', tagline: 'SUV listrik premium dengan kabin luas dan teknologi terkini.', desc: 'Lengkapi deskripsi, harga dan spesifikasi model ini dari panel admin.', price: '', image: '', gallery: [], variants: [], specs: [], features: [], brochureUrl: '', order: 5, published: true },
    { id: 'byd-m6', slug: 'byd-m6', name: 'BYD M6', category: 'MPV Listrik', tagline: 'MPV listrik untuk keluarga besar yang butuh ruang dan kenyamanan.', desc: 'Lengkapi deskripsi, harga dan spesifikasi model ini dari panel admin.', price: '', image: '', gallery: [], variants: [], specs: [], features: [], brochureUrl: '', order: 6, published: true }
  ],
  promos: [
    {
      id: 'konsultasi-test-drive',
      title: 'Konsultasi & Test Drive',
      model: 'Semua model BYD',
      image: '',
      body: 'Jadwalkan test drive dan minta simulasi kredit langsung ke saya.\n\nSyarat dan ketentuan berlaku. Ganti isi promo ini dari panel admin menu Promo.',
      validUntil: 'Berlaku sampai ada pemberitahuan',
      order: 1,
      published: true
    }
  ],
  deliveries: [],
  testimonials: [],
  articles: [
    {
      id: 'cara-test-drive-byd',
      slug: 'cara-test-drive-byd-di-jakarta',
      title: 'Cara Test Drive BYD di Jakarta',
      category: 'Tips Membeli',
      excerpt: 'Panduan singkat mengatur jadwal test drive BYD, apa yang perlu disiapkan, dan hal yang sebaiknya dicek saat mencoba mobil.',
      image: '',
      date: '2026-10-07',
      metaDescription: 'Panduan mengatur jadwal test drive BYD di Jakarta: persiapan, hal yang perlu dicek, dan cara booking lewat WhatsApp.',
      published: true,
      body:
        'Test drive adalah cara terbaik untuk memastikan sebuah mobil cocok dengan kebiasaan berkendara Anda. Berikut langkah singkatnya.\n\n## 1. Tentukan model yang ingin dicoba\n\nPilih satu atau dua model yang paling menarik. Kalau masih bingung, ceritakan kebutuhan Anda (jumlah penumpang, rute harian, anggaran) dan saya bantu menyempitkan pilihan.\n\n## 2. Booking jadwal lewat WhatsApp\n\nKirim pesan berisi nama, model yang diminati, dan waktu yang Anda inginkan. Saya akan konfirmasi ketersediaan unit.\n\n## 3. Siapkan dokumen\n\n- SIM A yang masih berlaku\n- Identitas diri (KTP)\n\n## 4. Hal yang sebaiknya dicek saat mencoba\n\n- Posisi duduk dan kenyamanan kursi\n- Visibilitas ke depan, samping dan belakang\n- Respons pedal dan akselerasi\n- Kenyamanan suspensi dan kabin\n- Fitur layar, konektivitas dan sistem keselamatan\n\n## 5. Tanyakan hal yang masih ragu\n\nSetelah test drive, tanyakan harga terbaru, promo yang berlaku, dan minta simulasi kredit sesuai DP dan tenor yang Anda inginkan.\n\nSiap mencoba? Hubungi saya lewat WhatsApp untuk atur jadwal.'
    },
    {
      id: 'tips-memilih-mobil-listrik-pertama',
      slug: 'tips-memilih-mobil-listrik-pertama',
      title: 'Tips Memilih Mobil Listrik Pertama',
      category: 'Panduan',
      excerpt: 'Pertimbangan penting sebelum membeli mobil listrik pertama: pemakaian harian, tempat mengisi daya, anggaran dan layanan purna jual.',
      image: '',
      date: '2026-10-06',
      metaDescription: 'Tips memilih mobil listrik pertama: kebutuhan harian, charging di rumah, anggaran, garansi dan layanan purna jual.',
      published: true,
      body:
        'Beralih ke mobil listrik terasa berbeda dari mobil konvensional. Beberapa hal ini layak dipertimbangkan sebelum memutuskan.\n\n## Kenali pola pemakaian harian\n\nHitung jarak tempuh Anda sehari-hari. Untuk pemakaian dalam kota, kebanyakan mobil listrik sudah lebih dari cukup. Untuk perjalanan jauh, rencanakan titik pengisian daya.\n\n## Siapkan tempat mengisi daya\n\nMengisi daya di rumah adalah cara paling praktis. Pastikan daya listrik rumah dan lokasi pemasangan charger sudah dicek.\n\n## Sesuaikan dengan anggaran\n\nBandingkan harga unit, biaya perawatan, dan biaya energi. Tanyakan simulasi kredit untuk melihat cicilan yang nyaman.\n\n## Cek garansi dan layanan purna jual\n\nTanyakan cakupan garansi baterai dan komponen utama, serta lokasi bengkel resmi terdekat.\n\n## Coba langsung\n\nTidak ada pengganti test drive. Rasakan sendiri akselerasi, kenyamanan dan fiturnya.\n\nButuh bantuan memilih? Chat saya lewat WhatsApp, saya bantu sesuaikan dengan kebutuhan Anda.'
    },
    {
      id: 'cara-menghitung-simulasi-kredit-mobil',
      slug: 'cara-menghitung-simulasi-kredit-mobil',
      title: 'Cara Menghitung Simulasi Kredit Mobil',
      category: 'Panduan',
      excerpt: 'Memahami komponen cicilan mobil: uang muka, tenor, bunga, asuransi dan biaya lain, supaya Anda bisa memilih skema yang nyaman.',
      image: '',
      date: '2026-10-05',
      metaDescription: 'Panduan memahami simulasi kredit mobil: DP, tenor, bunga, asuransi dan biaya lain sebelum mengajukan pembelian.',
      published: true,
      body:
        'Sebelum mengajukan kredit mobil, pahami dulu komponen yang memengaruhi besar cicilan.\n\n## Komponen utama\n\n- **Uang muka (DP):** semakin besar DP, semakin kecil pokok pinjaman.\n- **Tenor:** semakin panjang tenor, semakin kecil cicilan bulanan namun total bunga lebih besar.\n- **Bunga:** ditentukan oleh perusahaan pembiayaan dan dapat berbeda tiap skema.\n- **Asuransi:** biasanya termasuk dalam pembiayaan, tanyakan jenis perlindungannya.\n- **Biaya lain:** administrasi, provisi dan biaya terkait lainnya.\n\n## Tips memilih skema\n\n- Pastikan cicilan bulanan masih nyaman terhadap penghasilan Anda\n- Bandingkan beberapa pilihan DP dan tenor\n- Tanyakan total pembayaran, bukan hanya cicilan per bulan\n\n## Minta simulasi\n\nKirim model yang diminati, DP dan tenor yang Anda inginkan lewat WhatsApp. Saya hitungkan simulasinya, tanpa kewajiban membeli.'
    }
  ]
};
