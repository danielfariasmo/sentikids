function cargarNombreMonitor() {
    const nombreUsuarioElement = document.getElementById("nombre_usuario");

    fetch("obtener_nombre_monitor.php", {
        method: "GET"
    })
    .then(response => {
        console.log("Estado de la respuesta:", response.status); // Depuración
        return response.json();
    })
    .then(data => {
        console.log("Respuesta del servidor:", data); // Ver la respuesta del servidor en la consola
        if (data.status === "success" && nombreUsuarioElement) {
            nombreUsuarioElement.textContent = `${data.nombre} ${data.apellidos}`;
        } else {
            console.error("Error al cargar el nombre del monitor:", data.message);
        }
    })
    .catch(error => {
        console.error("Error en la solicitud fetch:", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    cargarNombreMonitor(); // Cargar el nombre al iniciar la página
});
