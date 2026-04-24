/* ==========================================================
   BGCAR Motors - Admin (Flask API)
========================================================== */

const API_URL = "https://api.bgcarmotors.com.br";

let selectedFile = null;

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
   RENDER CARS
========================================================== */
function renderCars(cars) {
  const grid = document.getElementById("carsGrid");
  grid.innerHTML = "";

  cars.forEach(car => {
    const card = document.createElement("div");
    card.className = "car-card";

    card.innerHTML = `
      <img src="${car.main_image}" alt="${car.brand}">
      <div class="car-info">
        <h3>${car.brand} ${car.model}</h3>
        <p>${car.year} • ${car.km} km • ${car.color}</p>
        <h2>R$ ${Number(car.price).toLocaleString("pt-BR")}</h2>

        <div class="car-actions">
          <button class="btn-delete" onclick="deleteCar(${car.id})">
            Excluir
          </button>
        </div>
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
   UPLOAD PREVIEW
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
      const response = await fetch(`${API_URL}/api/cars`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Erro ao salvar");

      alert("Carro cadastrado com sucesso!");

      closeModal();
      loadCars();

    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar carro.");
    }
  });
}

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

  document.getElementById("carForm").reset();
  document.getElementById("photoGallery").innerHTML = "";
}