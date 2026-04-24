/* ==========================================================
   BGCAR Motors - Admin Corrigido
========================================================== */

const API_URL = "https://api.bgcarmotors.com.br";
let selectedFile = null;
let editingCarId = null; // Variável para controlar se estamos editando

document.addEventListener("DOMContentLoaded", ( ) => {
  initLogin();
  initUpload();
  initForm();
});

function initLogin() {
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();
    if (user === "admin" && pass === "bgcar2026") {
      document.getElementById("loginScreen").style.display = "none";
      document.getElementById("dashboard").style.display = "block";
      loadCars();
    } else {
      document.getElementById("loginError").style.display = "block";
      setTimeout(() => { document.getElementById("loginError").style.display = "none"; }, 3000);
    }
  });
}

async function loadCars() {
  const grid = document.getElementById("carsGrid");
  grid.innerHTML = "<p>Carregando veículos...</p>";
  try {
    const response = await fetch(`${API_URL}/api/cars`);
    const cars = await response.json();
    renderCars(cars);
  } catch (error) {
    grid.innerHTML = "<p>Erro ao carregar carros.</p>";
  }
}

function renderCars(cars) {
  const grid = document.getElementById("carsGrid");
  grid.innerHTML = "";
  if (!cars || cars.length === 0) {
    grid.innerHTML = "<p>Nenhum carro cadastrado.</p>";
    return;
  }
  cars.forEach(car => {
    const card = document.createElement("div");
    card.className = "car-card";
    card.innerHTML = `
      <div class="car-image"><img src="${car.main_image}" alt="${car.brand}"></div>
      <div class="car-info">
        <div class="car-brand">${car.brand}</div>
        <div class="car-model">${car.model}</div>
        <div class="car-line">${car.year} • ${Number(car.km).toLocaleString("pt-BR")} km • ${car.color}</div>
        <div class="price">R$ ${Number(car.price).toLocaleString("pt-BR")}</div>
      </div>
      <div class="car-actions">
        <button class="edit" onclick="editCar(${car.id})">Editar</button>
        <button class="delete" onclick="deleteCar(${car.id})">Excluir</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function initForm() {
  const form = document.getElementById("carForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("brand", document.getElementById("carMarca").value);
    formData.append("model", document.getElementById("carModelo").value);
    formData.append("year", document.getElementById("carAno").value);
    formData.append("color", document.getElementById("carCor").value);
    formData.append("km", document.getElementById("carKm").value);
    formData.append("price", document.getElementById("carValor").value);
    formData.append("description", document.getElementById("carDescricao").value);
    if (selectedFile) formData.append("image", selectedFile);

    try {
      const url = editingCarId ? `${API_URL}/api/cars/${editingCarId}` : `${API_URL}/api/cars`;
      const method = editingCarId ? "PUT" : "POST"; // Usa PUT se estiver editando

      const response = await fetch(url, { method: method, body: formData });
      if (!response.ok) throw new Error("Erro ao salvar");

      alert(editingCarId ? "Carro atualizado!" : "Carro cadastrado!");
      closeModal();
      loadCars();
    } catch (error) {
      alert("Erro ao salvar veículo. Verifique se a API na VPS aceita o método " + (editingCarId ? "PUT" : "POST"));
    }
  });
}

window.editCar = async function (id) {
  try {
    const response = await fetch(`${API_URL}/api/cars`);
    const cars = await response.json();
    const car = cars.find(item => item.id == id);
    if (!car) return;

    editingCarId = id; // Define que estamos editando este ID
    document.querySelector(".modal-box h2").textContent = "Editar Veículo";
    document.getElementById("carMarca").value = car.brand;
    document.getElementById("carModelo").value = car.model;
    document.getElementById("carAno").value = car.year;
    document.getElementById("carCor").value = car.color;
    document.getElementById("carKm").value = car.km;
    document.getElementById("carValor").value = car.price;
    document.getElementById("carDescricao").value = car.description || "";
    document.getElementById("photoGallery").innerHTML = `<img src="${car.main_image}">`;
    openModal();
  } catch (error) { alert("Erro ao carregar dados do veículo."); }
};

window.deleteCar = async function (id) {
  if (!confirm("Deseja realmente excluir este carro?")) return;
  try {
    const response = await fetch(`${API_URL}/api/cars/${id}`, { method: "DELETE" });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro na API");
    }
    loadCars();
  } catch (error) {
    console.error("Erro ao excluir:", error);
    alert("Erro ao excluir. Verifique se a sua API na Hostinger permite o método DELETE para o ID " + id);
  }
};

window.openModal = () => document.getElementById("modal").classList.add("active");
window.closeModal = () => {
  document.getElementById("modal").classList.remove("active");
  resetForm();
};
function initUpload(inputPhotos) {
  inputPhotos.addEventListener('change', async (e) => {
    const files = e.target.files;

    for (let file of files) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error('Erro no upload');
        
        const data = await response.json();
        photos.push(data.url);

        if (!mainPhoto && photos.length > 0) {
          mainPhoto = photos[0];
        }

        renderGallery();
      } catch (err) {
        console.error('Erro upload:', err);
        continue;
      }
    } // Fecha o loop for
  }); // Fecha o EventListener
} // Fecha a função initUpload


function renderGallery() {
  const gallery = document.getElementById('photoGallery');
  if (!gallery) return;

  gallery.innerHTML = ''; // Limpa a galeria para redesenhar a lista atualizada

  photos.forEach((photo, index) => {
    const isMain = photo === mainPhoto;
    const div = document.createElement('div');
    div.className = `gallery-item ${isMain ? 'main' : ''}`;

    div.innerHTML = `
      <img src="${photo}">
      <button type="button" onclick="setMainPhoto('${photo}')"
        style="position:absolute;bottom:5px;left:5px;">
        ⭐
      </button>
      <button type="button" class="gallery-item-remove"
        onclick="removePhoto(${index})">
        ✕
      </button>
    `;
    gallery.appendChild(div);
  });
}


function resetForm() {
  editingCarId = null;
  selectedFile = null;
  document.getElementById("carForm").reset();
  document.getElementById("photoGallery").innerHTML = "";
  document.querySelector(".modal-box h2").textContent = "Novo Veículo";
}
window.logout = () => location.reload();