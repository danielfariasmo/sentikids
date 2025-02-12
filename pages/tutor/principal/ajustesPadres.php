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
// $nombre = mysqli_real_escape_string($conexion, $_POST['nombre']);
// $apellido = mysqli_real_escape_string($conexion, $_POST['apellidos']);
// $dni = mysqli_real_escape_string($conexion, $_POST['dni']);
$email = mysqli_real_escape_string($conexion, $_POST['email']);
$telefono = mysqli_real_escape_string($conexion, $_POST['tel']);
//$poblacion = mysqli_real_escape_string($conexion, $_POST['poblacion']);
//$usuario = mysqli_real_escape_string($conexion, $_POST['usuario']);
$lastPassword = mysqli_real_escape_string($conexion, $_POST['lastPassword'] ?? '');
$newPassword = mysqli_real_escape_string($conexion, $_POST['password'] ?? '');

// Verificar si el usuario existe
$queryUsuario = "SELECT * FROM tutor WHERE id_tutor = '$id_tutor'";
$resultUsuario = mysqli_query($conexion, $queryUsuario);

if (mysqli_num_rows($resultUsuario) === 0) {
    echo json_encode(['status' => 'error', 'message' => 'Usuario no encontrado']);
    exit;
}

// Actualizar información básica
$queryActualizar = "UPDATE tutor 
                    SET 
                        correo_electronico = '$email', 
                        telefono = '$telefono'
                    WHERE id_tutor = '$id_tutor'";

if (!mysqli_query($conexion, $queryActualizar)) {
    echo json_encode(['status' => 'error', 'message' => 'Error al actualizar la información: ' . mysqli_error($conexion)]);
    exit;
}

// Cambiar contraseña (si se proporciona)
if (!empty($lastPassword) && !empty($newPassword)) {
    $queryVerificarPassword = "SELECT * FROM tutor WHERE id_tutor = '$id_tutor' AND clave_usuario = '$lastPassword'";
    $resultVerificarPassword = mysqli_query($conexion, $queryVerificarPassword);

    if (mysqli_num_rows($resultVerificarPassword) === 0) {
        echo json_encode(['status' => 'error', 'message' => 'La contraseña anterior es incorrecta']);
        exit;
    }

    $queryCambiarPassword = "UPDATE tutor SET clave_usuario = '$newPassword' WHERE id_tutor = '$id_tutor'";
    if (!mysqli_query($conexion, $queryCambiarPassword)) {
        echo json_encode(['status' => 'error', 'message' => 'Error al cambiar la contraseña: ' . mysqli_error($conexion)]);
        exit;
    }
}

echo json_encode(['status' => 'success', 'message' => 'Datos actualizados correctamente']);

// Cerrar la conexión
mysqli_close($conexion);
?>
