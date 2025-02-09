<?php
include "../../../server/database.php";

//conf base de datos
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
        $conn = new mysqli($servidor, $usuarioBD, $password, $db);

        if ($conn->connect_error) {
            die(json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos.']));
        }

        //borrar los hijos del tutor
        $sql_delete_hijos = "DELETE FROM hijo WHERE id_tutor = $id_tutor";
        $conn->query($sql_delete_hijos);

        //borrar las personas de confianza
        $sql_delete_pc = "DELETE FROM persona_confianza WHERE id_tutor = $id_tutor";
        $conn->query($sql_delete_pc);

        //borrar el tutor
        $sql_delete_tutor = "DELETE FROM tutor WHERE id_tutor = $id_tutor";
        if ($conn->query($sql_delete_tutor) === TRUE) {
            echo json_encode(['success' => true, 'message' => 'Cuenta borrada correctamente.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al borrar la cuenta.']);
        }
    }
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'No se ha especificado una acción.']);
}
