<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla palmaress.
 */
class PalmaresHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $equipo = null;
    protected $temporada = null;
    protected $lugar = null;

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    //Función para buscar palmares
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT p.lugar, p.id_equipo, p.id_temporada, p.id_palmares AS ID,
                e.logo_equipo, e.nombre_equipo, t.nombre_temporada
                FROM palmares p
                INNER JOIN equipos e USING(id_equipo)
                INNER JOIN temporadas t USING(id_temporada)
                WHERE lugar LIKE ?
                ORDER BY lugar;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    //Función para crear una palmares
    public function createRow()
    {
        $sql = 'CALL sp_insertar_palmares(?,?,?);';
        $params = array($this->equipo, $this->temporada, $this->lugar);
        return Database::executeRow($sql, $params);
    }

    //Función para mostrar todas las palmares
    public function readAll()
    {
        $sql = 'SELECT p.lugar, p.id_equipo, p.id_temporada, p.id_palmares AS ID,
                e.logo_equipo, e.nombre_equipo, t.nombre_temporada
                FROM palmares p
                INNER JOIN equipos e USING(id_equipo)
                INNER JOIN temporadas t USING(id_temporada)
                ORDER BY lugar;';
        return Database::getRows($sql);
    }

    //Función para mostrar una de las palmares
    public function readOne()
    {
        $sql = 'SELECT id_palmares, lugar, id_equipo, id_temporada FROM palmares
                WHERE id_palmares = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Función para actualizar una palmares
    public function updateRow()
    {
        $sql = 'CALL sp_actualizar_palmares(?, ?, ?, ?);';
        $params = array($this->id, $this->equipo, $this->temporada, $this->lugar);
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar una palmares
    public function deleteRow()
    {
        $sql = 'CALL sp_eliminar_palmares(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
