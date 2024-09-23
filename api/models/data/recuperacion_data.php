<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/recuperacion_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla administradores.
 */
class RecuperacionData extends RecuperacionHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;
    // Atributo para almacenar el nombre del archivo de imagen.
    private $filename = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID del administrador.
    public function setIdUsuario($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idUsuario = $value;
            return true;
        } else {
            $this->data_error = 'El identificador es incorrecto';
            return false;
        }
    }

    public function setNivel($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->nivel = $value;
            return true;
        } else {
            $this->data_error = 'El nivel es incorrecto';
            return false;
        }
    }

    // Validación y asignación del apellido del administrador.
    public function setFecha($value, $min = 2, $max = 50)
    {
        $this->fechaRegistro = $value;
        return true;
    }

    // Validación y asignación del correo del administrador.
    public function setCorreo($value, $min = 8, $max = 100)
    {
        if (!Validator::validateEmail($value)) {
            $this->data_error = 'El correo no es válido';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->correo = $value;
            return true;
        } else {
            $this->data_error = 'El correo debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Validación y asignación de la clave de los niveles
    public function setClave($value, $name, $lastname, $birthday, $phone, $email)
    {
        if (Validator::validatePassword($value, $name, $lastname, $birthday, $phone, $email)) {
            $this->contrasena = password_hash($value, PASSWORD_DEFAULT);
            return true;
        } else {
            $this->data_error = Validator::getPasswordError();
            return false;
        }
    }


    // Método para obtener el nombre.
    public function getNombre()
    {
        return $this->nombre;
    }

    // Método para obtener el apellido.
    public function getApellido()
    {
        return $this->apellido;
    }

    // Método para obtener la fecha de nacimiento.
    public function getNacimiento()
    {
        return $this->nacimiento;
    }

    // Método para obtener el correo.
    public function getTelefono()
    {
        return $this->telefono;
    }
    // Método para obtener el correo.
    public function getCorreo()
    {
        return $this->correo;
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
