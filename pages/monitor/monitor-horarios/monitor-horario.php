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
    $conexion = mysqli_connect($servidor, $usuarioBD, $password, $db);
    if (!$conexion) {
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

    // Consultar los horarios asociados al monitor
    $query = "SELECT h.url FROM horario h
            JOIN grupo g ON h.id_horario = g.id_horario
            WHERE g.id_monitor = $id_monitor";
    $result = mysqli_query($conexion, $query);

    if ($result && mysqli_num_rows($result) > 0) {
        $horarios = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $horarios[] = $row['url'];
        }
        echo json_encode(['status' => 'success', 'horarios' => $horarios]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No se encontraron horarios']);
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

    // Cerrar la conexión
    mysqli_close($conexion);
?>