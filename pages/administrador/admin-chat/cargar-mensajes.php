<?php
// Conexión a la base de datos
include '../../../server/database.php'; // Ruta correcta a tu archivo de conexión

// Verificar conexión
if (!$connection) {
    echo json_encode(['error' => 'Error de conexión a la base de datos.']);
    exit;
}

// Iniciar sesión y obtener los datos del usuario actual
session_start();
if (isset($_SESSION['id_usuario'])) {
    $id_remitente = $_SESSION['id_usuario'];  // Obtener el id del usuario actual desde la sesión
    $rol_remitente = $_SESSION['rol'];        // Obtener el rol del usuario actual desde la sesión
} else {
    echo json_encode(['error' => 'Sesión no válida']);
    exit;
}

// Obtener el destinatario (puedes pasar el id_destinatario y rol_destinatario)
$id_destinatario = isset($_GET['id_destinatario']) ? $_GET['id_destinatario'] : '';
$rol_destinatario = isset($_GET['rol_destinatario']) ? $_GET['rol_destinatario'] : '';

// Asegúrate de que ambos parámetros estén definidos
if ($id_destinatario && $rol_destinatario) {
    // Consulta preparada para obtener los mensajes donde el remitente o destinatario sea el usuario actual o el destinatario
    $query = "SELECT * FROM mensajes 
              WHERE (id_remitente = ? AND rol_remitente = ? AND id_destinatario = ? AND rol_destinatario = ?) 
              OR (id_remitente = ? AND rol_remitente = ? AND id_destinatario = ? AND rol_destinatario = ?) 
              ORDER BY fecha ASC";
    
    $stmt = mysqli_prepare($connection, $query);
    mysqli_stmt_bind_param($stmt, 'ssssssss', 
        $id_remitente, $rol_remitente, $id_destinatario, $rol_destinatario,
        $id_destinatario, $rol_destinatario, $id_remitente, $rol_remitente
    );
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    // Verificar si hay errores en la consulta
    if (!$result) {
        echo json_encode(['error' => 'Error en la consulta: ' . mysqli_error($connection)]);
        exit;
    }

    // Verificar si hay mensajes
    if (mysqli_num_rows($result) > 0) {
        $messages = [];
        while ($row = mysqli_fetch_assoc($result)) {
            // Determinar quién es el remitente
            $is_current_user = ($row['id_remitente'] == $id_remitente && $row['rol_remitente'] == $rol_remitente);

            $messages[] = [
                'mensaje' => $row['mensaje'],
                'fecha' => $row['fecha'],
                'rol_remitente' => $row['rol_remitente'],
                'id_remitente' => $row['id_remitente'],
                'enviado_por' => $is_current_user ? 'Tú' : 'Remitente', // Agregar quien lo envió
            ];
        }

        echo json_encode($messages, JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode([]);
    }
} else {
    echo json_encode(['error' => 'Faltan datos para cargar los mensajes.']);
}

// Cerrar la conexión
mysqli_close($connection);
?>
