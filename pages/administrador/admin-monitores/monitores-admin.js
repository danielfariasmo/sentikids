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

// Validar campo de selección en el formulario de eliminar
$('#select-kids-delete').on('change', function () {
  validateSelect($(this), '#group__nameSelect-delete');
});

// Función para validar un campo de selección
const validateSelect = (input, groupId) => {
  const selectGroup = $(groupId);
  if (input.val() !== "" && input.val() !== "Seleccione un niño/a") {
    selectGroup.removeClass('form__group-incorrect').addClass('form__group-correct');
    selectGroup.find('img').attr('src', '../../../assets/icon/boton-correcto.png').removeClass('errors');
    selectGroup.find('.form__input-error').removeClass('form__input-error-active');
  } else {
    selectGroup.addClass('form__group-incorrect').removeClass('form__group-correct');
    selectGroup.find('img').addClass('errors').attr('src', '../../../assets/icon/boton-eliminar.png');
    selectGroup.find('.form__input-error').addClass('form__input-error-active');
  }
};


// Manejo del envío del formulario
$(".popup_body").on("submit", function (e) {
  e.preventDefault();
  let formId = $(this).attr("id");
  let errorMessageId = formId === "form-add" ? "#form__message-add" : "#form__message-delete";
  let successMessageId = formId === "form-add" ? "#form__success-message-add" : "#form__success-message-delete";

  if (Object.values(fields).every(Boolean)) {
      $(this).trigger("reset");
      $(successMessageId).addClass("form__success-message-active");
      setTimeout(() => {
          $(successMessageId).removeClass("form__success-message-active");
      }, 5000);

      $(".form__group-correct").removeClass("form__group-correct");
      $(errorMessageId).removeClass("form__message-active"); // Ocultar error si todo está bien
  } else {
      $(errorMessageId).addClass("form__message-active");
      console.log("Formulario con errores:", fields); // Depuración
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
                        <img src="../../../assets/icon/papelera1.png" alt="Editar" id="edit-${monitor.id_monitor}" 
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
  window.changeImage = function(img) {
    img.src = '../../../assets/icon/papelera2.png';  // Cambia a la imagen de hover
  }

  // Función para restaurar la imagen original al quitar el mouse
  window.resetImage = function(img) {
    img.src = '../../../assets/icon/papelera1.png';  // Restaura la imagen original
  }

  // // Capturar valor anterior por si hay un error.
  // let previousValue = '';
  // $(document).on('focus', '.grupo-input', function () {
  //     previousValue = $(this).val();  
  // });

  // // Actualizar el valor de "Grupo" cuando el usuario edite el campo
  // $(document).on('change', '.grupo-input', function () {
  //     const idHijo = $(this).data("id");
  //     const grupoValue = $(this).val();

  //     // Validación para permitir solo números del 1 al 5
  //     if (isNaN(grupoValue) || grupoValue < 1 || grupoValue > 5) {
  //         showCustomAlert('Por favor, ingresa un grupo del 1 al 5.');
  //         $(this).val(previousValue);
  //         return;
  //     }

  //     $.ajax({
  //         url: 'cambiar-grupo-ninhos.php',
  //         type: 'POST',
  //         data: {
  //             id_hijo: idHijo,
  //             id_grupo: grupoValue  
  //         },
  //         success: function (response) {
  //             showCustomAlert(response);
  //         },
  //         error: function () {
  //             showCustomAlert('Hubo un error al actualizar los datos.');
  //         }
  //     });
  // });
});

