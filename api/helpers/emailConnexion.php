<?php
//Librerias a utilizar para PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

//Llamamos la carpeta que tiene la libreria de PHPMailer y sus dependencias
require('C:/xampp/htdocs/sitio_gol_sv/vendor/autoload.php');

//Creamos la clase Email
class Email
{
    //Creamos la funcion sendEmail que recibe como paramentro el addres, subject, name y message
    public static function sendMail($address, $subject, $name, $message)
    {
        //Creamos la instancia de PHPMailer
        $mail = new PHPMailer(true);
        //En caso no haya ningun error entonces entraria al bloque de try, retornando un true, pero sino entonces entraria en el catch y retornaria un false.
        try {
            //$mail->SMTPDebug = SMTP::DEBUG_SERVER;                    //Muestra los posibles errores
            $mail->isSMTP();                                            //Send using SMTP
            $mail->Host       = 'smtp.gmail.com';                       //Set the SMTP server to send through
            $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
            $mail->Username   = 'guayito.palom0@gmail.com';                //SMTP username
            $mail->Password   = 'xokbehxzwqumgsvd';                     //SMTP password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
            $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

            $mail->setFrom($address); // Quien lo envía
            $mail->addAddress('guayito.palom0@gmail.com', 'Soporte un gol para El Salvador');
            $mail->addCC($address);
            $mail->CharSet = 'UTF-8';
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = '
                            <body style="font-family: Arial, sans-serif;">                           
                              <div style="width: 700px; margin: 0 auto; ">
                              <div style="text-align: center">
                                <img src="https://serving.photos.photobox.com/898252010919df605cc039d068688ed4cd5f09e85e1991ef9b5fff224dca7254f3225b22.jpg" style="width: 150px; height: 150px" alt=""> 
                              </div>
                                <h2 style="background-color: #f4d35e; color: #000000; margin-top: 0; text-align: center; padding: 10px">' . $name . '</h2>
                                <hr style="border-top: 1px solid #ddd;">
                                <div style="line-height: 1.5; padding: 15px; background-color: #FAF0CAFF; font-size: 17px">
                                  ' . $message . '
                                </div>
                                  <div style="text-align: center; padding: 10px; background-color: #ff8b4d;">
                                  <p style="color: white; font-size: 15px ">Copyright &copy; <?php echo date("Y"); ?> Huellitas Pets. Todos los derechos reservados.</p>
                                </div>
                              </div>
                            </body>
                            ';
            $mail->send();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
}
