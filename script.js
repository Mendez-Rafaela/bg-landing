/* ============================================================
   BGCAR Motors — SITE PÚBLICO (CORRIGIDO)
   ============================================================ */

// CONFIGURAÇÃO SUPABASE
const SUPABASE_URL = 'https://exbitanikpzhepvdxszr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4Yml0YW5pa3B6aGVwdmR4c3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MDUwODMsImV4cCI6MjA5MTA4MTA4M30.FPKfSdLNTpz6VAm07FY_H0rxrNAmuGG09YHmIU1ByCc';


const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// INIT
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initHeroAnimations();
  
  if (document.getElementById('estoqueGrid')) {
    loadGlobalEstoque();
  }
});

/* ── Navbar ───────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* ── Menu Mobile ─────────────────────────────────── */
function initMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('mobileMenu');
  const close = document.getElementById('mobileClose');

  if (!toggle || !menu || !close) return;

  const links = menu.querySelectorAll('a');

  toggle.addEventListener('click', () => menu.classList.add('open'));
  close.addEventListener('click', () => menu.classList.remove('open'));
  links.forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });
}

/* ── Hero ─────────────────────────────────────────── */
function initHeroAnimations() {
  const shapes = document.querySelectorAll('.geo-shape');
  shapes.forEach((shape, i) => {
    shape.style.animationDelay = `${i * 2}s`;
  });
}

/* ── Carregar Estoque ─────────────────────────────── */
async function loadGlobalEstoque() {
  const grid = document.getElementById('estoqueGrid');
  if (!grid) return;

  try {
    const { data: cars, error } = await supabaseClient
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!cars || cars.length === 0) {
      grid.innerHTML = `
        <p style="text-align:center; grid-column:1/-1;">
          Nenhum veículo disponível no momento.
        </p>`;
      return;
    }

    grid.innerHTML = '';

    cars.forEach(car => {
      grid.appendChild(createCarCard(car));
    });

  } catch (err) {
    console.error('Erro ao carregar:', err);

    grid.innerHTML = `
      <p style="text-align:center; grid-column:1/-1;">
        Erro ao carregar veículos.
      </p>`;
  }
}

/* ── Criar Card ───────────────────────────────────── */
function createCarCard(car) {
  const card = document.createElement('div');
  card.className = 'car-card';

  // PHOTOS
  const photos = Array.isArray(car.photos)
    ? car.photos
    : (car.photos ? JSON.parse(car.photos) : []);

  const mainPhoto = car.foto_principal || photos[0];

  // Ordena: principal primeiro
  let orderedPhotos = [];

  if (mainPhoto) {
    orderedPhotos = [
      mainPhoto,
      ...photos.filter(p => p !== mainPhoto)
    ];
  } else {
    orderedPhotos = photos;
  }

  // CAROUSEL
  let carouselHTML = '';

  if (orderedPhotos.length > 0) {
    orderedPhotos.forEach(photo => {
      carouselHTML += `
        <div class="car-carousel-slide">
          <img src="${photo}" alt="${car.modelo}">
        </div>
      `;
    });
  } else {
    carouselHTML = `
      <div class="car-carousel-slide">
        <img src="img/cars-showcase.webp" alt="Sem foto">
      </div>`;
  }

  const hasMultiple = orderedPhotos.length > 1;

  // CARD
  card.innerHTML = `
    <div class="car-card-image">
      <div class="car-carousel-container" data-index="0">
        ${carouselHTML}
      </div>

      ${hasMultiple ? `
        <button class="carousel-nav prev" onclick="moveCarousel(this, -1)">‹</button>
        <button class="carousel-nav next" onclick="moveCarousel(this, 1)">›</button>
      ` : ''}

      <div class="car-price-badge">
        R$ ${car.valor ? parseFloat(car.valor).toLocaleString('pt-BR') : 'Sob consulta'}
      </div>
    </div>

    <div class="car-card-body">
      <h3>
  ${car.modelo || 'Veículo'}
  ${car.marca ? ' / ' + car.marca : ''}
     </h3>

      <p>${car.ano || '-'} • ${car.cor || '-'}</p>
      <p>${car.km || 0} km</p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <a href="detalhes.html?id=${car.id}" class="btn btn-outline" style="padding: 0.875rem 1rem; font-size: 0.65rem;">
          Saiba Mais
        </a>
        <a href="https://wa.me/551123641590?text=Olá, tenho interesse no ${car.modelo}"
           target="_blank"
           class="btn btn-primary"
           style="padding: 0.875rem 1rem; font-size: 0.65rem;">
          Tenho interesse
        </a>
      </div>
    </div>
  `;

  return card;
}

/* ── Carrossel ───────────────────────────────────── */
window.moveCarousel = function(btn, direction) {
  const container = btn.parentElement.querySelector('.car-carousel-container');
  const slides = container.querySelectorAll('.car-carousel-slide');

  let index = parseInt(container.dataset.index || 0);
  index += direction;

  if (index >= slides.length) index = 0;
  if (index < 0) index = slides.length - 1;

  container.style.transform = `translateX(-${index * 100}%)`;
  container.dataset.index = index;
};