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
    exit;
}

// Obtener el ID del monitor desde la sesión
$id_monitor = $_SESSION['id_usuario'];

// Obtener el grupo del monitor
$queryGrupo = "SELECT id_grupo FROM grupo WHERE id_monitor = ?";
$stmt = $conexion->prepare($queryGrupo);
$stmt->bind_param("i", $id_monitor);
$stmt->execute();
$resultGrupo = $stmt->get_result();

if ($resultGrupo->num_rows > 0) {
    $rowGrupo = $resultGrupo->fetch_assoc();
    $id_grupo = $rowGrupo['id_grupo'];

    // Consultar los datos de los niños del grupo
    $query = "SELECT h.nombre, h.apellidos, t.nombre AS nombre_tutor, t.telefono, t.correo_electronico 
              FROM hijo h 
              JOIN tutor t ON h.id_tutor = t.id_tutor 
              WHERE h.id_grupo = ?";
    
    $stmt = $conexion->prepare($query);
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
} else {
    echo json_encode(['status' => 'error', 'message' => 'No se encontró un grupo asignado al monitor']);
}
// Verificar si hay una sesión activa y si el usuario es un monitor
if (isset($_SESSION['id_usuario']) && $_SESSION['rol'] === 'monitor') {
    $id_monitor = $_SESSION['id_usuario'];

    // Consulta para obtener el nombre y apellidos del monitor
    $query = "SELECT nombre, apellidos FROM monitor WHERE id_monitor = '$id_monitor'";
    $result = mysqli_query($conexion, $query);

    if ($result && mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        echo json_encode([
            'status' => 'success', 
            'nombre' => $row['nombre'], 
            'apellidos' => $row['apellidos']
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No se encontró el monitor']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Sesión no válida o usuario no es monitor']);
}

$stmt->close();
$conexion->close();
?>
