<?php

// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/categorias_handler.php');

class CategoriasData extends CategoriasHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID de la categoria.
    public function setIdCategoria($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idCategoria = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la categoría es incorrecto';
            return false;
        }
    }

    // Validación y asignación del nombre de la categoría.
    public function setNombreCategoria($value, $min = 2, $max = 80)
    {
        if (Validator::validateLength($value, $min, $max)) {
            $this->nombreCategoria = $value;
            return true;
        } else {
            $this->data_error = 'El nombre de la categoría debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Validación y asignación de la edad minima permitida.
    public function setEdadMinima($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->edadMinima = $value;
            return true;
        } else {
            $this->data_error = 'La edad mínima permitida de la categoría es incorrecta';
            return false;
        }
    }

    // Validación y asignación de la edad minima permitida.
    public function setEdadMaxima($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->edadMaxima = $value;
            return true;
        } else {
            $this->data_error = 'La edad máxima permitida de la categoría es incorrecta';
            return false;
        }
    }

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }

}
