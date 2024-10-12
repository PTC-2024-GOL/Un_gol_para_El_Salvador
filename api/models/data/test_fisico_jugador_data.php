<?php

// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/test_fisico_jugador_handler.php');

/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla USUARIO.
 */

class TestData extends testHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID del registro médico
    public function setIdTest($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idTest = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del test es incorrecto';
            return false;
        }
    }

    // Validación y asignación del ID del jugador
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

    // Validación y asignación de respuesta.
    public function setRespuesta($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->respuesta = $value;
            return true;
        } else {
            $this->data_error = 'El número de la respuesta es incorrecto';
            return false;
        }
    }

    // Validación y asignación del nombre del test.
    public function setPregunta($value, $min = 5, $max = 2000)
    {
        if (!Validator::validateTextOrtograpic($value)) {
            $this->data_error = 'La pregunta debe escribirse correctamente';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->pregunta = $value;
            return true;
        } else {
            $this->data_error = 'La pregunta debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }


    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }

}
