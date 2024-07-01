let SAVE_MODAL,
    MODAL_TITLE;
let SEE_MODAL,
    MODAL_TITLE1;
let SAVE_FORM,
    ID_CATEGORIAS,
    NOMBRE_CATEGORIA,
    EDAD_MIN,
    EDAD_MAX,
    TEMPORADA,
    HORARIO;
let SEARCH_FORM;
let ROWS_FOUND;
let SEE_FORM,
    ID_HORARIO_CAT,
    HORARIO_HC,
    CATEGORIA;

// Constantes para completar las rutas de la API.
const API = 'services/admin/categorias.php';
const HORARIOSCAT_API = 'services/admin/horarios_categoria.php';
const TEMPORADAS_API = 'services/admin/temporadas.php';
const HORARIO_API = 'services/admin/horarios.php';

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
    MODAL_TITLE.textContent = 'Agregar una categoría';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    fillSelect(TEMPORADAS_API, 'readAll', 'temporada');
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
        FORM.append('idCategoria', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar una categoría';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_CATEGORIAS.value = ROW.id_categoria;
            NOMBRE_CATEGORIA.value = ROW.nombre_categoria;
            EDAD_MIN.value = ROW.edad_minima_permitida;
            EDAD_MAX.value = ROW.edad_maxima_permitida;
            fillSelect(TEMPORADAS_API, 'readAll', 'temporada', ROW.id_temporada);
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar una categoría';
        fillSelect(TEMPORADAS_API, 'readAll', 'temporada');
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar la categoría?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idCategoria', id);
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


const seeModal = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idCategoria', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(ASISTENCIAS_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SEE_MODAL.show();
            MODAL_TITLE.textContent = 'Elegir horario';
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
        MODAL_TITLE1.textContent = 'Elegir horario';
    }
}


/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreateHc = (id) => {
    // Se muestra la caja de diálogo con su título.
    SEE_MODAL.show();
    MODAL_TITLE1.textContent = 'Agregar horario a la categoría';
    fillSelect(API, 'readAll', 'categoriaHora', id);
    fillSelect(HORARIO_API, 'readAll', 'horarioCat');
}
/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdateHc = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idHorarioCate', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(HORARIOSCAT_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SEE_MODAL.show();
            MODAL_TITLE1.textContent = 'Actualizar el horario a la categoría';
            // Se prepara el formulario.
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_HORARIO_CAT.value = ROW.id_horario_categoria;
            fillSelect(API, 'readAll', 'categoriaHora', ROW.id_categoria);
            fillSelect(HORARIO_API, 'readAll', 'horarioCat', ROW.id_horario);
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        MODAL_TITLE1.textContent = 'Actualizar el horario a la categoría';
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDeleteHc = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el horario de la categoría?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idHorarioCate', id);
            console.log(id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(HORARIOSCAT_API, 'deleteRow', FORM);
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
const categoriasPorPagina = 10;
let paginaActual = 1;
let categorias = [];

// Función para cargar tabla de técnicos con paginación
async function fillTable(form = null) {
    const cargarTabla = document.getElementById('tabla_categorias');
    try {
        cargarTabla.innerHTML = '';
        // Petición para obtener los registros disponibles.
        let action;
        form ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        const DATA = await fetchData(API, action, form);
        console.log(DATA);

        if (DATA.status) {
            categorias = DATA.dataset;
            mostrarCategorias(paginaActual);
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
async function mostrarCategorias(pagina) {
    const inicio = (pagina - 1) * categoriasPorPagina;
    const fin = inicio + categoriasPorPagina;
    const categoriasPagina = categorias.slice(inicio, fin);

    const cargarTabla = document.getElementById('tabla_categorias');
    cargarTabla.innerHTML = '';
    for (const row of categoriasPagina) {
        const tablaHtml = `
            <tr>
                <td colspan="5">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="heading-${row.id_categoria}">
                            <div class="accordion-button collapsed d-flex justify-content-between align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${row.id_categoria}" aria-expanded="false" aria-controls="collapse-${row.id_categoria}">
                                <div class="row w-100 align-items-center">
                                    <div class="col">
                                        ${row.nombre_categoria}
                                    </div>
                                    <div class="col">
                                        ${row.edad_minima_permitida}
                                    </div>
                                    <div class="col">
                                        ${row.edad_maxima_permitida}
                                    </div>
                                    <div class="col">
                                        ${row.nombre_temporada}
                                    </div>
                                </div>
                            </div>
                        </h2>
                        <div id="collapse-${row.id_categoria}" class="accordion-collapse collapse" aria-labelledby="heading-${row.id_categoria}" data-bs-parent="#tabla_categorias">
                            <div class="accordion-body">
                                <button class="btn bg-blue-principal-color mb-5 text-white ms-auto borde-transparente btn-sm rounded-3" onclick="openCreateHc(${row.id_categoria})">
                                    <span class="fs-5 me-2">+</span> Agregar un horario a la categoría
                                </button>
                                <div id="carousel-container-${row.id_categoria}" class="carousel-container"></div>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <button type="button" class="btn transparente" onclick="openUpdate(${row.id_categoria})">
                    <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                    </button>
                    <button type="button" class="btn transparente" onclick="openDelete(${row.id_categoria})">
                    <img src="../../../resources/img/svg/icons_forms/trash 1.svg" width="18" height="18">
                    </button>
                </td>
            </tr>
        `;
        cargarTabla.innerHTML += tablaHtml;
        await cargarCarrouselParaCategoria(row.id_categoria);
    }

    actualizarPaginacion();
}


async function cargarCarrouselParaCategoria(id) {
    try {
        // Petición para obtener los categoryos del cuerpo técnico
        const form = new FormData();
        form.append('idCategoria', id);
        const categorysResponse = await fetchData(HORARIOSCAT_API, 'onlyDetail', form);
        const categorys = categorysResponse.dataset;

        const carouselContainer = document.getElementById(`carousel-container-${id}`);
        const carouselId = `carousel-${id}`;
        carouselContainer.innerHTML = ''; // Clear the container before adding new content

        const carousel = document.createElement('div');
        carousel.className = 'carousel slide';
        carousel.id = carouselId;
        carousel.dataset.bsRide = 'carousel';

        let innerHTML = '';

        if (Array.isArray(categorys) && categorys.length > 0) {
            innerHTML = `
                <div class="carousel-inner">
            `;
            // Agrupar categoryos en grupos de tres
            for (let i = 0; i < categorys.length; i += 3) {
                innerHTML += `
                    <div class="carousel-item ${i === 0 ? 'active' : ''}">
                        <div class="row">
                `;
                // Mostrar hasta tres categoryos en cada grupo
                for (let j = i; j < i + 3 && j < categorys.length; j++) {
                    const category = categorys[j];
                    innerHTML += `
                        <div class="col-lg-4 col-md-4 col-sm-12 text-center">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">${category.nombre_horario}</h5>
                                    <p class="card-text">Día: ${category.dia}</p>
                                    <p class="card-text">Hora de inicio: ${category.hora_inicial}</p>
                                    <p class="card-text">Hora final: ${category.hora_final}</p>
                                </div>
                                <div class="card-footer p-3">  
                                   <button type="button" class="btn botones me-3" onclick="openUpdateHc(${category.id_horario_categoria})">
                                    <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                                   </button>
                                   <button type="button" class="btn botones" onclick="openDeleteHc(${category.id_horario_categoria})">
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
            innerHTML = `<p>No hay horarios disponibles para esta categoría.</p>`;
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

    const totalPaginas = Math.ceil(categorias.length / categoriasPorPagina);

    if (paginaActual > 1) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-light" href="#" onclick="cambiarPagina(${paginaActual - 1})">Anterior</a></li>`;
    }

    for (let i = 1; i <= totalPaginas; i++) {
        paginacion.innerHTML += `<li class="page-item ${i === paginaActual ? 'active' : ''}"><a class="page-link text-light" href="#" onclick="cambiarPagina(${i})">${i}</a></li>`;
    }

    if (paginaActual < totalPaginas) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-light" href="#" onclick="cambiarPagina(${paginaActual + 1})">Siguiente</a></li>`;
    }
}

// Función para cambiar de página
function cambiarPagina(nuevaPagina) {
    paginaActual = nuevaPagina;
    mostrarCategorias(paginaActual);
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const horarioHtml = await loadComponent('../components/categories.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = horarioHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Categorías';
    ROWS_FOUND = document.getElementById('rowsFound');
    fillTable();
    // Constantes para establecer los elementos del componente Modal.
    SEE_MODAL = new bootstrap.Modal('#seeModal'),
        MODAL_TITLE1 = document.getElementById('modalTitle2');

    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_CATEGORIAS = document.getElementById('idCategoria'),
        NOMBRE_CATEGORIA = document.getElementById('nombreCategoria'),
        EDAD_MIN = document.getElementById('edadMin'),
        EDAD_MAX = document.getElementById('edadMax'),
        TEMPORADA = document.getElementById('temporada'),
        HORARIO = document.getElementById('horario');
    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_CATEGORIAS.value) ? action = 'updateRow' : action = 'createRow';
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
    // Constantes para establecer los elementos del formulario de guardar.
    SEE_FORM = document.getElementById('seeForm'),
        ID_HORARIO_CAT = document.getElementById('idHorarioCate'),
        CATEGORIA = document.getElementById('categoriaHora'),
        HORARIO_HC = document.getElementById('horarioCat');
    // Método del evento para cuando se envía el formulario de guardar.
    SEE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_HORARIO_CAT.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SEE_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(HORARIOSCAT_API, action, FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se cierra la caja de diálogo.
            SEE_MODAL.hide();
            // Se muestra un mensaje de éxito.
            sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            fillTable();
        } else {
            sweetAlert(2, DATA.error, false);
            console.error(DATA.exception);
        }
    });
};
