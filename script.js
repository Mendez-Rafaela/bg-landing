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

// Função para desenhar os cards na tela seguindo a estrutura do index.html
function renderCars(cars) {
    const estoqueGrid = document.getElementById('estoqueGrid');
    estoqueGrid.innerHTML = ''; // Limpa o "Carregando..."

    cars.forEach(car => {
        const slug = generateSlug(car.brand, car.model, car.year);
        const detailsUrl = `detalhes.html?slug=${slug}`;
        
        const priceFormatted = parseFloat(car.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
        const carCard = `
            <div class="car-card">
                <div class="car-card-image">
                    <img src="${car.main_image || 'img/placeholder.jpg'}" alt="${car.brand} ${car.model}" style="width:100%; height:100%; object-fit:cover;">
                    <div class="car-price-badge">${priceFormatted}</div>
                </div>
                <div class="car-card-body">
                    <h3 class="car-card-title">${car.model.toUpperCase()} / ${car.year} / ${car.brand.toUpperCase()}</h3>
                    <div class="car-features">
                        <div class="car-feature"><i class="fas fa-calendar-alt"></i> ${car.year}</div>
                        <div class="car-feature"><i class="fas fa-palette"></i> ${car.color}</div>
                        <div class="car-feature"><i class="fas fa-tachometer-alt"></i> ${Number(car.km).toLocaleString('pt-BR')} KM</div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <a href="${detailsUrl}" class="btn btn-outline" style="padding: 0.875rem 1rem; font-size: 0.65rem; justify-content: center;">
                           SAIBA MAIS
                        </a>
                        <a href="https://wa.me/551123641590?text=Olá, tenho interesse no ${car.brand} ${car.model}" 
                           target="_blank" 
                           class="btn btn-primary" style="padding: 0.875rem 1rem; font-size: 0.65rem; justify-content: center;">
                           TENHO INTERESSE
                        </a>
                    </div>
                </div>
            </div>
        `;
        estoqueGrid.innerHTML += carCard;
    });
}

// Menu Mobile
function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const menu = document.getElementById('mobileMenu');
    const close = document.getElementById('mobileClose');

    if (toggle) {
        toggle.addEventListener('click', () => menu.classList.add('open'));
    }
    if (close) {
        close.addEventListener('click', () => menu.classList.remove('open'));
    }
}