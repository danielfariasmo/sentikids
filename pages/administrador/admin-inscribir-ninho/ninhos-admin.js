/**------------------------------------
 * Utilidad de menú "hamburguesa"
 --------------------------------------*/
function toggleMenu() {
    $('.menu ul').toggleClass('active');
}

/*---------------------------------------------------------------
Comprobación de sesión iniciada
---------------------------------------------------------------*/
$(document).ready(function () {
    $.ajax({
        url: "../home/administrador.php",
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
            url: "../home/cerrar-sesion.php",
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

/**------------------------------------
 * Alert personalizado
 --------------------------------------*/
function showCustomAlert(message) {
    $('#alert-message').text(message);
    $('#custom-alert').fadeIn();
}

$('#close-alert').on('click', function () {
    $('#custom-alert').fadeOut();
});

/**------------------------------------
 * Relleno de tabla con AJAX
 --------------------------------------*/
$(document).ready(function () {
    const searchInput = $('#search-input');
    fetchHijo();

    // Relleno de tabla
    function fetchHijo() {
        $.ajax({
            url: 'ninhos-admin.php',
            type: 'GET',
            success: function (response) {
                let hijos = JSON.parse(response);
                let template = '';

                hijos.forEach(hijo => {
                    template += `
                <tr tutorId="${hijo.id_hijo}">
                <td class="nombre">${hijo.nombre}</td>
                <td class="apellidos">${hijo.apellidos}</td>
                <td>${hijo.fecha_nacimiento}</td>
                <td>${hijo.dieta}</td>
                <td>${hijo.alergias}</td>
                <td>
                    <input type="text" class="grupo-input" value="${hijo.id_grupo}" data-id="${hijo.id_hijo}" min="1" max="5"/>
                </td>
                <td>
                  <button class="information">
                    <a href="info-extra-ninhos.html" style="text-decoration: none; color: black;" class="info-link" data-id="${hijo.id_hijo}" data-nombre="${hijo.nombre} ${hijo.apellidos}">+ info</a>
                  </button>
                </td>
              </tr>
            `;
                });

                $('#table-body').html(template);
            }
        });
    }

    /*Función para filtrar la tabla*/
    searchInput.on('input', function () {
        const searchTerm = searchInput.val().toLowerCase();

        // Filtrar las filas de la tabla según el nombre y apellido
        $('#table-body tr').each(function () {
            const nombre = $(this).find('.nombre').text().toLowerCase();
            const apellidos = $(this).find('.apellidos').text().toLowerCase();
            const fullName = nombre + ' ' + apellidos;

            if (fullName.indexOf(searchTerm) !== -1) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    // Capturar valor anterior por si hay un error.
    let previousValue = '';
    $(document).on('focus', '.grupo-input', function () {
        previousValue = $(this).val();  
    });

    // Actualizar el valor de "Grupo" cuando el usuario edite el campo
    $(document).on('change', '.grupo-input', function () {
        const idHijo = $(this).data("id");
        const grupoValue = $(this).val();

        // Validación para permitir solo números del 1 al 5
        if (isNaN(grupoValue) || grupoValue < 1 || grupoValue > 5) {
            showCustomAlert('Por favor, ingresa un grupo del 1 al 5.');
            $(this).val(previousValue);
            return;
        }

        // Enviar la actualización al servidor
        $.ajax({
            url: 'cambiar-grupo-ninhos.php',
            type: 'POST',
            data: {
                id_hijo: idHijo,
                id_grupo: grupoValue  
            },
            success: function (response) {
                showCustomAlert(response);
            },
            error: function () {
                showCustomAlert('Hubo un error al actualizar los datos.');
            }
        });
    });
});

/**------------------------------------
 * MAS INFORMACION
 --------------------------------------*/
//Relleno de titulo
function obtenerParametro(nombre) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nombre);
}

$(document).ready(function () {
    const nombreHijo = sessionStorage.getItem('nombre_hijo');
    const idHijo = sessionStorage.getItem('id_hijo');

    if (nombreHijo) {
        $('#titulo-datos').text(nombreHijo);
    }

    if (idHijo) {
        fetchPadres(idHijo);
        fetchOtrosTutores(idHijo);
    } 
});

// Función para cargar del tutor usando el ID del niño
function fetchPadres(idHijo) {
    $.ajax({
        url: 'padres-admin.php',
        type: 'POST',
        data: { id_hijo: idHijo },
        success: function (response) {
            let tutores = JSON.parse(response);
            let template = '';

            tutores.forEach(tutor => {
                template += `
              <div class="hijo-info">
                  <h3>Nombre: ${tutor.nombre} ${tutor.apellidos}</h3>
                  <p><strong>Correo Electrónico:</strong> ${tutor.correo_electronico}</p>
                  <p><strong>Teléfono:</strong> ${tutor.telefono}</p>
              </div>
          `;
            });

            $('#hijos-container').html(template);
        },
        error: function () {
            showCustomAlert('Error al cargar los datos de los tutores.');
        }
    });
}

// Función para cargar los otros tutores usando el ID del niño
function fetchOtrosTutores(idHijo) {
    $.ajax({
        url: 'otroTutor-ninho-admin.php',
        type: 'POST',
        data: { id_hijo: idHijo },
        success: function (response) {
            let otrosTutores = JSON.parse(response);
            let template = '';

            if (otrosTutores && otrosTutores.length > 0) {
                otrosTutores.forEach(otroTutor => {
                    template += `
              <div class="otro-tutor-info">
                  <h3>Nombre: ${otroTutor.nombre_otro_tutor} ${otroTutor.apellidos_otro_tutor}</h3>
                  <p><strong>Teléfono:</strong> ${otroTutor.telefono_otro_tutor}</p>
                  <p><strong>DNI:</strong> ${otroTutor.dni_otro_tutor}</p>
              </div>
            `;
                });
                $('#otros-tutores-container').html(template);
            } else {
                $('#otros-tutores-container').html('<p>No se encontraron personas de confianza para este tutor.</p>');
            }
        },
        error: function () {
            showCustomAlert('Error al cargar los datos de los otros tutores.');
        }
    });
}

/**------------------------------------
 * ALMACENAR EN SESSION STORAGE
 --------------------------------------*/
// Al hacer clic en el enlace, guardar el id_hijo y nombre en sessionStorage
$(document).on('click', '.info-link', function (event) {
    event.preventDefault(); 

    const idHijo = $(this).data('id');
    const nombreHijo = $(this).data('nombre');

    sessionStorage.setItem('id_hijo', idHijo);
    sessionStorage.setItem('nombre_hijo', nombreHijo);

    // Retraso para recargar la pagina de +info
    setTimeout(() => {
        window.location.href = $(this).attr('href');
    }, 100); 
});

