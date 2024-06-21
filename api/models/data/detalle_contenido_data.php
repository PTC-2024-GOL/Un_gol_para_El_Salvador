<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/detalle_contenido_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla contenidos.
 */
class DetalleContenidoData extends DetalleContenidoHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID del Subcontenido.
    public function setIdDetalleContenido($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idDetalleContenido = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del detalle contenido es incorrecto';
            return false;
        }
    }

    public function setIdEntrenamiento($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idEntrenamiento = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del entrenamiento es incorrecto o esta nulo';
            return false;
        }
    }

    public function setIdJugador($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idJugador = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del jugador es incorrecto o esta nulo';
            return false;
        }
    }

    public function setIdTarea($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idTarea = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la tarea es incorrecto o esta nulo';
            return false;
        }
    }

    public function setIdSubContenido($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idSubContenido = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del subcontenido es incorrecto o esta nulo';
            return false;
        }
    }

    public function setIdEquipo($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idEquipo = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del equipo es incorrecto o esta nulo';
            return false;
        }
    }

    // Validación y asignación del peso
    public function setCantidadSubContenido($value, $min = 1, $max = 600)
    {
        if ((Validator::validateNaturalNumber($value)) && ($value > $min && $value < $max)) {
            $this->cantidadSubContenido = $value;
            return true;
        } else {
            $this->data_error = 'La cantidad de minutos del subcontenido es de ' . $min . ' como minimo y ' . $max . ' como máximo';
            return false;
        }
    }

    // Validación y asignación de la altura
    public function setCantidadTarea($value, $min = 1, $max = 600)
    {
        if ((Validator::validateNaturalNumber($value)) && ($value > $min && $value < $max)) {
            $this->cantidadTarea = $value;
            return true;
        } else {
            $this->data_error = 'La cantidad de minutos de la tarea es de ' . $min . ' como minimo y ' . $max . ' como máximo';
            return false;
        }
    }

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
}
