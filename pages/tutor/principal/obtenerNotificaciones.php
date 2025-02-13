<?php
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

// SESIÓN
session_start(); // Iniciar la sesión

// Verificar si el usuario está autenticado
if (!isset($_SESSION['id_usuario']) || !isset($_SESSION['rol'])) {
    echo json_encode(['status' => 'error', 'message' => 'No autenticado']);
    exit;
}

// Verificar el rol del usuario
$rol = $_SESSION['rol'];
if ($rol !== 'tutor') {
    echo json_encode(['status' => 'error', 'message' => 'Acceso denegado']);
    exit;
}

// Obtener el ID del tutor desde la sesión
$id_tutor = $_SESSION['id_usuario'];

// Consultar las notificaciones del tutor
$queryNotificaciones = "SELECT id_notificacion, titulo, mensaje, fecha FROM notificacion WHERE id_tutor = '$id_tutor'";
$resultNotificaciones = mysqli_query($conexion, $queryNotificaciones);

if (!$resultNotificaciones) {
    echo json_encode(['status' => 'error', 'message' => 'Error al consultar las notificaciones']);
    exit;
}

// Obtener las notificaciones como un array asociativo
$notificaciones = [];
while ($fila = mysqli_fetch_assoc($resultNotificaciones)) {
    $notificaciones[] = $fila;
}

// Devolver las notificaciones en formato JSON
echo json_encode(['status' => 'success', 'data' => $notificaciones]);

// Cerrar la conexión
mysqli_close($conexion);
?>