<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/jornadas_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla USUARIO.
 */
class JornadasData extends JornadasHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID de la temporada.
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la jornada es incorrecto';
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
            $this->nombre = $value;
            return true;
        } else {
            $this->data_error = 'El nombre debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Validación y asignación del IDl cuerpo técnico.
    public function setNumero($value, $min = 1 , $max = 100)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->numero = $value;
            if ($this->numero >= $min && $this->numero <= $max) {
                return true;
            } else {
                $this->data_error = 'El valor minimo del número de la jornada es ' . $min . ' y el maximo ' . $max;
                return false;
            }
        } else {
            $this->data_error = 'El número de la jornada es incorrecto';
            return false;
        }
    }

    // Validación y asignación del IDl cuerpo técnico.
    public function setPlantilla($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->plantilla = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la plantilla es incorrecto';
            return false;
        }
    }

    // Validación y asignación de la fecha de inicio de la jornada.
    public function setFechaInicio($value)
    {
        $minDate = '2019-01-01';
        $maxDate = date('Y-m-d', strtotime("+2 years"));
        if (Validator::validateDate($value) && $value >= $minDate && $value <= $maxDate) {
            $this->fechaInicio = $value;
            return true;
        } else {
            $this->data_error = 'La fecha de inicio no es valida';
            return false;
        }
    }


    // Validación y asignación de la fecha de inicio de la jornada.
    public function setFechaFin($value)
    {
        $minDate = '2019-01-01';
        $maxDate = date('Y-m-d', strtotime("+2 years"));
        if (Validator::validateDate($value) && $value >= $minDate && $value <= $maxDate) {
            $this->fechaFinal = $value;
            return true;
        } else {
            $this->data_error = 'La fecha final no es valida';
            return false;
        }
    }

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
}
