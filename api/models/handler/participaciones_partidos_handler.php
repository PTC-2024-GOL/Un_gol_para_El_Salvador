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
                WHERE (nombre_jugador LIKE ? OR apellido_jugador LIKE ?) AND id_partido = ?";
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
            $this->idPosicion,
            $this->titular,
            $this->sustitucion,
            $this->minutosJugador,
            $this->asistencias,
            $this->estadoAnimo,
            $this->puntuacion
        );
        return Database::executeRow($sql, $params);
    }

    //Función para mostrar todos los jugadores convocados a un partido en especifico
    public function readAllByIdPartido()
    {
        $sql = 'SELECT * FROM vista_jugadores_por_equipo
                WHERE id_partido= ? AND estado_convocado = 1 ORDER BY dorsal_jugador ASC ';
        $params = array($this->idPartido);
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
    
    //Funcion que traera todos los juegadors
    public function participationMatch()
    {
        $sql = 'SELECT  p.id_participacion,
        CONCAT(j.nombre_jugador, " ", j.apellido_jugador) AS jugador,
        j.foto_jugador,
        j.dorsal_jugador,
        p.id_partido,
        p.titular,
        p.sustitucion,
        p.minutos_jugados,
        p.goles,
        p.asistencias,
        p.estado_animo,
        p.puntuacion,
        po.posicion,
        SUM(CASE WHEN da.amonestacion = "Tarjeta amarilla" THEN 1 ELSE 0 END) AS tarjetas_amarillas,
        SUM(CASE WHEN da.amonestacion = "Tarjeta roja" THEN 1 ELSE 0 END) AS tarjetas_rojas
        FROM participaciones_partidos p
        INNER JOIN jugadores j ON p.id_jugador = j.id_jugador
        INNER JOIN posiciones po ON p.id_posicion = po.id_posicion
        LEFT JOIN detalles_amonestaciones da ON da.id_participacion = p.id_participacion
        WHERE id_partido = ? 
        GROUP BY jugador ORDER BY puntuacion ASC ;';
        $params = array($this->idPartido);
        return Database::getRows($sql, $params);
    }

    //Funcion que traera todos los juegadors
    public function alineacionPartido()
    {
        $sql = 'SELECT  p.id_participacion,
        CONCAT(j.nombre_jugador, " ", j.apellido_jugador) AS jugador,
        j.foto_jugador,
        j.dorsal_jugador,
        p.id_partido,
        p.titular,
        p.sustitucion,
        p.minutos_jugados,
        p.goles,
        p.asistencias,
        p.estado_animo,
        p.puntuacion,
        po.posicion,
        SUM(CASE WHEN da.amonestacion = "Tarjeta amarilla" THEN 1 ELSE 0 END) AS tarjetas_amarillas,
        SUM(CASE WHEN da.amonestacion = "Tarjeta roja" THEN 1 ELSE 0 END) AS tarjetas_rojas
        FROM participaciones_partidos p
        INNER JOIN jugadores j ON p.id_jugador = j.id_jugador
        INNER JOIN posiciones po ON p.id_posicion = po.id_posicion
        LEFT JOIN detalles_amonestaciones da ON da.id_participacion = p.id_participacion
        WHERE id_partido = ? AND titular = 1
        GROUP BY jugador ORDER BY puntuacion ASC ;';
        $params = array($this->idPartido);
        return Database::getRows($sql, $params);
    }

    public function readByPlayerArea()
    {
        $sql = 'SELECT * FROM vista_jugadores_por_equipo
                WHERE area_de_juego = ? AND id_partido = ?';
        $params = array($this->areaJuego, $this->idEquipo);
        return Database::getRows($sql, $params);
    }

    //Funcion que treara la informacion del partido de un jugador (Para movil)
    public function readParticipationPlayer()
    {
        $sql = 'SELECT  p.id_participacion,
        p.id_jugador,
        p.id_partido,
        p.titular,
        p.sustitucion,
        p.minutos_jugados,
        p.goles,
        p.asistencias,
        p.estado_animo,
        p.puntuacion,
        po.posicion
        FROM participaciones_partidos p
        INNER JOIN posiciones po ON p.id_posicion = po.id_posicion
        WHERE id_partido = ? AND id_jugador = ?;';
        $params = array($this->idPartido, $this->idJugador);
        return Database::getRow($sql, $params);
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

    //Función para actualizar el estado de animo de la participacion.
    public function updateMoodRow()
    {
        $sql = 'UPDATE participaciones_partidos
        SET estado_animo = ?
        WHERE id_participacion = ?';
        $params = array(
            $this->estadoAnimo,
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

    //Funciones para reportes

    //Funcion que traera todos los juegadors
    public function participationReports()
    {
        $sql = 'SELECT * FROM vista_reporte_participacion_partido WHERE id_partido = ? ORDER BY puntuacion ASC ;';
        $params = array($this->idPartido);
        return Database::getRows($sql, $params);
    }

}