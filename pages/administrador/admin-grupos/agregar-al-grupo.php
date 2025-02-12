<?php
include '../../../server/database.php';

if (isset($_POST['children_ids']) && isset($_POST['group_id'])) {
    $childrenIds = $_POST['children_ids'];  // Un array de IDs de niños
    $groupId = $_POST['group_id'];

    // Actualizar los niños seleccionados para asignarlos al grupo
    foreach ($childrenIds as $childId) {
        $sql = "UPDATE hijo SET id_grupo = $groupId WHERE id_hijo = $childId";
        if (!mysqli_query($connection, $sql)) {
            echo 'Error al agregar el niño con ID ' . $childId . ' al grupo';
            exit;
        }
    }

    echo 'Niños agregados al grupo';
}

