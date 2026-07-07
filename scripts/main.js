// Active nav detection (topbar + mobile overlay)
(function() {
  var links = document.querySelectorAll('.topbar-nav a, .mob-nav-link');
  if (!links.length) return;
  var path = window.location.pathname;
  links.forEach(function(link) {
    link.classList.remove('active');
    var href = link.getAttribute('href');
    if (href === '/' && (path === '/' || path === '/index.html')) {
      link.classList.add('active');
    } else if (href !== '/' && path.indexOf(href) !== -1) {
      link.classList.add('active');
    }
  });
})();

// Mobile nav overlay
(function() {
  var btn = document.getElementById('menuBtn');
  var nav = document.getElementById('mobNav');
  if (!btn || !nav) return;

  function openMenu() {
    nav.classList.add('open');
    btn.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    nav.classList.remove('open');
    btn.classList.remove('open');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', openMenu);
  nav.addEventListener('click', function(e) {
    if (e.target === nav) closeMenu();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeMenu();
  });
})();

  // hero bg reveal
  if (document.getElementById('heroBg')) {
  window.addEventListener('load', () => {
    document.getElementById('heroBg').classList.add('go');
  });
  }

  // hero parallax
  const hBg = document.getElementById('heroBg');
  if (hBg) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight * 1.4)
      hBg.style.transform = `scale(1) translateY(${window.scrollY * 0.22}px)`;
  }, { passive: true });
  }

  // sticky topbar state
  const topbar = document.getElementById('topbar');
  if (topbar) {
  window.addEventListener('scroll', () => {
    topbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
  }

  // progress bar
  const progress = document.getElementById('progress');
  if (progress) {
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    progress.style.width = scrolled + '%';
  }, { passive: true });
  }

  // scroll reveal
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-r]').forEach(el => io.observe(el));

  // custom cursor
  const dot = document.getElementById('curDot');
  const ring = document.getElementById('curRing');
  if (dot && ring) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });

  (function loop() {
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  // ring grows on interactives
  document.querySelectorAll('a, button, .who-c, .gal-cell, .reel-sound').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '58px'; ring.style.height = '58px';
      ring.style.borderColor = 'rgba(202,211,2,.9)';
      ring.style.background = 'rgba(202,211,2,.05)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '34px'; ring.style.height = '34px';
      ring.style.borderColor = 'rgba(202,211,2,.40)';
      ring.style.background = 'transparent';
    });
  });
  }

  // video sound toggle
  const reelSound = document.getElementById('reelSound');
  if (reelSound) {
  const reelVideos = [document.getElementById('reelDesk'), document.getElementById('reelMob')];
  const iconMuted = document.getElementById('iconMuted');
  const iconSound = document.getElementById('iconSound');
  let reelMuted = true;
  reelSound.addEventListener('click', () => {
    reelMuted = !reelMuted;
    reelVideos.forEach(v => { if (v) { v.muted = reelMuted; v.volume = 1; } });
    iconMuted.style.display = reelMuted ? '' : 'none';
    iconSound.style.display = reelMuted ? 'none' : '';
    reelSound.setAttribute('aria-label', reelMuted ? 'Ativar som' : 'Silenciar');
  });
  }

  // ── Seções 2-4: Carousel + Scroll Story + Lab
/* ============================================================
   SECTION 2: CAROUSEL LOGIC
   ============================================================ */
(function () {
  var section = document.getElementById('sec-experience');
  if (!section) return;

  var slides = section.querySelectorAll('.exp-car-slide');
  var dots   = section.querySelectorAll('.exp-car-dot');
  var btnPrev = section.querySelector('.exp-car-arrow--prev');
  var btnNext = section.querySelector('.exp-car-arrow--next');

  var total      = slides.length;
  var current    = 0;
  var timer      = null;
  var isAnimating = false;
  var INTERVAL   = 6000;

  function goTo(idx, direction) {
    if (isAnimating || idx === current) return;
    isAnimating = true;

    var prev = current;
    current = (idx + total) % total;

    slides[prev].classList.add('exp-car-slide--exit');
    slides[prev].classList.remove('exp-car-slide--active');

    // Set enter direction
    slides[current].style.transform = direction === 'prev' ? 'translateX(-40px)' : 'translateX(40px)';
    slides[current].style.opacity = '0';
    slides[current].classList.add('exp-car-slide--active');

    // Force reflow
    slides[current].getBoundingClientRect();
    slides[current].style.transform = '';
    slides[current].style.opacity = '';

    dots[prev].classList.remove('exp-car-dot--active');
    dots[prev].setAttribute('aria-selected', 'false');
    dots[current].classList.add('exp-car-dot--active');
    dots[current].setAttribute('aria-selected', 'true');

    setTimeout(function () {
      slides[prev].classList.remove('exp-car-slide--exit');
      isAnimating = false;
    }, 640);
  }

  function next() { goTo(current + 1, 'next'); }
  function prev() { goTo(current - 1, 'prev'); }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(next, INTERVAL);
  }

  function stopTimer() { clearInterval(timer); }

  // Initialise first slide
  slides[0].classList.add('exp-car-slide--active');

  if (btnNext) btnNext.addEventListener('click', function () { next(); startTimer(); });
  if (btnPrev) btnPrev.addEventListener('click', function () { prev(); startTimer(); });

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goTo(parseInt(dot.dataset.index, 10), 'next');
      startTimer();
    });
  });

  // Hover pause
  section.addEventListener('mouseenter', stopTimer);
  section.addEventListener('mouseleave', startTimer);

  // Touch / swipe
  var touchStartX = 0;
  section.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    stopTimer();
  }, { passive: true });

  section.addEventListener('touchend', function (e) {
    var delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      delta > 0 ? next() : prev();
    }
    startTimer();
  }, { passive: true });

  // Keyboard accessibility
  section.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { prev(); startTimer(); }
    if (e.key === 'ArrowRight') { next(); startTimer(); }
  });

  startTimer();
})();


/* -- Scroll Lock Cinematic (sec-custom) -- */
(function() {
  var section   = document.getElementById('sec-custom');
  if (!section) return;
  var layers    = section.querySelectorAll('.story-layer');
  var textItems = section.querySelectorAll('.story-text-item');
  var dotEls    = section.querySelectorAll('.story-lock-dot');
  var n = layers.length;
  if (!n) return;

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }

  var lastActive = -1;

  function update() {
    var vh = window.innerHeight;
    var rect = section.getBoundingClientRect();
    var scrollRange = Math.max(1, section.offsetHeight - vh);
    var progress = clamp(-rect.top / scrollRange, 0, 1);
    var step = progress * (n - 1);
    var activeIdx = Math.min(Math.floor(step), n - 1);
    var t = step - activeIdx;

    /* ── IMAGE LAYERS: scale + opacity only ── */
    layers.forEach(function(layer, i) {
      var img = layer.querySelector('.story-layer-img');
      if (!img) return;
      var imgScale, imgOpacity;

      if (i < activeIdx) {
        imgScale   = 0.93;
        imgOpacity = 0.15;
      } else if (i === activeIdx) {
        imgScale   = lerp(1.0,  0.93, t);
        imgOpacity = lerp(1.0,  0.15, t);
      } else if (i === activeIdx + 1) {
        imgScale   = lerp(1.07, 1.0,  t);
        imgOpacity = lerp(0.0,  1.0,  t);
      } else {
        imgScale   = 1.07;
        imgOpacity = 0.0;
      }

      img.style.transform = 'scale(' + imgScale.toFixed(4) + ')';
      img.style.opacity   = imgOpacity.toFixed(4);
    });

    /* ── TEXT ITEMS: always 100% opacity when active ── */
    textItems.forEach(function(item, i) {
      var textOpacity, textY;

      if (i < activeIdx) {
        /* already gone — slide up and invisible */
        textOpacity = 0;
        textY = -24;
      } else if (i === activeIdx) {
        /* Active: slides up and fades OUT, completely gone by t=0.28 */
        var outP = clamp(t / 0.28, 0, 1);
        textOpacity = 1.0 - outP;
        textY = lerp(0, -24, outP);
      } else if (i === activeIdx + 1) {
        /* Next: completely invisible until t=0.72, slides in from below */
        var inP = clamp((t - 0.72) / 0.28, 0, 1);
        textOpacity = inP;
        textY = lerp(24, 0, inP);
      } else {
        /* Not yet — waiting below */
        textOpacity = 0;
        textY = 24;
      }

      item.style.opacity   = textOpacity.toFixed(4);
      item.style.transform = 'translateY(' + textY.toFixed(1) + 'px)';
    });

    /* ── DOTS ── */
    if (activeIdx !== lastActive) {
      dotEls.forEach(function(d, i) {
        d.classList.toggle('active', i === activeIdx);
      });
      lastActive = activeIdx;
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
})();

  // ── Seções 5-8: Ativações + Performance + Pressão + Pessoas
/* ── Section 7: pressure items sequential reveal ── */
(function () {
  var pressureSection = document.getElementById('sec-pressure');
  if (!pressureSection) return;

  var items = pressureSection.querySelectorAll('.pressure-item');
  var triggered = false;

  function triggerPressureList() {
    if (triggered) return;
    triggered = true;
    pressureSection.classList.add('in-view');
    items.forEach(function (item) {
      item.classList.add('visible');
    });
  }

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        triggerPressureList();
        obs.disconnect();
      }
    });
  }, { threshold: 0.25 });

  obs.observe(pressureSection);
})();

/* ── Section 8: people lines scale-in reveal (supplement data-r) ── */
(function () {
  var lineEls = document.querySelectorAll('.people-line-top[data-r], .people-line-bottom[data-r]');
  if (!lineEls.length) return;

  var lineObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        lineObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  lineEls.forEach(function (el) { lineObs.observe(el); });
})();

/* ── Ativações: showcase tabs (desktop) ── */
(function () {
  var showcase = document.querySelector('.atv-showcase');
  if (!showcase) return;

  var tabs   = Array.from(showcase.querySelectorAll('.atv-tab'));
  var panels = Array.from(showcase.querySelectorAll('.atv-panel'));

  function activate(idx) {
    tabs.forEach(function (t, i) {
      t.classList.toggle('atv-tab--active', i === idx);
      t.setAttribute('aria-selected', i === idx ? 'true' : 'false');
    });
    panels.forEach(function (p, i) {
      p.classList.toggle('atv-panel--active', i === idx);
    });
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { activate(i); });
    tab.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); activate((i + 1) % tabs.length); tabs[(i + 1) % tabs.length].focus(); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); activate((i - 1 + tabs.length) % tabs.length); tabs[(i - 1 + tabs.length) % tabs.length].focus(); }
    });
  });

  activate(0);
})();

/* ── Ativações: mobile carousel — transform + swipe + setas ── */
(function () {
  var track   = document.getElementById('atvTrack');
  var prev    = document.getElementById('atvPrev');
  var next    = document.getElementById('atvNext');
  var dotsC   = document.getElementById('atvDots');
  var counter = document.getElementById('atvCounter');
  if (!track) return;

  var slides  = Array.from(track.querySelectorAll('.atv-slide'));
  var total   = slides.length;
  var current = 0;
  var startX  = 0;

  var dots = slides.map(function (_, i) {
    var d = document.createElement('button');
    d.className = 'atv-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Ir para ativação ' + (i + 1));
    d.addEventListener('click', function () { goTo(i); });
    if (dotsC) dotsC.appendChild(d);
    return d;
  });

  function goTo(idx) {
    current = ((idx % total) + total) % total;
    track.style.transform = 'translateX(' + (-current * 100) + '%)';
    dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
    if (counter) counter.textContent = ('0' + (current + 1)).slice(-2) + ' / 0' + total;
  }

  if (prev) prev.addEventListener('click', function () { goTo(current - 1); });
  if (next) next.addEventListener('click', function () { goTo(current + 1); });

  track.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 48) goTo(dx < 0 ? current + 1 : current - 1);
  }, { passive: true });

  goTo(0);
})();

/* ── Carrossel DNA da Pista: auto-scroll + loop infinito no mobile ── */
(function() {
  if (window.innerWidth > 900) return;
  var carousel = document.querySelector('.leg-carousel');
  if (!carousel) return;

  var paused = false;
  var resumeTimer;
  var SPEED = 0.9; // px por frame

  function step() {
    if (!paused) {
      carousel.scrollLeft += SPEED;
      var half = Math.floor(carousel.scrollWidth / 2);
      if (carousel.scrollLeft >= half) {
        carousel.scrollLeft -= half;
      }
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);

  carousel.addEventListener('touchstart', function() {
    paused = true;
    clearTimeout(resumeTimer);
  }, { passive: true });

  carousel.addEventListener('touchend', function() {
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(function() { paused = false; }, 2000);
  }, { passive: true });
})();

  /* -- Caterham Exp Scatter → Panel (sec-caterham-exp) -- */
(function() {
  var section = document.getElementById('sec-caterham-exp');
  if (!section) return;
  var intro   = document.getElementById('cteIntro');
  var cards   = Array.from(section.querySelectorAll('.cte-photo-card'));
  if (!cards.length) return;

  // Desktop: 4+4+3
  var D_SCATTER = [
    [-54,-50,-14],[-26,-54,10],[4,-52,-6],[30,-54,14],[56,-48,-9],
    [-44,3,11],[-16,-4,-16],[17,2,6],[46,-3,-12],
    [-28,52,-13],[15,54,9]
  ];
  var D_GRID = [
    [-36,-32,0],[-12,-32,0],[12,-32,0],[36,-32,0],
    [-36,0,0],[-12,0,0],[12,0,0],[36,0,0],
    [-24,32,0],[0,32,0],[24,32,0]
  ];

  // Tablet 641-768px: 3+3+3+2
  var T_SCATTER = [
    [-40,-46,-12],[0,-52,8],[40,-46,-6],
    [-46,-4,11],[0,-4,-14],[46,-4,6],
    [-40,30,-10],[0,30,6],[40,30,-12],
    [-22,52,-11],[22,52,8]
  ];
  var T_GRID = [
    [-30,-27,0],[0,-27,0],[30,-27,0],
    [-30,-9,0],[0,-9,0],[30,-9,0],
    [-30,9,0],[0,9,0],[30,9,0],
    [-16,27,0],[16,27,0]
  ];

  // Mobile <=640px: scatter explosivo (portrait 2:3)
  var M_SCATTER = [
    [-38,-52,-12],[0,-60,8],[38,-52,-6],
    [-46,-4,11],[0,-4,-14],[46,-4,6],
    [-38,38,-10],[0,38,6],[38,38,-12],
    [-22,60,-11],[22,60,8]
  ];

  // Calcula posições das linhas dinamicamente para preencher 100vh sem espaços
  function calcMobileGrid(vw, vh) {
    var cardW = Math.min(Math.max(90, vw * 0.31), 145);
    var cardH = cardW * 1.5; // aspect-ratio 2/3 → height = width × 3/2
    var cardHvh = cardH / vh * 100;
    var rows = 4;
    var idealGap = (100 - rows * cardHvh) / (rows - 1);
    var gap = Math.min(cardHvh * 0.42, Math.max(0.8, idealGap));
    var rowSpacing = cardHvh + gap;
    var r0Y = -1.5 * rowSpacing;
    var col = 30;
    return [
      [-col, r0Y,              0],[0, r0Y,              0],[col, r0Y,              0],
      [-col, r0Y+rowSpacing,   0],[0, r0Y+rowSpacing,   0],[col, r0Y+rowSpacing,   0],
      [-col, r0Y+rowSpacing*2, 0],[0, r0Y+rowSpacing*2, 0],[col, r0Y+rowSpacing*2, 0],
      [-col/2, r0Y+rowSpacing*3, 0],[col/2, r0Y+rowSpacing*3, 0]
    ];
  }

  var SCATTER, GRID, lastVW = -1, lastVH = -1;
  function refreshLayout() {
    var vw = window.innerWidth, vh = window.innerHeight;
    if (vw === lastVW && vh === lastVH) return;
    lastVW = vw; lastVH = vh;
    if (vw <= 640)      { SCATTER = M_SCATTER; GRID = calcMobileGrid(vw, vh); }
    else if (vw <= 768) { SCATTER = T_SCATTER; GRID = T_GRID; }
    else                { SCATTER = D_SCATTER; GRID = D_GRID; }
  }

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeOutBack(t) {
    var c1 = 1.5, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  var SPREAD_START     = 0.08;
  var STAGGER          = 0.004;
  var CARD_DUR         = 0.18;
  var ORGANIZE_START   = 0.34;
  var ORGANIZE_DUR     = 0.50;
  var ORGANIZE_STAGGER = 0.006;

  function update() {
    refreshLayout();
    var vh = window.innerHeight;
    var rect = section.getBoundingClientRect();
    var scrollRange = Math.max(1, section.offsetHeight - vh);
    var progress = clamp(-rect.top / scrollRange, 0, 1);

    if (intro) {
      intro.style.opacity = (1 - clamp((progress - 0.06) / 0.12, 0, 1)).toFixed(4);
    }

    cards.forEach(function(card, i) {
      var cStart = SPREAD_START + i * STAGGER;
      var t1 = clamp((progress - cStart) / CARD_DUR, 0, 1);
      var e1 = t1 < 1 ? easeOutBack(t1) : 1;

      var oStart = ORGANIZE_START + i * ORGANIZE_STAGGER;
      var t2 = clamp((progress - oStart) / ORGANIZE_DUR, 0, 1);
      var e2 = easeInOutCubic(t2);

      var s = SCATTER[i], g = GRID[i];
      var dx = lerp(s[0] * e1, g[0], e2);
      var dy = lerp(s[1] * e1, g[1], e2);
      var dr = lerp(s[2] * e1, 0,    e2);

      card.style.transform =
        'translate(calc(-50% + ' + dx.toFixed(2) + 'vw),' +
        ' calc(-50% + ' + dy.toFixed(2) + 'vh))' +
        ' rotate(' + dr.toFixed(2) + 'deg)';
      card.style.opacity = Math.min(1, t1 * 2.5).toFixed(4);
      card.style.zIndex  = 11 - i;
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  refreshLayout();
  update();

  /* ── LIGHTBOX ── */
  (function() {
    var lb      = document.getElementById('cte-lightbox');
    var lbImg   = document.getElementById('lbImg');
    var lbNum   = document.getElementById('lbCapNum');
    var lbTitle = document.getElementById('lbCapTitle');
    var lbCnt   = document.getElementById('lbCounter');
    var lbClose = document.getElementById('lbClose');
    var lbPrev  = document.getElementById('lbPrev');
    var lbNext  = document.getElementById('lbNext');
    if (!lb) return;

    var allCards = Array.from(section.querySelectorAll('.cte-photo-card'));
    var current  = 0;

    function getCardData(card) {
      var img   = card.querySelector('.cte-photo-img');
      var num   = card.querySelector('.cte-photo-num');
      var title = card.querySelector('.cte-photo-title');
      return {
        src:   img   ? img.src   : '',
        alt:   img   ? img.alt   : '',
        num:   num   ? num.textContent : '',
        title: title ? title.textContent : ''
      };
    }

    function show(idx) {
      current = (idx + allCards.length) % allCards.length;
      var d = getCardData(allCards[current]);
      lbImg.style.opacity   = '0';
      lbImg.style.transform = 'scale(.92)';
      setTimeout(function() {
        lbImg.src           = d.src;
        lbImg.alt           = d.alt;
        lbNum.textContent   = d.num;
        lbTitle.textContent = d.title;
        lbCnt.textContent   = (current + 1) + ' / ' + allCards.length;
        lbImg.style.opacity   = '1';
        lbImg.style.transform = 'scale(1)';
      }, 160);
    }

    function open(idx) {
      show(idx);
      lb.classList.add('lb-open');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      lb.classList.remove('lb-open');
      document.body.style.overflow = '';
    }

    allCards.forEach(function(card, i) {
      card.addEventListener('click', function(e) {
        e.stopPropagation();
        open(i);
      });
    });

    lbClose.addEventListener('click', close);
    lbPrev.addEventListener('click',  function(e) { e.stopPropagation(); show(current - 1); });
    lbNext.addEventListener('click',  function(e) { e.stopPropagation(); show(current + 1); });

    lb.addEventListener('click', function(e) {
      if (e.target === lb) close();
    });

    document.addEventListener('keydown', function(e) {
      if (!lb.classList.contains('lb-open')) return;
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });

    var touchStartX = 0;
    lb.addEventListener('touchstart', function(e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function(e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) dx < 0 ? show(current + 1) : show(current - 1);
    }, { passive: true });
  })();

})();

  // ── Seções 12-13: Depoimentos + CTA
/* ============================================================
   SECTION 12 — TESTIMONIALS CAROUSEL
   ============================================================ */

// ── Testimonials inline video player ────────────────────────
(function () {
  var wrap  = document.getElementById('test-vid-wrap');
  var video = document.getElementById('test-vid');
  var btn   = document.getElementById('test-vid-btn');
  if (!wrap || !video || !btn) return;

  var DESK_SRC = '/assets/depoimentos/depoimento-desk.mp4';
  var MOB_SRC  = '/assets/depoimentos/depoimento-mobile.mp4';
  var activeSrc = null;

  function loadSrc() {
    var src = window.innerWidth <= 768 ? MOB_SRC : DESK_SRC;
    if (src === activeSrc) return;
    var wasPlaying = !video.paused;
    activeSrc = src;
    video.src = src;
    video.load();
    if (wasPlaying) video.play();
  }

  video.addEventListener('play',  function () {
    wrap.classList.add('is-playing');
    btn.setAttribute('aria-label', 'Pausar');
  });
  video.addEventListener('pause', function () {
    wrap.classList.remove('is-playing');
    btn.setAttribute('aria-label', 'Reproduzir');
  });
  video.addEventListener('ended', function () {
    wrap.classList.remove('is-playing');
    btn.setAttribute('aria-label', 'Reproduzir');
  });

  wrap.addEventListener('click', function () {
    if (video.paused) { video.play(); } else { video.pause(); }
  });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(loadSrc, 300);
  });

  loadSrc();
})();

// ── Testimonials carousel (Team Building page) ───────────────
(function () {
  var track   = document.getElementById('test-track');
  var dotsEl  = document.getElementById('test-dots');
  var prevBtn = document.querySelector('.test-nav--prev');
  var nextBtn = document.querySelector('.test-nav--next');
  if (!track || !dotsEl) return;

  var dots  = Array.from(dotsEl.querySelectorAll('.test-dot'));
  var cards = Array.from(track.querySelectorAll('.test-card'));
  var total = cards.length;
  var active = 0;
  var scrollTimer = null;

  function getCardWidth() {
    if (!cards[0]) return 296;
    return cards[0].getBoundingClientRect().width + 16;
  }

  function setActiveDot(index) {
    dots.forEach(function (d, i) { d.classList.toggle('test-dot--active', i === index); });
    active = index;
  }

  function updateNavButtons() {
    if (prevBtn) prevBtn.disabled = active === 0;
    if (nextBtn) nextBtn.disabled = active >= total - 1;
  }

  track.addEventListener('scroll', function () {
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function () {
      var idx = Math.round(track.scrollLeft / getCardWidth());
      idx = Math.max(0, Math.min(total - 1, idx));
      if (idx !== active) { setActiveDot(idx); updateNavButtons(); }
    }, 60);
  }, { passive: true });

  if (prevBtn) prevBtn.addEventListener('click', function () {
    track.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
    setActiveDot(Math.max(0, active - 1));
    updateNavButtons();
  });

  if (nextBtn) nextBtn.addEventListener('click', function () {
    track.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
    setActiveDot(Math.min(total - 1, active + 1));
    updateNavButtons();
  });

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      track.scrollTo({ left: i * getCardWidth(), behavior: 'smooth' });
      setActiveDot(i); updateNavButtons();
    });
  });

  var isDragging = false, dragStartX = 0, dragScrollLeft = 0;
  track.addEventListener('mousedown', function (e) {
    isDragging = true; dragStartX = e.pageX - track.offsetLeft;
    dragScrollLeft = track.scrollLeft; track.style.cursor = 'grabbing';
  });
  document.addEventListener('mouseup', function () {
    if (!isDragging) return; isDragging = false; track.style.cursor = 'grab';
  });
  track.addEventListener('mousemove', function (e) {
    if (!isDragging) return; e.preventDefault();
    track.scrollLeft = dragScrollLeft - (e.pageX - track.offsetLeft - dragStartX) * 1.1;
  });

  setActiveDot(0);
  updateNavButtons();
})();

// ── TB Hero Scroll Story ─────────────────────────────────────
// O scroll do usuário é o playhead em qualquer dispositivo.
// No mobile: scroll story encurtado (280vh via CSS) + priming iOS
// (play→pause desbloqueia currentTime seeking no Safari/iOS).
(function() {
  var story = document.getElementById('tbScrollStory');
  var video = document.getElementById('tbHeroVideo');
  if (!story || !video) return;

  var DURATION = 5.041667;
  var REVEALS = [
    { sel: '.tb-reveal-1', inAt: 0.00 },
    { sel: '.tb-reveal-2', inAt: 0.20 },
    { sel: '.tb-reveal-3', inAt: 0.40 },
  ];
  var items = REVEALS.map(function(r) {
    return { el: document.querySelector(r.sel), inAt: r.inAt };
  });

  var raf = null;
  var primed = false;

  function getScrollProg() {
    var rect       = story.getBoundingClientRect();
    var scrollable = story.offsetHeight - window.innerHeight;
    return Math.max(0, Math.min(1, -rect.top / scrollable));
  }

  function tick() {
    raf = null;
    var prog = getScrollProg();
    var videoProg = Math.min(prog / 0.5, 1);
    video.currentTime = videoProg * DURATION;
    items.forEach(function(item) {
      if (!item.el) return;
      item.el.classList.toggle('visible', prog >= item.inAt);
    });
  }

  // iOS/mobile: play→pause uma vez para desbloquear seeking de currentTime
  function prime() {
    if (primed) return;
    primed = true;
    var p = video.play();
    if (p && p.then) {
      p.then(function() {
        video.pause();
        tick();
      }).catch(function() { tick(); });
    } else {
      video.pause();
      tick();
    }
  }

  window.addEventListener('scroll', function() {
    if (!primed) prime();
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive: true });

  // Inicialização: no desktop pode pausar direto; no mobile aguarda scroll
  if (video.readyState >= 2) {
    video.pause();
    video.currentTime = 0;
    tick();
  } else {
    video.addEventListener('loadeddata', function() {
      video.pause();
      video.currentTime = 0;
      tick();
    }, { once: true });
  }
}());

/* ── Premium price cards: 3D magnetic tilt + spotlight ── */
(function () {
  if (window.matchMedia('(hover: none)').matches) return;

  var cards = Array.from(document.querySelectorAll('.fl-card, .pkg-card'));

  cards.forEach(function (card) {
    var isFeatured = card.classList.contains('pkg-card--featured');
    var baseY = isFeatured ? -20 : 0;
    var raf = null;
    var lastX = 0, lastY = 0;

    function applyTilt(clientX, clientY) {
      var rect = card.getBoundingClientRect();
      var x = clientX - rect.left;
      var y = clientY - rect.top;
      var rotX = -((y - rect.height / 2) / rect.height) * 11;
      var rotY =  ((x - rect.width  / 2) / rect.width)  * 11;
      card.style.setProperty('--mouse-x', (x / rect.width  * 100).toFixed(1) + '%');
      card.style.setProperty('--mouse-y', (y / rect.height * 100).toFixed(1) + '%');
      card.style.transform =
        'perspective(900px) rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg) translateY(' + (baseY - 8) + 'px) translateZ(12px)';
      raf = null;
    }

    card.addEventListener('mouseenter', function () {
      card.classList.add('card-lit');
    });

    card.addEventListener('mousemove', function (e) {
      lastX = e.clientX; lastY = e.clientY;
      if (!raf) raf = requestAnimationFrame(function () { applyTilt(lastX, lastY); });
    });

    card.addEventListener('mouseleave', function () {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      card.classList.remove('card-lit');
      card.style.transform = isFeatured ? 'translateY(-20px)' : '';
    });
  });
}());

/* ── Modal escassez 1º Lote ── */
(function () {
  var modal = document.getElementById('scarcity-modal');
  if (!modal) return;

  var overlay  = document.getElementById('scarcityOverlay');
  var closeBtn = document.getElementById('scarcityClose');
  var dismiss  = document.getElementById('scarcityDismiss');
  var ctaBtn   = document.getElementById('scarcityCtaBtn');

  var SESSION_KEY = 'scarcity_modal_seen';

  function openModal() {
    modal.classList.add('scarcity-modal--open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // foco no botão principal para acessibilidade
    if (ctaBtn) ctaBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('scarcity-modal--open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // marca como visto na sessão
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch(e) {}
  }

  // Não mostra se já foi visto nesta sessão
  try {
    if (sessionStorage.getItem(SESSION_KEY)) return;
  } catch(e) {}

  // Abre após 4 segundos
  var timer = setTimeout(openModal, 4000);

  // Fecha ao scroll profundo (usuário claramente engajado)
  function onScroll() {
    if (window.scrollY > window.innerHeight * 0.8) {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll, { passive: true });
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // Fechar via overlay, X, dismiss
  if (overlay)  overlay.addEventListener('click',  closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismiss)  dismiss.addEventListener('click',  closeModal);

  // CTA "VER OS PACOTES" — rola para seção e fecha
  if (ctaBtn) {
    ctaBtn.addEventListener('click', function (e) {
      e.preventDefault();
      closeModal();
      var target = document.getElementById('sec-packages');
      if (target) {
        setTimeout(function () {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 320); // aguarda animação de fechamento
      }
    });
  }

  // Fechar com Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('scarcity-modal--open')) {
      closeModal();
    }
  });
}());

/* ── pkg-card: settled state após animação de entrada ── */
(function () {
  var grid = document.querySelector('.pkg-grid');
  if (!grid) return;
  grid.addEventListener('animationend', function (e) {
    var card = e.target;
    if (!card.classList.contains('pkg-card')) return;
    card.classList.add('pkg-card--settled');
  });
}());

/* ── Lead Modal — captura → CRM + WhatsApp ── */
(function () {
  var modal      = document.getElementById('lead-modal');
  var overlay    = document.getElementById('leadModalOverlay');
  var closeBtn   = document.getElementById('leadModalClose');
  var form       = document.getElementById('leadModalForm');
  var planLabel  = document.getElementById('leadModalPlan');
  var submitBtn  = document.getElementById('leadModalSubmit');
  if (!modal) return;

  var currentWaUrl = '';
  var currentProductKey = '';
  var currentCategory = '';
  var currentProduct = '';
  var currentPrice = '';
  var modalSession = 0;
  var SUBMIT_BTN_DEFAULT_HTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/></svg> GARANTIR MINHA VAGA';

  function openModal(plan, waUrl) {
    modalSession++;
    currentWaUrl = waUrl || '';
    if (planLabel) planLabel.textContent = plan || 'Race Experience';
    form.reset();
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = SUBMIT_BTN_DEFAULT_HTML;
    }
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('lead-modal--open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      var first = form.querySelector('.lead-modal-input');
      if (first) first.focus();
    }, 320);
  }

  function closeModal() {
    modal.classList.remove('lead-modal--open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.open-lead-modal');
    if (!btn) return;
    e.preventDefault();
    // Suprime o popup de escassez, se estiver aberto, para não cobrir o lead-modal
    var scarcityModal = document.getElementById('scarcity-modal');
    if (scarcityModal && scarcityModal.classList.contains('scarcity-modal--open')) {
      scarcityModal.classList.remove('scarcity-modal--open');
      scarcityModal.setAttribute('aria-hidden', 'true');
    }
    currentProductKey = btn.getAttribute('data-product-key') || '';
    currentCategory = btn.getAttribute('data-category') || '';
    currentProduct = btn.getAttribute('data-product') || '';
    currentPrice = btn.getAttribute('data-price') || '';
    openModal(btn.getAttribute('data-plan'), btn.getAttribute('data-wa'));
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('lead-modal--open')) closeModal();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nome = (form.querySelector('[name="nome"]') || {}).value || '';
    var tel  = (form.querySelector('[name="telefone"]') || {}).value || '';
    var plan = planLabel ? planLabel.textContent : 'Race Experience';
    var submitSession = modalSession;

    var lead = {
      nome: nome,
      whatsapp: tel,
      produto: currentProduct || plan,
      categoria: currentCategory || '',
      valor: currentPrice || '',
      origem: 'Landing Page Race Experience',
      productKey: currentProductKey || ''
    };

    submitBtn.textContent = 'Abrindo WhatsApp...';
    submitBtn.disabled = true;

    function restoreSubmitBtn() {
      submitBtn.innerHTML = SUBMIT_BTN_DEFAULT_HTML;
      submitBtn.disabled = false;
    }

    if (window.LeadIntegration) {
      window.LeadIntegration.handleLeadSubmit(lead).then(function () {
        // Só fecha/restaura se o modal ainda pertencer a esta mesma sessão
        // (o usuário não fechou e reabriu o modal para outro produto enquanto
        // esta submissão estava pendente).
        if (submitSession !== modalSession) return;
        closeModal();
        restoreSubmitBtn();
      });
    } else {
      var waUrl = currentWaUrl;
      if (!waUrl) {
        var msg = 'Olá! Meu nome é ' + nome + ' e tenho interesse na Race Experience (26/07).' +
                  (tel ? ' Meu WhatsApp é ' + tel + '.' : '') + ' Pode me passar mais informações?';
        waUrl = 'https://wa.me/5515998570854?text=' + encodeURIComponent(msg);
      }
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      closeModal();
      restoreSubmitBtn();
    }
  });
}());
