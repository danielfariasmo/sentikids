<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

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

// Consulta para obtener notificaciones con el nombre del tutor
$query = "
    SELECT n.titulo, n.mensaje, n.fecha, CONCAT(t.nombre, ' ', t.apellidos) AS tutor 
    FROM notificacion n
    JOIN tutor t ON n.id_tutor = t.id_tutor
    ORDER BY n.fecha DESC
";

// Ejecutar la consulta
$result = mysqli_query($conexion, $query);

if (!$result) {
    echo json_encode(['status' => 'error', 'message' => 'Error al ejecutar la consulta']);
    mysqli_close($conexion);
    exit;
}

// Obtener los resultados
$notificaciones = [];
while ($row = mysqli_fetch_assoc($result)) {
    $notificaciones[] = $row;
}

// Devolver los resultados en formato JSON
echo json_encode($notificaciones);

// Cerrar la conexión
mysqli_close($conexion);
?>