<?php
// Se incluye la clase para trabajar con la base de datos.
require_once ('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla Subcontenido.
 */
class ConvocatoriasHandler
{
    
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $partido = null;
    protected $jugador = null;
    protected $estado = null;

    //Función para insertar una característica.
    public function savesCalls()
    {
        $sql = 'CALL guardar_convocatoria(?,?,?);';
        $params = array(
            $this->partido,
            $this->jugador,
            $this->estado
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todas las característica.
    public function readAll()
    {
        $sql = 'SELECT j.dorsal_jugador AS DORSAL,
        CONCAT(j.nombre_jugador, " ", j.apellido_jugador) AS JUGADOR,
        j.id_jugador AS IDJ,
        pp.posicion AS POSICION_PRINCIPAL, ps.posicion AS POSICION_SECUNDARIA, 
        j.estatus_jugador AS ESTATUS,  j.foto_jugador AS FOTO,
        CASE WHEN cp.estado_convocado IS NULL THEN 0
	    ELSE cp.estado_convocado
        END AS CONVOCADO
        FROM jugadores j
        JOIN plantillas_equipos pe ON j.id_jugador = pe.id_jugador
        JOIN posiciones pp ON pp.id_posicion = j.id_posicion_principal
        JOIN posiciones ps ON ps.id_posicion = j.id_posicion_secundaria
        LEFT JOIN convocatorias_partidos cp ON cp.id_jugador = j.id_jugador 
        AND cp.id_partido = ?
        WHERE pe.id_equipo = (SELECT id_equipo FROM partidos WHERE id_partido = ?)
        ORDER BY DORSAL ASC;';
        $params = array($this->partido,$this->partido);
        return Database::getRows($sql, $params);
    }
}
