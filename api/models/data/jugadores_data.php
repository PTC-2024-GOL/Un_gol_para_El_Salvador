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

    public function setDorsal($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->dorsalJ = $value;
            return true;
        } else {
            $this->data_error = 'El número de dorsal no es un número natural';
            return false;
        }
    }

    public function setEstatus($value)
    {
        $this->estatusJ = $value;
        return true;
    }

    public function setGenero($value)
    {
        $this->generoJ = $value;
        return true;
    }

    public function setPerfil($value)
    {
        $this->perfilJ = $value;
        return true;
    }

    public function setBecado($value)
    {
        $this->becado = $value;
        return true;
    }

    // Validación para la fecha de nacimiento.
    public function setNacimiento($value)
    {
        if (Validator::validateDate($value)) {
            $this->nacimientoJ = $value;
            return true;
        } else {
            $this->data_error = 'La fecha ingresada no es correcto, verifica nuevamente';
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

    public function setClave($value)
    {
        if (Validator::validatePassword($value)) {
            $this->claveJ = password_hash($value, PASSWORD_DEFAULT);
            return true;
        } else {
            $this->data_error = Validator::getPasswordError();
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
}
