<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/estado_fisico_jugador_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla contenidos.
 */
class EstadoFisicoJugadorData extends EstadoFisicoJugadorHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID del Subcontenido.
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del estado fisico es incorrecto';
            return false;
        }
    }

    // Validación y asignación del ID del Subcontenido.
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


    // Validación y asignación del peso
    public function setPeso($value, $min = 40, $max = 200)
    {
        if ((Validator::validateNaturalNumber($value)) && ($value > $min && $value < $max)) {
            $this->altura = $value;
            $this->peso = $value;
            return true;
        } else {
            $this->data_error = 'El peso tiene datos irreales de, verifique que sea ' . $min . ' como minimo y ' . $max . ' como máximo'; 
            return false;
        }
    }

    // Validación y asignación de la altura
    public function setAltura($value, $min = 100, $max = 210)
    {
        if ((Validator::validateNaturalNumber($value)) && ($value > $min && $value < $max)) {
            $this->altura = $value;
            return true;
        } else {
            $this->data_error = 'La altura tiene datos irreales de, verifique que sea ' . $min . ' como minimo y ' . $max . ' como máximo'; 
            return false;
        }
    }
    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
}
