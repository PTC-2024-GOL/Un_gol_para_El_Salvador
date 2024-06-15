<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla plantillas.
 */
class JugadoresHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    //Función para mostrar todos los jugadores (CAMBIAR CUANDO SE VAYA A HACER EL SCRUD, ESTO ES SOLO PARA CARGAR EL COMBOBOX)
    public function readAll()
    {
        $sql = 'SELECT id_jugador AS ID,  
        CONCAT(nombre_jugador, " ", apellido_jugador) AS NOMBRE,
        nombre_jugador AS NOMBRE_JUGADOR, apellido_jugador AS APELLIDO_JUGADOR,
        dorsal_jugador AS DORSAL, fecha_nacimiento_jugador AS NACIMIENTO, p.posicion AS POSICION_PRINCIPAL,
        foto_jugador AS IMAGEN FROM jugadores j INNER JOIN posiciones p ON j.id_posicion_principal = p.id_posicion;';
        return Database::getRows($sql);
    }
}
