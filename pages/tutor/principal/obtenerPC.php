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

// Consulta para obtener las personas de confianza
$sql = "SELECT id_tutor, nombre, apellidos, telefono FROM persona_confianza WHERE id_tutor = '$id_tutor'";
$result = $conexion->query($sql);

if (!$result) {
    echo json_encode(['status' => 'error', 'message' => 'Error en la consulta SQL']);
    exit;
}

$trusted = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $trusted[] = $row;
    }
}

$conexion->close();

// Devolver la información en formato JSON
echo json_encode([
    'status' => 'success',
    'data' => $trusted
]);
?>