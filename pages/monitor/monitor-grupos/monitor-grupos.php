<?php
session_start();
header("Content-Type: application/json");

include "../../../server/database.php";

// Configuración de la base de datos
$servidor = "localhost";
$usuarioBD = "root";
$password = "";
$db = "sentikids";

// Conexión a la base de datos
$conexion = new mysqli($servidor, $usuarioBD, $password, $db);
if ($conexion->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Error de conexión con la base de datos']);
    exit;
}

// Verificar si el usuario está logueado y es un monitor
if (!isset($_SESSION['id_usuario']) || $_SESSION['rol'] !== 'monitor') {
    echo json_encode(['status' => 'error', 'message' => 'Acceso no autorizado']);
    $conexion->close();
    exit;
}

// Obtener el ID del monitor desde la sesión
$id_monitor = intval($_SESSION['id_usuario']); // Validar que sea un número entero

// Obtener el grupo del monitor
$queryGrupo = "SELECT id_grupo FROM grupo WHERE id_monitor = ?";
$stmtGrupo = $conexion->prepare($queryGrupo);

if (!$stmtGrupo) {
    echo json_encode(['status' => 'error', 'message' => 'Error en la preparación de la consulta']);
    $conexion->close();
    exit;
}

$stmtGrupo->bind_param("i", $id_monitor);
$stmtGrupo->execute();
$resultGrupo = $stmtGrupo->get_result();

if ($resultGrupo->num_rows > 0) {
    $rowGrupo = $resultGrupo->fetch_assoc();
    $id_grupo = $rowGrupo['id_grupo'];

    // Consultar los datos de los niños del grupo, incluyendo la persona de confianza
    $query = "SELECT h.nombre, h.apellidos, 
                     COALESCE(t.nombre, 'No disponible') AS nombre_tutor, 
                     COALESCE(t.telefono, 'No disponible') AS telefono, 
                     COALESCE(t.correo_electronico, 'No disponible') AS correo_electronico,
                     COALESCE(pc.nombre, 'No disponible') AS nombre_persona_confianza,
                     COALESCE(pc.telefono, 'No disponible') AS telefono_persona_confianza,
                     COALESCE(pc.dni, 'No disponible') AS dni_persona_confianza
              FROM hijo h 
              LEFT JOIN tutor t ON h.id_tutor = t.id_tutor 
              LEFT JOIN persona_confianza pc ON t.id_tutor = pc.id_tutor
              WHERE h.id_grupo = ?";
    
    $stmt = $conexion->prepare($query);

    if (!$stmt) {
        echo json_encode(['status' => 'error', 'message' => 'Error en la preparación de la consulta']);
        $stmtGrupo->close();
        $conexion->close();
        exit;
    }

    $stmt->bind_param("i", $id_grupo);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $students = [];
        while ($row = $result->fetch_assoc()) {
            $students[] = $row;
        }
        echo json_encode(['status' => 'success', 'students' => $students]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No se encontraron alumnos en este grupo']);
    }

    // Cerrar la declaración
    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'No se encontró un grupo asignado al monitor']);
}

// Cerrar la declaración y la conexión
$stmtGrupo->close();
$conexion->close();
?>