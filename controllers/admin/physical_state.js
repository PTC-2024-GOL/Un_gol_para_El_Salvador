let SAVE_MODAL;
let SAVE_FORM,
    ID_ESTADO,
    PESO,
    ALTURA,
    IMC,
    ID_JUGADOR,
    FECHA,
    titleElement;
let SAVE_MODAL2;
let titleElement2;
let SEARCH_FORM;
let GRAPHIC_MODAL;
const PARAMS = new URLSearchParams(window.location.search);
//Guarda en una variable el parametro obtenido
const JUGADOR = PARAMS.get("id");

// Constantes para completar las rutas de la API.
const ESTADO_API = 'services/admin/estado_fisico_jugador.php';

async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}
/*
*   Función para preparar el clasificacion de IMC.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const modalMedicalRecords = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL2.show();
    MODAL_TITLE2.textContent = 'Clasificación de IMC';
}



/*
*   Función para abrir un modal con las gráficas.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openGraphic = () => {
    // Se muestra la caja de diálogo con su título.
    GRAPHIC_MODAL.show();
    MODAL_TITLE_GRAPHIC.textContent = 'Gráficas del índice de masa corporal del jugador';
    cargarGraficaLinealPredicticion();
    cargarGraficaLineal();
    console.log(localStorage.getItem('graficaPrediccion'));
    console.log(localStorage.getItem('graficaVentas'));
}

const openReport = () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/admin/reporte_parametrizado_estado_fisico.php`);
    // Se agrega un parámetro a la ruta con el valor del registro seleccionado.
    PATH.searchParams.append('idJugador', JUGADOR);
    // Se abre el reporte en una nueva pestaña.
    window.open(PATH.href);
}

let chartInstance = null;
// Función para cargar la gráfica lineal predictiva
const cargarGraficaLinealPredicticion = async () => {
    try {
        const FORM = new FormData();
        FORM.append('idJugador', JUGADOR);
        const DATA = await fetchData(ESTADO_API, 'graphicPredictiveImc', FORM);
        if (DATA.status) {
            let fecha = [];
            let imc = [];
            DATA.dataset.forEach(row => {
                fecha.push(`${row.fecha}`);
                imc.push(row.imc);
            });

            // Destruir la instancia existente del gráfico si existe
            if (chartInstance) {
                chartInstance.destroy();
                chartInstance = null; // Asegúrate de restablecer la referencia
            }

            // Restablecer el canvas en caso de que sea necesario
            const canvasContainer = document.getElementById('prediccion').parentElement;
            canvasContainer.innerHTML = '<canvas id="prediccion"></canvas>  <div id="error_prediccion"></div>';

            chartInstance = lineGraphWithFill('prediccion', fecha, imc, 'Imc por día', 'Predicción del imc de la siguiente semana');
        } else {
            console.log(DATA.error);
            // Destruir la instancia existente del gráfico si existe
            if (chartInstance) {
                chartInstance.destroy();
                chartInstance = null; // Asegúrate de restablecer la referencia
            }
            // Restablecer el canvas en caso de que sea necesario
            const canvasContainer = document.getElementById('prediccion').parentElement;
            canvasContainer.innerHTML = ' <div id="error_prediccion"></div> <canvas id="prediccion"></canvas>';

            // Restablecer o crear el contenedor
            errorContainer = document.getElementById('error_prediccion');
            errorContainer.innerHTML += '';
            const tablaHtml = `
            <div class="col-md-12 row d-flex text-center justify-content-center">
                <div class="col-md-6">
                    <div class="card mb-4 shadow-sm">
                        <img src="../../../resources/img/svg/errores/find.png"
                        class="card-img-top img-thumbnail" alt="Imagen de ejemplo"">
                        <div class="card-body">
                            <div class="d-flex justify-content-center align-items-center">
                            <p class="text-primary">${DATA.error} </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
            errorContainer.innerHTML += tablaHtml;
            chartInstance = null;
        }
    } catch (error) {
        console.log('Error:', error);
        // Destruir la instancia existente del gráfico si existe
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null; // Asegúrate de restablecer la referencia
        }
        // Restablecer el canvas en caso de que sea necesario
        const canvasContainer = document.getElementById('prediccion').parentElement;
        canvasContainer.innerHTML = ' <div id="error_prediccion"></div> <canvas id="prediccion"></canvas>';

        // Restablecer o crear el contenedor
        errorContainer = document.getElementById('error_prediccion');
        errorContainer.innerHTML += '';
        const tablaHtml = `
        <div class="col-md-12 row d-flex text-center justify-content-center">
            <div class="col-md-6">
                <div class="card mb-4 shadow-sm">
                    <img src="../../../resources/img/svg/errores/find.png"
                    class="card-img-top img-thumbnail" alt="Imagen de ejemplo"">
                    <div class="card-body">
                        <div class="d-flex justify-content-center align-items-center">
                            <p class="text-primary">No hay datos suficientes para mostrar la gráfica predictiva</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        errorContainer.innerHTML += tablaHtml;
        chartInstance = null;
    }
}

let chartInstance2 = null;
// Función para cargar la gráfica lineal
const cargarGraficaLineal = async () => {
    try {
        const FORM = new FormData();
        FORM.append('idJugador', JUGADOR);
        const DATA = await fetchData(ESTADO_API, 'graphicImcByPlayer', FORM);
        if (DATA.status) {
            let fecha = [];
            let imc = [];
            DATA.dataset.forEach(row => {
                fecha.push(`${row.FECHA}`);
                imc.push(row.IMC);
            });

            // Destruir la instancia existente del gráfico si existe
            if (chartInstance2) {
                chartInstance2.destroy();
                chartInstance2 = null; // Asegúrate de restablecer la referencia
            }

            // Restablecer el canvas en caso de que sea necesario
            const canvasContainer = document.getElementById('historico').parentElement;
            canvasContainer.innerHTML = '<canvas id="historico"></canvas> <div id="error_historico"></div>';

            chartInstance2 = lineGraphWithFill('historico', fecha, imc, 'Imc por mes', 'Gráfica del índice de masa corporal del último mes del jugador ');
        } else {
            console.log(DATA.error);
            // Destruir la instancia existente del gráfico si existe
            if (chartInstance2) {
                chartInstance2.destroy();
                chartInstance2 = null; // Asegúrate de restablecer la referencia
            }
            // Restablecer el canvas en caso de que sea necesario
            const canvasContainer = document.getElementById('historico').parentElement;
            canvasContainer.innerHTML = '<div id="error_historico"></div> <canvas id="historico"></canvas>';

            // Restablecer o crear el contenedor
            errorContainer = document.getElementById('error_historico');
            errorContainer.innerHTML += '';
            const tablaHtml = `
            <div class="col-md-12 row d-flex text-center justify-content-center">
                <div class="col-md-6">
                    <div class="card mb-4 shadow-sm">
                        <img src="../../../resources/img/svg/errores/find.png"
                        class="card-img-top img-thumbnail" alt="Imagen de ejemplo"">
                        <div class="card-body">
                            <div class="d-flex justify-content-center align-items-center">
                            <p class="text-primary">${DATA.error} </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
            errorContainer.innerHTML += tablaHtml;
            chartInstance2 = null;
        }
    } catch (error) {
        console.log('Error:', error);
        // Destruir la instancia existente del gráfico si existe
        if (chartInstance2) {
            chartInstance2.destroy();
            chartInstance2 = null; // Asegúrate de restablecer la referencia
        }
        // Restablecer el canvas en caso de que sea necesario
        const canvasContainer = document.getElementById('historico').parentElement;
        canvasContainer.innerHTML = ' <div id="error_historico"></div> <canvas id="historico"></canvas>';

        // Restablecer o crear el contenedor
        errorContainer = document.getElementById('error_historico');
        errorContainer.innerHTML += '';
        const tablaHtml = `
        <div class="col-md-12 row d-flex text-center justify-content-center">
            <div class="col-md-6">
                <div class="card mb-4 shadow-sm">
                    <img src="../../../resources/img/svg/errores/find.png"
                    class="card-img-top img-thumbnail" alt="Imagen de ejemplo"">
                    <div class="card-body">
                        <div class="d-flex justify-content-center align-items-center">
                            <p class="text-primary">No existen datos para la gráfica</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        errorContainer.innerHTML += tablaHtml;
        chartInstance2 = null;
    }
}

/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Agregar registro';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    ID_JUGADOR.value = JUGADOR;
    ID_ESTADO.value = null;
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
        FORM.append('idEstado', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(ESTADO_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar registro';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_ESTADO.value = ROW.id_estado_fisico_jugador;
            ID_JUGADOR.value = ROW.id_jugador;
            PESO.value = ROW.peso_jugador;
            ALTURA.value = ROW.altura_jugador;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar registro';
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el registro?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idEstado', id);
            console.log(id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(ESTADO_API, 'deleteRow', FORM);
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
const injuriesByPage = 10;
let currentPage = 1;
let injuries = [];

function showInjuries(page) {
    const start = (page - 1) * injuriesByPage;
    const end = start + injuriesByPage;
    const injuriesPage = injuries.slice(start, end);

    const fillTable = document.getElementById('tabla_estado');
    fillTable.innerHTML = '';
    injuriesPage.forEach(row => {
        let color;
                let imc = parseFloat(row.indice_masa_corporal);

                // Determinar el color basado en el IMC
                if (imc < 18.5) {
                    color = 'gray';
                } else if (imc >= 18.5 && imc <= 24.9) {
                    color = 'green';
                } else if (imc >= 25 && imc <= 29.9) {
                    color = 'blue';
                } else if (imc >= 30 && imc <= 34.9) {
                    color = 'pink';
                } else if (imc >= 35 && imc <= 39.9) {
                    color = 'orangered';
                } else {
                    color = 'darkred';
                }
                console.log('Esto contiene el color ' + color);

                const tablaHtml = `
                <tr>
                    <td>${row.fecha_creacion_format}</td>
                    <td>${row.altura_jugador} ctm</td>
                    <td>${row.peso_jugador} lbs</td>
                    <td style="color: ${color};">${row.indice_masa_corporal}</td>
                    <td>
                        <button type="button" class="btn transparente" onclick="openUpdate(${row.id_estado_fisico_jugador})">
                            <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                        </button>
                        <button type="button" class="btn transparente" onclick="openDelete(${row.id_estado_fisico_jugador})">
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
    const lista_datos = [];
    const cargarTabla = document.getElementById('tabla_estado');

    try {
        cargarTabla.innerHTML = '';
        let action = (form) ? 'searchRows' : 'readAll';
        console.log('form antes del parametro' + form + ' y el action es ' + action);
        console.log('El parametro de URL contiene esto ' + JUGADOR);
        const FORM = new FormData();
        if (action === 'readAll') {
            FORM.append('idJugador', JUGADOR);
            form = FORM;
            console.log('entré al parametro de readAll ');
        }
        console.log('form despues del parametro' + FORM);

        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(ESTADO_API, action, form);
        console.log('Esto contiene la consulta ' + DATA);
        let nombreJugador;
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
            // Convertir peso de libras a kilogramos y altura de cm a metros
            const pesoKg = row.peso / 2.205;
            const alturaM = row.altura / 100;

            // Calcular IMC
            const imc = pesoKg / (alturaM * alturaM);
            const tablaHtml = `
            <tr>
                <td>${row.fecha}</td>
                <td>${row.altura}</td>
                <td>${row.peso}</td>
                <td>${imc.toFixed(2)}</td>
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
    const lesionHtml = await loadComponent('../components/physical_state.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = lesionHtml;
    titleElement = document.getElementById('title');
    titleElement.textContent = 'Estado fisico del jugador';
    //Agrega el encabezado de la pantalla
    fillTable();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    SAVE_MODAL2 = new bootstrap.Modal('#saveModal2'),
        MODAL_TITLE2 = document.getElementById('modalTitle2');

    GRAPHIC_MODAL = new bootstrap.Modal('#graphicModal'),
        MODAL_TITLE_GRAPHIC = document.getElementById('modalTitle3')

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_ESTADO = document.getElementById('idEstado'),
        PESO = document.getElementById('peso'),
        ID_JUGADOR = document.getElementById('idJugador'),
        ALTURA = document.getElementById('altura'),
        // Método del evento para cuando se envía el formulario de guardar.
        SAVE_FORM.addEventListener('submit', async (event) => {
            // Se evita recargar la página web después de enviar el formulario.
            event.preventDefault();
            // Se verifica la acción a realizar.
            (ID_ESTADO.value) ? action = 'updateRow' : action = 'createRow';
            console.log('El valor de la acción es ' + action);
            console.log('Esto contiene el estado' + ID_ESTADO.value);
            // Constante tipo objeto con los datos del formulario.
            const FORM = new FormData(SAVE_FORM);
            // Petición para guardar los datos del formulario.
            const DATA = await fetchData(ESTADO_API, action, FORM);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                console.log('Entré al if de que se agrego el coso ' + DATA);
                // Se cierra la caja de diálogo.
                SAVE_MODAL.hide();
                // Se muestra un mensaje de éxito.
                sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                fillTable();
            } else {
                console.log('Esto contiene el parametro ID_JUGADOR ' + ID_JUGADOR.value);
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
        FORM.append('idJugador', JUGADOR);
        console.log(SEARCH_FORM);
        console.log(FORM);
        // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
        fillTable(FORM);
    });
};
