<?php


// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');

/*
 *  Clase para manejar el comportamiento de los datos de la tabla participaciones partidos.
 */

class ParticipacionesPartidosHandler
{

    protected $idParticipacion= null;
    protected $idPartido = null;
    protected $idJugador = null;
    protected $titular = null;
    protected $sustitucion = null;
    protected $minutosJugador = null;

    protected $asistencias = null;
    protected $estadoAnimo = null;
    protected $puntuacion = null;
    protected $idEquipo = null;
    protected $areaJuego = null;
    protected $idPosicion = null;


    /*
    *  Métodos para realizar las operaciones CRUD (create, read, update, and delete).
    */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = "SELECT * FROM vista_jugadores_por_equipo
                WHERE (nombre_jugador LIKE ? OR apellido_jugador LIKE ?) AND id_equipo = ?";
        $params = array($value, $value, $this->idEquipo);
        return Database::getRows($sql, $params);
    }


    //Función para insertar una participacion.
    public function createRow()
    {
        $sql = 'INSERT INTO participaciones_partidos(id_partido, id_jugador, id_posicion, titular, sustitucion, minutos_jugados, asistencias, estado_animo, puntuacion) VALUE (?,?,?,?,?,?,?,?,?)';
        $params = array(
            $this->idPartido,
            $this->idJugador,
            $this->titular,
            $this->sustitucion,
            $this->minutosJugador,
            $this->asistencias,
            $this->estadoAnimo,
            $this->puntuacion,
            $this->idPosicion
        );
        return Database::executeRow($sql, $params);
    }

    //Función para mostrar todos los jugadores de un equipo
    public function readAllByIdEquipo()
    {
        $sql = 'SELECT * FROM vista_jugadores_por_equipo
                WHERE id_equipo= ? ORDER BY dorsal_jugador ASC ';
        $params = array($this->idEquipo);
        return Database::getRows($sql, $params);
    }

    //Función para leer todos las participaciones.
    public function readAll()
    {
        $sql = 'SELECT * FROM participaciones_partidos;';
        return Database::getRows($sql);
    }

    //Función para mostrar una de las particpaciones
    public function readOne()
    {
        $sql = 'SELECT * FROM participaciones_partidos
                WHERE id_participacion= ?';
        $params = array($this->idParticipacion);
        return Database::getRow($sql, $params);
    }

    public function readByPlayerArea()
    {
        $sql = 'SELECT * FROM vista_jugadores_por_equipo
                WHERE area_de_juego = ? AND id_equipo = ?';
        $params = array($this->areaJuego, $this->idEquipo);
        return Database::getRows($sql, $params);
    }


    //Función para actualizar las participaciones.
    public function updateRow()
    {
        $sql = 'UPDATE participaciones_partidos
        SET titular = ?, sustitucion = ?, minutos_jugados =?, asistencias = ?, estado_animo = ?, puntuacion = ?, id_posicion = ?
        WHERE id_participacion = ?';
        $params = array(
            $this->titular,
            $this->sustitucion,
            $this->minutosJugador,
            $this->asistencias,
            $this->estadoAnimo,
            $this->puntuacion,
            $this->idPosicion,
            $this->idParticipacion
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar una participacion
    public function deleteRow()
    {
        $sql = 'DELETE FROM participaciones_partidos WHERE id_participacion = ?';
        $params = array($this->idParticipacion);
        return Database::executeRow($sql, $params);
    }


}