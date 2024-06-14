<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla subtipología.
 */
class SubTipologiaHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;
    protected $tipologia = null;


    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */

    //Función para buscar una subtipología o varias.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vista_sub_tipologias
        WHERE TIPOLOGIA LIKE ?
        ORDER BY TIPOLOGIA;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar una subtipología.
    public function createRow()
    {
        $sql = 'CALL insertar_sub_tipologia(?,?);';
        $params = array(
            $this->nombre,
            $this->tipologia
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todas las subtipología.
    public function readAll()
    {
        $sql = 'SELECT * FROM vista_sub_tipologias;';
        return Database::getRows($sql);
    }

    //Función para leer una tipología.
    public function readOne()
    {
        $sql = 'SELECT st.id_sub_tipologia AS ID,
                st.nombre_sub_tipologia AS NOMBRE,
                t.tipologia AS TIPOLOGIA
                FROM sub_tipologias st
                INNER JOIN tipologias t ON st.id_tipologia = t.id_tipologia
                WHERE st.id_sub_tipologia LIKE ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }


    //Función para actualizar una SUBtipología.
    public function updateRow()
    {
        $sql = 'CALL actualizar_sub_tipologia(?,?,?);';
        $params = array(
            $this->id,
            $this->nombre,
            $this->tipologia
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar una tipología.
    public function deleteRow()
    {
        $sql = 'CALL eliminar_sub_tipologia(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
