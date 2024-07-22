<?php

// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');

/*
 *  Clase para manejar el comportamiento de los datos de la tabla participaciones partidos.
 */

class detallesAmonestacionesHandler
{
    protected $idDetalleAmonestacion = null;
    protected $idParticipacion = null;
    protected $amonestacion = null;
    protected $numeroAmonestaciones = null;


    /*
    *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */

    //Función para insertar un detalle de amonestacion.
    public function createRow()
    {
        $sql = 'INSERT INTO detalles_amonestaciones(id_participacion, amonestacion, numero_amonestacion) VALUE (?,?,?)';
        $params = array(
            $this->idParticipacion,
            $this->amonestacion,
            $this->numeroAmonestaciones
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer las amonestaciones de una participacion
    public function readAllAmonestaciones()
    {
        $sql = 'SELECT * FROM detalles_amonestaciones
                WHERE id_participacion= ?';
        $params = array($this->idParticipacion);
        return Database::getRows($sql, $params);
    }

    public function readOne()
    {
        $sql = 'SELECT * FROM detalles_amonestaciones
                WHERE id_detalle_amonestacion= ?';
        $params = array($this->idDetalleAmonestacion);
        return Database::getRow($sql, $params);
    }

    public function readYellowCard()
    {
        $sql = 'SELECT SUM(numero_amonestacion) AS totalAmarillas from detalles_amonestaciones WHERE amonestacion = "Tarjeta amarilla" AND id_participacion = ?';
        $params = array($this->idParticipacion);
        return Database::getRow($sql, $params);
    }

    public function readRedCard()
    {
        $sql = 'SELECT SUM(numero_amonestacion) AS totalRojas from detalles_amonestaciones WHERE amonestacion = "Tarjeta roja" AND id_participacion = ?';
        $params = array($this->idParticipacion);
        return Database::getRow($sql, $params);
    }

    //Función para actualizar las amonestaciones de una participacion.
    public function updateRow()
    {
        $sql = 'UPDATE detalles_amonestaciones
        SET amonestacion = ?, numero_amonestacion = ?
        WHERE id_detalle_amonestacion = ?';
        $params = array(
            $this->amonestacion,
            $this->numeroAmonestaciones,
            $this->idDetalleAmonestacion
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar una amonestacion.
    public function deleteRow()
    {
        $sql = 'DELETE FROM detalles_amonestaciones WHERE id_detalle_amonestacion = ?';
        $params = array($this->idDetalleAmonestacion);
        return Database::executeRow($sql, $params);
    }
}