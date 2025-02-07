/**
 * Utilidad de menú "hamburguesa"
 */
function toggleMenu() {
  $('.menu ul').toggleClass('active');
}

/**Alert personalizado */
function showCustomAlert(message) {
  $('#alert-message').text(message);
  $('#custom-alert').fadeIn();
}

// Cerrar la alerta cuando se presione el botón
$('#close-alert').on('click', function () {
  $('#custom-alert').fadeOut();
});

/**Relleno de tabla con AJAX*/
$(document).ready(function () {
  console.log("document ready");
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
          template += `
            <tr tutorId="${tutor.id_tutor}">
              <td class="nombre">${tutor.nombre}</td>
              <td class="apellidos">${tutor.apellidos}</td>
              <td>${tutor.dni}</td>
              <td>${tutor.telefono}</td>
              <td>${tutor.correo_electronico}</td>
              <td>
                <input type="text" class="pagado-input" value="${tutor.alta}" data-id="${tutor.id_tutor}" style="text-transform: uppercase;"/>
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
  $(document).on('focus', '.pagado-input', function () {
    previousValue = $(this).val();
  });

  // Actualizar el valor de "Alta" cuando el usuario edite el campo
  $(document).on('change', '.pagado-input', function () {
    const idTutor = $(this).data("id");
    const pagadoValue = $(this).val();

    // Validación para permitir solo "si" o "no"
    if (pagadoValue !== "SI" && pagadoValue !== "NO") {
      showCustomAlert('Por favor, ingresa "SI" o "NO".');
      $(this).val(previousValue);
      return;
    }

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

/*-------------------MAS INFORMACION-----------------*/
/**Relleno de titulo */
function obtenerParametro(nombre) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(nombre);
}

$(document).ready(function () {
  // Recuperar los datos desde sessionStorage
  const nombreTutor = sessionStorage.getItem('nombre_tutor');
  const idTutor = sessionStorage.getItem('id_tutor');

  if (nombreTutor) {
    document.getElementById('titulo-datos').textContent = `${nombreTutor}`;
  }

  if (idTutor) {
    fetchNinos(idTutor);
    fetchOtrosTutores(idTutor);
  } else {
    console.error('No se encontró el id_tutor en sessionStorage');
  }
});

// Función para cargar los niños usando el ID del tutor
function fetchNinos(idTutor) {
  $.ajax({
    url: 'hijos-admin.php',
    type: 'POST',
    data: { id_tutor: idTutor },
    success: function(response) {
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
    error: function() {
      showCustomAlert('Error al cargar los datos de los niños.');
      console.error('Error al cargar los datos de los niños.');
    }
  });
}

// Función para cargar los otros tutores usando el ID del tutor
function fetchOtrosTutores(idTutor) {
  $.ajax({
    url: 'otroTutor-admin.php',
    type: 'POST',
    data: { id_tutor: idTutor },
    success: function(response) {
      console.log('Datos recibidos de otros tutores:', response);  // Verifica los datos que recibes
      let otrosTutores = JSON.parse(response);
      let template = '';

      if (otrosTutores && otrosTutores.length > 0) {
        otrosTutores.forEach(otroTutor => {
          template += `
            <h2>Información Hijos</h2>
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
    error: function() {
      showCustomAlert('Error al cargar los datos de los otros tutores.');
      console.error('Error al cargar los datos de los otros tutores.');
    }
  });
}

/*-------------------ALMACENAR EN SESSION STORAGE-----------------*/
// Al hacer clic en el enlace, guardar el id_tutor y nombre en sessionStorage
$(document).on('click', '.info-link', function(event) {
  const idTutor = $(this).data('id');
  const nombreTutor = $(this).data('nombre');
  
  // Guardar en sessionStorage
  sessionStorage.setItem('id_tutor', idTutor);
  sessionStorage.setItem('nombre_tutor', nombreTutor);
});
