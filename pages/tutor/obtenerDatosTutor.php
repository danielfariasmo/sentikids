
<?php
header("Content-Type: application/json");

include "../../server/database.php";

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

// Consultar los datos del tutor
$queryTutor = "SELECT nombre, apellidos, dni, correo_electronico, telefono, nombre_usuario, clave_usuario FROM tutor WHERE id_tutor = '$id_tutor'";
$resultTutor = mysqli_query($conexion, $queryTutor);

if (mysqli_num_rows($resultTutor) === 0) {
    echo json_encode(['status' => 'error', 'message' => 'Tutor no encontrado']);
    exit;
}

$tutor = mysqli_fetch_assoc($resultTutor);
echo json_encode(['status' => 'success', 'data' => $tutor]);

// Cerrar la conexión
mysqli_close($conexion);
?>