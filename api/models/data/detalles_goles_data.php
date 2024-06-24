<?php

// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/detalles_goles_handler.php');

/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla detalles_goles.
 */

class detallesGolesData extends detallesGolesHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */

    public function setIdDetalleGol($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idDetalleGol = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del tipo de gol es incorrecto';
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

    public function setCantidadGol($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->cantidadTipoGol = $value;
            return true;
        } else {
            $this->data_error = 'Ingresa un número entero';
            return false;
        }
    }

    public function setIdTipoGol($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idTipoGol = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del tipo de gol es incorrecta';
            return false;
        }
    }
    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
}