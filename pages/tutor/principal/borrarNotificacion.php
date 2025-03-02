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
    echo json_encode(['success' => false, 'message' => 'No autenticado']);
    exit;
}

// Verificar el rol del usuario (opcional, dependiendo de tu lógica)
$rol = $_SESSION['rol'];
if ($rol !== 'tutor') {
    echo json_encode(['success' => false, 'message' => 'Acceso denegado']);
    exit;
}

// Obtener los datos enviados por POST
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['action']) && $data['action'] === 'delete_notificacion' && isset($data['id_notificacion'])) {
    $id_notificacion = $data['id_notificacion'];

    // Conectar a la base de datos
    $conn = new mysqli($servidor, $usuarioBD, $password, $db);

    // Verificar la conexión
    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos: ' . $conn->connect_error]);
        exit;
    }

    // Eliminar la notificación
    $sql_delete_notificacion = "DELETE FROM notificacion WHERE id_notificacion = ?";
    $stmt = $conn->prepare($sql_delete_notificacion);

    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Error en la preparación de la consulta: ' . $conn->error]);
        exit;
    }

    $stmt->bind_param('i', $id_notificacion);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Notificación eliminada correctamente.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al eliminar la notificación: ' . $stmt->error]);
    }

    // Cerrar la conexión
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Datos inválidos.']);
}
?>