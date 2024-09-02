<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla contenido.
 */
class ContenidosHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $momento = null;
    protected $zona = null;


    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */

    //Función para buscar un contenido o varios.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM temas_contenidos
        WHERE nombre_tema_contenido LIKE ?
        ORDER BY nombre_tema_contenido;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar un contenido o varios. 
    
    public function createRow()
    {
        $sql = 'INSERT INTO temas_contenidos(zona_campo, momento_juego) VALUES(?, ?);';    
        $params = array(
            $this->zona,
            $this->momento
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todas las un contenido o varios. 
    public function readAll()
    {
        $sql = 'SELECT * FROM temas_contenidos;';
        return Database::getRows($sql);
    }

    //Función para leer un contenido o varios. 
    
    public function readOne()
    {
        $sql = 'SELECT * FROM temas_contenidos WHERE id_tema_contenido = ?;';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }


    //Función para actualizar un contenido o varios. 
    
    public function updateRow()
    {
        $sql = 'UPDATE temas_contenidos SET zona_campo = ?, momento_juego = ? WHERE id_tema_contenido = ?;';
        $params = array(
            $this->zona,
            $this->momento,
            $this->id   
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar un contenido o varios. 
    
    public function deleteRow()
    {
        $sql = 'DELETE FROM temas_contenidos WHERE id_tema_contenido = ?;';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
