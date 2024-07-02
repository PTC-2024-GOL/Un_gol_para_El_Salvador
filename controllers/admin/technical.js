let SAVE_MODAL;
let SAVE_FORM,
    ID_TECNICO,
    NOMBRE_TECNICO,
    APELLIDO_TECNICO,
    CLAVE_TECNICO,
    CORREO_TECNICO,
    TELEFONO_TECNICO,
    DUI_TECNICO,
    NACIMIENTO_TECNICO,
    IMAGEN_TECNICO,
    FOTO_TECNICO,
    REPETIR_CLAVE;
let SEARCH_FORM;
let ROWS_FOUND;

// Constantes para completar las rutas de la API.
const API = 'services/admin/tecnicos.php';

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
    MODAL_TITLE.textContent = 'Crear técnico';
    CLAVE_TECNICO.disabled = false;
    REPETIR_CLAVE.disabled = false;
    // Se prepara el formulario.
    SAVE_FORM.reset();
    FOTO_ADMINISTRADOR.src = "../../../resources/img/png/default.jpg";
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
        FORM.append('idTecnico', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar un técnico';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_TECNICO.value = ROW.ID;
            NOMBRE_TECNICO.value = ROW.NOMBRE;
            APELLIDO_TECNICO.value = ROW.APELLIDO;
            CORREO_TECNICO.value = ROW.CORREO;
            TELEFONO_TECNICO.value = ROW.TELÉFONO;
            DUI_TECNICO.value = ROW.DUI;
            NACIMIENTO_TECNICO.value = ROW.NACIMIENTO;
            FOTO_ADMINISTRADOR.src = SERVER_URL.concat('images/tecnicos/', ROW.IMAGEN);
            CLAVE_TECNICO.disabled = true;
            REPETIR_CLAVE.disabled = true;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar un técnico';
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar al técnico?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idTecnico', id);
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
*   Función asíncrona para cambiar el estado de un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openState = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmUpdateAction('¿Desea cambiar el estado del técnico?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idTecnico', id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(API, 'changeState', FORM);
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
const tecnicosPorPagina = 10;
let paginaActual = 1;
let tecnicos = [];

// Función para cargar tabla de técnicos con paginación
async function fillTable(form = null) {
    const cargarTabla = document.getElementById('tabla_tecnicos');
    try {
        cargarTabla.innerHTML = '';
        // Petición para obtener los registros disponibles.
        let action;
        form ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        const DATA = await fetchData(API, action, form);
        console.log(DATA);

        if (DATA.status) {
            tecnicos = DATA.dataset;
            mostrarTecnicos(paginaActual);
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
function mostrarTecnicos(pagina) {
    const inicio = (pagina - 1) * tecnicosPorPagina;
    const fin = inicio + tecnicosPorPagina;
    const tecnicosPagina = tecnicos.slice(inicio, fin);

    const cargarTabla = document.getElementById('tabla_tecnicos');
    cargarTabla.innerHTML = '';
    tecnicosPagina.forEach(row => {
        const estadoColor = row.ESTADO === 'Activo' ? 'green' : 'red';
        const tablaHtml = `
            <tr class="${getRowBackgroundColor(row.ESTADO)}">
                <td><img src="${SERVER_URL}images/tecnicos/${row.IMAGEN}" height="50" width="50" class="circulo"></td>
                <td>${row.NOMBRE}</td>
                <td>${row.CORREO}</td>
                <td>${row.TELÉFONO}</td>
                <td>${row.DUI}</td>
                <td>${row.ALIAS}</td>
                <td class="${getRowColor(row.ESTADO)}">${row.ESTADO}</td>
                <td>
                    <button type="button" class="btn transparente" onclick="openState(${row.ID})">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="${estadoColor}" xmlns="http://www.w3.org/2000/svg">
                             <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2v-6zm0 8h2v2h-2v-2z" stroke="currentColor" stroke-width="0.15"/>
                        </svg>
                    </button>
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

    const totalPaginas = Math.ceil(tecnicos.length / tecnicosPorPagina);

    if (paginaActual > 1) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-light"" href="#" onclick="cambiarPagina(${paginaActual - 1})">Anterior</a></li>`;
    }

    for (let i = 1; i <= totalPaginas; i++) {
        paginacion.innerHTML += `<li class="page-item ${i === paginaActual ? 'active' : ''}"><a class="page-link text-light"" href="#" onclick="cambiarPagina(${i})">${i}</a></li>`;
    }

    if (paginaActual < totalPaginas) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-light"" href="#" onclick="cambiarPagina(${paginaActual + 1})">Siguiente</a></li>`;
    }
}

// Función para cambiar de página
function cambiarPagina(nuevaPagina) {
    paginaActual = nuevaPagina;
    mostrarTecnicos(paginaActual);
}

function getRowColor(estado) {
    switch (estado) {
        case 'Bloqueado':
            return 'text-danger';
        case 'Activo':
            return 'text-success';
        default:
            return '';
    }
}

function getRowBackgroundColor(estado) {
    switch (estado) {
        case 'Bloqueado':
            return 'border-danger';
        case 'Activo':
            return 'border-success';
        default:
            return '';
    }
}


// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const adminHtml = await loadComponent('../components/technical.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = adminHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Técnicos';
    ROWS_FOUND = document.getElementById('rowsFound');
    fillTable();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_TECNICO = document.getElementById('idTecnico'),
        NOMBRE_TECNICO = document.getElementById('nombreTecnico'),
        APELLIDO_TECNICO = document.getElementById('apellidoTecnico'),
        CORREO_TECNICO = document.getElementById('correoTecnico'),
        TELEFONO_TECNICO = document.getElementById('telefonoTecnico'),
        DUI_TECNICO = document.getElementById('duiTecnico'),
        NACIMIENTO_TECNICO = document.getElementById('nacimientoTecnico'),
        CLAVE_TECNICO = document.getElementById('claveTecnico'),
        REPETIR_CLAVE = document.getElementById('repetirclaveTecnico'),
        FOTO_ADMINISTRADOR = document.getElementById('img_admin'),
        IMAGEN_TECNICO = document.getElementById('imagenTecnico');
    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_TECNICO.value) ? action = 'updateRow' : action = 'createRow';
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
    // Llamada a la función para establecer la mascara del campo teléfono.
    vanillaTextMask.maskInput({
        inputElement: document.getElementById('telefonoTecnico'),
        mask: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    });
    // Llamada a la función para establecer la mascara del campo DUI.
    vanillaTextMask.maskInput({
        inputElement: document.getElementById('duiTecnico'),
        mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/]
    });

    IMAGEN_TECNICO.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                FOTO_ADMINISTRADOR.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });
};
