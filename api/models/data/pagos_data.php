<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/pagos_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla subtipología.
 */
class PagoData extends PagoHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;
    // Atributo para almacenar el nombre del archivo de imagen.
    private $filename = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */

    // Validación y asignación del ID de la pago.
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de pago es incorrecto';
            return false;
        }
    }

    // Validación y asignación de la fecha de pago .
    public function setFecha($value)
    {
        if (Validator::validateDate($value)) {
            $this->fecha = $value;
            return true;
        } else {
            $this->data_error = 'La fecha de pago es valida';
            return false;
        }
    }

    // Validación y asignación del pago.
    public function setCantidad($value, $min = 1)
    {
        if (Validator::validateMoney($value)) {
            $this->cantidad = $value;
            if ($this->cantidad >= $min) {
                return true;
            } else {
                $this->data_error = 'La cantidad del pago minimo es $' . $min;
                return false;
            }
        } else {
            $this->data_error = 'La cantidad del pago debe ser un valor numérico';
            return false;
        }
    }

    // Validación y asignación del ID de la pago.
    public function setTardio($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->tardio = $value;
            return true;
        } else {
            $this->data_error = 'El identificador es incorrecto';
            return false;
        }
    }

    // Validación y asignación de la mora.
    public function setMora($value)
    {
        if (Validator::validateMoney($value)) {
            $this->mora = $value;
            return true;
        } else {
            $this->data_error = 'La cantidad de la mora debe ser un valor numérico';
            return false;
        }
    }

    // validación y asignacion del mes
    public function setMes($value)
    {
        if (Validator::validateString($value)) {
            $this->mes = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del mes es incorrecto';
            return false;
        }
    }

    // Validación y asignación del ID del jugador.
    public function setJUgador($value)
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