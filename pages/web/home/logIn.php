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
$contra = $_POST['contra']; // No sanitizar la contraseña para evitar alteraciones

// Consultar si el usuario es administrador
$queryAdministrador = "SELECT id_administrador, clave_usuario FROM administrador WHERE nombre_usuario = '$usuario'";
$resultAdministrador = mysqli_query($conexion, $queryAdministrador);

// Consultar si el usuario es monitor
$queryMonitor = "SELECT id_monitor, clave_usuario FROM monitor WHERE nombre_usuario = '$usuario'";
$resultMonitor = mysqli_query($conexion, $queryMonitor);

// Consultar si el usuario es tutor
$queryTutor = "SELECT id_tutor, clave_usuario FROM tutor WHERE nombre_usuario = '$usuario'";
$resultTutor = mysqli_query($conexion, $queryTutor);

// Función para verificar el inicio de sesión
function verificarLogin($result, $conexion, $contra, $rol) {
    if ($result && mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        $hashContra = $row['clave_usuario'];

        // Verificar la contraseña
        if (password_verify($contra, $hashContra)) {
            $_SESSION['id_usuario'] = $row['id_' . $rol]; // Guardar el ID del usuario en la sesión
            $_SESSION['rol'] = $rol; // Guardar el rol en la sesión
            echo json_encode(['status' => 'success', 'message' => 'Bienvenido/a ' . ucfirst($rol), 'role' => $rol]);
            return true;
        }
    }
    return false;
}

// Verificar el inicio de sesión para cada rol
if (verificarLogin($resultAdministrador, $conexion, $contra, 'administrador')) {
    // Inicio de sesión exitoso como administrador
} elseif (verificarLogin($resultMonitor, $conexion, $contra, 'monitor')) {
    // Inicio de sesión exitoso como monitor
} elseif (verificarLogin($resultTutor, $conexion, $contra, 'tutor')) {
    // Inicio de sesión exitoso como tutor
} else {
    echo json_encode(['status' => 'error', 'message' => 'Usuario o contraseña incorrectos']);
}

// Cerrar la conexión
mysqli_free_result($resultAdministrador);
mysqli_free_result($resultMonitor);
mysqli_free_result($resultTutor);
mysqli_close($conexion);
?>