let SAVE_MODAL;
let SAVE_FORM,
    ID_CONTENIDO;
let ZONA,
    ZONA1,
    ZONA2,
    MOMENTO,
    ZONA3;
let SEARCH_FORM;

// Constantes para completar las rutas de la API.
// traduce la palabra lesiones al ingles
const API = 'services/admin/contenidos.php';

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
    //ID_CONTENIDO = ''
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Agregar un nuevo momento de juego';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    zona2func();
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
        FORM.append('idContenido', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = `Actualizar el momento de juego: ${nombre}`;
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            console.log(ROW);
            ID_CONTENIDO.value = ROW.id_tema_contenido;
            const options = MOMENTO.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === ROW.momento_juego) {
                    MOMENTO.selectedIndex = i;
                    break;
                }
            }
            if (ROW.zona_campo == 'Zona 1') {
                zona1func();
            }
            else if (ROW.zona_campo == 'Zona 2') {
                zona2func();
            }
            else{
                zona3func();
            }
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar el contenido';
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id, nombre) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction(`¿Desea eliminar el contenido: ${nombre} de forma definitiva?`);
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idContenido', id);
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

/*
*   Función asíncrona para llenar la tabla con los registros disponibles.
*   Parámetros: form (formulario de búsqueda).
*   Retorno: ninguno.
*/
// Manejo para la paginacion
const injuriesByPage = 8;
let currentPage = 1;
let injuries = [];

function showInjuries(page) {
    const start = (page - 1) * injuriesByPage;
    const end = start + injuriesByPage;
    const injuriesPage = injuries.slice(start, end);

    const fillTable = document.getElementById('tabla_contenidos');
    fillTable.innerHTML = '';
    injuriesPage.forEach(row => {
        const tablaHtml = `
                <tr>
                <td class="text-center">${row.momento_juego}</td>
                <td class="text-center">${row.zona_campo}</td>
                <td class="text-end">
                    <button type="button" class="btn transparente" onclick="openUpdate(${row.id_tema_contenido}, '${row.momento_juego}/${row.zona_campo}')">
                    <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                    </button>
                    <button type="button" class="btn transparente" onclick="openDelete(${row.id_tema_contenido}, '${row.momento_juego}/${row.zona_campo}')">
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
    const lista_datos = [
        {
            contenido: "Juegos lúdicos",
            id: 1,
        },
        {
            contenido: "Trabajo preventivo",
            id: 2,
        },
        {
            contenido: "Circuitos/ Fisicos sin balón",
            id: 3,
        },
        {
            contenido: "Circuitos/ Fisicos con balón",
            id: 4,
        }
    ];
    const cargarTabla = document.getElementById('tabla_contenidos');

    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            injuries = DATA.dataset;
            showInjuries(currentPage);
        } else {
            sweetAlert(4, DATA.error, true);
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        // Mostrar materiales de respaldo
        lista_datos.forEach(row => {
            const tablaHtml = `
            <tr>
                <td class="text-center">${row.contenido}</td>
                <td class="text-end">
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

const zona1func = () => {
    ZONA1.classList.add('active');
    ZONA2.classList.remove('active');
    ZONA3.classList.remove('active');
    ZONA = 'Zona 1';
    console.log('oaaaaaaaaaa ', ZONA);
}


const zona2func = () => {
    ZONA1.classList.remove('active');
    ZONA2.classList.add('active');
    ZONA3.classList.remove('active');
    ZONA = 'Zona 2';
}

const zona3func = () => {
    ZONA1.classList.remove('active');
    ZONA2.classList.remove('active');
    ZONA3.classList.add('active');
    ZONA = 'Zona 3';
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
    const contentHtml = await loadComponent('../components/contents.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = contentHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Momentos de juego';
    fillTable();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');
    ZONA1 = document.getElementById('zona1');
    ZONA2 = document.getElementById('zona2');
    ZONA3 = document.getElementById('zona3');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_CONTENIDO = document.getElementById('idContenido'),
        MOMENTO = document.getElementById('momento');
    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_CONTENIDO.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM);
        FORM.append('zona', ZONA);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(API, action, FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se cierra la caja de diálogo.
            SAVE_MODAL.hide();
            // Se muestra un mensaje de éxito.
            fillTable();
            sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
        } else {
            sweetAlert(3, DATA.error, false);
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
