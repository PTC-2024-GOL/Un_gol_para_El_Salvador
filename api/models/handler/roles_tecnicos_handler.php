<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla rol_tecnico.
 */
class RolTecnicoHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    //Función para buscar rol_tecnico
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vista_rol_tecnico
                WHERE NOMBRE LIKE ?
                ORDER BY NOMBRE;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    //Función para crear una rol_tecnico
    public function createRow()
    {
        $sql = 'CALL insertar_rol_tecnico(?);';
        $params = array($this->nombre);
        return Database::executeRow($sql, $params);
    }

    //Función para mostrar todas las rol_tecnico
    public function readAll()
    {
        $sql = 'SELECT ID, NOMBRE FROM vista_rol_tecnico
                ORDER BY NOMBRE;';
        return Database::getRows($sql);
    }

    //Función para mostrar una de las rol_tecnico
    public function readOne()
    {
        $sql = 'SELECT ID, NOMBRE FROM vista_rol_tecnico
                WHERE ID = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Función para actualizar una rol_tecnico
    public function updateRow()
    {
        $sql = 'CALL actualizar_rol_tecnico(?, ?);';
        $params = array($this->id, $this->nombre);
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar una rol_tecnico
    public function deleteRow()
    {
        $sql = 'CALL eliminar_rol_tecnico(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
