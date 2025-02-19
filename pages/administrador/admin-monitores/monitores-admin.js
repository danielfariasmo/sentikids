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
 * Alert de borrar
 --------------------------------------*/
function showDeleteConfirm(message, onConfirm, onCancel) {
  $('#confirm-message').text(message);
  $('#delete-confirm').fadeIn();

  $('#confirm-delete').on('click', function () {
    onConfirm();  
    $('#delete-confirm').fadeOut();  
  });

  $('#cancel-delete').on('click', function () {
    onCancel();  
    $('#delete-confirm').fadeOut();  
  });
}

$('#delete-confirm').on('click', function (e) {
  if (e.target === this) {
    $('#delete-confirm').fadeOut();
  }
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
 * VALIDACIONES DEL FORMULARIO
 --------------------------------------*/
// Expresiones regulares para validación
const expressions = {
  name: /^[a-zA-ZÀ-ÿ\s]{2,40}$/, 
  surname: /^[a-zA-ZÀ-ÿ\s]{2,40}$/, 
  phone: /^\d{9}$/, 
  dni: /^[0-9]{8}[A-Za-z]$/,
  email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, 
  usuario: /^[a-zA-Z0-9\_\-]{4,16}$/, 
  password: /^.{4,12}$/ 
};

// Campos del formulario
const fields = {
  name: false,
  surname: false,
  phone: false,
  dni: false,
  email: false,
  usuario: false,
  password: false
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

// Función para validar repetir contraseña
const validarPassword2 = () => {
	const $inputPassword1 = $('#password');
	const $inputPassword2 = $('#password2');

	if ($inputPassword1.val() !== $inputPassword2.val()) {
		$('#group__password2').addClass('form__group-incorrect').removeClass('form__group-correct');
		$('#group__password2 img').addClass('errors').attr('src', '../../../assets/icon/boton-eliminar.png');
		$('#group__password2 .form__input-error').addClass('form__input-error-active');

		fields['password2'] = false;
	} else {
		$('#group__password2').removeClass('form__group-incorrect').addClass('form__group-correct');
		$('#group__password2 img').removeClass('errors').attr('src', '../../../assets/icon/boton-correcto.png');
		$('#group__password2 .form__input-error').removeClass('form__input-error-active');

		fields['password2'] = true;
	}
}

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
    case "usuario":
      validateField(expressions.usuario, e.target, 'usuario');
      break;
    case "password":
      validateField(expressions.password, e.target, 'password');
      validarPassword2();
      break;
    case "password2":
      validarPassword2();
      break;
  }
});

// Manejo del envío del formulario
$(".popup_body").on("submit", function (e) {
  e.preventDefault();
  let formId = $(this).attr("id");
  let errorMessageId = formId === "form-add" ? "#form__message-add" : "#form__message-delete";
  let successMessageId = formId === "form-add" ? "#form__success-message-add" : "#form__success-message-delete";
  const formElement = this;

  if (Object.values(fields).every(Boolean)) {
    const formData = new FormData(formElement); 

    $.ajax({
      url: 'agregar-monitor-admin.php',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.includes('Error')) {
          $(errorMessageId).addClass("form__message-active");
        } else {
          formElement.reset(); 
          $(".form__group-correct").removeClass("form__group-correct"); 

          $(successMessageId).addClass("form__success-message-active");
          setTimeout(() => {
            $(successMessageId).removeClass("form__success-message-active");
          }, 5000);
          $(errorMessageId).removeClass("form__message-active");
          fetchMonitor(); 
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

/**------------------------------------
 * Relleno de tabla con AJAX
 --------------------------------------*/
$(document).ready(function () {
  const searchInput = $('#search-input');
  fetchMonitor();

  //Función para filtrar la tabla*
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

  //Funcion para cambiar de img "papelera" 
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

  fetchMonitor();
});

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
                <td>${monitor.id_monitor}</td>
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
