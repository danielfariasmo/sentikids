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

// Base de la consulta: obtener la información de los hijos del tutor
$queryHijo = "
    SELECT 
        h.nombre AS nombre_hijo,
        h.apellidos AS apellidos_hijo,
        h.alergias,
        g.nombre AS grupo,
        m.nombre AS nombre_monitor,
        m.correo_electronico AS correo_monitor,
        g.fotos_url AS fotos_grupo_url,
        g.horario_url AS horario_grupo_url
    FROM hijo h
    LEFT JOIN grupo g ON h.id_grupo = g.id_grupo
    LEFT JOIN monitor m ON g.id_monitor = m.id_monitor
    WHERE h.id_tutor = '$id_tutor'
";

// Si se ha pasado el parámetro 'nombre', agregarlo a la condición
if (isset($_GET['nombre'])) {
    $nombre = mysqli_real_escape_string($conexion, $_GET['nombre']);
    $queryHijo .= " AND h.nombre = '$nombre'";
}

$resultHijo = mysqli_query($conexion, $queryHijo);

if (!$resultHijo) {
    echo json_encode(['status' => 'error', 'message' => 'Error al consultar la información del hijo']);
    exit;
}

// Obtener la información del hijo como un array asociativo
$hijo = mysqli_fetch_assoc($resultHijo);

if (!$hijo) {
    echo json_encode(['status' => 'error', 'message' => 'No se encontró información del hijo']);
    exit;
}

// Verificar si los campos relacionados con el grupo están vacíos y asignar "no asignado" en su lugar
$grupo = empty($hijo['grupo']) ? 'no asignado' : $hijo['grupo'];
$nombre_monitor = empty($hijo['nombre_monitor']) ? 'no asignado' : $hijo['nombre_monitor'];
$correo_monitor = empty($hijo['correo_monitor']) ? 'no asignado' : $hijo['correo_monitor'];
$fotos_grupo_url = empty($hijo['fotos_grupo_url']) ? 'no asignado' : $hijo['fotos_grupo_url'];
$horario_grupo_url = empty($hijo['horario_grupo_url']) ? 'no asignado' : $hijo['horario_grupo_url'];

// Devolver la información del hijo en formato JSON
echo json_encode([
    'status' => 'success',
    'data' => [
        'nombreHijo' => $hijo['nombre_hijo'],
        'apellidos' => $hijo['apellidos_hijo'],
        'alergias' => $hijo['alergias'],
        'grupo' => $grupo,
        'monitor' => [
            'nombre' => $nombre_monitor,
            'correo' => $correo_monitor
        ],
        'fotosGrupoUrl' => $fotos_grupo_url,
        'horarioUrl' => $horario_grupo_url
    ]
]);

// Cerrar la conexión
mysqli_close($conexion);
?>