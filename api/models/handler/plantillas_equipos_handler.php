<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla tipología.
 */
class PlantillasEquiposHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $idPlantilla = null;
    protected $plantilla = null;
    protected $jugador = null;
    protected $temporada = null;
    protected $equipo = null;


    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */

    //Función para buscar un cuerpo técnico o varias.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vw_plantillas_equipos_agrupadas
        WHERE NOMBRE_PLANTILLA LIKE ? OR NOMBRE_EQUIPO LIKE ?
        ORDER BY NOMBRE_PLANTILLA;';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar una cuerpo técnico.
    public function createRow()
    {
        $sql = 'CALL sp_insertar_plantilla_equipo(?,?,?,?);';
        $params = array(
            $this->plantilla,
            $this->jugador,
            $this->temporada,
            $this->equipo
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todas las cuerpo técnico.
    public function readAll()
    {
        $sql = 'SELECT * FROM vw_plantillas_equipos_agrupadas
        ORDER BY NOMBRE_PLANTILLA;';
        return Database::getRows($sql);
    }

    //Función para leer todas las cuerpo técnico.
    public function readOneTemplate()
    {
        $sql = 'SELECT 
        pe.id_plantilla_equipo AS IDP,
        j.id_jugador AS ID,  
        CONCAT(j.nombre_jugador, " ", j.apellido_jugador) AS NOMBRE,
        j.nombre_jugador AS NOMBRE_JUGADOR, 
        j.apellido_jugador AS APELLIDO_JUGADOR,
        j.dorsal_jugador AS DORSAL, 
        j.fecha_nacimiento_jugador AS NACIMIENTO, 
        p.posicion AS POSICION_PRINCIPAL,
        pe.id_temporada AS ID_TEMPORADA,
        t.nombre_temporada AS NOMBRE_TEMPORADA,
        pe.id_equipo AS ID_EQUIPO,
        e.logo_equipo AS LOGO,
        e.nombre_equipo AS NOMBRE_EQUIPO,
        e.logo_equipo AS LOGO,
        j.foto_jugador AS IMAGEN
        FROM 
        plantillas_equipos pe JOIN 
        jugadores j ON pe.id_jugador = j.id_jugador 
        JOIN posiciones p ON j.id_posicion_principal = p.id_posicion
        JOIN temporadas t ON pe.id_temporada = t.id_temporada
        JOIN equipos e ON pe.id_equipo = e.id_equipo
        WHERE 
        pe.id_plantilla = ?
        ORDER BY DORSAL ASC;';
        $params = array($this->idPlantilla);
        return Database::getRows($sql, $params);
    }

    //Función para leer una cuerpo técnico.
    public function readOne()
    {
        $sql = 'SELECT 
        pe.id_plantilla_equipo AS IDP,
        j.id_jugador AS ID,  
        CONCAT(j.nombre_jugador, " ", j.apellido_jugador) AS NOMBRE,
        j.nombre_jugador AS NOMBRE_JUGADOR, 
        j.apellido_jugador AS APELLIDO_JUGADOR,
        j.dorsal_jugador AS DORSAL, 
        j.fecha_nacimiento_jugador AS NACIMIENTO, 
        p.posicion AS POSICION_PRINCIPAL,
        pe.id_temporada AS ID_TEMPORADA,
        pe.id_plantilla AS ID_PLANTILLA,
        t.nombre_temporada AS NOMBRE_TEMPORADA,
        pe.id_equipo AS ID_EQUIPO,
        e.nombre_equipo AS NOMBRE_EQUIPO,
        e.logo_equipo AS LOGO,
        j.foto_jugador AS IMAGEN
        FROM 
        plantillas_equipos pe 
        JOIN jugadores j ON pe.id_jugador = j.id_jugador 
        JOIN posiciones p ON j.id_posicion_principal = p.id_posicion
        JOIN temporadas t ON pe.id_temporada = t.id_temporada
        JOIN equipos e ON pe.id_equipo = e.id_equipo
        WHERE pe.id_plantilla_equipo LIKE ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }


    //Función para actualizar una cuerpo técnico.
    public function updateRow()
    {
        $sql = 'CALL sp_actualizar_plantilla_equipo(?,?,?,?,?);';
        $params = array(
            $this->id,
            $this->plantilla,
            $this->jugador,
            $this->temporada,
            $this->equipo
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar una cuerpo técnico.
    public function deleteRow()
    {
        $sql = 'CALL sp_eliminar_plantilla_equipo(?);';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
