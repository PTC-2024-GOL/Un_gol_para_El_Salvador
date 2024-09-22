<?php
// Se incluye la clase para validar los datos de entrada.
require_once ('../../helpers/validator.php');
// Se incluye la clase padre.
require_once ('../../models/handler/asistencias_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla contenidos.
 */
class AsistenciasData extends AsistenciasrHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID del Subcontenido.
    public function setIdAsistencia($value)
    {
        $this->idAsistencia = $value;
        return true;
    }

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


    // Validación y asignación del ID del Subcontenido.
    public function setIdJugador($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idJugador = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del jugador es incorrecto';
            return false;
        }
    }
    // Validación y asignación del ID del Subcontenido.
    public function setIdHorario($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idHorario = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del entrenamiento es incorrecto';
            return false;
        }
    }

    public function setAsistencia($value, $min = 2, $max = 60)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El nombre de la asistecia debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->asistencia = $value;
            return true;
        } else {
            $this->data_error = 'La asistencia debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setIdObservacion($value)
    {
        if (Validator::validateAlphabetic($value)) {
            $this->observacion = $value;
            return true;
        } else {
            $this->data_error = 'La observación debe ser un valor alfabético';
            return false;
        }
    }

    public function setIdAsistenciaBool($value)
    {
        if (Validator::validateBoolean($value)) {
            $this->idAsistenciaBool = $value;
            return true;
        } else {
            $this->data_error = 'El identificador es incorrecto';
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
    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
}
