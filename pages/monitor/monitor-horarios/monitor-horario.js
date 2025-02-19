
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
      window.location.href = "../../web/home/inicio.html"; 
  });
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

        // Cargar la imagen
        imgElement.src = urlHorario;
        imgElement.alt = 'Horario';

        // Configurar el enlace de descarga
        descargarLink.href = urlHorario;
        descargarLink.style.display = 'block'; 
      } else {
        console.error('Error:', data.message);
      }
    })
    .catch(error => console.error('Error al cargar el horario:', error));
}

window.onload = cargarHorario;
