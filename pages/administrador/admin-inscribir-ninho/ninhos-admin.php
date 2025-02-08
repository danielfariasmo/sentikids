<?php

include '../../../server/database.php';

// Selecciono datos de tutor.
$query = "SELECT * FROM hijo";
$result = mysqli_query($connection, $query) or die ('Query de busqueda no funciono' . mysqli_error($connection));

// Envio datos al js.
$json = array();
while ($row = mysqli_fetch_array($result)) {
    $json[] = array (
        'id_hijo' => $row ['id_tutor'],
        'nombre' => $row ['nombre'],
        'apellidos' => $row ['apellidos'], 
        'fecha_nacimiento' => $row ['fecha_nacimiento'],
        'dieta' => $row ['dieta'],
        'alergias' => $row ['alergias'],
        'id_grupo' => $row ['id_grupo'],
        'id_tutor' => $row ['id_tutor']
    );
}

$jsonString = json_encode($json);
echo $jsonString;