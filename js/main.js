const menuToggle = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-menu]');
const heroBrandGlow = document.querySelector('.hero-brand-glow');

document.querySelectorAll('a[href="#inicio"]').forEach((homeLink) => {
  homeLink.addEventListener('click', (event) => {
    event.preventDefault();

    if (homeLink.closest('.site-header') && heroBrandGlow) {
      heroBrandGlow.classList.remove('is-replaying');
      void heroBrandGlow.offsetWidth;
      heroBrandGlow.classList.add('is-replaying');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.replaceState(null, '', '#inicio');
  });
});

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menu?.classList.toggle('is-open', !isOpen);
});

menu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    menu?.classList.remove('is-open');
  });
});

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => revealObserver.observe(item));

const benefitCards = document.querySelectorAll('.benefit-card');
benefitCards.forEach((card) => {
  card.addEventListener('pointerenter', () => card.classList.remove('is-closing'));

  card.addEventListener('pointerleave', (event) => {
    const nextCard = event.relatedTarget instanceof Element
      ? event.relatedTarget.closest('.benefit-card')
      : null;

    if (!card.classList.contains('benefit-card-content') || nextCard) {
      card.classList.add('is-closing');
    }
  });

  card.addEventListener('animationend', (event) => {
    if (event.animationName === 'benefit-copy-conceal') {
      card.classList.remove('is-closing');
    }
  });
});

const featureSlides = [...document.querySelectorAll('.feature-slide')];
const featureNext = document.querySelector('.feature-next');
let activeFeatureSlide = 0;

featureNext?.addEventListener('click', () => {
  activeFeatureSlide = (activeFeatureSlide + 1) % featureSlides.length;
  featureSlides.forEach((slide, index) => {
    slide.classList.toggle('is-active', index === activeFeatureSlide);
  });
});

const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const bounds = card.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    card.style.setProperty('--glow-x', `${x}%`);
    card.style.setProperty('--glow-y', `${y}%`);
  });

});

const benefitsSection = document.querySelector('.benefits');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let glowFrame;
let particleFrame;
const particles = [];

const particleField = document.createElement('div');
particleField.id = 'particle-field';
particleField.setAttribute('aria-hidden', 'true');
document.body.prepend(particleField);

for (let index = 0; index < 68; index += 1) {
  const particle = document.createElement('span');
  const dot = document.createElement('i');
  const particleData = {
    x: Math.random() * 100,
    y: Math.random() * 125 - 12,
    speed: .012 + (Math.random() * .028),
  };

  particle.className = 'ambient-particle';
  particle.style.setProperty('--size', `${(1.5 + Math.random() * 3.8).toFixed(2)}px`);
  particle.style.setProperty('--base-opacity', (0.18 + Math.random() * 0.72).toFixed(2));
  particle.style.setProperty('--glow-size', `${(2 + Math.random() * 10).toFixed(1)}px`);
  particle.style.setProperty('--duration', `${(1.7 + Math.random() * 5.8).toFixed(2)}s`);
  particle.style.setProperty('--delay', `${(-Math.random() * 6).toFixed(2)}s`);
  particle.style.setProperty('--particle-color', Math.random() > .3 ? 'rgba(215, 255, 95, .95)' : 'rgba(183, 255, 225, .9)');
  particle.append(dot);
  particleField.append(particle);
  particles.push({ element: particle, ...particleData });
}

const updateBenefitsGlow = () => {
  glowFrame = undefined;

  if (!benefitsSection || reduceMotion) return;

  const bounds = benefitsSection.getBoundingClientRect();
  const viewportCenter = window.innerHeight / 2;
  const sectionProgress = Math.min(1, Math.max(0, (viewportCenter - bounds.top) / bounds.height));
  const midpointGlow = Math.sin(sectionProgress * Math.PI);
  const intensity = .025 + (midpointGlow * .42);

  benefitsSection.style.setProperty('--benefit-glow-strength', intensity.toFixed(3));
};

const requestBenefitsGlowUpdate = () => {
  if (!glowFrame) glowFrame = window.requestAnimationFrame(updateBenefitsGlow);
};

updateBenefitsGlow();
window.addEventListener('scroll', requestBenefitsGlowUpdate, { passive: true });
window.addEventListener('resize', requestBenefitsGlowUpdate);

const updateParticleField = () => {
  particleFrame = undefined;

  const scrollDistance = window.scrollY;
  particles.forEach(({ element, x, y, speed }) => {
    const currentY = ((y + (scrollDistance * speed)) % 132) - 10;
    element.style.transform = `translate3d(${x.toFixed(2)}vw, ${currentY.toFixed(2)}vh, 0)`;
  });
};

const requestParticleFieldUpdate = () => {
  if (!particleFrame) particleFrame = window.requestAnimationFrame(updateParticleField);
};

updateParticleField();
window.addEventListener('scroll', requestParticleFieldUpdate, { passive: true });
window.addEventListener('resize', requestParticleFieldUpdate);

const chartCanvas = document.querySelector('.chart-canvas');

if (chartCanvas) {
  const context = chartCanvas.getContext('2d');

  const pointOnCurve = (start, controlOne, controlTwo, end, progress) => {
    const inverse = 1 - progress;
    return {
      x: (inverse ** 3 * start.x) + (3 * inverse ** 2 * progress * controlOne.x) + (3 * inverse * progress ** 2 * controlTwo.x) + (progress ** 3 * end.x),
      y: (inverse ** 3 * start.y) + (3 * inverse ** 2 * progress * controlOne.y) + (3 * inverse * progress ** 2 * controlTwo.y) + (progress ** 3 * end.y),
    };
  };

  const drawGrowthChart = (time = 0) => {
    const bounds = chartCanvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    const pixelRatio = window.devicePixelRatio || 1;
    const width = Math.round(bounds.width);
    const height = Math.round(bounds.height);

    if (chartCanvas.width !== width * pixelRatio || chartCanvas.height !== height * pixelRatio) {
      chartCanvas.width = width * pixelRatio;
      chartCanvas.height = height * pixelRatio;
    }

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);

    const start = { x: width * .06, y: height * .78 };
    const middle = { x: width * .44, y: height * .56 };
    const end = { x: width * .96, y: height * .16 };
    const firstControl = [{ x: width * .17, y: height * .66 }, { x: width * .28, y: height * .6 }];
    const secondControl = [{ x: width * .65, y: height * .5 }, { x: width * .78, y: height * .46 }];

    context.beginPath();
    context.moveTo(start.x, start.y);
    context.bezierCurveTo(firstControl[0].x, firstControl[0].y, firstControl[1].x, firstControl[1].y, middle.x, middle.y);
    context.bezierCurveTo(secondControl[0].x, secondControl[0].y, secondControl[1].x, secondControl[1].y, end.x, end.y);
    context.strokeStyle = '#d7ff5f';
    context.lineWidth = Math.max(5, width * .014);
    context.lineCap = 'round';
    context.shadowBlur = 18;
    context.shadowColor = 'rgba(215, 255, 95, .48)';
    context.stroke();

    const progress = reduceMotion ? .62 : (time % 5400) / 5400;
    const runner = progress < .5
      ? pointOnCurve(start, firstControl[0], firstControl[1], middle, progress * 2)
      : pointOnCurve(middle, secondControl[0], secondControl[1], end, (progress - .5) * 2);

    context.beginPath();
    context.arc(runner.x, runner.y, Math.max(6, width * .02), 0, Math.PI * 2);
    context.fillStyle = '#f7ffef';
    context.shadowBlur = 30;
    context.shadowColor = '#d7ff5f';
    context.fill();

    context.beginPath();
    context.arc(runner.x, runner.y, Math.max(12, width * .04), 0, Math.PI * 2);
    context.strokeStyle = 'rgba(215, 255, 95, .38)';
    context.lineWidth = 1;
    context.stroke();
    context.shadowBlur = 0;

    if (!reduceMotion) window.requestAnimationFrame(drawGrowthChart);
  };

  drawGrowthChart();
}

// El diagrama de Destacados acompaña sutilmente la dirección del cursor.
const workflowTriangles = document.querySelector('.workflow-grid');

if (workflowTriangles && !reduceMotion) {
  workflowTriangles.addEventListener('pointermove', (event) => {
    const bounds = workflowTriangles.getBoundingClientRect();
    const horizontal = ((event.clientX - bounds.left) / bounds.width) - .5;
    const vertical = ((event.clientY - bounds.top) / bounds.height) - .5;

    workflowTriangles.style.setProperty('--workflow-x', `${(horizontal * 11).toFixed(2)}px`);
    workflowTriangles.style.setProperty('--workflow-y', `${(vertical * 8).toFixed(2)}px`);
  });

  workflowTriangles.addEventListener('pointerleave', () => {
    workflowTriangles.style.setProperty('--workflow-x', '0px');
    workflowTriangles.style.setProperty('--workflow-y', '0px');
  });
}

document.querySelector('[data-year]').textContent = new Date().getFullYear();
