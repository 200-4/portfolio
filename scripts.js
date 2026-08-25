/* ── Hamburger ──────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── Navbar shadow on scroll ────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 10
    ? '0 4px 32px rgba(0,0,0,0.85), 0 1px 0 rgba(255,255,255,0.05)'
    : '0 4px 24px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.05)';
});

/* ── Animated circles canvas ────────────────────── */
(function() {
  const canvas = document.getElementById('circles-canvas');
  if (!canvas) return; // only present on the homepage hero
  const ctx    = canvas.getContext('2d');
  let W, H, circles;

  const PALETTE = [
    { r: 100, g: 100, b: 115 }, // grey
    { r:  90, g:  60, b: 130 }, // purple-ish
    { r:  60, g:  60, b:  80 }, // dark purple
    { r:  80, g:  80, b:  95 }, // mid grey
  ];

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function makeCircle() {
    const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const baseR = rand(8, 46);
    return {
      x: rand(0, W),
      y: rand(0, H),
      baseR,
      r: baseR,
      minR: baseR * 0.55,
      maxR: baseR * 1.45,
      growing: Math.random() > 0.5,
      speed:   rand(0.008, 0.028), // pulsing speed
      vx:      rand(-0.12, 0.12),   // drift
      vy:      rand(-0.08, 0.08),
      alpha:   rand(0.12, 0.50),
      r_fill:  c.r, g_fill: c.g, b_fill: c.b,
    };
  }

  function init() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    const count = Math.floor((W * H) / 14000);
    circles = Array.from({ length: count }, makeCircle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    circles.forEach(c => {
      // pulse
      if (c.growing) {
        c.r += c.speed;
        if (c.r >= c.maxR) c.growing = false;
      } else {
        c.r -= c.speed;
        if (c.r <= c.minR) c.growing = true;
      }

      // drift
      c.x += c.vx;
      c.y += c.vy;

      // wrap around edges
      if (c.x < -c.maxR)  c.x = W + c.maxR;
      if (c.x > W + c.maxR) c.x = -c.maxR;
      if (c.y < -c.maxR)  c.y = H + c.maxR;
      if (c.y > H + c.maxR) c.y = -c.maxR;

      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.r_fill},${c.g_fill},${c.b_fill},${c.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', init);
  init();
  draw();
})();

/* ── Scroll reveal ──────────────────────────────── */
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

/* ── Contact form submission ────────────────────── */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('.btn-send');
    btn.textContent = '✓ Message Sent!';
    btn.style.background = '#059669';
    setTimeout(() => {
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message';
      btn.style.background = '';
      this.reset();
    }, 3000);
  });
}
