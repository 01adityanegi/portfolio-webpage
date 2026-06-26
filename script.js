/* ============================================================
   DEV PORTFOLIO — script.js
   ============================================================ */

// ── CURSOR ───────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

(function animFollower() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top = fy + 'px';
  requestAnimationFrame(animFollower);
})();

document.querySelectorAll('a,button,.magnetic,.service-card,.project-card,.stack-item,.social-link,.tprev,.tnext').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hover-active'); follower.classList.add('hover-active'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hover-active'); follower.classList.remove('hover-active'); });
});

// ── CODE CANVAS BACKGROUND ───────────────────────────────────
const canvas = document.getElementById('code-canvas');
const ctx = canvas.getContext('2d');

const CODE_SNIPPETS = [
  'const app = express()', 'import React from "react"', 'function render() {',
  'useState(false)', 'useEffect(() => {}, [])', 'async function fetchData()',
  'return <Component />', 'const [data, setData]', 'module.exports = router',
  'SELECT * FROM users', 'git commit -m "feat:"', 'npm run build',
  'docker-compose up', 'class API extends Base', '.map(item => item.id)',
  'await Promise.all([])', 'const res = await fetch()', '<div className="hero">',
  '</section>', '@media (max-width:768px)', 'z-index: 9999;',
  'border-radius: 12px', 'transform: translateY(-4px)', 'const PI = Math.PI',
  'try { } catch(err) {}', 'export default function', 'interface Props {',
  'type User = { id: number }', '=> ({ status: 200 })', '// TODO: optimize',
  '#!/usr/bin/env node', 'pip install fastapi', 'kubectl apply -f',
];

let codeParticles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
}

function initParticles() {
  codeParticles = [];
  const count = Math.floor((canvas.width * canvas.height) / 18000);
  for (let i = 0; i < count; i++) {
    codeParticles.push(createParticle(true));
  }
}

function createParticle(random) {
  const colors = ['rgba(0,255,136,', 'rgba(0,212,255,', 'rgba(168,85,247,', 'rgba(130,170,255,'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return {
    x: random ? Math.random() * canvas.width : canvas.width + 50,
    y: Math.random() * canvas.height,
    text: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
    speed: 0.2 + Math.random() * 0.5,
    opacity: 0.05 + Math.random() * 0.18,
    size: 11 + Math.random() * 4,
    color: color,
    drift: (Math.random() - 0.5) * 0.15,
  };
}

function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  codeParticles.forEach((p, i) => {
    ctx.font = `${p.size}px 'Fira Code', monospace`;
    ctx.fillStyle = p.color + p.opacity + ')';
    ctx.fillText(p.text, p.x, p.y);
    p.x -= p.speed;
    p.y += p.drift;
    if (p.y > canvas.height + 20) p.y = -20;
    if (p.y < -20) p.y = canvas.height + 20;
    if (p.x < -canvas.width * 0.3) {
      codeParticles[i] = createParticle(false);
    }
  });
  requestAnimationFrame(drawCanvas);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
drawCanvas();

// ── LOADER ───────────────────────────────────────────────────
const loader = document.getElementById('loader');
const loaderCmd = document.getElementById('loader-cmd');
const loaderOutput = document.getElementById('loader-output');
const loaderBar = document.getElementById('loader-bar');
const loaderPct = document.getElementById('loader-percent');

const LOAD_STEPS = [
  { cmd: 'npm install dependencies...', out: '✓ node_modules ready' },
  { cmd: 'building portfolio bundle...', out: '✓ webpack compiled in 420ms' },
  { cmd: 'initializing animations...', out: '✓ GSAP ScrollTrigger loaded' },
  { cmd: 'launching experience...', out: '✓ Portfolio ready!' },
];

let stepIdx = 0, charIdx = 0, pct = 0;

function typeLoaderCmd() {
  if (stepIdx >= LOAD_STEPS.length) {
    setTimeout(() => {
      loader.classList.add('gone');
      setTimeout(() => { loader.style.display = 'none'; initPage(); }, 600);
    }, 500);
    return;
  }
  const step = LOAD_STEPS[stepIdx];
  if (charIdx < step.cmd.length) {
    loaderCmd.textContent = step.cmd.slice(0, ++charIdx);
    setTimeout(typeLoaderCmd, 28);
  } else {
    const line = document.createElement('div');
    line.style.cssText = 'color:#00FF88;font-size:12px';
    line.textContent = step.out;
    loaderOutput.appendChild(line);
    stepIdx++; charIdx = 0;
    pct = Math.min(100, Math.round((stepIdx / LOAD_STEPS.length) * 100));
    loaderBar.style.width = pct + '%';
    loaderPct.textContent = pct + '%';
    setTimeout(typeLoaderCmd, 400);
  }
}
setTimeout(typeLoaderCmd, 400);

// ── TYPED.JS HERO ─────────────────────────────────────────────
function initPage() {
  if (window.Typed) {
    new Typed('#typed-role', {
      strings: ['Full-Stack Developer', 'React Specialist', 'Backend Engineer', 'UI/UX Architect', 'Open Source Contributor'],
      typeSpeed: 60, backSpeed: 35, backDelay: 2000, loop: true, smartBackspace: true,
    });
  }
  initScrollAnimations();
  initNavbar();
  initMobileMenu();
  initCounters();
  initTestimonials();
  initContactForm();
  initMagnetic();
  document.getElementById('footer-year').textContent = new Date().getFullYear();
  document.getElementById('copy-year').textContent = new Date().getFullYear();
}

// ── GSAP SCROLL ANIMATIONS ────────────────────────────────────
function initScrollAnimations() {
  if (!window.gsap || !window.ScrollTrigger) {
    // fallback: use IntersectionObserver
    const reveals = document.querySelectorAll('.reveal-up');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          const delay = parseInt(e.target.dataset.delay || 0);
          setTimeout(() => e.target.classList.add('visible'), delay);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => obs.observe(el));
    animateStackBars();
    return;
  }

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  document.querySelectorAll('.reveal-up').forEach((el, i) => {
    const delay = parseInt(el.dataset.delay || 0) / 1000;
    gsap.fromTo(el,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.9, delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  animateStackBars();

  // Smooth nav links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        gsap.to(window, { duration: 1, scrollTo: { y: target, offsetY: 80 }, ease: 'power3.inOut' });
        const mm = document.getElementById('mobile-menu');
        mm.classList.remove('open');
        document.getElementById('hamburger').classList.remove('open');
      }
    });
  });
}

// ── STACK BARS ────────────────────────────────────────────────
function animateStackBars() {
  const bars = document.querySelectorAll('.stack-bar');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const w = e.target.dataset.width;
        e.target.style.width = w + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => obs.observe(b));
}

// ── NAVBAR ────────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ── MOBILE MENU ───────────────────────────────────────────────
function initMobileMenu() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('.mob-link').forEach(l => {
    l.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
    });
  });
}

// ── COUNTERS ──────────────────────────────────────────────────
function initCounters() {
  const counts = document.querySelectorAll('.stat-num');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = parseInt(e.target.dataset.count);
        let current = 0;
        const step = Math.ceil(target / 50);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          e.target.textContent = current;
          if (current >= target) clearInterval(timer);
        }, 30);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counts.forEach(c => obs.observe(c));
}

// ── TESTIMONIALS ──────────────────────────────────────────────
function initTestimonials() {
  const slides = document.querySelectorAll('.tslide');
  const dots = document.querySelectorAll('.tdot');
  let current = 0;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  document.getElementById('tnext').addEventListener('click', () => goTo(current + 1));
  document.getElementById('tprev').addEventListener('click', () => goTo(current - 1));
  dots.forEach(d => d.addEventListener('click', () => goTo(parseInt(d.dataset.idx))));
  setInterval(() => goTo(current + 1), 5000);
}

// ── CONTACT FORM ──────────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const btn = document.getElementById('submit-btn');
  form.addEventListener('submit', e => {
    e.preventDefault();
    btn.querySelector('.submit-text').textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      form.reset();
      btn.querySelector('.submit-text').textContent = 'Send Message';
      btn.disabled = false;
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 4000);
    }, 1800);
  });
}

// ── MAGNETIC BUTTONS ─────────────────────────────────────────
function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

// ── 3D TILT ON PROJECT CARDS ──────────────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});
