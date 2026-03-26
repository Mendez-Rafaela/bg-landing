/**
 * BGCAR Motors — script.js
 * Interações da landing page e Gestão Dinâmica de Estoque com Carrossel e campo Cor
 */

'use strict';

/* ── Configurações Globais ─────────────────────────────────── */
const STORAGE_KEY = 'bgcar_estoque';
const DEFAULT_CAR_IMAGE = 'img/cars-showcase.webp';

/* ── Navbar: scroll effect ──────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); 
})();


/* ── Mobile Menu ────────────────────────────────────────────── */
(function initMobileMenu() {
  const toggle      = document.getElementById('navToggle');
  const menu        = document.getElementById('mobileMenu');
  const closeBtn    = document.getElementById('mobileMenuClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!toggle || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    toggle.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('open');
    toggle.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  menu.addEventListener('click', function (e) {
    if (e.target === menu) closeMenu();
  });
})();


/* ── Smooth scroll for anchor links ────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navbarHeight = document.getElementById('navbar')
        ? document.getElementById('navbar').offsetHeight
        : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();


/* ── Estoque Dinâmico (Carregamento no Index) ──────────────── */
function loadEstoque() {
  const container = document.getElementById('estoqueGrid');
  if (!container) return;

  let cars = [];
  try {
    cars = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) { cars = []; }

  if (cars.length === 0) {
    container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">Nenhum veículo em estoque no momento.</div>';
    return;
  }

  const disponiveis = cars.filter(car => car.status !== 'Vendido');

  container.innerHTML = disponiveis.map((car, index) => {
    // Preparar lista de imagens (se for string única, converter para array)
    let images = [];
    if (Array.isArray(car.imagens) && car.imagens.length > 0) {
      images = car.imagens;
    } else if (car.imagem) {
      images = [car.imagem];
    } else {
      images = [DEFAULT_CAR_IMAGE];
    }

    const hasMultiple = images.length > 1;

    return `
      <div class="car-card fade-in visible" style="transition-delay: ${index * 0.1}s" data-id="${car.id}">
        <div class="car-card-image">
          <div class="car-carousel-container" id="carousel-${car.id}">
            ${images.map(img => `
              <div class="car-carousel-slide">
                <img src="${img}" alt="${car.marca} ${car.modelo}" loading="lazy" />
              </div>
            `).join('')}
          </div>
          
          ${hasMultiple ? `
            <button class="carousel-nav prev" onclick="moveCarousel('${car.id}', -1)">&#10094;</button>
            <button class="carousel-nav next" onclick="moveCarousel('${car.id}', 1)">&#10095;</button>
            <div class="carousel-dots" id="dots-${car.id}">
              ${images.map((_, i) => `<span class="carousel-dot ${i === 0 ? 'active' : ''}" onclick="setCarousel('${car.id}', ${i})"></span>`).join('')}
            </div>
          ` : ''}
          
          <span class="car-price-badge">R$ ${Number(car.preco).toLocaleString('pt-BR')}</span>
        </div>
        <div class="car-card-body">
          <h3 class="car-card-title">${car.marca} ${car.modelo}</h3>
          <ul class="car-features">
            <li class="car-feature">Ano: ${car.ano || '—'}</li>
            <li class="car-feature">Cor: ${car.cor || '—'}</li>
            <li class="car-feature">Câmbio: ${car.cambio || '—'}</li>
            <li class="car-feature">Placa: Final ${car.placa || '—'}</li>
            <li class="car-feature">KM: ${car.km ? Number(car.km).toLocaleString('pt-BR') : '—'}</li>
          </ul>
          <a href="https://wa.me/5511999999999?text=Olá! Tenho interesse no ${car.marca} ${car.modelo} (${car.ano})."
             class="btn btn-primary" target="_blank" rel="noopener" style="width:100%; justify-content:center;">
            &#128172; CONSULTAR
          </a>
        </div>
      </div>
    `;
  }).join('');
}

/* ── Lógica do Carrossel ── */
const carousels = {};

window.moveCarousel = function(carId, direction) {
  if (!carousels[carId]) carousels[carId] = 0;
  
  const container = document.getElementById(`carousel-${carId}`);
  const slides = container.children.length;
  
  carousels[carId] = (carousels[carId] + direction + slides) % slides;
  updateCarouselUI(carId);
};

window.setCarousel = function(carId, index) {
  carousels[carId] = index;
  updateCarouselUI(carId);
};

function updateCarouselUI(carId) {
  const index = carousels[carId];
  const container = document.getElementById(`carousel-${carId}`);
  const dots = document.getElementById(`dots-${carId}`);
  
  if (container) {
    container.style.transform = `translateX(-${index * 100}%)`;
  }
  
  if (dots) {
    const dotElements = dots.children;
    for (let i = 0; i < dotElements.length; i++) {
      dotElements[i].classList.toggle('active', i === index);
    }
  }
}

// Chamar ao carregar a página
document.addEventListener('DOMContentLoaded', loadEstoque);


/* ── Intersection Observer: fade-in animations ──────────────── */
(function initFadeIn() {
  const elements = document.querySelectorAll('.fade-in, .fade-in-left');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
  );

  elements.forEach(function (el) { observer.observe(el); });
})();
