<?php

// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/horarios_categoria_handler.php');

/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla USUARIO.
 */

class HorariosCateData extends HorariosCateHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID del horario_categoria.
    public function setIdHorarioCate($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idHorarioCategoria = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del horario de la categoría es incorrecto';
            return false;
        }
    }

    // Validación y asignación del ID de la categoría.
    public function setCategoria($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->categoria = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la categoría es incorrecto';
            return false;
        }
    }

    // Validación y asignación del ID del horario.
    public function setHorario($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->horario = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del horario es incorrecto';
            return false;
        }
    }

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }

}
