/* Panel admin: edit semua isi website (profil, teks, katalog, artikel, dll) */
(function () {
  'use strict';
  var root = document.getElementById('root');
  var S = {}, cur = 'g:profil', mainEl = null, navEl = null;

  /* ---------- helper DOM ---------- */
  function h(tag, attrs, kids) {
    var el = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class') el.className = v;
      else if (k === 'value') el.value = v;
      else if (k === 'checked') el.checked = !!v;
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    });
    [].concat(kids == null ? [] : kids).forEach(function (c) {
      if (c == null || c === false) return;
      el.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
    });
    return el;
  }
  function toast(msg, err) {
    var t = h('div', { class: 'toast' + (err ? ' err' : '') }, msg);
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, err ? 6000 : 2500);
  }
  function tooBig(obj) { return JSON.stringify(obj).length > 900000; }
  var SIZE_MSG = 'Data terlalu besar (batas Firestore sekitar 1 MB per dokumen). Kurangi jumlah/ukuran gambar yang di-upload atau pakai link gambar (https://).';
  function errMsg(e) {
    var m = (e && (e.code || e.message)) || String(e);
    if (/permission|insufficient/i.test(m)) return 'Akses ditolak. Pastikan UID admin sudah dimasukkan di firestore.rules (lihat PANDUAN-SETUP.md).';
    return m;
  }

  /* ---------- builder field ---------- */
  function mdBar(ta) {
    function wrap(a, b, ph) {
      var s = ta.selectionStart, e = ta.selectionEnd, v = ta.value, sel = v.slice(s, e) || ph;
      ta.value = v.slice(0, s) + a + sel + b + v.slice(e);
      ta.focus(); ta.selectionStart = s + a.length; ta.selectionEnd = s + a.length + sel.length;
    }
    function line(prefix, ph) {
      var s = ta.selectionStart, v = ta.value, ls = v.lastIndexOf('\n', s - 1) + 1;
      ta.value = v.slice(0, ls) + prefix + (v.slice(ls, ta.selectionEnd) || ph) + v.slice(ta.selectionEnd);
      ta.focus();
    }
    var prev = h('div', { class: 'mdprev hide' });
    var bar = h('div', { class: 'mdbar' }, [
      h('button', { type: 'button', class: 'btn sm', onclick: function () { line('## ', 'Judul bagian'); } }, 'Judul'),
      h('button', { type: 'button', class: 'btn sm', onclick: function () { wrap('**', '**', 'tebal'); } }, 'Tebal'),
      h('button', { type: 'button', class: 'btn sm', onclick: function () { line('- ', 'poin'); } }, 'Poin'),
      h('button', { type: 'button', class: 'btn sm', onclick: function () { wrap('[', '](https://)', 'teks link'); } }, 'Link'),
      h('button', { type: 'button', class: 'btn sm', onclick: function () { wrap('![', '](https://)', 'deskripsi gambar'); } }, 'Gambar'),
      h('button', { type: 'button', class: 'btn sm', onclick: function () {
        var show = prev.classList.contains('hide');
        prev.classList.toggle('hide', !show);
        if (show) prev.innerHTML = U.md(ta.value) || '<span class="muted">Kosong</span>';
      } }, 'Pratinjau')
    ]);
    return [bar, ta, prev];
  }

  function buildField(f, val) {
    var w = h('div', { class: 'f f-' + f.t }), get;
    if (f.t === 'bool') {
      var cb = h('input', { type: 'checkbox', checked: val == null ? true : !!val });
      w.appendChild(h('label', { class: 'chk' }, [cb, ' ' + f.l]));
      get = function () { return cb.checked; };
    } else {
      w.appendChild(h('label', {}, f.l));
      switch (f.t) {
        case 'text': case 'url': case 'date': case 'number': {
          var inp = h('input', { type: f.t === 'number' ? 'number' : f.t === 'date' ? 'date' : 'text' });
          inp.value = val == null ? '' : val;
          if (f.t === 'number') inp.step = 'any';
          w.appendChild(inp);
          get = function () { var v = inp.value.trim(); return f.t === 'number' ? (v === '' ? null : Number(v)) : v; };
          break;
        }
        case 'textarea': case 'md': {
          var ta = h('textarea', { rows: f.t === 'md' ? 14 : 3 });
          ta.value = val == null ? '' : val;
          (f.t === 'md' ? mdBar(ta) : [ta]).forEach(function (x) { w.appendChild(x); });
          get = function () { return ta.value.replace(/\s+$/, ''); };
          break;
        }
        case 'lines': {
          var tl = h('textarea', { rows: 5 });
          tl.value = (val || []).join('\n');
          w.appendChild(tl);
          get = function () { return tl.value.split('\n').map(function (x) { return x.trim(); }).filter(Boolean); };
          break;
        }
        case 'select': {
          var sel = h('select', {}, (f.opts || []).map(function (o) { return h('option', { value: o }, o); }));
          sel.value = val == null ? (f.opts || [''])[0] : val;
          w.appendChild(sel);
          get = function () { return sel.value; };
          break;
        }
        case 'color': {
          var col = h('input', { type: 'color' });
          col.value = /^#[0-9a-f]{6}$/i.test(val || '') ? val : '#e5182d';
          w.appendChild(col);
          get = function () { return col.value; };
          break;
        }
        case 'image': {
          var img = val || '';
          var prev = h('div', { class: 'imgprev' }), info = h('small', { class: 'help' });
          var file = h('input', { type: 'file', accept: 'image/*', class: 'hide' });
          var paint = function () {
            prev.innerHTML = '';
            if (U.safeImg(img)) {
              prev.appendChild(h('img', { src: img, alt: '' }));
              info.textContent = img.indexOf('data:') === 0 ? 'Tersimpan di database (' + Math.round(img.length / 1024) + ' KB)' : img;
            } else { prev.appendChild(h('span', {}, 'Belum ada gambar')); info.textContent = ''; }
          };
          var url = h('input', { type: 'text', placeholder: 'atau tempel link gambar https://...' });
          url.addEventListener('change', function () { img = url.value.trim(); url.value = ''; paint(); });
          file.addEventListener('change', async function () {
            try { img = await U.resizeImage(file.files[0], f.max || 1000, 0.82); paint(); }
            catch (e) { toast(e.message, true); }
            file.value = '';
          });
          w.appendChild(prev);
          w.appendChild(h('div', { class: 'imgact' }, [
            file,
            h('button', { type: 'button', class: 'btn sm', onclick: function () { file.click(); } }, 'Upload / ganti foto'),
            h('button', { type: 'button', class: 'btn sm danger', onclick: function () { img = ''; paint(); } }, 'Hapus')
          ]));
          w.appendChild(url);
          w.appendChild(info);
          paint();
          get = function () { return img; };
          break;
        }
        case 'list': {
          var rows = h('div', { class: 'rows' }), items = [];
          var refresh = function () { items.forEach(function (o, i) { o.title.textContent = (f.item || 'Item') + ' ' + (i + 1); }); };
          var move = function (o, d) {
            var i = items.indexOf(o), j = i + d;
            if (j < 0 || j >= items.length) return;
            items.splice(i, 1); items.splice(j, 0, o);
            rows.innerHTML = ''; items.forEach(function (x) { rows.appendChild(x.row); });
            refresh();
          };
          var add = function (v) {
            var subs = f.f.map(function (sf) { return buildField(sf, v ? v[sf.k] : undefined); });
            var title = h('strong', {}, '');
            var o = { title: title };
            o.row = h('div', { class: 'row' }, [
              h('div', { class: 'rowhead' }, [
                title,
                h('button', { type: 'button', class: 'btn sm', title: 'Naik', onclick: function () { move(o, -1); } }, '↑'),
                h('button', { type: 'button', class: 'btn sm', title: 'Turun', onclick: function () { move(o, 1); } }, '↓'),
                h('button', { type: 'button', class: 'btn sm danger', onclick: function () {
                  items.splice(items.indexOf(o), 1); o.row.remove(); refresh();
                } }, 'Hapus')
              ])
            ].concat(subs.map(function (s) { return s.el; })));
            o.get = function () { var r = {}; f.f.forEach(function (sf, i) { r[sf.k] = subs[i].get(); }); return r; };
            items.push(o); rows.appendChild(o.row); refresh();
          };
          (val || []).forEach(add);
          w.appendChild(rows);
          w.appendChild(h('button', { type: 'button', class: 'btn sm', onclick: function () { add(); } }, '+ Tambah ' + (f.item || 'item').toLowerCase()));
          get = function () {
            return items.map(function (o) { return o.get(); }).filter(function (r) {
              return Object.keys(r).some(function (k) { var v = r[k]; return typeof v === 'string' ? v.trim() !== '' : v != null && v !== false; });
            });
          };
          break;
        }
      }
    }
    if (f.h) w.appendChild(h('small', { class: 'help' }, f.h));
    return { el: w, get: get };
  }

  function buildForm(fields, data) {
    var built = fields.map(function (f) { return buildField(f, data[f.k]); });
    var el = h('div', { class: 'form' }, built.map(function (b) { return b.el; }));
    return { el: el, get: function () { var o = {}; fields.forEach(function (f, i) { o[f.k] = built[i].get(); }); return o; } };
  }

  /* ---------- tampilan ---------- */
  function navItems() {
    var a = [{ sec: 'Situs' }];
    SCHEMA.settingsGroups.forEach(function (g) { a.push({ id: 'g:' + g.id, label: g.label }); });
    a.push({ sec: 'Konten' });
    Object.keys(SCHEMA.collections).forEach(function (c) { a.push({ id: 'c:' + c, label: SCHEMA.collections[c].label }); });
    a.push({ sec: 'Alat' });
    a.push({ id: 'tools', label: 'Backup & Info' });
    return a;
  }
  function renderNav() {
    navEl.innerHTML = '';
    navItems().forEach(function (n) {
      if (n.sec) return navEl.appendChild(h('h4', {}, n.sec));
      navEl.appendChild(h('button', { class: n.id === cur ? 'on' : '', onclick: function () { go(n.id); } }, n.label));
    });
  }
  function go(id) { cur = id; renderNav(); render(); window.scrollTo(0, 0); }

  async function render() {
    mainEl.innerHTML = '';
    try {
      if (cur.indexOf('g:') === 0) settingsView(cur.slice(2));
      else if (cur.indexOf('c:') === 0) await listView(cur.slice(2));
      else toolsView();
    } catch (e) { console.error(e); mainEl.appendChild(h('div', { class: 'empty' }, errMsg(e))); }
  }

  function settingsView(gid) {
    var g = SCHEMA.settingsGroups.filter(function (x) { return x.id === gid; })[0];
    var form = buildForm(g.fields, S);
    var btn = h('button', { class: 'btn primary', type: 'button' }, 'Simpan perubahan');
    btn.addEventListener('click', async function () {
      var next = Object.assign({}, S, form.get());
      if (tooBig(next)) return toast(SIZE_MSG, true);
      btn.disabled = true;
      try { await DB.saveSettings(next); S = next; toast('Tersimpan. Muat ulang halaman situs untuk melihat hasilnya.'); }
      catch (e) { toast(errMsg(e), true); }
      btn.disabled = false;
    });
    mainEl.appendChild(h('h2', {}, g.label));
    mainEl.appendChild(form.el);
    mainEl.appendChild(h('div', { class: 'savebar' }, [btn, h('a', { class: 'btn', href: '../index.html', target: '_blank', rel: 'noopener' }, 'Lihat situs ↗')]));
  }

  async function listView(col) {
    var cfg = SCHEMA.collections[col];
    var items = await DB.list(col);
    mainEl.appendChild(h('div', { class: 'lhead' }, [
      h('h2', {}, cfg.label + ' (' + items.length + ')'),
      h('button', { class: 'btn primary', onclick: function () { editView(col, null); } }, '+ Tambah ' + cfg.single.toLowerCase())
    ]));
    if (!items.length) mainEl.appendChild(h('div', { class: 'empty' }, 'Belum ada data. Klik tombol Tambah untuk mulai.'));
    items.forEach(function (it) {
      var th = h('div', { class: 'th' }, U.safeImg(it[cfg.thumb]) ? h('img', { src: it[cfg.thumb], alt: '' }) : 'foto');
      mainEl.appendChild(h('div', { class: 'item' }, [
        th,
        h('div', { class: 'tx' }, [h('strong', {}, it[cfg.title] || '(tanpa judul)'), h('span', {}, [it[cfg.sub], it.date ? U.fmtDate(it.date) : ''].filter(Boolean).join(' · '))]),
        h('span', { class: 'tag' + (it.published === false ? ' off' : '') }, it.published === false ? 'Draft' : 'Tayang'),
        h('button', { class: 'btn sm', onclick: function () { editView(col, it); } }, 'Edit'),
        h('button', { class: 'btn sm danger', onclick: async function () {
          if (!confirm('Hapus "' + (it[cfg.title] || 'item ini') + '"? Tindakan ini tidak bisa dibatalkan.')) return;
          try { await DB.remove(col, it.id); toast('Dihapus'); render(); } catch (e) { toast(errMsg(e), true); }
        } }, 'Hapus')
      ]));
    });
  }

  function editView(col, item) {
    var cfg = SCHEMA.collections[col];
    var isNew = !item;
    var data = item ? U.clone(item) : U.clone(cfg.blank || {});
    if (isNew && cfg.fields.some(function (f) { return f.k === 'date'; }) && !data.date) data.date = U.today();
    var form = buildForm(cfg.fields, data);
    mainEl.innerHTML = '';
    mainEl.appendChild(h('h2', {}, (isNew ? 'Tambah ' : 'Edit ') + cfg.single));
    mainEl.appendChild(form.el);
    var btn = h('button', { class: 'btn primary', type: 'button' }, 'Simpan');
    btn.addEventListener('click', async function () {
      var vals = form.get();
      var missing = cfg.fields.filter(function (f) { return f.req && !String(vals[f.k] || '').trim(); })[0];
      if (missing) return toast('Kolom "' + missing.l + '" wajib diisi', true);
      var obj = Object.assign({}, data, vals);
      if (item) obj.id = item.id; else delete obj.id;
      if (tooBig(obj)) return toast(SIZE_MSG, true);
      btn.disabled = true;
      try { await DB.save(col, obj); toast('Tersimpan'); go('c:' + col); }
      catch (e) { toast(errMsg(e), true); btn.disabled = false; }
    });
    mainEl.appendChild(h('div', { class: 'savebar' }, [btn, h('button', { class: 'btn', type: 'button', onclick: function () { go('c:' + col); } }, 'Batal')]));
    window.scrollTo(0, 0);
  }

  function toolsView() {
    mainEl.appendChild(h('h2', {}, 'Backup & Info'));
    mainEl.appendChild(h('div', { class: 'card' }, [
      h('h3', {}, 'Status database'),
      h('p', {}, DB.mode === 'firebase' ? 'Terhubung ke Firebase (data live).' : 'MODE DEMO: data hanya tersimpan di browser ini. Isi js/firebase-config.js agar tersambung ke Firebase.')
    ]));
    var dl = h('button', { class: 'btn', onclick: async function () {
      try {
        var data = await DB.exportAll();
        var a = h('a', { href: URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })), download: 'backup-website-byd-' + U.today() + '.json' });
        document.body.appendChild(a); a.click(); a.remove();
      } catch (e) { toast(errMsg(e), true); }
    } }, 'Unduh backup (JSON)');
    var inp = h('input', { type: 'file', accept: 'application/json', class: 'hide' });
    inp.addEventListener('change', async function () {
      try {
        var data = JSON.parse(await inp.files[0].text());
        if (!confirm('Impor akan menimpa data dengan ID yang sama. Lanjutkan?')) return;
        await DB.importAll(data);
        S = await DB.getSettings(); toast('Backup berhasil diimpor'); render();
      } catch (e) { toast('Gagal impor: ' + errMsg(e), true); }
      inp.value = '';
    });
    mainEl.appendChild(h('div', { class: 'card' }, [
      h('h3', {}, 'Backup data'),
      h('p', {}, 'Unduh seluruh isi website (pengaturan, model, promo, delivery, testimoni, artikel) sebagai satu file. Simpan berkala.'),
      h('div', { class: 'imgact' }, [dl, h('button', { class: 'btn', onclick: function () { inp.click(); } }, 'Impor backup'), inp])
    ]));
    if (DB.mode !== 'firebase') {
      mainEl.appendChild(h('div', { class: 'card' }, [
        h('h3', {}, 'Reset data demo'),
        h('p', {}, 'Kembalikan data contoh seperti semula (hanya mode demo).'),
        h('button', { class: 'btn danger', onclick: async function () {
          if (!confirm('Hapus semua perubahan demo di browser ini?')) return;
          DB.resetDemo(); S = await DB.getSettings(); toast('Data demo direset'); render();
        } }, 'Reset data demo')
      ]));
    }
  }

  /* ---------- layout & login ---------- */
  function layout(user) {
    root.innerHTML = '';
    var banners = [];
    if (DB.mode === 'demo') banners.push(h('div', { class: 'banner demo' }, 'MODE DEMO: Firebase belum diisi. Perubahan hanya tersimpan di browser ini dan tidak tampil untuk pengunjung lain.'));
    if (DB.error) banners.push(h('div', { class: 'banner err' }, 'Gagal memuat Firebase: ' + (DB.error.message || DB.error) + '. Periksa koneksi dan js/firebase-config.js.'));
    root.appendChild(h('div', { class: 'top' }, [
      h('strong', {}, 'Panel Admin · ' + (S.siteName || '')),
      h('span', { class: 'sp' }),
      h('a', { class: 'btn sm', href: '../index.html', target: '_blank', rel: 'noopener' }, 'Lihat situs ↗'),
      DB.mode === 'firebase' ? h('span', { class: 'muted' }, user.email || '') : null,
      DB.mode === 'firebase' ? h('button', { class: 'btn sm', onclick: function () { DB.logout(); } }, 'Keluar') : null
    ]));
    banners.forEach(function (b) { root.appendChild(b); });
    navEl = h('nav', { class: 'side' });
    mainEl = h('main', { class: 'main' });
    root.appendChild(h('div', { class: 'shell' }, [navEl, mainEl]));
    renderNav(); render();
  }

  function loginView(msg) {
    root.innerHTML = '';
    var em = h('input', { type: 'email', autocomplete: 'username', required: true });
    var pw = h('input', { type: 'password', autocomplete: 'current-password', required: true });
    var err = h('div', { class: 'err' }, msg || '');
    var btn = h('button', { class: 'btn primary', type: 'submit' }, 'Masuk');
    var form = h('form', { class: 'login' }, [
      h('h1', {}, 'Panel Admin'), h('p', { class: 'muted' }, 'Masuk untuk mengelola isi website.'),
      h('label', {}, 'Email'), em, h('label', {}, 'Password'), pw, btn, err
    ]);
    form.addEventListener('submit', async function (e) {
      e.preventDefault(); btn.disabled = true; err.textContent = '';
      try { await DB.login(em.value.trim(), pw.value); }
      catch (x) {
        err.textContent = /invalid|wrong|user-not-found|credential/i.test(x.code || x.message) ? 'Email atau password salah.' : errMsg(x);
        btn.disabled = false;
      }
    });
    root.appendChild(form);
  }

  async function boot(user) {
    try {
      S = await DB.getSettings();
      if (DB.mode === 'firebase' && !DB.hasSettings) {
        if (confirm('Database masih kosong. Isi dengan data contoh (profil, model BYD, artikel) agar bisa langsung diedit?')) {
          await DB.seedAll();
          S = await DB.getSettings();
        }
      }
      layout(user);
    } catch (e) {
      console.error(e);
      root.innerHTML = '';
      root.appendChild(h('div', { class: 'login' }, [h('h1', {}, 'Gagal memuat'), h('p', { class: 'err' }, errMsg(e)), h('button', { class: 'btn', onclick: function () { DB.logout(); } }, 'Keluar')]));
    }
  }

  DB.onAuth(function (user) { if (user) boot(user); else loginView(); });
})();
