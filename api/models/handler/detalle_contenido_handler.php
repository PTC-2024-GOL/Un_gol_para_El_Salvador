<?php
// Se incluye la clase para trabajar con la base de datos.
require_once ('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla Detalle Contenido.
 */
class DetalleContenidoHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $idDetalleContenido = null;
    protected $idEntrenamiento = null;
    protected $idJugador = null;
    protected $idTarea = null;
    protected $cantidadSubContenido = null;
    protected $idSubContenido = null;
    protected $cantidadTarea = null;

    protected $idEquipo = null;


    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     * 
     */

    //Función para buscar un equipo o varios. Esta función es para "elegir horario"
    public function searchRowsHorario()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = "SELECT 
                id_equipo,
                nombre_categoria,
                nombre_equipo
                FROM vista_equipos_categorias
                WHERE nombre_equipo LIKE ?
                ORDER BY nombre_equipo;";
        $params = array($value);
        return Database::getRows($sql, $params);
    }
    // Función para buscar un detalle contenido. Esta función es para "Detalle Contentido"   
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = "SELECT 
                id_equipo,
                id_entrenamiento,
                id_detalle_contenido,
                nombre_subtema,
                nombre_jugador,
                nombre_tarea
                FROM vista_detalle_entrenamiento
                WHERE nombre_jugador LIKE ? OR nombre_subtema LIKE ?
                ORDER BY nombre_jugador;";
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar un detalle contenido. Esta función es para "Detalle Contentido"

    public function createRow()
    {
        $sql = 'CALL insertarDetalleContenido (?, ?, ?, ?, ?, ?);';
        $params = array(
            $this->idSubContenido,
            $this->cantidadSubContenido,
            $this->idTarea,
            $this->cantidadTarea,
            $this->idJugador,
            $this->idEntrenamiento
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todos los equipos o varios. Esta función es para "elegir horario" 
    public function readAllHorario()
    {
        $sql = "SELECT 
                id_equipo,
                nombre_categoria,
                nombre_equipo
                FROM vista_equipos_categorias;";
        return Database::getRows($sql);
    }
        //Función para leer todos los equipos o varios. Esta función es para "elegir horario" 
        public function readAllHorarioTenico()
        {
            $sql = "SELECT 
                    id_equipo,
                    nombre_categoria,
                    nombre_equipo,
                    id_tecnico
                    FROM vista_equipos_categorias_tecnico where id_tecnico = ?;";
            $params = array($_SESSION['idTecnico']);
            return Database::getRows($sql, $params);
        }
    //Función para rellenar la opcion del combobox con horarios de subcontenidos, 
    //Función para leer todos los subcontenidos disponibles. Esta función es para "Detalle Contenido" 
    public function readAllSubContenidos()
    {
        $sql = "SELECT 
                    id_sub_tema_contenido,
                    sub_tema_contenido
                    FROM sub_temas_contenidos;";
        return Database::getRows($sql);
    }
    //Función para rellenar la opcion del combobox con horarios de tareas, 
    //Función para leer todos los tareasdisponibles. Esta función es para "Detalle Contenido" 
    public function readAllTareas()
    {
        $sql = "SELECT 
                id_tarea,
                nombre_tarea
                FROM tareas;";
        return Database::getRows($sql);
    }

    //Función para rellenar la opcion del combobox con horarios de un equipo, 
    //visualmente se usarán id_entrenamiento como value y horario como text.  Esta función es para "elegir horario"
    public function readOneHorario()
    {
        $sql = "SELECT 
                id_entrenamiento,
                horario,
                fecha_entrenamiento,
                id_equipo
                FROM vista_horarios_equipos WHERE id_equipo = ?
                ORDER BY fecha_entrenamiento DESC;";
        $params = array($this->idEquipo);
        return Database::getRows($sql, $params);
    }

    //Función para rellenar la opcion del combobox con horarios de un equipo y para ver solo los entrenamientos sin asistencias 
    //visualmente se usarán id_entrenamiento como value y horario como text.  Esta función es para "elegir horario"
    public function readOneHorarioMovil()
    {
        $sql = "SELECT 
                id_entrenamiento,
                horario,
                fecha_entrenamiento,
                id_equipo
                FROM vista_horarios_equipos_movil vhem
                WHERE vhem.id_equipo = ?
                AND NOT EXISTS (
                SELECT 1
                FROM asistencias a
                WHERE a.id_entrenamiento = vhem.id_entrenamiento
                )
                ORDER BY fecha_entrenamiento DESC;";
        $params = array($this->idEquipo);
        return Database::getRows($sql, $params);
    }
    // Función para leer un detalle contenido. (UPDATE) Esta función es para "Detalle Contenido"
    public function readOneDetalleContenido()
    {
        $sql = "SELECT 
                id_detalle_contenido,
                id_jugador,
                id_sub_tema_contenido,
                minutos_contenido,
                minutos_tarea,
                id_tarea
                FROM vista_detalle_entrenamiento_especifico WHERE id_detalle_contenido = ?;";
        $params = array($this->idDetalleContenido);
        return Database::getRow($sql, $params);
    }

    //Función para leer todos lops jugadores que tienen contenidos y tareas en base a un entrenamiento.
    // el id entrenamiento se obtendrá con un GETPARAMETER de la url. Esta función es para "elegir horario" 

    public function readAllDContenido()
    {
        $sql = "SELECT 
                id_equipo,
                id_entrenamiento,
                id_detalle_contenido,
                nombre_subtema,
                nombre_jugador,
                nombre_tarea
                FROM vista_detalle_entrenamiento WHERE id_entrenamiento = ?;";
        $params = array($this->idEntrenamiento);
        return Database::getRows($sql, $params);
    }

    //Función para leer el idequipo de un entrenamiento. Esta función es para "Detalle Contenido"
    // Esta función se carga en el windows.onload
    public function readOneEquipo()
    {
        $sql = "SELECT 
                id_equipo
                FROM entrenamientos WHERE id_entrenamiento = ?;";
        $params = array($this->idEntrenamiento);
        return Database::getRow($sql, $params);
    }
    //Función para rellenar la opcion del combobox con jugadores, 
    //Función para leer todos los jugadores de un equipo. Esta función es para "Detalle Contenido" 
    public function readAllJugadores()
    {
        $sql = "SELECT 
                id,
                jugadores
                FROM vista_equipos_jugadores WHERE id_equipo = ?;";
        $params = array($this->idEquipo);
        return Database::getRows($sql, $params);
    }

    //Función para actualizar un detalle contenido. 

    public function updateRow()
    {
        $sql = 'CALL actualizarDetalleContenido (?, ?, ?, ?, ?);';
        $params = array(
            $this->idSubContenido,
            $this->cantidadSubContenido,
            $this->idTarea,
            $this->cantidadTarea,
            $this->idDetalleContenido
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar un detalle contenido

    public function deleteRow()
    {

        $sql = 'DELETE FROM detalle_entrenamiento WHERE id_detalle_contenido = ?; 
                DELETE FROM detalles_contenidos WHERE id_detalle_contenido = ?;';
        $params = array($this->idDetalleContenido, $this->idDetalleContenido);
        return Database::executeRow($sql, $params);
    }
}
