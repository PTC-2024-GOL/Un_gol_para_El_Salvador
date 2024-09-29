let SAVE_MODAL;
let SAVE_FORM,
    ID_PALMARES,
    EQUIPO,
    TEMPORADA,
    LUGAR_IMG,
    LUGAR;
let SEARCH_FORM;
let ROWS_FOUND;


// Constantes para completar las rutas de la API.
const API = 'services/admin/palmares.php';
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
    MODAL_TITLE.textContent = 'Agregar un nuevo reconocimiento';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    fillSelect(TEMPORADA_API, 'readAll', 'temporada');
    fillSelect(EQUIPO_API, 'readAll', 'equipo');
    LUGAR_IMG.src = "../../../resources/img/png/default.png";
}

function actualizarMedalla(lugar) {
    switch (lugar) {
        case "Campeón":
            LUGAR_IMG.src = "../../../resources/img/png/gold.png";
            break;
        case "Subcampeón":
            LUGAR_IMG.src = "../../../resources/img/png/plate.png";
            break;
        case "Tercer lugar":
            LUGAR_IMG.src = "../../../resources/img/png/bronce.png";
            break;
        default:
            LUGAR_IMG.src = "../../../resources/img/png/default.png"; // Ruta de imagen predeterminada
            break;
    }
    LUGAR_IMG.style.display = 'block'; // Asegúrate de que la imagen se muestre
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
        FORM.append('idPalmares', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = `Actualizar el reconocimiento: ${nombre}`;
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_PALMARES.value = ROW.id_palmares;
            LUGAR.value = ROW.lugar;
            // Llamar a la nueva función para actualizar la medalla
            actualizarMedalla(LUGAR.value);
            fillSelect(TEMPORADA_API, 'readAll', 'temporada', ROW.id_temporada);
            fillSelect(EQUIPO_API, 'readAll', 'equipo', ROW.id_equipo);
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar la tarea';
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id, nombre) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction(`¿Desea eliminar el reconocimiento: ${nombre}?`);
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idPalmares', id);
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
const palmaresPorPagina = 10;
let paginaActual = 1;
let palmares = [];

// Función para cargar tabla de técnicos con paginación
async function fillTable(form = null) {
    const cargarTabla = document.getElementById('tabla_palmares');
    try {
        cargarTabla.innerHTML = '';
        // Petición para obtener los registros disponibles.
        let action;
        form ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        const DATA = await fetchData(API, action, form);
        console.log(DATA);

        if (DATA.status) {
            palmares = DATA.dataset;
            mostrarpalmares(paginaActual);
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


function verMedalla(lugar) {
    switch (lugar) {
        case "Campeón":
            return "../../../resources/img/png/gold.png";
        case "Subcampeón":
            return "../../../resources/img/png/plate.png";
        case "Tercer lugar":
            return "../../../resources/img/png/bronce.png";
        default:
            return "../../../resources/img/png/default.png";
    }
}

// Función para mostrar técnicos en una página específica
function mostrarpalmares(pagina) {
    const inicio = (pagina - 1) * palmaresPorPagina;
    const fin = inicio + palmaresPorPagina;
    const palmaresPagina = palmares.slice(inicio, fin);

    const cargarTabla = document.getElementById('tabla_palmares');
    cargarTabla.innerHTML = '';
    palmaresPagina.forEach(row => {
        const tablaHtml = `
                <tr class="text-center">
                    <td>
                    <img src="${SERVER_URL}images/equipos/${row.logo_equipo}" class="card-img-top logo_equipo_palmares text-end" alt="${row.nombre_equipo}">
                    </td>    
                    <td>${row.nombre_equipo}</td>
                    <td>${row.nombre_temporada}</td>
                    <td>
                    <img src="${verMedalla(row.lugar)}" class="card-img-top logo_equipo_palmares text-end" alt="${row.lugar}">
                    </td>
                    <td>
                    <button type="button" class="btn transparente" onclick="openUpdate(${row.ID}, '${row.nombre_equipo} fue ${row.lugar} en la ${row.nombre_temporada}')">
                        <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                    </button>
                    <button type="button" class="btn transparente" onclick="openDelete(${row.ID}, '${row.nombre_equipo} fue ${row.lugar} en la ${row.nombre_temporada}')">
                        <img src="../../../resources/img/svg/icons_forms/trash 1.svg" width="18" height="18">
                    </button>
                    </td>
                </tr>
        `;
        cargarTabla.innerHTML += tablaHtml;
    });

    actualizarPaginacion();
}

// Función para actualizar los contpalmares de paginación
function actualizarPaginacion() {
    const paginacion = document.querySelector('.pagination');
    paginacion.innerHTML = '';

    const totalPaginas = Math.ceil(palmares.length / palmaresPorPagina);

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
    mostrarpalmares(paginaActual);
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const contentHtml = await loadComponent('../components/honors.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = contentHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Palmares';
    ROWS_FOUND = document.getElementById('rowsFound');
    fillTable();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_PALMARES = document.getElementById('idPalmares'),
        EQUIPO = document.getElementById('equipo'),
        TEMPORADA = document.getElementById('temporada'),
        LUGAR_IMG = document.getElementById('lugar-img'),
        LUGAR = document.getElementById('lugar');
    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_PALMARES.value) ? action = 'updateRow' : action = 'createRow';
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
        } else if (!DATA.exception) {
            sweetAlert(2, DATA.error, false);
        } else {
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

    // Función para actualizar la imagen según la opción seleccionada
    LUGAR.addEventListener('change', function () {
        // Obtener el valor seleccionado y el atributo data-img
        const selectedOption = LUGAR.options[LUGAR.selectedIndex];
        const imgSrc = selectedOption.getAttribute('data-img');

        if (imgSrc) {
            // Mostrar la imagen correspondiente
            LUGAR_IMG.src = imgSrc;
            LUGAR_IMG.style.display = 'block'; // Mostrar la imagen
        } else {
            // Si no hay imagen, ocultar el elemento
            LUGAR_IMG.style.display = 'none';
        }
    });

    // Inicializar con la primera opción seleccionada
    LUGAR.dispatchEvent(new Event('change'));
};
