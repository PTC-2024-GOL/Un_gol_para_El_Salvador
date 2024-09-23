<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/administradores_handler.php');
//Llamada a la libreria que genera los codigos de autenticacion
require_once('C:/xampp/htdocs/sitio_gol_sv/vendor/autoload.php');

/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla administradores.
 */
class AdministradoresData extends AdministradoresHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;
    // Atributo para almacenar el nombre del archivo de imagen.
    private $filename = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID del administrador.
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del administrador es incorrecto';
            return false;
        }
    }

    // Validación y asignación del nombre del administrador.
    public function setNombre($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El nombre debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->nombre = $value;
            return true;
        } else {
            $this->data_error = 'El nombre debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Validación y asignación del apellido del administrador.
    public function setApellido($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El apellido debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->apellido = $value;
            return true;
        } else {
            $this->data_error = 'El apellido debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Validación y asignación del correo del administrador.
    public function setCorreo($value, $min = 8, $max = 100)
    {
        if (!Validator::validateEmail($value)) {
            $this->data_error = 'El correo no es válido';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->correo = $value;
            return true;
        } else {
            $this->data_error = 'El correo debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Validación y asignación del alias del administrador.
    public function setAlias($value, $min = 6, $max = 25)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El alias debe ser un valor alfanumérico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->alias = $value;
            return true;
        } else {
            $this->data_error = 'El alias debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Validación y asignación de laW clave del administrador.
    public function setClave($value)
    {
        if (Validator::validatePassword($value)) {
            $this->clave = password_hash($value, PASSWORD_DEFAULT);
            return true;
        } else {
            $this->data_error = Validator::getPasswordError();
            return false;
        }
    }

    // Validación y asignación del teléfono del administrador.
    public function setTelefono($value)
    {
        if (Validator::validatePhone($value)) {
            $this->telefono = $value;
            return true;
        } else {
            $this->data_error = 'El teléfono debe tener el formato (2, 6, 7)###-####';
            return false;
        }
    }

    // Validación y asignación del DUI del administrador.
    public function setDUI($value)
    {
        if (!Validator::validateDUI($value)) {
            $this->data_error = 'El DUI debe tener el formato ########-#';
            return false;
        } else {
            $this->dui = $value;
            return true;
        }
    }

    // Validación y asignación de la fecha de nacimiento del administrador.
    public function setNacimiento($value)
    {
        if (Validator::validateDateBirthday($value)) {
            $this->nacimiento = $value;
            return true;
        } else {
            $this->data_error = 'La fecha de nacimiento no es valida, debe ser mayor de edad y menor a 122 años';
            return false;
        }
    }

    // Validación y asignación de la imagen del administrador.
    public function setImagen($file, $filename = null)
    {
        if (Validator::validateImageFile($file, 1000)) {
            $this->imagen = Validator::getFilename();
            return true;
        } elseif (Validator::getFileError()) {
            $this->data_error = Validator::getFileError();
            return false;
        } elseif ($filename) {
            $this->imagen = $filename;
            return true;
        } else {
            $this->imagen = 'default.png';
            return true;
        }
    }

    // Validación y asignación del estado del administrador.
    public function setEstado($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->estado = $value;
            return true;
        } else {
            return false;
        }
    }

    // Validación y asignación de los días del administrador(campo que valida que no hayan pasado 90 días de uso de la clave).
    public function setDias($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->dias = $value;
            return true;
        } else {
            return false;
        }
    }

    // Asignación del nombre del archivo de imagen del administrador.
    public function setFilename()
    {
        if ($data = $this->readFilename()) {
            $this->filename = $data['IMAGEN'];
            return true;
        } else {
            $this->data_error = 'Imagen inexistente';
            return false;
        }
    }

    public function setFilenameProfile()
    {
        if ($data = $this->readFilenameProfile()) {
            $this->filename = $data['IMAGEN'];
            return true;
        } else {
            $this->data_error = 'Imagen inexistente';
            return false;
        }
    }


    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }

    // Método para obtener el nombre del archivo de imagen.
    public function getFilename()
    {
        return $this->filename;
    }

    // Método para obtener la condición del administrador.
    public function getCondicion()
    {
        return $this->condicion;
    }

    // Método para obtener la fecha de hoy.
    public function getHoy()
    {
        return $this->fecha_hoy;
    }

    // Método para obtener el correo.
    public function getCorreo()
    {
        return $this->correo;
    }

    //Metodo para validar el codigo de autenticacion
    public function checkAuthenticationCode($value)
    {
        return true;
//        if (Validator::validateNumberArray($value)) {
//            return true;
//        } else {
//            $this->data_error = 'Ingresa solo números y verifica que tu código tenga como máximo  números.';
//            return false;
//        }
    }
    //////////////////////////////////////////////////////////////////////////

    //Funcion para generar y guardar el codigo de autenticacion.
    //Devuelve el codigo QR.
    public function saveAuthenticationCode()
    {
        //Iniciamos la clase de la libreria Google2FA.
        $google2fa = new \PragmaRX\Google2FAQRCode\Google2FA();

        //Genera el codigo secreto
        $secret_code = $google2fa->generateSecretKey();

        //Guarda el codigo secreto en la base de datos.
        if($this->saveCode($secret_code)){
            //Genera el url  del codigo QR que el usuario escaneará.
            $qrCodeUrl = $google2fa->getQRCodeInline(
                'OneGoal',
                $this->correo,
                $secret_code
            );

            //echo '<img src="' . $qrCodeUrl . '" />';
            //Devuelve el codigo QR.
            return $qrCodeUrl;
        }else{
            throw new Exception("No se pudo actualizar el código secreto en la base de datos.");
        }
    }

    public function getAuthenticationCode($value)
    {
        //Obtenemos el codigo que esta en la base de datos.
        $secret = $this->getCode();

        //Verifica el codigo ingresado.
        $google2fa = new \PragmaRX\Google2FA\Google2FA();
        //Verifica que la clave ingresada por el usuario coincida con la que esta en la base de datos.
        $valid = $google2fa->verifyKey($secret, $value);

        if($valid){
            return true;
        }else{
            return false;
        }
    }
}
