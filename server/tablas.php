<?php

/** ADMINISTRADORES*/
$admin = "CREATE TABLE IF NOT EXISTS administrador (
        id_administrador INT AUTO_INCREMENT PRIMARY KEY,
        nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
        clave_usuario VARCHAR(255) NOT NULL,
        nombre VARCHAR(20) NOT NULL,
        apellidos VARCHAR(20) NOT NULL,
        correo_electronico VARCHAR(50) NOT NULL
    );";
mysqli_query($connection, $admin) or die("ERROR: no se puede crear la tabla administradores: " . mysqli_error($connection));

$insertAdmin = "INSERT INTO administrador (id_administrador, nombre_usuario, clave_usuario, nombre, apellidos, correo_electronico) VALUES 
                    (1, 'danielfarias', 'daniel', 'Daniel', 'Farias Morales', 'danielfarias@gmail.com')";
mysqli_query($connection, $insertAdmin) or die("ERROR: no se puede insertar en la tabla administradores: " . mysqli_error($connection));

/** MONITORES*/
$coach = "CREATE TABLE IF NOT EXISTS monitor (
    id_monitor INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    clave_usuario VARCHAR(255) NOT NULL,
    dni VARCHAR(9) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    correo_electronico VARCHAR(50) NOT NULL,
    telefono VARCHAR(9) NOT NULL
);";
mysqli_query($connection, $coach) or die("ERROR: no se puede crear la tabla monitores: " . mysqli_error($connection));

$insertCoach = "INSERT INTO monitor (id_monitor, nombre_usuario, clave_usuario, dni, nombre, apellidos, correo_electronico, telefono) VALUES 
                    (1, 'danielgonzalez', 'daniel', '43456952Y', 'Daniel', 'Gonzalez Garrote', 'danielgonzalez@gmail.com', '658991011');";
mysqli_query($connection, $insertCoach) or die("ERROR: no se puede insertar en la tabla monitores: " . mysqli_error($connection));

/** TUTORES*/
/* $tutor = "CREATE TABLE IF NOT EXISTS tutor (
    id_tutor INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    clave_usuario VARCHAR(255) NOT NULL,
    dni VARCHAR(9) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    correo_electronico VARCHAR(50) NOT NULL,
    telefono VARCHAR(9) NOT NULL
);"; */
$tutor = "CREATE TABLE IF NOT EXISTS tutor (
    id_tutor INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50),
    clave_usuario VARCHAR(255),
    dni VARCHAR(9) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    correo_electronico VARCHAR(50) NOT NULL,
    telefono VARCHAR(9) NOT NULL
);";
mysqli_query($connection, $tutor) or die("ERROR: no se puede crear la tabla tutores: " . mysqli_error($connection));

$insertTutor = "INSERT INTO tutor (id_tutor, nombre_usuario, clave_usuario, dni, nombre, apellidos, correo_electronico, telefono) VALUES 
                (1, 'candela', 'candela', '50558596J', 'Candela', 'Martinez Sanchez', 'candelamartinez@gmail.com', '654591011'),
                (2, 'sara', 'sara', '48978563P', 'Sara', 'Villanueva Rosa', 'saravillanueva@gmail.com', '600002563'),
                (3, 'irene', 'irene', '43854741M', 'Irene', 'del Rincon Bello', 'irenedelrincon@gmail.com', '677889630'),
                (4, 'raquel', 'raquel', '41456789F', 'Raquel', 'Cerda Losa', 'raquelcerda@gmail.com', '630901045');";
mysqli_query($connection, $insertTutor) or die("ERROR: no se puede insertar en la tabla tutores: " . mysqli_error($connection));

/** OTRO TUTOR: persona de confianza*/
$otherTutor = "CREATE TABLE IF NOT EXISTS persona_confianza (
    id_otro_tutor INT AUTO_INCREMENT PRIMARY KEY,
    id_tutor INT NOT NULL,                    
    nombre VARCHAR(255) NOT NULL,              
    apellidos VARCHAR(255) NOT NULL,   
    telefono VARCHAR(9) NOT NULL,
    dni VARCHAR(9) NOT NULL,          
    FOREIGN KEY (id_tutor) REFERENCES tutor(id_tutor)      
);";
mysqli_query($connection, $otherTutor) or die("ERROR: no se puede crear la tabla persona_confianza: " . mysqli_error($connection));

$insertOtherTutor = "INSERT INTO persona_confianza (id_otro_tutor, id_tutor, nombre, apellidos, telefono, dni) VALUES
                (1, 3, 'Juan', 'Perez Gutierrez', '687124563', '4878963A'),
                (2, 4, 'Guillermo', 'Simon Diaz', '620101417', '78996614J');";
mysqli_query($connection, $insertOtherTutor) or die("ERROR: no se puede insertar en la tabla persona_confianza: " . mysqli_error($connection));

/** NOTIFICACIONES*/
$notification = "CREATE TABLE IF NOT EXISTS notificacion (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_tutor INT NOT NULL, 
    mensaje VARCHAR(1000) NOT NULL,
    fecha DATE NOT NULL,
    FOREIGN KEY (id_tutor) REFERENCES tutor(id_tutor));";
mysqli_query($connection, $notification) or die("ERROR: no se puede crear la tabla Notificaciones: " . mysqli_error($connection));

/** HORARIOS*/
$schedule = "CREATE TABLE IF NOT EXISTS horario (
    id_horario INT AUTO_INCREMENT PRIMARY KEY, 
    dia_semana ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes') NOT NULL,         
    franja_horaria ENUM('10:00-11:30', '11:30-12:00', '12:00-13:30', '13:30-14:30', '14:30-15:00') NOT NULL);";
mysqli_query($connection, $schedule) or die("ERROR: no se puede crear la tabla Horarios: " . mysqli_error($connection));

/** GRUPO*/
$group = "CREATE TABLE IF NOT EXISTS grupo (
    id_grupo INT AUTO_INCREMENT PRIMARY KEY,
    id_monitor INT NOT NULL,
    id_horario INT NOT NULL,
    nombre VARCHAR(255),
    FOREIGN KEY (id_monitor) REFERENCES monitor(id_monitor),
    FOREIGN KEY (id_horario) REFERENCES horario(id_horario));";
mysqli_query($connection, $group) or die("ERROR: no se puede crear la tabla Grupos: " . mysqli_error($connection));

/** MULTIMEDIA*/
$multimedia = "CREATE TABLE IF NOT EXISTS multimedia (
    id_multimedia INT AUTO_INCREMENT PRIMARY KEY,
    id_grupo INT NOT NULL,
    url VARCHAR(255),
    FOREIGN KEY (id_grupo) REFERENCES grupo(id_grupo));";
mysqli_query($connection, $multimedia) or die("ERROR: no se puede crear la tabla Multimedia: " . mysqli_error($connection));

/** ACTIVIDADES*/
$activity = "CREATE TABLE IF NOT EXISTS actividad (
    id_actividad INT AUTO_INCREMENT PRIMARY KEY, 
    nombre VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255) NOT NULL);";
mysqli_query($connection, $activity) or die("ERROR: no se puede crear la tabla Actividades: " . mysqli_error($connection));

/** HORARIOS_ACTIVIDADES*/
$scheduleActivity = "CREATE TABLE IF NOT EXISTS horario_actividad (
    id_horario_actividad INT AUTO_INCREMENT PRIMARY KEY,
    id_horario INT NOT NULL, 
    id_actividad INT NOT NULL,
    FOREIGN KEY (id_horario) REFERENCES horario(id_horario),
    FOREIGN KEY (id_actividad) REFERENCES actividad(id_actividad));";
mysqli_query($connection, $scheduleActivity) or die("ERROR: no se puede crear la tabla Horarios_Actividades: " . mysqli_error($connection));

/** DIETAS*/
// $diet = "CREATE TABLE IF NOT EXISTS dieta (
//     id_dieta INT AUTO_INCREMENT PRIMARY KEY,
//     seleccion ENUM('con menu', 'sin menu') NOT NULL,
//     tipo_menu ENUM('normal', 'especial', 'sin menu')
// );";
// mysqli_query($connection, $diet) or die("ERROR: no se puede crear la tabla Dietas: " . mysqli_error($connection));

// $insertDiet = "INSERT INTO dieta (id_dieta, seleccion, tipo_menu) VALUES 
//                 (1, 'sin menu', 'sin menu'),
//                 (2, 'con menu', 'normal'),
//                 (3, 'con menu', 'especial');";
// mysqli_query($connection, $insertDiet) or die("ERROR: no se puede insertar en la tabla dietas: " . mysqli_error($connection));

/** NIÑOS*/
$kid = "CREATE TABLE IF NOT EXISTS hijo (
    id_hijo INT AUTO_INCREMENT PRIMARY KEY,
    id_tutor INT,
    id_grupo INT,
    nombre VARCHAR(255) NOT NULL, 
    apellidos VARCHAR(255) NOT NULL, 
    fecha_nacimiento DATE, /** ESTO ES FECHA DE NACIMIENTO */
    dieta ENUM('sin restricciones', 'sin gluten', 'sin lacteos'),
    alergias VARCHAR(255), /** CONDICIONES? */
    FOREIGN KEY (id_tutor) REFERENCES tutor(id_tutor),
    FOREIGN KEY (id_grupo) REFERENCES grupo(id_grupo)
);";
mysqli_query($connection, $kid) or die("ERROR: no se puede crear la tabla Niños: " . mysqli_error($connection));

