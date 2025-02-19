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
              window.location.href = "../../web/home/inicio.html"; 
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
                  window.location.href = "../../web/home/inicio.html";
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
  fetchTutor();

  // Relleno de tabla
  function fetchTutor() {
    $.ajax({
      url: 'tutores-admin.php',
      type: 'GET',
      success: function (response) {
        let tutores = JSON.parse(response);
        let template = '';

        tutores.forEach(tutor => {
          const isDisabled = tutor.alta.toUpperCase() === "SI" ? 'disabled' : '';

          template += `
            <tr tutorId="${tutor.id_tutor}">
              <td class="nombre">${tutor.nombre}</td>
              <td class="apellidos">${tutor.apellidos}</td>
              <td>${tutor.dni}</td>
              <td>${tutor.telefono}</td>
              <td>${tutor.correo_electronico}</td>
              <td>
                <input type="text" class="pagado-input" value="${tutor.alta}" data-id="${tutor.id_tutor}" style="text-transform: uppercase;" ${isDisabled} />
              </td>
              <td>
                <button class="information">
                  <a href="info-tutores-admin.html" style="text-decoration: none; color: black;" class="info-link" data-id="${tutor.id_tutor}" data-nombre="${tutor.nombre} ${tutor.apellidos}">
                    + info
                  </a>
                </button>
              </td>
            </tr>
          `;
        });

        $('#table-body').html(template);
      }
    });
  }

  // Función para filtrar la tabla
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

  // Actualizar el valor de "Alta" cuando el usuario edite el campo
  $(document).on('change', '.pagado-input', function () {
    const idTutor = $(this).data("id");
    let pagadoValue = $(this).val().toUpperCase();

    if (pagadoValue !== "SI" && pagadoValue !== "NO") {
      showCustomAlert('Por favor, ingresa "SI" o "NO".');
      $(this).val(previousValue);
      return;
    }

    // Si el valor es "SI", deshabilitamos el campo después de la actualización
    if (pagadoValue === "SI") {
      $(this).prop('disabled', true);
    }

    // Enviar la actualización al servidor
    $.ajax({
      url: 'dar-alta-tutor.php',
      type: 'POST',
      data: {
        id_tutor: idTutor,
        alta: pagadoValue
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
  const nombreTutor = sessionStorage.getItem('nombre_tutor');
  const idTutor = sessionStorage.getItem('id_tutor');

  if (nombreTutor) {
    document.getElementById('titulo-datos').textContent = `${nombreTutor}`;
  }

  if (idTutor) {
    fetchNinos(idTutor);
    fetchOtrosTutores(idTutor);
  } 
});

// Función para cargar los niños usando el ID del tutor
function fetchNinos(idTutor) {
  $.ajax({
    url: 'hijos-admin.php',
    type: 'POST',
    data: { id_tutor: idTutor },
    success: function (response) {
      let hijos = JSON.parse(response);
      let template = '';

      hijos.forEach(hijo => {
        template += `
            <div class="hijo-info">
                <h3>Nombre: ${hijo.nombre} ${hijo.apellidos}</h3>
                <p><strong>Fecha de Nacimiento:</strong> ${hijo.fecha_nacimiento}</p>
                <p><strong>Dieta:</strong> ${hijo.dieta}</p>
                <p><strong>Alergias:</strong> ${hijo.alergias}</p>
                <p><strong>ID Grupo:</strong> ${hijo.id_grupo}</p>
            </div>
        `;
      });

      $('#hijos-container').html(template);
    },
    error: function () {
      showCustomAlert('Error al cargar los datos de los niños.');
    }
  });
}

// Función para cargar los otros tutores usando el ID del tutor
function fetchOtrosTutores(idTutor) {
  $.ajax({
    url: 'otroTutor-admin.php',
    type: 'POST',
    data: { id_tutor: idTutor },
    success: function (response) {
      let otrosTutores = JSON.parse(response);
      let template = '';

      if (otrosTutores && otrosTutores.length > 0) {
        otrosTutores.forEach(otroTutor => {
          template += `
            <div class="otro-tutor-info">
                <h3>Nombre: ${otroTutor.nombre} ${otroTutor.apellidos}</h3>
                <p><strong>Teléfono:</strong> ${otroTutor.telefono}</p>
                <p><strong>DNI:</strong> ${otroTutor.dni}</p>
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
// Al hacer clic en el enlace, guardar el id_tutor y nombre en sessionStorage
$(document).on('click', '.info-link', function (event) {
  const idTutor = $(this).data('id');
  const nombreTutor = $(this).data('nombre');

  sessionStorage.setItem('id_tutor', idTutor);
  sessionStorage.setItem('nombre_tutor', nombreTutor);
});
