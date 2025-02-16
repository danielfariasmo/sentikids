<?php

include '../../../server/database.php';

// Verificar si la conexión es válida
if (!$connection) {
    die(json_encode(["error" => "Error de conexión a la base de datos"]));
}

// Verificar si se recibieron los parámetros necesarios
if (isset($_POST['id_tutor']) && isset($_POST['alta'])) {
    $id_tutor = $_POST['id_tutor'];
    $alta = strtoupper($_POST['alta']);

    // Consulta segura con prepared statements
    $query = "UPDATE tutor SET alta = ? WHERE id_tutor = ?";
    $stmt = $connection->prepare($query);

    if ($stmt) {
        // Vincular parámetros y ejecutar la consulta
        $stmt->bind_param("si", $alta, $id_tutor);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(["success" => "Tutor actualizado con éxito."]);
        } else {
            echo json_encode(["error" => "No se realizaron cambios o el tutor no existe."]);
        }

        // Cerrar la consulta
        $stmt->close();
    } else {
        echo json_encode(["error" => "Error en la consulta SQL"]);
    }
} else {
    echo json_encode(["error" => "Faltan parámetros"]);
}

// Cerrar la conexión
$connection->close();


