<?php
include '../../../server/database.php';

if (isset($_POST['id_hijo']) && isset($_POST['id_grupo'])) {
    $id_hijo = $_POST['id_hijo'];
    $id_grupo = $_POST['id_grupo'];

    // Verificar cuántos niños hay en el grupo seleccionado
    $checkQuery = "SELECT COUNT(*) as total FROM hijo WHERE id_grupo = ?";
    if ($stmt = mysqli_prepare($connection, $checkQuery)) {
        mysqli_stmt_bind_param($stmt, 'i', $id_grupo);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_bind_result($stmt, $total);
        mysqli_stmt_fetch($stmt);
        mysqli_stmt_close($stmt);

        if ($total >= 10) {
            echo "El grupo ya tiene el máximo de 10 niños.";
            exit;
        }
    } else {
        echo "Error al verificar el grupo: " . mysqli_error($connection);
        exit;
    }

    // Si hay espacio, actualizar el grupo del niño
    $query = "UPDATE hijo SET id_grupo = ? WHERE id_hijo = ?";
    if ($stmt = mysqli_prepare($connection, $query)) {
        mysqli_stmt_bind_param($stmt, 'ii', $id_grupo, $id_hijo);
        $result = mysqli_stmt_execute($stmt);

        if ($result) {
            echo "Niño/a actualizado con éxito.";
        } else {
            echo "Error al actualizar: " . mysqli_error($connection);
        }

        mysqli_stmt_close($stmt);
    } else {
        echo "Error en la preparación de la consulta: " . mysqli_error($connection);
    }
}
