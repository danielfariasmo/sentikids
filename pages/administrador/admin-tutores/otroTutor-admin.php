<?php

include '../../../server/database.php';

// Verificar si la conexión es válida
if (!$connection) {
    die(json_encode(["error" => "Error de conexión a la base de datos"]));
}

// Verificar si se recibió 'id_tutor' por POST
if (isset($_POST['id_tutor'])) {
    $id_tutor = $_POST['id_tutor'];

    // Consulta segura con prepared statements
    $query = "SELECT nombre, apellidos, telefono, dni FROM persona_confianza WHERE id_tutor = ?";
    $stmt = $connection->prepare($query);

    if ($stmt) {
        // Vincular parámetro y ejecutar consulta
        $stmt->bind_param("i", $id_tutor); 
        $stmt->execute();
        $result = $stmt->get_result();

        // Construcción del array JSON
        $json = array();
        while ($row = $result->fetch_assoc()) {
            $json[] = $row;
        }

        // Devolver la respuesta en formato JSON
        echo json_encode($json, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        // Cerrar la consulta
        $stmt->close();
    } else {
        echo json_encode(["error" => "Error en la consulta SQL"]);
    }
} else {
    echo json_encode(["error" => "Parámetro 'id_tutor' no recibido"]);
}

// Cerrar la conexión
$connection->close();

