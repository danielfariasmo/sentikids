<?php
include '../../../server/database.php';

if (isset($_POST['query'])) {
    $query = $_POST['query'];

    // Sentencia SQL preparada para evitar inyecciones SQL
    $sql = "SELECT id_monitor, nombre, apellidos FROM monitor WHERE nombre LIKE ? OR apellidos LIKE ?";

    if ($stmt = $connection->prepare($sql)) {
        // Añadir los signos de porcentaje para buscar coincidencias parciales
        $search = "%" . $query . "%";

        // Vinculamos los parámetros
        $stmt->bind_param("ss", $search, $search);

        // Ejecutamos la consulta
        $stmt->execute();

        // Obtenemos los resultados
        $result = $stmt->get_result();

        // Crear un array con los niños encontrados
        $coach = array();
        while ($row = $result->fetch_assoc()) {
            $coach[] = $row;
        }

        // Devolver los resultados en formato JSON
        echo json_encode($coach);

        // Cerramos la declaración
        $stmt->close();
    } else {
        echo "Error al preparar la consulta: " . $connection->error;
    }
}
