/* ==========================================================
   BGCAR Motors - Admin Completo (Flask API)
========================================================== */

const API_URL = "https://api.bgcarmotors.com.br";

let selectedFile = null;
let editingCarId = null;

/* ==========================================================
   START
========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initLogin();
  initUpload();
  initForm();
});

/* ==========================================================
   LOGIN
========================================================== */
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

      setTimeout(() => {
        document.getElementById("loginError").style.display = "none";
      }, 3000);
    }
  });
}

/* ==========================================================
   CARREGAR CARROS
========================================================== */
async function loadCars() {
  const grid = document.getElementById("carsGrid");

  grid.innerHTML = "<p>Carregando veículos...</p>";

  try {
    const response = await fetch(`${API_URL}/api/cars`);
    const cars = await response.json();

    if (!cars || cars.length === 0) {
      grid.innerHTML = "<p>Nenhum carro cadastrado.</p>";
      return;
    }

    renderCars(cars);

  } catch (error) {
    console.error(error);
    grid.innerHTML = "<p>Erro ao carregar carros.</p>";
  }
}

/* ==========================================================
   RENDER LISTA HORIZONTAL
========================================================== */
function renderCars(cars) {
  const grid = document.getElementById("carsGrid");
  grid.innerHTML = "";

  cars.forEach(car => {
    const card = document.createElement("div");
    card.className = "car-card";

    card.innerHTML = `
      <div class="car-image">
        <img src="${car.main_image}" alt="${car.brand}">
      </div>

      <div class="car-info">
        <div class="car-brand">${car.brand}</div>
        <div class="car-model">${car.model}</div>

        <div class="car-line">
          ${car.year} • ${Number(car.km).toLocaleString("pt-BR")} km • ${car.color}
        </div>

        <div class="price">
          R$ ${Number(car.price).toLocaleString("pt-BR")}
        </div>
      </div>

      <div class="car-actions">
        <button class="edit" onclick="editCar(${car.id})">
          Editar
        </button>

        <button class="delete" onclick="deleteCar(${car.id})">
          Excluir
        </button>
      </div>
    `;

    grid.appendChild(card);
  });
}

/* ==========================================================
   MODAL
========================================================== */
window.openModal = function () {
  document.getElementById("modal").classList.add("active");
};

window.closeModal = function () {
  document.getElementById("modal").classList.remove("active");
  resetForm();
};

/* ==========================================================
   PREVIEW FOTO
========================================================== */
function initUpload() {
  const input = document.getElementById("carPhotos");

  input.addEventListener("change", (e) => {
    selectedFile = e.target.files[0];

    if (!selectedFile) return;

    const reader = new FileReader();

    reader.onload = function (ev) {
      document.getElementById("photoGallery").innerHTML = `
        <img src="${ev.target.result}">
      `;
    };

    reader.readAsDataURL(selectedFile);
  });
}

/* ==========================================================
   SALVAR
========================================================== */
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

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      let response;
      let successMessage;

      if (editingCarId) {
        // Modo edição: usar PUT
        response = await fetch(`${API_URL}/api/cars/${editingCarId}`, {
          method: "PUT",
          body: formData
        });
        successMessage = "Carro atualizado com sucesso!";
      } else {
        // Modo criação: usar POST
        response = await fetch(`${API_URL}/api/cars`, {
          method: "POST",
          body: formData
        });
        successMessage = "Carro cadastrado com sucesso!";
      }

      if (!response.ok) throw new Error("Erro ao salvar");

      alert(successMessage);

      closeModal();
      loadCars();

    } catch (error) {
      console.error(error);
      alert("Erro ao salvar carro.");
    }
  });
}

/* ==========================================================
   EDITAR (abre modal preenchido)
========================================================== */
window.editCar = async function (id) {
  try {
    const response = await fetch(`${API_URL}/api/cars`);
    const cars = await response.json();

    const car = cars.find(item => item.id == id);

    if (!car) return;

    // Define o ID para edição
    editingCarId = id;
    selectedFile = null;

    // Atualiza o título do modal
    document.querySelector(".modal-box h2").textContent = "Editar Veículo";

    document.getElementById("carMarca").value = car.brand;
    document.getElementById("carModelo").value = car.model;
    document.getElementById("carAno").value = car.year;
    document.getElementById("carCor").value = car.color;
    document.getElementById("carKm").value = car.km;
    document.getElementById("carValor").value = car.price;
    document.getElementById("carDescricao").value = car.description || "";

    document.getElementById("photoGallery").innerHTML = `
      <img src="${car.main_image}">
    `;

    openModal();

  } catch (error) {
    console.error(error);
    alert("Erro ao carregar veículo.");
  }
};

/* ==========================================================
   EXCLUIR
========================================================== */
window.deleteCar = async function (id) {
  if (!confirm("Deseja excluir este carro?")) return;

  try {
    const response = await fetch(`${API_URL}/api/cars/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) throw new Error("Erro");

    loadCars();

  } catch (error) {
    console.error(error);
    alert("Erro ao excluir.");
  }
};

/* ==========================================================
   LOGOUT
========================================================== */
window.logout = function () {
  location.reload();
};

/* ==========================================================
   RESET
========================================================== */
function resetForm() {
  selectedFile = null;
  editingCarId = null;

  // Reseta o título do modal
  document.querySelector(".modal-box h2").textContent = "Novo Veículo";

  document.getElementById("carForm").reset();
  document.getElementById("photoGallery").innerHTML = ""
}