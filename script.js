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

// Função para desenhar os cards na tela
function renderCars(cars) {
    const estoqueGrid = document.getElementById('estoqueGrid');
    estoqueGrid.innerHTML = ''; // Limpa o "Carregando..."

    cars.forEach(car => {
        const carCard = `
            <div class="car-card">
                <div class="car-img">
                    <img src="${car.main_image || 'img/placeholder.jpg'}" alt="${car.brand} ${car.model}">
                </div>
                <div class="car-info">
                    <h3 class="car-title">${car.brand} ${car.model}</h3>
                    <p class="car-details">${car.year} • ${car.km} km • ${car.color}</p>
                    <div class="car-price">R$ ${parseFloat(car.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    <a href="https://wa.me/551123641590?text=Olá, tenho interesse no ${car.brand} ${car.model}" 
                       target="_blank" class="btn btn-primary btn-block">
                       <i class="fab fa-whatsapp"></i> TENHO INTERESSE
                    </a>
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
        toggle.addEventListener('click', () => menu.classList.add('active'));
    }
    if (close) {
        close.addEventListener('click', () => menu.classList.remove('active'));
    }
}