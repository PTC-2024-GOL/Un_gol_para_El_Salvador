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
    protected $idEquipo = null;

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
    public function readAllTeam()
    {
        $sql = "SELECT * FROM vista_jugadores_equipo_movil WHERE id_equipo = ?;";
        $params = array($this->idEntrenamiento);
        return Database::getRows($sql, $params);
    }

    //Función para leer si una asistencia ya se ha registrado
    public function readOne()
    {
        $sql = "SELECT id_entrenamiento, id_horario, asistencia, fecha_entrenamiento 
        FROM vista_asistencias_entrenamiento WHERE id_entrenamiento = ?;";
        $params = array($this->idEntrenamiento);
        return Database::getRow($sql, $params);
    }

    //Función para leer las asistencias de un jugador
    public function readOnePlayer()
    {
        $sql = "SELECT observacion_asistencia, asistencia, fecha FROM asistencias_por_jugador WHERE id_jugador = ? ORDER BY fecha_asistencia DESC;";
        $params = array($this->idJugador);
        return Database::getRows($sql, $params);
    }

    //Función para leer las estadisticas de un jugador en torno a asistencias (esto pertenece a movil)
    public function readOnePlayerStadistic()
    {
        $sql = "SELECT cantidad_asistencia, porcentaje_asistencia, cantidad_ausencia_injustificada, porcentaje_ausencia_injustificada, cantidad_enfermedad,
            porcentaje_enfermedad, cantidad_otro, porcentaje_otro, cantidad_estudio FROM vista_asistencias_por_jugador WHERE id_jugador = ?";
        $params = array($this->idJugador);
        return Database::getRow($sql, $params);
    }

    //Función para rellenar la opcion del combobox con horarios de un equipo, 
    //visualmente se usarán id_entrenamiento como value y horario como text.  Esta función es para "elegir horario"
    public function readOneHorario()
    {
        $sql = "SELECT 
                id_entrenamiento,
                horario,
                fecha_entrenamiento,
                id_equipo
                FROM vista_horarios_equipos WHERE id_equipo = ? AND fecha_entrenamiento <= CURDATE()
                ORDER BY fecha_entrenamiento DESC;";
        $params = array($this->idEquipo);
        return Database::getRows($sql, $params);
    }
}
