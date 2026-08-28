/* ============================================================================
   iQuest Learning Center — behaviour
   Motion law: magnetic attraction. Everything is pulled, nothing merely fades.
   Every effect is gated on prefers-reduced-motion, and no content depends on a
   script running for it to be readable.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     CONFIG — the things you will ever need to change.
     --------------------------------------------------------------------- */
  var CONFIG = {
    phone: '+919896716957',
    whatsapp: '919896716957',
    // Also hard-coded in the index.html footer link — change both together.
    email: 'iquesttutorials@gmail.com',
    hours: {
      openMin: 15 * 60 + 30,   // 3:30 PM — the centre opens as period 1 begins
      closeMin: 20 * 60,       // 8:00 PM
      openDays: [1, 2, 3, 4, 5, 6], // Mon–Sat. The timetables show no Sunday.
      tz: 'Asia/Kolkata'
    },
    // Period boundaries from the official timetables: 45 minutes from 3:30 PM.
    periods: [
      [15 * 60 + 30, 16 * 60 + 15],
      [16 * 60 + 15, 17 * 60],
      [17 * 60, 17 * 60 + 45],
      [17 * 60 + 45, 18 * 60 + 30],
      [18 * 60 + 30, 19 * 60 + 15],
      [19 * 60 + 15, 20 * 60]
    ]
  };

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     0. Boot screen — leave it up long enough to read, then get out of the way.
        CSS dismisses it on a timer regardless, so this only ever makes it faster.
     --------------------------------------------------------------------- */
  (function boot() {
    var el = document.getElementById('boot');
    if (!el) return;
    var t0 = Date.now(), MIN = 1500;
    function done() {
      setTimeout(function () {
        el.classList.add('is-done');
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 900);
      }, Math.max(0, MIN - (Date.now() - t0)));
    }
    if (document.readyState === 'complete') done();
    else window.addEventListener('load', done);
    // hard stop, in case `load` never fires (a stalled image, a dead font)
    setTimeout(done, 3000);
  })();

  /* ---------------------------------------------------------------------
     1. Year + email wiring
     --------------------------------------------------------------------- */
  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();
  $$('[data-email]').forEach(function (a) { a.href = 'mailto:' + CONFIG.email; });
  $$('[data-email-text]').forEach(function (s) { s.textContent = CONFIG.email; });

  /* ---------------------------------------------------------------------
     2. Header state, scroll progress, sticky rail
     --------------------------------------------------------------------- */
  var top = $('#top'), prog = $('#prog'), rail = $('#rail'), hero = $('#hero');
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (top) top.classList.toggle('is-stuck', y > 24);
    if (prog) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.transform = 'scaleX(' + (h > 0 ? Math.min(y / h, 1) : 0) + ')';
    }
    if (rail && hero) rail.classList.toggle('is-on', y > hero.offsetHeight * 0.6);
    spy();
    spine();
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });

  /* ---------------------------------------------------------------------
     3. Mobile drawer
     --------------------------------------------------------------------- */
  var burger = $('#burger'), drawer = $('#drawer');
  function setDrawer(open) {
    if (!drawer || !burger) return;
    drawer.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) burger.addEventListener('click', function () {
    setDrawer(burger.getAttribute('aria-expanded') !== 'true');
  });
  if (drawer) $$('a', drawer).forEach(function (a) {
    a.addEventListener('click', function () { setDrawer(false); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setDrawer(false); });

  /* ---------------------------------------------------------------------
     4. Scrollspy
     --------------------------------------------------------------------- */
  var navLinks = $$('.nav a');
  var sections = navLinks.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
  function spy() {
    if (!sections.length) return;
    var mark = window.pageYOffset + window.innerHeight * 0.32;
    var active = -1;
    sections.forEach(function (s, i) {
      if (s.getBoundingClientRect().top + window.pageYOffset <= mark) active = i;
    });
    navLinks.forEach(function (a, i) { a.classList.toggle('is-active', i === active); });
  }

  /* ---------------------------------------------------------------------
     5. Hero headline — split into words, revealed on load (never scroll-gated)
     --------------------------------------------------------------------- */
  var h1 = $('.pull-words');
  if (h1 && !reduced) {
    var frag = document.createDocumentFragment();
    (function walk(node, into) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach(function (chunk) {
            if (!chunk) return;
            if (/^\s+$/.test(chunk)) { into.appendChild(document.createTextNode(' ')); return; }
            var s = document.createElement('span');
            s.textContent = chunk;
            into.appendChild(s);
          });
        } else if (n.nodeType === 1) {
          var clone = n.cloneNode(false);
          walk(n, clone);
          into.appendChild(clone);
        }
      });
    })(h1, frag);
    h1.textContent = '';
    h1.appendChild(frag);
    $$('span', h1).forEach(function (s, i) { s.style.transitionDelay = (120 + i * 55) + 'ms'; });
  }
  function liftHero() { if (h1) h1.classList.add('in'); }
  requestAnimationFrame(function () { requestAnimationFrame(liftHero); });
  setTimeout(liftHero, 900);

  /* ---------------------------------------------------------------------
     6. Reveal on scroll, with failsafes so nothing is ever stranded
     --------------------------------------------------------------------- */
  var revealables = $$('[data-anim], .rule, .step').filter(function (el) {
    return !hero || !hero.contains(el);
  });

  function show(el) {
    if (el.classList.contains('in')) return;
    el.classList.add('in');
    if (el.hasAttribute('data-count-host')) countUp(el);
  }

  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        show(e.target);
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -9% 0px', threshold: 0.12 });
    revealables.forEach(function (el) { io.observe(el); });

    /* Content must never be stranded at opacity 0 because the observer was
       throttled — a background tab, a hidden pane, an old engine. */
    var sweep = function () {
      revealables.forEach(function (el) {
        if (el.classList.contains('in')) return;
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) { show(el); io.unobserve(el); }
      });
    };
    window.addEventListener('load', function () { setTimeout(sweep, 260); });
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) setTimeout(sweep, 60);
    });
    setTimeout(sweep, 1400);
    setTimeout(function () {
      revealables.forEach(function (el) { show(el); io.unobserve(el); });
    }, 4000);
  } else {
    revealables.forEach(show);
  }

  /* ---------------------------------------------------------------------
     7. Count-up
     --------------------------------------------------------------------- */
  function countUp(host) {
    $$('[data-count]', host).forEach(function (el) {
      if (el.hasAttribute('data-plain') || el.dataset.done) return;
      el.dataset.done = '1';
      var target = parseFloat(el.getAttribute('data-count'));
      var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
      if (isNaN(target)) return;
      if (reduced) { el.textContent = target.toFixed(dec); return; }
      var t0 = null, dur = 1150, settled = false;
      function step(t) {
        if (settled) return;
        if (t0 === null) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        el.textContent = (target * (1 - Math.pow(1 - p, 3))).toFixed(dec);
        if (p < 1) requestAnimationFrame(step);
        else { settled = true; el.textContent = target.toFixed(dec); }
      }
      requestAnimationFrame(step);
      // If rAF is throttled, never leave a wrong number on screen.
      setTimeout(function () {
        if (!settled) { settled = true; el.textContent = target.toFixed(dec); }
      }, dur + 600);
    });
  }
  $$('.band__cell').forEach(function (c) { c.setAttribute('data-count-host', ''); });
  /* True figures live in the HTML so a failed script still shows facts. Only
     once we know the counter can run do we zero the start — the band sits below
     the fold, so this is never seen. */
  if (!reduced) {
    $$('[data-count]').forEach(function (el) {
      if (el.hasAttribute('data-plain')) return;
      el.textContent = (0).toFixed(parseInt(el.getAttribute('data-dec') || '0', 10));
    });
  }
  if (reduced || !('IntersectionObserver' in window)) $$('.band__cell').forEach(countUp);

  /* ---------------------------------------------------------------------
     8. Centre time — everything below runs on Asia/Kolkata, never the visitor's
     --------------------------------------------------------------------- */
  var DAY_IDX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  function istParts() {
    try {
      var parts = new Intl.DateTimeFormat('en-US', {
        timeZone: CONFIG.hours.tz, weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
      }).formatToParts(new Date());
      var o = {};
      parts.forEach(function (p) { o[p.type] = p.value; });
      var hr = parseInt(o.hour, 10); if (hr === 24) hr = 0;
      return { day: DAY_IDX[o.weekday], min: hr * 60 + parseInt(o.minute, 10) };
    } catch (err) {
      var d = new Date();
      return { day: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
    }
  }
  function fmt(mins) {
    var h = Math.floor(mins / 60), m = mins % 60;
    var ap = h >= 12 ? 'PM' : 'AM', h12 = h % 12; if (h12 === 0) h12 = 12;
    return h12 + ':' + (m < 10 ? '0' : '') + m + ' ' + ap;
  }
  function gap(mins) {
    var h = Math.floor(mins / 60), m = mins % 60;
    if (h && m) return h + 'h ' + m + 'm';
    return h ? h + 'h' : m + 'm';
  }

  function paintStatus() {
    var now = istParts(), H = CONFIG.hours;
    var openToday = H.openDays.indexOf(now.day) !== -1;
    var isOpen = openToday && now.min >= H.openMin && now.min < H.closeMin;
    var label;
    if (isOpen) label = '<b>Open now</b> · closes ' + fmt(H.closeMin);
    else if (openToday && now.min < H.openMin) label = 'Opens ' + fmt(H.openMin) + ' · in ' + gap(H.openMin - now.min);
    else {
      var ahead = 1;
      while (ahead < 8 && H.openDays.indexOf((now.day + ahead) % 7) === -1) ahead++;
      label = 'Closed · opens ' + (ahead === 1 ? 'tomorrow' : 'Monday') + ' at ' + fmt(H.openMin);
    }
    $$('.status').forEach(function (el) {
      el.classList.toggle('is-open', isOpen);
      var t = $('.status__txt', el);
      if (t) t.innerHTML = label;
    });
    $$('#hours tr').forEach(function (tr) {
      tr.classList.toggle('is-today', parseInt(tr.getAttribute('data-day'), 10) === now.day);
    });
    paintTimetable(now);
  }

  /* ---------------------------------------------------------------------
     9. Timetables — real schedules, with today's row and the period running
        right now marked live
     --------------------------------------------------------------------- */
  function paintTimetable(now) {
    var live = null;
    if (CONFIG.hours.openDays.indexOf(now.day) !== -1) {
      CONFIG.periods.forEach(function (p, i) {
        if (now.min >= p[0] && now.min < p[1]) live = i;
      });
    }

    $$('.tt').forEach(function (tt) {
      $$('tbody tr', tt).forEach(function (tr) {
        var isToday = parseInt(tr.getAttribute('data-day'), 10) === now.day;
        tr.classList.toggle('is-today', isToday);
        $$('td', tr).forEach(function (td, i) {
          td.classList.toggle('is-live', isToday && live !== null && i === live);
        });
      });
      $$('thead th', tt).forEach(function (th, i) {
        // first header cell is the Days column
        th.classList.toggle('is-live', live !== null && i - 1 === live);
      });
    });

    var note = $('#ttNow');
    if (note) {
      if (live !== null) {
        note.innerHTML = '<b>Period ' + (live + 1) + '</b> is running now · ' +
          fmt(CONFIG.periods[live][0]) + ' – ' + fmt(CONFIG.periods[live][1]);
        note.classList.add('is-live');
      } else {
        note.textContent = 'Periods run 3:30 PM to 8:00 PM, Monday to Saturday.';
        note.classList.remove('is-live');
      }
    }
  }

  (function () {
    var tabs = $$('.ttab');
    if (!tabs.length) return;
    function pick(cls) {
      tabs.forEach(function (t) {
        t.setAttribute('aria-selected', String(t.getAttribute('data-class') === cls));
      });
      $$('.tt').forEach(function (tt) {
        tt.hidden = tt.getAttribute('data-class') !== cls;
      });
    }
    tabs.forEach(function (t) {
      t.addEventListener('click', function () { pick(t.getAttribute('data-class')); });
      t.addEventListener('keydown', function (e) {
        var i = tabs.indexOf(t), n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (n) { e.preventDefault(); n.focus(); pick(n.getAttribute('data-class')); }
      });
    });
  })();

  paintStatus();
  setInterval(paintStatus, 30000);

  /* ---------------------------------------------------------------------
     10. Magnetic buttons — the page's governing physics, at hand scale
     --------------------------------------------------------------------- */
  if (!reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('.btn, .chip, .board-tag, .rail__btn, .ttab').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        el.style.transform = 'translate(' + (dx * 7).toFixed(2) + 'px,' + (dy * 5).toFixed(2) + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------------------------------------------------------------------
     11. Hero field — motes drawn toward the pointer, like filings to a magnet
     --------------------------------------------------------------------- */
  (function field() {
    var cv = document.getElementById('field');
    if (!cv || reduced) return;
    var ctx = cv.getContext('2d', { alpha: true });
    if (!ctx) return;

    var W = 0, H = 0, dpr = 1, dots = [], raf = null, live = true;
    var pointer = { x: -9999, y: -9999, on: false };

    function size() {
      var r = cv.parentElement.getBoundingClientRect();
      // A hidden or not-yet-laid-out pane reports 0 — don't bake that in.
      if (r.width < 2 || r.height < 2) return false;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      return true;
    }
    function seed() {
      var n = W < 700 ? 42 : W < 1100 ? 68 : 94;
      dots = [];
      for (var i = 0; i < n; i++) {
        dots.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.16, vy: (Math.random() - 0.5) * 0.16,
          r: Math.random() * 2.3 + 0.9,
          a: Math.random() * 0.42 + 0.3,
          ph: Math.random() * 6.283,
          teal: Math.random() > 0.8
        });
      }
    }
    function draw(ts) {
      ctx.clearRect(0, 0, W, H);
      var t = (ts || 0) / 1000;
      for (var i = 0; i < dots.length; i++) {
        for (var j = i + 1; j < dots.length; j++) {
          var ax = dots[i].x - dots[j].x, ay = dots[i].y - dots[j].y;
          var d2 = ax * ax + ay * ay;
          if (d2 < 20000) {
            ctx.strokeStyle = 'rgba(249,161,27,' + (0.2 * (1 - d2 / 20000)).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(dots[j].x, dots[j].y); ctx.stroke();
          }
        }
      }
      for (var k = 0; k < dots.length; k++) {
        var p = dots[k];
        if (pointer.on) {
          var dx = pointer.x - p.x, dy = pointer.y - p.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 190 && dist > 0.5) {
            var pull = (1 - dist / 190) * 0.055;
            p.vx += (dx / dist) * pull;
            p.vy += (dy / dist) * pull;
          }
        }
        p.vx *= 0.985; p.vy *= 0.985;
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.2832);
        var puls = p.a * (0.72 + 0.28 * Math.sin(t * 0.9 + p.ph));
        ctx.fillStyle = p.teal
          ? 'rgba(64,214,232,' + puls.toFixed(3) + ')'
          : 'rgba(255,190,105,' + puls.toFixed(3) + ')';
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    function start() { if (!raf && live) raf = requestAnimationFrame(draw); }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

    window.addEventListener('pointermove', function (e) {
      var r = cv.getBoundingClientRect();
      pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
      pointer.on = pointer.x > -60 && pointer.x < W + 60 && pointer.y > -60 && pointer.y < H + 60;
    }, { passive: true });
    window.addEventListener('pointerleave', function () { pointer.on = false; });

    var ro = window.ResizeObserver ? new ResizeObserver(size) : null;
    if (ro) ro.observe(cv.parentElement); else window.addEventListener('resize', size);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        live = es[0].isIntersecting;
        if (live) start(); else stop();
      }, { threshold: 0 }).observe(cv);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stop(); return; }
      if (!W || W < 2) size();
      start();
    });
    window.addEventListener('load', function () { if (!W || W < 2) size(); start(); });

    if (size()) start();
  })();

  /* ---------------------------------------------------------------------
     11b. The hero mark leans toward the pointer
     --------------------------------------------------------------------- */
  (function () {
    var stage = document.querySelector('.hero__mark');
    var mark = stage && stage.querySelector('.mark');
    if (!mark || reduced) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var raf = null, tx = 0, ty = 0;
    function apply() {
      raf = null;
      mark.style.transform =
        'perspective(900px) rotateY(' + (tx * 9).toFixed(2) + 'deg) rotateX(' +
        (-ty * 9).toFixed(2) + 'deg) translate3d(' + (tx * 12).toFixed(1) + 'px,' +
        (ty * 10).toFixed(1) + 'px,0)';
    }
    window.addEventListener('pointermove', function (e) {
      var r = stage.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      tx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
      ty = (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2);
      tx = Math.max(-1, Math.min(1, tx)); ty = Math.max(-1, Math.min(1, ty));
      if (!raf) raf = requestAnimationFrame(apply);
    }, { passive: true });
    window.addEventListener('pointerleave', function () {
      tx = ty = 0; if (!raf) raf = requestAnimationFrame(apply);
    });
  })();

  /* ---------------------------------------------------------------------
     12. Subject ticker — duplicate the row so the loop is seamless
     --------------------------------------------------------------------- */
  (function () {
    var row = $('#tickerRow');
    if (!row || reduced) return;
    row.innerHTML = row.innerHTML + row.innerHTML;
  })();

  /* ---------------------------------------------------------------------
     13. Programme legend — one control governs every row it applies to
     --------------------------------------------------------------------- */
  (function () {
    var legend = $('#legend'), plan = $('#plan');
    if (!legend || !plan) return;
    var chips = $$('.chip', legend), rows = $$('.plan__row', plan);
    function apply(stage) {
      plan.classList.toggle('is-filtered', !!stage);
      rows.forEach(function (r) {
        r.classList.toggle('is-lit', !!stage && r.getAttribute('data-stage') === stage);
      });
      chips.forEach(function (c) {
        c.setAttribute('aria-pressed', String(c.getAttribute('data-stage') === stage));
      });
    }
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        var was = c.getAttribute('aria-pressed') === 'true';
        apply(was ? null : c.getAttribute('data-stage'));
      });
    });
    rows.forEach(function (r) {
      r.addEventListener('mouseenter', function () {
        if (!plan.classList.contains('is-filtered')) r.classList.add('is-lit');
      });
      r.addEventListener('mouseleave', function () {
        if (!plan.classList.contains('is-filtered')) r.classList.remove('is-lit');
      });
    });
  })();

  /* ---------------------------------------------------------------------
     14. Method spine — the line fills as you walk down the steps
     --------------------------------------------------------------------- */
  var stepsEl = $('#steps'), fillEl = $('#stepsFill');
  function spine() {
    if (!stepsEl || !fillEl) return;
    var r = stepsEl.getBoundingClientRect();
    var mark = window.innerHeight * 0.62;
    var p = (mark - r.top) / r.height;
    fillEl.style.transform = 'scaleY(' + Math.max(0, Math.min(p, 1)).toFixed(4) + ')';
  }

  /* ---------------------------------------------------------------------
     15. Map veil
     --------------------------------------------------------------------- */
  var veil = $('#mapVeil');
  if (veil) veil.addEventListener('click', function () { veil.classList.add('is-gone'); });

  /* ---------------------------------------------------------------------
     16. Enquiry form → mailto, with a WhatsApp route for the same message
     --------------------------------------------------------------------- */
  (function () {
    var form = $('#askForm');
    if (!form) return;
    var hint = $('#formHint');

    function val(id) { var el = $('#' + id); return el ? el.value.trim() : ''; }
    function flag(fieldId, bad) {
      var f = $('#' + fieldId);
      if (f) f.setAttribute('data-invalid', String(bad));
      return !bad;
    }
    function check() {
      var okName = flag('f-name', val('name').length < 2);
      var digits = val('phone').replace(/\D/g, '');
      var okPhone = flag('f-phone', !(digits.length >= 10 && digits.length <= 13));
      var okMsg = flag('f-msg', val('msg').length < 5);
      if (!okName) { $('#name').focus(); return false; }
      if (!okPhone) { $('#phone').focus(); return false; }
      if (!okMsg) { $('#msg').focus(); return false; }
      return true;
    }
    function compose() {
      return {
        subject: 'Enquiry from ' + val('name') + (val('klass') ? ' — ' + val('klass') : ''),
        body: [
          'Name: ' + val('name'),
          'Phone: ' + val('phone'),
          "Child's class: " + (val('klass') || 'not specified'),
          'Board: ' + (val('board') || 'not specified'),
          '',
          val('msg')
        ].join('\n')
      };
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!check()) return;
      var m = compose();
      window.location.href = 'mailto:' + CONFIG.email +
        '?subject=' + encodeURIComponent(m.subject) + '&body=' + encodeURIComponent(m.body);
      if (hint) {
        hint.textContent = 'Your email app should have opened with the message ready — press send there. ' +
          'Nothing happening? Call +91 98967 16957 or use WhatsApp below.';
        hint.style.color = 'var(--amber)';
      }
    });

    var wa = $('#waSend');
    if (wa) wa.addEventListener('click', function () {
      if (!check()) return;
      var m = compose();
      window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' +
        encodeURIComponent(m.subject + '\n\n' + m.body), '_blank', 'noopener');
    });

    $$('#askForm input, #askForm textarea').forEach(function (el) {
      el.addEventListener('input', function () {
        var f = el.closest('.field');
        if (f) f.setAttribute('data-invalid', 'false');
      });
    });
  })();

  /* ---------------------------------------------------------------------
     17. First paint
     --------------------------------------------------------------------- */
  onScroll();
  window.addEventListener('load', function () { onScroll(); spine(); });
})();
