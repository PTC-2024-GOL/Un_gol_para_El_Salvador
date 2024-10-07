let SAVE_MODAL;
let SAVE_FORM,
    ID_LESION,
    ID_TIPO_LESION,
    ID_SUB_TIPOLOGIA;
let SEARCH_FORM;

// Constantes para completar las rutas de la API.
const LESIONES_API = 'services/admin/lesiones.php';
const TIPO_LESIONES_API = 'services/admin/tipos_lesiones.php';
const SUBTIPOLOGIAS_API = 'services/admin/sub_tipologia.php';

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
const openCreate = async () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    await fillSelect(TIPO_LESIONES_API, 'readAll', 'tipoLesion');
    await fillSelect(SUBTIPOLOGIAS_API, 'readAll', 'tipologia');
    MODAL_TITLE.textContent = 'Agregar lesión';
    // Se prepara el formulario.
    SAVE_FORM.reset();
}
/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdate = async (id, nombre) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idLesion', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(LESIONES_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = `Actualizar la lesión: ${nombre}`;
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_LESION.value = ROW.id_lesion;
            await fillSelect(TIPO_LESIONES_API, 'readAll', 'tipoLesion', ROW.id_tipo_lesion);
            await fillSelect(SUBTIPOLOGIAS_API, 'readAll', 'tipologia', ROW.id_sub_tipologia);
        } else {
            await sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar lesión';
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id, nombre) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction(`¿Desea eliminar la lesión: ${nombre}?`);
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idLesion', id);
            console.log(id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(LESIONES_API, 'deleteRow', FORM);
            console.log(DATA.status);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se muestra un mensaje de éxito.
                await sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                await fillTable();
            } else {
                // Verificamos si DATA.exception no es null o vacío.
                const exceptionMessage = DATA.exception ? `\n\n${DATA.exception}` : '';
                // Mostramos el mensaje de error sin la excepción si esta es null o está vacía.
                await sweetAlert(2, `${DATA.error}${exceptionMessage}`, false);
            }
        }
    }
    catch (Error) {
        console.log(Error + ' Error al cargar el mensaje');
    }
}

// Manejo para la paginacion
const injuriesByPage = 10;
let currentPage = 1;
let injuries = [];


function showInjuries(page) {
    const start = (page - 1) * injuriesByPage;
    const end = start + injuriesByPage;
    const injuriesPage = injuries.slice(start, end);

    const fillTable = document.getElementById('tabla_lesiones');
    fillTable.innerHTML = '';
    injuriesPage.forEach(row => {
        const tablaHtml = `
                <tr>
                    <td>${row.tipo_lesion}</td>
                    <td>${row.nombre_sub_tipologia}</td>
                    <td>${row.total_por_lesion}</td>
                    <td>${row.porcentaje_por_lesion}%</td>
                    <td>
                    <button type="button" class="btn transparente" onclick="openUpdate(${row.id_lesion}, '${row.tipo_lesion}')">
                    <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                    </button>
                    <button type="button" class="btn transparente" onclick="openDelete(${row.id_lesion}, '${row.tipo_lesion}')">
                    <img src="../../../resources/img/svg/icons_forms/trash 1.svg" width="18" height="18">
                    </button>
                    </td>
                </tr>   
                `;
        fillTable.innerHTML += tablaHtml;
    });

    updatePaginate();
}



async function fillTable(form = null) {
    const cargarTabla = document.getElementById('tabla_lesiones');
    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';

        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(LESIONES_API, action, form);

        if (DATA.status) {
            injuries = DATA.dataset;
            showInjuries(currentPage);
        } else {
            await sweetAlert(4, DATA.error, true);
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
    }
}

// Función para actualizar los contlesiones de paginación
function updatePaginate() {
    const paginacion = document.querySelector('.pagination');
    paginacion.innerHTML = '';

    const totalPaginas = Math.ceil(injuries.length / injuriesByPage);

    if (currentPage > 1) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-bs-dark" href="#" onclick="nextPage(${currentPage - 1})">Anterior</a></li>`;
    }

    for (let i = 1; i <= totalPaginas; i++) {
        paginacion.innerHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link text-bs-dark" href="#" onclick="nextPage(${i})">${i}</a></li>`;
    }

    if (currentPage < totalPaginas) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-bs-dark" href="#" onclick="nextPage(${currentPage + 1})">Siguiente</a></li>`;
    }
}

// Función para cambiar de página
function nextPage(newPage) {
    currentPage = newPage;
    showInjuries(currentPage);
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const lesionHtml = await loadComponent('../components/injuries.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();

    // Agrega el HTML del encabezado
    appContainer.innerHTML = lesionHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Lesiones';

    await fillTable();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_LESION = document.getElementById('idLesion'),
        ID_TIPO_LESION = document.getElementById('tipoLesion'),
        ID_SUB_TIPOLOGIA = document.getElementById('tipologia'),

        // Método del evento para cuando se envía el formulario de guardar.
        SAVE_FORM.addEventListener('submit', async (event) => {
            // Se evita recargar la página web después de enviar el formulario.
            event.preventDefault();
            // Se verifica la acción a realizar.
            (ID_LESION.value) ? action = 'updateRow' : action = 'createRow';
            // Constante tipo objeto con los datos del formulario.
            const FORM = new FormData(SAVE_FORM);
            // Petición para guardar los datos del formulario.
            const DATA = await fetchData(LESIONES_API, action, FORM);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se cierra la caja de diálogo.
                SAVE_MODAL.hide();
                // Se muestra un mensaje de éxito.
                await sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                await fillTable();
            } else {
                // Verificamos si DATA.exception no es null o vacío.
                const exceptionMessage = DATA.exception ? `\n\n${DATA.exception}` : '';
                // Mostramos el mensaje de error sin la excepción si esta es null o está vacía.
                await sweetAlert(2, `${DATA.error}${exceptionMessage}`, false);
            }
        });
    // Constante para establecer el formulario de buscar.
    SEARCH_FORM = document.getElementById('searchForm');

    // Método del evento para cuando se envía el formulario de buscar.
    SEARCH_FORM.addEventListener('submit', (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SEARCH_FORM);

        // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
        fillTable(FORM);
    });
};
