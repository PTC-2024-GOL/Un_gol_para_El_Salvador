<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require ('C:/xampp/htdocs/sitio_gol_sv/vendor/autoload.php');

class Email
{
    private static $encryptionKey = '6363637034303f4876'; // Clave en formato hexadecimal (32 bytes)

    public static function sendMail($id_usuario, $nivel_usuario, $cadena, $correo, $nombre)
    {
        $encryptedString = self::encryptString($cadena);

        $address = $correo;
        $subject = 'Recuperación de contraseña';
        $name = $nombre;
        $link = 'http://localhost/sitio_gol_sv/views/admin/pages/change_passwords.html?c=' . urlencode($cadena) . '&id=' . urlencode($id_usuario) . '&n=' . urlencode($nivel_usuario);
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'guayito.palom0@gmail.com';
            $mail->Password = 'xokbehxzwqumgsvd';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port = 465;

            $mail->setFrom($address);
            $mail->addAddress('guayito.palom0@gmail.com', 'Soporte un gol para El Salvador');
            $mail->addCC($address);
            $mail->CharSet = 'UTF-8';
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = "
                <body style='font-family: Arial, sans-serif;'>
                    <div style='width: 700px; margin: 0 auto;'>
                        <div style='text-align: center'>
                            <img src='https://images.vexels.com/content/218082/preview/male-soccer-player-passing-ball-d34c2e.png' style='width: 150px; height: 150px' alt=''>
                        </div>
                        <h2 style='background-color: #0078B7; color: white; margin-top: 0; text-align: center; padding: 10px'> ¡Bienvenido $name, estamos aquí para ayudarte!</h2>
                        <hr style='border-top: 1px solid #ddd;'>
                        <div style='line-height: 1.5; padding: 15px; background-color: #CAF1F8; font-size: 17px'>
                            Cambia tu contraseña con un solo click, <a href='$link' style='color: #0078B7;'>¡ingresa aquí!</a>. Si no has solicitado este cambio, por favor ignora este mensaje.
                            Este link solo estará habilitado durante los siguientes 15 minutos, después de este tiempo deberás solicitar un nuevo cambio de contraseña. Recuerda que tu seguridad es nuestra prioridad. 
                        </div>
                        <div style='text-align: center; padding: 10px; background-color: #0078B7;'>
                            <p style='color: white; font-size: 15px'>Copyright &copy; " . date("Y") . " Fundación un gol para El Salvador. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </body>
            ";

            $mail->send();
            return 1;
        } catch (Exception $e) {
            return 0;
        }
    }

    private static function encryptString($string)
    {
        $key = hex2bin(self::$encryptionKey); // Convertir clave de hexadecimal a binario
        $iv = random_bytes(openssl_cipher_iv_length('aes-256-cbc')); // Generar IV aleatorio
        $encrypted = openssl_encrypt($string, 'aes-256-cbc', $key, OPENSSL_RAW_DATA, $iv);
        return base64_encode($iv . $encrypted); // Concatenar IV y texto cifrado, luego codificar en Base64
    }

    private static function decryptString($string)
    {
        $key = hex2bin(self::$encryptionKey); // Convertir clave de hexadecimal a binario
        $decoded = base64_decode($string);
        $iv_length = openssl_cipher_iv_length('aes-256-cbc');
        $iv = substr($decoded, 0, $iv_length); // Extraer IV
        $encrypted = substr($decoded, $iv_length); // Extraer texto cifrado
        return openssl_decrypt($encrypted, 'aes-256-cbc', $key, OPENSSL_RAW_DATA, $iv);
    }
}
?>