<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla tipología.
 */
class TipologiaHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;


    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */

    //Función para buscar una tipología o varias.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vista_tipologias
        WHERE NOMBRE LIKE ?
        ORDER BY NOMBRE;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar una tipología.
    public function createRow()
    {
        $sql = 'CALL insertar_tipologia(?);';
        $params = array(
            $this->nombre
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todas las tipología.
    public function readAll()
    {
        $sql = 'SELECT * FROM vista_tipologias;';
        return Database::getRows($sql);
    }

    //Función para leer una tipología.
    public function readOne()
    {
        $sql = 'SELECT id_tipologia AS ID,
        tipologia AS NOMBRE
        FROM tipologias
        WHERE id_tipologia LIKE ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }


    //Función para actualizar una tipología.
    public function updateRow()
    {
        $sql = 'CALL actualizar_tipologia(?,?);';
        $params = array(
            $this->id,
            $this->nombre
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar una tipología.
    public function deleteRow()
    {
        $sql = 'CALL eliminar_tipologia(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
