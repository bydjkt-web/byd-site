/* Utilitas bersama (front end + admin) */
(function () {
  'use strict';
  var U = (window.U = {});

  U.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  U.slug = function (s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
  };

  U.safeUrl = function (u) {
    u = String(u == null ? '' : u).trim();
    return /^(https?:|mailto:|tel:|\/|#|\.\/|[a-z0-9_\-]+\.html)/i.test(u) ? u : '#';
  };

  U.safeImg = function (u) {
    u = String(u == null ? '' : u).trim();
    return /^(https?:\/\/|data:image\/(png|jpe?g|webp|gif);base64,|\/|\.\/|[a-z0-9_\-\/]+\.(png|jpe?g|webp|gif|svg))/i.test(u) ? u : '';
  };

  /* Markdown ringan: inline */
  U.inline = function (t) {
    var s = U.esc(t);
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, function (m, a, u) {
      var src = U.safeImg(u.replace(/&amp;/g, '&'));
      return src ? '<img src="' + U.esc(src) + '" alt="' + a + '" loading="lazy">' : '';
    });
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, a, u) {
      var href = U.safeUrl(u.replace(/&amp;/g, '&'));
      return '<a href="' + U.esc(href) + '" rel="noopener">' + a + '</a>';
    });
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
    return s;
  };

  /* Markdown ringan: blok (## judul, ### sub, - list, 1. list, > kutipan, paragraf) */
  U.md = function (text) {
    var lines = String(text || '').replace(/\r/g, '').split('\n'),
      out = [],
      para = [],
      list = null;
    function flushP() {
      if (para.length) {
        out.push('<p>' + U.inline(para.join('\n')).replace(/\n/g, '<br>') + '</p>');
        para = [];
      }
    }
    function flushL() {
      if (list) {
        out.push('<' + list.t + '>' + list.i.map(function (x) { return '<li>' + U.inline(x) + '</li>'; }).join('') + '</' + list.t + '>');
        list = null;
      }
    }
    lines.forEach(function (raw) {
      var l = raw.trim(), m;
      if (!l) { flushP(); flushL(); return; }
      if ((m = l.match(/^(#{2,3}) (.+)/))) {
        flushP(); flushL();
        out.push('<h' + m[1].length + '>' + U.inline(m[2]) + '</h' + m[1].length + '>');
        return;
      }
      if ((m = l.match(/^[-*] (.+)/))) {
        flushP();
        if (!list || list.t !== 'ul') { flushL(); list = { t: 'ul', i: [] }; }
        list.i.push(m[1]);
        return;
      }
      if ((m = l.match(/^\d+\. (.+)/))) {
        flushP();
        if (!list || list.t !== 'ol') { flushL(); list = { t: 'ol', i: [] }; }
        list.i.push(m[1]);
        return;
      }
      if ((m = l.match(/^> (.+)/))) {
        flushP(); flushL();
        out.push('<blockquote>' + U.inline(m[1]) + '</blockquote>');
        return;
      }
      flushL();
      para.push(l);
    });
    flushP(); flushL();
    return out.join('\n');
  };

  /* Nomor WhatsApp: terima 0857..., 857..., 62857... */
  U.phone = function (n) {
    n = String(n || '').replace(/\D/g, '');
    if (n.indexOf('0') === 0) n = '62' + n.slice(1);
    else if (n.indexOf('8') === 0) n = '62' + n;
    return n;
  };
  U.phoneShow = function (n) {
    n = U.phone(n);
    if (n.indexOf('62') !== 0) return n;
    return ('0' + n.slice(2)).replace(/^(\d{4})(\d{4})(\d+)$/, '$1-$2-$3');
  };
  U.wa = function (S, text) {
    return 'https://wa.me/' + U.phone(S.whatsapp) + '?text=' + encodeURIComponent(text || S.waText || '');
  };

  var BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  U.fmtDate = function (iso) {
    var m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return String(iso || '');
    return parseInt(m[3], 10) + ' ' + BULAN[parseInt(m[2], 10) - 1] + ' ' + m[1];
  };

  U.stars = function (n) {
    n = Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
    return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);
  };

  U.today = function () {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  };

  /* Perkecil gambar di browser lalu jadikan data URL (disimpan langsung di database) */
  U.resizeImage = function (file, maxW, quality) {
    maxW = maxW || 1000;
    quality = quality || 0.8;
    return new Promise(function (resolve, reject) {
      if (!file || !/^image\//.test(file.type)) return reject(new Error('File harus berupa gambar'));
      var fr = new FileReader();
      fr.onerror = function () { reject(new Error('Gagal membaca file')); };
      fr.onload = function () {
        var im = new Image();
        im.onerror = function () { reject(new Error('Gambar tidak valid')); };
        im.onload = function () {
          var w = im.width, h = im.height;
          if (w > maxW) { h = Math.round((h * maxW) / w); w = maxW; }
          var c = document.createElement('canvas');
          c.width = w; c.height = h;
          var ctx = c.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(im, 0, 0, w, h);
          resolve(c.toDataURL('image/jpeg', quality));
        };
        im.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  };

  U.clone = function (o) { return JSON.parse(JSON.stringify(o)); };
})();
