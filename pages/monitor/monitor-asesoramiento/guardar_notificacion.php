<?php
header("Content-Type: application/json");
include "../../../server/database.php"; 

// Conexión a la base de datos
$servidor = "localhost";
$usuarioBD = "root";
$password = "";
$db = "sentikids";

$conexion = mysqli_connect($servidor, $usuarioBD, $password, $db);
if (!$conexion) {
    echo json_encode(["status" => "error", "message" => "Error de conexión"]);
    exit;
}

// Obtener datos del JSON enviado
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Datos incorrectos"]);
    exit;
}

$recipient = $data["recipient"];
$title = $data["title"];
$message = $data["message"];
$fecha = date("Y-m-d");

// Buscar ID del tutor usando consultas preparadas
$queryTutor = "SELECT id_tutor FROM tutor WHERE CONCAT(nombre, ' ', apellidos) = ?";
$stmtTutor = mysqli_prepare($conexion, $queryTutor);

if (!$stmtTutor) {
    echo json_encode(["status" => "error", "message" => "Error en la preparación de la consulta"]);
    mysqli_close($conexion);
    exit;
}

mysqli_stmt_bind_param($stmtTutor, "s", $recipient);
mysqli_stmt_execute($stmtTutor);
$result = mysqli_stmt_get_result($stmtTutor);
$row = mysqli_fetch_assoc($result);

if (!$row) {
    echo json_encode(["status" => "error", "message" => "Tutor no encontrado"]);
    mysqli_stmt_close($stmtTutor);
    mysqli_close($conexion);
    exit;
}

$id_tutor = $row["id_tutor"];
$id_monitor = 1; // Cambia esto por el ID del monitor logueado

// Insertar notificación en la base de datos usando consultas preparadas
$queryInsert = "INSERT INTO notificacion (id_monitor, id_tutor, titulo, mensaje, fecha) VALUES (?, ?, ?, ?, ?)";
$stmtInsert = mysqli_prepare($conexion, $queryInsert);

if (!$stmtInsert) {
    echo json_encode(["status" => "error", "message" => "Error en la preparación de la consulta"]);
    mysqli_stmt_close($stmtTutor);
    mysqli_close($conexion);
    exit;
}

mysqli_stmt_bind_param($stmtInsert, "iisss", $id_monitor, $id_tutor, $title, $message, $fecha);

if (mysqli_stmt_execute($stmtInsert)) {
    echo json_encode(["status" => "success", "message" => "Notificación guardada"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al guardar"]);
}

// Cerrar las declaraciones y la conexión
mysqli_stmt_close($stmtTutor);
mysqli_stmt_close($stmtInsert);
mysqli_close($conexion);
?>