let SAVE_MODAL;
let SAVE_FORM,
    ID_PAGO,
    JUGADOR_PAGO,
    FECHA_PAGO,
    CANTIDAD_PAGO,
    PAGOTARDIO_PAGO,
    MORA_PAGO,
    MES_PAGO;
let SEARCH_FORM;
let CONTENEDOR_PAGO;
let ROWS_FOUND;
let GRAPHIC_MODAL;

// Constantes para completar las rutas de la API.
const PAGO_API = 'services/admin/pagos.php';
const JUGADOR_API = 'services/admin/jugadores.php';

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
    MODAL_TITLE.textContent = 'Crear pago';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    fillSelect(JUGADOR_API, 'readAll', 'nombreJugador');
    Selected(lista_datos, 'readAll', 'mesPago');
    SelectedPago(lista_pago, 'readAll', 'tardioPago');
    updateMoraPago();

}

const openGraphic = () => {
    // Se muestra la caja de diálogo con su título.
    GRAPHIC_MODAL.show();
    modalTitleGraphic.textContent = 'Gráfica de pagos';
    graficoBarrasLineasAnalisis();
}


const graficoBarrasLineasAnalisis = async () => {
    try {
        // Petición para obtener los datos del gráfico.
        let DATA = await fetchData(PAGO_API, 'graphic');

        // Se comprueba si la respuesta es satisfactoria.
        if (DATA.status) {
            // Se declaran los arreglos para guardar los datos a graficar.
            let mes = [];
            let numJugador = [];
            
            // Se recorre el conjunto de registros fila por fila a través del objeto row.
            DATA.dataset.forEach(row => {
                // Se agregan los datos a los arreglos.
                mes.push(row.MES);
                numJugador.push(row.NUM_JUGADOR); // Datos para las barras
            });

            // Destruir la instancia existente del gráfico si existe
            if (chartInstance) {
                chartInstance.destroy();
                chartInstance = null; // Asegúrate de restablecer la referencia
            }

            // Restablecer el canvas en caso de que sea necesario
            const canvasContainer = document.getElementById('analisis').parentElement;
            canvasContainer.innerHTML = '<canvas id="analisis"></canvas>';

            // Llamada a la función para generar y mostrar un gráfico combinado de barras apiladas y líneas
            chartInstance = lineGraph2('analisis', mes, numJugador, 'Número de jugadores ','Total de pagos mensuales');
        } else {
            console.log(DATA.error);
        }
    } catch (error) {
        console.log(error);
    }
}





const lista_pago = [
    {
        pago: "No",
        id: "0",
    },
    {
        pago: "Si",
        id: "1",
    }
]



const lista_datos = [
    {
        mes: "Enero",
        id: "Enero",
    },
    {
        mes: "Febrero",
        id: "Febrero",
    },
    {
        mes: "Marzo",
        id: "Marzo",
    },
    {
        mes: "Abril",
        id: "Abril",
    },
    {
        mes: "Mayo",
        id: "Mayo",
    },
    {
        mes: "Junio",
        id: "Junio",
    },
    {
        mes: "Julio",
        id: "Julio",
    },
    {
        mes: "Agosto",
        id: "Agosto",
    },
    {
        mes: "Septiembre",
        id: "Septiembre",
    },
    {
        mes: "Octubre",
        id: "Octubre",
    },
    {
        mes: "Noviembre",
        id: "Noviembre",
    },
    {
        mes: "Diciembre",
        id: "Diciembre",
    }
];

// Función para poblar un combobox (select) con opciones quemadas
const Selected = (data, action, selectId, selectedValue = null) => {
    const selectElement = document.getElementById(selectId);

    // Limpiar opciones previas del combobox
    selectElement.innerHTML = '';

    // Crear opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecciona el mes';
    selectElement.appendChild(defaultOption);

    // Llenar el combobox con los datos proporcionados
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id; // Suponiendo que hay una propiedad 'id' en los datos
        option.textContent = item.mes; // Cambia 'horario' al nombre de la propiedad que deseas mostrar en el combobox
        selectElement.appendChild(option);
    });

    // Seleccionar el valor especificado si se proporciona
    if (selectedValue !== null) {
        selectElement.value = selectedValue;
    }
};


// Función para poblar un combobox (select) con opciones quemadas
const SelectedPago = (data, action, selectId, selectedValue = null) => {
    const selectElement = document.getElementById(selectId);

    // Limpiar opciones previas del combobox
    selectElement.innerHTML = '';

    // Crear opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecciona si el pago es tardio';
    selectElement.appendChild(defaultOption);

    // Llenar el combobox con los datos proporcionados
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id; // Suponiendo que hay una propiedad 'id' en los datos
        option.textContent = item.pago; // Cambia 'horario' al nombre de la propiedad que deseas mostrar en el combobox
        selectElement.appendChild(option);
        console.log(option);
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
const openUpdate = async (id, nombre) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idPago', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(PAGO_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = `Actualizar el pago de ${nombre}`;
            updateMoraPago();
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_PAGO.value = ROW.ID;
            await fillSelect(JUGADOR_API, 'readAll', 'nombreJugador', ROW.ID_JUGADOR);
            FECHA_PAGO.value = ROW.FECHA;
            CANTIDAD_PAGO.value = ROW.CANTIDAD;
            SelectedPago(lista_pago, 'readAll', 'tardioPago', ROW.TARDIO);
            PAGOTARDIO_PAGO.value = ROW.TARDIO;
            MORA_PAGO.value = ROW.MORA;
            Selected(lista_datos, 'readAll', 'mesPago', ROW.MES)
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar pago';
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id, nombre) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction(`¿Desea eliminar el pago de ${nombre} de forma permanente?`);
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idPago', id);
            console.log(id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(PAGO_API, 'deleteRow', FORM);
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
const pagoPorPagina = 10;
let paginaActual = 1;
let pago = [];

// Función para cargar tabla de caracteristica jugador con paginación
async function fillTable(form = null) {
    const cargarTabla = document.getElementById('tabla_pago');
    try {
        cargarTabla.innerHTML = '';
        // Petición para obtener los registros disponibles.
        let action;
        form ? action = 'searchRows' : action = 'readAll';

        const DATA = await fetchData(PAGO_API, action, form);
        if (DATA.status) {
            pago = DATA.dataset;
            mostrarPago(paginaActual);
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
function mostrarPago(pagina) {
    const inicio = (pagina - 1) * pagoPorPagina;
    const fin = inicio + pagoPorPagina;
    const pagoPagina = pago.slice(inicio, fin);

    const cargarTabla = document.getElementById('tabla_pago');
    cargarTabla.innerHTML = '';
    pagoPagina.forEach(row => {
        const estadoColor = row.TARDIO === 'Si' ? 'green' : 'red';
        const tablaHtml = `
            <tr>
                <td>${row.NOMBRE}</td>
                <td>${row.FECHA}</td>
                <td>${row.MES}</td>
                <td>${row.CANTIDAD}</td>
                <td>
                    <button type="button" class="btn transparente"">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${estadoColor}" class="bi bi-clock-history" viewBox="0 0 16 16">
                            <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z"/>
                            <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z"/>
                            <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5"/>
                        </svg>
                    </button>
                </td>
                <td>${row.MORA}</td>
                <td>${row.TOTAL}</td>
                <td>
                    <button type="button" class="btn transparente" onclick="openUpdate(${row.ID}, '${row.NOMBRE} para ${row.MES}')">
                        <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                    </button>
                    <button type="button" class="btn transparente" onclick="openDelete(${row.ID}, '${row.NOMBRE} para ${row.MES}')">
                        <img src="../../../resources/img/svg/icons_forms/trash 1.svg" width="18" height="18">
                    </button>
                    <button type="button" class="btn transparente" onclick="openReport(${row.ID})">
                        <img src="../../../resources/img/svg/icons_forms/report-blanco.svg" width="18" height="18">
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

    const totalPaginas = Math.ceil(pago.length / pagoPorPagina);

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
    mostrarPago(paginaActual);
}


// Función para ocultar el input mora
function updateMoraPago() {
    if (PAGOTARDIO_PAGO.value == 0) {
        CONTENEDOR_PAGO.classList.add('d-none');
        MORA_PAGO.value = 0;
        console.log(MORA_PAGO.value);
    }
    else if (PAGOTARDIO_PAGO.value == 1) {
        CONTENEDOR_PAGO.classList.remove('d-none');
        MORA_PAGO.value = 1;
        console.log(MORA_PAGO.value);
    }
    else {
    }


}

/*
*   Función para abrir un reporte automático de productos por categoría.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openReport = (id) => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/admin/reporte_parametrizado_pagos.php`);
    // Se agrega un parámetro a la ruta con el valor del registro seleccionado.
    PATH.searchParams.append('idPago', id);
    // Se abre el reporte en una nueva pestaña.
    window.open(PATH.href);
}


// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const pagosHtml = await loadComponent('../components/payment.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = pagosHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Pagos';
    ROWS_FOUND = document.getElementById('rowsFound');
    fillTable();

    GRAPHIC_MODAL = new bootstrap.Modal('#graphicModal'),
    modalTitleGraphic = document.getElementById('modalTitleGraphic');

    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    CONTENEDOR_PAGO = document.getElementById('contenedorPago');
    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_PAGO = document.getElementById('idPago'),
        JUGADOR_PAGO = document.getElementById('nombreJugador'),
        FECHA_PAGO = document.getElementById('fechaPago'),
        CANTIDAD_PAGO = document.getElementById('cantidadPago'),
        PAGOTARDIO_PAGO = document.getElementById('tardioPago'),
        MORA_PAGO = document.getElementById('moraPago'),
        MES_PAGO = document.getElementById('mesPago');

    PAGOTARDIO_PAGO.addEventListener('change', updateMoraPago);
    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_PAGO.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(PAGO_API, action, FORM);
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
