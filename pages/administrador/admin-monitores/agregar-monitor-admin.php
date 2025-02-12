<?php
include '../../../server/database.php'; // Incluye la conexión a la base de datos

// Verifica si se recibieron los datos del formulario
if (isset($_POST['name'], $_POST['surname'], $_POST['phone'], $_POST['dni'], $_POST['email'], $_POST['usuario'], $_POST['password'])) {
    // Limpieza de datos para evitar inyecciones SQL
    $name = mysqli_real_escape_string($connection, $_POST['name']);
    $surname = mysqli_real_escape_string($connection, $_POST['surname']);
    $phone = mysqli_real_escape_string($connection, $_POST['phone']);
    $dni = mysqli_real_escape_string($connection, $_POST['dni']);
    $email = mysqli_real_escape_string($connection, $_POST['email']);
    $nombre_usuario = mysqli_real_escape_string($connection, $_POST['usuario']);

    // Hashear la contraseña
    $clave_usuario = password_hash($_POST['password'], PASSWORD_BCRYPT);

    // Preparar la consulta SQL para insertar los datos
    $query = "INSERT INTO monitor (nombre, apellidos, telefono, dni, correo_electronico, nombre_usuario, clave_usuario) 
              VALUES ('$name', '$surname', '$phone', '$dni', '$email', '$nombre_usuario', '$clave_usuario')";

    $result = mysqli_query($connection, $query);

    // Verificar si la inserción fue exitosa
    if ($result) {
        echo "Monitor agregado con éxito.";
    } else {
        echo "Error al agregar monitor: " . mysqli_error($connection);
    }
} else {
    echo "Faltan datos en el formulario.";
}
