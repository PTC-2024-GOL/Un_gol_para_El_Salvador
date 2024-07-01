<?php
// Se incluye la clase para trabajar con la base de datos.
require_once ('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla Subcontenido.
 */
class AsistenciasrHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $idJugador = null;
    protected $idEntrenamiento = null;
    protected $idHorario = null;
    protected $asistencia = null;
    protected $observacion = null;
    protected $idAsistencia = null;
    protected $idAsistenciaBool = null;

    //Función para insertar las asistencias

    public function createRow()
    {
        $sql = 'CALL Asistencia (?, ?, ?, ?, ?, ?, ?);';
        $params = array(
            $this->idEntrenamiento,
            $this->idJugador,
            $this->idHorario,
            $this->asistencia,
            $this->observacion,
            $this->idAsistencia,
            $this->idAsistenciaBool
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer las asistencias de un entrenamiento
    //Versión por default 
    public function readAlldefault()
    {
        $sql = "SELECT id_asistencia, observacion, asistencia, id, jugador, id_entrenamiento 
        FROM vista_asistencias_default WHERE id_entrenamiento = ?;";
        $params = array($this->idEntrenamiento);
        return Database::getRows($sql, $params);
    }

    //Función para leer las asistencias de un entrenamiento
    //Versión cuando hay registros de asistencias 
    public function readAll()
    {
        $sql = "SELECT id_asistencia, observacion, asistencia, id, jugador, id_entrenamiento 
        FROM vista_asistencias WHERE id_entrenamiento = ?;";
        $params = array($this->idEntrenamiento);
        return Database::getRows($sql, $params);
    }

    //Función para leer si una asistencia ya se ha registrado
    public function readOne()
    {
        $sql = "SELECT id_entrenamiento, id_horario, asistencia 
        FROM vista_asistencias_entrenamiento WHERE id_entrenamiento = ?;";
        $params = array($this->idEntrenamiento);
        return Database::getRow($sql, $params);
    }
}
