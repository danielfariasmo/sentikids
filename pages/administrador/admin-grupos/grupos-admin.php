<?php
include '../../../server/database.php';

// Selecciono datos de grupo y monitor.
$query = "SELECT grupo.id_grupo, grupo.id_monitor, grupo.nombre AS nombre_grupo, 
                 monitor.nombre AS nombre_monitor, monitor.apellidos AS apellidos_monitor
          FROM grupo
          INNER JOIN monitor ON grupo.id_monitor = monitor.id_monitor";

$result = mysqli_query($connection, $query) or die('Query de búsqueda no funcionó: ' . mysqli_error($connection));

// Envio datos al js.
$json = array();
while ($row = mysqli_fetch_array($result)) {
    $json[] = array(
        'id_grupo' => $row['id_grupo'],
        'id_monitor' => $row['id_monitor'],
        'nombre_grupo' => $row['nombre_grupo'],
        'nombre_monitor' => $row['nombre_monitor'],
        'apellidos_monitor' => $row['apellidos_monitor']
    );
}

$jsonString = json_encode($json);
echo $jsonString;
