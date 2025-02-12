<?php
include '../../../server/database.php';

if (isset($_POST['id_monitor'])) {
    $id_monitor = $_POST['id_monitor'];

    // Consulta para verificar si el monitor existe
    $query = "SELECT id_monitor FROM monitor WHERE id_monitor = $id_monitor";
    $result = mysqli_query($connection, $query);

    if (mysqli_num_rows($result) > 0) {
        // Si el monitor existe
        echo "Monitor encontrado.";
    } else {
        // Si el monitor no existe
        echo "Monitor no encontrado.";
    }
}
