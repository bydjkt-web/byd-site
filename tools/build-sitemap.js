#!/usr/bin/env node
/*
  Membuat sitemap.xml lengkap (halaman statis + semua model & artikel yang tayang).
  Pemakaian:  node tools/build-sitemap.js https://domain-anda.com
  Butuh Node 18+ dan js/firebase-config.js yang sudah diisi. Jalankan ulang setiap menambah artikel/model,
  lalu commit sitemap.xml ke GitHub.
*/
const fs = require('fs');
const path = require('path');

const domain = (process.argv[2] || '').replace(/\/+$/, '');
if (!/^https?:\/\//.test(domain)) {
  console.error('Pemakaian: node tools/build-sitemap.js https://domain-anda.com');
  process.exit(1);
}

const root = path.join(__dirname, '..');
const cfgSrc = fs.readFileSync(path.join(root, 'js/firebase-config.js'), 'utf8');
const projectId = (cfgSrc.match(/projectId:\s*'([^']+)'/) || [])[1];
const apiKey = (cfgSrc.match(/apiKey:\s*'([^']+)'/) || [])[1];
const today = new Date().toISOString().slice(0, 10);

async function fetchCol(col) {
  if (!projectId || projectId.startsWith('ISI_')) return [];
  const out = [];
  let token = '';
  do {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${col}?pageSize=300&key=${apiKey}${token ? '&pageToken=' + token : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${col}: HTTP ${res.status}`);
    const json = await res.json();
    (json.documents || []).forEach((d) => {
      const f = d.fields || {};
      const id = d.name.split('/').pop();
      if (f.published && f.published.booleanValue === false) return;
      out.push({
        slug: (f.slug && f.slug.stringValue) || id,
        date: (f.date && f.date.stringValue) || today
      });
    });
    token = json.nextPageToken || '';
  } while (token);
  return out;
}

(async () => {
  const urls = [
    ['/', today, '1.0'], ['/model.html', today, '0.9'], ['/promo.html', today, '0.8'],
    ['/delivery.html', today, '0.5'], ['/testimoni.html', today, '0.5'],
    ['/artikel.html', today, '0.8'], ['/kontak.html', today, '0.7']
  ];
  const models = await fetchCol('models');
  const articles = await fetchCol('articles');
  models.forEach((m) => urls.push([`/model.html?s=${encodeURIComponent(m.slug)}`, today, '0.9']));
  articles.forEach((a) => urls.push([`/artikel.html?s=${encodeURIComponent(a.slug)}`, a.date.slice(0, 10), '0.7']));

  const esc = (s) => s.replace(/&/g, '&amp;');
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map(([p, d, pr]) => `  <url><loc>${esc(domain + p)}</loc><lastmod>${d}</lastmod><priority>${pr}</priority></url>`).join('\n') +
    '\n</urlset>\n';
  fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);

  const robotsPath = path.join(root, 'robots.txt');
  let robots = fs.readFileSync(robotsPath, 'utf8').replace(/^Sitemap:.*$/m, `Sitemap: ${domain}/sitemap.xml`);
  fs.writeFileSync(robotsPath, robots);

  console.log(`sitemap.xml dibuat: ${urls.length} URL (${models.length} model, ${articles.length} artikel).`);
})().catch((e) => { console.error('Gagal:', e.message); process.exit(1); });
