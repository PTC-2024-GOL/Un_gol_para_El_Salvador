<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla tipos de jugadas.
 */

class TiposJugadasHandler {
    protected $idTipoJugada = null;
    protected $nombreJugada = null;

    /*
    *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */

    //Función para buscar un tipo de jugada.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM tipos_jugadas
        WHERE nombre_tipo_juego LIKE ?
        ORDER BY nombre_tipo_juego;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar una tipo de jugada.
    public function createRow()
    {
        $sql = 'INSERT INTO tipos_jugadas(id_tipo_jugada, nombre_tipo_juego) VALUE (?,?)';
        $params = array(
            $this->idTipoJugada,
            $this->nombreJugada,
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todos los tipos de jugadas.
    public function readAll()
    {
        $sql = 'SELECT * FROM tipos_jugadas
        ORDER BY nombre_tipo_juego;';
        return Database::getRows($sql);
    }

    //Función para mostrar uno de los tipos de jugada
    public function readOne()
    {
        $sql = 'SELECT * FROM tipos_jugadas
                WHERE id_tipo_jugada = ?';
        $params = array($this->idTipoJugada);
        return Database::getRow($sql, $params);
    }

    //Función para actualizar las tipos de jugadas.
    public function updateRow()
    {
        $sql = 'UPDATE tipos_jugadas
        SET nombre_tipo_juego = ?
        WHERE id_tipo_jugada = ?';
        $params = array(
            $this->nombreJugada,
            $this->idTipoJugada,
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar una tipo de jugada.
    public function deleteRow()
    {
        $sql = 'DELETE FROM tipos_jugadas WHERE id_tipo_jugada = ?';
        $params = array($this->idTipoJugada);
        return Database::executeRow($sql, $params);
    }


}