<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/horarios_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla USUARIO.
 */
class HorariosData extends HorariosHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID del horario.
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del horario es incorrecto';
            return false;
        }
    }
    
    // Validación y asignación del nombre del horario.
    public function setNombre($value, $min = 2, $max = 60)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El nombre del horario debe ser un valor alfanumerico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->nombre = $value;
            return true;
        } else {
            $this->data_error = 'El nombre del horario debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setDia($value, $min = 2, $max = 20)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El dia debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->dia = $value;
            return true;
        } else {
            $this->data_error = 'El dia debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setHoraInicio($value)
    {
        if (Validator::validateTime($value)) {
            $this->horaInicial = $value;
            return true;
        } else {
            $this->data_error = 'La hora de incio  no es valida';
            return false;
        }
    }

    public function setHoraFinal($value)
    {
        if (Validator::validateTime($value)) {
            $this->horaFinal = $value;
            return true;
        } else {
            $this->data_error = 'La hora final no es valida';
            return false;
        }
    }


    // Validación y asignación del nombre del campo de entrenamiento.
    public function setCampo($value, $min = 2, $max = 100)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El nombre del campo de entrenamiento debe ser un valor alfanumerico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->campoEntrenamiento = $value;
            return true;
        } else {
            $this->data_error = 'El nombre del campo de entrenamiento debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }


    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
}
