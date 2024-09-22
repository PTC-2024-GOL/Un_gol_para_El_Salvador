<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/contenidos_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla contenidos.
 */
class ContenidosData extends ContenidosHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID del contenido.
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del contenido es incorrecto';
            return false;
        }
    }

    // Validación y asignación del nombre del contenido.
   

    public function setMomento($value)
    {
        if (Validator::validateAlphanumeric($value)) {
            $this->momento = $value;
            return true;
        } else {
            $this->data_error = 'Elije otra opción';
            return false;
        }
    }
    public function setZona($value)
    {
        if (Validator::validateAlphanumeric($value)) {
            $this->zona = $value;
            return true;
        } else {
            $this->data_error = 'Elije otra opción';
            return false;
        }
    }

    

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
}
