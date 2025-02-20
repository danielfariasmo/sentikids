<?php
// Configuración de la base de datos
$servidor = "localhost";
$usuarioBD = "root";
$password = "";
$db = "sentikids";

// Crear conexión
$conn = new mysqli($servidor, $usuarioBD, $password, $db);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Iniciar sesión para obtener el ID del tutor (asumiendo que el tutor está logueado)
session_start();
if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["status" => "error", "message" => "Tutor no autenticado"]);
    exit;
}

$id_tutor = $_SESSION['id_usuario'];

// Función para obtener datos del tutor
function obtenerDatosTutor($conn, $id_tutor) {
    $sql = "SELECT nombre, apellidos, dni, correo_electronico, telefono, nombre_usuario FROM tutor WHERE id_tutor = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id_tutor);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_assoc();
}

// Función para obtener los hijos del tutor
function obtenerHijos($conn, $id_tutor) {
    $sql = "SELECT id_hijo, nombre FROM hijo WHERE id_tutor = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id_tutor);
    $stmt->execute();
    $result = $stmt->get_result();
    $hijos = [];
    while ($row = $result->fetch_assoc()) {
        $hijos[] = $row;
    }
    return $hijos;
}

// Función para obtener las personas de confianza del tutor
function obtenerPersonasConfianza($conn, $id_tutor) {
    $sql = "SELECT id_otro_tutor, nombre FROM persona_confianza WHERE id_tutor = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id_tutor);
    $stmt->execute();
    $result = $stmt->get_result();
    $personas = [];
    while ($row = $result->fetch_assoc()) {
        $personas[] = $row;
    }
    return $personas;
}

// Función para obtener las notificaciones del tutor
function obtenerNotificaciones($conn, $id_tutor) {
    $sql = "SELECT titulo, mensaje, fecha FROM notificacion WHERE id_tutor = ? ORDER BY fecha DESC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id_tutor);
    $stmt->execute();
    $result = $stmt->get_result();
    $notificaciones = [];
    while ($row = $result->fetch_assoc()) {
        $notificaciones[] = $row;
    }
    return $notificaciones;
}

// Obtener todos los datos
$tutor = obtenerDatosTutor($conn, $id_tutor);
$hijos = obtenerHijos($conn, $id_tutor);
$personasConfianza = obtenerPersonasConfianza($conn, $id_tutor);
$notificaciones = obtenerNotificaciones($conn, $id_tutor);

// Cerrar la conexión
$conn->close();

// Devolver los datos en formato JSON
echo json_encode([
    "status" => "success",
    "data" => [
        "tutor" => $tutor,
        "hijos" => $hijos,
        "personas_confianza" => $personasConfianza,
        "notificaciones" => $notificaciones
    ]
]);
?>