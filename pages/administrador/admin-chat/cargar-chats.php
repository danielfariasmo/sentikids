<?php
// Conexión a la base de datos
include '../../../server/database.php'; // Ruta correcta a tu archivo de conexión

// Verificar conexión
if (!$connection) {
    echo json_encode(['error' => 'Error de conexión a la base de datos.']);
    exit;
}

// Obtener el ID y rol del usuario actual desde la sesión
session_start();
if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(['error' => 'Sesión no válida']);
    exit;
}
$id_usuario = $_SESSION['id_usuario'];
$rol_usuario = $_SESSION['rol'];

// Consulta para obtener el último mensaje de cada chat activo (sin duplicados)
$sql = "
    SELECT 
        MAX(m.id) AS id_chat,  -- Obtener el ID del último mensaje
        m.mensaje, 
        m.fecha, 
        CASE
            WHEN m.rol_destinatario = 'administrador' THEN CONCAT(a.nombre, ' ', a.apellidos)
            WHEN m.rol_destinatario = 'monitor' THEN CONCAT(c.nombre, ' ', c.apellidos)
            WHEN m.rol_destinatario = 'tutor' THEN CONCAT(t.nombre, ' ', t.apellidos)
        END AS destinatario_nombre,
        m.rol_destinatario,
        m.id_destinatario
    FROM mensajes m
    LEFT JOIN administrador a ON m.id_destinatario = a.id_administrador AND m.rol_destinatario = 'administrador'
    LEFT JOIN monitor c ON m.id_destinatario = c.id_monitor AND m.rol_destinatario = 'monitor'
    LEFT JOIN tutor t ON m.id_destinatario = t.id_tutor AND m.rol_destinatario = 'tutor'
    WHERE m.id_remitente = ? 
    GROUP BY m.id_destinatario, m.rol_destinatario
    ORDER BY m.fecha DESC";  // Ordenar por fecha para que el último mensaje aparezca primero

// Ejecutar la consulta
$stmt = mysqli_prepare($connection, $sql);
mysqli_stmt_bind_param($stmt, 'i', $id_usuario);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

// Verificar si hay resultados
if (!$result) {
    echo json_encode(['error' => 'Error en la consulta: ' . mysqli_error($connection)]);
    exit;
}

$chats = [];
while ($row = mysqli_fetch_assoc($result)) {
    // Obtener los datos de los chats
    $chats[] = [
        'id_chat' => $row['id_chat'],
        'rol_chat' => $row['rol_destinatario'],
        'mensaje' => $row['mensaje'],
        'fecha' => $row['fecha'],
        'nombre' => $row['destinatario_nombre'],
    ];
}

// Devolver los chats en formato JSON
echo json_encode($chats);

// Cerrar la conexión
mysqli_close($connection);
?>
