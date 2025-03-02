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
if ($conexion->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Error de conexión con la base de datos']);
    exit;
}

// Verificar que se reciban los datos necesarios
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
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

// Recoger los datos del formulario
$id_nino = $_POST['id_hijo'] ?? ''; // ID del niño/a
$alergias = $_POST['alergias'] ?? ''; // Contenido del textarea

// Validar que los datos no estén vacíos
if (empty($id_nino) || empty($alergias)) {
    echo json_encode(['status' => 'error', 'message' => 'Datos incompletos']);
    exit;
}

// Actualizar las alergias o condiciones del niño/a usando consultas preparadas
$queryActualizarAlergias = "UPDATE hijo 
                            SET alergias = ?
                            WHERE id_hijo = ?";
$stmt = $conexion->prepare($queryActualizarAlergias);

if (!$stmt) {
    echo json_encode(['status' => 'error', 'message' => 'Error en la preparación de la consulta: ' . $conexion->error]);
    exit;
}

// Vincular los parámetros a la consulta
$stmt->bind_param("si", $alergias, $id_nino);

// Ejecutar la consulta
if (!$stmt->execute()) {
    echo json_encode(['status' => 'error', 'message' => 'Error al actualizar las alergias: ' . $stmt->error]);
    exit;
}

// Éxito
echo json_encode(['status' => 'success', 'message' => 'Información actualizada correctamente']);

// Cerrar la consulta y la conexión
$stmt->close();
$conexion->close();
?>