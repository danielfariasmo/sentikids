document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("notification-form");

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const recipient = document.getElementById("recipient").value;
            const message = document.getElementById("message").value;
            const successMessage = document.getElementById("success-message");

            if (!recipient || !message) {
                alert("Por favor, complete todos los campos.");
                return;
            }

            // Enviar datos al PHP
            fetch("guardar_notificacion.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `recipient=${encodeURIComponent(recipient)}&message=${encodeURIComponent(message)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    successMessage.style.display = "block";
                    form.reset();
                    setTimeout(closePopup, 2000);
                } else {
                    alert("Error: " + data.message);
                }
            })
            .catch(error => console.error("Error en la solicitud:", error));
        });
    }
});
