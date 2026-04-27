const API_URL = 'https://api.bgcarmotors.com.br';
const carIndexMap = {};

document.addEventListener('DOMContentLoaded', () => {
    fetchCars();
    initMobileMenu();
});


// ============================================================
// BUSCAR CARROS
// ============================================================
async function fetchCars() {
    const estoqueGrid = document.getElementById('estoqueGrid');

    try {
        const response = await fetch(`${API_URL}/api/cars`);
        const cars = await response.json();

        if (!cars || cars.length === 0) {
            estoqueGrid.innerHTML = `
                <p style="text-align:center; grid-column:1/-1; color:var(--text-muted);">
                    Nenhum veículo no estoque no momento.
                </p>`;
            return;
        }

        renderCars(cars);

    } catch (error) {
        console.error('Erro ao carregar estoque:', error);
        estoqueGrid.innerHTML = `
            <p style="text-align:center; grid-column:1/-1; color:var(--text-red);">
                Erro ao carregar o estoque.
            </p>`;
    }
}


// ============================================================
// SLUG
// ============================================================
function generateSlug(brand, model, year) {
    return `${brand}-${model}-${year}`
        .toLowerCase()
        .replace(/\s+/g, '-');
}


// ============================================================
// RENDER CARDS
// ============================================================
function renderCars(cars) {
    const estoqueGrid = document.getElementById('estoqueGrid');
    estoqueGrid.innerHTML = '';

    cars.forEach(car => {

        const slug = generateSlug(car.brand, car.model, car.year);
        const detailsUrl = `detalhes.html?slug=${slug}`;

        // -----------------------------
        // TRATAMENTO DE IMAGENS
        // -----------------------------
        let photos = [];

        try {
            photos = typeof car.photos === "string"
                ? JSON.parse(car.photos)
                : car.photos || [];
        } catch (e) {
            photos = [];
        }

        if (!photos.length) {
            photos = [car.main_image || 'img/placeholder.jpg'];
        }

        // -----------------------------
        // CARD ORIGINAL + SETAS
        // -----------------------------
        const carCard = `
        <div class="car-card">

            <div class="car-img">
                <div class="carousel" id="carousel-${car.id}">

                    ${photos.map((img, i) => `
                        <img src="${img}" class="slide ${i === 0 ? 'active' : ''}">
                    `).join('')}

                    <button class="carousel-btn prev"
                        onclick="changeSlide(${car.id}, -1)">
                        &#10094;
                    </button>

                    <button class="carousel-btn next"
                        onclick="changeSlide(${car.id}, 1)">
                        &#10095;
                    </button>

                </div>
            </div>

            <div class="car-info">

                <h3 class="car-title">${car.brand} ${car.model}</h3>

                <p class="car-details">
                    ${car.year} • ${car.km} km • ${car.color}
                </p>

                <div class="car-price">
                    R$ ${parseFloat(car.price).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2
                    })}
                </div>

                <!-- BOTÕES ORIGINAIS RESTAURADOS -->
                <div style="display:flex; gap:10px; margin-top:15px;">

                    <a href="${detailsUrl}"
                       class="btn btn-outline"
                       style="flex:1;">
                        <i class="fas fa-plus-circle"></i> MAIS INFO
                    </a>

                    <a href="https://wa.me/551123641590?text=Olá, tenho interesse no ${car.brand} ${car.model}"
                       target="_blank"
                       class="btn btn-primary"
                       style="flex:1.2;">
                        <i class="fab fa-whatsapp"></i> TENHO INTERESSE
                    </a>

                </div>

            </div>

        </div>
        `;

        estoqueGrid.innerHTML += carCard;
    });
}


// ============================================================
// CARROSSEL (SETAS)
// ============================================================
function changeSlide(id, direction) {
    const carousel = document.querySelector(`#carousel-${id}`);
    const slides = carousel.querySelectorAll(".slide");

    let activeIndex = 0;

    slides.forEach((img, i) => {
        if (img.classList.contains("active")) activeIndex = i;
        img.classList.remove("active");
    });

    let nextIndex = activeIndex + direction;

    if (nextIndex < 0) nextIndex = slides.length - 1;
    if (nextIndex >= slides.length) nextIndex = 0;

    slides[nextIndex].classList.add("active");
}


// ============================================================
// MENU MOBILE
// ============================================================
function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const menu = document.getElementById('mobileMenu');
    const close = document.getElementById('mobileClose');

    if (toggle) {
        toggle.addEventListener('click', () => menu.classList.add('active'));
    }

    if (close) {
        close.addEventListener('click', () => menu.classList.remove('active'));
    }
}

function changeSlide(carId, direction) {
    const carousel = document.querySelector(`#carousel-${carId}`);
    const slides = carousel.querySelectorAll('.slide');

    if (!carIndexMap[carId]) {
        carIndexMap[carId] = 0;
    }

    slides[carIndexMap[carId]].classList.remove('active');

    carIndexMap[carId] += direction;

    if (carIndexMap[carId] < 0) {
        carIndexMap[carId] = slides.length - 1;
    }

    if (carIndexMap[carId] >= slides.length) {
        carIndexMap[carId] = 0;
    }

    slides[carIndexMap[carId]].classList.add('active');
}

