<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla tecnico.
 */
class RivalesHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;
    protected $imagen = null;


    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/rivales/';

    /*
     *  Métodos para gestionar la cuenta del tecnico.
     */

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    //Función para buscar un admministrador o varios.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vista_rivales
        WHERE Nombre LIKE ?
        ORDER BY Nombre;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar un admministrador.
    public function createRow()
    {
        $sql = 'CALL sp_insertar_rival(?,?);';
        $params = array(
            $this->nombre,
            $this->imagen
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todos los admministradores.
    public function readAll()
    {
        $sql = 'SELECT * FROM vista_rivales
        ORDER BY Nombre;';
        return Database::getRows($sql);
    }

    //Función para leer un tecnico.
    public function readOne()
    {
        $sql = 'SELECT * FROM vista_rivales
        WHERE ID LIKE ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Función para leer la imagen del id desde la base.
    public function readFilename()
    {
        $sql = 'SELECT Logo
                FROM vista_rivales
                WHERE ID = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Función para actualizar un admministrador.
    public function updateRow()
    {
        $sql = 'CALL sp_actualizar_rival(?,?,?);';
        $params = array(
            $this->id,
            $this->nombre,
            $this->imagen
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar un admministrador.
    public function deleteRow()
    {
        $sql = 'CALL sp_eliminar_rival(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

}
