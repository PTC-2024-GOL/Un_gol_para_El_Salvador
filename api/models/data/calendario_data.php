<?php

// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/calendario_handler.php');

/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla calendario.
 */

class CalendarioData extends CalendarioHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID del calendario.
    public function setIdCalendario($value)
    {
        $this->idCalendario = $value;
        return true;
    }

    public function setTitulo($value, $min = 5, $max = 50)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El nombre debe ser un valor alfanumerico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->titulo = $value;
            return true;
        } else {
            $this->data_error = 'El nombre debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setFechaInicial($value)
    {
        if(!Validator::validateDateTime($value)){
            $this->data_error = 'La fecha ingresada no esta en el formato correcto';
        } else {
            $this->fechaInicio = $value;
        }
    }

    public function setFechaFinal($value)
    {
        if(!Validator::validateDateTime($value)){
            $this->data_error = 'La fecha ingresada no esta en el formato correcto';
        } else {
            $this->fechaFinal = $value;
        }
    }

    public function setColor($value, $min = 5, $max = 50)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El nombre del color debe ser un valor alfanumerico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->color = $value;
            return true;
        } else {
            $this->data_error = 'El nombre del color debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
}
