/**------------------------------------
 * Utilidad de menú "hamburguesa"
 --------------------------------------*/
function toggleMenu() {
    $('.menu ul').toggleClass('active');
}

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
                            <td>${grupo.id_horario}</td>
                            <td>${grupo.nombre_monitor} ${grupo.apellidos_monitor}</td>
                            <td>
                                <input type="text" class="grupo-input" value="${grupo.id_monitor}" data-id="${grupo.id_grupo}"/>
                            </td>
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

    // Capturar valor anterior por si hay un error.
    let previousValue = '';
    $(document).on('focus', '.grupo-input', function () {
        previousValue = $(this).val();  
    });

    // Actualizar el valor de "Grupo" cuando el usuario edite el campo
    $(document).on('change', '.grupo-input', function () {
        const idGrupo = $(this).data("id"); 
        const idMonitor = $(this).val(); 

        // Verificar si el monitor existe en la base de datos
        $.ajax({
            url: 'comprobar-monitor-admin.php', 
            type: 'POST',
            data: { id_monitor: idMonitor },
            success: function (response) {
                if (response === "Monitor no encontrado.") {
                    showCustomAlert('El ID de monitor ingresado no existe.');
                    fetchGrupo();
                } else {
                    // Si el monitor existe, proceder con la actualización
                    $.ajax({
                        url: 'cambiar-monitor-admin.php',
                        type: 'POST',
                        data: {
                            id_grupo: idGrupo,  
                            id_monitor: idMonitor  
                        },
                        success: function (response) {
                            showCustomAlert(response);
                            fetchGrupo();
                        },
                        error: function () {
                            showCustomAlert('Hubo un error al actualizar los datos.');
                        }
                    });
                }
            },
            error: function () {
                showCustomAlert('Hubo un error al verificar el ID del monitor.');
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
// Al hacer clic en el enlace, guardar el id_hijo y nombre en sessionStorage
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
        showCustomAlert('Niños agregados al grupo correctamente');
        fetchListado(groupId);
        $('#modal1').fadeOut(); 
      },
      error: function () {
        showCustomAlert('Error al agregar los niños');
      }
    });
});

  