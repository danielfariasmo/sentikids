<?php
include '../../../server/database.php';

if (isset($_POST['id_tutor']) && isset($_POST['alta'])) {
    $id_tutor = $_POST['id_tutor'];
    $alta = strtoupper($_POST['alta']);

    // Aquí se hace el UPDATE en la base de datos
    $query = "UPDATE tutor SET alta = '$alta' WHERE id_tutor = $id_tutor";

    $result = mysqli_query($connection, $query);

    if (!$result) {
        die("Query fallo: " . mysqli_error($connection));
    }

    echo "Tutor actualizado con éxito.";
} else {
    echo "Faltan parámetros.";
}
