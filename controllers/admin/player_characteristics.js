let SAVE_MODAL;
let SAVE_FORM,
    ID_CARACTERISTICA,
    NOMBRECARACTERISTICA_CARACTERISTICA,
    CLASIFICACION_CARACTERISTICA;
let SEARCH_FORM;
let ROWS_FOUND;
let GRAPHIC_MODAL;

// Constantes para completar las rutas de la API
const API = 'services/admin/caracteristicas.php';

async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

let chartInstance = null;  
/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Crear característica';

    SAVE_FORM.reset();
    fillSelected(lista_datos, 'readAll', 'clasificacionCaracteristica');
}

const openGraphic = () => {
    // Se muestra la caja de diálogo con su título.
    GRAPHIC_MODAL.show();
    modalTitleGraphic.textContent = 'Gráfica - Número de características por clasificación';
    graficoBarrasLineasAnalisis();
}


const graficoBarrasLineasAnalisis = async () => {
    try {
        // Petición para obtener los datos del gráfico.
        let DATA = await fetchData(API, 'graphic');

        // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
        if (DATA.status) {
            // Se declaran los arreglos para guardar los datos a graficar.
            let numCaracteristica = [];
            let caracteristica = [];

            // Se recorre el conjunto de registros fila por fila a través del objeto row.
            DATA.dataset.forEach(row => {
                // Se agregan los datos a los arreglos.
                caracteristica.push(row.CARACTERISTICA);
                numCaracteristica.push(row.NUM_CARACTERISTICA);
            });

            // Imprime los datos en la consola para depuración
            console.log(numCaracteristica);
            console.log(caracteristica);

            // Restablecer el canvas en caso de que sea necesario
            const canvasContainer = document.getElementById('analisis').parentElement;
            canvasContainer.innerHTML = '<canvas id="analisis"></canvas>';
            // Llamada a la función para generar y mostrar un gráfico de pastel. Se encuentra en el archivo components.js
            PolarAreaGraph('analisis', caracteristica, numCaracteristica, 'Número de característica de cada clasificación');
        } else {
            console.log(DATA.error);
        }
    } catch (error) {
        console.log(error);
    }
}


const lista_datos = [
    {
        clasificacion: "Técnicos",
        id: "Técnicos",
    },
    {
        clasificacion: 'Tácticos',
        id: 'Tácticos',
    },
    {
        clasificacion: 'Psicológicos',
        id: 'Psicológicos',
    },
    {
        clasificacion: 'Físicos',
        id: 'Físicos',
    }
];

// Función para poblar un combobox (select) con opciones quemadas
const fillSelected = (data, action, selectId, selectedValue = null) => {
    const selectElement = document.getElementById(selectId);

    // Limpiar opciones previas del combobox
    selectElement.innerHTML = '';

    // Crear opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecciona la clasificación';
    selectElement.appendChild(defaultOption);

    // Llenar el combobox con los datos proporcionados
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id; // Suponiendo que hay una propiedad 'id' en los datos
        option.textContent = item.clasificacion; // Cambia 'horario' al nombre de la propiedad que deseas mostrar en el combobox
        selectElement.appendChild(option);
    });

    // Seleccionar el valor especificado si se proporciona
    if (selectedValue !== null) {
        selectElement.value = selectedValue;
    }
};

/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdate = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idCaracteristica', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            MODAL_TITLE.textContent = `Actualizar característica ${ROW.NOMBRE}`;
            // Se prepara el formulario.
            SAVE_FORM.reset();
            ID_CARACTERISTICA.value = ROW.ID;
            NOMBRECARACTERISTICA_CARACTERISTICA.value = ROW.NOMBRE;
            fillSelected(lista_datos, 'readAll', 'clasificacionCaracteristica', ROW.CLASIFICACION)
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar característica';
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id, nombre) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction(`¿Desea eliminar la característica ${nombre} de forma permanente?`);
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idCaracteristica', id);
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
const caracteristicaJugadorPorPagina = 10;
let paginaActual = 1;
let caracteristica = [];

// Función para cargar tabla de caracteristica jugador con paginación
async function fillTable(form = null) {
    const cargarTabla = document.getElementById('tabla_caracteristica_jugador');
    try {
        cargarTabla.innerHTML = '';
        // Petición para obtener los registros disponibles.
        let action;
        form ? action = 'searchRows' : action = 'readAll';

        const DATA = await fetchData(API, action, form);
        console.log(form);
        console.log(DATA);
        if (DATA.status) {
            caracteristica = DATA.dataset;
            mostrarCaracteristicaJugador(paginaActual);
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

// Función para mostrar característica de jugador en una página específica
function mostrarCaracteristicaJugador(pagina) {
    const inicio = (pagina - 1) * caracteristicaJugadorPorPagina;
    const fin = inicio + caracteristicaJugadorPorPagina;
    const caracteristicaPagina = caracteristica.slice(inicio, fin);

    const cargarTabla = document.getElementById('tabla_caracteristica_jugador');
    cargarTabla.innerHTML = '';
    caracteristicaPagina.forEach(row => {
        const tablaHtml = `
            <tr>
                <td>${row.NOMBRE}</td>
                <td>${row.CLASIFICACION}</td>
                <td>
                    <button type="button" class="btn transparente" onclick="openUpdate(${row.ID})">
                        <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                    </button>
                    <button type="button" class="btn transparente" onclick="openDelete(${row.ID}, '${row.NOMBRE}')">
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

    const totalPaginas = Math.ceil(caracteristica.length / caracteristicaJugadorPorPagina);

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
    mostrarCaracteristicaJugador(paginaActual);
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const adminHtml = await loadComponent('../components/player_characteristics.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = adminHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Características de los jugadores';
    ROWS_FOUND = document.getElementById('rowsFound');
    fillTable();

    GRAPHIC_MODAL = new bootstrap.Modal('#graphicModal'),
    modalTitleGraphic = document.getElementById('modalTitleGraphic');
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_CARACTERISTICA = document.getElementById('idCaracteristica'),
        NOMBRECARACTERISTICA_CARACTERISTICA = document.getElementById('caracteristicaJugador'),
        CLASIFICACION_CARACTERISTICA = document.getElementById('clasificacionCaracteristica');
    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_CARACTERISTICA.value) ? action = 'updateRow' : action = 'createRow';
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
        console.log(FORM);
        // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
        fillTable(FORM);
    });
};
