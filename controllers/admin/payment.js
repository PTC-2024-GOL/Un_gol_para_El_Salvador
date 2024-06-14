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
let ROWS_FOUND;

// Constantes para completar las rutas de la API.
const PAGO_API = 'services/admin/pagos.php';
const JUGADOR_API = '';

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
    MODAL_TITLE.textContent = 'Crear pago';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    fillSelect(JUGADOR_API, 'readAll', 'nombreJugador');
    Selected(lista_datos, 'readAll', 'mesPago');
    
}

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

/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdate = async (id) => {
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
            MODAL_TITLE.textContent = 'Actualizar pago';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_PAGO.value = ROW.ID;
            fillSelect(JUGADOR_API, 'readAll', 'nombreJugador', ROW.NOMBRE);
            FECHA_PAGO.value = ROW.FECHAPAGO;
            CANTIDAD_PAGO.value = ROW.CANTIDAD;
            PAGOTARDIO_PAGO.value = ROW.PAGOTARDIO;
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
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el pago de forma permanente?');
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
            const tablaHtml = `
                <tr class="border-danger">
                    <td class="text-danger">${DATA.error}</td>
                </tr>
            `;
            cargarTabla.innerHTML += tablaHtml;
            ROWS_FOUND.textContent = "Existen 0 coincidencias";
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
        const tablaHtml = `
            <tr>
                <td>${row.NOMBRE}</td>
                <td>${row.FECHA}</td>
                <td>${row.CANTIDAD}</td>
                <td>${row.TARDIO}</td>
                <td>${row.MORA}</td>
                <td>${row.MES}</td>
                <td>
                    <button type="button" class="btn transparente" onclick="openUpdate(${row.ID})">
                        <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                    </button>
                    <button type="button" class="btn transparente" onclick="openDelete(${row.ID})">
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

    const totalPaginas = Math.ceil(pago.length / pagoPorPagina);

    if (paginaActual > 1) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-dark" href="#" onclick="cambiarPagina(${paginaActual - 1})">Anterior</a></li>`;
    }

    for (let i = 1; i <= totalPaginas; i++) {
        paginacion.innerHTML += `<li class="page-item ${i === paginaActual ? 'active' : ''}"><a class="page-link text-dark" href="#" onclick="cambiarPagina(${i})">${i}</a></li>`;
    }

    if (paginaActual < totalPaginas) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-dark" href="#" onclick="cambiarPagina(${paginaActual + 1})">Siguiente</a></li>`;
    }
}

// Función para cambiar de página
function cambiarPagina(nuevaPagina) {
    paginaActual = nuevaPagina;
    mostrarPago(paginaActual);
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
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    // Constantes para establecer los elementos del formulario de guardar.
        SAVE_FORM = document.getElementById('saveForm'),
        ID_PAGO = document.getElementById('idPago'),
        JUGADOR_PAGO = document.getElementById('nombreJugador'),
        FECHA_PAGO = document.getElementById('fechaPago'),
        CANTIDAD_PAGO = document.getElementById('cantidadPago'),
        PAGOTARDIO_PAGO = document.getElementById('tardioPago'),
        MORA_PAGO = document.getElementById('moraPago'),
        MES_PAGO = document.getElementById('mesPago');
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
