<?php

/** USUARIOS*/
$users = "CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    clave_usuario VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('administrador', 'tutor', 'monitor') NOT NULL
);";
mysqli_query($connection, $users) or die("ERROR: no se puede crear la tabla usuarios: " . mysqli_error($connection));

$insertUsers = "INSERT INTO usuario (id_usuario, nombre_usuario, clave_usuario, tipo_usuario) VALUES 
                    ('1', 'danielfarias', 'daniel', 'administrador'),
                    ('2', 'candela', 'candela', 'tutor'),
                    ('3', 'sara', 'sara', 'tutor'),
                    ('4', 'irene', 'irene', 'tutor'),
                    ('5', 'raquel', 'raquel', 'tutor'),
                    ('6', 'danielgonzalez', 'daniel', 'monitor')";
mysqli_query($connection, $insertUsers) or die("ERROR: no se puede insertar en la tabla usuarios: " . mysqli_error($connection));

/** ADMINISTRADORES*/
$admin = "CREATE TABLE IF NOT EXISTS administrador(
        id_administrador INT AUTO_INCREMENT PRIMARY KEY,
        id_usuario INT,
        nombre VARCHAR(20) NOT NULL,
        apellidos VARCHAR(20) NOT NULL,
        correo_electronico VARCHAR(50) NOT NULL,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
    );";
mysqli_query($connection, $admin) or die("ERROR: no se puede crear la tabla administradores: " . mysqli_error($connection));

$insertAdmin = "INSERT INTO administrador (id_administrador, id_usuario, nombre, apellidos, correo_electronico) VALUES 
                    (1, 1, 'Daniel', 'Farias Morales', 'danielfarias@gmail.com')";
mysqli_query($connection, $insertAdmin) or die("ERROR: no se puede insertar en la tabla administradores: " . mysqli_error($connection));

/** MONITORES*/
$coach = "CREATE TABLE IF NOT EXISTS monitor (
    id_monitor INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    dni VARCHAR(9) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    correo_electronico VARCHAR(50) NOT NULL,
    telefono VARCHAR(9) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);";
mysqli_query($connection, $coach) or die("ERROR: no se puede crear la tabla monitores: " . mysqli_error($connection));

$insertCoach = "INSERT INTO monitor (id_monitor, id_usuario, dni, nombre, apellidos, correo_electronico, telefono) VALUES 
                    (1, 6, '43456952Y', 'Daniel', 'Gonzalez Garrote', 'danielgonzalez@gmail.com', '658991011');";
mysqli_query($connection, $insertCoach) or die("ERROR: no se puede insertar en la tabla monitores: " . mysqli_error($connection));

/** TUTORES*/
$tutor = "CREATE TABLE IF NOT EXISTS tutor (
    id_tutor INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    dni VARCHAR(9) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    correo_electronico VARCHAR(50) NOT NULL,
    telefono VARCHAR(9) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);";
mysqli_query($connection, $tutor) or die("ERROR: no se puede crear la tabla tutores: " . mysqli_error($connection));

$insertTutor = "INSERT INTO tutor (id_tutor, id_usuario, dni, nombre, apellidos, correo_electronico, telefono) VALUES 
                (1, 2, '50558596J', 'Candela', 'Martinez Sanchez', 'candelamartinez@gmail.com', '654591011'),
                (2, 3, '48978563P', 'Sara', 'Villanueva Rosa', 'saravillanueva@gmail.com', '600002563'),
                (3, 4, '43854741M', 'Irene', 'del Rincon Bello', 'irenedelrincon@gmail.com', '677889630'),
                (4, 5, '41456789F', 'Raquel', 'Cerda Losa', 'raquelcerda@gmail.com', '630901045');";
mysqli_query($connection, $insertTutor) or die("ERROR: no se puede insertar en la tabla tutores: " . mysqli_error($connection));

/** OTRO TUTOR: persona de confianza*/
$otherTutor = "CREATE TABLE IF NOT EXISTS persona_confianza (
    id_otro_tutor INT AUTO_INCREMENT PRIMARY KEY,
    id_tutor INT NOT NULL,                    
    nombre VARCHAR(255) NOT NULL,              
    apellidos VARCHAR(255) NOT NULL,   
    telefono VARCHAR(9) NOT NULL,
    relacion VARCHAR(20) NOT NULL,          
    FOREIGN KEY (id_tutor) REFERENCES tutores(id_tutor)      
);";
mysqli_query($connection, $otherTutor) or die("ERROR: no se puede crear la tabla persona_confianza: " . mysqli_error($connection));

$insertOtherTutor = "INSERT INTO persona_confianza (id_otro_tutor, id_tutor, nombre, apellidos, telefono, relacion) VALUES
                (1, 3, 'Juan', 'Perez Gutierrez', '687124563', 'Padre'),
                (2, 4, 'Guillermo', 'Simon Diaz', '620101417', 'Abuelo');";
mysqli_query($connection, $insertOtherTutor) or die("ERROR: no se puede insertar en la tabla persona_confianza: " . mysqli_error($connection));

/** NOTIFICACIONES*/
$notification = "CREATE TABLE IF NOT EXISTS notificacion (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_tutor INT NOT NULL, 
    mensaje VARCHAR(1000) NOT NULL,
    fecha DATE NOT NULL,
    FOREIGN KEY (id_tutor) REFERENCES tutores(id_tutor));";
mysqli_query($connection, $notification) or die("ERROR: no se puede crear la tabla Notificaciones: " . mysqli_error($connection));

/** HORARIOS*/
$schedule = "CREATE TABLE IF NOT EXISTS horario (
    id_horario INT AUTO_INCREMENT PRIMARY KEY, 
    dia_semana VARCHAR(15) NOT NULL,          
    hora_inicio TIME NOT NULL,                
    hora_fin TIME NOT NULL);";
mysqli_query($connection, $schedule) or die("ERROR: no se puede crear la tabla Horarios: " . mysqli_error($connection));

/** GRUPO*/
$group = "CREATE TABLE IF NOT EXISTS grupo (
    id_grupo INT AUTO_INCREMENT PRIMARY KEY,
    id_monitor INT NOT NULL,
    id_horario INT NOT NULL,
    nombre VARCHAR(255),
    FOREIGN KEY (id_monitor) REFERENCES monitores(id_monitor),
    FOREIGN KEY (id_horario) REFERENCES horarios(id_horario));";
mysqli_query($connection, $group) or die("ERROR: no se puede crear la tabla Grupos: " . mysqli_error($connection));

/** MULTIMEDIA*/
$multimedia = "CREATE TABLE IF NOT EXISTS multimedia (
    id_multimedia INT AUTO_INCREMENT PRIMARY KEY,
    id_grupo INT NOT NULL,
    url VARCHAR(255),
    FOREIGN KEY (id_grupo) REFERENCES grupos(id_grupo));";
mysqli_query($connection, $multimedia) or die("ERROR: no se puede crear la tabla Multimedia: " . mysqli_error($connection));

/** ACTIVIDADES*/
$activity = "CREATE TABLE IF NOT EXISTS actividad (
    id_actividad INT AUTO_INCREMENT PRIMARY KEY, 
    nombre VARCHAR(255) NOT NULL);";
mysqli_query($connection, $activity) or die("ERROR: no se puede crear la tabla Actividades: " . mysqli_error($connection));

/** HORARIOS_ACTIVIDADES*/
$scheduleActivity = "CREATE TABLE IF NOT EXISTS horario_actividad (
    id_horario_actividad INT AUTO_INCREMENT PRIMARY KEY,
    id_horario INT NOT NULL, 
    id_actividad INT NOT NULL,
    FOREIGN KEY (id_horario) REFERENCES horarios(id_horario),
    FOREIGN KEY (id_actividad) REFERENCES actividades(id_actividad));";
mysqli_query($connection, $scheduleActivity) or die("ERROR: no se puede crear la tabla Horarios_Actividades: " . mysqli_error($connection));

/** DIETAS*/
$diet = "CREATE TABLE IF NOT EXISTS dieta (
    id_dieta INT AUTO_INCREMENT PRIMARY KEY,
    seleccion ENUM('con menu', 'sin menu') NOT NULL,
    tipo_menu ENUM('normal', 'especial', 'sin menu')
);";
mysqli_query($connection, $diet) or die("ERROR: no se puede crear la tabla Dietas: " . mysqli_error($connection));

$insertDiet = "INSERT INTO dieta (id_dieta, seleccion, tipo_menu) VALUES 
                (1, 'sin menu', 'sin menu'),
                (2, 'con menu', 'normal'),
                (3, 'con menu', 'especial');";
mysqli_query($connection, $insertDiet) or die("ERROR: no se puede insertar en la tabla dietas: " . mysqli_error($connection));

/** NIÑOS*/
$kid = "CREATE TABLE IF NOT EXISTS ninho (
    id_ninho INT AUTO_INCREMENT PRIMARY KEY,
    id_tutor INT,
    id_grupo INT,
    id_dieta INT,
    nombre VARCHAR(255) NOT NULL, 
    apellidos VARCHAR(255) NOT NULL, 
    edad VARCHAR(1) NOT NULL, 
    alergias VARCHAR(255) NOT NULL, 
    FOREIGN KEY (id_tutor) REFERENCES tutores(id_tutor),
    FOREIGN KEY (id_grupo) REFERENCES grupos(id_grupo),
    FOREIGN KEY (id_dieta) REFERENCES dietas(id_dieta)
);";
mysqli_query($connection, $kid) or die("ERROR: no se puede crear la tabla Niños: " . mysqli_error($connection));


