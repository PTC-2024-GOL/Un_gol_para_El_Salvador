

let SAVE_MODAL,
    MODAL_TITLE;
let GRAPHIC_MODAL,
    MODAL_TITLE2;
let SAVE_FORM,
    ID_PLANTILLA,
    PLANTILLA,
    JUGADOR,
    TEMPORADA,
    EQUIPO;
let SEARCH_FORM;
let ESTADO_INICIAL_SAVE_FORM;
let ROWS_FOUND;

// Constantes para completar las rutas de la API.
const API = 'services/admin/plantillas_equipos.php';
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
    MODAL_TITLE.textContent = 'Agregar jugador a plantilla';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    restaurarFormulario(25);
    // Ejemplo de uso: actualizar del paso 1 al paso 2
    updateSteps(1, 2);
    fillSelect(PLANTILLA_API, 'readAll', 'plantilla');
    fillSelect(JUGADOR_API, 'readAll', 'jugador');
    fillSelect(TEMPORADA_API, 'readAll', 'temporada');
    fillSelect(EQUIPO_API, 'readAll', 'equipo');
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
    });

    const deleteProgressBar = document.getElementById(`progressBar`);
    deleteProgressBar.remove();
}



// Ocultar el primer form-step y mostrar el segundo
function updateStepsTwo(currentStep, nextStep) {
    // Ocultar el form-step actual y mostrar el siguiente
    const currentFormStep = document.getElementById(`step${currentStep}`);
    const nextFormStep = document.getElementById(`step${nextStep}`);
    currentFormStep.remove();
    nextFormStep.classList.add('form-step-active');
}


// Funcion para preparar el formulario al momento de abrirlo

const seeModal = async (idPlantilla, idEquipo, idTemporada) => {
    try {
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar la plantilla';
        restaurarFormulario(95);
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idPlantillaEquipo', idPlantilla);
        FORM.append('idEquipo', idEquipo);
        FORM.append('temporada', idTemporada);
        restaurarFormulario(95);
        // Ejemplo de uso: actualizar del paso 1 al paso 2
        updateSteps(2, 1);
        // Petición para obtener los datos del registro solicitado.
        fillTable(FORM);
    } catch (Error) {
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Plantilla';
        SAVE_FORM.reset();
        restaurarFormulario(95);
        eliminarBotonesTablaJugadores();
        // Ejemplo de uso: actualizar del paso 1 al paso 2
        updateSteps(2, 1);
    }
}


/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdate = async (id, idPlantilla, idEquipo, idTemporada) => {
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
            restaurarFormulario(95);
            const form = new FormData();
            form.append('idPlantillaEquipo', idPlantilla);
            form.append('idEquipo', idEquipo);
            FORM.append('temporada', idTemporada);
            console.log('Id Plantilla ' +idPlantilla);
            console.log('Id Equipo '+idEquipo);
            fillTable(form);
            const deleteProgressBar = document.getElementById(`progressBar`);
            deleteProgressBar.remove();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            fillSelect(PLANTILLA_API, 'readAll', 'plantilla', ROW.ID_PLANTILLA);
            fillSelect(TEMPORADA_API, 'readAll', 'temporada', ROW.ID_TEMPORADA);
            fillSelect(EQUIPO_API, 'readAll', 'equipo', ROW.ID_EQUIPO);
        } else {
            console.log(id)
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar la plantilla';
        restaurarFormulario(95);
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id, idEquipo, idTemporada) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el análisis?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idPlantilla', id);
            FORM.append('idEquipo', idEquipo);
            FORM.append('idTemporada', idTemporada);
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

/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdatePlayer = async (id, idp) => {
    try {
        ID_PLANTILLA.value = idp;
        console.log('idPlantilla ' + ID_PLANTILLA.value)
        fillSelect(JUGADOR_API, 'readAll', 'jugador', id);
        console.log(id);
        console.log(ID_PLANTILLA.value)
        updateStepsTwo(1, 2);
    } catch (Error) {
        console.log(Error);
    }
}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDeletePlayer = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el jugador de la plantilla?');
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

function eliminarBotonesTablaJugadores() {
    const botonesEditar = document.querySelectorAll('#tabla_jugadores #btnAct');
    const botonesEliminar = document.querySelectorAll('#tabla_jugadores #btnEli');
    const progressBar = document.getElementById('progressBar'); // Eliminamos la progress bar

    botonesEditar.forEach(boton => {
        boton.remove();
    });

    botonesEliminar.forEach(boton => {
        boton.remove();
    });

    if (progressBar) {
        progressBar.remove(); // Aseguramos que la progress bar exista antes de intentar eliminarla
    }
}


async function fillTable(FORM = null) {
    const cargarTabla = document.getElementById('tabla_jugadores');
    const lista_jugadores = [
        {
            imagen: '../../../../resources/img/svg/avatar.svg',
            nombre: 'Angel',
            apellido: 'Presidente',
            dorsal: '14',
            posicion_principal: 'Delantero',
            fecha: '2000-02-09',
            id: 1,
        },
        {
            imagen: '../../../../resources/img/svg/avatar.svg',
            nombre: 'Angel',
            apellido: 'Presidente',
            dorsal: '14',
            posicion_principal: 'Delantero',
            fecha: '2000-02-09',
            id: 2,
        },
        {
            imagen: '../../../../resources/img/svg/avatar.svg',
            nombre: 'Angel',
            apellido: 'Presidente',
            dorsal: '14',
            posicion_principal: 'Delantero',
            fecha: '2000-02-09',
            id: 3,
        },
        {
            imagen: '../../../../resources/img/svg/avatar.svg',
            nombre: 'Angel',
            apellido: 'Presidente',
            dorsal: '14',
            posicion_principal: 'Delantero',
            fecha: '2000-02-09',
            id: 4,
        }
    ];
    try {
        cargarTabla.innerHTML = '';
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(API, 'readOneTemplate', FORM);
        console.log(DATA);
        // Mostrar elementos obtenidos de la API
        DATA.dataset.forEach(row => {
            const tablaHtml = `
            <tr>
                <td><img src="${SERVER_URL}images/jugadores/${row.IMAGEN}" height="50" width="50" class="circulo"></td>
                <td>${row.NOMBRE_JUGADOR}</td>
                <td>${row.APELLIDO_JUGADOR}</td>
                <td>${row.DORSAL}</td>
                <td>${row.POSICION_PRINCIPAL}</td>
                <td>${row.NACIMIENTO}</td>
                <td>
                    <button type="button" id="btnAct" class="btn btn-next transparente" onclick="openUpdatePlayer(${row.ID}, ${row.IDP})">
                    <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                    </button>
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
        // Mostrar materiales de respaldo
        lista_jugadores.forEach(row => {
            const tablaHtml = `
            <tr>
                <td><img src="${row.imagen}" height="50" width="50" class="circulo"></td>
                <td>${row.nombre}</td>
                <td>${row.apellido}</td>
                <td>${row.dorsal}</td>
                <td>${row.posicion_principal}</td>
                <td>${row.fecha}</td>
                <td>
                    <button type="button" id="btnAct" class="btn btn-next transparente" onclick="openUpdatePlayer(${row.id})">
                    <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                    </button>
                    <button type="button" id="btnEli" class="btn transparente" onclick="openDeletePlayer(${row.id})">
                    <img src="../../../resources/img/svg/icons_forms/trash 1.svg" width="18" height="18">
                    </button>
                </td>
            </tr>
            `;
            cargarTabla.innerHTML += tablaHtml;
        });
    }
}

// Variables y constantes para la paginación
const plantillasPorPagina = 10;
let paginaActual = 1;
let plantillas = [];

// Función para cargar tabla de técnicos con paginación
async function cargarTabla(form = null) {
    const cargarTabla = document.getElementById('tabla');
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

    const cargarTabla = document.getElementById('tabla');
    cargarTabla.innerHTML = '';
    plantillasPagina.forEach(row => {
        const tablaHtml = `
                <tr>
                    <td>${row.NOMBRE_PLANTILLA}</td>
                    <td>${row.NOMBRE_EQUIPO}</td>
                    <td>${row.TOTAL_JUGADORES}</td>
                    <td>
                        <button type="button" class="btn btn-warnig" onclick="seeModal(${row.ID_PLANTILLA}, ${row.ID_EQUIPO}, ${row.ID_TEMPORADA})">
                        <img src="../../../resources/img/svg/icons_forms/cuerpo_tecnico.svg" width="30" height="30">
                        </button>
                    </td>
                    <td>
                    <button type="button" class="btn transparente" onclick="openUpdate(${row.ID}, ${row.ID_PLANTILLA}, ${row.ID_EQUIPO}, ${row.ID_TEMPORADA})">
                        <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                    </button>
                    <button type="button" class="btn transparente" onclick="openDelete(${row.ID_PLANTILLA}, ${row.ID_EQUIPO}, ${row.ID_TEMPORADA})">
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

// Función para restaurar el formulario guardar
const restaurarFormulario = async (num = null) => {
    SAVE_FORM.innerHTML = ESTADO_INICIAL_SAVE_FORM;

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
    const equiposHtml = await loadComponent('../components/template.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = equiposHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Plantillas';
    ROWS_FOUND = document.getElementById('rowsFound');
    cargarTabla();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_PLANTILLA = document.getElementById('idPlantilla'),
        PLANTILLA = document.getElementById('plantilla'),
        JUGADOR = document.getElementById('jugador'),
        TEMPORADA = document.getElementById('temporada'),
        EQUIPO = document.getElementById('equipo');
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
            cargarTabla();
        } else {
            sweetAlert(2, DATA.error, false);
            console.error(DATA.error);
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
        cargarTabla(FORM);
    });
};

