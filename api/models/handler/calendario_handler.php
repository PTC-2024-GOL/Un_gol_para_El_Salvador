<?php


// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');

/*
 *  Clase para manejar el comportamiento de los datos de la tabla calendario.
 */

class CalendarioHandler
{
    protected $idCalendario = null;
    protected $titulo = null;
    protected $fechaInicio = null;
    protected $fechaFinal = null;
    protected $color = null;

    /*
    * Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */

    public function createRow()
    {
        $sql = 'INSERT INTO calendario (titulo, fecha_inicio, fecha_final, color) VALUE (?,?,?,?)';
        $params = array(
            $this->titulo,
            $this->fechaInicio,
            $this->fechaFinal,
            $this->color
        );
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT * FROM calendario';
        return Database::getRows($sql);
    }

    public function updateRow()
    {
        $sql = 'UPDATE calendario
        SET titulo = ?, fecha_inicio = ?, fecha_final = ? , color = ? WHERE id_calendario = ?';
        $params = array(
            $this->titulo,
            $this->fechaInicio,
            $this->fechaFinal,
            $this->color,
            $this->idCalendario
        );
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM calendario WHERE id_calendario = ?';
        $params = array($this->idCalendario);
        return Database::executeRow($sql, $params);
    }
}