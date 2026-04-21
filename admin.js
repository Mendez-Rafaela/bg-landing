/* ============================================================
   BGCAR Motors — ADMIN (Área Logada - CONECTADO À VPS)
   ============================================================ */

const API_URL = 'https://api.bgcarmotors.com.br';

// ESTADO (Simplificado para a estrutura atual da VPS)
let selectedFile = null;

document.addEventListener('DOMContentLoaded', () => {
    const inputPhotos = document.getElementById('carPhotos');
    const form = document.getElementById('carForm');

    if (inputPhotos) {
        initUpload(inputPhotos);
    }

    if (form) {
        initForm(form);
    }
});

// ============================================================
// SELEÇÃO DE FOTO (PREVIEW)
// ============================================================
function initUpload(inputPhotos) {
    inputPhotos.addEventListener('change', (e) => {
        const file = e.target.files[0]; // Pegamos a primeira foto
        if (!file) return;

        selectedFile = file;
        renderPreview(file);
    });
}

function renderPreview(file) {
    const gallery = document.getElementById('photoGallery');
    if (!gallery) return;

    gallery.innerHTML = '';

    const div = document.createElement('div');
    div.className = `gallery-item main`;

    // Cria uma URL temporária apenas para mostrar no navegador antes de subir
    const reader = new FileReader();
    reader.onload = (e) => {
        div.innerHTML = `
            <img src="${e.target.result}">
            <span style="position:absolute;bottom:5px;left:5px;background:rgba(0,0,0,0.7);color:#fff;padding:2px 5px;font-size:10px;border-radius:3px;">
                FOTO PRINCIPAL
            </span>
            <button class="gallery-item-remove" onclick="removePhoto()">✕</button>
        `;
    };
    reader.readAsDataURL(file);

    gallery.appendChild(div);
}

window.removePhoto = function() {
    selectedFile = null;
    const gallery = document.getElementById('photoGallery');
    if (gallery) gallery.innerHTML = '';
    const input = document.getElementById('carPhotos');
    if (input) input.value = '';
};

// ============================================================
// SALVAR NA VPS (FORM DATA)
// ============================================================
function initForm(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Validações básicas
        const marca = document.getElementById('carMarca').value;
        const modelo = document.getElementById('carModelo').value;
        
        if (!marca || !modelo) {
            alert('Preencha marca e modelo');
            return;
        }

        if (!selectedFile) {
            alert('Por favor, selecione ao menos uma foto principal.');
            return;
        }

        // 2. Cria o pacote de dados (FormData) para enviar arquivos + texto
        const formData = new FormData();
        formData.append('brand', marca);
        formData.append('model', modelo);
        formData.append('year', document.getElementById('carAno').value);
        formData.append('color', document.getElementById('carCor').value);
        formData.append('km', document.getElementById('carKm').value);
        formData.append('price', document.getElementById('carValor').value);
        formData.append('description', document.getElementById('carDescricao').value);
        formData.append('image', selectedFile); // O arquivo da imagem vai aqui

        try {
            // 3. Envia para a sua VPS Hostinger
            const response = await fetch(`${API_URL}/api/cars`, {
                method: 'POST',
                body: formData // Não precisa de Headers de Content-Type, o browser faz sozinho
            });

            if (!response.ok) throw new Error('Erro ao salvar na VPS');

            alert('Carro salvo com sucesso na Hostinger!');
            resetForm();

        } catch (err) {
            console.error('Erro ao salvar:', err);
            alert('Erro ao conectar com o servidor da VPS.');
        }
    });
}

// ============================================================
// RESET
// ============================================================
function resetForm() {
    const form = document.getElementById('carForm');
    if (form) form.reset();
    removePhoto();
}