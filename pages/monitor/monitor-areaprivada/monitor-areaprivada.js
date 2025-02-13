// Función para obtener el nombre y apellidos del monitor
function obtenerNombreMonitor() {
    fetch('monitor-areaprivada.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Actualizar el texto en el HTML con el nombre y apellidos del monitor
                document.getElementById('nombre_tutor').textContent = `${data.nombre} ${data.apellidos}`;
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch(error => console.error('Error al obtener los datos del monitor:', error));
}

// Ejecutar la función cuando la página cargue
window.onload = obtenerNombreMonitor;
