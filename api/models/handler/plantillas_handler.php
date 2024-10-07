<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla plantillas.
 */
class PlantillasHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    //Función para buscar plantillas
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vista_plantillas
                WHERE NOMBRE LIKE ?
                ORDER BY NOMBRE;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    //Función para buscar plantillas de los técnicos
    public function searchRowsTechnics()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT DISTINCT
                p.id_plantilla AS ID,
                p.nombre_plantilla AS NOMBRE
                FROM 
                plantillas p
                RIGHT JOIN 
                plantillas_equipos pe ON p.id_plantilla = pe.id_plantilla
                RIGHT JOIN 
                equipos e ON pe.id_equipo = e.id_equipo
                LEFT JOIN 
                detalles_cuerpos_tecnicos dct ON e.id_cuerpo_tecnico = dct.id_cuerpo_tecnico
                WHERE 
                dct.id_tecnico = ? AND p.nombre_plantilla LIKE ?
                ORDER BY p.nombre_plantilla;';
        $params = array($_SESSION['idTecnico'], $value);
        return Database::getRows($sql, $params);
    }

    //Función para crear una plantilla
    public function createRow()
    {
        $sql = 'CALL insertar_plantilla(?);';
        $params = array($this->nombre);
        return Database::executeRow($sql, $params);
    }

    //Función para mostrar todas las plantillas
    public function readAll()
    {
        $sql = 'SELECT ID, NOMBRE FROM vista_plantillas
                ORDER BY NOMBRE;';
        return Database::getRows($sql);
    }


    //Función para mostrar todas las plantillas
    public function readAllTechnics()
    {
        $sql = 'SELECT DISTINCT
                p.id_plantilla AS ID,
                p.nombre_plantilla AS NOMBRE
                FROM 
                plantillas p
                RIGHT JOIN 
                plantillas_equipos pe ON p.id_plantilla = pe.id_plantilla
                RIGHT JOIN 
                equipos e ON pe.id_equipo = e.id_equipo
                LEFT JOIN 
                detalles_cuerpos_tecnicos dct ON e.id_cuerpo_tecnico = dct.id_cuerpo_tecnico
                WHERE 
                dct.id_tecnico = ?
                AND p.id_plantilla IS NOT NULL
                ORDER BY p.nombre_plantilla;';
        $params = array($_SESSION['idTecnico']);
        return Database::getRows($sql, $params);
    }

    //Función para mostrar una de las plantillas
    public function readOne()
    {
        $sql = 'SELECT ID, NOMBRE FROM vista_plantillas
                WHERE ID = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    //Función para actualizar una plantilla
    public function updateRow()
    {
        $sql = 'CALL actualizar_plantilla(?, ?);';
        $params = array($this->id, $this->nombre);
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar una plantilla
    public function deleteRow()
    {
        $sql = 'CALL eliminar_plantilla(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
