<?php

// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/participaciones_partidos_handler.php');

/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla contenidos.
 */

class ParticipacionesPartidosData extends ParticipacionesPartidosHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */
    // Validación y asignación del id de la participacion.
    public function setIdParticipacion($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idParticipacion = $value;
            return true;
        } else {
            $this->data_error = 'Aún no has ingresado la participación del jugador. Ingresa antes su participación';
            return false;
        }
    }

    public function setIdPartido($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idPartido = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del partido es incorrecto';
            return false;
        }
    }

    public function setIdEquipo($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idEquipo = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del equipo es incorrecto';
            return false;
        }
    }

    public function setIdJugador($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idJugador = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del jugador es incorrecto o esta nulo';
            return false;
        }
    }

    public function setTitularidad($value)
    {
        if (Validator::validateBoolean($value)) {
            $this->titular = $value;
            return true;
        } else {
            $this->data_error = 'Esto no es un booleano';
            return false;
        }
    }

    public function setSustitucion($value)
    {
        if (Validator::validateBoolean($value)) {
            $this->sustitucion = $value;
            return true;
        } else {
            $this->data_error = 'Esto no es un booleano';
            return false;
        }
    }

    public function setMinutosJugados($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->minutosJugador = $value;
            return true;
        } else {
            $this->data_error = 'Ingresa un número entero';
            return false;
        }
    }

    public function setAsistencias($value)
    {
        if (Validator::validatePositiveNumber($value)) {
            $this->asistencias = $value;
            return true;
        } else {
            $this->data_error = 'Ingresa un número entero';
            return false;
        }
    }

    public function setEstadoAnimo($value, $min = 3, $max = 50)
    {
        if (Validator::validateLength($value, $min, $max)) {
            $this->estadoAnimo = $value;
            return true;
        } else {
            $this->data_error = 'El estado de animo debe tener una longitud entre ' . $min . ' y ' . $max . ' caracteres';
            return false;
        }
    }

    public function setPuntuacion($value)
    {
        if (Validator::validatePositiveDecimal($value)) {
            $this->puntuacion = $value;
            return true;
        } else {
            $this->data_error = 'Ingrese un número decimal válido';
            return false;
        }
    }

    public function setAreaJuego($value)
    {
        $this->areaJuego = $value;
        return true;

    }


    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
}
