// Extraer parámetros de la URL
function getQueryParam(param) {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

document.addEventListener("DOMContentLoaded", function() {
    let email = getQueryParam("email");
    let token = getQueryParam("token");

    if (!email || !token) {
        document.getElementById("message").innerText = "Enlace inválido o expirado.";
        document.getElementById("changePasswordForm").style.display = "none";
        return;
    }

    document.getElementById("email").value = email;
    document.getElementById("token").value = token;

    document.getElementById("changePasswordForm").addEventListener("submit", function(event) {
        event.preventDefault();

        let newPassword = document.getElementById("new_password").value;
        let confirmPassword = document.getElementById("confirm_password").value;
        let email = document.getElementById("email").value;
        let token = document.getElementById("token").value;

        if (newPassword !== confirmPassword) {
            document.getElementById("message").innerText = "Las contraseñas no coinciden.";
            return;
        }

        // Enviar datos de forma asíncrona con Fetch API
        fetch("cambiar-clave.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, token, newPassword })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("message").innerText = data.message;
            if (data.success) {
                document.getElementById("changePasswordForm").reset();
            }
        })
        .catch(error => console.error("Error:", error));
    });
});