<?php
include '../../../server/database.php';

if (isset($_POST['id_hijo']) && isset($_POST['id_grupo'])) {
    $id_hijo = $_POST['id_hijo'];
    $id_grupo = $_POST['id_grupo'];

    // Sentencia SQL con consulta preparada
    $query = "UPDATE hijo SET id_grupo = ? WHERE id_hijo = ?";

    // Prepara la consulta
    if ($stmt = mysqli_prepare($connection, $query)) {
        // Vincula los parámetros
        mysqli_stmt_bind_param($stmt, 'ii', $id_grupo, $id_hijo);

        // Ejecuta la consulta
        $result = mysqli_stmt_execute($stmt);

        if ($result) {
            echo "Niño/a actualizado con éxito.";
        } else {
            echo "Error al actualizar: " . mysqli_error($connection);
        }

        // Cierra la declaración preparada
        mysqli_stmt_close($stmt);
    } else {
        echo "Error en la preparación de la consulta: " . mysqli_error($connection);
    }
}
