

let SAVE_MODAL;
let SEE_MODAL;
let SEE_FORM,
    ID_ANALISISV,
    JUGADORV,
    FUERZAV,
    RESISTENCIAV,
    VELOCIDADV,
    AGILIDADV,
    PASE_CORTOV,
    PASE_MEDIOV,
    PASE_LARGOV,
    CONDUCCIONV,
    RECEPCIONV,
    CABECEOV,
    REGATEV,
    DEFINICIONV,
    DECISIONESV,
    OFENSIVOSV,
    DEFENSIVOSV,
    INTERPRETACIONV,
    CONCENTRACIONV,
    AUTOCONFIANZAV,
    SACRICIOV,
    AUTOCONTROLV;
let SAVE_FORM,
    ID_ANALISIS,
    JUGADOR,
    FUERZA,
    RESISTENCIA,
    VELOCIDAD,
    AGILIDAD,
    PASE_CORTO,
    PASE_MEDIO,
    PASE_LARGO,
    CONDUCCION,
    RECEPCION,
    CABECEO,
    REGATE,
    DEFINICION,
    DECISIONES,
    OFENSIVOS,
    DEFENSIVOS,
    INTERPRETACION,
    CONCENTRACION,
    AUTOCONFIANZA,
    SACRICIO,
    AUTOCONTROL;
let SEARCH_FORM;

// Constantes para completar las rutas de la API.
const EQUIPO_API = '';

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
    MODAL_TITLE.textContent = 'Crear análisis del jugador';
    // Se prepara el formulario.
    SAVE_FORM.reset();
}

// Funcion para preparar el formulario al momento de abrirlo

const seeModal = () => {
    SEE_MODAL.show();
    MODAL_TITLE.textContent = 'Análisis del jugador';
    SAVE_FORM.reset();
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
        FORM.append('idAnalisis', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(EQUIPO_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar análisis del jugador';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_EQUIPO.value = ROW.ID;
            NOMBRE_EQUIPO.value = ROW.NOMBRE;
            TELEFONO_EQUIPO.value = ROW.TELEFONO;
            ID_CUERPO_TECNICO.value = ROW.ID_CUERPO_TECNICO;
            ID_ADMINISTRADOR.value = ROW.ID_ADMINISTRADOR;
            ID_CATEGORIA.value = ROW.ID_CATEGORIA;
            LOGO_EQUIPO.value = ROW.LOGO;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar análisis del jugador';
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el análisis?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idAnalisis', id);
            console.log(id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(EQUIPO_API, 'deleteRow', FORM);
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
        confirmAction('¿Desea eliminar el análisis?');
    }

}


async function cargarTabla(form = null) {
    const lista_datos = [
        {
            promedio: 7.45,
            jugador: 'Mateo',
            caracteristicas: 1,
            id: 1,
        },
        {
            promedio: 7.45,
            jugador: 'Mateo',
            caracteristicas: 1,
            id: 2,
        },
        {
            promedio: 7.45,
            jugador: 'Mateo',
            caracteristicas: 1,
            id: 3,
        },
        {
            promedio: 7.45,
            jugador: 'Mateo',
            caracteristicas: 1,
            id: 4,
        }
    ];
    const cargarTabla = document.getElementById('tabla_analisis');

    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(EQUIPO_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const tablaHtml = `
                <tr>
                    <td>${row.NOMBRE}</td>
                    <td>${row.TELEFONO}</td>
                    <td>${row.ID_CATEGORIA}</td>
                    <td>
                        <button type="button" class="btn btn-warnig" onclick="seeModal(${row.ID_CUERPO_TECNICO})">
                        <img src="../../../resources/img/svg/icons_forms/cuerpo_tecnico.svg" width="30" height="30">
                        </button>
                    </td>
                    <td>
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
                <td>${row.promedio}</td>
                <td>${row.jugador}</td>
                <td>
                    <button type="button" class="btn transparente" onclick="seeModal(${row.caracteristicas})">
                    <img src="../../../resources/img/svg/icons_forms/cuerpo_tecnico.svg" width="18px" height="18px">
                    </button>
                </td>
                <td>
                    <button type="button" class="btn transparente" onclick="openUpdate(${row.id})">
                    <img src="../../../resources/img/svg/icons_forms/Frame.svg" width="18" height="18">
                    </button>
                    <button type="button" class="btn transparente" onclick="openUpdate(${row.id})">
                    <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                    </button>
                    <button type="button" class="btn transparente" onclick="openDelete(${row.id})">
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
    const equiposHtml = await loadComponent('../componentes/feaute_analysis.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = equiposHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Análisis de las características';
    cargarTabla();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    SEE_MODAL = new bootstrap.Modal('#seeModal'),
        MODAL_TITLE = document.getElementById('modalTitle2')

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_ANALISIS = document.getElementById('idEquipo'),
        JUGADOR = document.getElementById('nombreEquipo'),
        FUERZA = document.getElementById('telefonoEquipo'),
        RESISTENCIA = document.getElementById('categoriaEquipo'),
        VELOCIDAD = document.getElementById('cuerpoTecnico'),
        AGILIDAD = document.getElementById('idEquipo'),
        PASE_CORTO = document.getElementById('nombreEquipo'),
        PASE_MEDIO = document.getElementById('telefonoEquipo'),
        PASE_LARGO = document.getElementById('categoriaEquipo'),
        CONDUCCION = document.getElementById('cuerpoTecnico'),
        RECEPCION = document.getElementById('idEquipo'),
        CABECEO = document.getElementById('nombreEquipo'),
        REGATE = document.getElementById('telefonoEquipo'),
        DEFINICION = document.getElementById('categoriaEquipo'),
        DECISIONES = document.getElementById('cuerpoTecnico'),
        OFENSIVOS = document.getElementById('idEquipo'),
        DEFENSIVOS = document.getElementById('nombreEquipo'),
        INTERPRETACION = document.getElementById('telefonoEquipo'),
        CONCENTRACION = document.getElementById('categoriaEquipo'),
        AUTOCONFIANZA = document.getElementById('cuerpoTecnico'),
        SACRICIO = document.getElementById('categoriaEquipo'),
        AUTOCONTROL = document.getElementById('cuerpoTecnico'),
        // Método del evento para cuando se envía el formulario de guardar.
        SAVE_FORM.addEventListener('submit', async (event) => {
            // Se evita recargar la página web después de enviar el formulario.
            event.preventDefault();
            // Se verifica la acción a realizar.
            (ID_EQUIPO.value) ? action = 'updateRow' : action = 'createRow';
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
    ID_ANALISISV = document.getElementById('idEquipo'),
    JUGADORV = document.getElementById('nombreEquipo'),
    FUERZAV = document.getElementById('telefonoEquipo'),
    RESISTENCIAv = document.getElementById('categoriaEquipo'),
    VELOCIDADV = document.getElementById('cuerpoTecnico'),
    AGILIDADV = document.getElementById('idEquipo'),
    PASE_CORTOV = document.getElementById('nombreEquipo'),
    PASE_MEDIOV = document.getElementById('telefonoEquipo'),
    PASE_LARGOV = document.getElementById('categoriaEquipo'),
    CONDUCCIONV = document.getElementById('cuerpoTecnico'),
    RECEPCIONV = document.getElementById('idEquipo'),
    CABECEOV = document.getElementById('nombreEquipo'),
    REGATEV = document.getElementById('telefonoEquipo'),
    DEFINICIONV = document.getElementById('categoriaEquipo'),
    DECISIONESV = document.getElementById('cuerpoTecnico'),
    OFENSIVOSV = document.getElementById('idEquipo'),
    DEFENSIVOSV = document.getElementById('nombreEquipo'),
    INTERPRETACIONV = document.getElementById('telefonoEquipo'),
    CONCENTRACIONV = document.getElementById('categoriaEquipo'),
    AUTOCONFIANZAV = document.getElementById('cuerpoTecnico'),
    SACRICIOV = document.getElementById('categoriaEquipo'),
    AUTOCONTROLV = document.getElementById('cuerpoTecnico'),
    // Método del evento para cuando se envía el formulario de guardar.
    SEE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_EQUIPO.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SEE_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(EQUIPO_API, action, FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se cierra la caja de diálogo.
            SEE_MODAL.hide();
            // Se muestra un mensaje de éxito.
            sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            cargarTabla();
        } else {
            sweetAlert(2, DATA.error, false);
            console.error(DATA.exception);
        }
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

    const prevBtns = document.querySelectorAll(".btn-prev");
    const nextBtns = document.querySelectorAll(".btn-next");
    const progress = document.getElementById("progress");
    const formSteps = document.querySelectorAll(".form-step");
    const progressSteps = document.querySelectorAll(".progress-step");

    let formStepsNum = 0;

    nextBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            formStepsNum++;
            updateFormSteps();
            updateProgressbar();
        });
    });

    prevBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            formStepsNum--;
            updateFormSteps();
            updateProgressbar();
        });
    });

    function updateFormSteps() {
        formSteps.forEach((formStep) => {
            formStep.classList.contains("form-step-active") &&
                formStep.classList.remove("form-step-active");
        });

        formSteps[formStepsNum].classList.add("form-step-active");
    }

    function updateProgressbar() {
        progressSteps.forEach((progressStep, idx) => {
            if (idx < formStepsNum + 1) {
                progressStep.classList.add("progress-step-active");
            } else {
                progressStep.classList.remove("progress-step-active");
            }
        });

        const progressActive = document.querySelectorAll(".progress-step-active");

        progress.style.width =
            ((progressActive.length - 1) / (progressSteps.length - 1)) * 100 + "%";
    }
};

