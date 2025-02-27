/*---------------------------------------------------------------
Utilidad de menu "hamburguesa"
---------------------------------------------------------------*/
function toggleMenu() {
    let menuList = document.querySelector('.menu ul')
    menuList.classList.toggle('active')
}

/*---------------------------------------------------------------
Comprobación de sesión iniciada
---------------------------------------------------------------*/
$(document).ready(function () {
    $.ajax({
        url: "administrador.php",
        type: "POST",
        dataType: "json",
        success: function (response) {
            if (response.status !== "success") {
                window.location.href = "../../web/home/index.html"; 
            }
        },
        error: function (xhr, status, error) {
            console.error("Error en la verificación de sesión:", error);
        }
    });
});

/*---------------------------------------------------------------
Funcionalidad de cerrar sesión
---------------------------------------------------------------*/
$(document).ready(function () {
    $("#btnCerrarSesion").click(function () {
        $.ajax({
            url: "cerrar-sesion.php",
            type: "POST",
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    window.location.href = "../../web/home/index.html";
                } else {
                    console.error("Error al cerrar sesión:", response.message);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error en la solicitud AJAX:", error);
            }
        });
    });
});

