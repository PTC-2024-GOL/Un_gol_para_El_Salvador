<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/partidos_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla contenidos.
 */
class PartidosData extends PartidosHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;
    private $filename = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID del Subcontenido.
    public function setIdPartido($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idPartido = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del partido es incorrecto';
            return false;
        }
    }

    public function setIdEquipo($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idEquipo = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del equipo es incorrecto o esta nulo';
            return false;
        }
    }

    public function setIdJornada($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idJornada = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la jornada es incorrecto o esta nulo';
            return false;
        }
    }

    // Validación y asignación del ID del Subcontenido.
    public function setlogoRival($file, $filename = null)
    {
        if (Validator::validateImageFile($file, 1000)) {
            $this->logoRival = Validator::getFilename();
            return true;
        } elseif (Validator::getFileError()) {
            $this->data_error = Validator::getFileError();
            return false;
        } elseif ($filename) {
            $this->logoRival = $filename;
            return true;
        } else {
            $this->logoRival = 'default.png';
            return true;
        }
    }

    public function setFilename()
    {
        if ($data = $this->readFilename()) {
            $this->filename = $data['logo_rival'];
            return true;
        } else {
            $this->data_error = 'Partido inexistente pa la imagen perro';
            return false;
        }
    }

    public function getFilename()
    {
        return $this->filename;
    }

    // Validación y asignación del peso
    public function setCancha($value, $min = 3, $max = 100)
    {
        if (Validator::validateLength($value, $min, $max)) {
            $this->canchaPartido = $value;
            return true;
        } else {
            $this->data_error = 'El nombre de la cancha debe tener una longitud entre ' . $min . ' y ' . $max . ' caracteres';
            return false;
        }
    }

    public function setRivalEquipo($value, $min = 3, $max = 100)
    {
        if (Validator::validateLength($value, $min, $max)) {
            $this->rivalPartido = $value;
            return true;
        } else {
            $this->data_error = 'El nombre del rival debe tener una longitud entre ' . $min . ' y ' . $max . ' caracteres';
            return false;
        }
    }

    // Validación y asignación de la altura
    public function setResultadoPartido($value, $min = 3, $max = 9)
    {
        if (Validator::validateLength($value, $min, $max)) {
            $this->resultadoPartido = $value;
            return true;
        } else {
            $this->data_error = 'El partido supera la cantidad de caracteres lógicos ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setLocalidad($value, $min = 4, $max = 10)
    {
        if (Validator::validateLength($value, $min, $max)) {
            $this->localidadPartido = $value;
            return true;
        } else {
            $this->data_error = 'Te atrape inyección sql';
            return false;
        }
    }

    public function setTipoResultadoPartido($value, $min = 4, $max = 9)
    {
        if (Validator::validateLength($value, $min, $max)) {
            $this->tipoResultadoPartido = $value;
            return true;
        } else {
            $this->data_error = 'Te atrape inyección sql';
            return false;
        }
    }

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
}
