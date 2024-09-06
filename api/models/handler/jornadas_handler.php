<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla tipología.
 */
class JornadasHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;
    protected $numero = null;
    protected $plantilla = null;
    protected $fechaInicio = null;
    protected $fechaFinal = null;


    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */

    //Función para buscar un cuerpo técnico o varias.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vw_jornadas
        WHERE NOMBRE LIKE ? OR NUMERO LIKE ? OR PLANTILLA LIKE ? OR FECHA_INICIO LIKE ? OR FECHA_FIN LIKE ?
        ORDER BY NOMBRE;';
        $params = array($value, $value, $value, $value, $value);
        return Database::getRows($sql, $params);
    }

    //Función para buscar un cuerpo técnico o varias.
    public function searchRowsTechnics()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT 
        j.id_jornada AS ID,
        j.nombre_jornada AS NOMBRE,
        j.numero_jornada AS NUMERO,
        p.nombre_plantilla AS PLANTILLA,
        j.id_plantilla AS ID_PLANTILLA,
        j.fecha_inicio_jornada AS FECHA_INICIO,
        j.fecha_fin_jornada AS FECHA_FIN
        FROM 
        jornadas j
        INNER JOIN 
        plantillas p ON j.id_plantilla = p.id_plantilla
        INNER JOIN 
        plantillas_equipos pe ON p.id_plantilla = pe.id_plantilla
        INNER JOIN 
        equipos e ON pe.id_equipo = e.id_equipo
        INNER JOIN 
        detalles_cuerpos_tecnicos dct ON e.id_cuerpo_tecnico = dct.id_cuerpo_tecnico
        WHERE 
        dct.id_tecnico = ? AND (nombre_jornada LIKE ? OR numero_jornada LIKE ? OR nombre_plantilla LIKE ? OR fecha_inicio_jornada LIKE ? OR fecha_fin_jornada LIKE ?)
        ORDER BY NOMBRE;';
        $params = array($_SESSION['idTecnico'], $value, $value, $value, $value, $value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar una cuerpo técnico.
    public function createRow()
    {
        $sql = 'CALL insertar_jornada(?,?,?,?,?);';
        $params = array(
            $this->nombre,
            $this->numero,
            $this->plantilla,
            $this->fechaInicio,
            $this->fechaFinal
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todas las jornadas.
    public function readAll()
    {
        $sql = 'SELECT * FROM vw_jornadas
        ORDER BY NOMBRE;';
        return Database::getRows($sql);
    }

    //Función para leer todas las jornadas disponibles para el técnico.
    public function readAllTechnics()
    {
        $sql = 'SELECT DISTINCT
        j.id_jornada AS ID,
        j.nombre_jornada AS NOMBRE,
        j.numero_jornada AS NUMERO,
        p.nombre_plantilla AS PLANTILLA,
        j.id_plantilla AS ID_PLANTILLA,
        j.fecha_inicio_jornada AS FECHA_INICIO,
        j.fecha_fin_jornada AS FECHA_FIN
        FROM 
        jornadas j
        INNER JOIN 
        plantillas p ON j.id_plantilla = p.id_plantilla
        INNER JOIN 
        plantillas_equipos pe ON p.id_plantilla = pe.id_plantilla
        INNER JOIN 
        equipos e ON pe.id_equipo = e.id_equipo
        INNER JOIN 
        detalles_cuerpos_tecnicos dct ON e.id_cuerpo_tecnico = dct.id_cuerpo_tecnico
        WHERE 
        dct.id_tecnico = ?
        ORDER BY NOMBRE;';
        $params = array($_SESSION['idTecnico']);
        return Database::getRows($sql, $params);
    }

    //Función para leer todas las jornadas disponibles para el técnico.
    public function readAllPlayers()
    {
        $sql = 'SELECT DISTINCT
        j.id_jornada AS ID,
        j.nombre_jornada AS NOMBRE,
        j.numero_jornada AS NUMERO,
        p.nombre_plantilla AS PLANTILLA,
        j.id_plantilla AS ID_PLANTILLA,
        t.nombre_temporada AS TEMPORADA,
        DATE_FORMAT(j.fecha_inicio_jornada, " %d de %M de %Y") AS FECHA_INICIO,
        DATE_FORMAT(j.fecha_fin_jornada, " %d de %M de %Y") AS FECHA_FIN
        FROM 
        jornadas j
        INNER JOIN 
        plantillas p ON j.id_plantilla = p.id_plantilla
        INNER JOIN 
        plantillas_equipos pe ON p.id_plantilla = pe.id_plantilla
        INNER JOIN 
        equipos e ON pe.id_equipo = e.id_equipo
        INNER JOIN 
        temporadas t ON t.id_temporada = pe.id_temporada
        WHERE 
        pe.id_jugador = ?
        ORDER BY NOMBRE;';
        $params = array($_SESSION['idJugador']);
        return Database::getRows($sql, $params);
    }
    //Función para leer una cuerpo técnico.
    public function readOne()
    {
        $sql = 'SELECT * FROM vw_jornadas
        WHERE ID LIKE ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }


    //Función para actualizar una cuerpo técnico.
    public function updateRow()
    {
        $sql = 'CALL actualizar_jornada(?,?,?,?,?,?);';
        $params = array(
            $this->id,
            $this->nombre,
            $this->numero,
            $this->plantilla,
            $this->fechaInicio,
            $this->fechaFinal
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar una cuerpo técnico.
    public function deleteRow()
    {
        $sql = 'CALL sp_eliminar_jornada(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
