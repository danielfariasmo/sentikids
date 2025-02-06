/**
 * Utilidad de menú "hamburguesa"
 */
function toggleMenu() {
  $('.menu ul').toggleClass('active');
}

/**
* Funcionalidad para el pop up
*/

// Función para abrir un modal específico basado en el ID proporcionado
function openModal(modalId) {
  $('#' + modalId).css('display', 'block');
}

// Función para cerrar un modal específico basado en el ID proporcionado
function closeModal(modalId) {
  $('#' + modalId).css('display', 'none');
}

// Asignar eventos a cada botón que abre los modales
$('.myBtn').on('click', function () {
  var modalId = $(this).data('modal-id');  // Obtener el ID del modal asociado
  openModal(modalId);
});

// Asignar eventos para cerrar cada modal
$('.close').on('click', function () {
  var modalId = $(this).data('modal-id');  // Obtener el ID del modal asociado
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

/**Relleno de tablas con ajax */
$(document).ready(function() {
  fetchTutor();

  function fetchTutor() {
    $.ajax({
      url: 'tutores-admin.php',
      type: 'GET',
      success: function (response) {
        let tutores = JSON.parse(response);
        let template = ' ';
        tutores.forEach(tutor => {
          template += `
                      <tr taskId="${tutor.id_tutor}">
                          <td >${tutor.nombre}</td>
                          <td >${tutor.apellidos}</td>
                          <td >${tutor.dni}</td>
                          <td >${tutor.telefono}</td>
                          <td >${tutor.correo_electronico}</td>
                          <td>
                              <button class="information">
                                  <a style="text-decoration: none; color: black;" href="info-tutores-admin.html">+ info</a>
                              </button>
                          </td>
                      </tr>
                      `
        });
  
        $('#table-body').html(template);
      }
  
    });
  }
  
})

/**Relleno de select con ajax */
document.addEventListener("DOMContentLoaded", function() {
  const selectElement = document.getElementById("select-kids-delete");
  fetchTutores();

  function fetchTutores() {
    $.ajax({
      url: 'tutores-admin.php', 
      type: 'GET',
      success: function(response) {
        let tutores = JSON.parse(response);

        // Limpiar las opciones anteriores (excepto la primera)
        selectElement.innerHTML = '<option value="" selected>Seleccione un tutor</option>';

        // Rellenar el select con los tutores
        tutores.forEach(tutor => {
          const option = document.createElement("option");
          option.value = `${tutor.nombre.toLowerCase().replace(/ /g, '-')}-${tutor.apellidos.toLowerCase().replace(/ /g, '-')}`;
          option.textContent = `${tutor.nombre} ${tutor.apellidos}`;
          selectElement.appendChild(option);
        });
      }
    });
  }
});

