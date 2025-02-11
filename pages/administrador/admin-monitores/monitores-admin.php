<?php

include '../../../server/database.php';

// Selecciono datos de monitor.
$query = "SELECT * FROM monitor";
$result = mysqli_query($connection, $query) or die ('Query de busqueda no funciono' . mysqli_error($connection));

// Envio datos al js.
$json = array();
while ($row = mysqli_fetch_array($result)) {
    $json[] = array (
        'id_monitor' => $row ['id_monitor'],
        'nombre' => $row ['nombre'],
        'apellidos' => $row ['apellidos'], 
        'telefono' => $row ['telefono'],
        'dni' => $row ['dni'],
        'correo_electronico' => $row ['correo_electronico']
    );
}

$jsonString = json_encode($json);
echo $jsonString;