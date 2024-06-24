<?php


// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/detalles_amonestaciones_handler.php');

/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla detalles_goles.
 */

class detallesAmonestacionesData extends detallesAmonestacionesHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */

    public function setIdDetalleAmonestacion($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idDetalleAmonestacion = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del tipo de amonestación es incorrecto';
            return false;
        }
    }

    public function setIdParticipacion($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idParticipacion = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la participación es incorrecta';
            return false;
        }
    }

    public function setAmonestacion($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El nombre debe ser un valor alfanumerico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->amonestacion = $value;
            return true;
        } else {
            $this->data_error = 'El nombre debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setNumeroAmonestacion($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->numeroAmonestaciones = $value;
            return true;
        } else {
            $this->data_error = 'Ingresa un número entero';
            return false;
        }
    }

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
}