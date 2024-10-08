<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla CATEGORIA.
 */
class NotificacionesHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $tipo = null;

    // Constante para establecer la ruta de las imágenes.

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function filterNotis()
    {
        $sql = 'SELECT n.id_notificacion AS ID,
        n.titulo AS TITULO, n.mensaje AS MENSAJE, n.fecha_notificacion AS FECHA,
        n.tipo_notificacion AS TIPO, n.visto AS VISTO, n.id_jugador AS IDJ, n.evento AS EVENTO,
        CONCAT(j.nombre_jugador, " ", j.apellido_jugador) AS JUGADOR,
        j.foto_jugador AS FOTO, j.id_jugador AS IDU
        FROM 
        notificaciones n
        JOIN 
        jugadores j ON n.id_jugador = j.id_jugador
        WHERE n.id_jugador = ? AND n.tipo_notificacion = ? AND n.fecha_notificacion >= DATE_SUB(CURDATE(), INTERVAL 2 WEEK) 
        ORDER BY n.fecha_notificacion ASC LIMIT 10;';
        $params = array($_SESSION['idJugador'], $this->tipo);
        return Database::getRows($sql, $params);
    }

    public function readMyNotis()
    {
        $sql = 'SELECT n.id_notificacion AS ID,
        n.titulo AS TITULO, n.mensaje AS MENSAJE, n.fecha_notificacion AS FECHA,
        n.tipo_notificacion AS TIPO, n.visto AS VISTO, n.id_jugador AS IDJ, n.evento AS EVENTO,
        CONCAT(j.nombre_jugador, " ", j.apellido_jugador) AS JUGADOR,
        j.foto_jugador AS FOTO, j.id_jugador AS IDU
        FROM 
        notificaciones n
        JOIN 
        jugadores j ON n.id_jugador = j.id_jugador
        WHERE n.id_jugador = ? AND n.fecha_notificacion >= DATE_SUB(CURDATE(), INTERVAL 2 WEEK)
        ORDER BY n.fecha_notificacion ASC LIMIT 10;';
        $params = array($_SESSION['idJugador']);
        return Database::getRows($sql, $params);
    }

    // Función para cambiar el estado de notificacion a visto
    public function markAsRead()
    {
        $sql = 'UPDATE notificaciones
                SET visto = 1
                WHERE id_notificacion = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

}
