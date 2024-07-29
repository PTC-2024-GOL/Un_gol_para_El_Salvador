let SAVE_MODAL;
let SAVE_FORM,
    ID_CUERPOTECNICO,
    CUERPOTECNICO;
let SEARCH_FORM;
let ROWS_FOUND;
let SAVE_MODAL_DETAIL;
let SAVE_FORM_DETAIL,
    ID_CUERPOTECNICO_D,
    TECNICO,
    ROL,
    CUERPO_TECNICO;

// Constante para completar la rutas de la API
const CUERPOTECNICO_API = 'services/admin/cuerpo_tecnico.php';
const API = 'services/admin/detalle_cuerpo_tecnico.php';
const TECNICO_API = 'services/admin/tecnicos.php';
const ROL_API = 'services/admin/roles_tecnicos.php';

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
    MODAL_TITLE.textContent = 'Crear cuerpo técnico';
    // Se prepara el formulario.
    SAVE_FORM.reset();
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
        FORM.append('idCuerpotecnico', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(CUERPOTECNICO_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar cuerpo técnico';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_CUERPOTECNICO.value = ROW.ID;
            CUERPOTECNICO.value = ROW.NOMBRE;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar cuerpo técnico';
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el cuerpo técnico de forma permanente?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idCuerpotecnico', id);
            console.log(id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(CUERPOTECNICO_API, 'deleteRow', FORM);
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
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreateD = (id) => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL_DETAIL.show();
    MODAL_TITLE_DETAIL.textContent = 'Agregar a un cuerpo técnico';
    // Se prepara el formulario.
    SAVE_FORM_DETAIL.reset();
    fillSelect(CUERPOTECNICO_API, 'readAll', 'cuerposTecnicos', id);
    fillSelect(TECNICO_API, 'readAll', 'tecnico');
    fillSelect(ROL_API, 'readAll', 'rol');
}
/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdateD = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idCuerpoTecnico', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL_DETAIL.show();
            MODAL_TITLE_DETAIL.textContent = 'Actualizar cuerpo técnico';
            // Se prepara el formulario.
            SAVE_FORM_DETAIL.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_CUERPOTECNICO_D.value = ROW.ID;
            fillSelect(CUERPOTECNICO_API, 'readAll', 'cuerposTecnicos', ROW.ID_CUERPO_TECNICO);
            fillSelect(TECNICO_API, 'readAll', 'tecnico', ROW.ID_TECNICO);
            fillSelect(ROL_API, 'readAll', 'rol', ROW.ID_ROL);
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
const openDeleteD = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar del cuerpo técnico?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idCuerpoTecnicoD', id);
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
const cuerpoTecnicoPorPagina = 10;
let paginaActual = 1;
let cuerpoTecnico = [];

// Función para cargar tabla de tipología con paginación
async function fillTable(form = null) {
    const cargarTabla = document.getElementById('tabla_cuerpo_tecnico');
    try {
        cargarTabla.innerHTML = '';
        // Petición para obtener los registros disponibles.
        let action;
        form ? action = 'searchRows' : action = 'readAll';

        const DATA = await fetchData(CUERPOTECNICO_API, action, form);
        if (DATA.status) {
            cuerpoTecnico = DATA.dataset;
            mostrarCuerpoTecnico(paginaActual);
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = DATA.message;
        } else {
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = "Existen 0 coincidencias";
            await sweetAlert(3, DATA.error, true);
        }
    } catch (error) {
        console.log(error);
        console.error('Error al obtener datos de la API:', error);
    }
}

// Función para mostrar cuerpos técnicos en una página específica
async function mostrarCuerpoTecnico(pagina) {
    const inicio = (pagina - 1) * cuerpoTecnicoPorPagina;
    const fin = inicio + cuerpoTecnicoPorPagina;
    const cuerpoTecnicoPagina = cuerpoTecnico.slice(inicio, fin);

    const cargarTabla = document.getElementById('tabla_cuerpo_tecnico');
    cargarTabla.innerHTML = '';
    for (const row of cuerpoTecnicoPagina) {
        const tablaHtml = `
            <tr>
            <td>
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading-${row.ID}">
                    <div class="accordion-button collapsed d-flex justify-content-between align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${row.ID}" aria-expanded="false" aria-controls="collapse-${row.ID}">
                        <div class="row w-100 align-items-center">
                            <div class="col text-start">
                                <p class="mb-0">${row.NOMBRE}</p>
                            </div>
                            <div class="col-auto d-flex gap-2">
                                <button type="button" class="btn transparente" onclick="openUpdate(${row.ID})">
                                    <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                                </button>
                                <button type="button" class="btn transparente" onclick="openDelete(${row.ID})">
                                    <img src="../../../resources/img/svg/icons_forms/trash 1.svg" width="18" height="18">
                                </button>
                            </div>
                        </div>
                    </div>
                </h2>
                <div id="collapse-${row.ID}" class="accordion-collapse collapse" aria-labelledby="heading-${row.ID}" data-bs-parent="#tabla_cuerpo_tecnico">
                    <div class="accordion-body">
                        <button class="btn bg-blue-principal-color mb-5 text-white ms-auto borde-transparente btn-sm rounded-3" onclick="openCreateD(${row.ID})">
                          <span class="fs-5 me-2">+</span> Agregar un elemento al cuerpo técnico
                        </button>
                        <div id="carousel-container-${row.ID}" class="carousel-container"></div>
                    </div>
                </div>
            </div>
            </td>
            </tr>
        `;
        cargarTabla.innerHTML += tablaHtml;

        await cargarCarrouselParaCuerpoTecnico(row.ID);
    }

    actualizarPaginacion();
}

async function cargarCarrouselParaCuerpoTecnico(id) {
    try {
        // Petición para obtener los technicos del cuerpo técnico
        const form = new FormData();
        form.append('idCuerpoTecnico', id);
        const technicsResponse = await fetchData(API, 'readOneDetail', form);
        const technics = technicsResponse.dataset;

        const carouselContainer = document.getElementById(`carousel-container-${id}`);
        const carouselId = `carousel-${id}`;
        carouselContainer.innerHTML = ''; // Clear the container before adding new content

        const carousel = document.createElement('div');
        carousel.className = 'carousel slide';
        carousel.id = carouselId;
        carousel.dataset.bsRide = 'carousel';

        let innerHTML = '';

        if (Array.isArray(technics) && technics.length > 0) {
            innerHTML = `
                <div class="carousel-inner">
            `;
            // Agrupar technicos en grupos de tres
            for (let i = 0; i < technics.length; i += 3) {
                innerHTML += `
                    <div class="carousel-item ${i === 0 ? 'active' : ''}">
                        <div class="row">
                `;
                // Mostrar hasta tres technicos en cada grupo
                for (let j = i; j < i + 3 && j < technics.length; j++) {
                    const technic = technics[j];
                    innerHTML += `
                        <div class="col-lg-4 col-md-4 col-sm-12 text-center">
                            <div class="card">
                                <div class="justify-content-center">
                                <img src="${SERVER_URL}images/tecnicos/${technic.IMAGEN}" class="card-img-top correccion" alt="${technic.TECNICO}">
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">${technic.TECNICO}</h5>
                                    <p class="card-text">${technic.ROL_TECNICO}</p>
                                </div>
                                <div class="card-footer p-3">  
                                   <button type="button" class="btn botones me-3" onclick="openUpdateD(${technic.ID})">
                                    <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                                   </button>
                                   <button type="button" class="btn botones" onclick="openDeleteD(${technic.ID})">
                                    <img src="../../../resources/img/svg/icons_forms/trash 1.svg" width="18" height="18">
                                   </button>
                                </div>
                            </div>
                        </div>
                    `;
                }
                innerHTML += `
                        </div>
                    </div>
                `;
            }
            innerHTML += `
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Anterior</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Siguiente</span>
                </button>
            `;
        } else {
            innerHTML = `<p>No hay técnicos agregados para este cuerpo técnico.</p>`;
        }

        carousel.innerHTML = innerHTML;
        carouselContainer.appendChild(carousel);
    } catch (error) {
        console.error('Error en la api:', error);
    }
}

// Función para actualizar los controles de paginación
function actualizarPaginacion() {
    const paginacion = document.querySelector('.pagination');
    paginacion.innerHTML = '';

    const totalPaginas = Math.ceil(cuerpoTecnico.length / cuerpoTecnicoPorPagina);

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
    mostrarCuerpoTecnico(paginaActual);
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const cuerpoTecnicoHtml = await loadComponent('../components/coaching_staff.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = cuerpoTecnicoHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Cuerpos técnicos';
    ROWS_FOUND = document.getElementById('rowsFound');
    fillTable();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_CUERPOTECNICO = document.getElementById('idCuerpotecnico'),
        CUERPOTECNICO = document.getElementById('cuerpoTecnico');
    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_CUERPOTECNICO.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(CUERPOTECNICO_API, action, FORM);
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
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL_DETAIL = new bootstrap.Modal('#saveModalDetail'),
        MODAL_TITLE_DETAIL = document.getElementById('modalTitleDetail');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM_DETAIL = document.getElementById('saveFormDetail'),
        ID_CUERPOTECNICO_D = document.getElementById('idCuerpoTecnicoD'),
        TECNICO = document.getElementById('tecnico'),
        ROL = document.getElementById('rol'),
        CUERPO_TECNICO = document.getElementById('cuerposTecnicos');
    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM_DETAIL.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_CUERPOTECNICO_D.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM_DETAIL);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(API, action, FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se cierra la caja de diálogo.
            SAVE_MODAL_DETAIL.hide();
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
};
