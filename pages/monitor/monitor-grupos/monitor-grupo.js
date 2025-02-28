let selectedStudent = {};

function selectStudent(nombre, apellidos, edad, dieta, alergias, tutor, telefono, dni, otroTutor, telefonoOtro, dniOtro, relacion) {
    selectedStudent = { nombre, apellidos, edad, dieta, alergias, tutor, telefono, dni, otroTutor, telefonoOtro, dniOtro, relacion };
    showPopup();
}

document.addEventListener('DOMContentLoaded', function() {
    // Realizar una solicitud AJAX para obtener los datos de los niños del grupo
    fetch('monitor-grupos.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const tableBody = document.querySelector('.table-body'); // Cambiar al contenedor correcto

                data.students.forEach(student => {
                    const row = document.createElement('tr'); // Cambiar de div a tr para las filas
                    row.className = 'row';  

                    row.innerHTML = `
                        <td>${student.nombre}</td>
                        <td>${student.apellidos}</td>
                        <td>${student.nombre_tutor}</td>
                        <td>${student.telefono}</td>
                        <td>${student.correo_electronico}</td>
                        <td>
                            <button class="info-btn"
                                onclick="selectStudent(
                                    '${student.nombre}',
                                    '${student.apellidos}',
                                 
                                    '${student.alergias || 'No tiene'}',
                                    '${student.nombre_tutor}',
                                    '${student.telefono}',
                                    '${student.dni || 'No disponible'}',
                                    
                                )">
                                Más info
                            </button>
                        </td>
                    `;
                    tableBody.appendChild(row); // Añadir la fila al contenedor de la tabla
                });
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
});


function showPopup() {
    if (Object.keys(selectedStudent).length > 0) {
        document.getElementById('nombre').textContent = selectedStudent.nombre;
        document.getElementById('apellidos').textContent = selectedStudent.apellidos;
        document.getElementById('dieta').textContent = selectedStudent.dieta;
       
       
        document.getElementById('alergias').textContent = selectedStudent.alergias; 
        document.getElementById('tutor').textContent = selectedStudent.tutor;
       
        
        // document.getElementById('otroTutor').textContent = selectedStudent.otroTutor;

        document.getElementById('overlay').style.display = 'block';
        document.getElementById('popup').style.display = 'block';
    } else {
        alert("Por favor, selecciona un alumno primero.");
    }
}

function hidePopup() {
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('overlay');

    // Añadir animación de salida
    popup.style.animation = 'fadeOut 0.3s ease-in-out';
    overlay.style.animation = 'fadeOutOverlay 0.3s ease-in-out';

    // Ocultar después de la animación
    setTimeout(() => {
        popup.style.display = 'none';
        overlay.style.display = 'none';
        // Restablecer la animación
        popup.style.animation = '';
        overlay.style.animation = '';
    }, 300);
}

// MENU DESPLEGABLE OPCIÓN CERRAR SESIÓN

document.addEventListener("DOMContentLoaded", function () {
    const menuContainer = document.querySelector(".menu-container");
    const dropdownMenu = document.getElementById("dropdownMenu");

    menuContainer.addEventListener("mouseenter", function () {
        dropdownMenu.style.display = "block";
    });

    menuContainer.addEventListener("mouseleave", function () {
        dropdownMenu.style.display = "none";
    });
});

// CERRAR SESIÓN Y REDIRECCIÓN SI EL USUARIO VUELVE PARA ATRÁS
document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.getElementById("logoutBtn");

    logoutBtn.addEventListener("click", function () {
        // Eliminar la sesión
        sessionStorage.removeItem("usuario"); 
        localStorage.removeItem("usuario"); 

        // Marcar que el usuario cerró sesión
        sessionStorage.setItem("cerrado", "true");

        // Reemplazar el historial para que no pueda volver atrás
        window.history.replaceState(null, "", "../../web/home/login.html");

        // Redirigir instantáneamente
        window.location.href = "../../web/home/login.html";
    });

    // Si el usuario cerró sesión, evitar que vuelva atrás instantáneamente
    if (sessionStorage.getItem("cerrado") === "true" && 
        !sessionStorage.getItem("usuario") && 
        !localStorage.getItem("usuario")) {
        
        sessionStorage.removeItem("cerrado"); // Evitar bucles infinitos

        // Reemplazar la entrada actual en el historial para bloquear el "Atrás"
        window.history.replaceState(null, "", "../../web/home/login.html");

        // Redirigir instantáneamente sin recargar
        window.location.replace("../../web/home/login.html");
    }

    // Evitar que el usuario vuelva atrás sin recargar
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
        if (!sessionStorage.getItem("usuario") && !localStorage.getItem("usuario")) {
            window.history.replaceState(null, "", "../../web/home/login.html");
            window.location.replace("../../web/home/login.html");
        } else {
            window.history.pushState(null, "", window.location.href);
        }
    };
});

//  <!-- MENU HAMBURGUESA -->

document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger");
    const nav = document.querySelector(".nav");

    hamburger.addEventListener("click", function () {
        nav.classList.toggle("active");
    });
});