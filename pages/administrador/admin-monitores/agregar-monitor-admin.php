<?php
include '../../../server/database.php'; 

// Verifica si se recibieron los datos del formulario
if (isset($_POST['name'], $_POST['surname'], $_POST['phone'], $_POST['dni'], $_POST['email'], $_POST['usuario'], $_POST['password'])) {
    // Limpieza de datos para evitar inyecciones SQL
    $name = $_POST['name'];
    $surname = $_POST['surname'];
    $phone = $_POST['phone'];
    $dni = $_POST['dni'];
    $email = $_POST['email'];
    $nombre_usuario = $_POST['usuario'];

    // Hashear la contraseña
    $clave_usuario = password_hash($_POST['password'], PASSWORD_BCRYPT);

    // Preparar la consulta SQL para insertar los datos
    $query = "INSERT INTO monitor (nombre, apellidos, telefono, dni, correo_electronico, nombre_usuario, clave_usuario) 
              VALUES (?, ?, ?, ?, ?, ?, ?)";

    // Prepara la consulta
    if ($stmt = mysqli_prepare($connection, $query)) {
        // Vinculamos los parámetros a la consulta preparada
        mysqli_stmt_bind_param($stmt, 'sssssss', $name, $surname, $phone, $dni, $email, $nombre_usuario, $clave_usuario);

        // Ejecutamos la consulta
        if (mysqli_stmt_execute($stmt)) {
            echo "Monitor agregado con éxito.";
        } else {
            echo "Error al agregar monitor: " . mysqli_error($connection);
        }

        // Cerramos la declaración preparada
        mysqli_stmt_close($stmt);
    } else {
        echo "Error en la preparación de la consulta: " . mysqli_error($connection);
    }
} else {
    echo "Faltan datos en el formulario.";
}
?>
