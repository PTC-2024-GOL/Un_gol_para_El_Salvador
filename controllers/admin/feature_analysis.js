

let SAVE_MODAL,
    MODAL_TITLE;
let GRAPHIC_MODAL,
    MODAL_TITLE2;
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
let ESTADO_INICIAL_SAVE_FORM;
let ESTADO_INICIAL_VIEW_FORM;

// Constantes para completar las rutas de la API.
const API = 'services/admin/caracteristicas_analisis.php';

// Constante tipo objeto para obtener los parámetros disponibles en la URL.
let PARAMS = new URLSearchParams(location.search);

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
    restaurarFormulario(23.75);
}

/*
*   Función para abrir la gráfica al momento.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openGraphic = () => {
    // Se muestra la caja de diálogo con su título.
    GRAPHIC_MODAL.show();
    MODAL_TITLE2.textContent = 'Gráfica de análisis del jugador';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    graficoBarrasAnalisis();
}


// Ocultar el primer form-step y mostrar el segundo
function updateSteps(currentStep, nextStep) {
    // Ocultar el form-step actual y mostrar el siguiente
    const currentFormStep = document.getElementById(`step${currentStep}`);
    const nextFormStep = document.getElementById(`step${nextStep}`);
    currentFormStep.remove();
    nextFormStep.classList.add('form-step-active');

    // Ocultar el progress-step actual y mostrar el siguiente
    const currentProgressStep = document.getElementById(`progress-step${currentStep}`);
    const nextProgressStep = document.getElementById(`progress-step${nextStep}`);
    currentProgressStep.remove();
    nextProgressStep.classList.add('progress-step-active');

    const form = document.getElementById('saveForm');
    const formInputs = form.querySelectorAll("input");
    formInputs.forEach((input) => {
        input.disabled = true;
        input.placeholder = "";
    });
    const deletePast = document.getElementById(`past`);
    deletePast.remove();
    const deleteSave = document.getElementById(`guardar`);
    deleteSave.remove();

}


// Funcion para preparar el formulario al momento de abrirlo

const seeModal = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idAnalisis', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(API, 'readOne', FORM);
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
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Análisis del jugador';
        SAVE_FORM.reset();
        restaurarFormulario(31.16);
        // Ejemplo de uso: actualizar del paso 1 al paso 2
        updateSteps(1, 2);

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
        FORM.append('idAnalisis', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(API, 'readOne', FORM);
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
        restaurarFormulario(23.75);
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
            const DATA = await fetchData(API, 'deleteRow', FORM);
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
    }

}


async function buscarAnalisis(FORM) {
    const cargarTabla = document.getElementById('tabla_analisis');

    cargarTabla.innerHTML = '';
    // Se define un objeto con los datos de la categoría seleccionada.
    FORM.append('idEntrenamiento', PARAMS.get('id'));
    console.log(FORM);
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(API, "searchRows", FORM);
    console.log(DATA);

    if (DATA.status) {
        // Mostrar elementos obtenidos de la API
        DATA.dataset.forEach(row => {
            const tablaHtml = `
            <tr>
                <td>${row.PROMEDIO}</td>
                <td>${row.JUGADOR}</td>
                <td>
                    <button type="button" class="btn transparente" onclick="seeModal()">
                    <img src="../../../resources/img/svg/icons_forms/cuerpo_tecnico.svg" width="18px" height="18px">
                    </button>
                </td>
                <td>
                    <button type="button" class="btn transparente" onclick="openGraphic(${row.IDJ})">
                    <img src="../../../resources/img/svg/icons_forms/Frame.svg" width="18" height="18">
                    </button>
                    <button type="button" class="btn transparente" onclick="openUpdate(${row.IDJ})">
                    <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                    </button>
                    <button type="button" class="btn transparente" onclick="openDelete(${row.IDJ})">
                    <img src="../../../resources/img/svg/icons_forms/trash 1.svg" width="18" height="18">
                    </button>
                </td>
            </tr>
                `;
            cargarTabla.innerHTML += tablaHtml;
        });
    } else {
        sweetAlert(4, DATA.error, true);
    }
}

async function cargarTabla() {
    const lista_datos = [
        {
            promedio: 7.45,
            jugador: 'Mateo',
            caracteristicas: 1,
            id: 1,
        },
        {
            promedio: 8.45,
            jugador: 'Sochi',
            caracteristicas: 1,
            id: 2,
        },
        {
            promedio: 9.45,
            jugador: 'Guayito',
            caracteristicas: 1,
            id: 3,
        },
        {
            promedio: 5.45,
            jugador: 'Carlos',
            caracteristicas: 1,
            id: 4,
        }
    ];
    const cargarTabla = document.getElementById('tabla_analisis');

    try {
        cargarTabla.innerHTML = '';
        // Se define un objeto con los datos de la categoría seleccionada.
        const FORM = new FormData();
        FORM.append('idEntrenamiento', PARAMS.get('id'));
        console.log(FORM);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(API, "readAll", FORM);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const tablaHtml = `
            <tr>
                <td>${row.PROMEDIO}</td>
                <td>${row.JUGADOR}</td>
                <td>
                    <button type="button" class="btn transparente" onclick="seeModal()">
                    <img src="../../../resources/img/svg/icons_forms/cuerpo_tecnico.svg" width="18px" height="18px">
                    </button>
                </td>
                <td>
                    <button type="button" class="btn transparente" onclick="openGraphic(${row.IDJ})">
                    <img src="../../../resources/img/svg/icons_forms/Frame.svg" width="18" height="18">
                    </button>
                    <button type="button" class="btn transparente" onclick="openUpdate(${row.IDJ})">
                    <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                    </button>
                    <button type="button" class="btn transparente" onclick="openDelete(${row.IDJ})">
                    <img src="../../../resources/img/svg/icons_forms/trash 1.svg" width="18" height="18">
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
                    <button type="button" class="btn transparente" onclick="seeModal()">
                    <img src="../../../resources/img/svg/icons_forms/cuerpo_tecnico.svg" width="18px" height="18px">
                    </button>
                </td>
                <td>
                    <button type="button" class="btn transparente" onclick="openGraphic(${row.id})">
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

/*
*   Función asíncrona para mostrar un gráfico de barras con la cantidad de productos por categoría.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const graficoBarrasAnalisis = async () => {
    /*
*   Lista de datos de ejemplo en caso de error al obtener los datos reales.
*/
    const datosEjemplo = [
        {
            caracteristica: 'Fuerza',
            nota: 7
        },
        {
            caracteristica: 'Resistencia',
            nota: 5
        },
        {
            caracteristica: 'Agilidad',
            nota: 7
        },
        {
            caracteristica: 'Velocidad',
            nota: 2
        }
    ];

    let caracteristicas = [];
    let notas = [];
    datosEjemplo.forEach(filter => {
        caracteristicas.push(filter.caracteristica);
        notas.push(filter.nota);
    });
    // Si ocurre un error, se utilizan los datos de ejemplo definidos arriba.
    barGraph('analisis', caracteristicas, notas, 'Análisis de características');

}

// Función para restaurar el formulario guardar
const restaurarFormulario = async (num = null) => {
    document.getElementById('saveForm').innerHTML = ESTADO_INICIAL_SAVE_FORM;

    const prevBtns = document.querySelectorAll(".btn-prev");
    const nextBtns = document.querySelectorAll(".btn-next");
    const progress = document.getElementById("progress");
    const formSteps = document.querySelectorAll(".form-step");
    const progressSteps = document.querySelectorAll(".progress-step");

    let formStepsNum = 0;
    updateFormSteps(); // Asegurar que el primer paso esté activo al cargar el formulario
    updateProgressbar(); // Asegurar que la barra de progreso se llene correctamente al cargar el formulario


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
        const widthIncrement = num; // Porcentaje de incremento deseado

        // Calculamos el nuevo ancho de la barra de progreso
        let widthPercentage = (progressActive.length - 1) * widthIncrement;

        // Asignamos el nuevo ancho a la barra de progreso
        progress.style.width = widthPercentage + "%";
    }
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const equiposHtml = await loadComponent('../components/feaute_analysis.html');
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
        AUTOCONTROL = document.getElementById('autocontrol');
    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_ANALISIS.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(API, action, FORM);
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
    ESTADO_INICIAL_SAVE_FORM = document.getElementById('saveForm').innerHTML;

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
        buscarAnalisis(FORM);
    });
};

