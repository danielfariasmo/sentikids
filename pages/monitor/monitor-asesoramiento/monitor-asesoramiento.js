// function openPopup() {
//     document.getElementById("popup").style.display = "block";
//     document.getElementById("notification-form").reset();
//     document.getElementById("success-message").style.display = "none";
// }

// function closePopup() {
//     document.getElementById("popup").style.display = "none";
// }

// // Manejar el envío del formulario
// document.getElementById("notification-form").addEventListener("submit", function (event) {
//     event.preventDefault(); // Evitar que el formulario se envíe realmente

//     // Mostramos el mensaje
//     document.getElementById("success-message").style.display = "block";

//     // Cerrar el pop-up
//     setTimeout(function () {
//         closePopup();
//     }, 2000); 
// });
function openPopup() {
    document.getElementById("popup").style.display = "block";
    document.getElementById("notification-form").reset();
    document.getElementById("success-message").style.display = "none";
    
    // Usamos fetch para obtener los tutores desde el archivo PHP
    fetch('monitor-asesoramiento.php')
        .then(response => response.json()) // Parseamos la respuesta JSON
        .then(data => {
            console.log(data);
            const recipientSelect = document.getElementById('recipient');
            
            // Limpiamos el select antes de agregar las opciones
            recipientSelect.innerHTML = '';
            
            // Creamos la opción por defecto
            const defaultOption = document.createElement('option');
            defaultOption.textContent = 'Seleccionar Tutor';
            recipientSelect.appendChild(defaultOption);
            
            // Agregamos cada tutor al select
            data.forEach(tutor => {
                const option = document.createElement('option');
                option.value = tutor.nombre + ' ' + tutor.apellidos; // Asigna el nombre completo
                option.textContent = tutor.nombre + ' ' + tutor.apellidos; // Muestra el nombre completo
                recipientSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error al cargar los tutores:', error);
        });
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

// Manejar el envío del formulario
document.getElementById("notification-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar que el formulario se envíe realmente

    // Mostramos el mensaje
    document.getElementById("success-message").style.display = "block";

    // Cerrar el pop-up
    setTimeout(function () {
        closePopup();
    }, 2000); 
});
