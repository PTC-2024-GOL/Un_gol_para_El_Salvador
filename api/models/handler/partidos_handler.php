<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla Subcontenido.
 */
class PartidosHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $idEquipo = null;
    protected $logoRival = null;                  
    protected $canchaPartido = null;
    protected $resultadoPartido = null;
    protected $localidadPartido  = null;
    protected $tipoResultadoPartido = null;
    protected $idJornada = null;
    protected $rivalPartido = null;
    protected $idPartido = null;
    protected $idRival = null;
    protected $fechaPartido = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/partidos/';

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     * 
     */

    //Función para buscar un partido en base al nombre del rival o del equipo en casa
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = "SELECT * FROM vista_detalle_partidos
                WHERE nombre_rival LIKE ? OR nombre_equipo LIKE ?;";
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar un partido. 
    
    public function createRow()
    {   
        $sql = 'CALL insertarPartido(?, ?, ?, ?, ?, ?, ?, ?);';    
        $params = array(
            $this->idEquipo,
            $this->idRival,
            $this->canchaPartido,
            $this->resultadoPartido,
            $this->localidadPartido,
            $this->tipoResultadoPartido,
            $this->idJornada,
            $this->fechaPartido
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todas las un partido o varios. 
    public function readAll()
    {
        $sql = "SELECT * FROM vista_detalle_partidos;";
        return Database::getRows($sql);
    }

    //Función para leer los partidos por el idEquipo

    public function readAllByIdEquipo()
    {
        $sql = "SELECT * FROM vista_partidos_equipos WHERE id_equipo = ?;";
        $params = array($this->idEquipo);
        return Database::getRows($sql, $params);
    }


    //Función para leer un partido o varios. 
    
    public function readOne()
    {
        $sql = "SELECT * FROM vista_partidos_equipos WHERE id_partido = ?;";
        $params = array($this->idPartido);
        return Database::getRow($sql, $params);
    }

    //Función para leer una jornada o varios. 
    
    public function readOneJornada()
    {
        $sql = "SELECT id_jornada,  nombre_jornada FROM jornadas;";
        return Database::getRows($sql);
    }

    //Función para leer un rival  o varios. 
    
    public function readOneRivales()
    {
        $sql = "SELECT id_rival, nombre_rival, logo_rival FROM rivales;";
        return Database::getRows($sql);
    }

    //Función para leer una equipo o varios. 
    
    public function readOneEquipos()
    {
        $sql = "SELECT id_equipo,  nombre_equipo, logo_equipo FROM equipos;";
        return Database::getRows($sql);
    }

    //Función para actualizar un partidio o varios. 
    
    public function updateRow()
    {   
        $sql = 'UPDATE partidos SET id_jornada = ?, id_equipo = ?, id_rival = ?, cancha_partido = ?,
        resultado_partido = ?, localidad_partido = ?, tipo_resultado_partido = ?, fecha_partido = ? WHERE id_partido = ?;';
        $params = array(
            $this->idJornada,
            $this->idEquipo,
            $this->idRival,
            $this->canchaPartido,
            $this->resultadoPartido,
            $this->localidadPartido,
            $this->tipoResultadoPartido,
            $this->fechaPartido,
            $this->idPartido
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar un partido o varios. 
    
    public function deleteRow()
    {
        $sql = 'DELETE FROM partidos WHERE id_partido = ?;';
        $params = array($this->idPartido);
        return Database::executeRow($sql, $params);
    }
}
