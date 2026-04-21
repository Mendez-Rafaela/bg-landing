/* ============================================================
   BGCAR Motors — PÁGINA DE DETALHES
   ============================================================ */

const SUPABASE_URL = 'https://exbitanikpzhepvdxszr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4Yml0YW5pa3B6aGVwdmR4c3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MDUwODMsImV4cCI6MjA5MTA4MTA4M30.FPKfSdLNTpz6VAm07FY_H0rxrNAmuGG09YHmIU1ByCc';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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
        const { data: car, error } = await supabaseClient
            .from('cars')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!car) throw new Error('Veículo não encontrado');

        renderDetails(car);

    } catch (err) {
        console.error('Erro ao carregar detalhes:', err);
        container.innerHTML = `<p style="text-align:center;">Erro ao carregar detalhes do veículo. <br> <a href="index.html" style="color:var(--primary); text-decoration:underline;">Voltar ao início</a></p>`;
    }
}

function renderDetails(car) {
    const container = document.getElementById('carDetailsContent');

    // PHOTOS
    const photos = Array.isArray(car.photos)
        ? car.photos
        : (car.photos ? JSON.parse(car.photos) : []);
    
    const mainPhoto = car.foto_principal || photos[0];
    let orderedPhotos = [];
    if (mainPhoto) {
        orderedPhotos = [mainPhoto, ...photos.filter(p => p !== mainPhoto)];
    } else {
        orderedPhotos = photos;
    }

    // CAROUSEL HTML
    let carouselHTML = '';
    if (orderedPhotos.length > 0) {
        orderedPhotos.forEach(photo => {
            carouselHTML += `
                <div class="details-carousel-slide">
                    <img src="${photo}" alt="${car.modelo}">
                </div>
            `;
        });
    } else {
        carouselHTML = `
            <div class="details-carousel-slide">
                <img src="img/cars-showcase.webp" alt="Sem foto">
            </div>`;
    }

    const hasMultiple = orderedPhotos.length > 1;

    const valorFormatado = car.valor ? `R$ ${parseFloat(car.valor).toLocaleString('pt-BR')}` : 'Sob consulta';
    const whatsappLink = `https://wa.me/551123641590?text=Olá, gostaria de saber mais sobre o ${car.modelo} ${car.ano} que vi no site.`;

    container.innerHTML = `
        <div class="car-header">
            <h1>${car.modelo} <span>/ ${car.ano}</span> / ${car.marca}</h1>
        </div>

        <div class="car-main-grid">
            <div class="details-carousel">
                <div class="details-carousel-container" id="detailsCarouselContainer" data-index="0">
                    ${carouselHTML}
                </div>
                ${hasMultiple ? `
                    <button class="carousel-nav prev" onclick="moveDetailsCarousel(-1)">‹</button>
                    <button class="carousel-nav next" onclick="moveDetailsCarousel(1)">›</button>
                ` : ''}
            </div>

            <div class="car-info-box">
                <div class="car-price-large">${valorFormatado}</div>
                <p class="financing-phrase">
                    Aproveite as melhores taxas de financiamento do mercado! <br>
                    <strong>Entrada facilitada e parcelas que cabem no seu bolso.</strong>
                </p>
                <a href="${whatsappLink}" target="_blank" class="btn btn-primary btn-lg" style="width: 100%; justify-content: center; font-size: 1rem;">
                    <i class="fab fa-whatsapp"></i> FALAR COM VENDEDOR
                </a>
            </div>
        </div>

        <div class="car-description-section">
            <h2>Descrição do Veículo</h2>
            <div class="car-description-text">
                ${car.descricao || 'Nenhuma descrição disponível para este veículo.'}
                
                <br><br>
                <strong>Características:</strong><br>
                • Cor: ${car.cor || '-'}<br>
                • Quilometragem: ${car.km ? parseInt(car.km).toLocaleString('pt-BR') : '0'} km<br>
                • Marca: ${car.marca || '-'}<br>
                • Modelo: ${car.modelo || '-'}<br>
                • Ano: ${car.ano || '-'}
            </div>
            
            <div class="details-cta">
                <a href="${whatsappLink}" target="_blank" class="btn btn-outline-red btn-lg">
                    <i class="fab fa-whatsapp"></i> CONSULTE AS CONDIÇÕES
                </a>
            </div>
        </div>
    `;
}

window.moveDetailsCarousel = function(direction) {
    const container = document.getElementById('detailsCarouselContainer');
    const slides = container.querySelectorAll('.details-carousel-slide');

    let index = parseInt(container.dataset.index || 0);
    index += direction;

    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    container.style.transform = `translateX(-${index * 100}%)`;
    container.dataset.index = index;
};
