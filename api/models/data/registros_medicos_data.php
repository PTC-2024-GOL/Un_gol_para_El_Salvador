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
    $minDate = '2019-01-01';
    $maxDate = date('Y-m-d', strtotime("+2 years"));
 
    if (Validator::validateDate($value) && $value >= $minDate && $value <= $maxDate) {
        $this->fechaLesion = $value;
        return true;
    } else {
        $this->data_error = 'La fecha de lesión no es válida. Debe estar entre ' . $minDate . ' y ' . $maxDate . '.';
        return false;
    }
}
 
    // Validación y asignación de la fecha de registro de la lesión del registro médico.
    public function setFechaRegistro($value)
{
    $minDate = '2019-01-01';
    $maxDate = date('Y-m-d', strtotime("+2 years"));
 
    if (Validator::validateDate($value) && $value >= $minDate && $value <= $maxDate) {
        $this->fechaRegistro = $value;
        return true;
    } else {
        $this->data_error = 'La fecha de registro no es válida. Debe estar entre ' . $minDate . ' y ' . $maxDate . '.';
        return false;
    }
}
 
    // Validación y asignación de los días lesionado.
    public function setDiasLesionado($value, $min = 1, $max = 500)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->diasLesionado = $value;
            if ($this->diasLesionado >= $min && $this->diasLesionado <= $max) {
                return true;
            } else {
                $this->data_error = 'El valor mínimo de los días lesionados debe ser de ' . $min . ' día y el máximo de ' . $max;
                return false;
            }
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
        $minDate = '2019-01-01';
        $maxDate = date('Y-m-d', strtotime("+2 years"));
   
        if (Validator::validateDate($value) && $value >= $minDate && $value <= $maxDate) {
            $this->retornoEntreno = $value;
            return true;
        } else {
            $this->data_error = 'La fecha de retorno a entreno no es válida. Debe estar entre ' . $minDate . ' y ' . $maxDate . '.';
            return false;
        }
    }
 
 
    public function setRetornoPartido($value)
    {
        if ($value === "" || Validator::validateString($value)) {
            $this->retornoPartido = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de retorno partido es incorrecto';
            return false;
        }
    }
 
 

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
}