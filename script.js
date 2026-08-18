(function () {
  'use strict';

  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav__link');
  const yearSpan = document.getElementById('year');
  const contactForm = document.getElementById('contactForm');
  const themeToggle = document.getElementById('themeToggle');

  const CONTACT_EMAIL = 'laibash3225@gmail.com';

  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* ---- Dark / Light Theme ---- */
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      root.removeAttribute('data-theme');
      themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const isDark = root.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('portfolio-theme', next);
    });
  }
/* ============================================
   CERTIFICATE FOLDERS
============================================ */

const certificateFolders = document.querySelectorAll('.certificate-folder');

certificateFolders.forEach(folder => {

  const toggle = folder.querySelector('.certificate-folder__btn');

  if (!toggle) return;

  toggle.addEventListener('click', () => {

    const isOpen = folder.classList.toggle('open');

    toggle.setAttribute('aria-expanded', isOpen);

    const text = toggle.querySelector('span:first-child');

    if (text) {
      text.textContent = isOpen
        ? 'Hide Certificates'
        : 'View Certificates';
    }

  });

});
  /* ---- Mobile Nav ---- */
  function toggleMenu() {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  function closeMenu() {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (navToggle) navToggle.addEventListener('click', toggleMenu);
  navLinks.forEach(l => l.addEventListener('click', closeMenu));
  document.addEventListener('click', e => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) closeMenu();
  });

  /* ---- Header scroll + active link ---- */
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 20);
    const sections = document.querySelectorAll('section[id]');
    const pos = window.scrollY + header.offsetHeight + 60;
    sections.forEach(s => {
      const link = document.querySelector('.nav__link[href="#' + s.id + '"]');
      if (link && pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Typing effect ---- */
  const roles = ['Front-End Web Developer', 'CS Student', 'UI Enthusiast', 'Problem Solver'];
  const typedEl = document.getElementById('typedRole');
  if (typedEl) {
    let roleIndex = 0, charIndex = 0, deleting = false;
    function tick() {
      const current = roles[roleIndex];
      if (!deleting) {
        typedEl.textContent = current.slice(0, ++charIndex);
        if (charIndex === current.length) { deleting = true; setTimeout(tick, 1400); return; }
      } else {
        typedEl.textContent = current.slice(0, --charIndex);
        if (charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
      }
      setTimeout(tick, deleting ? 45 : 90);
    }
    tick();
  }

  /* ---- Skill bar fill animation ---- */
  const skillFills = document.querySelectorAll('.skill-bar__fill');
  if (skillFills.length && 'IntersectionObserver' in window) {
    const skillIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          target.style.width = (target.getAttribute('data-width') || 0) + '%';
          skillIO.unobserve(target);
        }
      });
    }, { threshold: 0.4 });
    skillFills.forEach(el => skillIO.observe(el));
  } else {
    skillFills.forEach(el => { el.style.width = (el.getAttribute('data-width') || 0) + '%'; });
  }

  /* ---- Hero stat count-up ---- */
  const statNums = document.querySelectorAll('.hero__stat-num');
  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1200;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (statNums.length) {
    if ('IntersectionObserver' in window) {
      const statIO = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { animateCount(entry.target); statIO.unobserve(entry.target); }
        });
      }, { threshold: 0.5 });
      statNums.forEach(el => statIO.observe(el));
    } else {
      statNums.forEach(el => { el.textContent = el.getAttribute('data-count') || '0'; });
    }
  }

  /* ---- Cursor spotlight (desktop only) ---- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let glowShown = false;
    document.addEventListener('mousemove', e => {
      cursorGlow.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)';
      if (!glowShown) { cursorGlow.classList.add('active'); glowShown = true; }
    }, { passive: true });
    document.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
  }

  /* ---- 3D tilt on cards ---- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const tiltCards = document.querySelectorAll('.about__card, .project-card');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--ry', (px * 8).toFixed(2) + 'deg');
        card.style.setProperty('--rx', (py * -8).toFixed(2) + 'deg');
      });
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---- Scroll reveal ---- */
  document.querySelectorAll(
    '.about__card, .stack, .timeline__item, .project-card, .contact__grid, .section__title, .section__lead'
  ).forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  /* ---- Contact form ---- */
  if (contactForm) {
    const fields = {
      name: { input: document.getElementById('name'), error: document.getElementById('nameError'),
        validate: v => !v.trim() ? 'Please enter your name.' : v.trim().length < 2 ? 'Name is too short.' : '' },
      email: { input: document.getElementById('email'), error: document.getElementById('emailError'),
        validate: v => !v.trim() ? 'Please enter your email.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? 'Enter a valid email.' : '' },
      subject: { input: document.getElementById('subject'), error: document.getElementById('subjectError'),
        validate: v => !v.trim() ? 'Please enter a subject.' : '' },
      message: { input: document.getElementById('message'), error: document.getElementById('messageError'),
        validate: v => !v.trim() ? 'Please enter a message.' : v.trim().length < 10 ? 'Message is too short.' : '' }
    };

    Object.values(fields).forEach(f => {
      f.input.addEventListener('input', () => { f.input.classList.remove('error'); f.error.textContent = ''; });
    });

    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      const data = {};
      Object.entries(fields).forEach(([key, f]) => {
        const msg = f.validate(f.input.value);
        if (msg) { f.input.classList.add('error'); f.error.textContent = msg; valid = false; }
        else { f.input.classList.remove('error'); f.error.textContent = ''; }
        data[key] = f.input.value.trim();
      });
      if (!valid) { contactForm.querySelector('.error')?.focus(); return; }

      const mailto = 'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent(data.subject) +
        '&body=' + encodeURIComponent('Name: ' + data.name + '\nEmail: ' + data.email + '\n\n' + data.message);
      window.location.href = mailto;

      document.getElementById('formSuccess').hidden = false;
      contactForm.reset();
    });
  }
})();
