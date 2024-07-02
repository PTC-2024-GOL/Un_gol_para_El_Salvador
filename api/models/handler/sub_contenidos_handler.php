<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla Subcontenido.
 */
class SubContenidosHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $idContenido = null;                  
    protected $subContenido = null;


    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */

    //Función para buscar un Subcontenido o varios.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT stc.*, tc.nombre_tema_contenido
                FROM sub_temas_contenidos stc
                INNER JOIN temas_contenidos tc 
                ON stc.id_tema_contenido = tc.id_tema_contenido
                WHERE sub_tema_contenido LIKE ? OR nombre_tema_contenido LIKE ?
                ORDER BY sub_tema_contenido;';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar un Subcontenido o varios. 
    
    public function createRow()
    {
        $sql = 'INSERT INTO sub_temas_contenidos (id_tema_contenido, sub_tema_contenido) VALUES(?, ?);';    
        $params = array(
            $this->idContenido,
            $this->subContenido  
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todas las un Subcontenido o varios. 
    public function readAll()
    {
        $sql = 'SELECT stc.*, tc.nombre_tema_contenido
                FROM sub_temas_contenidos stc
                INNER JOIN temas_contenidos tc ON stc.id_tema_contenido = tc.id_tema_contenido;';
        return Database::getRows($sql);
    }

    //Función para leer un Subcontenido o varios. 
    
    public function readOne()
    {
        $sql = 'SELECT stc.*, tc.nombre_tema_contenido
                FROM sub_temas_contenidos stc
                INNER JOIN temas_contenidos tc ON stc.id_tema_contenido = tc.id_tema_contenido 
                WHERE id_sub_tema_contenido = ?;';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Función para leer un Subcontenido o varios. 
    
    public function readOneContents()
    {
        $sql = 'SELECT * FROM temas_contenidos;';
        return Database::getRows($sql);
    }

    //Función para actualizar un Subcontenido o varios. 
    
    public function updateRow()
    {
        $sql = 'UPDATE sub_temas_contenidos SET id_tema_contenido = ?, sub_tema_contenido = ?  WHERE id_sub_tema_contenido = ?;';
        $params = array(
            $this->idContenido,
            $this->subContenido,
            $this->id   
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar un Subcontenido o varios. 
    
    public function deleteRow()
    {
        $sql = 'DELETE FROM sub_temas_contenidos WHERE id_sub_tema_contenido = ?;';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
