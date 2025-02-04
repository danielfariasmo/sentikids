function openPopup() {
    document.getElementById("popup").style.display = "block";
    document.getElementById("notification-form").reset();
    document.getElementById("success-message").style.display = "none";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

// Manejar el envío del formulario
document.getElementById("notification-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar que el formulario se envíe realmente

    // Mostramos el mensaje
    document.getElementById("success-message").style.display = "block";

    // Cerrar el pop-up
    setTimeout(function () {
        closePopup();
    }, 2000); 
});