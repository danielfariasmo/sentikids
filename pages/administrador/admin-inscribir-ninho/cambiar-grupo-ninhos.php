<?php
include '../../../server/database.php';

if (isset($_POST['id_hijo']) && isset($_POST['id_grupo'])) {
    $id_hijo = $_POST['id_hijo'];
    $id_grupo = $_POST['id_grupo'];

    // Aquí se hace el UPDATE en la base de datos
    $query = "UPDATE hijo SET id_grupo = '$id_grupo' WHERE id_hijo = $id_hijo";
    $result = mysqli_query($connection, $query);

    if (!$result) {
        die("Query fallo: " . mysqli_error($connection));
    }

    echo "Niño/a actualizado con éxito.";
} 