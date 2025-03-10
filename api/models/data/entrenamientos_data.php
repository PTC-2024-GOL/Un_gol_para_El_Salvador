<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/entrenamientos_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla contenidos.
 */
class EntrenamientosData extends EntrenamientosHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID del Subcontenido.
    public function setIdEntrenamiento($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idEntrenamiento = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del entrenamiento es incorrecto';
            return false;
        }
    }

    public function setFechaEntrenamiento($value)
    {
        if (Validator::validateDate($value)) {
            $this->fechaEntrenamiento = $value;
            return true;
        } else {
            $this->data_error = 'La fecha del entrenamiento es invalida';
            return false;
        }
    }

    // Validación y asignación del nombre del SubContenido.
    public function setSesion($value, $min = 5, $max = 10)
    {
        if (Validator::validateLength($value, $min, $max)) {
            $this->sesion = $value;
            return true;
        } else {
            $this->data_error = 'La Sesion es incorrecta';
            return false;
        }
    }

    // Validación y asignación del ID del contenido.
    public function setIdJornada($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idJornada = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la jornada es incorrecto';
            return false;
        }
    }

    public function setIdEquipo($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idEquipo = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del equipo es incorrecto';
            return false;
        }
    }

    public function setIdCategoria($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idCategoria = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la categoria es incorrecto';
            return false;
        }
    }

    public function setIdHorario($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idHorario = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del horario es incorrecto';
            return false;
        }
    }

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
}
