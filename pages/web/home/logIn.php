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
if (!isset($_POST['funcion']) || $_POST['funcion'] !== 'validando' || !isset($_POST['usuario']) || !isset($_POST['contra'])) {
    echo json_encode(['status' => 'error', 'message' => 'Datos incompletos']);
    exit;
}

$usuario = mysqli_real_escape_string($conexion, $_POST['usuario']);
$contra = mysqli_real_escape_string($conexion, $_POST['contra']);

// Consultar si el usuario es administrador
$queryAdministrador = "SELECT * FROM administrador WHERE nombre_usuario = '$usuario' AND clave_usuario = '$contra'";
$resultAdministrador = mysqli_query($conexion, $queryAdministrador);

// Consultar si el usuario es monitor
$queryMonitor = "SELECT * FROM monitor WHERE nombre_usuario = '$usuario' AND clave_usuario = '$contra'";
$resultMonitor = mysqli_query($conexion, $queryMonitor);

// Consultar si el usuario es tutor
$queryTutor = "SELECT * FROM tutor WHERE nombre_usuario = '$usuario' AND clave_usuario = '$contra'";
$resultTutor = mysqli_query($conexion, $queryTutor);

if ($resultAdministrador && mysqli_num_rows($resultAdministrador) > 0) {
    echo json_encode(['status' => 'success', 'message' => 'Bienvenido Administrador/a', 'role' => 'administrador', 'usuario' => $usuario]);
} elseif ($resultMonitor && mysqli_num_rows($resultMonitor) > 0) {
    echo json_encode(['status' => 'success', 'message' => 'Bienvenido Monitor/a', 'role' => 'monitor', 'usuario' => $usuario]);
} elseif ($resultTutor && mysqli_num_rows($resultTutor) > 0) {
    echo json_encode(['status' => 'success', 'message' => 'Bienvenido Tutor/a', 'role' => 'tutor', 'usuario' => $usuario]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Usuario o contraseña incorrectos']);
}

// Cerrar la conexión
mysqli_free_result($resultAdministrador);
mysqli_free_result($resultMonitor);
mysqli_free_result($resultTutor);
mysqli_close($conexion);
?>
