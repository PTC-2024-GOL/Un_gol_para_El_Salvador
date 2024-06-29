<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/caracteristicas_analisis_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla clientes.
 */
class CaracteristicasAnalisisData extends CaracteristicasAnalisisHandler
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
            $this->data_error = 'El identificador del identificador del analisis de las caracteristicas del jugador es incorrecto';
            return false;
        }
    }

    // Validación y asignación del ID de la caracteristica del jugador.
    public function setNota($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->nota = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la nota es incorrecto';
            return false;
        }
    }

    // Validación y asignación del ID de la caracteristica del jugador.
    public function setCaracteristica($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->caracteristica = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la caracteristica del jugador es incorrecto';
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

    // Validación y asignación del ID de la caracteristica del jugador.
    public function setEntrenamiento($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->entrenamiento = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del entrenamiento es incorrecto';
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