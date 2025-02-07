<?php

include '../../../server/database.php';

if (isset($_POST['id_tutor'])) {
    $id_tutor = $_POST['id_tutor'];

    // Sentencia SQL
    $query = "SELECT * FROM persona_confianza WHERE id_tutor = $id_tutor;";
    $result = mysqli_query($connection, $query)  or die('Query de busqueda no funciono' . mysqli_error($connection));;

    // Envio datos al js.
    $json = array();
    while ($row = mysqli_fetch_array($result)) {
        $json[] = array(
            'nombre' => $row['nombre'],
            'apellidos' => $row['apellidos'],
            'telefono' => $row['telefono'],
            'dni' => $row['dni']
        );
    }

    $jsonString = json_encode($json);
    echo $jsonString;
}
