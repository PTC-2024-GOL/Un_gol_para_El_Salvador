let SAVE_MODAL;
let SAVE_FORM,
    ID_POSICION,
    NOMBRE_POSICION,
    AREA_DE_JUEGO;
let SEARCH_FORM;
let ROWS_FOUND;
let GRAPHIC_MODAL,
    MODAL_TITLE2;

// Constantes para completar las rutas de la API.
const API = 'services/admin/posiciones.php';

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
    MODAL_TITLE.textContent = 'Agregar tipo de posición';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    fillSelected(lista_select, 'readAll', 'areaJuego');
}

/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/

const lista_select = [
    {
        area: "Ofensiva",
        id: 1,
    },
    {
        area: "Defensiva",
        id: 2,
    },
    {
        area: "Ofensiva y defensiva",
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
    defaultOption.textContent = 'Selecciona el área de juego';
    selectElement.appendChild(defaultOption);

    // Llenar el combobox con los datos proporcionados
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.area; // Suponiendo que hay una propiedad 'id' en los datos
        option.textContent = item.area; // Cambia 'horario' al nombre de la propiedad que deseas mostrar en el combobox
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
        FORM.append('idPosicion', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar tipo de posición';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_POSICION.value = ROW.id_posicion;
            NOMBRE_POSICION.value = ROW.posicion;
            fillSelected(lista_select, 'readAll', 'areaJuego', ROW.area_de_juego);
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar tipo de posición';
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar la posición?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idPosicion', id);
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
const posicionesPorPagina = 10;
let paginaActual = 1;
let posiciones = [];


// Función para cargar tabla de técnicos con paginación
async function fillTable(form = null) {
    const cargarTabla = document.getElementById('tabla_posiciones');
    try {
        cargarTabla.innerHTML = '';
        // Petición para obtener los registros disponibles.
        let action;
        form ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        const DATA = await fetchData(API, action, form);
        console.log(DATA);

        if (DATA.status) {
            posiciones = DATA.dataset;
            mostrarPosiciones(paginaActual);
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = DATA.message;
        } else {
            // Se muestra un mensaje de acuerdo con el resultado.
            ROWS_FOUND.textContent = "Existen 0 coincidencias";
            await sweetAlert(3, DATA.error, true);
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
    }
}

/*
*   Función para abrir la gráfica al momento.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openGraphic = (id) => {
    // Se muestra la caja de diálogo con su título.
    GRAPHIC_MODAL.show();
    MODAL_TITLE2.textContent = 'Gráfica de jugadores por posición';
    const FORM = new FormData();
    FORM.append('idPosicion', id);
    graficoBarrasAnalisis(FORM);
}

/*
*   Función asíncrona para mostrar un gráfico de barras con la cantidad de jugadores por posición.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const graficoBarrasAnalisis = async (FORM) => {
    try {
        // Petición para obtener los datos del gráfico.
        let DATA = await fetchData(API, 'graphic', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
        if (DATA.status) {
            // Se declaran los arreglos para guardar los datos a graficar.
            let posicion = [];
            let total = [];
            // Se recorre el conjunto de registros fila por fila a través del objeto row.
            DATA.dataset.forEach(row => {
                // Se agregan los datos a los arreglos.
                posicion.push(row.POSICION);
                total.push(row.TOTAL);
            });

            // Destruir la instancia existente del gráfico si existe
            if (chartInstance) {
                chartInstance.destroy();
                chartInstance = null; // Asegúrate de restablecer la referencia
            }

            // Restablecer el canvas en caso de que sea necesario
            const canvasContainer = document.getElementById('posicion').parentElement;
            canvasContainer.innerHTML = '<canvas id="posicion"></canvas>';

            // Llamada a la función para generar y mostrar un gráfico de barras. Se encuentra en el archivo components.js
            chartInstance = barGraph('posicion', posicion, total, 'Análisis de jugadores por posición');
        } else {
            console.log(DATA.error);
        }
    } catch (error) {
        console.log(error);
    }
}

// Función para mostrar técnicos en una página específica
function mostrarPosiciones(pagina) {
    const inicio = (pagina - 1) * posicionesPorPagina;
    const fin = inicio + posicionesPorPagina;
    const posicionesPagina = posiciones.slice(inicio, fin);

    const cargarTabla = document.getElementById('tabla_posiciones');
    cargarTabla.innerHTML = '';
    posicionesPagina.forEach(row => {
        const tablaHtml = `
                <tr>
                    <td>${row.posicion}</td>
                    <td>${row.area_de_juego}</td>
                    <td>
                    <button type="button" class="btn transparente" onclick="openUpdate(${row.id_posicion})">
                    <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                    </button>
                    <button type="button" class="btn transparente" onclick="openDelete(${row.id_posicion})">
                    <img src="../../../resources/img/svg/icons_forms/trash 1.svg" width="18" height="18">
                    </button>
                    <button type="button" class="btn transparente" onclick="openGraphic(${row.id_posicion})">
                    <img src="../../../resources/img/svg/icons_forms/graphicLine.svg" width="18" height="18">
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

    const totalPaginas = Math.ceil(posiciones.length / posicionesPorPagina);

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
    mostrarPosiciones(paginaActual);
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const posicionHtml = await loadComponent('../components/positions.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = posicionHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Posiciones';
    ROWS_FOUND = document.getElementById('rowsFound');
    fillTable();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');
    GRAPHIC_MODAL = new bootstrap.Modal('#graphicModal'),
        MODAL_TITLE2 = document.getElementById('modalTitle3');
    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_POSICION = document.getElementById('idPosicion'),
        NOMBRE_POSICION = document.getElementById('nombrePosicion'),
        AREA_DE_JUEGO = document.getElementById('areaJuego');
    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_POSICION.value) ? action = 'updateRow' : action = 'createRow';
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
