/* =========================================================
   EVERYDRAY Pilates · נועה — site behaviour
   ========================================================= */
(() => {
  'use strict';

  /* ======================================================
     CONFIG: change the phone number and message here only.
     ====================================================== */
  const CONFIG = {
    // Noa's phone in international format: 972 + the number without the leading 0.
    // Example: 050-123-4567  ->  '972501234567'
    phoneIntl: '972547761974',

    // How the number is shown on the site.
    phoneDisplay: '054-776-1974',

    // The ready-made WhatsApp message used by every WhatsApp button.
    // Use emojis from the basic range (like ☺️ ✨ ❤️): 4-byte emojis such as 👋 can arrive as "�".
    waMessage: 'היי נועה! ☺️\nהגעתי דרך האתר ואשמח לשמוע פרטים על אימון פילאטיס פרטי עד הבית ✨'
  };

  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // api.whatsapp.com/send keeps emojis intact; the wa.me short link can turn them into "�".
  const waLink = (text) => `https://api.whatsapp.com/send?phone=${CONFIG.phoneIntl}&text=${encodeURIComponent(text)}`;

  /* ---------- phone + WhatsApp links ---------- */
  $$('[data-phone-display]').forEach((el) => { el.textContent = CONFIG.phoneDisplay; });
  $$('[data-tel]').forEach((el) => {
    el.href = `tel:+${CONFIG.phoneIntl}`;
    el.setAttribute('aria-label', `חיוג לנועה: ${CONFIG.phoneDisplay}`);
  });
  $$('[data-wa]').forEach((el) => {
    if (el.id !== 'wa-send') el.href = waLink(CONFIG.waMessage);
  });

  /* ---------- WhatsApp message composer ---------- */
  const nameInput = $('#wa-name');
  const goalInputs = $$('input[name="goal"]');
  const preview = $('#wa-preview');
  const sendBtn = $('#wa-send');
  const bubble = preview ? preview.closest('.bubble') : null;

  const joinHebrew = (items) => {
    if (items.length <= 1) return items.join('');
    return `${items.slice(0, -1).join(', ')} ו${items[items.length - 1]}`;
  };

  const buildMessage = () => {
    const name = nameInput ? nameInput.value.trim().replace(/\s+/g, ' ') : '';
    const goals = goalInputs.filter((i) => i.checked).map((i) => i.value);

    let msg = 'היי נועה! ☺️\n';
    msg += name ? `אני ${name}, הגעתי דרך האתר ` : 'הגעתי דרך האתר ';
    msg += 'ואשמח לשמוע פרטים על אימון פילאטיס פרטי עד הבית ✨';
    if (goals.length) msg += `\nמה שהכי חשוב לי: ${joinHebrew(goals)}.`;
    msg += '\nתודה!';
    return msg;
  };

  const updateComposer = (animate) => {
    if (!preview || !sendBtn) return;
    const msg = buildMessage();
    preview.textContent = msg;
    sendBtn.href = waLink(msg);
    if (animate && bubble && !reduceMotion) {
      bubble.classList.remove('pop');
      void bubble.offsetWidth; // restart the animation
      bubble.classList.add('pop');
    }
  };

  updateComposer(false);
  if (nameInput) nameInput.addEventListener('input', () => updateComposer(false));
  goalInputs.forEach((i) => i.addEventListener('change', () => updateComposer(true)));

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
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch { /* ignore */ }
        ta.remove();
      }
      showToast('המספר הועתק ✓');
    });
  }

  /* ---------- mobile menu ---------- */
  const menuBtn = $('.menu-toggle');
  const setMenu = (open) => {
    body.classList.toggle('menu-open', open);
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'סגירת תפריט' : 'פתיחת תפריט');
    }
  };
  if (menuBtn) {
    menuBtn.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
    $$('.main-nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---------- header, progress bar, steps line, floating button ---------- */
  const header = $('.site-header');
  const progress = $('.scroll-progress');
  const hero = $('.hero');
  const contact = $('#contact');
  const waFloat = $('.wa-float');
  const stepsWrap = $('.steps-wrap');
  const stepsLine = $('.steps-line');
  const steps = $$('.step');

  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const max = root.scrollHeight - vh;

    if (header) header.classList.toggle('scrolled', y > 20);
    if (progress) progress.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);

    if (waFloat && hero && contact) {
      const pastHero = y > hero.offsetHeight * 0.6;
      const cRect = contact.getBoundingClientRect();
      const contactInView = cRect.top < vh * 0.6 && cRect.bottom > vh * 0.4;
      waFloat.classList.toggle('show', pastHero && !contactInView);
    }

    if (stepsWrap && stepsLine) {
      const r = stepsWrap.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh * 0.7 - r.top) / (r.height * 0.9)));
      stepsLine.style.setProperty('--p', p.toFixed(4));
      const n = steps.length;
      steps.forEach((s, i) => s.classList.toggle('lit', p >= (n > 1 ? i / (n - 1) : 0) - 0.02 && p > 0));
    }

    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* floating button: show a little speech bubble once */
  if (waFloat && !reduceMotion) {
    setTimeout(() => {
      if (!waFloat.classList.contains('show')) return;
      waFloat.classList.add('tip');
      setTimeout(() => waFloat.classList.remove('tip'), 4500);
    }, 9000);
  }

  /* ---------- hero intro: draw the accent underline ---------- */
  const introShown = !root.classList.contains('no-splash') && !reduceMotion;
  setTimeout(() => root.classList.add('hero-ready'), reduceMotion ? 0 : (introShown ? 2650 : 900));

  /* ---------- counters ---------- */
  const runCounter = (el) => {
    const to = parseFloat(el.dataset.count) || 0;
    const from = parseFloat(el.dataset.countFrom) || 0;
    if (reduceMotion) { el.textContent = to; return; }
    const dur = 1600;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(from + (to - from) * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    el.textContent = from;
    requestAnimationFrame(tick);
  };

  /* ---------- reveal on scroll ---------- */
  const revealEls = $$('[data-reveal]');
  const onRevealed = (el) => {
    el.classList.add('is-visible');
    $$('[data-count]', el).forEach(runCounter);
    if (el.classList.contains('tilt')) {
      const ready = () => el.classList.add('tilt-ready');
      el.addEventListener('transitionend', ready, { once: true });
      setTimeout(ready, 1400);
    }
  };

  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        onRevealed(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach(onRevealed);
  }

  /* ---------- active nav link ---------- */
  const navLinks = $$('.main-nav a[href^="#"]');
  if ('IntersectionObserver' in window && navLinks.length) {
    const sections = navLinks
      .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
      .filter(Boolean);
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => navIO.observe(s));
  }

  /* ---------- pointer effects (desktop only) ---------- */
  if (finePointer && !reduceMotion) {
    // soft glow that follows the cursor
    const glow = $('.cursor-glow');
    if (glow) {
      let gx = window.innerWidth / 2, gy = window.innerHeight / 2, tx = gx, ty = gy, running = false;
      const follow = () => {
        gx += (tx - gx) * 0.12;
        gy += (ty - gy) * 0.12;
        glow.style.transform = `translate(${gx}px, ${gy}px)`;
        if (Math.abs(tx - gx) > 0.5 || Math.abs(ty - gy) > 0.5) requestAnimationFrame(follow);
        else running = false;
      };
      window.addEventListener('pointermove', (e) => {
        tx = e.clientX; ty = e.clientY;
        body.classList.add('has-pointer');
        if (!running) { running = true; requestAnimationFrame(follow); }
      }, { passive: true });
      document.addEventListener('pointerleave', () => body.classList.remove('has-pointer'));
    }

    // magnetic buttons
    $$('.magnetic').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const mx = (e.clientX - (r.left + r.width / 2)) * 0.22;
        const my = (e.clientY - (r.top + r.height / 2)) * 0.3;
        btn.style.setProperty('--mx', `${mx.toFixed(1)}px`);
        btn.style.setProperty('--my', `${my.toFixed(1)}px`);
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.setProperty('--mx', '0px');
        btn.style.setProperty('--my', '0px');
      });
    });

    // 3D tilt cards
    $$('.tilt').forEach((card) => {
      if (!card.hasAttribute('data-reveal')) card.classList.add('tilt-ready');
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---------- photos: fade in once loaded ---------- */
  $$('img[data-fade]').forEach((img) => {
    const done = () => img.classList.add('loaded');
    if (img.complete && img.naturalWidth) done();
    else img.addEventListener('load', done, { once: true });
  });

  /* ---------- footer year ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
