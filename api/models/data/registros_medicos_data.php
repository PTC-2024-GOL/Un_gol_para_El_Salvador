<?php

// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/registros_medicos_handler.php');

/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla USUARIO.
 */

class RegistrosData extends RegistrosHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID del registro médico
    public function setIdRegistroMedico($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idRegistroMedico = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del registro médico es incorrecto';
            return false;
        }
    }

    // Validación y asignación del ID del jugador
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

    // Validación y asignación de la fecha de lesión del registro médico.
    public function setFechaLesion($value)
    {
        if (Validator::validateDate($value)) {
            $this->fechaLesion = $value;
            return true;
        } else {
            $this->data_error = 'La fecha de la lesión no es valida';
            return false;
        }
    }

    // Validación y asignación de la fecha de registro de la lesión del registro médico.
    public function setFechaRegistro($value)
    {
        if (Validator::validateDate($value)) {
            $this->fechaRegistro = $value;
            return true;
        } else {
            $this->data_error = 'La fecha de registro de la lesión no es valida';
            return false;
        }
    }

    // Validación y asignación de los días lesionado.
    public function setDiasLesionado($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->diasLesionado = $value;
            return true;
        } else {
            $this->data_error = 'El número de los días lesionado es incorrecto';
            return false;
        }
    }

    // Validación y asignación del ID de lesion
    public function setLesion($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->lesion = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la lesión es incorrecto';
            return false;
        }
    }

    // Validación y asignación de la fecha de retorno a entreno del registro médico.
    public function setRetornoEntreno($value)
    {
        if (Validator::validateDate($value)) {
            $this->retornoEntreno = $value;
            return true;
        } else {
            $this->data_error = 'La fecha de registro de la lesión no es valida';
            return false;
        }
    }

    // Validación y asignación del retorno a partido.
    public function setRetornoPartido($value)
    {
            $this->retornoPartido = $value;
            return true;
    }

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }

}
