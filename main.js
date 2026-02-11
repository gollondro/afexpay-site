/* ========================================
   AfexPay Perú — Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- Page loader ---
  const loader = document.querySelector('.page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('loaded'), 200);
    });
    // Fallback
    setTimeout(() => loader.classList.add('loaded'), 1500);
  }

  // --- Header scroll behavior ---
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('header--scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Mobile menu ---
  const hamburger = document.querySelector('.header__hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('mobile-nav--open');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('mobile-nav--open');
        hamburger.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      });
    });
  }

  // --- Scroll animations ---
  const animatedEls = document.querySelectorAll('.animate-on-scroll');
  if (animatedEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // Stagger children
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, Number(delay));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animatedEls.forEach(el => observer.observe(el));
  }

  // --- Counter animation ---
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.round(eased * target);
      el.textContent = prefix + current.toLocaleString('es-PE') + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Contact form validation ---
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    let isValid = true;

    // Clear previous errors
    form.querySelectorAll('.form__group').forEach(g => g.classList.remove('form__group--error'));

    // Validate required fields
    const fields = [
      { id: 'nombre', message: 'Ingresa tu nombre' },
      { id: 'email', message: 'Ingresa un email válido', validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      { id: 'tipo', message: 'Selecciona un tipo de cliente' },
    ];

    fields.forEach(field => {
      const input = document.getElementById(field.id);
      if (!input) return;
      const val = input.value.trim();
      const valid = field.validate ? field.validate(val) : val.length > 0;
      if (!valid) {
        isValid = false;
        const group = input.closest('.form__group');
        if (group) group.classList.add('form__group--error');
      }
    });

    if (isValid) {
      form.style.display = 'none';
      const success = document.querySelector('.form__success');
      if (success) success.style.display = 'block';
    }
  }

  // --- Active nav link highlight ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.header__link, .mobile-nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('header__link--active');
    }
  });
});
