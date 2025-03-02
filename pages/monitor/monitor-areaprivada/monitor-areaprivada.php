<?php
session_start(); // Iniciar la sesión
header("Content-Type: application/json");

include "../../../server/database.php";

// Configuración de la base de datos
$servidor = "localhost";
$usuarioBD = "root";
$password = "";
$db = "sentikids";

// Conexión a la base de datos
$conexion = mysqli_connect($servidor, $usuarioBD, $password, $db);
if (!$conexion) {
    echo json_encode(['status' => 'error', 'message' => 'Error de conexión con la base de datos']);
    exit;
}

// Verificar si hay una sesión activa y si el usuario es un monitor
if (isset($_SESSION['id_usuario']) && $_SESSION['rol'] === 'monitor') {
    $id_monitor = intval($_SESSION['id_usuario']); // Validar que sea un número entero

    // Consulta preparada para obtener el nombre y apellidos del monitor
    $query = "SELECT nombre, apellidos FROM monitor WHERE id_monitor = ?";
    $stmt = mysqli_prepare($conexion, $query);

    if ($stmt) {
        // Vincular el parámetro
        mysqli_stmt_bind_param($stmt, "i", $id_monitor);

        // Ejecutar la consulta
        mysqli_stmt_execute($stmt);

        // Vincular los resultados a variables
        mysqli_stmt_bind_result($stmt, $nombre, $apellidos);

        // Obtener los resultados
        if (mysqli_stmt_fetch($stmt)) {
            echo json_encode([
                'status' => 'success', 
                'nombre' => $nombre, 
                'apellidos' => $apellidos
            ]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No se encontró el monitor']);
        }

        // Cerrar la declaración
        mysqli_stmt_close($stmt);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error en la preparación de la consulta']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Sesión no válida o usuario no es monitor']);
}

// Cerrar la conexión
mysqli_close($conexion);
?>