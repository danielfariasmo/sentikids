<?php
include '../../../server/database.php';

// Sentencia SQL preparada
$query = "SELECT grupo.id_grupo, grupo.id_monitor, grupo.nombre AS nombre_grupo, 
                 monitor.nombre AS nombre_monitor, monitor.apellidos AS apellidos_monitor
          FROM grupo
          INNER JOIN monitor ON grupo.id_monitor = monitor.id_monitor";

if ($stmt = $connection->prepare($query)) {
    // Ejecutar la consulta
    $stmt->execute();
    $result = $stmt->get_result();

    // Enviar datos al JS.
    $json = array();
    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
        $json[] = array(
            'id_grupo' => $row['id_grupo'],
            'id_monitor' => $row['id_monitor'],
            'nombre_grupo' => $row['nombre_grupo'],
            'nombre_monitor' => $row['nombre_monitor'],
            'apellidos_monitor' => $row['apellidos_monitor']
        );
    }

    // Convertir el array a formato JSON y enviarlo
    echo json_encode($json);

    // Cerrar la declaración preparada
    $stmt->close();
} else {
    echo "Error al preparar la consulta: " . $connection->error;
}
