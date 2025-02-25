function openPopup() {
    const popup = document.getElementById("popup");
    const form = document.getElementById("notification-form");
    const successMessage = document.getElementById("success-message");
    const recipientSelect = document.getElementById("recipient");

    if (popup) popup.style.display = "block";
    if (form) form.reset();
    if (successMessage) successMessage.style.display = "none";

    // Verificar si el select existe antes de manipularlo
    if (!recipientSelect) {
        console.error("Elemento 'recipient' no encontrado.");
        return;
    }

    // Cargar los tutores desde el archivo PHP
    fetch('monitor-asesoramiento.php')
        .then(response => {
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log("Tutores cargados:", data);
            recipientSelect.innerHTML = ''; // Limpiar select antes de agregar opciones

            // Opción por defecto
            const defaultOption = document.createElement('option');
            defaultOption.textContent = 'Todos los padres';
            defaultOption.value = "";
            recipientSelect.appendChild(defaultOption);

            // Agregar cada tutor al select
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

// Manejar el envío del formulario
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("notification-form");

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Evita el envío normal del formulario

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
                console.log("Respuesta en JSON:", data); // ✅ Verificar respuesta en consola
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

// Cargar el nombre del monitor al iniciar la página
function cargarNombreMonitor() {
    const nombreUsuarioElement = document.getElementById("nombre_usuario");

    fetch("obtener_nombre_monitor.php")
        .then(response => {
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                if (nombreUsuarioElement) {
                    nombreUsuarioElement.textContent = `${data.nombre} ${data.apellidos}`;
                }
            } else {
                console.error('Error al cargar el nombre del monitor:', data.message || 'Mensaje no disponible');
            }
        })
        .catch(error => console.error('Error en la solicitud fetch:', error));
}

// Manejo del menú desplegable y logout
document.addEventListener("DOMContentLoaded", function () {
    const menuContainer = document.querySelector(".menu-container");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const logoutBtn = document.getElementById("logoutBtn");

    cargarNombreMonitor();

    menuContainer?.addEventListener("mouseenter", () => {
        dropdownMenu.style.display = "block";
    });

    menuContainer?.addEventListener("mouseleave", () => {
        dropdownMenu.style.display = "none";
    });

    logoutBtn?.addEventListener("click", () => {
        window.location.href = "../../web/home/inicio.html";
    });
});

// Cargar notificaciones desde la base de datos
function cargarNotificaciones() {
    fetch("cargar_notificaciones.php")
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector(".notifications-container");

            if (!container) {
                console.error("No se encontró el contenedor de notificaciones.");
                return;
            }

            container.innerHTML = ""; // Limpiar contenedor antes de agregar nuevas notificaciones

            data.forEach(notif => {
                const notificationCard = document.createElement("div");
                notificationCard.classList.add("notification-card");

                notificationCard.innerHTML = `
                    <div class="notification-title">${notif.titulo}</div>
                    <div class="notification-text">${notif.mensaje}</div>
                    <div class="notification-date">${notif.fecha}</div>
                `;

                container.appendChild(notificationCard);
            });
        })
        .catch(error => console.error("Error al cargar notificaciones:"));
}

// Cargar notificaciones al cargar la página
document.addEventListener("DOMContentLoaded", cargarNotificaciones);
