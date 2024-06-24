<?php

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

    //Función para actualizar las amonestaciones de una participacion.
    public function updateRow()
    {
        $sql = 'UPDATE detalles_amonestaciones
        SET amonestacion = ?, numero_amonestacion = ?
        WHERE id_participacion = ?';
        $params = array(
            $this->amonestacion,
            $this->numeroAmonestaciones,
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