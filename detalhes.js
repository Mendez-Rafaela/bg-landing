/* ============================================================
   BGCAR Motors — PÁGINA DE DETALHES
   ============================================================ */

const API_URL = 'https://api.bgcarmotors.com.br';

let detailIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');

    if (slug) {
        loadCarDetailsBySlug(slug);
    } else {
        document.getElementById('carDetailsContent').innerHTML = `
            <a href="index.html" class="back-link">← Voltar ao Estoque</a>
            <p style="text-align:center; color: var(--text-muted);">Veículo não encontrado.</p>
        `;
    }
});

async function loadCarDetailsBySlug(slug) {
    const container = document.getElementById('carDetailsContent');

    try {
        const response = await fetch(`${API_URL}/api/cars`);
        if (!response.ok) throw new Error('Erro ao buscar veículos');

        const cars = await response.json();

        const car = cars.find(c => {
            const carSlug = `${c.brand}-${c.model}-${c.year}`
                .toLowerCase()
                .replace(/\s+/g, '-');

            return carSlug === slug.toLowerCase();
        });

        if (!car) {
            container.innerHTML = `
                <a href="index.html" class="back-link">← Voltar ao Estoque</a>
                <p style="text-align:center; color: var(--text-muted);">Veículo não encontrado.</p>
            `;
            return;
        }

        renderDetails(car);

    } catch (err) {
        console.error('Erro ao carregar detalhes:', err);
        container.innerHTML = `
            <a href="index.html" class="back-link">← Voltar ao Estoque</a>
            <p style="text-align:center; color: var(--text-muted);">
                Erro ao carregar detalhes do veículo.
            </p>
        `;
    }
}

function renderDetails(car) {
    const container = document.getElementById('carDetailsContent');

    const valorFormatado = car.price
        ? `R$ ${parseFloat(car.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        : 'Sob consulta';

    const whatsappLink = `https://wa.me/551123641590?text=Olá, gostaria de saber mais sobre o ${car.brand} ${car.model} ${car.year} que vi no site.`;

    // 🔥 TRATAMENTO DE IMAGENS SEGURO
    let photos = [];

    try {
        photos = typeof car.photos === "string"
            ? JSON.parse(car.photos)
            : car.photos || [];
    } catch (e) {
        photos = [];
    }

    if (!photos.length) {
        photos = [car.main_image || 'img/cars-showcase.webp'];
    }

    detailIndex = 0; // reset ao abrir carro

    container.innerHTML = `
        <a href="index.html" class="back-link">← Voltar ao Estoque</a>

        <div class="car-header">
            <h1>${car.brand} / ${car.model} <span>/ ${car.year}</span></h1>
        </div>

        <div class="car-main-grid">

            <!-- 🔥 CARROSSEL -->
            <div class="details-carousel">

                <div class="details-carousel-container" id="detailsCarousel">

                    ${photos.map((img) => `
                        <div class="details-carousel-slide">
                            <img src="${img}" alt="${car.model}">
                        </div>
                    `).join('')}

                </div>

                <button class="carousel-btn prev" onclick="detailSlide(-1)">&#10094;</button>
                <button class="carousel-btn next" onclick="detailSlide(1)">&#10095;</button>

            </div>

            <!-- INFO -->
            <div class="car-info-box">
                <div class="car-price-large">${valorFormatado}</div>

                <p class="financing-phrase">
                    Aproveite as melhores taxas de financiamento do mercado! <br>
                    <strong>Entrada facilitada e parcelas que cabem no seu bolso.</strong>
                </p>

                <a href="${whatsappLink}" target="_blank"
                   class="btn btn-primary btn-lg"
                   style="width: 100%; justify-content: center; font-size: 1rem; display: flex; align-items: center; gap: 10px;">
                    <i class="fab fa-whatsapp"></i> FALAR COM VENDEDOR
                </a>
            </div>

        </div>

        <!-- DESCRIÇÃO -->
        <div class="car-description-section">
            <h2>Descrição do Veículo</h2>

            <div class="car-description-text">
                ${car.description || 'Nenhuma descrição disponível para este veículo.'}

                <br><br>
                <strong>Características:</strong><br>
                • Cor: ${car.color || '-'}<br>
                • Quilometragem: ${car.km ? parseInt(car.km).toLocaleString('pt-BR') : '0'} km<br>
                • Marca: ${car.brand || '-'}<br>
                • Modelo: ${car.model || '-'}<br>
                • Ano: ${car.year || '-'}
            </div>

            <div class="details-cta">
                <a href="${whatsappLink}" target="_blank" class="btn btn-outline-red btn-lg">
                    <i class="fab fa-whatsapp"></i> CONSULTE AS CONDIÇÕES
                </a>
            </div>
        </div>
    `;
}

// 🔥 CONTROLE DO CARROSSEL
function detailSlide(direction) {
    const slides = document.querySelectorAll(".details-carousel-slide");

    if (!slides.length) return;

    slides[detailIndex].style.display = "none";

    detailIndex += direction;

    if (detailIndex < 0) detailIndex = slides.length - 1;
    if (detailIndex >= slides.length) detailIndex = 0;

    slides[detailIndex].style.display = "block";
}