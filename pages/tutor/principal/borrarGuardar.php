<?php
include "../../../server/database.php";

// Configuración de la base de datos
$servidor = "localhost";
$usuarioBD = "root";
$password = "";
$db = "sentikids";

session_start();

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

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['action'])) {
    $action = $data['action'];

    $conn = new mysqli($servidor, $usuarioBD, $password, $db);

    if ($conn->connect_error) {
        die(json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos.']));
    }

    if ($action === 'delete') {
        // Iniciar una transacción para asegurar la atomicidad
        $conn->begin_transaction();

        try {
            // 1. Borrar las notificaciones relacionadas con el tutor
            $sql_delete_notificaciones = "DELETE FROM notificacion WHERE id_tutor = ?";
            $stmt = $conn->prepare($sql_delete_notificaciones);
            $stmt->bind_param("i", $id_tutor);
            if (!$stmt->execute()) {
                throw new Exception("Error al borrar notificaciones: " . $stmt->error);
            }
            $stmt->close();

            // 2. Borrar los hijos del tutor
            $sql_delete_hijos = "DELETE FROM hijo WHERE id_tutor = ?";
            $stmt = $conn->prepare($sql_delete_hijos);
            $stmt->bind_param("i", $id_tutor);
            if (!$stmt->execute()) {
                throw new Exception("Error al borrar hijos: " . $stmt->error);
            }
            $stmt->close();

            // 3. Borrar las personas de confianza
            $sql_delete_pc = "DELETE FROM persona_confianza WHERE id_tutor = ?";
            $stmt = $conn->prepare($sql_delete_pc);
            $stmt->bind_param("i", $id_tutor);
            if (!$stmt->execute()) {
                throw new Exception("Error al borrar personas de confianza: " . $stmt->error);
            }
            $stmt->close();

            // 4. Borrar el tutor
            $sql_delete_tutor = "DELETE FROM tutor WHERE id_tutor = ?";
            $stmt = $conn->prepare($sql_delete_tutor);
            $stmt->bind_param("i", $id_tutor);
            if (!$stmt->execute()) {
                throw new Exception("Error al borrar tutor: " . $stmt->error);
            }
            $stmt->close();

            // Confirmar la transacción si todo está bien
            $conn->commit();
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            // Revertir la transacción en caso de error
            $conn->rollback();
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'No se ha especificado una acción.']);
}