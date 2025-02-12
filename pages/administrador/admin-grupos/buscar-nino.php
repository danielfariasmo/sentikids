<?php
include '../../../server/database.php';

if (isset($_POST['query'])) {
    $query = $_POST['query'];

    // Consulta para buscar niños por nombre o apellidos
    $sql = "SELECT id_hijo, nombre, apellidos FROM hijo WHERE nombre LIKE '%$query%' OR apellidos LIKE '%$query%'";
    $result = mysqli_query($connection, $sql);

    $children = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $children[] = $row;
    }

    echo json_encode($children);
}

