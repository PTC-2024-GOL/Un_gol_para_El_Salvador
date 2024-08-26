<?php

use Phpml\Classification\KNearestNeighbors;

// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');

require('C:/xampp/htdocs/sitio_gol_sv/vendor/autoload.php');

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

    //Funcion para sacar la predicición en registro médico (Predecir el riesgo de lesiones de un grupo)
    public function globalMedicalPrediction()
    {
        $sql = 'SELECT dias_lesionado, id_lesion, dias_recuperacion, tipo_lesion FROM proyectiva_registro_medico WHERE fecha_lesion IS NOT NULL';
        $result = Database::getRows($sql);

        $samples = [];
        $labels = [];
        $contador = 0;
        $tipo = 0;

        // Variables para calcular los promedios y el rango
        $dias_lesionados_total = 0;
        $id_lesion_total = 0;
        $dias_recuperacion_total = 0;

        // Inicializamos las variables para el rango
        $dias_lesionados_min = PHP_INT_MAX;
        $dias_lesionados_max = PHP_INT_MIN;

        // Array para contar las ocurrencias de cada tipo de lesión
        $lesion_count = [];
        $tipos_lesion = [];  // Array para almacenar tipos de lesiones únicos

        // Verificamos si hay resultados
        if (count($result) > 0) {
            foreach ($result as $row) {
                // Añadimos las características al modelo
                $samples[] = [$row['dias_lesionado'], $row['id_lesion'], $row['dias_recuperacion']];

                // Clasificamos el tipo de riesgo de la lesión
                if ($row['dias_lesionado'] > 25) {
                    $labels[] = 'riesgo alto, lo que significa que varios jugadores presentaron lesiones de larga recuperación, con una duración de más de 25 días, por lo que se predice un riesgo bajo.';
                } elseif ($row['dias_lesionado'] > 15) {
                    $labels[] = 'riesgo medio, lo que significa que varios jugadores presentaron lesiones intermedias, con una duración de más de 15 días, por lo que se predice un riesgo medio.';
                } else {
                    $labels[] = 'riesgo bajo, lo que significa que varios jugadores presentaron lesiones de corto plazo, con una duración menor a 15 días, por lo que se predice un riesgo bajo.';
                }

                // Sumamos para sacar promedios globales
                $dias_lesionados_total += $row['dias_lesionado'];
                $id_lesion_total += $row['id_lesion'];
                $dias_recuperacion_total += $row['dias_recuperacion'];

                // Actualizamos el rango de días lesionados
                if ($row['dias_lesionado'] < $dias_lesionados_min) {
                    $dias_lesionados_min = $row['dias_lesionado'];
                }
                if ($row['dias_lesionado'] > $dias_lesionados_max) {
                    $dias_lesionados_max = $row['dias_lesionado'];
                }

                // Contamos las ocurrencias de cada tipo de lesión
                if (!isset($lesion_count[$row['tipo_lesion']])) {
                    $lesion_count[$row['tipo_lesion']] = 0;
                }
                $lesion_count[$row['tipo_lesion']]++;

                // Agregamos el tipo de lesión al array si aún no existe
                if (!in_array($row['tipo_lesion'], $tipos_lesion)) {
                    $tipos_lesion[] = $row['tipo_lesion'];
                }

                $contador++;
            }
        }

        // Evitar división por 0
        if ($contador == 0) {
            throw new Exception("No hay suficientes datos para realizar la predicción.");
        }

        // Calculamos los promedios globales
        $dias_lesionados_promedio = $dias_lesionados_total / $contador;
        $id_lesion_promedio = $id_lesion_total / $contador;
        $dias_recuperacion_promedio = $dias_recuperacion_total / $contador;

        // Entrenamos el modelo de clasificación
        $classifier = new KNearestNeighbors();
        $classifier->train($samples, $labels);

        // Hacemos la predicción global basada en los promedios de todo el grupo
        $nuevos_datos = [$dias_lesionados_promedio, $id_lesion_promedio, $dias_recuperacion_promedio];
        $prediccion = $classifier->predict($nuevos_datos);

        // Asignar $tipo basado en la predicción global
        if (strpos($prediccion, 'riesgo alto') !== false) {
            $tipo = 1;
        } elseif (strpos($prediccion, 'riesgo medio') !== false) {
            $tipo = 2;
        } else {
            $tipo = 3;
        }

        // Encontrar el tipo de lesión más frecuente
        $tipo_lesion_mas_frecuente = array_search(max($lesion_count), $lesion_count);

        // Retornar la predicción, el rango de días lesionados, el tipo de lesión más frecuente y todos los tipos de lesiones
        return [
            'prediccion' => $prediccion,
            'dias_lesionados_rango' => "Varían de $dias_lesionados_min a $dias_lesionados_max días",
            'tipo_lesion_mas_frecuente' => $tipo_lesion_mas_frecuente,
            'tipos_lesiones' => $tipos_lesion, // Retornamos todos los tipos de lesiones
            'tipo' => $tipo
        ];
    }
}