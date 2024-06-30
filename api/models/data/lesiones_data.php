<?php

// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/lesiones_handler.php');

/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla USUARIO.
 */

class LesionesData extends LesionesHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID de la lesion
    public function setIdLesion($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idLesion = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la lesión es incorrecta';
            return false;
        }
    }

    public function setIdTipoLesion($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idTipoLesion = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del tipo de la lesión es incorrecto';
            return false;
        }
    }

    public function setIdSubTipologia($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idSubtipologia = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la subtipología es incorrecta';
            return false;
        }
    }


    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }

}
