<?php

// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');

/*
 *  Clase para manejar el comportamiento de los datos de la tabla tipos de jugadas.
 */

class TiposGolesHandler {

    protected $idTipoGol = null;
    protected $idTipoJugada = null;
    protected $nombreGol = null;


    /*
    *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */

    //Función para buscar un tipo de jugada.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_tipo_gol, id_tipo_jugada, gol, jugada FROM vista_tipos_goles
        WHERE vista_tipos_goles.gol LIKE ? OR vista_tipos_goles.jugada LIKE ?
        ORDER BY gol;';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar una tipo de jugada.
    public function createRow()
    {
        $sql = 'INSERT INTO tipos_goles(id_tipo_jugada, nombre_tipo_gol) VALUE (?,?)';
        $params = array(
            $this->idTipoJugada,
            $this->nombreGol,
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todos los tipos de jugadas.
    public function readAll()
    {
        $sql = 'SELECT * FROM vista_tipos_goles
        ORDER BY gol;';
        return Database::getRows($sql);
    }

    //Función para mostrar uno de los tipos de jugada
    public function readOne()
    {
        $sql = 'SELECT * FROM vista_tipos_goles
                WHERE id_tipo_gol= ?';
        $params = array($this->idTipoGol);
        return Database::getRow($sql, $params);
    }

    //Función para actualizar las tipos de jugadas.
    public function updateRow()
    {
        $sql = 'UPDATE tipos_goles
        SET nombre_tipo_gol = ?, id_tipo_jugada = ?
        WHERE id_tipo_gol = ?';
        $params = array(
            $this->nombreGol,
            $this->idTipoJugada,
            $this->idTipoGol
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar una tipo de jugada.
    public function deleteRow()
    {
        $sql = 'DELETE FROM tipos_goles WHERE id_tipo_gol = ?';
        $params = array($this->idTipoGol);
        return Database::executeRow($sql, $params);
    }


}