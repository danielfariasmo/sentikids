<?php

// Incluir la conexión a la base de datos
include '../../../server/database.php';

// Verificar si la conexión es válida
if (!$connection) {
    die(json_encode(["error" => "Error de conexión a la base de datos"]));
}

// Consulta segura con prepared statements
$query = "SELECT id_tutor, nombre, apellidos, dni, telefono, correo_electronico, alta FROM tutor";
$stmt = $connection->prepare($query);

if ($stmt) {
    $stmt->execute();
    $result = $stmt->get_result();

    // Construcción del array JSON
    $json = array();
    while ($row = $result->fetch_assoc()) {
        $json[] = $row;
    }

    // Devolver la respuesta en formato JSON
    echo json_encode($json, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

    // Cerrar la consulta y conexión
    $stmt->close();
} else {
    echo json_encode(["error" => "Error en la consulta SQL"]);
}

$connection->close();
