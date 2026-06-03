/* ===========================
   RADIO EMISOR COMÚN — JS
   =========================== */

// ---- SMOOTH NAV ACTIVE STATE ----
const navLinks = document.querySelectorAll('.header-inner nav a');
const sections = document.querySelectorAll('section[id]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'var(--gold)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));


// ---- HERO TEXT REVEAL ----
const heroH1 = document.querySelector('.hero-left h1');
const heroParts = [heroH1];

window.addEventListener('DOMContentLoaded', () => {
  // Stagger fade-in for hero elements
  const revealEls = [
    '.kicker',
    '.hero-left h1',
    '.subtitle',
    '.cta-row',
    '.bjt-wrapper',
  ];

  revealEls.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(22px)';
    el.style.transition = `opacity 0.7s ease ${i * 0.12}s, transform 0.7s ease ${i * 0.12}s`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });
});


// ---- CARD GLOW ON HOVER (mouse tracking) ----
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.background = `radial-gradient(
      circle at ${x}px ${y}px,
      rgba(232,200,74,0.06) 0%,
      var(--surface) 70%
    )`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});


// ---- SPECS BAR COUNTER ANIMATION ----
function animateValue(el, target, suffix = '', duration = 1200) {
  // Only animate numeric values
  const num = parseFloat(target);
  if (isNaN(num)) return;

  const start = performance.now();
  const from = 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = from + (num - from) * ease;

    // Format with same decimals as original
    const decimals = target.includes('.') ? target.split('.')[1].length : 0;
    el.textContent = current.toFixed(decimals) + suffix;

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// Trigger when specs bar enters view
const specsBar = document.querySelector('.specs-bar');
if (specsBar) {
  const specObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      // Animate the numeric spec values
      const vals = specsBar.querySelectorAll('.spec-val');
      vals.forEach(el => {
        const text = el.textContent.trim();
        // Extract number and suffix for simple values
        const match = text.match(/^~?([\d.]+)(.*)/);
        if (match) {
          const num = match[1];
          const suffix = match[2];
          const prefix = text.startsWith('~') ? '~' : '';
          el.textContent = prefix + '0' + suffix;
          setTimeout(() => animateValue(el, num, suffix, 1400), 200);
        }
      });
      specObs.disconnect();
    }
  }, { threshold: 0.6 });

  specObs.observe(specsBar);
}


// ---- FREQUENCY DISPLAY — random drift ----
const freqEl = document.querySelector('.freq-indicator');
if (freqEl) {
  const baseFreq = 98.5;
  setInterval(() => {
    const drift = (Math.random() - 0.5) * 0.2;
    const freq = (baseFreq + drift).toFixed(1);
    freqEl.innerHTML = `<span class="dot"></span>FM ${freq} MHz`;
  }, 4000);
}


// ---- SECTION SCROLL REVEAL ----
const revealSections = document.querySelectorAll('.section');

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.card, .resource-item, .component-list li').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(16px)';
        el.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          });
        });
      });
      sectionObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealSections.forEach(s => sectionObs.observe(s));
