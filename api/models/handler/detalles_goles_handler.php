<?php

class detallesGolesHandler
{
    protected $idDetalleGol = null;
    protected $idParticipacion = null;
    protected $cantidadTipoGol = null;
    protected $idTipoGol = null;


    /*
    *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */

    //Función para insertar un detalle gol.
    public function createRow()
    {
        $sql = 'INSERT INTO detalles_goles(id_participacion, cantidad_tipo_gol, id_tipo_gol) VALUE (?,?,?)';
        $params = array(
            $this->idParticipacion,
            $this->cantidadTipoGol,
            $this->idTipoGol
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer los goles de una participacion
    public function readAllGoles()
    {
        $sql = 'SELECT * FROM vista_detalles_goles
                WHERE id_participacion= ?';
        $params = array($this->idTipoGol);
        return Database::getRows($sql, $params);
    }

    //Función para actualizar los goles de una participacion.
    public function updateRow()
    {
        $sql = 'UPDATE detalles_goles
        SET cantidad_tipo_gol = ?, id_tipo_gol = ?
        WHERE id_detalle_gol = ?';
        $params = array(
            $this->cantidadTipoGol,
            $this->idTipoGol,
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar una tipo de gol.
    public function deleteRow()
    {
        $sql = 'DELETE FROM detalles_goles WHERE id_detalle_gol = ?';
        $params = array($this->idDetalleGol);
        return Database::executeRow($sql, $params);
    }

}