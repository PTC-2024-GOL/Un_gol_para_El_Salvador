<?php

// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/posiciones_handler.php');

/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla USUARIO.
 */

class PosicionesData extends PosicionesHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID de la posicion
    public function setIdPosicion($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idPosicion = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la posición es incorrecto';
            return false;
        }
    }

    // Validación y asignación del nombre del horario.
    public function setPosicion($value, $min = 2, $max = 60)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El nombre de la posición debe ser un valor alfanumerico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->posicion = $value;
            return true;
        } else {
            $this->data_error = 'El nombre de la posición debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setAreaJuego($value)
    {
        $this->area_de_juego = $value;
        return true;
    }

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }

}
