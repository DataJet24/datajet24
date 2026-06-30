/**
 * DataJet24 — Main JavaScript
 * The Global Intelligence Platform for Business Aviation
 * Production-ready animation and interaction layer
 */

'use strict';

// ============================================================
// LOADING SCREEN
// ============================================================
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1800);
  });

  document.body.style.overflow = 'hidden';
})();


// ============================================================
// HERO CANVAS — Particles
// ============================================================
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animFrame;
  let particles = [];

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 18000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.2 + 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1
      });
    }
  }

  function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 140;
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.12;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 120, 0, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 120, 0, ${p.opacity})`;
      ctx.fill();

      // Update
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });

    animFrame = requestAnimationFrame(drawFrame);
  }

  resize();
  createParticles();
  drawFrame();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
})();

// ============================================================
// WORLD MAP — Flight Routes Animation
// ============================================================
(function initWorldMap() {
  const routesGroup = document.getElementById('flightRoutes');
  const airportsGroup = document.getElementById('airportDots');
  if (!routesGroup || !airportsGroup) return;

  // Key airports (x, y in SVG viewBox 0 0 1200 600)
  const airports = [
    { id: 'LHR', x: 490, y: 105, name: 'London' },
    { id: 'CDG', x: 510, y: 115, name: 'Paris' },
    { id: 'FRA', x: 535, y: 105, name: 'Frankfurt' },
    { id: 'DXB', x: 700, y: 210, name: 'Dubai' },
    { id: 'SIN', x: 850, y: 290, name: 'Singapore' },
    { id: 'JFK', x: 210, y: 130, name: 'New York' },
    { id: 'LAX', x: 105, y: 155, name: 'Los Angeles' },
    { id: 'HKG', x: 890, y: 200, name: 'Hong Kong' },
    { id: 'NRT', x: 960, y: 140, name: 'Tokyo' },
    { id: 'SYD', x: 950, y: 390, name: 'Sydney' },
    { id: 'GRU', x: 260, y: 360, name: 'São Paulo' },
    { id: 'JNB', x: 580, y: 360, name: 'Johannesburg' },
    { id: 'BOM', x: 760, y: 220, name: 'Mumbai' },
    { id: 'SVO', x: 640, y: 80, name: 'Moscow' },
    { id: 'ORD', x: 175, y: 125, name: 'Chicago' },
    { id: 'MIA', x: 195, y: 200, name: 'Miami' },
    { id: 'LEB', x: 615, y: 170, name: 'Beirut' },
  ];

  // Draw airport dots
  airports.forEach(ap => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Outer ring
    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring.setAttribute('cx', ap.x);
    ring.setAttribute('cy', ap.y);
    ring.setAttribute('r', '4');
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', 'rgba(255,120,0,0.4)');
    ring.setAttribute('stroke-width', '1');
    
    // Inner dot
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', ap.x);
    dot.setAttribute('cy', ap.y);
    dot.setAttribute('r', '2');
    dot.setAttribute('fill', 'rgba(255,120,0,0.8)');

    g.appendChild(ring);
    g.appendChild(dot);
    airportsGroup.appendChild(g);
  });

  // Draw flight routes with animation
  const routes = [
    ['LHR', 'JFK'], ['LHR', 'DXB'], ['CDG', 'NRT'], ['FRA', 'SIN'],
    ['JFK', 'LAX'], ['DXB', 'BOM'], ['DXB', 'HKG'], ['SIN', 'SYD'],
    ['LHR', 'SVO'], ['JFK', 'MIA'], ['ORD', 'LHR'], ['GRU', 'LHR'],
    ['JNB', 'DXB'], ['HKG', 'NRT'], ['BOM', 'SIN'], ['LAX', 'NRT'],
    ['MIA', 'GRU'], ['LEB', 'DXB'],
  ];

  const svgNS = 'http://www.w3.org/2000/svg';

  routes.forEach((route, i) => {
    const from = airports.find(a => a.id === route[0]);
    const to = airports.find(a => a.id === route[1]);
    if (!from || !to) return;

    // Create curved path
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2 - Math.abs(to.x - from.x) * 0.15;

    const path = document.createElementNS(svgNS, 'path');
    const d = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'rgba(255,120,0,0.18)');
    path.setAttribute('stroke-width', '0.8');

    // Animated dot on path
    const animDot = document.createElementNS(svgNS, 'circle');
    animDot.setAttribute('r', '2.5');
    animDot.setAttribute('fill', 'rgba(255,150,0,0.9)');

    const animMotion = document.createElementNS(svgNS, 'animateMotion');
    animMotion.setAttribute('dur', `${6 + i * 0.7}s`);
    animMotion.setAttribute('repeatCount', 'indefinite');
    animMotion.setAttribute('begin', `${i * 0.4}s`);

    const mPath = document.createElementNS(svgNS, 'mpath');
    path.id = `route-${i}`;
    mPath.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#route-${i}`);

    animMotion.appendChild(mPath);
    animDot.appendChild(animMotion);

    routesGroup.appendChild(path);
    routesGroup.appendChild(animDot);
  });
})();

// ============================================================
// ANIMATED COUNTERS
// ============================================================
(function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  function formatNumber(n) {
    if (n >= 1000) return Math.round(n).toLocaleString();
    return Math.round(n).toString();
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2200;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = formatNumber(current);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = formatNumber(target);
        if (target >= 1000) {
          el.textContent = formatNumber(target) + '+';
        }
      }
    }

    requestAnimationFrame(update);
  }

  // Use IntersectionObserver to trigger when visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
})();

// ============================================================
// SCROLL ANIMATIONS (Custom AOS)
// ============================================================
(function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

// ============================================================
// LIVE DATA TICKER — Intel Card
// ============================================================
(function initLiveTicker() {
  const liveCounter = document.querySelector('.counter-live');
  if (!liveCounter) return;

  let baseValue = 4218;

  setInterval(() => {
    const change = Math.floor(Math.random() * 8) - 3;
    baseValue = Math.max(4100, Math.min(4400, baseValue + change));
    liveCounter.textContent = baseValue.toLocaleString();
    
    // Flash effect
    liveCounter.style.color = '#00D084';
    setTimeout(() => {
      liveCounter.style.color = '';
    }, 400);
  }, 3000);
})();

// ============================================================
// PARALLAX — Hero
// ============================================================
(function initParallax() {
  const heroMap = document.querySelector('.hero-map');
  const radarOverlay = document.querySelector('.radar-overlay');
  if (!heroMap || !radarOverlay) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const hero = document.getElementById('hero');
        if (!hero) { ticking = false; return; }
        const heroHeight = hero.offsetHeight;
        const progress = Math.min(scrolled / heroHeight, 1);
        
        heroMap.style.transform = `translateY(${scrolled * 0.3}px)`;
        radarOverlay.style.transform = `translate(-50%, -50%) translateY(${scrolled * 0.15}px)`;
        ticking = false;
      });
      ticking = true;
    }
  });
})();

// ============================================================
// PLATFORM CARD HOVER — Subtle tilt effect
// ============================================================
(function initCardTilt() {
  document.querySelectorAll('.platform-card, .user-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateX(${y * -4}deg) rotateY(${x * 4}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
      setTimeout(() => { card.style.transition = ''; }, 400);
    });
  });
})();

// ============================================================
// FORM — Enhanced interaction
// ============================================================
(function initForm() {
  const form = document.getElementById('waitlistForm');
  if (!form) return;

  const emailInput = document.getElementById('emailInput');
  const submitBtn = form.querySelector('.btn-waitlist');

  if (emailInput) {
    emailInput.addEventListener('focus', () => {
      emailInput.parentElement.classList.add('focused');
    });
    emailInput.addEventListener('blur', () => {
      emailInput.parentElement.classList.remove('focused');
    });
  }

  form.addEventListener('submit', (e) => {
    if (submitBtn) {
      submitBtn.innerHTML = `
        <span>Joining...</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
      `;
      submitBtn.style.opacity = '0.8';
      submitBtn.disabled = true;
    }
  });
})();

// ============================================================
// MARQUEE — Pause on hover
// ============================================================
(function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;

  const wrapper = track.closest('.marquee-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });
    wrapper.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });
  }
})();

// ============================================================
// CSS ANIMATION - add spin keyframe dynamically
// ============================================================
(function addSpinKeyframe() {
  const style = document.createElement('style');
  style.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
  document.head.appendChild(style);
})();


// ==========================================================
// BREVO INTEGRATION - Add to Early Access Waitlist
// ==========================================================
(function initBrevoIntegration() {
    var form = document.getElementById('waitlistForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
          var emailInput = document.getElementById('emailInput');
          if (!emailInput || !emailInput.value) return;

          fetch('https://api.brevo.com/v3/contacts', {
                  method: 'POST',
                  headers: {
                            'api-key': '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',
                            'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                            email: emailInput.value.trim(),
                            listIds: [5],
                            updateEnabled: true
                  }),
                  keepalive: true
          }).catch(function () {});
    });
})();
console.log('%c DataJet24 ', 'background: #FF7800; color: #000; font-weight: bold; font-size: 14px; padding: 4px 8px; border-radius: 4px;');
console.log('%c The Global Intelligence Platform for Business Aviation ', 'color: #FF7800; font-size: 11px;');
