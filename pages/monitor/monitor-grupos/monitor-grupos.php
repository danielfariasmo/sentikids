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

// Verificar que el usuario esté autenticado y sea un monitor
if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'monitor' || !isset($_SESSION['id_grupo'])) {
    echo json_encode(['status' => 'error', 'message' => 'Acceso no autorizado']);
    exit;
}

$id_grupo = $_SESSION['id_grupo'];

// Consultar los datos de los niños del grupo
$query = "SELECT h.nombre, h.apellidos, t.nombre AS nombre_tutor, t.telefono, t.correo_electronico 
          FROM hijo h 
          JOIN tutor t ON h.id_tutor = t.id_tutor 
          WHERE h.id_grupo = $id_grupo";
$result = mysqli_query($conexion, $query);

if ($result && mysqli_num_rows($result) > 0) {
    $students = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $students[] = $row;
    }
    echo json_encode(['status' => 'success', 'students' => $students]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No se encontraron estudiantes en este grupo']);
}

// Cerrar la conexión
mysqli_free_result($result);
mysqli_close($conexion);
?>