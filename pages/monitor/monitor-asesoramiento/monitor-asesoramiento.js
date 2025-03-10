function openPopup() {
    const popup = document.getElementById("popup");
    const form = document.getElementById("notification-form");
    const successMessage = document.getElementById("success-message");
    const recipientSelect = document.getElementById("recipient");

    if (popup) popup.style.display = "block";
    if (form) form.reset();
    if (successMessage) successMessage.style.display = "none";

    if (!recipientSelect) {
        console.error("Elemento 'recipient' no encontrado.");
        return;
    }

    fetch('monitor-asesoramiento.php')
        .then(response => {
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log("Tutores cargados:", data);
            recipientSelect.innerHTML = '';

            const defaultOption = document.createElement('option');
            defaultOption.textContent = 'Todos los padres';
            defaultOption.value = "";
            recipientSelect.appendChild(defaultOption);

            data.forEach(tutor => {
                const option = document.createElement('option');
                option.value = `${tutor.nombre} ${tutor.apellidos}`;
                option.textContent = `${tutor.nombre} ${tutor.apellidos}`;
                recipientSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar tutores:', error));
}

function closePopup() {
    const popup = document.getElementById("popup");
    if (popup) popup.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("notification-form");

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const recipient = document.getElementById("recipient").value;
            const title = document.getElementById("title").value;
            const message = document.getElementById("message").value;

            if (!recipient || !title || !message) {
                alert("Por favor, complete todos los campos.");
                return;
            }

            fetch("guardar_notificacion.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipient: recipient,
                    title: title,
                    message: message
                }),
            })
            .then(response => response.json()) 
            .then(data => {
                console.log("Respuesta en JSON:", data);
                if (data.status === "success") {
                    alert("¡Notificación enviada con éxito!");
                    cargarNotificaciones();
                    form.reset();
                    closePopup();
                } else {
                    alert("Error: " + data.message);
                }
            })
            .catch(error => {
                console.error("Error en fetch:", error);
            });
        });
    }
});

function cargarNombreMonitor() {
    const nombreUsuarioElement = document.getElementById("nombre_usuario");

    fetch("obtener_nombre_monitor.php")
        .then(response => {
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.status === 'success' && nombreUsuarioElement) {
                nombreUsuarioElement.textContent = `${data.nombre} ${data.apellidos}`;
            }
        })
        .catch(error => console.error('Error en la solicitud fetch:', error));
}

document.addEventListener("DOMContentLoaded", function () {
    const menuContainer = document.querySelector(".menu-container");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const logoutBtn = document.getElementById("logoutBtn");

    cargarNombreMonitor();
    cargarNotificaciones();

    menuContainer?.addEventListener("mouseenter", () => {
        dropdownMenu.style.display = "block";
    });

    menuContainer?.addEventListener("mouseleave", () => {
        dropdownMenu.style.display = "none";
    });

    logoutBtn?.addEventListener("click", function () {
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

function cargarNotificaciones() {
    fetch("cargar_notificaciones.php")
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector(".notifications-container");

            if (!container) {
                console.error("No se encontró el contenedor de notificaciones.");
                return;
            }

            container.innerHTML = "";

            data.forEach(notif => {
                const notificationCard = document.createElement("div");
                notificationCard.classList.add("notification-card");
                notificationCard.innerHTML = `
                    <div class="notification-title">${notif.titulo}</div>
                    <div class="notification-text">${notif.mensaje}</div>
                    <div class="notification-tutor">Destinatario: ${notif.tutor}</div>
                    <div class="notification-date">Día: ${notif.fecha}</div>
                `;
                container.appendChild(notificationCard);
            });
        })
        .catch(error => console.error("Error al cargar notificaciones:", error));
}

//  <!-- MENU HAMBURGUESA -->

document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger");
    const nav = document.querySelector(".nav");
  
    hamburger.addEventListener("click", function () {
        nav.classList.toggle("active");
    });
  });

  