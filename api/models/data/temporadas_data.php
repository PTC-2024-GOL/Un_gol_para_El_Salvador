<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/temporadas_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla USUARIO.
 */
class TemporadasData extends TemporadasHandler
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
            $this->data_error = 'El identificador de la temporada es incorrecto';
            return false;
        }
    }

    // Validación y asignación del nombre del rol.
    public function setNombre($value, $min = 2, $max = 50)
    {
        if (!Validator::validateStringText($value)) {
            $this->data_error = 'El nombre debe ser una cadena de texto que conste de (letras, dígitos, espacios en blanco, signos de puntuación y guiones)';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->nombre = $value;
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
