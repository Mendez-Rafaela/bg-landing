/* ============================================================
   BGCAR Motors — CONFIGURAÇÃO DA VPS
   ============================================================ */

const API_URL = 'https://api.bgcarmotors.com.br';

document.addEventListener('DOMContentLoaded', () => {
    fetchCars();
    initMobileMenu();
});


// Função para buscar os carros da sua Hostinger
async function fetchCars() {
    const estoqueGrid = document.getElementById('estoqueGrid');
    
    try {
        const response = await fetch(`${API_URL}/api/cars`);
        const cars = await response.json();

        if (!cars || cars.length === 0) {
            estoqueGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: var(--text-muted);">Nenhum veículo no estoque no momento.</p>';
            return;
        }

        renderCars(cars);

    } catch (error) {
        console.error('Erro ao carregar estoque da VPS:', error);
        estoqueGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: var(--text-red);">Erro ao carregar o estoque. Verifique a conexão com o servidor.</p>';
    }
}


// Função para gerar slug amigável
function generateSlug(brand, model, year) {
    return `${brand}-${model}-${year}`.toLowerCase().replace(/\s+/g, '-');
}


// Função para desenhar os cards na tela
function renderCars(cars) {
    const estoqueGrid = document.getElementById('estoqueGrid');
    estoqueGrid.innerHTML = '';

    cars.forEach(car => {

        const slug = generateSlug(car.brand, car.model, car.year);
        const detailsUrl = `detalhes.html?slug=${slug}`;

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

        const carCard = `
            <div class="car-card">
                
                <div class="car-img">
                    <div class="carousel" id="carousel-${car.id}">
    
    ${photos.map((img, i) => `
        <img src="${img}" class="slide ${i === 0 ? 'active' : ''}">
    `).join('')}

    <button class="carousel-btn prev" onclick="changeSlide(${car.id}, -1)">&#10094;</button>
    <button class="carousel-btn next" onclick="changeSlide(${car.id}, 1)">&#10095;</button>

</div>
                        ${photos.map((img, i) => `
                            <img src="${img}" class="slide ${i === 0 ? 'active' : ''}">
                        `).join('')}
                    </div>
                </div>

                <div class="car-info">
                    <h3 class="car-title">${car.brand} ${car.model}</h3>
                    <p class="car-details">${car.year} • ${car.km} km • ${car.color}</p>

                    <div class="car-price">
                        R$ ${parseFloat(car.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>

                    <div style="display: flex; gap: 10px; margin-top: 15px;">
                        
                        <a href="${detailsUrl}" class="btn btn-outline" style="flex: 1; justify-content: center; padding: 10px 5px; font-size: 0.7rem;">
                            <i class="fas fa-plus-circle"></i> MAIS INFO
                        </a>

                        <a href="https://wa.me/551123641590?text=Olá, tenho interesse no ${car.brand} ${car.model}" 
                           target="_blank" 
                           class="btn btn-primary" 
                           style="flex: 1.2; justify-content: center; padding: 10px 5px; font-size: 0.7rem;">
                            <i class="fab fa-whatsapp"></i> TENHO INTERESSE
                        </a>

                    </div>
                </div>

            </div>
        `;

        const div = document.createElement('div');
        div.innerHTML = carCard;
        estoqueGrid.appendChild(div.firstElementChild);
    });
}


// Carrossel automático
setInterval(() => {
    document.querySelectorAll('.carousel').forEach(carousel => {
        const slides = carousel.querySelectorAll('.slide');

        if (slides.length <= 1) return;

        let activeIndex = 0;

        slides.forEach((img, i) => {
            if (img.classList.contains('active')) activeIndex = i;
            img.classList.remove('active');
        });

        const nextIndex = (activeIndex + 1) % slides.length;
        slides[nextIndex].classList.add('active');
    });
}, 3000);


// Menu Mobile
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