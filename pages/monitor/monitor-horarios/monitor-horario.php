<?php
session_start();
header("Content-Type: application/json");

// Incluye el archivo de conexión a la base de datos
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

// Verificar si el usuario está logueado y es un monitor
if (!isset($_SESSION['id_usuario']) || $_SESSION['rol'] !== 'monitor') {
    echo json_encode(['status' => 'error', 'message' => 'Acceso no autorizado']);
    mysqli_close($conexion);
    exit;
}

// Obtener el ID del monitor desde la sesión
$id_monitor = intval($_SESSION['id_usuario']); // Validar que sea un número entero

// Consultar los horarios asociados al monitor usando consultas preparadas
$query = "SELECT g.horario_url FROM grupo g WHERE g.id_monitor = ?";
$stmt = mysqli_prepare($conexion, $query);

if (!$stmt) {
    echo json_encode(['status' => 'error', 'message' => 'Error en la preparación de la consulta']);
    mysqli_close($conexion);
    exit;
}

mysqli_stmt_bind_param($stmt, "i", $id_monitor);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if ($result && mysqli_num_rows($result) > 0) {
    $horarios = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $horarios[] = $row['horario_url'];
    }
    echo json_encode(['status' => 'success', 'horarios' => $horarios]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No se encontraron horarios']);
}

// Cerrar la declaración y la conexión
mysqli_stmt_close($stmt);
mysqli_close($conexion);
?>