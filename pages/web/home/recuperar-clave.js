/**------------------------------------
 * Validación de formulario
 --------------------------------------*/
 const form = document.getElementById('recuperarForm');
 const inputs = document.querySelectorAll('#recuperarForm input, #recuperarForm select');
 
 const expressions = {
   email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
   tipo: /^(administrador|monitor|tutor)$/
 };
 
 const fields = {
   email: false,
   tipo: false,
 };
 
 const validateForm = (e) => {
   switch (e.target.name) {
     case "email":
       validateField(expressions.email, e.target, 'email');
       break;
     case "tipo":
       validateField(expressions.tipo, e.target, 'tipo');
       break;
   }
 };
 
 const validateField = (expression, input, field) => {
   if (expression.test(input.value)) {
     document.getElementById(`group__${field}`).classList.remove('form__group-incorrect');
     document.getElementById(`group__${field}`).classList.add('form__group-correct');
 
     // Añadir botón correcto y eliminar la X
     document.querySelector(`#group__${field} img`).src = '../../../assets/icon/boton-correcto.png';
     document.querySelector(`#group__${field} img`).classList.remove('errors');
 
     // Eliminar mensaje de error
     document.querySelector(`#group__${field} .form__input-error`).classList.remove('form__input-error-active');
     fields[field] = true;
   } else {
     document.getElementById(`group__${field}`).classList.add('form__group-incorrect');
     document.getElementById(`group__${field}`).classList.remove('form__group-correct');
 
     // Actualizar el ícono y las clases relacionadas
     document.querySelector(`#group__${field} img`).classList.add('errors');
     document.querySelector(`#group__${field} img`).src = '../../../assets/icon/boton-eliminar.png';
 
     // Mostrar mensaje de error
     document.querySelector(`#group__${field} .form__input-error`).classList.add('form__input-error-active');
     fields[field] = false;
   }
 };
 
 inputs.forEach((input) => {
   input.addEventListener('keyup', validateForm);
   input.addEventListener('blur', validateForm);
   input.addEventListener('change', validateForm); // Para el select
 });
 
 /**------------------------------------
  * Envio de datos, mediante AJAX
  --------------------------------------*/
 $(document).ready(function () {
   $('#recuperarForm').submit(function (event) {
     event.preventDefault();
 
     // Validar todos los campos antes de enviar
     let isValid = true;
     inputs.forEach((input) => {
       validateForm({ target: input }); // Forzar validación de cada campo
       if (!fields[input.name]) {
         isValid = false;
       }
     });
 
     if (!isValid) {
       // Mostrar mensaje de error si el formulario no es válido
       document.getElementById('respuesta').textContent = 'Por favor, completa el formulario correctamente.';
       document.getElementById('respuesta').style.color = 'red';
       return; // Detener el envío si no es válido
     }
 
     // Si el formulario es válido, proceder con el envío AJAX
     let email = $('#email').val();
     let tipo = $('#tipo').val();
 
     let formData = new FormData();
     formData.append('email', email);
     formData.append('tipo', tipo);
 
     $.ajax({
       url: 'recuperar-clave.php',
       type: 'POST',
       data: formData,
       processData: false,
       contentType: false,
       success: function (response) {
         $('#respuesta').html(response);
         if (response.includes('éxito')) { // Ajusta esta condición según la respuesta del servidor
           document.getElementById('respuesta').style.color = 'green';
           form.reset(); // Limpiar el formulario después de un envío exitoso
         } else {
           document.getElementById('respuesta').style.color = 'red';
         }
       },
       error: function (xhr, status, error) {
         console.error('Error:', error);
         document.getElementById('respuesta').textContent = 'Hubo un error al enviar el formulario.';
         document.getElementById('respuesta').style.color = 'red';
       }
     });
   });
 });