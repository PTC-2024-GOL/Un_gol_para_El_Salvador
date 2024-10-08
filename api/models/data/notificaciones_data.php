<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/notificaciones_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla USUARIO.
 */
class NotificacionesData extends NotificacionesHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la notificación es incorrecta';
            return false;
        }
    } 

    public function setTipo($value, $min = 1, $max = 30)
    {
        if (Validator::validateLength($value, $min, $max)) {
            $this->tipo = $value;
            return true;
        } else {
            $this->data_error = 'El tipo de notificación debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }
    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
}
