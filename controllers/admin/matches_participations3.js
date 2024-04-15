let SAVE_MODAL,
    MODAL_TITLE;

let SEE_MODAL,
    MODAL_TITLE1;

let GOLES_MODAL,
    MODAL_TITLE2;

let AMONESTACION_MODAL,
    MODAL_TITLE3;

let SEE_FORM_PARTICIPACION,
    ID_PARTICIPACION1,
    ID_JUGADOR1,
    TITULAR1,
    SUSTITUCION1,
    MINUTOS_JUGADOS1,
    GOLES1,
    ASISTENCIAS1,
    ESTADO_ANIMO1,
    PUNTUACION1;

let SAVE_FORM_PARTICIPACION,
    ID_PARTICIPACION,
    ID_JUGADOR,
    TITULAR,
    SUSTITUCION,
    MINUTOS_JUGADOS,
    GOLES,
    ASISTENCIAS,
    ESTADO_ANIMO,
    PUNTUACION;
    
let SAVE_FORM_GOLES,
    ID_GOLES,
    ID_PARTICIPACION_GOL,
    CANTIDAD,
    ID_TIPO_GOL;
    MINUTOS_JUGADOS,
    GOLES,
    ASISTENCIAS,
    ESTADO_ANIMO,
    PUNTUACION;

let SAVE_FORM_AMONESTACION,
    ID_AMONESTACION
    ID_PARTICIPACION,
    CANTIDAD,
    ID_TIPO_GOL;
    MINUTOS_JUGADOS,
    GOLES,
    ASISTENCIAS,
    ESTADO_ANIMO,
    PUNTUACION;

let SEARCH_FORM;

// Constantes para completar las rutas de la API.
const PARTICIPACION_API = '';

async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}
/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Agregar participación del jugador';
    // Se prepara el formulario.
    SAVE_FORM.reset();
}

/*
*   Función para abrir los goles del jugador.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openGoles = () => {
    // Se muestra la caja de diálogo con su título.
    GOLES_MODAL.show();
    MODAL_TITLE2.textContent = 'Agregar tipo de gol';
    // Se prepara el formulario.
    SAVE_FORM.reset();
}

/*
*   Función para abrir las amonestaciones del jugador.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openAmonestaciones = () => {
    // Se muestra la caja de diálogo con su título.
    GOLES_MODAL.show();
    MODAL_TITLE3.textContent = 'Agregar amonestación';
    // Se prepara el formulario.
    SAVE_FORM.reset();
}

// Funcion para preparar el formulario al momento de abrirlo

const seeModal = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idParticipacion', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(PARTICIPACION_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SEE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar participación del jugador';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_PARTICIPACION1.value = ROW.ID;
            ID_JUGADOR1.value = ROW.JUGADOR;
            TITULAR1.value = ROW.TITULAR;
            SUSTITUCION1.value = ROW.SUSTITUCION;
            MINUTOS_JUGADOS1.value = ROW.MINUTOS_JUGADOS;
            GOLES1.value = ROW.GOLES;
            ASISTENCIAS1.value = ROW.ASISTENCIAS;
            ESTADO_ANIMO1.value = ROW.ESTADO_ANIMO;
            PUNTUACION1.value = ROW.PUNTUACION;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        SEE_MODAL.show();
        MODAL_TITLE1.textContent = 'Participación del jugador';
        SEE_FORM.reset();
    }
}


/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdate = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idParticipacion', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(PARTICIPACION_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar participación del jugador';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_PARTICIPACION1.value = ROW.ID;
            ID_JUGADOR1.value = ROW.JUGADOR;
            TITULAR1.value = ROW.TITULAR;
            SUSTITUCION1.value = ROW.SUSTITUCION;
            MINUTOS_JUGADOS1.value = ROW.MINUTOS_JUGADOS;
            GOLES1.value = ROW.GOLES;
            ASISTENCIAS1.value = ROW.ASISTENCIAS;
            ESTADO_ANIMO1.value = ROW.ESTADO_ANIMO;
            PUNTUACION1.value = ROW.PUNTUACION;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar participación del jugador';
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar la participación del jugador?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idParticipacion', id);
            console.log(id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(PARTICIPACION_API, 'deleteRow', FORM);
            console.log(DATA.status);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se muestra un mensaje de éxito.
                await sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                cargarTabla();
            } else {
                sweetAlert(2, DATA.error, false);
            }
        }
    }
    catch (Error) {
        console.log(Error + ' Error al cargar el mensaje');
        confirmAction('¿Desea eliminar la participación del jugador?');
    }

}


async function cargarTabla(form = null) {
    const lista_datos = [
        {
            imagen: '../../../../resources/img/svg/avatar.svg',
            nombre: 'Mateo',
            apellido: 'Ramírez',
            minutosJugados: 30,
            id: 1,
        },
        {
            imagen:  '../../../../resources/img/svg/avatar.svg',
            nombre: 'Mateo',
            apellido: 'Ramírez',
            minutosJugados: 30,
            id: 2,
        },
        {
            imagen:  '../../../../resources/img/svg/avatar.svg',
            nombre: 'Mateo',
            apellido: 'Ramírez',
            minutosJugados: 30,
            id: 3,
        },
        {
            imagen:  '../../../../resources/img/svg/avatar.svg',
            nombre: 'Mateo',
            apellido: 'Ramírez',
            minutosJugados: 30,
            id: 4,
        }
    ];
    const cargarTabla = document.getElementById('tabla_participacion');

    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(PARTICIPACION_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const tablaHtml = `
                <tr>
                    <img src="${SERVER_URL}images/admin/${row.imagen}" height="50" width="50" class="circulo"></td>
                    <td>${row.NOMBRE}</td>
                    <td>${row.APELLIDO}</td>
                    <td>${row.MINUTOS_JUGADOS}</td>
                    <td>
                        <button type="button" class="btn btn-warnig" onclick="openGoles()">
                        <img src="../../../resources/img/svg/icons_forms/ball.svg" width="30" height="30">
                        </button>
                    </td>
                    <td>
                        <button type="button" class="btn btn-warnig" onclick="openAmonestacion()">
                        <img src="../../../resources/img/svg/icons_forms/amonestacion.svg" width="30" height="30">
                        </button>
                    </td>
                    <td>
                        <button type="button" class="btn btn-outline-success" onclick="openUpdate(${row.ID})">
                        <img src="../../../recursos/img/svg/icons_forms/Frame.svg" width="30" height="30">
                        </button>
                        <button type="button" class="btn btn-outline-success" onclick="openUpdate(${row.ID})">
                        <img src="../../../recursos/img/svg/icons_forms/pen 1.svg" width="30" height="30">
                        </button>
                        <button type="button" class="btn btn-outline-danger" onclick="openDelete(${row.ID})">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>
                `;
                cargarTabla.innerHTML += tablaHtml;
            });
        } else {
            sweetAlert(4, DATA.error, true);
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        // Mostrar materiales de respaldo
        lista_datos.forEach(row => {
            const tablaHtml = `
            <tr>
                <td><img src="${row.imagen}" height="50" width="50" class="circulo"></td>
                <td>${row.nombre}</td>
                <td>${row.apellido}</td>
                <td>${row.minutosJugados}</td>
                <td>
                    <button type="button" class="btn transparente" onclick="openGoles()">
                    <img src="../../../resources/img/svg/icons_forms/ball.svg" width="30" height="30">
                    </button>
                </td>
                <td>
                    <button type="button" class="btn transparente" onclick="openAmonestacion()">
                    <img src="../../../resources/img/svg/icons_forms/amonestacion.svg" width="30" height="30">
                    </button>
                </td>
                <td>
                    <button type="button" class="btn transparente" onclick="seeModal(${row.id})">
                    <img src="../../../resources/img/svg/icons_forms/cuerpo_tecnico.svg" width="18px" height="18px">
                    </button>
                    <button type="button" class="btn transparente" onclick="seeModal(${row.cuerpo_técnico})">
                    <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18px" height="18px">
                    </button>
                    <button type="button" class="btn transparente" onclick="seeModal(${row.cuerpo_técnico})">
                    <img src="../../../resources/img/svg/icons_forms/trash 1.svg" width="18" height="18">
                    </button>
                </td>
            </tr>
            `;
            cargarTabla.innerHTML += tablaHtml;
        });
    }
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los componentes de manera síncrona
    const participacionHtml = await loadComponent('../componentes/matches_participations3.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = participacionHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Participaciones';
    cargarTabla();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    SEE_MODAL = new bootstrap.Modal('#seeModal'),
        MODAL_TITLE1 = document.getElementById('modalTitle2')


    GRAPHIC_MODAL = new bootstrap.Modal('#graphicModal'),
        MODAL_TITLE2 = document.getElementById('modalTitle3')

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_ANALISIS = document.getElementById('idAnalisis'),
        JUGADOR = document.getElementById('jugador'),
        FUERZA = document.getElementById('fuerza'),
        RESISTENCIA = document.getElementById('resistencia'),
        VELOCIDAD = document.getElementById('velocidad'),
        AGILIDAD = document.getElementById('agilidad'),
        PASE_CORTO = document.getElementById('paseCorto'),
        PASE_MEDIO = document.getElementById('paseMedio'),
        PASE_LARGO = document.getElementById('paseLargo'),
        CONDUCCION = document.getElementById('conduccion'),
        RECEPCION = document.getElementById('recepcion'),
        CABECEO = document.getElementById('cabeceo'),
        REGATE = document.getElementById('regate'),
        DEFINICION = document.getElementById('definicionGol'),
        DECISIONES = document.getElementById('tomaDecisiones'),
        OFENSIVOS = document.getElementById('conceptosOfensivos'),
        DEFENSIVOS = document.getElementById('conceptosDefensivos'),
        INTERPRETACION = document.getElementById('interpretacion'),
        CONCENTRACION = document.getElementById('concentracion'),
        AUTOCONFIANZA = document.getElementById('autoconfianza'),
        SACRICIO = document.getElementById('sacrificio'),
        AUTOCONTROL = document.getElementById('autocontrol'),
        // Método del evento para cuando se envía el formulario de guardar.
        SAVE_FORM.addEventListener('submit', async (event) => {
            // Se evita recargar la página web después de enviar el formulario.
            event.preventDefault();
            // Se verifica la acción a realizar.
            (ID_ANALISIS.value) ? action = 'updateRow' : action = 'createRow';
            // Constante tipo objeto con los datos del formulario.
            const FORM = new FormData(SAVE_FORM);
            // Petición para guardar los datos del formulario.
            const DATA = await fetchData(EQUIPO_API, action, FORM);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se cierra la caja de diálogo.
                SAVE_MODAL.hide();
                // Se muestra un mensaje de éxito.
                sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                cargarTabla();
            } else {
                sweetAlert(2, DATA.error, false);
                console.error(DATA.exception);
            }
        });

    // Constantes para establecer los elementos del formulario de guardar.
    SEE_FORM = document.getElementById('viewForm'),
        ID_ANALISISV = document.getElementById('idAnalisisV'),
        JUGADORV = document.getElementById('jugadorV'),
        FUERZAV = document.getElementById('fuerzaV'),
        RESISTENCIAV = document.getElementById('resistenciaV'),
        VELOCIDADV = document.getElementById('velocidadV'),
        AGILIDADV = document.getElementById('agilidadV'),
        PASE_CORTOV = document.getElementById('paseCortoV'),
        PASE_MEDIOV = document.getElementById('paseMedioV'),
        PASE_LARGOV = document.getElementById('paseLargoV'),
        CONDUCCIONV = document.getElementById('conduccionV'),
        RECEPCIONV = document.getElementById('recepcionV'),
        CABECEOV = document.getElementById('cabeceoV'),
        REGATEV = document.getElementById('regateV'),
        DEFINICIONV = document.getElementById('definicionGolV'),
        DECISIONESV = document.getElementById('tomaDecisionesV'),
        OFENSIVOSV = document.getElementById('conceptosOfensivosV'),
        DEFENSIVOSV = document.getElementById('conceptosDefensivosV'),
        INTERPRETACIONV = document.getElementById('interpretacionV'),
        CONCENTRACIONV = document.getElementById('concentracionV'),
        AUTOCONFIANZAV = document.getElementById('autoconfianzaV'),
        SACRICIOV = document.getElementById('sacrificioV'),
        AUTOCONTROLV = document.getElementById('autocontrolV');
    
    // Método del evento para cuando se envía el formulario de guardar.
    SEE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
    });

    // Constante para establecer el formulario de buscar.
    SEARCH_FORM = document.getElementById('searchForm');
    // Verificar si SEARCH_FORM está seleccionado correctamente
    console.log(SEARCH_FORM)
    // Método del evento para cuando se envía el formulario de buscar.
    SEARCH_FORM.addEventListener('submit', (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SEARCH_FORM);
        console.log(SEARCH_FORM);
        console.log(FORM);
        // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
        cargarTabla(FORM);
    });
};

