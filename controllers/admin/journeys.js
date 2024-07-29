let SAVE_MODAL;
let SAVE_FORM,
    ID_JORNADA,
    NOMBRE_JORNADA,
    NUMERO_JORNADA,
    PLANTILLA,
    FECHA_INICIO,
    FECHA_FINAL;
let SEARCH_FORM;
let ROWS_FOUND;


// Constantes para completar las rutas de la API.
const API = 'services/admin/jornadas.php';
const PLANTILLA_API = 'services/admin/plantillas.php';
/* 
Para cargar una lista con la api en php, se hara referencia al metodo ReadAll, del archivo de la api con el cual se quiera
cargar la lista, en este caso en especifico, API se ocuparia para referenciar el link de la api que contenga todos los metodos
para las jornadas en si, mientras que TEMPORADA_API, se ocupara para referenciar el link de la api que contenga el metodo 
ReadAll con el fin de cargar la lista "reciclando" una api que ya existe. 
*/

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


const lista_select = [
    {
        plantilla: "Plantilla de la liga ADFA San Salvador 2024",
        id: 1,
    },
    {
        plantilla: "Plantilla para la competición internacional Dallas Cup 2024",
        id: 2,
    },
    {
        plantilla: "Plantilla de la copa salesiana 2024",
        id: 3,
    }
];

// Función para poblar un combobox (select) con opciones
const fillSelected = (data, action, selectId, selectedValue = null) => {
    const selectElement = document.getElementById(selectId);

    // Limpiar opciones previas del combobox
    selectElement.innerHTML = '';

    // Crear opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecciona la plantilla';
    selectElement.appendChild(defaultOption);

    // Llenar el combobox con los datos proporcionados
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id; // Suponiendo que hay una propiedad 'id' en los datos
        option.textContent = item.plantilla; // Cambia 'horario' al nombre de la propiedad que deseas mostrar en el combobox
        selectElement.appendChild(option);
    });

    // Seleccionar el valor especificado si se proporciona
    if (selectedValue !== null) {
        selectElement.value = selectedValue;
    }
};


const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Agregar una jornada';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    // Se carga la lista utilizando el metodo ReadAll de la api de temporada.
    fillSelect(PLANTILLA_API, 'readAll', 'plantilla');
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
        FORM.append('idJornada', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar la jornada';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_JORNADA.value = ROW.ID;
            NUMERO_JORNADA.value = ROW.NUMERO;
            NOMBRE_JORNADA.value = ROW.NOMBRE;
            fillSelect(PLANTILLA_API, 'readAll', 'plantilla', ROW.ID_PLANTILLA);
            FECHA_INICIO.value = ROW.FECHA_INICIO;
            FECHA_FINAL.value = ROW.FECHA_FIN;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar la jornada';
        fillSelected(lista_select, 'readAll', 'plantilla');
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar la jornada?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idJornada', id);
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
let jornadasPorPagina = 5;
let paginaActual = 1;
let jornadas = [];

// Función para cargar tabla de técnicos con paginación
async function fillTable(form = null) {
    const cargarTabla = document.getElementById('tabla_jornadas');
    try {
        cargarTabla.innerHTML = '';
        // Petición para obtener los registros disponibles.
        let action;
        form ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        const DATA = await fetchData(API, action, form);
        console.log(DATA);

        if (DATA.status) {
            jornadas = DATA.dataset;
            mostrarJornadas(paginaActual);
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
function mostrarJornadas(pagina) {
    const inicio = (pagina - 1) * jornadasPorPagina;
    const fin = inicio + jornadasPorPagina;
    const jornadasPagina = jornadas.slice(inicio, fin);

    const cargarTabla = document.getElementById('tabla_jornadas');
    cargarTabla.innerHTML = '';
    jornadasPagina.forEach(row => {
        const tablaHtml = `
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <p class="card-title fw-bold">${row.NOMBRE}</p>
                        <p class="card-text fst-normal">${row.PLANTILLA}</p>
                        <p class="card-text fst-normal">Del ${row.FECHA_INICIO}</p>
                        <p class="card-text fst-normal">A ${row.FECHA_FIN}</p>
                    </div>
                    <div class="card-footer"> 
                        <a href="trainings.html?id=${row.ID}" class="btn botones rounded-5 m-2">
                            Ver entrenamientos
                            <img src="../../../resources/img/svg/icons_forms/training.svg" width="20" height="20">
                        </a>
                        <button type="button" class="btn botones rounded-5 m-2" onclick="openUpdate(${row.ID})">
                            <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                        </button>
                        <button type="button" class="btn botones rounded-5 m-2" onclick="openDelete(${row.ID})">
                            <img src="../../../resources/img/svg/icons_forms/trash 1.svg" width="18" height="18">
                        </button>
                    </div>
                </div>
            </div>
        `;
        cargarTabla.innerHTML += tablaHtml;
    });

    actualizarPaginacion();
}

// Función para actualizar los controles de paginación
function actualizarPaginacion() {
    const paginacion = document.querySelector('.pagination');
    paginacion.innerHTML = '';

    const totalPaginas = Math.ceil(jornadas.length / jornadasPorPagina);

    if (paginaActual > 1) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-bs-dark" href="#" onclick="cambiarPagina(${paginaActual - 1})">Anterior</a></li>`;
    }

    for (let i = 1; i <= totalPaginas; i++) {
        paginacion.innerHTML += `<li class="page-item ${i === paginaActual ? 'active' : ''}"><a class="page-link text-bs-dark" href="#" onclick="cambiarPagina(${i})">${i}</a></li>`;
    }

    if (paginaActual < totalPaginas) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-bs-dark" href="#" onclick="cambiarPagina(${paginaActual + 1})">Siguiente</a></li>`;
    }
}

// Función para cambiar de página
function cambiarPagina(nuevaPagina) {
    paginaActual = nuevaPagina;
    mostrarJornadas(paginaActual);
}

// Función para actualizar el número de registros por página
function updateJornadasPorPagina() {
    jornadasPorPagina = parseInt(document.getElementById('paginas').value);
    paginaActual = 1; // Resetear a la primera página cada vez que se cambia el número de registros por página
    mostrarJornadas(paginaActual);
}
// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const contentHtml = await loadComponent('../components/journey.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = contentHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Jornadas';
    ROWS_FOUND = document.getElementById('rowsFound');
    fillTable();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_JORNADA = document.getElementById('idJornada'),
        NOMBRE_JORNADA = document.getElementById('nombreJornada'),
        NUMERO_JORNADA = document.getElementById('numeroJornada'),
        PLANTILLA = document.getElementById('plantilla'),
        FECHA_INICIO = document.getElementById('fechaInicial'),
        FECHA_FINAL = document.getElementById('fechaFinal');
    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_JORNADA.value) ? action = 'updateRow' : action = 'createRow';
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
        }
        else if (!DATA.exception) {
            sweetAlert(2, DATA.error, false);
        }
        else {
            sweetAlert(2, DATA.exception, false);
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

    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    })
};
