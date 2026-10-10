(function () {
  'use strict';
  var CFG = window.SITE_CONFIG || {};
  var I18N = window.I18N || {};
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Language ---------- */
  var LANGS = ['en', 'ta', 'hi'];
  function applyLang(lang) {
    if (LANGS.indexOf(lang) < 0) lang = 'en';
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var e = I18N[el.getAttribute('data-i18n')];
      if (!e) return;
      if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
      el.innerHTML = lang === 'en' ? el.dataset.en : (e[lang] || el.dataset.en);
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var e = I18N[el.getAttribute('data-i18n-ph')];
      if (!e) return;
      if (el.dataset.enPh === undefined) el.dataset.enPh = el.placeholder;
      el.placeholder = lang === 'en' ? el.dataset.enPh : (e[lang] || el.dataset.enPh);
    });
    var t = I18N['title.' + (document.body.dataset.page || 'home')];
    if (t) {
      if (!document.body.dataset.enTitle) document.body.dataset.enTitle = document.title;
      document.title = lang === 'en' ? document.body.dataset.enTitle : (t[lang] || document.body.dataset.enTitle);
    }
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.classList.toggle('on', b.dataset.lang === lang);
    });
    store.set('ke-lang', lang);
  }
  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.dataset.lang); });
  });
  var saved = store.get('ke-lang');
  if (saved && saved !== 'en') applyLang(saved);
  else document.querySelectorAll('.lang button').forEach(function (b) { b.classList.toggle('on', b.dataset.lang === 'en'); });

  function tr(key, fallback) {
    var lang = document.documentElement.lang;
    var e = I18N[key];
    return (e && lang !== 'en' && e[lang]) || fallback;
  }

  /* ---------- Mobile nav ---------- */
  var burger = document.querySelector('.burger'), nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
    nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') nav.classList.remove('open'); });
  }

  /* ---------- Reveal on scroll ---------- */
  var rv = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  /* ---------- Counters ---------- */
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = parseInt(el.dataset.count, 10), suffix = el.dataset.suffix || '';
    if (!('IntersectionObserver' in window)) { el.textContent = target + suffix; return; }
    var o = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      o.disconnect();
      var start = performance.now(), dur = 1400;
      (function step(now) {
        var p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(start);
    }, { threshold: 0.5 });
    o.observe(el);
  });

  /* ---------- Gallery filter + lightbox ---------- */
  var chips = document.querySelectorAll('.chip'), items = Array.prototype.slice.call(document.querySelectorAll('.g-item'));
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      chips.forEach(function (x) { x.classList.remove('on'); });
      c.classList.add('on');
      items.forEach(function (it) { it.classList.toggle('hide', c.dataset.f !== 'all' && it.dataset.cat !== c.dataset.f); });
    });
  });
  var lb = document.querySelector('.lightbox');
  if (lb && items.length) {
    var lbImg = lb.querySelector('img'), idx = 0;
    var visible = function () { return items.filter(function (i) { return !i.classList.contains('hide'); }); };
    var show = function (i) {
      var v = visible(); if (!v.length) return;
      idx = (i + v.length) % v.length;
      var img = v[idx].querySelector('img');
      lbImg.src = img.src; lbImg.alt = img.alt;
    };
    items.forEach(function (it) {
      it.addEventListener('click', function () { var v = visible(); show(v.indexOf(it)); lb.classList.add('open'); });
    });
    lb.querySelector('.x').addEventListener('click', function () { lb.classList.remove('open'); });
    lb.querySelector('.p').addEventListener('click', function () { show(idx - 1); });
    lb.querySelector('.n').addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.classList.remove('open'); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') lb.classList.remove('open');
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ---------- Booking form -> WhatsApp ---------- */
  var form = document.getElementById('booking-form');
  if (form) {
    var dateEl = document.getElementById('f-date');
    if (dateEl) dateEl.min = new Date().toISOString().split('T')[0];
    var toast = document.querySelector('.toast');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (inp) {
        var valid = inp.value.trim() !== '';
        if (inp.type === 'tel') valid = /^[+0-9\s-]{10,15}$/.test(inp.value.trim());
        inp.closest('.field').classList.toggle('bad', !valid);
        if (!valid) ok = false;
      });
      if (!ok) return;
      var v = function (id) { return (document.getElementById(id).value || '').trim(); };
      var sel = document.getElementById('f-type');
      var typeText = sel.options[sel.selectedIndex].textContent;
      var msg = [
        'KING EVENTS - NEW ENQUIRY', '',
        'Name: ' + v('f-name'),
        'Phone: ' + v('f-phone'),
        'Event: ' + typeText,
        'Date: ' + v('f-date'),
        'Guests: ' + (v('f-guests') || '-'),
        'Venue/Area: ' + (v('f-venue') || '-'), '',
        'Details: ' + (v('f-msg') || '-')
      ].join('\n');
      window.open('https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
      if (toast) {
        toast.textContent = tr('form.toast', 'Opening WhatsApp — just press Send!');
        toast.classList.add('show');
        setTimeout(function () { toast.classList.remove('show'); }, 4500);
      }
      form.reset();
    });
    form.querySelectorAll('input,select').forEach(function (i) {
      i.addEventListener('input', function () { i.closest('.field').classList.remove('bad'); });
    });
  }
})();
