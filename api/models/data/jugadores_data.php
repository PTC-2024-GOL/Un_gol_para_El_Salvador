<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/jugadores_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla USUARIO.
 */
class JugadoresData extends JugadoresHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    // Atributo para almacenar el nombre del archivo de imagen.
    private $filename = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID del rol.
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la temporada es incorrecto';
            return false;
        }
    }

    // Validación y asignación del nombre del rol.
    public function setNombre($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El nombre debe ser un valor alfanumerico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->nombreJ = $value;
            return true;
        } else {
            $this->data_error = 'El nombre debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Validación y asignación del apellido.
    public function setApellido($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El apellido debe ser un valor alfanumerico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->apellidoJ = $value;
            return true;
        } else {
            $this->data_error = 'El apellido debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setCorreo($value, $min = 8, $max = 100)
    {
        if (!Validator::validateEmail($value)) {
            $this->data_error = 'El correo no es válido';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->correoJ = $value;
            return true;
        } else {
            $this->data_error = 'El correo debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

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

    public function setTelefonoEmergencia($value)
    {
        if (Validator::validatePhone($value)) {
            $this->telefono_emergencia = $value;
            return true;
        } else {
            $this->data_error = 'El teléfono debe tener el formato (2, 6, 7)###-####';
            return false;
        }
    }

    public function setObservacionMedica($value, $min = 2, $max = 200)
    {
     if (Validator::validateLength($value, $min, $max)) {
            $this->observacion_medica = $value;
            return true;
        } else {
            $this->data_error = 'La observación debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setTipoSangre($value, $min = 2, $max = 10)
    {
        if (!Validator::validateStringText($value)) {
            $this->data_error = 'El tipo de sangre debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->tipo_sangreJ = $value;
            return true;
        } else {
            $this->data_error = 'El tipo de sangre debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }


    public function setDorsal($value)
    {
        if (Validator::validatePositiveNumber2($value)) {
            $this->dorsalJ = $value;
            return true;
        } else {
            $this->data_error = 'El número de dorsal debe ser mayor a 0 y menor a 100';
            return false;
        }
    }

    public function setEstatus($value, $min = 2, $max = 30)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El estatus debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->estatusJ = $value;
            return true;
        } else {
            $this->data_error = 'El estatus debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setGenero($value, $min = 2, $max = 30)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El nombre del género debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->generoJ = $value;
            return true;
        } else {
            $this->data_error = 'El nombre del género debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setPerfil($value, $min = 2, $max = 30)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El perfil del jugador debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->perfilJ = $value;
            return true;
        } else {
            $this->data_error = 'El perfil del jugador debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setBecado($value, $min = 2, $max = 30)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El nombre de la beca debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->becado = $value;
            return true;
        } else {
            $this->data_error = 'El nombre de la beca debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }


    // Validación para la fecha de nacimiento.
    public function setNacimiento($value)
    {
        if (!Validator::validateDate($value)) {
            $this->data_error = 'La fecha ingresada no es correcta, verifica nuevamente';
            return false;
        } else if (Validator::validatePlayerDateBirthday($value)){
            $this->nacimientoJ = $value;
            return true;
        } else{
            $this->data_error = 'El jugador debe ser mayor a los cinco años y menor a los 30 años';
            return false;
        }
    }

    // Validación y asignación del ID del rol.
    public function setIdPosicion1($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->posicionPrincipal = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la posición principal es incorrecta';
            return false;
        }
    }

    // Validación y asignación del ID del rol.
    public function setIdPosicion2($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->posicionSecundaria = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la posición secundaria es incorrecta';
            return false;
        }
    }

    public function setImagen($file, $filename = null)
    {
        if (Validator::validateImageFile($file, 1000)) {
            $this->fotoJ = Validator::getFilename();
            return true;
        } elseif (Validator::getFileError()) {
            $this->data_error = Validator::getFileError();
            return false;
        } elseif ($filename) {
            $this->fotoJ = $filename;
            return true;
        } else {
            $this->fotoJ = 'default.png';
            return true;
        }
    }

    public function setFilename()
    {
        if ($data = $this->readFilename()) {
            $this->filename = $data['foto_jugador'];
            return true;
        } else {
            $this->data_error = 'Jugador inexistente';
            return false;
        }
    }

    public function setClave($value, $name, $lastname, $birthday, $phone, $email)
    {
        if (Validator::validatePassword($value, $name, $lastname, $birthday, $phone, $email)) {
            $this->claveJ = password_hash($value, PASSWORD_DEFAULT);
            return true;
        } else {
            $this->data_error = Validator::getPasswordError();
            return false;
        }
    }


    // Método para obtener el nombre.
    public function getNombre()
    {
        return $this->nombreJ;
    }

    // Método para obtener el apellido.
    public function getApellido()
    {
        return $this->apellidoJ;
    }

    // Método para obtener la fecha de nacimiento.
    public function getNacimiento()
    {
        return $this->nacimientoJ;
    }

    // Método para obtener el correo.
    public function getTelefono()
    {
        return $this->telefono;
    }
    // Método para obtener el correo.
    public function getCorreo()
    {
        return $this->correoJ;
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
}
