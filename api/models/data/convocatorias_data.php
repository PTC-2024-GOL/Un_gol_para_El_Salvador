<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/convocatorias_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla clientes.
 */
class ConvocatoriasData extends ConvocatoriasHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;
    // Atributo para almacenar el nombre del archivo de imagen.
    private $filename = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */

    // Validación y asignación del ID de la caracteristica del jugador.
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del identificador de la convocatoria del jugador es incorrecto';
            return false;
        }
    }

    // Validación y asignación del estado del administrador.
    public function setEstado($value)
    {
        if (Validator::validateBoolean($value)) {
            $this->estado = $value;
            return true;
        } else {
            $this->data_error = 'El estado no es booleano';
            return false;
        }
    }

    // Validación y asignación del ID de la caracteristica del jugador.
    public function setPartido($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->partido = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del partido es incorrecto';
            return false;
        }
    }

    // Validación y asignación del ID de la caracteristica del jugador.
    public function setJugador($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->jugador = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del jugador es incorrecto';
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