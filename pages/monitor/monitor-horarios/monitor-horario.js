document.addEventListener("DOMContentLoaded", function () {
  const menuContainer = document.querySelector(".menu-container");
  const dropdownMenu = document.getElementById("dropdownMenu");

  menuContainer.addEventListener("mouseenter", function () {
      dropdownMenu.style.display = "block";
  });

  menuContainer.addEventListener("mouseleave", function () {
      dropdownMenu.style.display = "none";
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");

  logoutBtn.addEventListener("click", function () {
      sessionStorage.removeItem("usuario"); 
      localStorage.removeItem("usuario"); 
      sessionStorage.setItem("cerrado", "true");
      window.history.replaceState(null, "", "../../web/home/index.html");
      window.location.href = "../../web/home/index.html";
  });

  if (sessionStorage.getItem("cerrado") === "true" && 
      !sessionStorage.getItem("usuario") && 
      !localStorage.getItem("usuario")) {
      
      sessionStorage.removeItem("cerrado");
      window.history.replaceState(null, "", "../../web/home/index.html");
      window.location.replace("../../web/home/index.html");
  }

  window.history.pushState(null, "", window.location.href);
  window.onpopstate = function () {
      if (!sessionStorage.getItem("usuario") && !localStorage.getItem("usuario")) {
          window.history.replaceState(null, "", "../../web/home/index.html");
          window.location.replace("../../web/home/index.html");
      } else {
          window.history.pushState(null, "", window.location.href);
      }
  };
});

// Función para cargar el horario
function cargarHorario() {
  fetch('monitor-horario.php')
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        const urlHorario = data.horarios[0];
        const imgElement = document.getElementById('horario-img');
        const descargarLink = document.getElementById('descargar-horario');

        imgElement.src = urlHorario;
        imgElement.alt = 'Horario';
        descargarLink.href = urlHorario;
        descargarLink.style.display = 'block'; 
      } else {
        console.error('Error:', data.message);
      }
    })
    .catch(error => console.error('Error al cargar el horario:', error));
}

window.onload = cargarHorario;

//  <!-- MENU HAMBURGUESA -->

document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");

  hamburger.addEventListener("click", function () {
      nav.classList.toggle("active");
  });
});