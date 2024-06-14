<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla tipología.
 */
class CuerpoTecnicoHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;


    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */

    //Función para buscar un cuerpo técnico o varias.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vista_cuerpos_tecnicos
        WHERE NOMBRE LIKE ?
        ORDER BY NOMBRE;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar una cuerpo técnico.
    public function createRow()
    {
        $sql = 'CALL insertar_cuerpo_tecnico(?);';
        $params = array(
            $this->nombre
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todas las cuerpo técnico.
    public function readAll()
    {
        $sql = 'SELECT * FROM vista_cuerpos_tecnicos;';
        return Database::getRows($sql);
    }

    //Función para leer una cuerpo técnico.
    public function readOne()
    {
        $sql = 'SELECT id_cuerpo_tecnico AS ID,
        nombre_cuerpo_tecnico AS NOMBRE
        FROM cuerpos_tecnicos
        WHERE id_cuerpo_tecnico LIKE ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }


    //Función para actualizar una cuerpo técnico.
    public function updateRow()
    {
        $sql = 'CALL actualizar_cuerpo_tecnico(?,?);';
        $params = array(
            $this->id,
            $this->nombre
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar una cuerpo técnico.
    public function deleteRow()
    {
        $sql = 'CALL eliminar_cuerpo_tecnico(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
