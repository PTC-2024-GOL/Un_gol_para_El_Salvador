<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla tipología.
 */
class PlantillasEquiposHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $plantilla = null;
    protected $jugador = null;
    protected $temporada = null;
    protected $equipo = null;


    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */

    //Función para buscar un cuerpo técnico o varias.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vw_plantillas_equipos_agrupadas
        WHERE NOMBRE_PLANTILLA LIKE ? OR NOMBRE_TEMPORADA LIKE ? OR NOMBRE_EQUIPO LIKE ?
        ORDER BY NOMBRE_PLANTILLA;';
        $params = array($value, $value, $value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar una cuerpo técnico.
    public function createRow()
    {
        $sql = 'CALL sp_insertar_plantilla_equipo(?,?,?,?);';
        $params = array(
            $this->plantilla,
            $this->jugador,
            $this->temporada,
            $this->equipo
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todas las cuerpo técnico.
    public function readAll()
    {
        $sql = 'SELECT * FROM vw_plantillas_equipos_agrupadas
        ORDER BY NOMBRE_PLANTILLA;';
        return Database::getRows($sql);
    }

    //Función para leer una cuerpo técnico.
    public function readOne()
    {
        $sql = 'SELECT * FROM vw_plantillas_equipos_agrupadas
        WHERE ID LIKE ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }


    //Función para actualizar una cuerpo técnico.
    public function updateRow()
    {
        $sql = 'CALL sp_actualizar_plantilla_equipo(?,?,?,?,?);';
        $params = array(
            $this->id,
            $this->plantilla,
            $this->jugador,
            $this->temporada,
            $this->equipo
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar una cuerpo técnico.
    public function deleteRow()
    {
        $sql = 'CALL sp_eliminar_plantilla_equipo(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
