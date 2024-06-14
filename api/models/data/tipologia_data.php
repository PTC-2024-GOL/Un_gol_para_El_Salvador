<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/tipologia_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla clientes.
 */
class TipologiaData extends TipologiaHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;
    // Atributo para almacenar el nombre del archivo de imagen.
    private $filename = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */

    // Validación y asignación del ID de la tipología.
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la tipología es incorrecto';
            return false;
        }
    }
    
    // Validación y asignación del nombre de la tipología
    public function setNombre($value, $min = 2, $max = 60)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El nombre de la tipología debe ser un valor alfabético';
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

    // Método para obtener el nombre del archivo de imagen.
    public function getFilename()
    {
        return $this->filename;
    }
}