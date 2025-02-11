/** Utilidad de menú "hamburguesa" */
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

/** Confirmación de eliminación */
function showDeleteConfirm(message, onConfirm, onCancel) {
  $('#confirm-message').text(message);
  $('#delete-confirm').fadeIn();

  $('#confirm-delete').on('click', function () {
    onConfirm();  // Ejecutar la acción de confirmación
    $('#delete-confirm').fadeOut();  // Cerrar la alerta
  });

  $('#cancel-delete').on('click', function () {
    onCancel();  // Ejecutar la acción de cancelación
    $('#delete-confirm').fadeOut();  // Cerrar la alerta
  });
}

// Cerrar la alerta de confirmación al hacer clic fuera
$('#delete-confirm').on('click', function (e) {
  if (e.target === this) {
    $('#delete-confirm').fadeOut();
  }
});


/**
* Funcionalidad para el pop up
*/
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

/** 
* Validación de formularios 
*/

// Expresiones regulares para validación
const expressions = {
  name: /^[a-zA-ZÀ-ÿ\s]{2,40}$/, // Letras, con espacios, mínimo 2 y máximo 40 (incluye hasta 4 espacios).
  surname: /^[a-zA-ZÀ-ÿ\s]{2,40}$/, // Letras, con espacios, mínimo 2 y máximo 40 (incluye hasta 4 espacios).
  phone: /^\d{9}$/, // Teléfono de 9 dígitos.
  dni: /^[0-9]{8}[A-Za-z]$/,
  email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, // Formato de correo.
};

// Campos del formulario
const fields = {
  name: false,
  surname: false,
  phone: false,
  dni: false,
  email: false
};

// Función para validar un campo
const validateField = (expression, input, field) => {
  if (expression.test(input.value)) {
    $(`#group__${field}`).removeClass('form__group-incorrect').addClass('form__group-correct');
    $(`#group__${field} img`).attr('src', '../../../assets/icon/boton-correcto.png').removeClass('errors');
    $(`#group__${field} .form__input-error`).removeClass('form__input-error-active');
    fields[field] = true;
  } else {
    $(`#group__${field}`).addClass('form__group-incorrect').removeClass('form__group-correct');
    $(`#group__${field} img`).addClass('errors').attr('src', '../../../assets/icon/boton-eliminar.png');
    $(`#group__${field} .form__input-error`).addClass('form__input-error-active');
    fields[field] = false;
  }
};

// Validar formulario al escribir o salir del campo
$('.form__input').on('keyup blur', function (e) {
  switch (e.target.name) {
    case "name":
      validateField(expressions.name, e.target, 'name');
      break;
    case "surname":
      validateField(expressions.name, e.target, 'surname');
      break;
    case "dni":
      validateField(expressions.dni, e.target, 'dni');
      break;
    case "email":
      validateField(expressions.email, e.target, 'email');
      break;
    case "phone":
      validateField(expressions.phone, e.target, 'phone');
      break;
  }
});

// Manejo del envío del formulario
$(".popup_body").on("submit", function (e) {
  e.preventDefault();
  let formId = $(this).attr("id");
  let errorMessageId = formId === "form-add" ? "#form__message-add" : "#form__message-delete";
  let successMessageId = formId === "form-add" ? "#form__success-message-add" : "#form__success-message-delete";

  if (Object.values(fields).every(Boolean)) {
    // Si todos los campos son correctos, realizamos la solicitud AJAX
    const formData = new FormData(this); // Obtiene todos los datos del formulario

    $.ajax({
      url: 'agregar-monitor-admin.php', // Ruta al archivo PHP que procesará la solicitud
      type: 'POST',
      data: formData,
      processData: false, // No procesar los datos
      contentType: false, // No establecer tipo de contenido, ya que estamos enviando un FormData
      success: function (response) {
        console.log(response); // Para verificar la respuesta del servidor
        if (response.includes('Error')) {
          $(errorMessageId).addClass("form__message-active");
        } else {
          $(this).trigger("reset"); // Reinicia el formulario
          $(successMessageId).addClass("form__success-message-active");
          setTimeout(() => {
            $(successMessageId).removeClass("form__success-message-active");
          }, 5000);
          $(".form__group-correct").removeClass("form__group-correct");
          $(errorMessageId).removeClass("form__message-active");
        }
      },
      error: function () {
        $(errorMessageId).addClass("form__message-active");
      }
    });
  } else {
    $(errorMessageId).addClass("form__message-active");
  }
});

/**Relleno de tabla con AJAX*/
$(document).ready(function () {
  const searchInput = $('#search-input');
  fetchMonitor();

  // Relleno de tabla
  function fetchMonitor() {
    $.ajax({
      url: 'monitores-admin.php',
      type: 'GET',
      success: function (response) {
        let monitores = JSON.parse(response);
        let template = '';

        monitores.forEach(monitor => {
          template += `
              <tr tutorId="${monitor.id_monitor}">
                  <td class="nombre">${monitor.nombre}</td>
                  <td class="apellidos">${monitor.apellidos}</td>
                  <td>${monitor.telefono}</td>
                  <td>${monitor.dni}</td>
                  <td>${monitor.correo_electronico}</td>
                  <td>
                    <img src="../../../assets/icon/papelera1.png" alt="Eliminar" class="delete-monitor" 
                        data-id="${monitor.id_monitor}"
                        onmouseover="changeImage(this)" onmouseout="resetImage(this)">
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

  /**Funcion para cambiar de img "papelera" */
  window.changeImage = function (img) {
    img.src = '../../../assets/icon/papelera2.png';
  }

  window.resetImage = function (img) {
    img.src = '../../../assets/icon/papelera1.png';
  }

// Eliminar monitor al hacer clic en la imagen
$(document).on('click', '.delete-monitor', function () {
  const monitorId = $(this).data('id');

  // Confirmar antes de eliminar
  showDeleteConfirm("¿Estás seguro de que deseas eliminar este monitor?", function () {
      $.ajax({
        url: 'eliminar-monitor-admin.php',
        type: 'POST',
        data: {
          id_monitor: monitorId
        },
        success: function (response) {
          if (response.includes('Error')) {
            showCustomAlert('Hubo un error al eliminar el monitor. ' + response);
          } else {
            showCustomAlert('Monitor eliminado con éxito');
            fetchMonitor();  
          }
        },
        error: function () {
          showCustomAlert('Hubo un error en la petición');
        }
      });
    }
  );
});

  // Cargar los monitores inicialmente
  fetchMonitor();
});

