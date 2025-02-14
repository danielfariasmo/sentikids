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

    // Consulta para obtener el nombre y apellidos del monitor
    $query = "SELECT nombre, apellidos FROM monitor WHERE id_monitor = $id_monitor";
    $result = mysqli_query($conexion, $query);

    if ($result && mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        echo json_encode([
            'status' => 'success', 
            'nombre' => $row['nombre'], 
            'apellidos' => $row['apellidos']
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No se encontró el monitor']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Sesión no válida o usuario no es monitor']);
}

// Cerrar la conexión
mysqli_close($conexion);
?>