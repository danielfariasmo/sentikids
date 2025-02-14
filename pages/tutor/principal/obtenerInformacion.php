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

// Consultar la información del hijo asociado al tutor
$queryHijo = "
    SELECT 
        h.nombre AS nombre_hijo,
        h.alergias,
        g.nombre AS grupo,
        m.nombre AS nombre_monitor,
        m.correo_electronico AS correo_monitor,
        g.fotos_url AS fotos_grupo_url,
        g.horario_url AS horario_grupo_url
    FROM hijo h
    JOIN grupo g ON h.id_grupo = g.id_grupo
    JOIN monitor m ON g.id_monitor = m.id_monitor
    WHERE h.id_tutor = '$id_tutor'
";

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

// Devolver la información del hijo en formato JSON
echo json_encode([
    'status' => 'success',
    'data' => [
        'nombreHijo' => $hijo['nombre_hijo'],
        'alergias' => $hijo['alergias'],
        'grupo' => $hijo['grupo'],
        'monitor' => [
            'nombre' => $hijo['nombre_monitor'],
            'correo' => $hijo['correo_monitor']
        ],
        'fotosGrupoUrl' => $hijo['fotos_grupo_url'],
        'horarioUrl' => $hijo['horario_grupo_url']
    ]
]);

// Cerrar la conexión
mysqli_close($conexion);
?>