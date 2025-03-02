let selectedStudent = {};

function selectStudent(nombre, apellidos, nombre_tutor, telefono, correo_electronico, nombre_persona_confianza, telefono_persona_confianza, dni_persona_confianza) {
    selectedStudent = { 
        nombre, 
        apellidos, 
        nombre_tutor, 
        telefono, 
        correo_electronico, 
        nombre_persona_confianza, 
        telefono_persona_confianza, 
        dni_persona_confianza 
    };
    showPopup();
}
document.addEventListener('DOMContentLoaded', function() {
    fetch('monitor-grupos.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const tableBody = document.querySelector('.table-body');

                data.students.forEach(student => {
                    const row = document.createElement('tr');
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
                                    '${student.nombre_tutor}',
                                    '${student.telefono}',
                                    '${student.correo_electronico}',
                                    '${student.nombre_persona_confianza}',
                                    '${student.telefono_persona_confianza}',
                                    '${student.dni_persona_confianza}'
                                )">
                                + info
                            </button>
                        </td>
                    `;
                    tableBody.appendChild(row);
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
        document.getElementById('dieta').textContent = selectedStudent.nombre_tutor; // Corregido: Mostrar el nombre del tutor
        document.getElementById('alergias').textContent = selectedStudent.telefono; // Corregido: Mostrar el teléfono del tutor
        document.getElementById('tutor').textContent = selectedStudent.correo_electronico; // Corregido: Mostrar el correo del tutor

        // Mostrar información de la persona de confianza
        document.getElementById('nombre-persona-confianza').textContent = selectedStudent.nombre_persona_confianza;
        document.getElementById('telefono-persona-confianza').textContent = selectedStudent.telefono_persona_confianza;
        document.getElementById('dni-persona-confianza').textContent = selectedStudent.dni_persona_confianza;

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
        window.history.replaceState(null, "", "../../web/home/index.html");

        // Redirigir instantáneamente
        window.location.href = "../../web/home/index.html";
    });

    // Si el usuario cerró sesión, evitar que vuelva atrás instantáneamente
    if (sessionStorage.getItem("cerrado") === "true" && 
        !sessionStorage.getItem("usuario") && 
        !localStorage.getItem("usuario")) {
        
        sessionStorage.removeItem("cerrado"); // Evitar bucles infinitos

        // Reemplazar la entrada actual en el historial para bloquear el "Atrás"
        window.history.replaceState(null, "", "../../web/home/index.html");

        // Redirigir instantáneamente sin recargar
        window.location.replace("../../web/home/login.html");
    }

    // Evitar que el usuario vuelva atrás sin recargar
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
        if (!sessionStorage.getItem("usuario") && !localStorage.getItem("usuario")) {
            window.history.replaceState(null, "", "../../web/home/index.html");
            window.location.replace("../../web/home/index.html");
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