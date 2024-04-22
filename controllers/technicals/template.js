

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
    MODAL_TITLE.textContent = 'Agregar jugador a plantilla';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    restaurarFormulario(25);
    // Ejemplo de uso: actualizar del paso 1 al paso 2
    updateSteps(1, 2);
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
    const deletePast = document.getElementById(`past`);
    deletePast.remove();

    const deleteProgressBar = document.getElementById(`progressBar`);
    deleteProgressBar.remove();
}


// Funcion para preparar el formulario al momento de abrirlo

const seeModal = async (id) => {
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
            MODAL_TITLE.textContent = 'Plantilla';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_PLANTILLA.value = ROW.ID;
            PLANTILLA.value = ROW.PLANTILLA;
            JUGADOR.value = ROW.JUGADOR;
            EQUIPO.value = ROW.EQUIPO;
            TEMPORADA.value = ROW.TEMPORADA;
        } else {
            sweetAlert(2, DATA.error, false);
        }
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
const openUpdate = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idPlantilla', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(EQUIPO_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar la plantilla';
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
        MODAL_TITLE.textContent = 'Actualizar la plantilla';
        restaurarFormulario(95);
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
            FORM.append('idPlantilla', id);
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

/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdatePlayer = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idJugador', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(EQUIPO_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar el jugador de la plantilla';
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


async function fillTable(form = null) {
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
            id: 1,
        },
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
            id: 1,
        }
    ];
    const cargarTabla = document.getElementById('tabla_jugadores');

    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(JUGADOR_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const tablaHtml = `
                <tr>
                    <td><img src="${SERVER_URL}images/admin/${row.IMAGEN}" height="50" width="50" class="circulo"></td>
                    <td>${row.NOMBRE}</td>
                    <td>${row.APELLIDO}</td>
                    <td>${row.DORSAL}</td>
                    <td>${row.POSICION_PRINCIPAL}</td>
                    <td>${row.NACIMIENTO}</td>
                    <td>
                    <button type="button" class="btn btn-next transparente" onclick="openUpdatePlayer(${row.ID})">
                    <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                    </button>
                    <button type="button" class="btn transparente" onclick="openDeletePlayer(${row.ID})">
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


async function cargarTabla(form = null) {
    const lista_datos = [
        {
            equipo: 'Gol El Salvador Nivel 4 Femenino',
            jugador: 23,
            plantilla: 'Plantilla para la liga femenina de la ADFA San Salvador',
            id: 1,
        },
        {
            equipo: 'Gol El Salvador Nivel 2 Femenino',
            jugador: 22,
            plantilla: 'Plantilla para la Copa Interclubes de la Uncaf 2024',
            id: 2,
        },
        {
            equipo: 'Gol El Salvador Nivel 1 Femenino',
            jugador: 24,
            plantilla: 'Plantilla para la Copa Interclubes de la Uncaf 2024',
            id: 3,
        },
        {
            equipo: 'Gol El Salvador Nivel 1 Masculino',
            jugador: 17,
            plantilla: 'Plantilla para la liga masculina de la ADFA San Salvador',
            id: 4,
        }
    ];
    const cargarTabla = document.getElementById('tabla');

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
                    <td>${row.PLANTILLA}</td>
                    <td>${row.EQUIPO}</td>
                    <td>${row.JUGADOR}</td>
                    <td>
                        <button type="button" class="btn btn-warnig" onclick="seeModal()">
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
                <td>${row.plantilla}</td>
                <td>${row.equipo}</td>
                <td>${row.jugador}</td>
                <td>
                    <button type="button" class="btn transparente" onclick="seeModal()">
                    <img src="../../../resources/img/svg/icons_forms/cuerpo_tecnico.svg" width="18px" height="18px">
                    </button>
                </td>
                <td>
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

// Función para restaurar el formulario guardar
const restaurarFormulario = async (num = null) => {
    document.getElementById('saveForm').innerHTML = ESTADO_INICIAL_SAVE_FORM;
    
    fillTable();

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
    cargarTabla();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_PLANTILLA = document.getElementById('idAnalisis'),
        PLANTILLA = document.getElementById('plantilla'),
        JUGADOR = document.getElementById('jugador'),
        TEMPORADA = document.getElementById('temporada'),
        EQUIPO = document.getElementById('equipo');
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

