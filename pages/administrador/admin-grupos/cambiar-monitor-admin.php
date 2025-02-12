<?php
include '../../../server/database.php';

if (isset($_POST['id_grupo']) && isset($_POST['id_monitor'])) {
    $id_grupo = $_POST['id_grupo'];
    $id_monitor = $_POST['id_monitor'];

    // Aquí se hace el UPDATE en la base de datos
    $query = "UPDATE grupo SET id_monitor = '$id_monitor' WHERE id_grupo = $id_grupo";
    $result = mysqli_query($connection, $query);

    if (!$result) {
        die("Query fallo: " . mysqli_error($connection));
    }

    echo "Monitor actualizado con éxito.";
}
