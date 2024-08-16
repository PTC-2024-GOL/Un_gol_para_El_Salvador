<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/documentos_tecnicos_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla USUARIO.
 */
class DocumentosTecnicosData extends DocumentosTecnicosHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;
    private $filename = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID de la tarea.
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del documento es incorrecto';
            return false;
        }
    }

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del ID de la tarea.
    public function setTecnico($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->tecnico = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del tecnico es incorrecto';
            return false;
        }
    }

    // Validación y asignación del nombre del rol.
    public function setNombre($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El nombre debe ser un valor alfanumerico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->nombre = $value;
            return true;
        } else {
            $this->data_error = 'El nombre debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    
    // Validación y asignación del ID del Subcontenido.
    public function setArchivo($file, $filename = null)
    {
        if (Validator::validateImageFile($file, 1000)) {
            $this->imagen = Validator::getFilename();
            return true;
        } elseif (Validator::getFileError()) {
            $this->data_error = Validator::getFileError();
            return false;
        } elseif ($filename) {
            $this->imagen = $filename;
            return true;
        } else {
            $this->imagen = 'default.png';
            return true;
        }
    }
    
    public function setFilename()
    {
        if ($data = $this->readFilename()) {
            $this->filename = $data['ARCHIVO'];
            return true;
        } else {
            $this->data_error = 'Archivo inexistente para la imagen';
            return false;
        }
    }

    public function getFilename()
    {
        return $this->filename;
    }

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
    
}
