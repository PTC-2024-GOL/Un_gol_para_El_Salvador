<?php


// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/tipos_goles_handler.php');

/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla USUARIO.
 */

class TiposGolesData extends TiposGolesHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID del tipo de gol
    public function setIdTipoGol($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idTipoGol = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la tipo de gol es incorrecto';
            return false;
        }
    }

    public function setIdTipoJugada($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idTipoJugada = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la tipo de jugada es incorrecto';
            return false;
        }
    }

    // Validación y asignación del nombre de la jugada.
    public function setNombreGol($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El nombre debe ser un valor alfanumerico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->nombreGol = $value;
            return true;
        } else {
            $this->data_error = 'El nombre debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }

}
