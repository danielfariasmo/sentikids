<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");
include "../../../server/database.php"; 

$servidor = "localhost";
$usuarioBD = "root";
$password = "";
$db = "sentikids";

$conexion = mysqli_connect($servidor, $usuarioBD, $password, $db);
if (!$conexion) {
    echo json_encode(['status' => 'error', 'message' => 'Error de conexión']);
    exit;
}

// Consulta para obtener notificaciones con el nombre del tutor
$query = "
    SELECT n.titulo, n.mensaje, n.fecha, CONCAT(t.nombre, ' ', t.apellidos) AS tutor 
    FROM notificacion n
    JOIN tutor t ON n.id_tutor = t.id_tutor
    ORDER BY n.fecha DESC
";
$result = mysqli_query($conexion, $query);

$notificaciones = [];
while ($row = mysqli_fetch_assoc($result)) {
    $notificaciones[] = $row;
}

echo json_encode($notificaciones);

mysqli_close($conexion);
?>