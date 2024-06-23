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

    public function setDia($value)
    {
        $this->dia = $value;
        return true;
    }

    // Validación y asignación de la hora de inicio del horario.
    public function setHoraInicio($value)
    {
        $this->hora_inicial = $value;
        return true;
    }

    // Validación y asignación de la hora de inicio del horario.
    public function setHoraFinal($value)
    {
        $this->hora_final = $value;
        return true;
    }

    // Validación y asignación del nombre del campo de entrenamiento.
    public function setCampo($value, $min = 2, $max = 100)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El nombre del campo de entrenamiento debe ser un valor alfanumerico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->campo_entrenamiento = $value;
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
