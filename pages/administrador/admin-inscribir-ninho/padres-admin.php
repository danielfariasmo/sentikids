<?php

include '../../../server/database.php';

if (isset($_POST['id_hijo'])) {
    $id_hijo = $_POST['id_hijo'];

    // Sentencia SQL con consulta preparada
    $query = "SELECT t.* FROM tutor t INNER JOIN hijo h ON t.id_tutor = h.id_tutor WHERE h.id_hijo = ?";

    // Prepara la consulta
    if ($stmt = mysqli_prepare($connection, $query)) {
        // Vincula el parámetro
        mysqli_stmt_bind_param($stmt, 'i', $id_hijo);

        // Ejecuta la consulta
        mysqli_stmt_execute($stmt);

        // Obtiene el resultado
        $result = mysqli_stmt_get_result($stmt);

        // Envio datos al JS
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

        // Cierra la declaración preparada
        mysqli_stmt_close($stmt);
    } else {
        echo "Error en la preparación de la consulta: " . mysqli_error($connection);
    }
}

