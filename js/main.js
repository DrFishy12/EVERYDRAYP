/* =========================================================
   EVERYDRAYP · נועה — site behaviour
   ========================================================= */
(() => {
  'use strict';

  /* ======================================================
     CONFIG: the phone number and WhatsApp message live here.
     ====================================================== */
  const CONFIG = {
    // International format: 972 + the number without the leading 0
    phoneIntl: '972547761974',
    // How the number is shown on the site
    phoneDisplay: '054-776-1974',
    // Ready-made message for every WhatsApp button (except the composer)
    waMessage: 'היי נועה! 👋\nהגעתי דרך האתר ואשמח לשמוע פרטים על אימון פילאטיס פרטי עד הבית.'
  };

  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const waLink = (text) => `https://wa.me/${CONFIG.phoneIntl}?text=${encodeURIComponent(text)}`;

  /* ---------- phone + WhatsApp links ---------- */
  $$('[data-phone-display]').forEach((el) => { el.textContent = CONFIG.phoneDisplay; });
  $$('[data-tel]').forEach((el) => { el.href = `tel:+${CONFIG.phoneIntl}`; });
  $$('[data-wa]').forEach((el) => { if (el.id !== 'wa-send') el.href = waLink(CONFIG.waMessage); });

  /* ---------- WhatsApp composer ---------- */
  const nameInput = $('#wa-name');
  const goals = $$('input[name="goal"]');
  const times = $$('input[name="time"]');
  const preview = $('#wa-preview');
  const sendBtn = $('#wa-send');
  const bubble = preview && preview.closest('.bubble');

  const joinAnd = (a) => (a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} ו${a[a.length - 1]}`);
  const joinOr = (a) => (a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} או ${a[a.length - 1]}`);
  const checked = (list) => list.filter((i) => i.checked).map((i) => i.value);

  const buildMessage = () => {
    const name = nameInput ? nameInput.value.trim().replace(/\s+/g, ' ') : '';
    const g = checked(goals);
    const t = checked(times);
    let msg = 'היי נועה! 👋\n';
    msg += name ? `אני ${name}, הגעתי דרך האתר ` : 'הגעתי דרך האתר ';
    msg += 'ואשמח לשמוע פרטים על אימון פילאטיס פרטי עד הבית.';
    if (g.length) msg += `\nמה שמעניין אותי: ${joinAnd(g)}.`;
    if (t.length) msg += `\nהכי נוח לי להתאמן ${joinOr(t)}.`;
    msg += '\nתודה!';
    return msg;
  };

  const updateComposer = (animate) => {
    if (!preview || !sendBtn) return;
    const msg = buildMessage();
    preview.textContent = msg;
    sendBtn.href = waLink(msg);
    if (animate && bubble) {
      bubble.classList.remove('pop');
      void bubble.offsetWidth;
      bubble.classList.add('pop');
    }
  };
  updateComposer(false);
  if (nameInput) nameInput.addEventListener('input', () => updateComposer(false));
  [...goals, ...times].forEach((i) => i.addEventListener('change', () => updateComposer(true)));

  /* ---------- copy phone ---------- */
  const toast = $('.toast');
  let toastTimer;
  const showToast = (text) => {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  };
  const copyBtn = $('#copy-phone');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(CONFIG.phoneDisplay);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = CONFIG.phoneDisplay;
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch { /* ignore */ }
        ta.remove();
      }
      showToast('המספר הועתק ✓');
    });
  }

  /* ---------- mobile menu ---------- */
  const burger = $('.burger');
  const setMenu = (open) => {
    body.classList.toggle('menu-open', open);
    if (!burger) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'סגירת תפריט' : 'פתיחת תפריט');
  };
  if (burger) {
    burger.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
    $$('.nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---------- rotating words in the hero ---------- */
  const words = $$('.rot-word');
  if (words.length > 1) {
    let idx = 0;
    setInterval(() => {
      if (document.hidden) return;
      const cur = words[idx];
      idx = (idx + 1) % words.length;
      const next = words[idx];
      cur.classList.remove('is-active');
      cur.classList.add('is-out');
      next.classList.remove('is-out');
      next.classList.add('is-active');
      setTimeout(() => cur.classList.remove('is-out'), 750);
    }, 2600);
  }

  /* ---------- scroll: header, floating button, flowing path ---------- */
  const header = $('.header');
  const hero = $('.hero');
  const contact = $('#contact');
  const waFloat = $('.wa-float');
  const flow = $('.flow');
  const flowLine = $('.flow-line');

  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;

    if (header) header.classList.toggle('scrolled', y > 24);

    if (waFloat && hero && contact) {
      const c = contact.getBoundingClientRect();
      const inContact = c.top < vh * 0.55 && c.bottom > vh * 0.45;
      waFloat.classList.toggle('show', y > hero.offsetHeight * 0.5 && !inContact);
    }

    if (flow && flowLine) {
      const r = flow.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.55)));
      flowLine.style.setProperty('--draw', (1 - p).toFixed(4));
    }
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- reveal on scroll ---------- */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  /* ---------- active nav link ---------- */
  const navLinks = $$('.nav a[href^="#"]:not(.nav-mobile-cta)');
  if ('IntersectionObserver' in window) {
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach((a) => {
      const sec = document.getElementById(a.getAttribute('href').slice(1));
      if (sec) navIO.observe(sec);
    });
  }

  /* ---------- hero parallax (desktop mouse) ---------- */
  const art = $('.hero-art');
  if (art && finePointer && !reduceMotion) {
    const layers = $$('[data-depth]', art);
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      layers.forEach((l) => {
        const d = parseFloat(l.dataset.depth) || 0;
        l.style.transform = `translate(${(-x * d).toFixed(1)}px, ${(-y * d).toFixed(1)}px)`;
      });
    });
    hero.addEventListener('pointerleave', () => layers.forEach((l) => { l.style.transform = ''; }));
  }

  /* ---------- footer year ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
