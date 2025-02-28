<?php
include '../../../server/database.php';

// Verificar la conexión
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$search = $_GET['search'];

// Buscar monitores que coincidan con el término de búsqueda
$sql = "SELECT id_monitor, nombre_monitor, apellidos_monitor FROM monitores WHERE nombre_monitor LIKE '%$search%' OR apellidos_monitor LIKE '%$search%'";
$result = $conn->query($sql);

$monitores = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $monitores[] = $row;
    }
}

echo json_encode($monitores);

$conn->close();
?>