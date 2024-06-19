<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
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

    //Función para rellenar la opcion del combobox con horarios de un equipo, 
    //visualmente se usarán id_entrenamiento como value y horario como text.  Esta función es para "elegir horario"
    public function readOneHorario()
    {
        $sql = "SELECT 
                id_equipo,
                id_entrenamiento,
                horario
                FROM vista_horarios_equipos WHERE id_equipo = ?;";
        $params = array($this->idEquipo);
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
                nombre_tarea
                FROM vista_detalle_entrenamiento WHERE id_entrenamiento = ?;";
        $params = array($this->idEntrenamiento);
        return Database::getRow($sql, $params);
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
        $sql = ' DELETE FROM detalles_contenidos WHERE id_detalle_contenido = ?;';
        $params = array($this->idDetalleContenido);
        return Database::executeRow($sql, $params);
    }
}
