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

// Cerrar la alerta cuando se presione el botón
$('#close-alert').on('click', function () {
  $('#custom-alert').fadeOut();
});

/**------------------------------------
 * FUNCIONALIDAD PARA EL POP UP
 --------------------------------------*/
function openModal(modalId) {
  $('#' + modalId).css('display', 'block');
}

function closeModal(modalId) {
  $('#' + modalId).css('display', 'none');
}

$('.myBtn').on('click', function () {
  var modalId = $(this).data('modal-id');
  openModal(modalId);
});

// Asignar eventos para cerrar cada modal
$('.close').on('click', function () {
  var modalId = $(this).data('modal-id');
  closeModal(modalId);
});

// Cerrar modal si el usuario hace clic fuera del modal
$(window).on('click', function (event) {
  $('.modal').each(function () {
    if (event.target == this) {
      $(this).css('display', 'none');
    }
  });
});

/**------------------------------------
 * Relleno de tabla con AJAX
 --------------------------------------*/
$(document).ready(function () {
  const searchInput = $('#search-input');
  fetchGrupo();
  let grupoIdSeleccionado = null; // Definir la variable en un ámbito accesible

  // Evento para abrir el modal al hacer clic en el ícono de editar
  $(document).on('click', '.edit-monitor', function () {
    grupoIdSeleccionado = $(this).data('id'); // Asignar el ID del grupo seleccionado
    $('#modal2').show(); // Mostrar el modal
  });

  // Evento para cerrar el modal cuando se haga clic en el botón de cerrar
  $('.close').click(function () {
    $('#modal2').hide();
  });

  // Cerrar modal si el usuario hace clic fuera del contenido
  $(window).click(function (event) {
    if ($(event.target).is('#modal2')) {
      $('#modal2').hide();
    }
  });

  // Relleno de tabla
  function fetchGrupo() {
    $.ajax({
      url: 'grupos-admin.php',
      type: 'GET',
      success: function (response) {

        let grupos = JSON.parse(response);
        let template = '';

        grupos.forEach(grupo => {
          template += `
                        <tr tutorId="${grupo.id_grupo}">
                            <td>${grupo.id_grupo}</td>
                            <td class="nombre">${grupo.nombre_grupo}</td>
                            <td>${grupo.nombre_monitor} ${grupo.apellidos_monitor} <img src="../../../assets/icon/boton-editar.png" alt="Editar" class="edit-monitor" data-id="${grupo.id_grupo}"></td>
                            <td>${grupo.numero_ninos}</td> 
                            <td>
                                <button class="information">
                                   <a href="lista-grupos-admin.html" style="text-decoration: none; color: black;" class="info-link" data-id="${grupo.id_grupo}" data-nombre="${grupo.nombre_grupo}">+ info</a>
                                </button>
                            </td>
                        </tr>
                    `;
        });

        $('#table-body').html(template);
      }
    });
  }

  //Función para filtrar la tabla.
  searchInput.on('input', function () {
    const searchTerm = searchInput.val().toLowerCase();

    // Filtrar las filas de la tabla según el nombre y apellido.
    $('#table-body tr').each(function () {
      const nombre = $(this).find('.nombre').text().toLowerCase();

      if (nombre.indexOf(searchTerm) !== -1) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });

  // Buscar monitor con el campo de búsqueda con AJAX
  $('#search-coach').on('keyup', function () {
    let searchQuery = $(this).val();

    if (searchQuery.length > 0) {
      $.ajax({
        url: 'buscar-monitor.php',
        type: 'POST',
        data: { query: searchQuery },
        success: function (response) {
          let results = JSON.parse(response);
          let template = '';

          // Generar la lista de resultados con checkbox
          results.forEach(coach => {
            template += `
              <div class="result-item">
                <input type="checkbox" id="coach-${coach.id_monitor}" name="selected-coach" data-id="${coach.id_monitor}" class="select-coach" />
                <label for="coach-${coach.id_monitor}">${coach.nombre} ${coach.apellidos}</label>
              </div>
            `;
          });

          $('#search-results-coach').html(template);
        },
        error: function () {
          showCustomAlert('Error al buscar al monitor');
        }
      });
    } else {
      $('#search-results').html('');
    }
  });

  // Habilitar el botón cuando se selecciona un monitor
  $(document).on('change', '.select-coach', function () {
    $('#add-coach').prop('disabled', false);
  });

  // Realizar el cambio de monitor en la BD y en la tabla
  $('#add-coach').click(function () {
    let selectedCoach = $('.select-coach:checked');
  
    if (selectedCoach.length > 0 && grupoIdSeleccionado !== null) {
      let nuevoMonitorId = selectedCoach.data('id');
      let nuevoMonitorNombre = selectedCoach.next('label').text();
  
      $.ajax({
        url: 'actualizar-monitor.php',
        type: 'POST',
        data: {
          id_grupo: grupoIdSeleccionado,
          id_monitor: nuevoMonitorId
        },
        success: function (response) {
          if (response === 'success') {
            let fila = $(`tr[tutorId="${grupoIdSeleccionado}"]`);
            fila.find('td:nth-child(3)').html(`${nuevoMonitorNombre} <img src="../../../assets/icon/boton-editar.png" alt="Editar" class="edit-monitor" data-id="${grupoIdSeleccionado}">`);
  
            showCustomAlert('Monitor actualizado con éxito.');
            $('#modal2').hide();
            fetchGrupo();
          } else if (response === 'monitor_asignado') {
            showCustomAlert('Este monitor ya está asignado a otro grupo.');
          } else {
            showCustomAlert('Error al actualizar el monitor');
          }
        },
        error: function () {
          console.error('Error al actualizar el monitor en la BD');
        }
      });
    }
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
  const nombreGrupo = sessionStorage.getItem('nombre');
  const idGrupo = sessionStorage.getItem('id_grupo');

  if (nombreGrupo) {
    $('#titulo-datos').text(nombreGrupo);
  }

  if (idGrupo) {
    fetchListado(idGrupo);
  }
});

// Función para cargar los niños usando el ID del tutor
function fetchListado(idGrupo) {
  $.ajax({
    url: 'lista-grupos-admin.php',
    type: 'POST',
    data: { id_grupo: idGrupo },
    success: function (response) {
      let listados = JSON.parse(response);
      let template = '';

      listados.forEach(listado => {
        template += `
            <tr tutorId="${listado.id_hijo}">
                <td>${listado.nombre_hijo} ${listado.apellidos_hijo}</td>
                <td>${listado.dieta} // ${listado.alergias}</td>
                <td>${listado.nombre_tutor} ${listado.apellidos_tutor}</td>
                <td>${listado.telefono_tutor}</td>
                <td>${listado.nombre_otro_tutor && listado.apellidos_otro_tutor ? listado.nombre_otro_tutor + ' ' + listado.apellidos_otro_tutor : 'Sin otro tutor'}</td>
                <td>${listado.telefono_otro_tutor ? listado.telefono_otro_tutor : 'Sin otro tutor'}</td>
            </tr>
        `;
      });

      $('#table-body2').html(template);
    },
    error: function () {
      showCustomAlert('Error al cargar los datos de los niños.');
    }
  });
}

/**------------------------------------
 * ALMACENAR EN SESSION STORAGE
 --------------------------------------*/
$(document).on('click', '.info-link', function (event) {
  event.preventDefault();

  const idGrupo = $(this).data('id');
  const nombreGrupo = $(this).data('nombre');

  sessionStorage.setItem('id_grupo', idGrupo);
  sessionStorage.setItem('nombre', nombreGrupo);

  setTimeout(() => {
    window.location.href = $(this).attr('href');
  }, 500);
});

/**------------------------------------
 * AGREGAR NIÑO/A A GRUPO
 --------------------------------------*/
// Buscar niños con el campo de búsqueda con AJAX
$('#search-child').on('keyup', function () {
  let searchQuery = $(this).val();

  if (searchQuery.length > 0) {
    $.ajax({
      url: 'buscar-nino.php',
      type: 'POST',
      data: { query: searchQuery },
      success: function (response) {
        let results = JSON.parse(response);
        let template = '';

        // Generar la lista de resultados con checkbox
        results.forEach(child => {
          template += `
              <div class="result-item">
                <input type="checkbox" id="child-${child.id_hijo}" data-id="${child.id_hijo}" class="select-child" />
                <label for="child-${child.id_hijo}">${child.nombre} ${child.apellidos}</label>
              </div>
            `;
        });

        $('#search-results').html(template);
      },
      error: function () {
        console.error('Error al buscar el niño');
      }
    });
  } else {
    // Si no hay texto en el campo, ocultamos los resultados
    $('#search-results').html('');
  }
});

// Habilitar el botón "Agregar" cuando al menos un niño esté seleccionado
$(document).on('change', '.select-child', function () {
  let selectedChildren = $('.select-child:checked');

  if (selectedChildren.length > 0) {
    $('#add-child').prop('disabled', false);
  } else {
    $('#add-child').prop('disabled', true);
  }
});

// Agregar los niños seleccionados al grupo
$('#add-child').on('click', function () {
  let selectedChildren = $('.select-child:checked');
  let selectedIds = [];

  selectedChildren.each(function () {
    selectedIds.push($(this).data('id'));
  });

  // Obtener el ID del grupo 
  const groupId = sessionStorage.getItem('id_grupo');

  // Petición para agregar los niños seleccionados al grupo
  $.ajax({
    url: 'agregar-al-grupo.php',
    type: 'POST',
    data: {
      children_ids: selectedIds,
      group_id: groupId
    },
    success: function (response) {
      showCustomAlert(response);
      fetchListado(groupId);
      $('#modal1').fadeOut();
    },
    error: function () {
      showCustomAlert('Error al agregar los niños');
    }
  });
});

