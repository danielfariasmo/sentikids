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

// Recoger y sanitizar los datos del formulario
$id_nino = mysqli_real_escape_string($conexion, $_POST['id_hijo']); // ID del niño/a
$alergias = mysqli_real_escape_string($conexion, $_POST['alergias']); // Contenido del texatrea

// Actualizar las alergias o condiciones del niño/a
$queryActualizarAlergias = "UPDATE hijo 
                            SET alergias = '$alergias'
                            WHERE id_hijo = '$id_nino'";

if (!mysqli_query($conexion, $queryActualizarAlergias)) {
    echo json_encode(['status' => 'error', 'message' => 'Error al actualizar las alergias: ' . mysqli_error($conexion)]);
    exit;
}

echo json_encode(['status' => 'success', 'message' => 'Información actualizada correctamente']);

// Cerrar la conexión
mysqli_close($conexion);
?>