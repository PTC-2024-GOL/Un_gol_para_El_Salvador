<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/sub_contenidos_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla contenidos.
 */
class SubContenidosData extends SubContenidosHandler
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
            $this->data_error = 'El identificador del Subcontenido es incorrecto';
            return false;
        }
    }

    // Validación y asignación del nombre del SubContenido.
    public function setSubContenido($value, $min = 5, $max = 60)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El nombre debe ser un valor alfanumerico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->subContenido = $value;
            return true;
        } else {
            $this->data_error = 'El nombre debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Validación y asignación del ID del contenido.
    public function setIdContenido($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idContenido = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del contenido es incorrecto';
            return false;
        }
    }

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
}
