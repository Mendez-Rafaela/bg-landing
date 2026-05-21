/* ==========================================================
   BGCAR Motors - Admin (Sincronizado com VPS v13)
========================================================== */

const API_URL = "https://api.bgcarmotors.com.br";
let editingCarId = null;
let photos = [];
let mainPhoto = null;

document.addEventListener("DOMContentLoaded", () => {
  initLogin();
  initForm();

  const inputPhotos = document.getElementById("carFotos");
  if (inputPhotos) {
    initUpload(inputPhotos);
  }
});

function initLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;
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
  if (!grid) return;
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
      <div class="car-image"><img src="${car.main_image || 'img/placeholder.jpg'}" alt="${car.brand}"></div>
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
  if (!form) return;
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
    
    formData.append("main_image", mainPhoto || "");
    formData.append("photos", JSON.stringify(photos));

    try {
      const url = editingCarId ? `${API_URL}/api/cars/${editingCarId}` : `${API_URL}/api/cars`;
      const method = editingCarId ? "PUT" : "POST";

      const response = await fetch(url, { 
        method: method, 
        body: formData 
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro ao salvar");
      }

      alert(editingCarId ? "Carro atualizado!" : "Carro cadastrado!");
      closeModal();
      loadCars();
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert("Erro ao salvar veículo: " + error.message);
    }
  });
}

window.editCar = async function (id) {
  try {
    const response = await fetch(`${API_URL}/api/cars`);
    const cars = await response.json();
    const car = cars.find(item => item.id == id);
    if (!car) return;

    editingCarId = id;
    document.querySelector(".modal-box h2").textContent = "Editar Veículo";
    document.getElementById("carMarca").value = car.brand;
    document.getElementById("carModelo").value = car.model;
    document.getElementById("carAno").value = car.year;
    document.getElementById("carCor").value = car.color;
    document.getElementById("carKm").value = car.km;
    document.getElementById("carValor").value = car.price;
    document.getElementById("carDescricao").value = car.description || "";
    
    photos = Array.isArray(car.photos) ? car.photos : JSON.parse(car.photos || "[]");
    mainPhoto = car.main_image || (photos.length > 0 ? photos[0] : null);
    
    renderGallery();
    openModal();
  } catch (error) { 
    console.error("Erro ao carregar dados:", error);
    alert("Erro ao carregar dados do veículo."); 
  }
};

window.deleteCar = async function (id) {
  if (!confirm("Deseja realmente excluir este carro?")) return;
  try {
    const response = await fetch(`${API_URL}/api/cars/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Erro na API");
    loadCars();
  } catch (error) {
    console.error("Erro ao excluir:", error);
    alert("Erro ao excluir veículo.");
  }
};

window.openModal = () => document.getElementById("modal").classList.add("active");
window.closeModal = () => {
  document.getElementById("modal").classList.remove("active");
  resetForm();
};

function initUpload(inputPhotos) {
  inputPhotos.addEventListener("change", async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      if (photos.length >= 13) {
        alert("Máximo de 13 fotos por veículo.");
        break;
      }

      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(`${API_URL}/upload`, {
          method: "POST",
          body: formData
        });

        if (!response.ok) throw new Error("Falha no upload");

        const data = await response.json();
        photos.push(data.url);

        if (!mainPhoto) {
          mainPhoto = data.url;
        }

        renderGallery();
      } catch (error) {
        console.error("Erro upload:", error);
        alert("Erro ao enviar imagem: " + file.name);
      }
    }
    inputPhotos.value = "";
  });
}

function renderGallery() {
  const gallery = document.getElementById('photoGallery');
  if (!gallery) return;
  gallery.innerHTML = '';

  photos.forEach((photo, index) => {
    const isMain = photo === mainPhoto;
    const div = document.createElement('div');
    div.className = `gallery-item ${isMain ? 'main' : ''}`;
    div.style.display = 'inline-block';
    div.style.position = 'relative';
    div.style.margin = '5px';

    div.innerHTML = `
      <img src="${photo}" style="width:100px; height:100px; object-fit:cover; border: ${isMain ? '3px solid #e21818' : '1px solid #333'};">
      <button type="button" onclick="setMainPhoto('${photo}')"
        style="position:absolute; bottom:5px; left:5px; background:rgba(0,0,0,0.7); color:white; border:none; cursor:pointer; padding: 2px 5px; font-size: 10px;">
        ${isMain ? 'PRINCIPAL ⭐' : 'MARCAR'}
      </button>
      <button type="button" onclick="removePhoto(${index})"
        style="position:absolute; top:5px; right:5px; background:#e21818; color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer; font-size: 12px;">
        ✕
      </button>
    `;
    gallery.appendChild(div);
  });
}

window.setMainPhoto = (url) => {
  mainPhoto = url;
  renderGallery();
};

window.removePhoto = (index) => {
  const removed = photos.splice(index, 1)[0];
  if (mainPhoto === removed) {
    mainPhoto = photos.length > 0 ? photos[0] : null;
  }
  renderGallery();
};

function resetForm() {
  editingCarId = null;
  photos = [];
  mainPhoto = null;
  const form = document.getElementById("carForm");
  if (form) form.reset();
  const gallery = document.getElementById("photoGallery");
  if (gallery) gallery.innerHTML = "";
  const title = document.querySelector(".modal-box h2");
  if (title) title.textContent = "Novo Veículo";
}

window.logout = () => location.reload();
