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

// Obtener el ID del chat seleccionado
if (!isset($_GET['id_chat'])) {
    echo json_encode(['error' => 'ID de chat no válido']);
    exit;
}
$id_chat = $_GET['id_chat'];

// Consulta para obtener todos los mensajes del chat seleccionado
$sql = "
    SELECT 
        m.mensaje, 
        m.fecha, 
        CASE
            WHEN m.id_remitente = ? THEN 'Tú'  // Mensajes enviados por el usuario actual
            WHEN m.rol_destinatario = 'administrador' THEN CONCAT(a.nombre, ' ', a.apellidos)
            WHEN m.rol_destinatario = 'monitor' THEN CONCAT(c.nombre, ' ', c.apellidos)
            WHEN m.rol_destinatario = 'tutor' THEN CONCAT(t.nombre, ' ', t.apellidos)
        END AS nombre_remitente
    FROM mensajes m
    LEFT JOIN administrador a ON m.id_destinatario = a.id_administrador AND m.rol_destinatario = 'administrador'
    LEFT JOIN monitor c ON m.id_destinatario = c.id_monitor AND m.rol_destinatario = 'monitor'
    LEFT JOIN tutor t ON m.id_destinatario = t.id_tutor AND m.rol_destinatario = 'tutor'
    WHERE (m.id_remitente = ? AND m.id_destinatario = ?)
    OR (m.id_remitente = ? AND m.id_destinatario = ?)
    ORDER BY m.fecha ASC";  // Mostrar los mensajes en orden ascendente

// Ejecutar la consulta
$stmt = mysqli_prepare($connection, $sql);
mysqli_stmt_bind_param($stmt, 'iiii', $id_usuario, $id_chat, $id_chat, $id_usuario);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

// Verificar si hay resultados
if (!$result) {
    echo json_encode(['error' => 'Error en la consulta: ' . mysqli_error($connection)]);
    exit;
}

$messages = [];
while ($row = mysqli_fetch_assoc($result)) {
    $messages[] = [
        'mensaje' => $row['mensaje'],
        'fecha' => $row['fecha'],
        'nombre' => $row['nombre_remitente']  // Cambiado a 'nombre_remitente'
    ];
}

// Devolver los mensajes como JSON
echo json_encode($messages);

// Cerrar la conexión
mysqli_close($connection);
?>