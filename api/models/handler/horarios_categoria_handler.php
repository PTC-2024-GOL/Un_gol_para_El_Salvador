<?php

// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');

/*
 *  Clase para manejar el comportamiento de los datos de la tabla tipos de jugadas.
 */

class HorariosCateHandler{

    //Declaracion de variables aqui
    protected $idHorarioCategoria = null;
    protected $categoria = null;
    protected $horario = null;

    /*
    *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */

    //Función para buscar un horario_categoria.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vista_horarios_categorias
        WHERE nombre_horario LIKE ? OR nombre_categoria LIKE ?
        ORDER BY nombre_horario;';
        $params = array($value,$value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar un horario_categoria.
    public function createRow()
    {
        $sql = 'CALL sp_insertar_horario_categoria(?,?);';
        $params = array(
            $this->categoria,
            $this->horario
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todas los horario_categoria.
    public function readAll()
    {
        $sql = 'SELECT * FROM vista_horarios_categorias
        ORDER BY id_horario;';
        return Database::getRows($sql);
    }

    //Función para leer un horario_categoria.
    public function readOne()
    {
        $sql = 'SELECT * FROM horarios_categorias
        WHERE id_horario_categoria LIKE ?';
        $params = array($this->idHorarioCategoria);
        return Database::getRow($sql, $params);
    }

    //Función para leer un horario_categoria.
    public function onlyDetail()
    {
        $sql = 'SELECT * FROM vista_horarios_categorias
        WHERE id_categoria LIKE ?';
        $params = array($this->categoria);
        return Database::getRows($sql, $params);
    }

    //Función para actualizar un registro médico.
    public function updateRow()
    {
        $sql = 'CALL sp_actualizar_horario_categoria(?,?,?);';
        $params = array(
            $this->idHorarioCategoria,
            $this->categoria,
            $this->horario
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar un registro médico.
    public function deleteRow()
    {
        $sql = 'CALL sp_eliminar_horario_categoria(?);';
        $params = array($this->idHorarioCategoria);
        return Database::executeRow($sql, $params);
    }

}

