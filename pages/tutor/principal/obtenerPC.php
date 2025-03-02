<?php
header("Content-Type: application/json");

include "../../../server/database.php";

// Configuración de la base de datos
$servidor = "localhost";
$usuarioBD = "root";
$password = "";
$db = "sentikids";

// Conexión a la base de datos
$conexion = new mysqli($servidor, $usuarioBD, $password, $db);
if ($conexion->connect_errno) {
    echo json_encode(['status' => 'error', 'message' => 'Error de conexión con la base de datos: ' . $conexion->connect_error]);
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
$sql = "SELECT id_otro_tutor, nombre, apellidos, telefono FROM persona_confianza WHERE id_tutor = ?";
$stmt = $conexion->prepare($sql);

if (!$stmt) {
    echo json_encode(['status' => 'error', 'message' => 'Error en la preparación de la consulta: ' . $conexion->error]);
    exit;
}

// Vincular el parámetro (id_tutor) a la consulta
$stmt->bind_param("i", $id_tutor); // "i" indica que el parámetro es un entero

// Ejecutar la consulta
if (!$stmt->execute()) {
    echo json_encode(['status' => 'error', 'message' => 'Error al ejecutar la consulta: ' . $stmt->error]);
    exit;
}

// Obtener el resultado de la consulta
$result = $stmt->get_result();
$trusted = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $trusted[] = $row;
    }
}

// Cerrar la sentencia y la conexión
$stmt->close();
$conexion->close();

// Devolver la información en formato JSON
echo json_encode([
    'status' => 'success',
    'data' => $trusted
]);
?>