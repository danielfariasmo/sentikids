// Cargar el nombre del monitor al iniciar la página
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

    // Cerrar sesión y redirección al hacer clic en el botón de logout
    logoutBtn?.addEventListener("click", () => {
        // Eliminar la sesión
        sessionStorage.removeItem("usuario"); 
        localStorage.removeItem("usuario"); 

        // Marcar que el usuario cerró sesión
        sessionStorage.setItem("cerrado", "true");

        // Reemplazar el historial para que no pueda volver atrás
        window.history.replaceState(null, "", "../../web/home/login.html");

        // Redirigir instantáneamente
        window.location.href = "../../web/home/login.html";
    });

    // Si el usuario cerró sesión, evitar que vuelva atrás instantáneamente
    if (sessionStorage.getItem("cerrado") === "true" && 
        !sessionStorage.getItem("usuario") && 
        !localStorage.getItem("usuario")) {
        
        sessionStorage.removeItem("cerrado"); // Evitar bucles infinitos

        // Reemplazar la entrada actual en el historial para bloquear el "Atrás"
        window.history.replaceState(null, "", "../../web/home/login.html");

        // Redirigir instantáneamente sin recargar
        window.location.replace("../../web/home/login.html");
    }

    // Evitar que el usuario vuelva atrás sin recargar
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
        if (!sessionStorage.getItem("usuario") && !localStorage.getItem("usuario")) {
            window.history.replaceState(null, "", "../../web/home/login.html");
            window.location.replace("../../web/home/login.html");
        } else {
            window.history.pushState(null, "", window.location.href);
        }
    };
});
