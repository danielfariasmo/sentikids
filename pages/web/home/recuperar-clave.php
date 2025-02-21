<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require '../../../PHPMiller/Exception.php';
require '../../../PHPMiller/PHPMailer.php';
require '../../../PHPMiller/SMTP.php';

include '../../../server/database.php';

if (!isset($connection)) {
    die("Error: No se pudo establecer la conexión a la base de datos.");
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email']);
    $tipo = trim($_POST['tipo']);

    // Validamos que la tabla sea una de las permitidas
    $tablas_permitidas = ['administrador', 'monitor', 'tutor'];
    if (!in_array($tipo, $tablas_permitidas)) {
        die("Error: Tipo de usuario inválido.");
    }

    // Verificar que la columna correcta es 'email'
    $stmt = $connection->prepare("SELECT * FROM $tipo WHERE correo_electronico = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $resultado = $stmt->get_result();

    // Comprobamos si la búsqueda tiene resultados
    if ($resultado->num_rows > 0) {
        $usuario = $resultado->fetch_assoc(); // Obtener los datos del usuario
        $nombre = $usuario['nombre']; // Asegúrate de que esta columna se llame 'nombre' en la base de datos

        //Create an instance; passing `true` enables exceptions
        $mail = new PHPMailer(true);

        try {
            //Configuración del servidor
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'campamentosentikids@gmail.com';
            $mail->Password   = 'frmb vssk thza hepw';
            $mail->SMTPSecure = 'ssl';
            $mail->Port       = 465;

            //Destinatario
            $mail->setFrom('campamentosentikids@gmail.com', 'SentiKids');
            $mail->addAddress($email, $nombre); // Aquí asignamos el correo y el nombre del usuario

            //Titulo 
            $mail->isHTML(true);
            $mail->Subject = 'Recuperación de Contraseña - SentiKids';

            // Generamos un token único
            $token = bin2hex(random_bytes(50));

            // Guardar el token en la columna 'codigo' del usuario correspondiente
            $stmt = $connection->prepare("UPDATE $tipo SET codigo = ? WHERE correo_electronico = ?");
            $stmt->bind_param("ss", $token, $email);
            $stmt->execute();
            $stmt->close();

            // URL de recuperación de contraseña con el token
            $url = "http://localhost/sentikids/pages/web/home/cambiar-clave.html?token=$token&email=" . urlencode($email);

            // Mensaje que ve la persona
            $mail->Body = '
                <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #CD4533;">SentiKids</h1>
                    </div>

                    <h3 style="text-align: center;">Recuperación de Contraseña</h3>
                    <p>Hola ' . htmlspecialchars($nombre) . ',</p>
                    <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <strong>SentiKids</strong>.</p>
                    <p>Si no solicitaste esto, puedes ignorar este mensaje.</p>
                    <p>Para restablecer tu contraseña, haz clic en el siguiente botón:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="' . $url . '" style="background-color: #CD4533; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Restablecer Contraseña</a>
                    </div>
        
                    <p>O copia y pega el siguiente enlace en tu navegador:</p>
                    <p><a href="' . $url . '" style="word-break: break-all;">' . $url . '</a></p>
                    <p>Este enlace es válido por <strong>24 horas</strong>.</p>
                    <p>Saludos,<br><strong>El equipo de SentiKids</strong></p>
                </div>';

            $mail->send();
            echo 'Correo enviado con éxito';
            exit();
        } catch (Exception $e) {
            error_log("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
        }
    } else {
        echo 'Correo no encontrado.';
        exit();
    }
}
?>
