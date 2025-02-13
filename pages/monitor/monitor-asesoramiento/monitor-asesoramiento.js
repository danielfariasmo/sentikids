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

    // Usamos fetch para obtener los tutores desde el archivo PHP
    fetch('monitor-asesoramiento.php')
        .then(response => {
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log(data);
            
            // Limpiar el select antes de agregar opciones
            recipientSelect.innerHTML = '';

            // Crear opción por defecto
            const defaultOption = document.createElement('option');
            defaultOption.textContent = 'Seleccionar Tutor';
            defaultOption.value = "";
            recipientSelect.appendChild(defaultOption);

            // Agregar cada tutor al select
            data.forEach(tutor => {
                const option = document.createElement('option');
                option.value = `${tutor.nombre} ${tutor.apellidos}`; // Asigna el nombre completo
                option.textContent = `${tutor.nombre} ${tutor.apellidos}`; // Muestra el nombre completo
                recipientSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error al cargar los tutores:', error);
        });
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
            event.preventDefault(); // Evitar el envío real del formulario

            const successMessage = document.getElementById("success-message");
            if (successMessage) successMessage.style.display = "block";

            // Cerrar el pop-up después de 2 segundos
            setTimeout(closePopup, 2000);
        });
    }

    // Manejo del menú desplegable
    const menuContainer = document.querySelector(".menu-container");
    const dropdownMenu = document.getElementById("dropdownMenu");

    if (menuContainer && dropdownMenu) {
        menuContainer.addEventListener("mouseenter", function () {
            dropdownMenu.style.display = "block";
        });

        menuContainer.addEventListener("mouseleave", function () {
            dropdownMenu.style.display = "none";
        });
    }

    // Manejo del botón de cierre de sesión
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            window.location.href = "../../web/home/inicio.html";
        });
    }
});
