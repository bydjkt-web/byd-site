/*
  Lapisan data. Dua mode:
  - 'firebase': Cloud Firestore (+ Firebase Auth di halaman admin)
  - 'demo'    : data contoh + penyimpanan localStorage (jika Firebase belum diisi)
  Halaman admin harus set window.NEED_AUTH = true sebelum memuat file ini.
*/
(function () {
  'use strict';
  var cfg = window.FIREBASE_CONFIG;
  var live = !!(cfg && cfg.apiKey && cfg.projectId && String(cfg.apiKey).indexOf('ISI_') !== 0 && String(cfg.projectId).indexOf('ISI_') !== 0);
  var COLS = ['models', 'promos', 'deliveries', 'testimonials', 'articles'];
  var DB = (window.DB = { mode: live ? 'firebase' : 'demo', cols: COLS, hasSettings: false, error: null });
  var fs = null, auth = null;
  var LS = 'bydsite_demo_v1';

  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = function () { rej(new Error('Gagal memuat ' + src)); };
      document.head.appendChild(s);
    });
  }

  var B = 'https://www.gstatic.com/firebasejs/10.12.2/';
  DB.ready = (live
    ? loadScript(B + 'firebase-app-compat.js')
        .then(function () {
          var p = [loadScript(B + 'firebase-firestore-compat.js')];
          if (window.NEED_AUTH) p.push(loadScript(B + 'firebase-auth-compat.js'));
          return Promise.all(p);
        })
        .then(function () {
          firebase.initializeApp(cfg);
          fs = firebase.firestore();
          if (window.NEED_AUTH) auth = firebase.auth();
        })
    : Promise.resolve()
  ).catch(function (e) {
    console.error(e);
    DB.error = e;
    DB.mode = 'demo';
  });

  function demoRead() {
    try { var d = JSON.parse(localStorage.getItem(LS)); if (d) return d; } catch (e) {}
    return null;
  }
  function demoWrite(d) { localStorage.setItem(LS, JSON.stringify(d)); }
  function demoAll() {
    var d = demoRead();
    if (d) return d;
    d = { settings: null };
    COLS.forEach(function (c) { d[c] = U.clone(SEED[c] || []); });
    return d;
  }

  function sortItems(a, b) {
    var oa = a.order == null || a.order === '' ? 100 : Number(a.order);
    var ob = b.order == null || b.order === '' ? 100 : Number(b.order);
    if (oa !== ob) return oa - ob;
    var d = String(b.date || '').localeCompare(String(a.date || ''));
    if (d) return d;
    return String(a.title || a.name || '').localeCompare(String(b.title || b.name || ''));
  }

  DB.getSettings = async function () {
    await DB.ready;
    var saved = null;
    if (DB.mode === 'firebase') {
      var doc = await fs.collection('settings').doc('site').get();
      saved = doc.exists ? doc.data() : null;
    } else {
      saved = demoAll().settings;
    }
    DB.hasSettings = !!saved;
    return Object.assign(U.clone(DEFAULT_SETTINGS), saved || {});
  };

  DB.saveSettings = async function (obj) {
    await DB.ready;
    obj = U.clone(obj);
    if (DB.mode === 'firebase') await fs.collection('settings').doc('site').set(obj);
    else { var d = demoAll(); d.settings = obj; demoWrite(d); }
    DB.hasSettings = true;
  };

  DB.list = async function (col, opts) {
    await DB.ready;
    opts = opts || {};
    var items;
    if (DB.mode === 'firebase') {
      var snap = await fs.collection(col).get();
      items = snap.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); });
      if (!items.length && !DB.hasSettings) {
        await DB.getSettings();
        if (!DB.hasSettings) items = U.clone(SEED[col] || []);
      }
    } else {
      items = demoAll()[col] || [];
    }
    if (opts.pub) items = items.filter(function (x) { return x.published !== false; });
    return items.sort(sortItems);
  };

  DB.get = async function (col, key) {
    var items = await DB.list(col);
    key = String(key || '');
    return items.filter(function (x) { return x.slug === key || x.id === key; })[0] || null;
  };

  DB.save = async function (col, obj) {
    await DB.ready;
    obj = U.clone(obj);
    var id = obj.id;
    delete obj.id;
    if ((col === 'models' || col === 'articles') && !obj.slug) obj.slug = U.slug(obj.name || obj.title);
    if (obj.slug) obj.slug = U.slug(obj.slug);
    if (DB.mode === 'firebase') {
      if (id) await fs.collection(col).doc(id).set(obj);
      else id = (await fs.collection(col).add(obj)).id;
    } else {
      var d = demoAll();
      d[col] = d[col] || [];
      if (!id) id = 'x' + Date.now().toString(36);
      var i = d[col].findIndex(function (x) { return x.id === id; });
      obj.id = id;
      if (i >= 0) d[col][i] = obj; else d[col].push(obj);
      demoWrite(d);
    }
    return id;
  };

  DB.remove = async function (col, id) {
    await DB.ready;
    if (DB.mode === 'firebase') await fs.collection(col).doc(id).delete();
    else { var d = demoAll(); d[col] = (d[col] || []).filter(function (x) { return x.id !== id; }); demoWrite(d); }
  };

  /* Isi database Firestore dengan data contoh (sekali, saat masih kosong) */
  DB.seedAll = async function () {
    await DB.ready;
    if (DB.mode !== 'firebase') return;
    var batch = fs.batch();
    batch.set(fs.collection('settings').doc('site'), U.clone(DEFAULT_SETTINGS));
    COLS.forEach(function (c) {
      (SEED[c] || []).forEach(function (it) {
        var o = U.clone(it), id = o.id;
        delete o.id;
        batch.set(fs.collection(c).doc(id), o);
      });
    });
    await batch.commit();
    DB.hasSettings = true;
  };

  DB.exportAll = async function () {
    var out = { _app: 'byd-site', _version: 1, settings: await DB.getSettings() };
    for (var i = 0; i < COLS.length; i++) out[COLS[i]] = await DB.list(COLS[i]);
    return out;
  };

  DB.importAll = async function (data) {
    if (!data || data._app !== 'byd-site') throw new Error('File backup tidak dikenali');
    await DB.ready;
    if (DB.mode === 'firebase') {
      var batch = fs.batch();
      batch.set(fs.collection('settings').doc('site'), data.settings || {});
      COLS.forEach(function (c) {
        (data[c] || []).forEach(function (it) {
          var o = U.clone(it), id = o.id || fs.collection(c).doc().id;
          delete o.id;
          batch.set(fs.collection(c).doc(id), o);
        });
      });
      await batch.commit();
    } else {
      var d = { settings: data.settings || null };
      COLS.forEach(function (c) { d[c] = data[c] || []; });
      demoWrite(d);
    }
    DB.hasSettings = true;
  };

  DB.resetDemo = function () { localStorage.removeItem(LS); };

  /* Auth (admin) */
  DB.onAuth = function (cb) {
    DB.ready.then(function () {
      if (DB.mode === 'firebase' && auth) auth.onAuthStateChanged(cb);
      else cb({ email: 'mode-demo' });
    });
  };
  DB.login = function (email, pw) { return auth.signInWithEmailAndPassword(email, pw); };
  DB.logout = function () { return auth ? auth.signOut() : Promise.resolve(); };
})();
