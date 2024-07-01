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

    public function setAsistencia($value)
    {
        $this->asistencia = $value;
        return true;
    }

    public function setIdObservacion($value)
    {
        $this->observacion = $value;
        return true;
    }

    public function setIdAsistenciaBool($value)
    {
        $this->idAsistenciaBool = $value;
        return true;
    }
    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
}
