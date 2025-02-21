<?php

include '../../../server/database.php';

// Sentencia SQL con consulta preparada
$query = "SELECT * FROM hijo";

// Prepara la consulta
if ($stmt = mysqli_prepare($connection, $query)) {
    // Ejecuta la consulta
    mysqli_stmt_execute($stmt);

    // Obtiene el resultado
    $result = mysqli_stmt_get_result($stmt);

    // Envio datos al js
    $json = array();
    while ($row = mysqli_fetch_array($result)) {
        $json[] = array(
            'id_hijo' => $row['id_hijo'],
            'nombre' => $row['nombre'],
            'apellidos' => $row['apellidos'],
            'fecha_nacimiento' => $row['fecha_nacimiento'],
            'dieta' => $row['dieta'],
            'alergias' => $row['alergias'],
            'id_grupo' => $row['id_grupo'],
            'id_tutor' => $row['id_tutor']
        );
    }

    $jsonString = json_encode($json);
    echo $jsonString;

    // Cierra la declaración preparada
    mysqli_stmt_close($stmt);
} else {
    echo "Error en la preparación de la consulta: " . mysqli_error($connection);
}
