/* ============================================================
   BGCAR Motors — PÁGINA DE DETALHES
   ============================================================ */

const API_URL = 'https://api.bgcarmotors.com.br';

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
            const carSlug = `${c.brand}-${c.model}-${c.year}`.toLowerCase().replace(/\s+/g, '-');
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

    const valorFormatado = car.price ? `R$ ${parseFloat(car.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Sob consulta';
    const whatsappLink = `https://wa.me/551123641590?text=Olá, gostaria de saber mais sobre o ${car.brand} ${car.model} ${car.year} que vi no site.`;
    
    // Trata múltiplas imagens (separadas por vírgula)
    const images = car.main_image ? car.main_image.split(',') : ['img/cars-showcase.webp'];

    container.innerHTML = `
        <a href="index.html" class="back-link">← Voltar ao Estoque</a>

        <div class="car-header">
            <h1>${car.brand} / ${car.model} <span>/ ${car.year}</span></h1>
        </div>

        <div class="car-main-grid">
            <div class="details-carousel">
                <div class="details-carousel-container" id="detailsCarouselContainer" data-index="0">
                    ${images.map(img => `
                        <div class="details-carousel-slide">
                            <img src="${img.trim()}" alt="${car.model}">
                        </div>
                    `).join('')}
                </div>
                ${images.length > 1 ? `
                    <button class="carousel-nav prev" onclick="moveCarousel(-1)">&#10094;</button>
                    <button class="carousel-nav next" onclick="moveCarousel(1)">&#10095;</button>
                    <div class="carousel-dots">
                        ${images.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}" onclick="setCarousel(${i})"></span>`).join('')}
                    </div>
                ` : ''}
            </div>

            <div class="car-info-box">
                <div class="car-price-large">${valorFormatado}</div>
                <div class="promo-box">
                    <h3>Condições Imperdíveis</h3>
                    <p>Venha realizar o seu sonho do carro novo conosco.</p>
                    <a href="${whatsappLink}" target="_blank" class="btn btn-primary btn-lg" style="width: 100%; justify-content: center; font-size: 1rem; display: flex; align-items: center; gap: 10px;">
                        <i class="fab fa-whatsapp"></i> SIMULAR COMPRA
                    </a>
                </div>
            </div>
        </div>

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
        </div>
    `;
}

// Lógica do Carrossel
window.moveCarousel = function(step) {
    const container = document.getElementById('detailsCarouselContainer');
    const slides = document.querySelectorAll('.details-carousel-slide');
    const dots = document.querySelectorAll('.dot');
    let index = parseInt(container.getAttribute('data-index'));

    index += step;
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    container.style.transform = `translateX(-${index * 100}%)`;
    container.setAttribute('data-index', index);

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
};

window.setCarousel = function(index) {
    const container = document.getElementById('detailsCarouselContainer');
    const dots = document.querySelectorAll('.dot');

    container.style.transform = `translateX(-${index * 100}%)`;
    container.setAttribute('data-index', index);

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
};