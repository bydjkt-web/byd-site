/* Front end publik: merender semua halaman dari data (Firestore / demo) */
(function () {
  'use strict';
  var E = U.esc, I = U.inline;
  var S = {}, app;

  var IC = {
    wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9.2 8.2c-.3.6-.2 1.6.9 3 1.1 1.4 2.3 2.2 3.3 2.4.8.1 1.4-.4 1.6-.9l-1.5-.9-.8.6c-.7-.3-1.6-1.1-2-2l.6-.8-.8-1.6z" fill="currentColor"/></svg>',
    ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg>',
    fb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v6h4v-6h3l1-4h-4V8z" fill="currentColor"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="m3 7 9 6 9-6" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.700l1-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  };

  function img(src, alt, cls) {
    var s = U.safeImg(src);
    return s
      ? '<img class="' + (cls || '') + '" src="' + E(s) + '" alt="' + E(alt || '') + '" loading="lazy">'
      : '<div class="ph ' + (cls || '') + '"><span>' + E(alt || '') + '</span></div>';
  }
  function first() { return String(S.salesName || '').split(' ')[0] || 'Sales'; }
  function bydName(n) { return /^byd\b/i.test(n || '') ? n : 'BYD ' + n; }
  function waLink(text) { return U.wa(S, text); }
  function btnWA(text, label, cls) {
    return '<a class="btn ' + (cls || 'primary') + '" href="' + E(waLink(text)) + '" target="_blank" rel="noopener">' + IC.wa + '<span>' + E(label) + '</span></a>';
  }
  function igUrl() { return S.instagram ? 'https://www.instagram.com/' + String(S.instagram).replace(/^@/, '') : ''; }
  function socials() {
    var a = [];
    if (S.instagram) a.push({ label: 'Instagram @' + String(S.instagram).replace(/^@/, ''), url: igUrl(), icon: IC.ig });
    if (S.facebookUrl) a.push({ label: 'Facebook ' + (S.facebookName || ''), url: S.facebookUrl, icon: IC.fb });
    (S.socials || []).forEach(function (x) { if (x.url) a.push({ label: x.label, url: x.url, icon: IC.link }); });
    return a;
  }
  function sec(cls, title, sub, body, more) {
    return '<section class="sec ' + cls + '"><div class="wrap"><div class="sh"><h2>' + I(title) + '</h2>' + (sub ? '<p>' + E(sub) + '</p>' : '') + '</div>' + body +
      (more ? '<p class="more-row"><a href="' + more[0] + '">' + E(more[1]) + ' →</a></p>' : '') + '</div></section>';
  }
  function setMeta(n, c, p) {
    if (!c) return;
    var attr = p || 'name', el = document.head.querySelector('meta[' + attr + '="' + n + '"]');
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr, n); document.head.appendChild(el); }
    el.setAttribute('content', c);
  }
  function seo(o) {
    var t = o.title || S.metaTitle || S.siteName, d = o.desc || S.metaDescription || '';
    document.title = t;
    setMeta('description', d);
    var c = document.head.querySelector('link[rel=canonical]');
    if (!c) { c = document.createElement('link'); c.rel = 'canonical'; document.head.appendChild(c); }
    c.href = o.canonical || location.origin + location.pathname;
    setMeta('og:title', t, 'property'); setMeta('og:description', d, 'property');
    setMeta('og:type', o.type || 'website', 'property'); setMeta('og:url', c.href, 'property');
    setMeta('og:locale', 'id_ID', 'property'); setMeta('og:site_name', S.siteName, 'property');
    var im = o.image || S.ogImage;
    if (im && /^https?:/i.test(im)) { setMeta('og:image', im, 'property'); setMeta('twitter:image', im); }
    setMeta('twitter:card', im && /^https?:/i.test(im) ? 'summary_large_image' : 'summary');
    setMeta('twitter:title', t); setMeta('twitter:description', d);
    if (S.gscVerify) setMeta('google-site-verification', S.gscVerify);
    (o.ld || []).forEach(function (obj) {
      var s = document.createElement('script');
      s.type = 'application/ld+json';
      s.textContent = JSON.stringify(obj);
      document.head.appendChild(s);
    });
  }

  function chrome() {
    document.documentElement.style.setProperty('--accent', S.accentColor || '#e5182d');
    var cur = location.pathname.split('/').pop() || 'index.html';
    var nav = (S.navItems || []).map(function (n) {
      var f = String(n.url || '').split('?')[0] || 'index.html';
      return '<a href="' + E(U.safeUrl(n.url)) + '"' + (f === cur ? ' aria-current="page"' : '') + '>' + E(n.label) + '</a>';
    }).join('');
    var demo = DB.mode === 'demo'
      ? '<div class="demo">Mode demo: Firebase belum diisi, data contoh tampil dan perubahan admin hanya tersimpan di browser ini.</div>' : '';
    document.body.insertAdjacentHTML('afterbegin',
      demo + '<a class="skip" href="#app">Langsung ke isi</a>' +
      '<header class="hdr"><div class="wrap hdr-in"><a class="brand" href="index.html">' + E(S.siteName) + '</a>' +
      '<nav class="nav" id="nav" aria-label="Menu utama">' + nav + '</nav>' +
      '<div class="hdr-act">' + btnWA('', 'WhatsApp', 'primary sm') +
      '<button class="menu-btn" id="menuBtn" aria-label="Buka menu" aria-expanded="false"><span></span><span></span><span></span></button></div></div></header>');
    document.getElementById('menuBtn').addEventListener('click', function () {
      var o = document.getElementById('nav').classList.toggle('open');
      this.setAttribute('aria-expanded', o ? 'true' : 'false');
    });

    var loc = (S.locations || []).map(function (l) { return '<li><strong>' + E(l.name) + '</strong><br><span>' + E(l.address) + '</span></li>'; }).join('');
    var menu = (S.navItems || []).map(function (n) { return '<li><a href="' + E(U.safeUrl(n.url)) + '">' + E(n.label) + '</a></li>'; }).join('');
    var other = (S.otherSites || []).map(function (n) { return '<li><a href="' + E(U.safeUrl(n.url)) + '" rel="noopener">' + E(n.label) + '</a></li>'; }).join('');
    var soc = socials().map(function (x) { return '<a class="ico" href="' + E(U.safeUrl(x.url)) + '" target="_blank" rel="noopener" aria-label="' + E(x.label) + '" title="' + E(x.label) + '">' + x.icon + '</a>'; }).join('');
    document.body.insertAdjacentHTML('beforeend',
      '<footer class="ftr"><div class="wrap fgrid">' +
      '<div><strong class="fname">' + E(S.salesName) + '</strong><div class="muted">' + E(S.salesTitle) + '<br>' + E(S.dealerName) + '</div>' +
      '<p><a href="' + E(waLink()) + '" target="_blank" rel="noopener">WhatsApp: ' + E(U.phoneShow(S.whatsapp)) + '</a></p><div class="socs">' + soc + '</div></div>' +
      (loc ? '<div><h4>Lokasi Dealer</h4><ul>' + loc + '</ul></div>' : '') +
      '<div><h4>Menu</h4><ul>' + menu + '</ul></div>' +
      (other ? '<div><h4>Website Lain</h4><ul>' + other + '</ul></div>' : '') +
      '</div><div class="wrap copy">© ' + new Date().getFullYear() + ' ' + E(S.siteName) + '. ' + E(S.footerNote) + '</div></footer>' +
      '<a class="wafab" href="' + E(waLink()) + '" target="_blank" rel="noopener" aria-label="Chat WhatsApp">' + IC.wa + '</a>');
  }

  /* ---------- Kartu ---------- */
  function mcard(m) {
    return '<a class="card mcard" href="model.html?s=' + encodeURIComponent(m.slug || m.id) + '"><div class="thumb">' + img(m.image, m.name) + '</div>' +
      '<div class="cb"><small class="chip">' + E(m.category) + '</small><h3>' + E(m.name) + '</h3><p>' + E(m.tagline) + '</p>' +
      '<div class="mrow"><span class="price">' + (m.price ? E(m.price) : 'Tanya harga terbaru') + '</span><span class="more">Lihat detail →</span></div></div></a>';
  }
  function pcard(p) {
    var t = 'Halo Kak ' + first() + ', saya tertarik dengan promo "' + p.title + '". Boleh minta infonya?';
    return '<article class="card pcard">' + (U.safeImg(p.image) ? '<div class="thumb tall">' + img(p.image, p.title) + '</div>' : '') +
      '<div class="cb">' + (p.model ? '<small class="chip">' + E(p.model) + '</small>' : '') + '<h3>' + E(p.title) + '</h3>' +
      '<div class="prose sm">' + U.md(p.body) + '</div>' +
      (p.validUntil ? '<p class="valid">' + E(p.validUntil) + '</p>' : '') + btnWA(t, 'Tanya promo ini', 'primary sm') + '</div></article>';
  }
  function dcard(d) {
    var meta = [d.customer, d.model, d.date ? U.fmtDate(d.date) : ''].filter(Boolean).join(' · ');
    return '<figure class="dcard">' + img(d.image, d.title) + '<figcaption><strong>' + E(d.title) + '</strong><span>' + E(meta) + '</span></figcaption></figure>';
  }
  function tcard(t) {
    var av = U.safeImg(t.photo) ? '<img src="' + E(U.safeImg(t.photo)) + '" alt="' + E(t.name) + '" loading="lazy">' : '<span>' + E((t.name || '?').charAt(0).toUpperCase()) + '</span>';
    return '<blockquote class="card tcard"><div class="stars" aria-label="Rating ' + E(t.rating) + ' dari 5">' + U.stars(t.rating) + '</div><p>' + E(t.text) + '</p>' +
      '<footer><div class="av">' + av + '</div><div><strong>' + E(t.name) + '</strong><small>' + E(t.model) + '</small></div></footer></blockquote>';
  }
  function acard(a) {
    return '<a class="card acard" href="artikel.html?s=' + encodeURIComponent(a.slug || a.id) + '"><div class="thumb">' + img(a.image, a.title) + '</div>' +
      '<div class="cb"><small class="chip">' + E(a.category) + '</small><h3>' + E(a.title) + '</h3><p>' + E(a.excerpt) + '</p><small class="muted">' + E(U.fmtDate(a.date)) + '</small></div></a>';
  }
  function crumbs(arr) {
    return '<nav class="crumbs" aria-label="Breadcrumb">' + arr.map(function (x) { return x[1] ? '<a href="' + x[1] + '">' + E(x[0]) + '</a>' : '<span>' + E(x[0]) + '</span>'; }).join(' / ') + '</nav>';
  }
  function notFound(what) {
    app.innerHTML = '<section class="sec"><div class="wrap center"><h1>' + E(what) + ' tidak ditemukan</h1><p class="muted">Halaman yang Anda cari mungkin sudah dipindahkan atau dihapus.</p><p><a class="btn primary" href="index.html">Kembali ke beranda</a></p></div></section>';
    seo({ title: what + ' tidak ditemukan | ' + S.siteName, desc: '' });
  }
  function pageHead(title, sub) {
    return '<section class="phead"><div class="wrap"><h1>' + I(title) + '</h1>' + (sub ? '<p class="lead">' + E(sub) + '</p>' : '') + '</div></section>';
  }
  function empty(msg) { return '<p class="empty">' + E(msg) + '</p>'; }

  /* ---------- Halaman ---------- */
  async function home() {
    var r = await Promise.all(['models', 'promos', 'deliveries', 'testimonials', 'articles'].map(function (c) { return DB.list(c, { pub: true }); }));
    var models = r[0], promos = r[1], dels = r[2], testi = r[3], arts = r[4];
    var ini = (S.salesName || '?').split(' ').map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase();
    var avatar = U.safeImg(S.salesPhoto) ? '<img src="' + E(U.safeImg(S.salesPhoto)) + '" alt="Foto ' + E(S.salesName) + '">' : '<span>' + E(ini) + '</span>';
    var soc = socials().map(function (x) { return '<a class="ico" href="' + E(U.safeUrl(x.url)) + '" target="_blank" rel="noopener" aria-label="' + E(x.label) + '" title="' + E(x.label) + '">' + x.icon + '</a>'; }).join('');
    var stats = (S.stats || []).map(function (s) { return '<div><strong>' + E(s.label) + '</strong><span>' + E(s.value) + '</span></div>'; }).join('');

    var h = '<section class="hero"><div class="wrap">' +
      '<div class="profile"><div class="avatar">' + avatar + '</div><div class="who"><strong>' + E(S.salesName) + '</strong><span>' + E(S.salesTitle) + '</span><span class="dealer">' + E(S.dealerName) + '</span></div>' +
      '<div class="socs">' + soc + '</div></div>' +
      (S.heroEyebrow ? '<span class="eyebrow">' + E(S.heroEyebrow) + '</span>' : '') +
      '<h1>' + I(S.heroTitle) + '</h1><p class="lead">' + E(S.heroText) + '</p>' +
      '<div class="cta-row">' + btnWA('', S.ctaPrimary || 'Chat WhatsApp', 'primary') + '<a class="btn ghost" href="model.html">' + E(S.ctaSecondary || 'Lihat Model') + '</a></div>' +
      (stats ? '<div class="stats">' + stats + '</div>' : '') + '</div></section>';

    h += sec('models', S.modelTitle, S.modelSub, models.length ? '<div class="grid g3">' + models.map(mcard).join('') + '</div>' : empty('Model akan segera ditambahkan.'), ['model.html', 'Lihat semua model']);
    if (promos.length) h += sec('promos alt', S.promoTitle, S.promoSub, '<div class="grid g3">' + promos.slice(0, 3).map(pcard).join('') + '</div>', ['promo.html', 'Lihat semua promo']);
    if (dels.length) h += sec('dels', S.deliveryTitle, S.deliverySub, '<div class="grid g4">' + dels.slice(0, 4).map(dcard).join('') + '</div>', ['delivery.html', 'Lihat semua delivery']);
    if ((S.benefits || []).length) h += sec('why alt', S.whyTitle, '', '<div class="grid g4">' + S.benefits.map(function (b) { return '<div class="card why"><div class="ic">' + E(b.icon) + '</div><h3>' + E(b.title) + '</h3><p>' + E(b.text) + '</p></div>'; }).join('') + '</div>');
    if (testi.length) h += sec('testi', S.testiTitle, S.testiSub, '<div class="grid g3">' + testi.slice(0, 3).map(tcard).join('') + '</div>', ['testimoni.html', 'Lihat semua testimoni']);
    if (arts.length) h += sec('arts alt', S.artikelTitle, S.artikelSub, '<div class="grid g3">' + arts.slice(0, 3).map(acard).join('') + '</div>', ['artikel.html', 'Lihat semua artikel']);
    if ((S.faq || []).length) h += sec('faqs', S.faqTitle, '', '<div class="faq-list">' + S.faq.map(function (f) { return '<details class="faq"><summary>' + E(f.q) + '</summary><div class="prose sm">' + U.md(f.a) + '</div></details>'; }).join('') + '</div>');
    h += '<section class="sec"><div class="wrap"><div class="ctabox"><h2>' + E(S.ctaTitle) + '</h2><p>' + E(S.ctaText) + '</p>' + btnWA('', S.ctaButton || 'Chat WhatsApp', 'primary') + '</div></div></section>';
    app.innerHTML = h;

    var ld = [{
      '@context': 'https://schema.org', '@type': 'AutoDealer', name: S.dealerName || S.siteName, url: location.origin + location.pathname,
      telephone: '+' + U.phone(S.whatsapp), email: S.email,
      address: { '@type': 'PostalAddress', streetAddress: S.address, addressCountry: 'ID' },
      sameAs: socials().map(function (x) { return x.url; }),
      employee: { '@type': 'Person', name: S.salesName, jobTitle: S.salesTitle }
    }];
    if ((S.faq || []).length) ld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: S.faq.map(function (f) { return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }; }) });
    seo({ title: S.metaTitle, desc: S.metaDescription, ld: ld });
    popup();
  }

  async function modelPage(q) {
    var key = q.get('s'), models = await DB.list('models', { pub: true });
    if (!key) {
      var cats = []; models.forEach(function (m) { if (m.category && cats.indexOf(m.category) < 0) cats.push(m.category); });
      var chips = cats.length > 1 ? '<div class="filters" id="filters"><button class="on" data-c="">Semua</button>' + cats.map(function (c) { return '<button data-c="' + E(c) + '">' + E(c) + '</button>'; }).join('') + '</div>' : '';
      app.innerHTML = pageHead('Pilihan Model *BYD*', S.modelSub) + '<section class="sec"><div class="wrap">' + chips +
        (models.length ? '<div class="grid g3" id="mgrid">' + models.map(function (m) { return '<div data-c="' + E(m.category) + '">' + mcard(m) + '</div>'; }).join('') + '</div>' : empty('Model akan segera ditambahkan.')) + '</div></section>';
      var f = document.getElementById('filters');
      if (f) f.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        f.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
        document.querySelectorAll('#mgrid > div').forEach(function (d) { d.hidden = !!b.dataset.c && d.dataset.c !== b.dataset.c; });
      });
      return seo({ title: 'Model BYD: Harga, Spesifikasi dan Test Drive | ' + S.siteName, desc: 'Daftar model mobil listrik BYD beserta harga, spesifikasi dan promo. Konsultasi dan test drive dengan ' + S.salesName + '.' });
    }
    var m = models.filter(function (x) { return x.slug === key || x.id === key; })[0];
    if (!m) return notFound('Model');
    var pics = [m.image].concat((m.gallery || []).map(function (g) { return g.image; })).filter(function (x) { return U.safeImg(x); });
    var main = pics.length ? '<img id="gmain" src="' + E(pics[0]) + '" alt="' + E(m.name) + '">' : img('', m.name);
    var thumbs = pics.length > 1 ? '<div class="gthumbs">' + pics.map(function (p, i) { return '<button data-i="' + i + '" class="' + (i ? '' : 'on') + '"><img src="' + E(p) + '" alt="" loading="lazy"></button>'; }).join('') + '</div>' : '';
    var variants = (m.variants || []).length ? '<h2>Varian & Harga</h2><table class="tbl"><tbody>' + m.variants.map(function (v) { return '<tr><th>' + E(v.name) + '</th><td>' + E(v.price) + '</td></tr>'; }).join('') + '</tbody></table>' : '';
    var specs = (m.specs || []).length ? '<h2>Spesifikasi</h2><table class="tbl"><tbody>' + m.specs.map(function (v) { return '<tr><th>' + E(v.label) + '</th><td>' + E(v.value) + '</td></tr>'; }).join('') + '</tbody></table>' : '';
    var feats = (m.features || []).length ? '<h2>Fitur Unggulan</h2><ul class="feat">' + m.features.map(function (x) { return '<li>' + E(x) + '</li>'; }).join('') + '</ul>' : '';
    var nm = bydName(m.name);
    var others = models.filter(function (x) { return x.id !== m.id; }).slice(0, 3);
    app.innerHTML = '<section class="sec"><div class="wrap">' + crumbs([['Beranda', 'index.html'], ['Model', 'model.html'], [m.name]]) +
      '<div class="mdetail"><div class="gallery"><div class="gbig">' + main + '</div>' + thumbs + '</div>' +
      '<div class="minfo"><small class="chip">' + E(m.category) + '</small><h1>' + E(m.name) + '</h1><p class="lead">' + E(m.tagline) + '</p>' +
      '<div class="bigprice">' + (m.price ? E(m.price) : 'Tanya harga terbaru') + '</div>' +
      '<div class="cta-row">' + btnWA('Halo Kak ' + first() + ', saya tertarik dengan ' + nm + '. Boleh minta info harga dan promo terbaru?', 'Tanya harga ' + m.name, 'primary') +
      btnWA('Halo Kak ' + first() + ', saya mau booking test drive ' + nm + '. Bisa diatur jadwalnya?', 'Booking test drive', 'ghost') + '</div>' +
      (m.brochureUrl ? '<p><a href="' + E(U.safeUrl(m.brochureUrl)) + '" target="_blank" rel="noopener">Unduh brosur →</a></p>' : '') + '</div></div>' +
      '<div class="mbody"><div>' + (m.desc ? '<div class="prose">' + U.md(m.desc) + '</div>' : '') + feats + '</div><div>' + variants + specs + '</div></div>' +
      (others.length ? '<h2 class="mt">Model lainnya</h2><div class="grid g3">' + others.map(mcard).join('') + '</div>' : '') + '</div></section>';
    var th = document.querySelector('.gthumbs');
    if (th) th.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      document.getElementById('gmain').src = pics[+b.dataset.i];
      th.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
    });
    var im = /^https?:/i.test(m.image || '') ? m.image : '';
    seo({
      title: nm + ': Harga, Spesifikasi dan Test Drive | ' + S.siteName,
      desc: (m.tagline || '') + ' Tanya harga, promo dan simulasi kredit ' + nm + ' ke ' + S.salesName + '.',
      canonical: location.origin + location.pathname + '?s=' + encodeURIComponent(m.slug || m.id), image: im,
      ld: [{ '@context': 'https://schema.org', '@type': 'Product', name: nm, description: m.tagline || m.desc || '', brand: { '@type': 'Brand', name: 'BYD' }, category: m.category, image: im || undefined }]
    });
  }

  async function promoPage() {
    var l = await DB.list('promos', { pub: true });
    app.innerHTML = pageHead(S.promoTitle, S.promoSub) + '<section class="sec"><div class="wrap">' + (l.length ? '<div class="grid g3">' + l.map(pcard).join('') + '</div>' : empty('Belum ada promo aktif. Tanyakan promo terbaru lewat WhatsApp.')) + '</div></section>';
    seo({ title: 'Promo BYD Terbaru | ' + S.siteName, desc: 'Promo dan penawaran terbaru mobil listrik BYD di Jakarta. Tanyakan syarat dan ketentuan ke ' + S.salesName + '.' });
  }
  async function deliveryPage() {
    var l = await DB.list('deliveries', { pub: true });
    app.innerHTML = pageHead(S.deliveryTitle, S.deliverySub) + '<section class="sec"><div class="wrap">' + (l.length ? '<div class="grid g4">' + l.map(dcard).join('') + '</div>' : empty('Dokumentasi serah terima akan segera ditambahkan.')) + '</div></section>';
    seo({ title: 'Serah Terima Unit BYD | ' + S.siteName, desc: 'Dokumentasi serah terima unit BYD kepada pelanggan.' });
  }
  async function testiPage() {
    var l = await DB.list('testimonials', { pub: true });
    app.innerHTML = pageHead(S.testiTitle, S.testiSub) + '<section class="sec"><div class="wrap">' + (l.length ? '<div class="grid g3">' + l.map(tcard).join('') + '</div>' : empty('Testimoni pelanggan akan segera ditambahkan.')) + '</div></section>';
    seo({ title: 'Testimoni Pelanggan BYD | ' + S.siteName, desc: 'Cerita pelanggan yang membeli BYD lewat ' + S.salesName + '.' });
  }

  async function artikelPage(q) {
    var key = q.get('s'), l = await DB.list('articles', { pub: true });
    if (!key) {
      app.innerHTML = pageHead(S.artikelTitle, S.artikelSub) + '<section class="sec"><div class="wrap">' + (l.length ? '<div class="grid g3">' + l.map(acard).join('') + '</div>' : empty('Artikel akan segera ditambahkan.')) + '</div></section>';
      return seo({ title: 'Artikel & Tips Mobil Listrik BYD | ' + S.siteName, desc: 'Tips, panduan dan kabar terbaru seputar mobil listrik BYD: test drive, simulasi kredit, dan memilih model.' });
    }
    var a = l.filter(function (x) { return x.slug === key || x.id === key; })[0];
    if (!a) return notFound('Artikel');
    var rel = l.filter(function (x) { return x.id !== a.id; }).slice(0, 3);
    var url = location.origin + location.pathname + '?s=' + encodeURIComponent(a.slug || a.id);
    app.innerHTML = '<article class="sec"><div class="wrap narrow">' + crumbs([['Beranda', 'index.html'], ['Artikel', 'artikel.html'], [a.title]]) +
      '<small class="chip">' + E(a.category) + '</small><h1>' + E(a.title) + '</h1><p class="muted">' + E(U.fmtDate(a.date)) + ' · oleh ' + E(S.salesName) + '</p>' +
      (U.safeImg(a.image) ? '<div class="hero-img">' + img(a.image, a.title) + '</div>' : '') +
      '<div class="prose">' + U.md(a.body) + '</div>' +
      '<div class="ctabox sm"><h3>Ada pertanyaan seputar BYD?</h3><p>Tanya langsung ke ' + E(S.salesName) + ', respon cepat lewat WhatsApp.</p>' +
      btnWA('Halo Kak ' + first() + ', saya baca artikel "' + a.title + '" dan ingin bertanya lebih lanjut.', 'Chat WhatsApp', 'primary') + '</div>' +
      '</div>' + (rel.length ? '<div class="wrap"><h2 class="mt">Artikel lainnya</h2><div class="grid g3">' + rel.map(acard).join('') + '</div></div>' : '') + '</article>';
    var im = /^https?:/i.test(a.image || '') ? a.image : '';
    seo({
      title: a.title + ' | ' + S.siteName, desc: a.metaDescription || a.excerpt, canonical: url, type: 'article', image: im,
      ld: [{ '@context': 'https://schema.org', '@type': 'Article', headline: a.title, datePublished: a.date, description: a.metaDescription || a.excerpt, image: im || undefined, author: { '@type': 'Person', name: S.salesName }, publisher: { '@type': 'Organization', name: S.siteName }, mainEntityOfPage: url }]
    });
  }

  async function kontakPage() {
    var models = await DB.list('models', { pub: true });
    var cards = '<a class="card ccard" href="' + E(waLink()) + '" target="_blank" rel="noopener">' + IC.wa + '<div><strong>WhatsApp</strong><span>' + E(U.phoneShow(S.whatsapp)) + '</span></div></a>';
    if (S.instagram) cards += '<a class="card ccard" href="' + E(igUrl()) + '" target="_blank" rel="noopener">' + IC.ig + '<div><strong>Instagram</strong><span>@' + E(String(S.instagram).replace(/^@/, '')) + '</span></div></a>';
    if (S.facebookUrl) cards += '<a class="card ccard" href="' + E(U.safeUrl(S.facebookUrl)) + '" target="_blank" rel="noopener">' + IC.fb + '<div><strong>Facebook</strong><span>' + E(S.facebookName) + '</span></div></a>';
    if (S.email) cards += '<a class="card ccard" href="mailto:' + E(S.email) + '">' + IC.mail + '<div><strong>Email</strong><span>' + E(S.email) + '</span></div></a>';
    var opts = '<option value="">Belum tahu / semua model</option>' + models.map(function (m) { return '<option>' + E(m.name) + '</option>'; }).join('');
    app.innerHTML = pageHead('Hubungi *' + S.salesName + '*', 'Konsultasi harga, promo, simulasi kredit dan jadwal test drive.') +
      '<section class="sec"><div class="wrap cgrid"><div><div class="grid g2">' + cards + '</div>' +
      '<div class="card cb addr"><h3>' + E(S.dealerName) + '</h3><p>' + E(S.address) + '</p>' + (S.mapUrl ? '<p><a href="' + E(U.safeUrl(S.mapUrl)) + '" target="_blank" rel="noopener">Buka di Google Maps →</a></p>' : '') + '</div></div>' +
      '<form class="card cb lead-form" id="leadForm"><h3>Kirim pesan cepat</h3><p class="muted">Isi form, lalu pesan otomatis terbuka di WhatsApp.</p>' +
      '<label>Nama<input name="nama" required autocomplete="name"></label>' +
      '<label>Nomor HP<input name="hp" type="tel" required autocomplete="tel"></label>' +
      '<label>Model yang diminati<select name="model">' + opts + '</select></label>' +
      '<label>Pesan (opsional)<textarea name="pesan" rows="3"></textarea></label>' +
      '<button class="btn primary" type="submit">' + IC.wa + '<span>Kirim lewat WhatsApp</span></button></form></div></section>';
    document.getElementById('leadForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var f = e.target, m = f.model.value;
      var t = 'Halo Kak ' + first() + ', saya ' + f.nama.value.trim() + ' (HP: ' + f.hp.value.trim() + '). ' +
        (m ? 'Saya tertarik dengan ' + bydName(m) + '. ' : 'Saya tertarik dengan mobil BYD. ') + f.pesan.value.trim();
      window.open(waLink(t.trim()), '_blank', 'noopener');
    });
    seo({ title: 'Kontak ' + S.salesName + ' - Sales BYD | ' + S.siteName, desc: 'Hubungi ' + S.salesName + ', ' + S.salesTitle + ' di ' + S.dealerName + ' lewat WhatsApp, Instagram atau email.' });
  }

  function popup() {
    if (!S.popupOn) return;
    try { if (sessionStorage.getItem('popup_seen')) return; } catch (e) {}
    setTimeout(function () {
      var d = document.createElement('div');
      d.className = 'pop';
      d.innerHTML = '<div class="pop-box" role="dialog" aria-modal="true" aria-label="' + E(S.popupTitle) + '"><button class="pop-x" aria-label="Tutup">×</button>' +
        (U.safeImg(S.popupImage) ? '<img src="' + E(U.safeImg(S.popupImage)) + '" alt="">' : '') +
        '<div class="cb"><h3>' + E(S.popupTitle) + '</h3><p>' + E(S.popupText) + '</p>' + btnWA('', S.popupButton || 'Chat WhatsApp', 'primary') + ' <button class="btn ghost close">Nanti saja</button></div></div>';
      function close() { d.remove(); try { sessionStorage.setItem('popup_seen', '1'); } catch (e) {} }
      d.addEventListener('click', function (e) { if (e.target === d || e.target.closest('.pop-x,.close')) close(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
      document.body.appendChild(d);
    }, 1800);
  }

  function analytics() {
    if (!S.gaId || !/^G-[A-Z0-9]+$/i.test(S.gaId)) return;
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + S.gaId;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date()); window.gtag('config', S.gaId);
  }

  (async function init() {
    app = document.getElementById('app');
    try {
      S = await DB.getSettings();
      chrome();
      analytics();
      var q = new URLSearchParams(location.search), p = document.body.dataset.page;
      var R = { home: home, model: modelPage, promo: promoPage, delivery: deliveryPage, testimoni: testiPage, artikel: artikelPage, kontak: kontakPage };
      await (R[p] || home)(q);
    } catch (e) {
      console.error(e);
      app.innerHTML = '<section class="sec"><div class="wrap center"><h1>Maaf, halaman gagal dimuat</h1><p class="muted">Silakan muat ulang halaman ini.</p></div></section>';
    }
  })();
})();
