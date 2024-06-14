<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla tipos_lesioness.
 */
class TiposLesionesHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    //Función para buscar tipos lesiones
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vista_tipos_lesiones
                WHERE NOMBRE LIKE ?
                ORDER BY NOMBRE;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    //Función para crear una tipo de lesion
    public function createRow()
    {
        $sql = 'CALL insertar_tipo_lesion(?);';
        $params = array($this->nombre);
        return Database::executeRow($sql, $params);
    }

    //Función para mostrar todas los tipos de lesiones
    public function readAll()
    {
        $sql = 'SELECT ID, NOMBRE FROM vista_tipos_lesiones
                ORDER BY NOMBRE;';
        return Database::getRows($sql);
    }

    //Función para mostrar uno de los tipos lesiones
    public function readOne()
    {
        $sql = 'SELECT ID, NOMBRE FROM vista_tipos_lesiones
                WHERE ID = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Función para actualizar un tipo de lesion
    public function updateRow()
    {
        $sql = 'CALL actualizar_tipo_lesion(?, ?);';
        $params = array($this->id, $this->nombre);
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar un tipo de lesion
    public function deleteRow()
    {
        $sql = 'CALL eliminar_tipo_lesion(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
