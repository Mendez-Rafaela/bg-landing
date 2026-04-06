/* ============================================================
   BGCAR Motors — script.js (Versão Supabase)
   ============================================================ */

// CONFIGURAÇÃO DO SUPABASE (O usuário preencherá no README)
const SUPABASE_URL = 'https://exbitanikpzhepvdxszr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4Yml0YW5pa3B6aGVwdmR4c3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MDUwODMsImV4cCI6MjA5MTA4MTA4M30.FPKfSdLNTpz6VAm07FY_H0rxrNAmuGG09YHmIU1ByCc';

// Inicializa o cliente Supabase se as chaves existirem
let supabaseClient = null;

if (SUPABASE_URL && SUPABASE_KEY) {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initHeroAnimations();
  
  // Detecta qual página estamos
  if (document.getElementById('estoqueGrid')) {
    loadGlobalEstoque();
  }
});

/* ── Navbar Scroll ────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ── Menu Mobile ─────────────────────────────────────────── */
function initMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('mobileMenu');
  const close = document.getElementById('mobileClose');
  const links = menu.querySelectorAll('a');

  toggle.addEventListener('click', () => menu.classList.add('open'));
  close.addEventListener('click', () => menu.classList.remove('open'));
  links.forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });
}

/* ── Animações Hero ──────────────────────────────────────── */
function initHeroAnimations() {
  const shapes = document.querySelectorAll('.geo-shape');
  shapes.forEach((shape, index) => {
    shape.style.animationDelay = `${index * 2}s`;
  });
}

/* ── Carregar Estoque do Supabase (Visível para Todos) ────── */
async function loadGlobalEstoque() {
  const grid = document.getElementById('estoqueGrid');
  
  // Se não houver Supabase configurado, avisa o usuário
  if (!supabase) {
    grid.innerHTML = `<p style="text-align: center; grid-column: 1/-1; color: #e21818;">
      Erro: Supabase não configurado. Siga o guia no README para ativar o estoque real.
    </p>`;
    return;
  }

  try {
    const { data: cars, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!cars || cars.length === 0) {
      grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: var(--text-muted);">Nenhum veículo no estoque no momento.</p>';
      return;
    }

    grid.innerHTML = '';
    cars.forEach(car => {
      grid.appendChild(createCarCard(car));
    });
  } catch (err) {
    console.error('Erro ao carregar estoque:', err);
    grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: var(--text-muted);">Erro ao carregar veículos.</p>';
  }
}

/* ── Criar Card de Carro com Carrossel ─────────────────────── */
function createCarCard(car) {
  const card = document.createElement('div');
  card.className = 'car-card';
  
  // Garantir que fotos seja um array
  const photos = Array.isArray(car.photos) ? car.photos : (car.photos ? JSON.parse(car.photos) : []);
  const hasMultiple = photos.length > 1;

  let carouselHTML = '';
  photos.forEach((photo, idx) => {
    carouselHTML += `
      <div class="car-carousel-slide">
        <img src="${photo}" alt="${car.model}" loading="lazy">
      </div>
    `;
  });

  if (photos.length === 0) {
    carouselHTML = `<div class="car-carousel-slide"><img src="img/cars-showcase.webp" alt="Sem foto"></div>`;
  }

  card.innerHTML = `
    <div class="car-card-image">
      <div class="car-carousel-container" style="transform: translateX(0%)">
        ${carouselHTML}
      </div>
      ${hasMultiple ? `
        <button class="carousel-nav prev" onclick="moveCarousel(this, -1)">&#10094;</button>
        <button class="carousel-nav next" onclick="moveCarousel(this, 1)">&#10095;</button>
        <div class="carousel-dots">
          ${photos.map((_, i) => `<span class="carousel-dot ${i === 0 ? 'active' : ''}"></span>`).join('')}
        </div>
      ` : ''}
      <div class="car-price-badge">R$ ${parseFloat(car.price).toLocaleString('pt-BR')}</div>
    </div>
    <div class="car-card-body">
      <h3 class="car-card-title">${car.model}</h3>
      <div class="car-features">
        <div class="car-feature"><i class="far fa-calendar-alt"></i> ${car.year}</div>
        <div class="car-feature"><i class="fas fa-palette"></i> ${car.color || 'N/A'}</div>
        <div class="car-feature"><i class="fas fa-cog"></i> ${car.transmission}</div>
        <div class="car-feature"><i class="fas fa-tachometer-alt"></i> ${car.km} km</div>
        <div class="car-feature"><i class="fas fa-id-card"></i> Placa: ${car.plate || 'N/A'}</div>
      </div>
      <a href="https://wa.me/551123641590?text=Olá, tenho interesse no ${car.model} (${car.year})" target="_blank" class="btn btn-primary" style="width: 100%; justify-content: center;">
        TENHO INTERESSE
      </a>
    </div>
  `;

  return card;
}

/* ── Lógica do Carrossel ───────────────────────────────────── */
window.moveCarousel = function(btn, direction) {
  const container = btn.parentElement.querySelector('.car-carousel-container');
  const slides = container.querySelectorAll('.car-carousel-slide');
  const dots = btn.parentElement.querySelectorAll('.carousel-dot');
  
  let currentIndex = parseInt(container.dataset.index || 0);
  currentIndex += direction;

  if (currentIndex >= slides.length) currentIndex = 0;
  if (currentIndex < 0) currentIndex = slides.length - 1;

  container.style.transform = `translateX(-${currentIndex * 100}%)`;
  container.dataset.index = currentIndex;

  // Atualiza dots
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });
};
