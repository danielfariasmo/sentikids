/*---------------------------------------------------------------
Utilidad de menu "hamburguesa"
---------------------------------------------------------------*/
function toggleMenu() {
    let menuList = document.querySelector('.menu ul')
    menuList.classList.toggle('active')
  }

  $(document).ready(function() {
    $.ajax({
        url: "administrador.php", // Archivo que verifica la sesión
        type: "POST",
        dataType: "json",
        success: function(response) {
            if (response.status !== "success") {
                window.location.href = "../../web/home/inicio.html"; // Redirigir si no hay sesión
            }
        },
        error: function(xhr, status, error) {
            console.error("Error en la verificación de sesión:", error);
        }
    });
});


  $(document).ready(function() {
    $("#btnCerrarSesion").click(function() {
        $.ajax({
            url: "cerrar-sesion.php",
            type: "POST",
            dataType: "json",
            success: function(response) {
                if (response.status === "success") {
                    window.location.href = "../../web/home/inicio.html";
                } else {
                    console.error("Error al cerrar sesión:", response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error("Error en la solicitud AJAX:", error);
            }
        });
    });
});

