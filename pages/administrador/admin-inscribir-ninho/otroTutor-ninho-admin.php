<?php

include '../../../server/database.php';

if (isset($_POST['id_hijo'])) {
    $id_hijo = $_POST['id_hijo'];

    // Sentencia SQL con consulta preparada
    $query = "SELECT 
    pc.id_otro_tutor,
    pc.nombre AS nombre_otro_tutor,
    pc.apellidos AS apellidos_otro_tutor,
    pc.telefono AS telefono_otro_tutor,
    pc.dni AS dni_otro_tutor
    FROM hijo h 
    JOIN tutor t ON h.id_tutor = t.id_tutor 
    JOIN persona_confianza pc ON t.id_tutor = pc.id_tutor 
    WHERE h.id_hijo = ?";

    // Prepara la consulta
    if ($stmt = mysqli_prepare($connection, $query)) {
        // Vincula el parámetro
        mysqli_stmt_bind_param($stmt, 'i', $id_hijo);

        // Ejecuta la consulta
        mysqli_stmt_execute($stmt);

        // Obtiene el resultado
        $result = mysqli_stmt_get_result($stmt);

        // Preparar datos para enviar en formato JSON
        $json = array();
        while ($row = mysqli_fetch_array($result)) {
            $json[] = array(
                'nombre_otro_tutor' => $row['nombre_otro_tutor'],
                'apellidos_otro_tutor' => $row['apellidos_otro_tutor'],
                'telefono_otro_tutor' => $row['telefono_otro_tutor'],
                'dni_otro_tutor' => $row['dni_otro_tutor']
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
