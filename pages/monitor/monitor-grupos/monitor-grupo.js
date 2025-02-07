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
                    row.className = 'row';  // Mantener la clase para el estilo

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
                                    '${student.edad || 'No disponible'}',
                                    '${student.dieta || 'No especificado'}',
                                    '${student.alergias || 'No tiene'}',
                                    '${student.nombre_tutor}',
                                    '${student.telefono}',
                                    '${student.dni || 'No disponible'}',
                                    '${student.otroTutor || 'No registrado'}',
                                    '${student.telefonoOtro || 'No disponible'}',
                                    '${student.dniOtro || 'No disponible'}',
                                    '${student.relacion || 'No especificado'}'
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
        document.getElementById('edad').textContent = selectedStudent.edad;
        document.getElementById('dieta').textContent = selectedStudent.dieta;
        document.getElementById('alergias').textContent = selectedStudent.alergias;
        document.getElementById('tutor').textContent = selectedStudent.tutor;
        document.getElementById('telefono').textContent = selectedStudent.telefono;
        document.getElementById('dni').textContent = selectedStudent.dni;
        document.getElementById('otroTutor').textContent = selectedStudent.otroTutor;
        document.getElementById('telefonoOtro').textContent = selectedStudent.telefonoOtro;
        document.getElementById('dniOtro').textContent = selectedStudent.dniOtro;
        document.getElementById('relacion').textContent = selectedStudent.relacion;

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
