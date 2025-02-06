<?php

include '../../../server/database.php';

// Selecciono datos de tutor.
$query = "SELECT id_tutor, nombre, apellidos, dni, telefono, correo_electronico FROM tutor";
$result = mysqli_query($connection, $query) or die ('Query de busqueda no funciono' . mysqli_error($connection));

// Envio datos al js.
$json = array();
while ($row = mysqli_fetch_array($result)) {
    $json[] = array (
        'id_tutor' => $row ['id_tutor'],
        'nombre' => $row ['nombre'],
        'apellidos' => $row ['apellidos'], 
        'dni' => $row ['dni'],
        'telefono' => $row ['telefono'],
        'correo_electronico' => $row ['correo_electronico']
    );
}

$jsonString = json_encode($json);
echo $jsonString;