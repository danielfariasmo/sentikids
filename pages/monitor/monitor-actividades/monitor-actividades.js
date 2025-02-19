function cargarNombreMonitor() {
    const nombreUsuarioElement = document.getElementById("nombre_usuario");
   
    fetch("obtener_nombre_monitor.php", {
        method: "GET"
    })
        .then(response => {
            console.log('Respuesta del servidor:', response);
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos:', data);
            if (data.status === 'success' && nombreUsuarioElement) {
                nombreUsuarioElement.textContent = `${data.nombre} ${data.apellidos}`;
            } else {
                console.error('Error al cargar el nombre del monitor:', data.message);
            }
        })
        .catch(error => {
            console.error('Error en la solicitud fetch:', error);
        });
}


document.addEventListener("DOMContentLoaded", function () {
    const menuContainer = document.querySelector(".menu-container");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const logoutBtn = document.getElementById("logoutBtn");
   

    // Cargar el nombre del monitor al iniciar la página
    cargarNombreMonitor();

    // Mostrar y ocultar el menú desplegable
    menuContainer?.addEventListener("mouseenter", () => {
        dropdownMenu.style.display = "block";
    });

    menuContainer?.addEventListener("mouseleave", () => {
        dropdownMenu.style.display = "none";
    });

    // Redirección al hacer clic en el botón de logout
    logoutBtn?.addEventListener("click", () => {
        window.location.href = "../../web/home/inicio.html";
    });

   
});

