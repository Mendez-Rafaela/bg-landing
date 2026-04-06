// ============================================================
// BGCAR Motors — ADMIN (Área Logada)
// ============================================================

// CONFIG SUPABASE
const SUPABASE_URL = 'https://exbitanikpzhepvdxszr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4Yml0YW5pa3B6aGVwdmR4c3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MDUwODMsImV4cCI6MjA5MTA4MTA4M30.FPKfSdLNTpz6VAm07FY_H0rxrNAmuGG09YHmIU1ByCc';


const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ESTADO
let photos = [];
let mainPhoto = null;

// ============================================================
// INICIALIZAÇÃO SEGURA (SEM ERRO)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  const inputPhotos = document.getElementById('carPhotos');
  const form = document.getElementById('carForm');

  // Só roda se existir (evita erro)
  if (inputPhotos) {
    initUpload(inputPhotos);
  }

  if (form) {
    initForm(form);
  }

});

// ============================================================
// UPLOAD DE FOTOS
// ============================================================
function initUpload(inputPhotos) {
  inputPhotos.addEventListener('change', async (e) => {
    const files = e.target.files;

    for (let file of files) {
      const fileName = `${Date.now()}-${file.name}`;

      const { error } = await supabaseClient.storage
        .from('cars')
        .upload(fileName, file);

      if (error) {
        console.error('Erro upload:', error);
        continue;
      }

      const { data: urlData } = supabaseClient.storage
        .from('cars')
        .getPublicUrl(fileName);

      photos.push(urlData.publicUrl);
    }

    // Define principal automaticamente
    if (!mainPhoto && photos.length > 0) {
      mainPhoto = photos[0];
    }

    renderGallery();
  });
}

// ============================================================
// GALERIA
// ============================================================
function renderGallery() {
  const gallery = document.getElementById('photoGallery');
  if (!gallery) return;

  gallery.innerHTML = '';

  photos.forEach((photo, index) => {
    const isMain = photo === mainPhoto;

    const div = document.createElement('div');
    div.className = `gallery-item ${isMain ? 'main' : ''}`;

    div.innerHTML = `
      <img src="${photo}">

      <button onclick="setMainPhoto('${photo}')"
        style="position:absolute;bottom:5px;left:5px;">
        ⭐
      </button>

      <button class="gallery-item-remove"
        onclick="removePhoto(${index})">
        ✕
      </button>
    `;

    gallery.appendChild(div);
  });
}

// ============================================================
// FOTO PRINCIPAL
// ============================================================
function setMainPhoto(photo) {
  mainPhoto = photo;
  renderGallery();
}

// ============================================================
// REMOVER FOTO
// ============================================================
function removePhoto(index) {
  const removed = photos[index];
  photos.splice(index, 1);

  if (removed === mainPhoto) {
    mainPhoto = photos[0] || null;
  }

  renderGallery();
}

// ============================================================
// FORMULÁRIO
// ============================================================
function initForm(form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const car = {
    marca: document.getElementById('carMarca').value,
    modelo: document.getElementById('carModelo').value,
    ano: document.getElementById('carAno').value,
    cor: document.getElementById('carCor').value,
    km: document.getElementById('carKm').value,
    valor: document.getElementById('carValor').value,
    descricao: document.getElementById('carDescricao').value,
    photos: photos,
    foto_principal: mainPhoto
  };

  // ✅ AQUI (logo depois de criar o objeto)
  if (!car.modelo || !car.marca) {
    alert('Preencha marca e modelo');
    return;
  }

  // ⬇️ só salva se estiver tudo certo
  const { error } = await supabaseClient
    .from('cars')
    .insert([car]);

  if (error) {
    console.error('Erro ao salvar:', error);
    alert('Erro ao salvar carro');
    return;
  }

  alert('Carro salvo com sucesso!');
  resetForm();
});

// ============================================================
// RESET
// ============================================================
function resetForm() {
  const form = document.getElementById('carForm');
  if (form) form.reset();

  photos = [];
  mainPhoto = null;

  renderGallery();
}