<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/equipos_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla USUARIO.
 */
class EquiposData extends EquiposHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    // Atributo para almacenar el nombre del archivo de imagen.
    private $filename = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID del equipo.
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del equipo es incorrecto';
            return false;
        }
    }

    // Validación y asignación del nombre del equipo.
    public function setNombreEquipo($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El nombre debe ser un valor alfanumerico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->nombreEquipo = $value;
            return true;
        } else {
            $this->data_error = 'El nombre debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }


    public function setGeneroEquipo($value, $min = 2, $max = 30)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El nombre del género debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->generoEquipo = $value;
            return true;
        } else {
            $this->data_error = 'El nombre del género debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setTelefono($value)
    {
        if (Validator::validatePhone($value)) {
            $this->telefonoEquipo = $value;
            return true;
        } else {
            $this->data_error = 'El teléfono debe tener el formato (2, 6, 7)###-####';
            return false;
        }
    }

    public function setIdCuerpoTecnico($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idCuerpoTecnico = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del cuerpo técnico es incorrecto';
            return false;
        }
    }

    public function setIdCategoria($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idCategoria = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la categoría es incorrecta';
            return false;
        }
    }

    // Validación y asignación de la imagen del administrador.
    public function setLogoEquipo($file, $filename = null)
    {
        if (Validator::validateImageFile($file, 1000)) {
            $this->logoEquipo = Validator::getFilename();
            return true;
        } elseif (Validator::getFileError()) {
            $this->data_error = Validator::getFileError();
            return false;
        } elseif ($filename) {
            $this->logoEquipo = $filename;
            return true;
        } else {
            $this->logoEquipo = 'default.png';
            return true;
        }
    }

    public function setFilename()
    {
        if ($data = $this->readFilename()) {
            $this->filename = $data['logo_equipo'];
            return true;
        } else {
            $this->data_error = 'Imagen inexistente';
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
