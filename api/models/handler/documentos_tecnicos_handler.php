<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla tecnico.
 */
class DocumentosTecnicosHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $tecnico = null;
    protected $nombre = null;
    protected $imagen = null;


    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/archivos/';

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
        $sql = 'SELECT * FROM vista_documentos_tecnicos
        WHERE IDT = ? AND NOMBRE LIKE ?
        ORDER BY NOMBRE;';
        $params = array($this->tecnico, $value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar un admministrador.
    public function createRow()
    {
        $sql = 'CALL sp_insertar_documento_tecnico(?,?,?);';
        $params = array(
            $this->nombre,
            $this->tecnico,
            $this->imagen
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todos los admministradores.
    public function readAll()
    {
        $sql = 'SELECT * FROM vista_documentos_tecnicos
        WHERE IDT = ?
        ORDER BY NOMBRE;';
        $params = array($this->tecnico);
        return Database::getRows($sql,$params);
    }

    //Función para leer un tecnico.
    public function readOne()
    {
        $sql = 'SELECT * FROM vista_documentos_tecnicos
        WHERE ID LIKE ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Función para leer la imagen del id desde la base.
    public function readFilename()
    {
        $sql = 'SELECT ARCHIVO
                FROM vista_documentos_tecnicos
                WHERE ID = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Función para actualizar un admministrador.
    public function updateRow()
    {
        $sql = 'CALL sp_actualizar_documento_tecnico(?,?,?,?);';
        $params = array(
            $this->id,
            $this->nombre,
            $this->tecnico,
            $this->imagen
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar un admministrador.
    public function deleteRow()
    {
        $sql = 'CALL sp_eliminar_documento_tecnico(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

}
