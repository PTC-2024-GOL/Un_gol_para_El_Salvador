let SAVE_MODAL;
let SAVE_FORM,
    ID_PLANTILLA,
    NOMBRE_PLANTILLA;
let SEARCH_FORM;
let ROWS_FOUND;

let DETAIL_MODAL;
let DETAIL_FORM,
    PLANTILLA,
    JUGADOR,
    TEMPORADA,
    EQUIPO;

// Constantes para completar las rutas de la API.
const API = 'services/admin/plantillas.php';
// Constantes para completar las rutas de la API.
const API_PLANTILLAS = 'services/admin/plantillas_equipos.php';
const PLANTILLA_API = 'services/admin/plantillas.php';
const JUGADOR_API = 'services/admin/jugadores.php';
const TEMPORADA_API = 'services/admin/temporadas.php';
const EQUIPO_API = 'services/admin/equipos.php';

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
    MODAL_TITLE.textContent = 'Agregar una plantilla';
    // Se prepara el formulario.
    SAVE_FORM.reset();
}

/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const crearStepper = (id) => {
    const steps = [
        {
            title: "Plantilla",
            content: `<div class="step">
                        <div class="d-flex justify-content-end mb-3">
                            <button type="button" class="btn bg-blue-principal-color text-white next-step">Siguiente</button>
                        </div> 
                        <div class="table-responsive">
                            <table class="table table align-middle table-striped table-borderless">
                                <thead>
                                    <tr>
                                        <td colspan="6" id="rowsFound"></td>
                                    </tr>
                                    <tr>
                                        <th>Dorsal</th>
                                        <th>Posición</th>
                                        <th>Foto</th>
                                        <th>Jugador</th>
                                        <th>Fecha de nacimiento</th>
                                        <th>Logo</th>
                                        <th>Equipo</th>
                                        <th>Temporada</th>
                                    </tr>
                                </thead>
                                <tbody id="tabla_jugadores"></tbody>
                            </table>
                        </div>
                      </div>`
        },
        {
            title: "Jugador",
            content: `<div class="step">
                        <div class="row g-3">
                            <div class="col-sm-12 col-md-6">
                                <label for="plantilla" class="form-label fw-semibold">Elige la plantilla</label>
                                <select id="plantilla" name="plantilla" class="form-select" required></select>
                            </div>
                            <div class="col-sm-12 col-md-6">
                                <label for="equipo" class="form-label fw-semibold">Elige al Equipo</label>
                                <select id="equipo" name="equipo" class="form-select" required></select>
                            </div>
                            <div class="col-sm-12 col-md-6">
                                <label for="temporada" class="form-label fw-semibold">Elige la temporada</label>
                                <select id="temporada" name="temporada" class="form-select" required></select>
                            </div>
                            <div class="col-sm-12 col-md-6">
                                <label for="jugador" class="form-label fw-semibold">Elige al Jugador</label>
                                <select id="jugador" name="jugador" class="form-select" required></select>
                            </div>
                        </div>
                        <div class="btns-group">
                            <div class="mt-5 text-end">
                                <button type="submit" id="guardar" class="btn bg-blue-principal-color text-white">Guardar</button>
                            </div>
                        </div>
                      </div>`
        }
    ];

    let currentStep = 0;

    const createStepper = () => {
        const stepperContainer = document.getElementById('stepper-container');
        const oldStepper = document.getElementById('stepper');
        if (oldStepper) {
            stepperContainer.removeChild(oldStepper);
        }
        const stepperDiv = document.createElement('div');
        stepperDiv.id = 'stepper';
        stepperContainer.appendChild(stepperDiv);

        stepperDiv.innerHTML = `
            <!-- Barra de progreso -->
            <div class="progressbar p-3 container-fluid" id="progressBar">
                <div class="progress" id="progress"></div>
                ${steps.map((step, index) => `<div class="progress-step ${index === 0 ? 'progress-step-active' : ''}" id="progress-step${index + 1}" data-title="${step.title}"></div>`).join('')}
            </div>
            <!-- Contenido del stepper -->
            <div id="stepperContent"></div>
            <!-- Botones de navegación -->
            <div class="d-flex justify-content-between mt-3">
                <button type="button" class="btn bg-red-cream-color text-white " id="prevBtn">Anterior</button>
                <button type="button" class="btn bg-blue-principal-color text-white" id="nextBtn">Siguiente</button>
            </div>
        `;

        document.getElementById('prevBtn').addEventListener('click', () => changeStep(-1));
        document.getElementById('nextBtn').addEventListener('click', () => changeStep(1));
    }

    const showStep = (stepIndex) => {
        const stepperContent = document.getElementById('stepperContent');
        const progress = document.getElementById('progress');
        stepperContent.innerHTML = steps[stepIndex].content;
        progress.style.width = `${(stepIndex / (steps.length - 1)) * 95}%`;

        // Actualizar clases de los pasos
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            if (index <= stepIndex) {
                step.classList.add('progress-step-active');
            } else {
                step.classList.remove('progress-step-active');
            }
        });

        // Actualizar botones
        document.getElementById('prevBtn').style.display = stepIndex === 0 ? 'none' : 'inline-block';
        document.getElementById('nextBtn').innerText = stepIndex === steps.length - 1 ? 'Finalizar' : 'Siguiente';

        // Agregar event listener para el botón "Siguiente" del contenido
        if (stepIndex === 0) {
            document.querySelector('.next-step').addEventListener('click', () => changeStep(1));
        }

        // Si estamos en el primer paso, llenar la tabla
        if (stepIndex === 0) {
            const form = new FormData();
            form.append('idPlantillaEquipo', id);
            cargarTabla(form);
        } else {
            DETAIL_FORM = document.getElementById('detailForm');
            PLANTILLA = document.getElementById('plantilla');
            JUGADOR = document.getElementById('jugador');
            TEMPORADA = document.getElementById('temporada');
            EQUIPO = document.getElementById('equipo');
            fillSelect(PLANTILLA_API, 'readAll', 'plantilla', id);
            fillSelect(JUGADOR_API, 'readAll', 'jugador');
            fillSelect(TEMPORADA_API, 'readAll', 'temporada');
            fillSelect(EQUIPO_API, 'readAll', 'equipo');
            DETAIL_FORM.removeEventListener('submit', detailFormHandler);
            DETAIL_FORM.addEventListener('submit', detailFormHandler);
        }
    }

    const changeStep = (step) => {
        if (currentStep + step >= 0 && currentStep + step < steps.length) {
            currentStep += step;
            showStep(currentStep);
        }
    }

    // Inicializar el stepper al cargar el DOM
    createStepper();
    document.getElementById('detailModal').addEventListener('shown.bs.modal', function () {
        showStep(currentStep);
    });
}

const openDetail = (id, nombre) => {
    // Se muestra la caja de diálogo con su título.
    DETAIL_MODAL.show();
    DETAIL_MODAL_TITLE.textContent = 'Detalle de la plantilla ' + nombre;
    crearStepper(id);
}

async function detailFormHandler(event) {
    event.preventDefault();
    const FORM = new FormData(DETAIL_FORM);
    const DATA = await fetchData(API_PLANTILLAS, 'createRow', FORM);
    if (DATA.status) {
        DETAIL_MODAL.hide();
        sweetAlert(1, DATA.message, true);
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

async function cargarTabla(FORM = null) {
    const cargarTabla = document.getElementById('tabla_jugadores');
    try {
        cargarTabla.innerHTML = '';
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(API_PLANTILLAS, 'readOneTemplate', FORM);
        console.log(DATA);
        // Mostrar elementos obtenidos de la API
        DATA.dataset.forEach(row => {
            const tablaHtml = `
            <tr>
                <td>${row.DORSAL}</td>
                <td>${row.POSICION_PRINCIPAL}</td>
                <td><img src="${SERVER_URL}images/jugadores/${row.IMAGEN}" height="50" width="50" class="circulo"></td>
                <td>${row.NOMBRE}</td>
                <td>${row.NACIMIENTO}</td>
                <td><img src="${SERVER_URL}images/equipos/${row.LOGO}" height="25" width="25" class="circulo"></td>
                <td>${row.NOMBRE_EQUIPO}</td>
                <td>${row.NOMBRE_TEMPORADA}</td>
                <td>
                    <button type="button" id="btnEli" class="btn transparente" onclick="openDeletePlayer(${row.IDP})">
                    <img src="../../../resources/img/svg/icons_forms/trash 1.svg" width="18" height="18">
                    </button>
                </td>
            </tr>
                `;
            cargarTabla.innerHTML += tablaHtml;
        });
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
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
        FORM.append('idPlantilla', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar la plantilla';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_PLANTILLA.value = ROW.ID;
            NOMBRE_PLANTILLA.value = ROW.NOMBRE;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar la plantilla';
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar la plantilla?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idPlantilla', id);
            console.log(id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(API, 'deleteRow', FORM);
            console.log(DATA.status);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se muestra un mensaje de éxito.
                await sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                fillTable();
            } else {
                sweetAlert(2, DATA.error, false);
            }
        }
    }
    catch (Error) {
        console.log(Error + ' Error al cargar el mensaje');
    }

}


// Variables y constantes para la paginación
const plantillasPorPagina = 10;
let paginaActual = 1;
let plantillas = [];

// Función para cargar tabla de técnicos con paginación
async function fillTable(form = null) {
    const cargarTabla = document.getElementById('tabla_plantillas');
    try {
        cargarTabla.innerHTML = '';
        // Petición para obtener los registros disponibles.
        let action;
        form ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        const DATA = await fetchData(API, action, form);
        console.log(DATA);

        if (DATA.status) {
            plantillas = DATA.dataset;
            mostrarPlantillas(paginaActual);
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = DATA.message;
        } else {
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = "Existen 0 coincidencias";
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
    }
}

// Función para mostrar técnicos en una página específica
function mostrarPlantillas(pagina) {
    const inicio = (pagina - 1) * plantillasPorPagina;
    const fin = inicio + plantillasPorPagina;
    const plantillasPagina = plantillas.slice(inicio, fin);

    const cargarTabla = document.getElementById('tabla_plantillas');
    cargarTabla.innerHTML = '';
    plantillasPagina.forEach(row => {
        const tablaHtml = `
                <tr class="text-center">
                    <td>${row.NOMBRE}</td>
                    <td>
                        <button type="button" class="btn btn-warnig" onclick="openDetail(${row.ID}, '${row.NOMBRE}')">
                        <img src="../../../resources/img/svg/icons_forms/cuerpo_tecnico.svg" width="30" height="30">
                        </button>
                    </td>
                    <td>
                    <button type="button" class="btn transparente" onclick="openUpdate(${row.ID})">
                        <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                    </button>
                    <button type="button" class="btn transparente" onclick="openDelete(${row.ID})">
                        <img src="../../../resources/img/svg/icons_forms/trash 1.svg" width="18" height="18">
                    </button>
                    </td>
                </tr>
        `;
        cargarTabla.innerHTML += tablaHtml;
    });

    actualizarPaginacion();
}

// Función para actualizar los contplantillas de paginación
function actualizarPaginacion() {
    const paginacion = document.querySelector('.pagination');
    paginacion.innerHTML = '';

    const totalPaginas = Math.ceil(plantillas.length / plantillasPorPagina);

    if (paginaActual > 1) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-dark" href="#" onclick="cambiarPagina(${paginaActual - 1})">Anterior</a></li>`;
    }

    for (let i = 1; i <= totalPaginas; i++) {
        paginacion.innerHTML += `<li class="page-item ${i === paginaActual ? 'active' : ''}"><a class="page-link text-light" href="#" onclick="cambiarPagina(${i})">${i}</a></li>`;
    }

    if (paginaActual < totalPaginas) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-dark" href="#" onclick="cambiarPagina(${paginaActual + 1})">Siguiente</a></li>`;
    }
}

// Función para cambiar de página
function cambiarPagina(nuevaPagina) {
    paginaActual = nuevaPagina;
    mostrarPlantillas(paginaActual);
}


// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const contentHtml = await loadComponent('../components/template_name.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = contentHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Plantillas';
    ROWS_FOUND = document.getElementById('rowsFound');
    fillTable();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');
    DETAIL_MODAL = new bootstrap.Modal('#detailModal'),
        DETAIL_MODAL_TITLE = document.getElementById('modalTitleDetail');
    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_PLANTILLA = document.getElementById('idPlantilla'),
        NOMBRE_PLANTILLA = document.getElementById('nombrePlantilla');
    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_PLANTILLA.value) ? action = 'updateRow' : action = 'createRow';
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
            fillTable();
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
        fillTable(FORM);
    });
};
