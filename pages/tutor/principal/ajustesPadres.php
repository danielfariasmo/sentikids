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
$email = $_POST['email'] ?? '';
$telefono = $_POST['tel'] ?? '';
$lastPassword = $_POST['lastPassword'] ?? '';
$newPassword = $_POST['password'] ?? '';

// Verificar si el usuario existe
$queryUsuario = "SELECT * FROM tutor WHERE id_tutor = ?";
$stmt = $conexion->prepare($queryUsuario);
$stmt->bind_param("i", $id_tutor);
$stmt->execute();
$resultUsuario = $stmt->get_result();

if ($resultUsuario->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'Usuario no encontrado']);
    exit;
}

// Obtener la contraseña actual del tutor
$usuario = $resultUsuario->fetch_assoc();
$clave_usuario_actual = $usuario['clave_usuario'];

// Actualizar información básica
$queryActualizar = "UPDATE tutor 
                    SET 
                        correo_electronico = ?, 
                        telefono = ?
                    WHERE id_tutor = ?";
$stmt = $conexion->prepare($queryActualizar);
$stmt->bind_param("ssi", $email, $telefono, $id_tutor);

if (!$stmt->execute()) {
    echo json_encode(['status' => 'error', 'message' => 'Error al actualizar la información: ' . $stmt->error]);
    exit;
}

// Cambiar contraseña (si se proporciona)
if (!empty($lastPassword) && !empty($newPassword)) {
    // Verificar la contraseña anterior usando password_verify
    if (!password_verify($lastPassword, $clave_usuario_actual)) {
        echo json_encode(['status' => 'error', 'message' => 'La contraseña anterior es incorrecta']);
        exit;
    }

    // Cifrar la nueva contraseña usando password_hash
    $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);

    // Actualizar la contraseña en la base de datos
    $queryCambiarPassword = "UPDATE tutor SET clave_usuario = ? WHERE id_tutor = ?";
    $stmt = $conexion->prepare($queryCambiarPassword);
    $stmt->bind_param("si", $newPasswordHash, $id_tutor);

    if (!$stmt->execute()) {
        echo json_encode(['status' => 'error', 'message' => 'Error al cambiar la contraseña: ' . $stmt->error]);
        exit;
    }
}

echo json_encode(['status' => 'success']);

// Cerrar la conexión
$conexion->close();
?>