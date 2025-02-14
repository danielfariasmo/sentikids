<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    header("Content-Type: application/json");

    include "../../../server/database.php";

    $servidor = "localhost";
    $usuarioBD = "root";
    $password = "";
    $db = "sentikids";

    $conexion = mysqli_connect($servidor, $usuarioBD, $password, $db);
    if (!$conexion) {
        echo json_encode(['status' => 'error', 'message' => 'Error de conexión con la base de datos']);
        exit;
    }

    // Verifica si se recibieron los datos
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $recipient = trim($_POST["recipient"]);
        $message = trim($_POST["message"]);
        $fecha = date("Y-m-d"); // Fecha actual

        // ID del monitor (se debe obtener de la sesión del usuario logueado)
        session_start();
        if (!isset($_SESSION["id_usuario"])) {
            echo json_encode(['status' => 'error', 'message' => 'Monitor no autenticado']);
            exit;
        }
        $id_monitor = $_SESSION["id_usuario"];

        // Verificar que los campos no estén vacíos
        if (empty($recipient) || empty($message)) {
            echo json_encode(['status' => 'error', 'message' => 'Todos los campos son obligatorios']);
            exit;
        }

        // Obtener el id_tutor a partir del nombre
        $query = "SELECT id_tutor FROM tutor WHERE CONCAT(nombre, ' ', apellidos) = ?";
        $stmt = mysqli_prepare($conexion, $query);
        mysqli_stmt_bind_param($stmt, "s", $recipient);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        if ($row = mysqli_fetch_assoc($result)) {
            $id_tutor = $row["id_tutor"];

            // Insertar la notificación en la base de datos
            $insertQuery = "INSERT INTO notificacion (id_monitor, id_tutor, titulo, mensaje, fecha) VALUES (?, ?, 'Nueva Notificación', ?, ?)";
            $stmtInsert = mysqli_prepare($conexion, $insertQuery);
            mysqli_stmt_bind_param($stmtInsert, "iiss", $id_monitor, $id_tutor, $message, $fecha);

            if (mysqli_stmt_execute($stmtInsert)) {
                echo json_encode(['status' => 'success', 'message' => 'Notificación enviada correctamente']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Error al guardar la notificación']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Tutor no encontrado']);
        }

        mysqli_stmt_close($stmt);
        mysqli_stmt_close($stmtInsert);
    }

    mysqli_close($conexion);
?>
