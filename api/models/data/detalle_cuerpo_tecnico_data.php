<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/detalle_cuerpo_tecnico_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla clientes.
 */
class DetalleCuerpoTecnicoData extends DetalleCuerpoTecnicoHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;
    // Atributo para almacenar el nombre del archivo de imagen.
    private $filename = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */

    // Validación y asignación del IDl cuerpo técnico.
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de detalle cuerpo técnico es incorrecto';
            return false;
        }
    }

    // Validación y asignación del IDl cuerpo técnico.
    public function setCuerpo($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->cuerpo = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del cuerpo técnico es incorrecto';
            return false;
        }
    }
    
    // Validación y asignación del IDl cuerpo técnico.
    public function setTecnico($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->tecnico = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del técnico es incorrecto';
            return false;
        }
    }

    // Validación y asignación del IDl cuerpo técnico.
    public function setRol($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->rol = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del rol es incorrecto';
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