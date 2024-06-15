<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla tipología.
 */
class DetalleCuerpoTecnicoHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $cuerpo = null;
    protected $tecnico = null;
    protected $rol = null;


    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */

    //Función para buscar un cuerpo técnico o varias.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vw_detalles_cuerpos_tecnicos
        WHERE CUERPO_TECNICO LIKE ? OR TECNICO LIKE ? OR ROL_TECNICO LIKE ?
        ORDER BY CUERPO_TECNICO;';
        $params = array($value, $value, $value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar una cuerpo técnico.
    public function createRow()
    {
        $sql = 'CALL sp_insertar_detalle_cuerpo_tecnico(?,?,?);';
        $params = array(
            $this->cuerpo,
            $this->tecnico,
            $this->rol
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todas las cuerpo técnico.
    public function readAll()
    {
        $sql = 'SELECT * FROM vw_detalles_cuerpos_tecnicos
        ORDER BY CUERPO_TECNICO;';
        return Database::getRows($sql);
    }

    //Función para leer una cuerpo técnico.
    public function readOne()
    {
        $sql = 'SELECT * FROM vw_detalles_cuerpos_tecnicos
        WHERE ID LIKE ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }


    //Función para actualizar una cuerpo técnico.
    public function updateRow()
    {
        $sql = 'CALL sp_actualizar_detalle_cuerpo_tecnico(?,?,?,?);';
        $params = array(
            $this->id,
            $this->cuerpo,
            $this->tecnico,
            $this->rol
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar una cuerpo técnico.
    public function deleteRow()
    {
        $sql = 'CALL sp_eliminar_detalle_cuerpo_tecnico(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
