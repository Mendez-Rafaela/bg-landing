/* ============================================================
   BGCAR Motors — PÁGINA DE DETALHES
   ============================================================ */

/* ============================================================
   BGCAR Motors — PÁGINA DE DETALHES (CONECTADO À VPS)
   ============================================================ */

const API_URL = 'https://api.bgcarmotors.com.br';

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const carId = params.get('id');

    if (carId) {
        loadCarDetails(carId);
    } else {
        document.getElementById('carDetailsContent').innerHTML = '<p style="text-align:center;">Veículo não encontrado.</p>';
    }
});

async function loadCarDetails(id) {
    const container = document.getElementById('carDetailsContent');

    try {
        // Busca na sua nova API em vez do Supabase
        const response = await fetch(`${API_URL}/api/cars/${id}`);
        if (!response.ok) throw new Error('Veículo não encontrado na VPS');
        
        const car = await response.json();
        renderDetails(car);

    } catch (err) {
        console.error('Erro ao carregar detalhes:', err);
        container.innerHTML = `
            <p style="text-align:center;">
                Erro ao carregar detalhes do veículo.<br>
                <a href="index.html" style="color:var(--primary); text-decoration:underline;">Voltar ao início</a>
            </p>`;
    }
}

function renderDetails(car) {
    const container = document.getElementById('carDetailsContent');

    // Monta a URL da imagem principal da VPS
    const mainPhoto = car.main_image ? `${API_URL}${car.main_image}` : 'img/cars-showcase.webp';

    // Formatação de valores
    const valorFormatado = car.price ? `R$ ${parseFloat(car.price).toLocaleString('pt-BR')}` : 'Sob consulta';
    const whatsappLink = `https://wa.me/551123641590?text=Olá, gostaria de saber mais sobre o ${car.brand} ${car.model} ${car.year} que vi no site.`;

    container.innerHTML = `
        <div class="car-header">
            <h1>${car.brand} / ${car.model} <span>/ ${car.year}</span></h1>
        </div>

        <div class="car-main-grid">
            <div class="details-carousel">
                <div class="details-carousel-container" id="detailsCarouselContainer" data-index="0">
                    <div class="details-carousel-slide">
                        <img src="${mainPhoto}" alt="${car.model}">
                    </div>
                </div>
                </div>

            <div class="car-info-box">
                <div class="car-price-large">${valorFormatado}</div>
                <p class="financing-phrase">
                    Aproveite as melhores taxas de financiamento do mercado! <br>
                    <strong>Entrada facilitada e parcelas que cabem no seu bolso.</strong>
                </p>
                <a href="${whatsappLink}" target="_blank" class="btn btn-primary btn-lg" style="width: 100%; justify-content: center; font-size: 1rem; display: flex; align-items: center; gap: 10px;">
                    <i class="fab fa-whatsapp"></i> FALAR COM VENDEDOR
                </a>
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
            
            <div class="details-cta">
                <a href="${whatsappLink}" target="_blank" class="btn btn-outline-red btn-lg">
                    <i class="fab fa-whatsapp"></i> CONSULTE AS CONDIÇÕES
                </a>
            </div>
        </div>
    `;
}

// Mantendo a função do carrossel para compatibilidade de layout
window.moveDetailsCarousel = function(direction) {
    const container = document.getElementById('detailsCarouselContainer');
    if (!container) return;
    const slides = container.querySelectorAll('.details-carousel-slide');
    if (slides.length <= 1) return;

    let index = parseInt(container.dataset.index || 0);
    index += direction;

    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    container.style.transform = `translateX(-${index * 100}%)`;
    container.dataset.index = index;
};