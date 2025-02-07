let selectedStudent = {};

function selectStudent(nombre, apellidos, edad, dieta, alergias, tutor, telefono, dni, otroTutor, telefonoOtro, dniOtro, relacion) {
    selectedStudent = { nombre, apellidos, edad, dieta, alergias, tutor, telefono, dni, otroTutor, telefonoOtro, dniOtro, relacion };
}

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
document.addEventListener('DOMContentLoaded', function() {
    // Realizar una solicitud AJAX para obtener los datos de los niños del grupo
    fetch('monitor-grupos.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const tableBody = document.querySelector('.table');
                data.students.forEach(student => {
                    const row = document.createElement('div');
                    row.className = 'row';
                    row.innerHTML = `
                        <div>${student.nombre}</div>
                        <div>${student.apellidos}</div>
                        <div>${student.nombre_tutor}</div>
                        <div>${student.telefono}</div>
                        <div>${student.correo_electronico}</div>
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
});