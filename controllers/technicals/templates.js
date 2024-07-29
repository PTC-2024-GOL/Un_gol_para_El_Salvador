let SAVE_MODAL;
let SAVE_FORM,
    ID_PLANTILLA,
    NOMBRE_PLANTILLA;
let SEARCH_FORM;
let ROWS_FOUND;

let DETAIL_MODAL;
let DETAIL_FORM,
    PLANTILLA,
    JUGADOR,
    TEMPORADA,
    EQUIPO;

let TEMPLATE_MODAL,
    TEMPLATE_TITLE;
let TEMPLATE_FORM,
    ID_PLANTILLA_EQUIPO,
    PLANTILLAS,
    JUGADORES,
    TEMPORADAS,
    EQUIPOS;

// Constantes para completar las rutas de la API.
const API = 'services/technics/plantillas.php';
// Constantes para completar las rutas de la API.
const API_PLANTILLAS = 'services/technics/plantillas_equipos.php';
const PLANTILLA_API = 'services/technics/plantillas.php';
const JUGADOR_API = 'services/technics/jugadores.php';
const TEMPORADA_API = 'services/technics/temporadas.php';
const EQUIPO_API = 'services/technics/equipos.php';

async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}
/*
* Función para preparar el formulario al momento de insertar un registro.
* Parámetros: ninguno.
* Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Agregar una plantilla';
    // Se prepara el formulario.
    SAVE_FORM.reset();
}


async function cargarTabla(FORM = null) {
    const cargarTabla = document.getElementById('tabla_jugadores');
    try {
        cargarTabla.innerHTML = '';
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(API_PLANTILLAS, 'readOneTemplate', FORM);
        console.log(DATA);
        // Mostrar elementos obtenidos de la API
        DATA.dataset.forEach(row => {
            const tablaHtml = `
        <tr>
            <td>${row.DORSAL}</td>
            <td>${row.POSICION_PRINCIPAL}</td>
            <td><img src="${SERVER_URL}images/jugadores/${row.IMAGEN}" height="50" width="50" class="circulo"></td>
            <td>${row.NOMBRE}</td>
            <td>${row.NACIMIENTO}</td>
            <td><img src="${SERVER_URL}images/equipos/${row.LOGO}" height="25" width="25" class="circulo"></td>
            <td>${row.NOMBRE_EQUIPO}</td>
            <td>${row.NOMBRE_TEMPORADA}</td>
            <td>
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
    }
}

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
            const DATA = await fetchData(API_PLANTILLAS, 'deleteRow', FORM);
            console.log(DATA.status);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se muestra un mensaje de éxito.
                await sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                const form = new FormData();
                form.append('idPlantillaEquipo', id_plantilla_tabla);
                cargarTabla(form);
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
* Función asíncrona para preparar el formulario al momento de actualizar un registro.
* Parámetros: id (identificador del registro seleccionado).
* Retorno: ninguno.
*/
const openUpdate = async (id) => {
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
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_PLANTILLA.value = ROW.ID;
            NOMBRE_PLANTILLA.value = ROW.NOMBRE;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar la plantilla';
    }

}
/*
* Función asíncrona para eliminar un registro.
* Parámetros: id (identificador del registro seleccionado).
* Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar la plantilla?');
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
    TEMPLATE_MODAL.show();
    TEMPLATE_TITLE.textContent = 'Agregar jugador a la plantilla';
    // Se prepara el formulario.
    TEMPLATE_FORM.reset();
    fillSelect(PLANTILLA_API, 'readAll', 'plantilla', id);
    fillSelect(JUGADOR_API, 'readAll', 'jugador');
    fillSelect(TEMPORADA_API, 'readAll', 'temporada');
    fillSelect(EQUIPO_API, 'readAllSelect', 'equipo');
}
/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdateD = async (id) => {
    try {
        console.log('Valor del id: ', id);
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idPlantillaEquipo', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(API_PLANTILLAS, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            TEMPLATE_MODAL.show();
            TEMPLATE_TITLE.textContent = 'Actualizar jugador de la plantilla';
            // Se prepara el formulario.
            TEMPLATE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_PLANTILLA_EQUIPO.value = ROW.IDP;
            console.log(ID_PLANTILLA_EQUIPO.value);
            fillSelect(PLANTILLA_API, 'readAll', 'plantilla', ROW.ID_PLANTILLA);
            fillSelect(JUGADOR_API, 'readAll', 'jugador', ROW.ID);
            fillSelect(TEMPORADA_API, 'readAll', 'temporada', ROW.ID_TEMPORADA);
            fillSelect(EQUIPO_API, 'readAllSelect', 'equipo', ROW.ID_EQUIPO);
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
    const RESPONSE = await confirmAction('¿Desea eliminar al jugador de la plantilla?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idPlantillaEquipo', id);
            console.log(id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(API_PLANTILLAS, 'deleteRow', FORM);
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
const plantillasPorPagina = 10;
let paginaActual = 1;
let plantillas = [];

// Función para cargar tabla de técnicos con paginación
async function fillTable(form = null) {
    const cargarTabla = document.getElementById('tabla_plantillas');
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
// Función para mostrar plantillas en una página específica
async function mostrarPlantillas(pagina) {
    const inicio = (pagina - 1) * plantillasPorPagina;
    const fin = inicio + plantillasPorPagina;
    const plantillasPagina = plantillas.slice(inicio, fin);

    const cargarTabla = document.getElementById('tabla_plantillas');
    cargarTabla.innerHTML = '';
    for (const row of plantillasPagina) {
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
                        <div id="collapse-${row.ID}" class="accordion-collapse collapse" aria-labelledby="heading-${row.ID}" data-bs-parent="#tabla_plantillas">
                          <div class="accordion-body mt-5">
                            <div class="row w-100"> 
                             <div class="col-sm-12 col-md-6">
                                <button class="btn bg-blue-principal-color mb-5 text-white ms-auto borde-transparente btn-sm rounded-3" onclick="openCreateD(${row.ID})">
                                    <span class="fs-5 me-2">+</span> Agregar un elemento a la plantilla
                                </button>
                             </div>
                            </div>
                                <div id="carousel-container-${row.ID}" class="carousel-container"></div>
                          </div>
                        </div>
                    </div>
                </td>
            </tr>
        `;
        cargarTabla.innerHTML += tablaHtml;

        await cargarCarrouselParaPlantillas(row.ID);
    }

    actualizarPaginacion();
}

async function cargarCarrouselParaPlantillas(id) {
    try {
        // Petición para obtener los plantillaos del cuerpo técnico
        const form = new FormData();
        form.append('idPlantillaEquipo', id);
        const plantillasResponse = await fetchData(API_PLANTILLAS, 'readOneTemplate', form);
        const plantillas = plantillasResponse.dataset;

        const carouselContainer = document.getElementById(`carousel-container-${id}`);
        const carouselId = `carousel-${id}`;
        carouselContainer.innerHTML = ''; // Clear the container before adding new content

        const carousel = document.createElement('div');
        carousel.className = 'carousel slide';
        carousel.id = carouselId;
        carousel.dataset.bsRide = 'carousel';

        let innerHTML = '';

        if (Array.isArray(plantillas) && plantillas.length > 0) {
            innerHTML = `
        <div class="carousel-inner">
            `;
            // Agrupar plantillaos en grupos de tres
            for (let i = 0; i < plantillas.length; i += 3) {
                innerHTML += ` <div
                class="carousel-item ${i === 0 ? 'active' : ''}">
                <div class="row">
                    `;
                // Mostrar hasta tres plantillaos en cada grupo
                for (let j = i; j < i + 3 && j < plantillas.length; j++) {
                    const plantilla = plantillas[j]; innerHTML
                        += ` <div class="col-lg-4 col-md-4 col-sm-12 text-center">
                        <div class="card">
                            <div class="d-flex justify-content-between">
                            <h5 class="text-start ms-3 mt-2"> ${plantilla.DORSAL}</h5>
                            <img src="${SERVER_URL}images/equipos/${plantilla.LOGO}" class="card-img-top logo text-end" alt="${plantilla.NOMBRE_EQUIPO}">
                            </div>
                            <div class="justify-content-center">
                                <img src="${SERVER_URL}images/jugadores/${plantilla.IMAGEN}"
                                    class="card-img-top correccion" alt="${plantilla.TECNICO}">
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">${plantilla.NOMBRE}</h5>
                                <p class="card-text">${plantilla.POSICION_PRINCIPAL}</p>
                                <p class="card-text">${plantilla.NOMBRE_EQUIPO}</p>
                                <p class="card-text">${plantilla.NOMBRE_TEMPORADA}</p>
                            </div>
                            <div class="card-footer p-3">
                                <button type="button" class="btn botones me-3" onclick="openUpdateD(${plantilla.IDP})">
                                    <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                                </button>
                                <button type="button" class="btn botones" onclick="openDeleteD(${plantilla.IDP})">
                                    <img src="../../../resources/img/svg/icons_forms/trash 1.svg" width="18"
                                        height="18">
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
            innerHTML = `<p>No hay jugadores agregados a esta plantilla.</p>`;
        }

        carousel.innerHTML = innerHTML;
        carouselContainer.appendChild(carousel);
    } catch (error) {
        console.error('Error en la api:', error);
    }
}

// Función para actualizar los contplantillas de paginación
function actualizarPaginacion() {
    const paginacion = document.querySelector('.pagination');
    paginacion.innerHTML = '';

    const totalPaginas = Math.ceil(plantillas.length / plantillasPorPagina);

    if (paginaActual > 1) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-bs-dark" href="#"
                onclick="cambiarPagina(${paginaActual - 1})">Anterior</a></li>`;
    }

    for (let i = 1; i <= totalPaginas; i++) {
        paginacion.innerHTML += `<li
            class="page-item ${i === paginaActual ? 'active' : ''}"><a class="page-link text-bs-dark" href="#"
                onclick="cambiarPagina(${i})">${i}</a></li>`;
    }

    if (paginaActual < totalPaginas) {
        paginacion.innerHTML += `<li class="page-item"><a
                    class="page-link text-bs-dark" href="#" onclick="cambiarPagina(${paginaActual + 1})">Siguiente</a></li>
                `;
    }
}

// Función para cambiar de página
function cambiarPagina(nuevaPagina) {
    paginaActual = nuevaPagina;
    mostrarPlantillas(paginaActual);
}


// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const contentHtml = await loadComponent('../components/template_name.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = contentHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Plantillas';
    ROWS_FOUND = document.getElementById('rowsFound');
    fillTable();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');
    TEMPLATE_MODAL = new bootstrap.Modal('#templateModal'),
        TEMPLATE_TITLE = document.getElementById('modalTitle2');
    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_PLANTILLA = document.getElementById('idPlantilla'),
        NOMBRE_PLANTILLA = document.getElementById('nombrePlantilla');
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
    TEMPLATE_FORM = document.getElementById('templateForm'),
        ID_PLANTILLA_EQUIPO = document.getElementById('idPlantillaEquipo'),
        PLANTILLAS = document.getElementById('plantilla'),
        JUGADOR = document.getElementById('jugador'),
        TEMPORADAS = document.getElementById('temporada'),
        EQUIPOS = document.getElementById('equipo');
    // Método del evento para cuando se envía el formulario de guardar.
    TEMPLATE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_PLANTILLA_EQUIPO.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(TEMPLATE_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(API_PLANTILLAS, action, FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se cierra la caja de diálogo.
            TEMPLATE_MODAL.hide();
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