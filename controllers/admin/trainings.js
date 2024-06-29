let CONT_MODAL;
let GRAPHIC_MODAL,
    MODAL_TITLE2,
    SAVE_MODAL,
    SAVE_FORM;
let CONT_FORM,
    ID_JORNADA_URL,
    ID_URL,
    ID_JORNADA,
    FECHA,
    N,
    MODAL_TITLE1,
    JUGADORES,
    SEE_MODAL2,
    SEE_FORM2,
    SEE_MODAL,
    MODAL_TITLE,
    CONTENIDO,
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
    AUTOCONTROL,
    UP_MODAL,
    UP_FORM,
    MODAL_TITLE_UP,
    ID_ENTRENAMIENTO,
    ID_JORNADAx,
    FECHAx,
    ID_CATEGORIA,
    ID_HORARIO,
    SESION,
    ID_EQUIPO,
    DIV_EQUIPO,
    SEE_FORM;
let SEARCH_FORM;

// Constantes para completar las rutas de la API.
const ENTRENAMIENTOS_API = 'services/admin/entrenamientos.php';


// Lista de datos para mostrar en la tabla de horarios
const lista_datos_horario = [
    {
        jugadores: "Mario Alboran",
        id: 1,
    },
    {
        jugadores: 'Marco Polo',
        id: 2,
    },
    {
        jugadores: 'Susan Abigail',
        id: 3,
    },
    {
        jugadores: 'Agustin De Tarso',
        id: 4,
    }
];

// Lista de datos para mostrar en la tabla de contenidos
const lista_datos_contenidos = [
    {
        contenidos: "Juegos lúdicos",
    },
    {
        contenidos: "Trabajo peventivo",
    },
    {
        contenidos: "Circuitos/Físico sin balón",
    },
    {
        contenidos: "Circuitos/Físico balón",
    }
];

/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreate = async () => {
    // Se muestra la caja de diálogo con su título.
    UP_MODAL.show();
    MODAL_TITLE_UP.textContent = 'Agregar entrenamiento';
    // Se prepara el formulario.
    ID_ENTRENAMIENTO.value = null;
    ID_EQUIPO.disabled = false;
    UP_FORM.reset();
    await fillSelect(ENTRENAMIENTOS_API, 'readOneCategoria', 'idCategoriaa');
    await fillSelect(ENTRENAMIENTOS_API, 'readOneHorario', 'idHorario');
    await fillSelect(ENTRENAMIENTOS_API, 'readJornadas', 'idJornada', ID_JORNADA_URL);
    await fillSelect(ENTRENAMIENTOS_API, 'readEquipos', 'idEquipo');
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
        FORM.append('idEntrenamiento', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(ENTRENAMIENTOS_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            UP_MODAL.show();
            MODAL_TITLE_UP.textContent = 'Actualizar entrenamieno';
            // Se prepara el formulario.
            UP_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_ENTRENAMIENTO.value = ROW.id_entrenamiento;
            FECHAx.value = ROW.fecha_entrenamiento
            await fillSelect(ENTRENAMIENTOS_API, 'readOneCategoria', 'idCategoriaa', ROW.id_categoria);
            await fillSelect(ENTRENAMIENTOS_API, 'readOneHorario', 'idHorario', ROW.id_horario);
            await fillSelect(ENTRENAMIENTOS_API, 'readJornadas', 'idJornada', ID_JORNADA_URL);
            await fillSelect(ENTRENAMIENTOS_API, 'readEquipos', 'idEquipo', ROW.id_equipo);
            ID_EQUIPO.disabled = true;
            for (let option of SESION.options) {
                if (option.value === ROW.sesion) {
                    option.selected = true;
                    break;  // Terminar el bucle una vez encontrado el valor
                }
            }
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        UP_MODAL.show();
        MODAL_TITLE_UP.textContent = 'Actualizar sub-Contenido';
    }

}
//Función asíncrona para cargar un componente HTML.
async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

const fillContents = (data, action, selectId) => {
    const ulElement = document.getElementById(selectId);

    // Limpiar la lista de contenidos previos
    ulElement.innerHTML = '';

    // Iterar sobre los datos proporcionados y crear un elemento li por cada contenido
    data.forEach(item => {
        const liElement = document.createElement('li');
        liElement.classList.add('list-group-item', 'list-group-item-info', 'px-3');
        liElement.textContent = item.contenidos; // Asignar el texto del contenido al elemento li
        ulElement.appendChild(liElement); // Agregar el elemento li a la lista ul
    });
};

// Función para poblar un combobox (select) con opciones
const fillSelected = (data, action, selectId, selectedValue = null) => {
    const selectElement = document.getElementById(selectId);

    // Limpiar opciones previas del combobox
    selectElement.innerHTML = '';

    // Crear opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Seleccionar un jugador para su análisis';
    selectElement.appendChild(defaultOption);

    // Llenar el combobox con los datos proporcionados
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id; // Suponiendo que hay una propiedad 'id' en los datos
        option.textContent = item.jugadores; // Cambia 'jugador' al nombre de la propiedad que deseas mostrar en el combobox
        selectElement.appendChild(option);
    });

    // Seleccionar el valor especificado si se proporciona
    if (selectedValue !== null) {
        selectElement.value = selectedValue;
    }
};

// Funcion para preparar el formulario al momento de abrirlo
/*
*   Función asíncrona para preparar el formulario al momento de elegir un horario.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/

const seeModal2 = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idAnalisis', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(EQUIPO_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SEE_MODAL2.show();
            MODAL_TITLE2.textContent = 'Actualizar análisis del jugador';
            // Se prepara el formulario.
            SEE_FORM2.reset();
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
        SEE_MODAL2.show();
        MODAL_TITLE2.textContent = 'Análisis del jugador';
        SEE_FORM2.reset();
        restaurarFormulario(31.16);
        // Ejemplo de uso: actualizar del paso 1 al paso 2
        updateSteps(1, 2);

    }
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

}

/*
*   Función para abrir la página de detalles específicos.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
//
// Función para abrir la página de detalles específicos.
const seeModal = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idJornada', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(ENTRENAMIENTOS_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SEE_MODAL.show();
            MODAL_TITLE.textContent = 'Elegir jugador';
            // Se prepara el formulario.
            SEE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_CATEGORIA.value = ROW.ID;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SEE_MODAL.show();
        MODAL_TITLE.textContent = 'Elegir jugador';
        SEE_FORM.reset();
        fillSelected(lista_datos_horario, 'readAll', 'horario');
    }
}

/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el entrenamiento?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idEntrenamiento', id);
            console.log(id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(ENTRENAMIENTOS_API, 'deleteRow', FORM);
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

//Crea un comentario que describa la función que esta debajo
/*
*   Función asíncrona para cargar la tabla de detalles de contenidos.
*   Parámetros: form (formulario de búsqueda).
*   Retorno: ninguno.
*/

const seeCont = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idEntrenamiento', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(ENTRENAMIENTOS_API, 'readOneDetalles', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            CONT_MODAL.show();
            MODAL_TITLE1.textContent = 'Ver contenidos';
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            // Llamar a la función fillContents con la lista de datos de contenidos y el id del ul
            fillContents(ROW, null, 'lista_contenidos');
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        CONT_MODAL.show();
        MODAL_TITLE1.textContent = 'Ver contenidos';
        CONT_FORM.reset();
    }
}

//Crea un comentario que describa la función que esta debajo
/*
*   Función asíncrona para cargar la tabla de detalles de contenidos.
*   Parámetros: form (formulario de búsqueda).
*   Retorno: ninguno.
*/
async function cargarTabla(form = null) {
    const lista_datos = [
        {
            n: '1',
            fecha: '15 de julio',
            id: 1,
        },
        {
            n: '2',
            fecha: '18 de julio',
            id: 2,
        },
        {
            n: '3',
            fecha: '1 de agosto',
            id: 3,
        },
        {
            n: '4',
            fecha: '13 de agosto',
            id: 4,
        }
    ];
    const cargarTabla = document.getElementById('tabla_entrenamientos');

    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        console.log(action);
        console.log(ID_JORNADA_URL);
        if (action == 'readAll') {
            form = new FormData();
            form.append('idJornada', ID_JORNADA_URL);
        }
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(ENTRENAMIENTOS_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const tablaHtml = `
                <tr>
                    <td>${row.detalle_entrenamiento}</td>
                    <td class="justify-content-center">
                        <button type="button" class="btn transparente" onclick="seeModal(${row.id_entrenamiento})">
                        <img src="../../../resources/img/svg/icons_forms/stadistic.png" width="30" height="30">
                        </button>
                    </td>
                    <td>
                        <button type="button" class="btn transparente" onclick="seeCont(${row.id_entrenamiento})">
                        <img src="../../../resources/img/svg/icons_forms/cuerpo_tecnico.svg" width="30" height="30">
                        </button>
                    </td>
                    <td>
                        <button type="button" class="btn transparente" onclick="openUpdate(${row.id_entrenamiento})">
                        <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                        </button>
                    <button type="button" class="btn transparente" onclick="openDelete(${row.id_entrenamiento})">
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
                    <td>${row.n}</td>
                    <td>${row.fecha}</td>
                    <td class="justify-content-center">
                        <button type="button" class="btn transparente" onclick="seeModal(${row.id})">
                        <img src="../../../resources/img/svg/icons_forms/stadistic.png" width="18" height="18">
                        </button>
                    </td>
                    <td>
                        <button type="button" class="btn transparente" onclick="seeCont(${row.id})">
                        <img src="../../../resources/img/svg/icons_forms/cuerpo_tecnico.svg" width="|8" height="18">
                        </button>
                    </td>
                    <td>
                    <button type="button" class="btn transparente" onclick="openUpdate(${row.id_detalle_contenido})">
                    <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                    </button>
                    <button type="button" class="btn transparente" onclick="openDelete(${row.id_detalle_contenido})">
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
    const adminHtml = await loadComponent('../components/trainings.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = adminHtml;
    ID_URL = new URLSearchParams(window.location.search);
    ID_JORNADA_URL = ID_URL.get('id');
    const FORME = new FormData();
    FORME.append('idJornada', ID_JORNADA_URL);
    // Petición para guardar los datos del formulario.
    const DATAE = await fetchData(ENTRENAMIENTOS_API, 'readOneTitulo', FORME);
    const titleElement = document.getElementById('title');
    titleElement.textContent = DATAE.dataset.titulo;

    cargarTabla();
    // Constantes para establecer los elementos del componente Modal.
    SEE_MODAL2 = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE2 = document.getElementById('modalTitle');

    CONT_MODAL = new bootstrap.Modal('#contModal'),
        MODAL_TITLE1 = document.getElementById('modalTitle1');

    SAVE_FORM = document.getElementById('contForm');

    SEE_MODAL = new bootstrap.Modal('#seeModal'),
        MODAL_TITLE = document.getElementById('modalTitle2');

    UP_MODAL = new bootstrap.Modal('#upModal'),
        UP_FORM = document.getElementById('upForm'),
        MODAL_TITLE_UP = document.getElementById('modalTitleUp'),
        ID_ENTRENAMIENTO = document.getElementById('idEntrenamiento'),
        ID_JORNADAx = document.getElementById('idJornada'),
        FECHAx = document.getElementById('fecha'),
        ID_CATEGORIA = document.getElementById('idCategoriaa'),
        ID_HORARIO = document.getElementById('idHorario'),
        SESION = document.getElementById('sesion'),
        ID_EQUIPO = document.getElementById('idEquipo'),
        DIV_EQUIPO = document.getElementById('equipos');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('seeForm'),
        ID_JORNADA = document.getElementById('idCategoria'),
        HORARIO = document.getElementById('horario');
    // Método del evento para cuando se envía el formulario de guardar.
    UP_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_ENTRENAMIENTO.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(UP_FORM);
        console.log(FORM);
        console.log(action);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(ENTRENAMIENTOS_API, action, FORM);

        console.log(DATA);
        if (DATA.status) {
            // Se cierra la caja de diálogo.
            UP_MODAL.hide();
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
    SEE_FORM2 = document.getElementById('saveForm'),
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
    SEE_FORM2.addEventListener('submit', async (event) => {
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
    ESTADO_INICIAL_SAVE_FORM = document.getElementById('saveForm').innerHTML;
};
