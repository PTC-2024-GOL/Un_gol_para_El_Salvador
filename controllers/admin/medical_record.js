let SAVE_MODAL;
let SAVE_FORM,
    ID_REGISTRO_MEDICO,
    JUGADOR,
    FECHA_LESION,
    FECHA_REGISTRO,
    DIAS_LESIONADO,
    LESION,
    RETORNO_ENTRENO,
    RETORNO_PARTIDO;
let SEARCH_FORM;
let ROWS_FOUND;

// Constantes para completar las rutas de la API.
const API = 'services/admin/registros_medicos.php';
const JUGADOR_API = 'services/admin/jugadores.php';
const LESION_API = 'services/admin/lesiones.php';
const PARTIDO_API = 'services/admin/partidos.php';

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
    MODAL_TITLE.textContent = 'Agregar un registro médico';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    fillSelect(JUGADOR_API, 'readAll', 'jugador');
    fillSelect(LESION_API, 'readAll', 'lesion');
    fillSelect(PARTIDO_API, 'readAll', 'retornoPartido');
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
        FORM.append('idMedico', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar un registro médico';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_REGISTRO_MEDICO.value = ROW.id_registro_medico;
            fillSelect(JUGADOR_API, 'readAll', 'jugador', ROW.nombre_completo_jugador);
            FECHA_LESION.value = ROW.fecha_lesion;
            FECHA_REGISTRO.value = ROW.fecha_registro;
            DIAS_LESIONADO.value = ROW.dias_lesionado;
            fillSelect(LESION_API, 'readAll', 'lesion', ROW.nombre_sub_tipologia);
            RETORNO_ENTRENO.value = ROW.retorno_entreno;
            fillSelect(PARTIDO_API, 'readAll', 'retornoPartido', ROW.fecha_partido);
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar un registro médico';
        fillSelect(JUGADOR_API, 'readAll', 'jugador');
        fillSelect(LESION_API, 'readAll', 'lesion');
        fillSelect(PARTIDO_API, 'readAll', 'retornoPartido');
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el registro médico?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idMedico', id);
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
const registrosPorPagina = 10;
let paginaActual = 1;
let registros = [];

// Función para cargar tabla de técnicos con paginación
async function fillTable(form = null) {
    const cargarTabla = document.getElementById('tabla_registro_medico');
    try {
        cargarTabla.innerHTML = '';
        // Petición para obtener los registros disponibles.
        let action;
        form ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        const DATA = await fetchData(API, action, form);
        console.log(DATA);

        if (DATA.status) {
            registros = DATA.dataset;
            mostrarRegistros(paginaActual);
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
function mostrarRegistros(pagina) {
    const inicio = (pagina - 1) * registrosPorPagina;
    const fin = inicio + registrosPorPagina;
    const registrosPagina = registros.slice(inicio, fin);

    const cargarTabla = document.getElementById('tabla_registro_medico');
    cargarTabla.innerHTML = '';
    registrosPagina.forEach(row => {
        let retornoPartido;

        if(row.retorno_partido == null){
            retornoPartido = 'En espera';
        } else{
            retornoPartido = row.fecha_partido;
        }

        const tablaHtml = `
                <tr>
                    <td>${row.nombre_completo_jugador}</td>
                    <td>${row.fecha_lesion}</td>
                    <td>${row.fecha_registro}</td>
                    <td>${row.dias_lesionado}</td>
                    <td>${row.nombre_sub_tipologia}</td>
                    <td>${row.retorno_entreno}</td>
                    <td>${retornoPartido}</td>
                    <td>
                    <button type="button" class="btn transparente" onclick="openUpdate(${row.id_registro_medico})">
                    <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                    </button>
                    <button type="button" class="btn transparente" onclick="openDelete(${row.id_registro_medico})">
                    <img src="../../../resources/img/svg/icons_forms/trash 1.svg" width="18" height="18">
                    </button>
                    </td>
                </tr>
        `;
        cargarTabla.innerHTML += tablaHtml;
    });

    actualizarPaginacion();
}

// Función para actualizar los controles de paginación
function actualizarPaginacion() {
    const paginacion = document.querySelector('.pagination');
    paginacion.innerHTML = '';

    const totalPaginas = Math.ceil(registros.length / registrosPorPagina);

    if (paginaActual > 1) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-dark" href="#" onclick="cambiarPagina(${paginaActual - 1})">Anterior</a></li>`;
    }

    for (let i = 1; i <= totalPaginas; i++) {
        paginacion.innerHTML += `<li class="page-item ${i === paginaActual ? 'active' : ''}"><a class="page-link text-dark" href="#" onclick="cambiarPagina(${i})">${i}</a></li>`;
    }

    if (paginaActual < totalPaginas) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-dark" href="#" onclick="cambiarPagina(${paginaActual + 1})">Siguiente</a></li>`;
    }
}

// Función para cambiar de página
function cambiarPagina(nuevaPagina) {
    paginaActual = nuevaPagina;
    mostrarRegistros(paginaActual);
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const registroMedicoHtml = await loadComponent('../components/medical_record.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = registroMedicoHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Registro médico';
    ROWS_FOUND = document.getElementById('rowsFound');
    fillTable();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_REGISTRO_MEDICO = document.getElementById('idMedico'),
        JUGADOR = document.getElementById('jugador'),
        FECHA_LESION = document.getElementById('fechaLesion'),
        FECHA_REGISTRO = document.getElementById('fechaRegistro'),
        DIAS_LESIONADO = document.getElementById('diasLesionado'),
        LESION = document.getElementById('lesion'),
        RETORNO_ENTRENO = document.getElementById('retornoEntreno'),
        RETORNO_PARTIDO = document.getElementById('retornoPartido');
    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_REGISTRO_MEDICO.value) ? action = 'updateRow' : action = 'createRow';
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
