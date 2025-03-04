document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("notification-form");

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const recipient = document.getElementById("recipient").value;
            const message = document.getElementById("message").value;

            // Crear un div para el alert personalizado
            const customAlert = document.createElement("div");
            customAlert.className = "custom-alert";
            document.body.appendChild(customAlert);

            if (!recipient || !message) {
                customAlert.textContent = "Por favor, complete todos los campos.";
                customAlert.style.display = "block";
                setTimeout(() => {
                    customAlert.style.display = "none";
                }, 3000); // Ocultar después de 3 segundos
                return;
            }

            // Enviar datos al PHP
            fetch("guardar_notificacion.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipient: recipient,
                    message: message
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    customAlert.textContent = "Notificación enviada con éxito.";
                    customAlert.style.display = "block";
                    form.reset();
                    setTimeout(() => {
                        customAlert.style.display = "none";
                    }, 3000); // Ocultar después de 3 segundos
                } else {
                    customAlert.textContent = "Error: " + data.message;
                    customAlert.style.display = "block";
                    setTimeout(() => {
                        customAlert.style.display = "none";
                    }, 3000); // Ocultar después de 3 segundos
                }
            })
            .catch(error => {
                customAlert.textContent = "Error en la solicitud: " + error;
                customAlert.style.display = "block";
                setTimeout(() => {
                    customAlert.style.display = "none";
                }, 3000); // Ocultar después de 3 segundos
            });
        });
    }
});