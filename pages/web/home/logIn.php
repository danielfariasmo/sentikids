<?php
session_start(); // Iniciar la sesión
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
if (!isset($_POST['funcion']) || $_POST['funcion'] !== 'validando' || !isset($_POST['usuario']) || !isset($_POST['contra'])) {
    echo json_encode(['status' => 'error', 'message' => 'Datos incompletos']);
    exit;
}

$usuario = mysqli_real_escape_string($conexion, $_POST['usuario']);
$contra = mysqli_real_escape_string($conexion, $_POST['contra']);

// Consultar si el usuario es administrador
$queryAdministrador = "SELECT id_administrador FROM administrador WHERE nombre_usuario = '$usuario' AND clave_usuario = '$contra'";
$resultAdministrador = mysqli_query($conexion, $queryAdministrador);

// Consultar si el usuario es monitor
$queryMonitor = "SELECT id_monitor FROM monitor WHERE nombre_usuario = '$usuario' AND clave_usuario = '$contra'";
$resultMonitor = mysqli_query($conexion, $queryMonitor);

// Consultar si el usuario es tutor
$queryTutor = "SELECT id_tutor FROM tutor WHERE nombre_usuario = '$usuario' AND clave_usuario = '$contra'";
$resultTutor = mysqli_query($conexion, $queryTutor);

if ($resultAdministrador && mysqli_num_rows($resultAdministrador) > 0) {
    $row = mysqli_fetch_assoc($resultAdministrador);
    $_SESSION['id_usuario'] = $row['id_administrador']; // Guardar el ID del administrador en la sesión
    $_SESSION['rol'] = 'administrador'; // Guardar el rol en la sesión
    echo json_encode(['status' => 'success', 'message' => 'Bienvenido Administrador/a', 'role' => 'administrador']);
} elseif ($resultMonitor && mysqli_num_rows($resultMonitor) > 0) {
    $row = mysqli_fetch_assoc($resultMonitor);
    $_SESSION['id_usuario'] = $row['id_monitor']; // Guardar el ID del monitor en la sesión
    $_SESSION['rol'] = 'monitor'; // Guardar el rol en la sesión
    echo json_encode(['status' => 'success', 'message' => 'Bienvenido Monitor/a', 'role' => 'monitor']);
} elseif ($resultTutor && mysqli_num_rows($resultTutor) > 0) {
    $row = mysqli_fetch_assoc($resultTutor);
    $_SESSION['id_usuario'] = $row['id_tutor']; // Guardar el ID del tutor en la sesión
    $_SESSION['rol'] = 'tutor'; // Guardar el rol en la sesión
    echo json_encode(['status' => 'success', 'message' => 'Bienvenido Tutor/a', 'role' => 'tutor']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Usuario o contraseña incorrectos']);
}

// Cerrar la conexión
mysqli_free_result($resultAdministrador);
mysqli_free_result($resultMonitor);
mysqli_free_result($resultTutor);
mysqli_close($conexion);
?>
