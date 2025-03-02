<?php
header("Content-Type: application/json");

// Incluir la conexión a la base de datos
include "../../../server/database.php";

// Configuración de la base de datos
$servidor = "localhost";
$usuarioBD = "root";
$password = "";
$db = "sentikids";

// Iniciar la sesión
session_start();

// Verificar si el usuario está autenticado
if (!isset($_SESSION['id_usuario']) || !isset($_SESSION['rol'])) {
    echo json_encode(['status' => 'error', 'message' => 'No autenticado']);
    exit;
}

// Verificar el rol del usuario (opcional, dependiendo de tu lógica)
$rol = $_SESSION['rol'];
if ($rol !== 'tutor') {
    echo json_encode(['status' => 'error', 'message' => 'Acceso denegado']);
    exit;
}

// Obtener el ID del hijo/a desde la URL
if (!isset($_GET['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'ID no proporcionado']);
    exit;
}

$id_hijo = $_GET['id'];

// Conectar a la base de datos
$conn = new mysqli($servidor, $usuarioBD, $password, $db);

// Verificar la conexión
if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Error de conexión a la base de datos: ' . $conn->connect_error]);
    exit;
}

// Eliminar niño/a
$sql_delete_hijo = "DELETE FROM hijo WHERE id_hijo = ?";
$stmt = $conn->prepare($sql_delete_hijo);

if (!$stmt) {
    echo json_encode(['status' => 'error', 'message' => 'Error en la preparación de la consulta: ' . $conn->error]);
    exit;
}

$stmt->bind_param('i', $id_hijo);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Hijo/a eliminado/a correctamente.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error al eliminar hijo/a: ' . $stmt->error]);
}

// Cerrar la conexión
$stmt->close();
$conn->close();
?>