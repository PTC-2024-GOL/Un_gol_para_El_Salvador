<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/palmares_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla USUARIO.
 */
class PalmaresData extends PalmaresHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID de la tarea.
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del reconocimiento es incorrecto';
            return false;
        }
    }

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID de la tarea.
    public function setEquipo($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->equipo = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del equipo es incorrecto';
            return false;
        }
    }

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID de la tarea.
    public function setTemporada($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->temporada = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la temporada es incorrecto';
            return false;
        }
    }
    // Validación y asignación del nombre del rol.
    public function setLugar($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El lugar debe ser un valor alfanumerico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->lugar = $value;
            return true;
        } else {
            $this->data_error = 'El lugar debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
}
