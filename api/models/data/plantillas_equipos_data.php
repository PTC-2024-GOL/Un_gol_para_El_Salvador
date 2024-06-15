<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/plantillas_equipos_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla clientes.
 */
class PlantillasEquiposData extends PlantillasEquiposHandler
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
            $this->data_error = 'El identificador del detalle de plantilla es incorrecto';
            return false;
        }
    }

    // Validación y asignación del IDl cuerpo técnico.
    public function setPlantilla($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->plantilla = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la plantilla es incorrecto';
            return false;
        }
    }
    
    // Validación y asignación del IDl cuerpo técnico.
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

    // Validación y asignación del IDl cuerpo técnico.
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

    // Validación y asignación del IDl cuerpo técnico.
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