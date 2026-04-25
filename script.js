/* ═══════════════════════════════════════
   THE PHOENIX CODE — script.js
═══════════════════════════════════════ */

/* ── LOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('gone');
    // Trigger hero reveals after loader
    setTimeout(triggerHeroReveal, 200);
  }, 1600);
});

/* ── CUSTOM CURSOR ── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left  = mouseX + 'px';
  dot.style.top   = mouseY + 'px';
});

// Smooth ring follow
function animateRing() {
  ringX += (mouseX - ringX) * 0.14;
  ringY += (mouseY - ringY) * 0.14;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  dot.style.opacity  = '0';
  ring.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  dot.style.opacity  = '1';
  ring.style.opacity = '1';
});

/* ── NAV SCROLL ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 60
    ? 'rgba(6,6,6,0.98)'
    : 'rgba(6,6,6,0.85)';
});

/* ── HAMBURGER ── */
const hamburger = document.getElementById('hamburger');
const mobMenu   = document.getElementById('mobMenu');
hamburger.addEventListener('click', () => {
  mobMenu.classList.toggle('open');
  const open = mobMenu.classList.contains('open');
  hamburger.children[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
  hamburger.children[1].style.opacity   = open ? '0' : '1';
  hamburger.children[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
});
document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', () => {
  mobMenu.classList.remove('open');
  hamburger.children[0].style.transform = '';
  hamburger.children[1].style.opacity   = '1';
  hamburger.children[2].style.transform = '';
}));

/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
  });
});

/* ── HERO REVEAL ── */
function triggerHeroReveal() {
  // Wrap inner text in .reveal-line spans
  document.querySelectorAll('.reveal-line').forEach((el, i) => {
    const text = el.innerHTML;
    el.innerHTML = `<span class="reveal-line-inner" style="transition-delay:${i * 0.12}s">${text}</span>`;
    requestAnimationFrame(() => el.classList.add('visible'));
  });
  document.querySelectorAll('.reveal-up').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 300 + i * 120);
  });
}

/* ── INTERSECTION OBSERVER ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.proj-card, .svc-card, .plat-card, .tc-card, .ts-item, .ci-item, .about-logo, .about-text'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  observer.observe(el);
});

// Override visible class to trigger
const origObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay || 0;
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      }, delay);
      origObserver.unobserve(el);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(
  '.proj-card, .svc-card, .plat-card, .tc-card, .ts-item, .ci-item, .about-logo, .about-text'
).forEach((el, i) => {
  el.dataset.delay = (i % 4) * 80;
  origObserver.observe(el);
});

/* ── COUNTER ANIMATION ── */
const counters = document.querySelectorAll('.ts-n[data-target]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

/* ── CONTACT FORM ── */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = '✅ Message Sent!';
    btn.style.background = '#00C48C';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Send Message 🔥';
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
}

/* ── STAGGER SIBLINGS ── */
function staggerSiblings(selector, delayStep = 80) {
  document.querySelectorAll(selector).forEach((parent) => {
    Array.from(parent.children).forEach((child, i) => {
      child.dataset.delay = i * delayStep;
    });
  });
}
staggerSiblings('.projects-grid', 100);
staggerSiblings('.services-grid', 80);
staggerSiblings('.plat-grid', 80);
staggerSiblings('.tc-grid', 100);