/*
  Skema field untuk panel admin. Tipe field:
  text, url, number, date, textarea, md (teks dengan format), image, select, bool, color, lines (satu baris = satu item), list (daftar berulang)
*/
window.SCHEMA = {
  settingsGroups: [
    {
      id: 'profil',
      label: 'Profil Sales',
      fields: [
        { k: 'salesPhoto', t: 'image', l: 'Foto profil sales (tampil paling atas)', max: 600, h: 'Foto persegi/portrait, wajah di tengah. Otomatis diperkecil.' },
        { k: 'salesName', t: 'text', l: 'Nama sales' },
        { k: 'salesTitle', t: 'text', l: 'Jabatan' },
        { k: 'dealerName', t: 'text', l: 'Nama dealer / cabang' },
        { k: 'whatsapp', t: 'text', l: 'Nomor WhatsApp', h: 'Boleh ditulis 0857..., 857... atau 62857...; otomatis diubah.' },
        { k: 'waText', t: 'textarea', l: 'Pesan WhatsApp default', h: 'Teks yang otomatis terisi saat pengunjung klik tombol WhatsApp.' },
        { k: 'instagram', t: 'text', l: 'Instagram (username)', h: 'Contoh: belimobilbyd (tanpa @)' },
        { k: 'facebookName', t: 'text', l: 'Nama Facebook' },
        { k: 'facebookUrl', t: 'url', l: 'Link Facebook', h: 'Tempel link halaman/profil Facebook.' },
        { k: 'email', t: 'text', l: 'Email' },
        { k: 'address', t: 'textarea', l: 'Alamat dealer' },
        { k: 'mapUrl', t: 'url', l: 'Link Google Maps (opsional)' },
        {
          k: 'stats', t: 'list', l: 'Info singkat di bawah hero', item: 'Info',
          f: [{ k: 'label', t: 'text', l: 'Label' }, { k: 'value', t: 'text', l: 'Isi' }]
        }
      ]
    },
    {
      id: 'hero',
      label: 'Beranda (Hero)',
      fields: [
        { k: 'heroEyebrow', t: 'text', l: 'Teks kecil di atas judul' },
        { k: 'heroTitle', t: 'text', l: 'Judul utama', h: 'Bungkus kata dengan *tanda bintang* agar berwarna aksen.' },
        { k: 'heroText', t: 'textarea', l: 'Paragraf pembuka' },
        { k: 'ctaPrimary', t: 'text', l: 'Tombol utama (WhatsApp)' },
        { k: 'ctaSecondary', t: 'text', l: 'Tombol kedua (ke halaman Model)' }
      ]
    },
    {
      id: 'teks',
      label: 'Teks & Section',
      fields: [
        { k: 'modelTitle', t: 'text', l: 'Judul section Model', h: 'Pakai *kata* untuk warna aksen.' },
        { k: 'modelSub', t: 'textarea', l: 'Deskripsi section Model' },
        { k: 'promoTitle', t: 'text', l: 'Judul section Promo' },
        { k: 'promoSub', t: 'textarea', l: 'Deskripsi section Promo' },
        { k: 'deliveryTitle', t: 'text', l: 'Judul section Delivery' },
        { k: 'deliverySub', t: 'textarea', l: 'Deskripsi section Delivery' },
        { k: 'whyTitle', t: 'text', l: 'Judul "Kenapa beli lewat saya"' },
        {
          k: 'benefits', t: 'list', l: 'Keunggulan', item: 'Keunggulan',
          f: [
            { k: 'icon', t: 'text', l: 'Ikon (emoji)' },
            { k: 'title', t: 'text', l: 'Judul' },
            { k: 'text', t: 'textarea', l: 'Penjelasan' }
          ]
        },
        { k: 'testiTitle', t: 'text', l: 'Judul section Testimoni' },
        { k: 'testiSub', t: 'textarea', l: 'Deskripsi section Testimoni' },
        { k: 'artikelTitle', t: 'text', l: 'Judul section Artikel' },
        { k: 'artikelSub', t: 'textarea', l: 'Deskripsi section Artikel' },
        { k: 'faqTitle', t: 'text', l: 'Judul section FAQ' },
        {
          k: 'faq', t: 'list', l: 'Daftar FAQ', item: 'Pertanyaan',
          f: [{ k: 'q', t: 'text', l: 'Pertanyaan' }, { k: 'a', t: 'textarea', l: 'Jawaban' }]
        },
        { k: 'ctaTitle', t: 'text', l: 'Judul ajakan di bagian bawah' },
        { k: 'ctaText', t: 'textarea', l: 'Teks ajakan' },
        { k: 'ctaButton', t: 'text', l: 'Tulisan tombol ajakan' }
      ]
    },
    {
      id: 'menu',
      label: 'Menu & Footer',
      fields: [
        {
          k: 'navItems', t: 'list', l: 'Menu navigasi', item: 'Menu',
          f: [
            { k: 'label', t: 'text', l: 'Tulisan menu' },
            { k: 'url', t: 'text', l: 'Tujuan (mis. model.html atau https://...)' }
          ]
        },
        {
          k: 'locations', t: 'list', l: 'Lokasi dealer (footer)', item: 'Lokasi',
          f: [{ k: 'name', t: 'text', l: 'Nama lokasi' }, { k: 'address', t: 'textarea', l: 'Alamat' }]
        },
        {
          k: 'socials', t: 'list', l: 'Media sosial tambahan', item: 'Link',
          f: [{ k: 'label', t: 'text', l: 'Nama (mis. TikTok)' }, { k: 'url', t: 'url', l: 'Link' }]
        },
        {
          k: 'otherSites', t: 'list', l: 'Website lain (footer)', item: 'Website',
          f: [{ k: 'label', t: 'text', l: 'Nama' }, { k: 'url', t: 'url', l: 'Link' }]
        },
        { k: 'footerNote', t: 'textarea', l: 'Catatan footer / disclaimer' }
      ]
    },
    {
      id: 'popup',
      label: 'Popup',
      fields: [
        { k: 'popupOn', t: 'bool', l: 'Tampilkan popup di beranda' },
        { k: 'popupTitle', t: 'text', l: 'Judul popup' },
        { k: 'popupText', t: 'textarea', l: 'Isi popup' },
        { k: 'popupImage', t: 'image', l: 'Gambar popup (opsional)', max: 900 },
        { k: 'popupButton', t: 'text', l: 'Tulisan tombol popup' }
      ]
    },
    {
      id: 'seo',
      label: 'SEO & Tampilan',
      fields: [
        { k: 'siteName', t: 'text', l: 'Nama situs' },
        { k: 'metaTitle', t: 'text', l: 'Judul SEO beranda', h: 'Ideal sekitar 50 sampai 60 karakter.' },
        { k: 'metaDescription', t: 'textarea', l: 'Deskripsi SEO beranda', h: 'Ideal sekitar 140 sampai 160 karakter.' },
        { k: 'ogImage', t: 'url', l: 'Gambar share (URL https://)', h: 'Gambar yang muncul saat link dibagikan. Harus link gambar online, bukan upload.' },
        { k: 'accentColor', t: 'color', l: 'Warna aksen' },
        { k: 'gaId', t: 'text', l: 'Google Analytics ID (opsional)', h: 'Format G-XXXXXXXXXX. Untuk memantau trafik.' },
        { k: 'gscVerify', t: 'text', l: 'Kode verifikasi Google Search Console (opsional)', h: 'Isi bagian content="..." dari meta tag verifikasi.' }
      ]
    }
  ],

  collections: {
    models: {
      label: 'Model', single: 'Model', title: 'name', sub: 'category', thumb: 'image',
      fields: [
        { k: 'name', t: 'text', l: 'Nama model', req: true },
        { k: 'slug', t: 'text', l: 'Slug URL', h: 'Kosongkan agar otomatis dari nama.' },
        { k: 'category', t: 'text', l: 'Kategori', h: 'Contoh: SUV Listrik, Sedan Listrik' },
        { k: 'tagline', t: 'text', l: 'Kalimat singkat' },
        { k: 'price', t: 'text', l: 'Harga (teks bebas)', h: 'Contoh: Mulai Rp xxx juta. Kosongkan jika ingin tampil "Tanya harga".' },
        { k: 'image', t: 'image', l: 'Foto utama', max: 1000 },
        { k: 'gallery', t: 'list', l: 'Galeri foto tambahan', item: 'Foto', f: [{ k: 'image', t: 'image', l: 'Foto', max: 900 }] },
        { k: 'desc', t: 'md', l: 'Deskripsi' },
        { k: 'features', t: 'lines', l: 'Fitur unggulan', h: 'Satu fitur per baris.' },
        { k: 'variants', t: 'list', l: 'Varian & harga', item: 'Varian', f: [{ k: 'name', t: 'text', l: 'Nama varian' }, { k: 'price', t: 'text', l: 'Harga' }] },
        { k: 'specs', t: 'list', l: 'Spesifikasi', item: 'Spesifikasi', f: [{ k: 'label', t: 'text', l: 'Nama (mis. Baterai)' }, { k: 'value', t: 'text', l: 'Nilai' }] },
        { k: 'brochureUrl', t: 'url', l: 'Link brosur (opsional)' },
        { k: 'order', t: 'number', l: 'Urutan tampil', h: 'Angka kecil tampil lebih dulu.' },
        { k: 'published', t: 'bool', l: 'Tampilkan di website' }
      ],
      blank: { published: true, order: 50, gallery: [], variants: [], specs: [], features: [] }
    },
    promos: {
      label: 'Promo', single: 'Promo', title: 'title', sub: 'model', thumb: 'image',
      fields: [
        { k: 'title', t: 'text', l: 'Judul promo', req: true },
        { k: 'model', t: 'text', l: 'Berlaku untuk model' },
        { k: 'image', t: 'image', l: 'Gambar / poster promo', max: 1100 },
        { k: 'body', t: 'md', l: 'Isi promo' },
        { k: 'validUntil', t: 'text', l: 'Masa berlaku', h: 'Contoh: Sampai 31 Oktober 2026' },
        { k: 'order', t: 'number', l: 'Urutan tampil' },
        { k: 'published', t: 'bool', l: 'Tampilkan di website' }
      ],
      blank: { published: true, order: 50 }
    },
    deliveries: {
      label: 'Delivery', single: 'Delivery', title: 'title', sub: 'customer', thumb: 'image',
      fields: [
        { k: 'title', t: 'text', l: 'Judul', req: true, h: 'Contoh: Serah Terima BYD Atto 3' },
        { k: 'customer', t: 'text', l: 'Nama pelanggan (singkat)' },
        { k: 'model', t: 'text', l: 'Model' },
        { k: 'date', t: 'date', l: 'Tanggal serah terima' },
        { k: 'image', t: 'image', l: 'Foto serah terima', max: 1000 },
        { k: 'published', t: 'bool', l: 'Tampilkan di website' }
      ],
      blank: { published: true, date: '' }
    },
    testimonials: {
      label: 'Testimoni', single: 'Testimoni', title: 'name', sub: 'model', thumb: 'photo',
      fields: [
        { k: 'name', t: 'text', l: 'Nama pelanggan', req: true },
        { k: 'model', t: 'text', l: 'Model yang dibeli' },
        { k: 'rating', t: 'number', l: 'Rating (1 sampai 5)' },
        { k: 'text', t: 'textarea', l: 'Isi testimoni', h: 'Isi dengan testimoni asli dari pelanggan.' },
        { k: 'photo', t: 'image', l: 'Foto (opsional)', max: 500 },
        { k: 'published', t: 'bool', l: 'Tampilkan di website' }
      ],
      blank: { published: true, rating: 5 }
    },
    articles: {
      label: 'Artikel', single: 'Artikel', title: 'title', sub: 'category', thumb: 'image',
      fields: [
        { k: 'title', t: 'text', l: 'Judul artikel', req: true },
        { k: 'slug', t: 'text', l: 'Slug URL', h: 'Kosongkan agar otomatis dari judul.' },
        { k: 'category', t: 'text', l: 'Kategori' },
        { k: 'date', t: 'date', l: 'Tanggal terbit' },
        { k: 'image', t: 'image', l: 'Gambar utama', max: 1100 },
        { k: 'excerpt', t: 'textarea', l: 'Ringkasan', h: 'Tampil di daftar artikel.' },
        { k: 'body', t: 'md', l: 'Isi artikel', h: 'Format: ## Judul bagian, ### Sub judul, - poin, 1. nomor, **tebal**, *miring*, [teks](https://link), ![alt](https://gambar).' },
        { k: 'metaDescription', t: 'textarea', l: 'Deskripsi SEO', h: 'Ideal 140 sampai 160 karakter. Kosongkan = pakai ringkasan.' },
        { k: 'published', t: 'bool', l: 'Terbitkan (centang) atau simpan sebagai draft' }
      ],
      blank: { published: true }
    }
  }
};
