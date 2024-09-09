<?php

// Se incluye la clase para trabajar con la base de datos.
require_once ('../../helpers/database.php');
// Se incluye la clase para enviar el correo.
require_once ('../../helpers/emailConnexion.php');

/*
 *  Clase para manejar el comportamiento de los datos de la tabla tipos de jugadas.
 */

class ContactanosHandler
{

    //Declaracion de variables aqui
    protected $nombre = null;
    protected $correo = null;
    protected $mensaje = null;

    protected $contrasena = null;

    public function envioCorreo()
    {
        $titulo = '¡Bienvenid@, te han enviado un nuevo correo!';
        $mailSubject = 'Quieren contactarse contigo';	
        $mailAltBody = 'Te han mandado un correo desde tu sitio web';
        $message1 = $this->nombre . ', quería informarte que:';
        $message2 = $this->mensaje;
        $footer = 'Copyright &copy; ' . date("Y") . ' Fundación un gol para El Salvador. Todos los derechos reservados.';
        // Cargar plantilla HTML
        $template = file_get_contents('../../helpers/email/contactanos.html');
        // Reemplazar marcadores de posición con co1ntenido dinámico
        $mailBody = str_replace(
            ['{{subject}}', '{{title}}', '{{body}}', '{{message1}}', '{{message2}}', '{{footer}}'],
            [$mailSubject, $titulo, $mailAltBody, $message1, $message2, $footer],
            $template
        );        
        return Props::sendMailPublic($this->correo, $this->nombre ,$mailSubject, $mailBody);
    }

}

