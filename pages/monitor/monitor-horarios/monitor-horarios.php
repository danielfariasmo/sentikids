<?php
    session_start(); // Iniciar la sesión

    if (!isset($_SESSION['id_monitor'])) {
        // Redirigir al login si no hay sesión de monitor
        header("Location: login.html");
        exit;
    }

    $id_monitor = $_SESSION['id_monitor'];

    // Conexión a la base de datos
    $conexion = new mysqli("localhost", "root", "", "sentikids");
    if ($conexion->connect_error) {
        die("Error de conexión: " . $conexion->connect_error);
    }

    // Obtener el horario del monitor
    $query = "SELECT h.url 
            FROM horario h 
            JOIN grupo g ON h.id_horario = g.id_horario 
            WHERE g.id_monitor = $id_monitor";
    $result = $conexion->query($query);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $url_horario = $row['url'];
    } else {
        $url_horario = "../assets/horario1.png"; // Imagen por defecto si no hay horario
    }

    $conexion->close();
?>