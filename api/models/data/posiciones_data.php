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

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }

}
