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
    protected $dorsalJ = null;
    protected $nombreJ = null;
    protected  $apellidoJ = null;
    protected $estatusJ = null;
    protected $nacimientoJ = null;
    protected $generoJ = null;
    protected $perfilJ = null;
    protected $becado = null;
    protected $posicionPrincipal = null;
    protected $posicionSecundaria = null;
    protected $claveJ = null;
    protected $fotoJ = null;
    protected $alias = null;

    protected $telefono = null;
    protected $telefono_emergencia = null;
    protected $correoJ = null;
    protected $tipo_sangreJ = null;
    protected $observacion_medica = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/jugadores/';

    
    /*
     *  Métodos para gestionar la cuenta del Jugador.
     */

    //Función para chequear el usuario de un admministrador en el login, sin el procedimiento almacenado.
    
    public function checkUser($username, $password)
    {
        $sql = 'SELECT id_jugador, correo_jugador, 
                clave_jugador, estatus_jugador, 
                foto_jugador, alias_jugador, 
                nombre_jugador, apellido_jugador
                FROM jugadores
                WHERE (BINARY alias_jugador = ? OR BINARY correo_jugador = ?)';
        $params = array($username,$username);
        $data = Database::getRow($sql, $params);
        if (password_verify($password, $data['clave_jugador'])) {
            $this->id = $data['id_jugador'];
            $this->correoJ = $data['correo_jugador'];
            $this->alias = $data['alias_jugador'];
            $this->estatusJ = $data['estatus_jugador'];
            $this->fotoJ = $data['foto_jugador'];
            $this->nombreJ = $data['nombre_jugador'];
            $this->apellidoJ = $data['apellido_jugador'];
            return true;
        } else {
            return false;
        }
    }

    // Función que chequea el estado
    public function checkStatus()
    {
        if ($this->estatusJ == "Activo") {
            $_SESSION['idJugador'] = $this->id;
            $_SESSION['correoJugador'] = $this->correoJ;
            $_SESSION['fotoJugador'] = $this->fotoJ;
            $_SESSION['aliasJugador'] = $this->alias;
            $_SESSION['nombreJugador'] = $this->nombreJ;
            $_SESSION['apellidoJugador'] = $this->apellidoJ;
            return true;
        } else {
            return false;
        }
    }

    //Función para chequear la contraseña de un admministrador.
    public function checkPassword($password)
    {
        $sql = 'SELECT clave_jugador AS CLAVE
                FROM jugadores
                WHERE id_jugador = ?';
        $params = array($_SESSION['idJugador']);
        $data = Database::getRow($sql, $params);
        // Se verifica si la contraseña coincide con el hash almacenado en la base de datos.
        if (password_verify($password, $data['CLAVE'])) {
            return true;
        } else {
            return false;
        }
    }

    //Función para cambiar la contraseña de un admministrador.
    public function changePassword()
    {
        $sql = 'UPDATE jugadores
                SET clave_jugador = ?, fecha_clave = NOW()
                WHERE id_jugador = ?';
        $params = array($this->claveJ, $_SESSION['idJugador']);
        return Database::executeRow($sql, $params);
    }


    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */

    //Función para buscar un jugador.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vista_jugadores
        WHERE nombre_jugador LIKE ? OR apellido_jugador LIKE ?
        ORDER BY fecha_creacion;';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar un jugador.
    public function createRow()
    {
        $sql = 'CALL insertar_jugador (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        $params = array(
            $this->dorsalJ,
            $this->nombreJ,
            $this->apellidoJ,
            $this->estatusJ,
            $this->nacimientoJ,
            $this->generoJ,
            $this->perfilJ,
            $this->becado,
            $this->posicionPrincipal,
            $this->posicionSecundaria,
            $this->claveJ,
            $this->fotoJ,
            $this->telefono,
            $this->telefono_emergencia,
            $this->correoJ,
            $this->tipo_sangreJ,
            $this->observacion_medica
        );
        return Database::executeRow($sql, $params);
    }


    //Función para mostrar todos los jugadores
    public function readAll()
    {
        $sql = 'SELECT * FROM vista_jugadores ORDER BY fecha_creacion;';
        return Database::getRows($sql);
    }

    //Función para mostrar todos los jugadores filtrados por el genero
    public function readAllByGender()
    {
        $sql = 'SELECT * FROM vista_jugadores WHERE genero_jugador = ? ORDER BY fecha_creacion;';
        $params = array($this->generoJ);
        return Database::getRows($sql, $params);
    }


    //Función para mostrar uno de los jugadores
    public function readOne()
    {
        $sql = 'SELECT * FROM vista_jugadores
                WHERE id_jugador= ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function readFilename()
    {
        $sql = 'SELECT foto_jugador
                FROM jugadores
                WHERE id_jugador = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }


    //Función para actualizar jugadores
    public function updateRow()
    {
        $sql = 'CALL actualizar_jugador (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        $params = array(
            $this->id,
            $this->dorsalJ,
            $this->nombreJ,
            $this->apellidoJ,
            $this->estatusJ,
            $this->nacimientoJ,
            $this->generoJ,
            $this->perfilJ,
            $this->becado,
            $this->posicionPrincipal,
            $this->posicionSecundaria,
            $this->fotoJ,
            $this->telefono,
            $this->telefono_emergencia,
            $this->correoJ,
            $this->tipo_sangreJ,
            $this->observacion_medica
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar una jugador.
    public function deleteRow()
    {
        $sql = 'DELETE FROM jugadores WHERE id_jugador = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    ///FUNCIONES PARA MOVIL DE JugadorS - PANTALLA DE RENDIMIENTO

    public function matchesByPlayer()
    {
        $sql = 'SELECT COUNT(id_participacion) AS partidos FROM participaciones_partidos 
                WHERE id_jugador = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function promByPlayer()
    {
        $sql = 'SELECT round(AVG(nota_caracteristica_analisis),1) AS notaGlobal FROM caracteristicas_analisis 
                WHERE id_jugador = ?;';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function notesByPlayer()
    {
        $sql = 'SELECT * FROM notas_por_jugador WHERE id_jugador = ?';
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }

    public function promByPlayerMobilePlayers()
    {
        $sql = 'SELECT round(AVG(nota_caracteristica_analisis),1) AS notaGlobal FROM caracteristicas_analisis 
                WHERE id_jugador = ?;';
        $params = array($_SESSION['idJugador']);
        return Database::getRow($sql, $params);
    }

    public function matchesByPlayeMobilePLayers()
    {
        $sql = 'SELECT COUNT(id_participacion) AS partidos FROM participaciones_partidos 
                WHERE id_jugador = ?';
        $params = array($_SESSION['idJugador']);
        return Database::getRow($sql, $params);
    }

    public function notesByPlayerMobilePlayers()
    {
        $sql = 'SELECT * FROM notas_por_jugador WHERE id_jugador = ?';
        $params = array($_SESSION['idJugador']);
        return Database::getRows($sql, $params);
    }

    public function readOneMobile()
    {
        $sql = 'SELECT * FROM vista_jugadores
                WHERE id_jugador= ?';
        $params = array($_SESSION['idJugador']);
        return Database::getRow($sql, $params);
    }

    public function readOneStats()
    {
        $sql = 'SELECT  COALESCE(SUM(goles), 0) AS TOTAL_GOLES,
		COALESCE(SUM(asistencias), 0) AS TOTAL_ASISTENCIAS,
        COUNT(id_partido) AS TOTAL_PARTIDOS
        FROM participaciones_partidos
        WHERE id_jugador = ? AND (titular = 1 OR sustitucion = 1);';
        $params = array($_SESSION['idJugador']);
        return Database::getRow($sql, $params);
    }

    public function graphicMobile()
    {
        $sql = 'SELECT cj.clasificacion_caracteristica_jugador AS caracteristica,
        ROUND(AVG(C.nota_caracteristica_analisis), 2) AS promedio
        FROM caracteristicas_analisis c
        INNER JOIN caracteristicas_jugadores cj ON c.id_caracteristica_jugador = cj.id_caracteristica_jugador
        WHERE c.id_jugador = ? GROUP BY cj.clasificacion_caracteristica_jugador;';
        $params = array($_SESSION['idJugador']);
        return Database::getRows($sql, $params);
    }
}
