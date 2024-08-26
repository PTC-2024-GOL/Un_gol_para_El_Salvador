<?php

// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');

/*
 *  Clase para manejar el comportamiento de los datos de la tabla tipos de jugadas.
 */

class RegistrosHandler{

    //Declaracion de variables aqui
    protected $idRegistroMedico = null;
    protected $jugador = null;
    protected $fechaLesion = null;
    protected $fechaRegistro = null;
    protected $diasLesionado = null;
    protected $lesion = null;
    protected $retornoEntreno = null;
    protected $retornoPartido = null;

    /*
    *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */

    //Función para buscar un registro médico.
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT * FROM vista_registros_medicos
        WHERE nombre_completo_jugador LIKE ?
        ORDER BY nombre_completo_jugador;';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    //Función para buscar un registro médico.
    public function searchRowsTechnics()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT DISTINCT
        rm.id_registro_medico,
        rm.id_jugador,
        CONCAT(j.nombre_jugador, " " , j.apellido_jugador) AS nombre_completo_jugador,
        rm.fecha_lesion,
        rm.fecha_registro,
        rm.dias_lesionado,
        rm.id_lesion,
        l.id_tipo_lesion,
        l.id_sub_tipologia,
        st.nombre_sub_tipologia,
        rm.retorno_entreno,
        rm.retorno_partido,
        p.fecha_partido
        FROM 
        registros_medicos rm
        INNER JOIN 
        jugadores j ON rm.id_jugador = j.id_jugador
        INNER JOIN 
        lesiones l ON rm.id_lesion = l.id_lesion
        INNER JOIN 
        sub_tipologias st ON l.id_sub_tipologia = st.id_sub_tipologia
        LEFT JOIN 
        partidos p ON rm.retorno_partido = p.id_partido
        RIGHT JOIN 
        plantillas_equipos pe ON pe.id_jugador = j.id_jugador
        RIGHT JOIN 
        equipos e ON pe.id_equipo = e.id_equipo
        RIGHT JOIN 
        cuerpos_tecnicos ct ON ct.id_cuerpo_tecnico = e.id_cuerpo_tecnico 
        LEFT JOIN 
        detalles_cuerpos_tecnicos dct ON ct.id_cuerpo_tecnico = dct.id_cuerpo_tecnico
        WHERE 
        dct.id_tecnico = ? AND (j.nombre_jugador LIKE ? OR j.apellido_jugador LIKE ?)
        ORDER BY j.nombre_jugador, j.apellido_jugador;';
        $params = array($_SESSION['idTecnico'], $value, $value);
        return Database::getRows($sql, $params);
    }

    //Función para insertar un registro médico.
    public function createRow()
    {
        if ($this->retornoPartido == ''){
            $this->retornoPartido = NULL;
        }

        $sql = 'CALL sp_insertar_registro_medico(?,?,?,?,?,?);';
        $params = array(
            $this->jugador,
            $this->fechaLesion,
            $this->diasLesionado,
            $this->lesion,
            $this->retornoEntreno,
            $this->retornoPartido
        );
        return Database::executeRow($sql, $params);
    }

    //Función para leer todas los registros médicos.
    public function readAll()
    {
        $sql = 'SELECT * FROM vista_registros_medicos
        ORDER BY nombre_completo_jugador;';
        return Database::getRows($sql);
    }

       //Función para leer todas los registros médicos.
       public function readAllTechnics()
       {
           $sql = 'SELECT DISTINCT
           rm.id_registro_medico,
           rm.id_jugador,
           CONCAT(j.nombre_jugador, " " , j.apellido_jugador) AS nombre_completo_jugador,
           rm.fecha_lesion,
           rm.fecha_registro,
           rm.dias_lesionado,
           rm.id_lesion,
           l.id_tipo_lesion,
           l.id_sub_tipologia,
           st.nombre_sub_tipologia,
           rm.retorno_entreno,
           rm.retorno_partido,
           p.fecha_partido
           FROM 
           registros_medicos rm
           INNER JOIN 
           jugadores j ON rm.id_jugador = j.id_jugador
           INNER JOIN 
           lesiones l ON rm.id_lesion = l.id_lesion
           INNER JOIN 
           sub_tipologias st ON l.id_sub_tipologia = st.id_sub_tipologia
           LEFT JOIN 
           partidos p ON rm.retorno_partido = p.id_partido
           RIGHT JOIN 
           plantillas_equipos pe ON pe.id_jugador = j.id_jugador
           RIGHT JOIN 
           equipos e ON pe.id_equipo = e.id_equipo
           RIGHT JOIN 
           cuerpos_tecnicos ct ON ct.id_cuerpo_tecnico = e.id_cuerpo_tecnico 
           LEFT JOIN 
           detalles_cuerpos_tecnicos dct ON ct.id_cuerpo_tecnico = dct.id_cuerpo_tecnico
           WHERE 
           dct.id_tecnico = ?
           ORDER BY 
           j.nombre_jugador, j.apellido_jugador;';
           $params = array($_SESSION['idTecnico']);
           return Database::getRows($sql, $params);
       }

    //Función para leer un registro médico.
    public function readOne()
    {
        $sql = 'SELECT * FROM registros_medicos
        WHERE id_registro_medico LIKE ?';
        $params = array($this->idRegistroMedico);
        return Database::getRow($sql, $params);
    }

    //Función para leer un registro médico.
    public function readOne1()
    {
        $sql = 'SELECT 
        rm.id_registro_medico,
        rm.id_jugador,
        CONCAT(j.nombre_jugador, " ", j.apellido_jugador) AS NOMBRE,
        j.foto_jugador AS FOTO,
        rm.fecha_lesion AS FECHALESION,
        rm.fecha_registro,
        rm.dias_lesionado AS DIAS,
        rm.id_lesion,
        l.id_tipo_lesion,
        l.id_sub_tipologia,
        st.nombre_sub_tipologia AS LESION,
        rm.retorno_entreno AS RETORNO,
        rm.retorno_partido,
        p.fecha_partido
        FROM 
        registros_medicos rm
        INNER JOIN 
        jugadores j ON rm.id_jugador = j.id_jugador
        INNER JOIN 
        lesiones l ON rm.id_lesion = l.id_lesion
        INNER JOIN 
        sub_tipologias st ON l.id_sub_tipologia = st.id_sub_tipologia
        LEFT JOIN 
        partidos p ON rm.retorno_partido = p.id_partido
        WHERE rm.id_registro_medico LIKE ?';
        $params = array($this->idRegistroMedico);
        return Database::getRow($sql, $params);
    }

    //Función para actualizar un registro médico.
    public function updateRow()
    {
        if ($this->retornoPartido == ''){
            $this->retornoPartido = NULL;
        }

        $sql = 'CALL sp_actualizar_registro_medico(?,?,?,?,?,?,?);';
        $params = array(
            $this->idRegistroMedico,
            $this->jugador,
            $this->fechaLesion,
            $this->diasLesionado,
            $this->lesion,
            $this->retornoEntreno,
            $this->retornoPartido
        );
        return Database::executeRow($sql, $params);
    }

    //Función para eliminar un registro médico.
    public function deleteRow()
    {
        $sql = 'CALL sp_eliminar_registro_medico(?);';
        $params = array($this->idRegistroMedico);
        return Database::executeRow($sql, $params);
    }

    //Función para contar el número de lesiones por mes del último año
    public function graphic()
    {
        $sql = 'SELECT 
            MONTH(fecha_lesion) AS MES_NUMERO,
            MONTHNAME(fecha_lesion) AS MES_NOMBRE, 
            COUNT(*) AS CANTIDAD_LESIONES
            FROM registros_medicos
            WHERE fecha_lesion >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
            GROUP BY MES_NUMERO, MES_NOMBRE
            ORDER BY MES_NUMERO;';
    return Database::getRows($sql);
    }

}

