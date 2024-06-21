<?php

// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');

/*
 *  Clase para manejar el comportamiento de los datos de la tabla tipos de jugadas.
 */

class LesionesHandler
{

    protected $idLesion = null;
    protected $idTipoLesion = null;
    protected $idSubtipologia = null;

    /*
    *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */

    //Función para buscar una lesion.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT tipo_lesion, nombre_sub_tipologia FROM vista_lesiones
        WHERE vista_lesiones.tipo_lesion LIKE ? OR vista_lesiones.nombre_sub_tipologia LIKE ?
        ORDER BY total_por_lesion DESC ;';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar una lesion.
    public function createRow()
    {
        $sql = 'CALL insertar_lesion(?,?)';
        $params = array(
            $this->idTipoLesion,
            $this->idSubtipologia,
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todas las lesiones.
    public function readAll()
    {
        $sql = 'SELECT * FROM vista_lesiones
        ORDER BY total_por_lesion DESC;';
        return Database::getRows($sql);
    }

    //Función para mostrar una de las lesiones
    public function readOne()
    {
        $sql = 'SELECT * FROM vista_lesiones
                WHERE id_lesion= ?';
        $params = array($this->idLesion);
        return Database::getRow($sql, $params);
    }

    //Función para actualizar las lesiones.
    public function updateRow()
    {
        $sql = 'UPDATE lesiones
        SET id_tipo_lesion = ?, id_sub_tipologia = ?
        WHERE id_lesion = ?';
        $params = array(
            $this->idTipoLesion,
            $this->idSubtipologia,
            $this->idLesion
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar una lesion.
    public function deleteRow()
    {
        $sql = 'DELETE FROM lesiones WHERE id_lesion = ?';
        $params = array($this->idLesion);
        return Database::executeRow($sql, $params);
    }


}