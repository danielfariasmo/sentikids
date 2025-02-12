<?php

include '../../../server/database.php';

// Selecciono datos de tutor.
$query = "SELECT grupo.id_grupo, grupo.id_monitor, grupo.id_horario, grupo.nombre AS nombre_grupo, 
                 monitor.nombre AS nombre_monitor, monitor.apellidos AS apellidos_monitor
          FROM grupo
          INNER JOIN monitor ON grupo.id_monitor = monitor.id_monitor";

$result = mysqli_query($connection, $query) or die ('Query de búsqueda no funcionó: ' . mysqli_error($connection));

// Envio datos al js.
$json = array();
while ($row = mysqli_fetch_array($result)) {
    $json[] = array(
        'id_grupo' => $row['id_grupo'],
        'id_monitor' => $row['id_monitor'],
        'id_horario' => $row['id_horario'],
        'nombre_grupo' => $row['nombre_grupo'],
        'nombre_monitor' => $row['nombre_monitor'],
        'apellidos_monitor' => $row['apellidos_monitor']
    );
}

$jsonString = json_encode($json);
echo $jsonString;
