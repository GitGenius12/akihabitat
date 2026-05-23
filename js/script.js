/* AKI Habitat — Main JS */

// ── Header: transparent → dark on scroll ──────────────
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 60);
  lastScroll = y;
}, { passive: true });

// ── Mobile navigation ──────────────────────────────────
const menuBtn = document.getElementById('menu-btn');
const navbar  = document.getElementById('navbar');

menuBtn.addEventListener('click', () => {
  const isOpen = menuBtn.classList.toggle('open');
  navbar.classList.toggle('open', isOpen);
  menuBtn.setAttribute('aria-expanded', isOpen);
});

// Close nav on scroll
window.addEventListener('scroll', () => {
  menuBtn.classList.remove('open');
  navbar.classList.remove('open');
}, { passive: true });

// Close nav when a link is clicked
navbar.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuBtn.classList.remove('open');
    navbar.classList.remove('open');
  });
});

// ── Active nav link tracking ───────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar a');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const match = document.querySelector(`.navbar a[href="#${entry.target.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}, { threshold: 0.35, rootMargin: '-80px 0px 0px 0px' });

sections.forEach(s => navObserver.observe(s));

// ── Scroll-reveal ──────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Animated counters ──────────────────────────────────
function animateCounter(el, target) {
  const duration = 1600;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out quad
    const eased = 1 - (1 - progress) * (1 - progress);
    const value = Math.floor(eased * target);
    el.textContent = value + '+';
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target + '+';
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      if (!isNaN(target)) animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ── Hero Swiper ────────────────────────────────────────
new Swiper('.hero-slider', {
  loop:        true,
  grabCursor:  true,
  effect:      'fade',
  fadeEffect:  { crossFade: true },
  speed:       900,
  autoplay: {
    delay:                5500,
    disableOnInteraction: false,
    pauseOnMouseEnter:    true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el:        '.swiper-pagination',
    clickable: true,
  },
});
