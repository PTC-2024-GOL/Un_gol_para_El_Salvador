<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla Subcontenido.
 */
class EntrenamientosHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $fechaEntrenamiento = null;
    protected $sesion = null;
    protected $idJornada = null;
    protected $idEquipo = null;
    protected $idCategoria = null;
    protected $idHorario = null;
    protected $idEntrenamiento = null;


    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */

    //Función para buscar un Subcontenido o varios.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_jornada, id_entrenamiento, detalle_entrenamiento, fecha_entrenamiento 
        FROM vista_jornadas_entrenamientos WHERE detalle_entrenamiento LIKE ?
                ORDER BY fecha_entrenamiento DESC;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar un Subcontenido o varios. 

    public function createRow()
    {
        $sql = 'INSERT INTO entrenamientos (fecha_entrenamiento, sesion, id_jornada, id_equipo, id_horario_categoria)
        VALUES (?,?,?,?,?);';
        $params = array(
            $this->fechaEntrenamiento,
            $this->sesion,
            $this->idJornada,
            $this->idEquipo,
            $this->idCategoria

        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todas las un Subcontenido o varios. 
    public function readAll()
    {
        $sql = 'SELECT id_jornada, id_entrenamiento, detalle_entrenamiento, fecha_entrenamiento 
        FROM vista_jornadas_entrenamientos WHERE id_jornada = ? ORDER BY fecha_entrenamiento DESC;';
        $params = array($this->idJornada);
        return Database::getRows($sql, $params);
    }

    //Función para leer un Subcontenido o varios. 

    public function readOneDetalles()
    {
        $sql = 'SELECT id_entrenamiento, contenidos, sub_tema_contenido FROM 
        vista_entrenamientos_contenidos WHERE id_entrenamiento = ?;';
        $params = array($this->idEntrenamiento);
        return Database::getRows($sql, $params);
    }

    //Función para leer los entrenamientos en movil. 

    public function readAllMobile()
    {
        $sql = 'SELECT 
        e.id_equipo AS IDEQ,
        e.id_entrenamiento AS IDEN,
        e.fecha_entrenamiento AS FECHA,
        CONCAT(h.dia, DATE_FORMAT(e.fecha_entrenamiento, " %d de %M"), " de ", TIME_FORMAT(h.hora_inicial, "%H:%i"), " A ", TIME_FORMAT(h.hora_final, "%H:%i")) AS HORARIO,
        (SELECT COUNT(*) 
        FROM asistencias a
        WHERE a.id_entrenamiento = e.id_entrenamiento AND asistencia = "Asistencia") AS JUGADORES_PRESENTES
        FROM 
        entrenamientos e
        INNER JOIN 
        horarios_categorias r ON e.id_horario_categoria = r.id_horario_categoria
        INNER JOIN 
        horarios h ON r.id_horario = h.id_horario
        WHERE id_equipo = ? AND 
        (SELECT COUNT(*) FROM asistencias a WHERE a.id_entrenamiento = e.id_entrenamiento AND asistencia = "Asistencia") > 0;';
        $params = array($this->idEquipo);
        return Database::getRows($sql, $params);
    }
    //Función para leer un detalle. 

    public function readOneTitulo()
    {
        $sql = 'SELECT id_jornada, titulo FROM vista_jornadas WHERE id_jornada = ?;';
        $params = array($this->idJornada);
        return Database::getRow($sql, $params);
    }

    //Función para leer un Analisis de prueba o varios. 

    public function readOneAnalisis()
    {
        $sql = 'SELECT * FROM temas_contenidos;';
        return Database::getRows($sql);
    }

    //Función para actualizar un Subcontenido o varios. 

    public function updateRow()
    {
        $sql = 'UPDATE entrenamientos SET fecha_entrenamiento = ?, sesion = ?, id_jornada = ?, id_horario_categoria = ? WHERE id_entrenamiento = ?;';
        $params = array(
            $this->fechaEntrenamiento,
            $this->sesion,
            $this->idJornada,
            $this->idCategoria,
            $this->idEntrenamiento
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar un Subcontenido o varios. 

    public function deleteRow()
    {
        $sql = 'DELETE FROM entrenamientos WHERE id_entrenamiento = ?;';
        $params = array($this->idEntrenamiento);
        return Database::executeRow($sql, $params);
    }

    //Función para leer una equipo o varios. 

    public function readOneEquipos()
    {
        $sql = "SELECT id_equipo,  nombre_equipo FROM equipos;";
        return Database::getRows($sql);
    }

    //Función para leer una jornada o varios. 

    public function readOneJornada()
    {
        $sql = "SELECT id_jornada, nombre_jornada FROM jornadas;";
        return Database::getRows($sql);
    }

    //Función para leer una jornada o varios. 

    public function readOneCategoria()
    {
        $sql = "SELECT id_categoria, nombre_categoria FROM vista_entrenamientos_horario_categorias;";
        return Database::getRows($sql);
    }

    //Función para leer una jornada o varios. 

    public function readOne()
    {
        $sql = 'SELECT fecha_entrenamiento, id_entrenamiento, id_equipo, id_horario_categoria, sesion FROM entrenamientos WHERE id_entrenamiento = ?;';
        $params = array($this->idEntrenamiento);
        return Database::getRow($sql, $params);
    }

    public function readAll2()
    {
        $sql = 'SELECT id_jornada, id_entrenamiento, detalle_entrenamiento, fecha_entrenamiento, id_tecnico 
        FROM vista_jornadas_entrenamientos_tecnico WHERE id_jornada = ? AND id_tecnico = ? ORDER BY fecha_entrenamiento DESC;';
        $params = array($this->idJornada, $_SESSION['idTecnico']);
        return Database::getRows($sql, $params);
    }
}
