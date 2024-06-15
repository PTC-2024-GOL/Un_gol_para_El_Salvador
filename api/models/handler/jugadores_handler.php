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
        CONCAT(nombre_jugador, " ", apellido_jugador) AS NOMBRE, FROM jugadores
        ORDER BY NOMBRE;';
        return Database::getRows($sql);
    }
}
