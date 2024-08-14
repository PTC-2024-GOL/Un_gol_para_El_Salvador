<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla temporadas.
 */
class TemporadasHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    //Función para buscar temporadas
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vista_temporadas
                WHERE NOMBRE LIKE ?
                ORDER BY NOMBRE;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    //Función para crear una temporada
    public function createRow()
    {
        $sql = 'CALL insertar_temporada(?);';
        $params = array($this->nombre);
        return Database::executeRow($sql, $params);
    }

    //Función para mostrar todas las temporadas
    public function readAll()
    {
        $sql = 'SELECT ID, NOMBRE FROM vista_temporadas
                ORDER BY NOMBRE;';
        return Database::getRows($sql);
    }

    //Función para mostrar todas las temporadas
    public function readAllTechnics()
    {
        $sql = 'SELECT 
                id_temporada AS ID,
                nombre_temporada AS NOMBRE
                FROM 
                temporadas';
        return Database::getRows($sql);
    }

    //Función para mostrar una de las temporadas
    public function readOne()
    {
        $sql = 'SELECT ID, NOMBRE FROM vista_temporadas
                WHERE ID = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Función para actualizar una temporada
    public function updateRow()
    {
        $sql = 'CALL actualizar_temporada(?, ?);';
        $params = array($this->id, $this->nombre);
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar una temporada
    public function deleteRow()
    {
        $sql = 'CALL eliminar_temporada(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
