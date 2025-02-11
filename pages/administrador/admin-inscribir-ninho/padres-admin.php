<?php

include '../../../server/database.php';

if (isset($_POST['id_hijo'])) {
    $id_hijo = $_POST['id_hijo'];

    // Sentencia SQL
    $query = "SELECT t.* FROM tutor t INNER JOIN hijo h ON t.id_tutor = h.id_tutor WHERE h.id_hijo = $id_hijo;";
    $result = mysqli_query($connection, $query)  or die('Query de busqueda no funciono' . mysqli_error($connection));;

    // Envio datos al js.
    $json = array();
    while ($row = mysqli_fetch_array($result)) {
        $json[] = array(
            'nombre' => $row['nombre'],
            'apellidos' => $row['apellidos'],
            'correo_electronico' => $row['correo_electronico'],
            'telefono' => $row['telefono']
        );
    }

    $jsonString = json_encode($json);
    echo $jsonString;
}
