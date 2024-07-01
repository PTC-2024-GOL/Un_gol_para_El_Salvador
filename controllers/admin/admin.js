let SAVE_MODAL;
let SAVE_FORM,
    ID_ADMINISTRADOR,
    NOMBRE_ADMINISTRADOR,
    APELLIDO_ADMINISTRADOR,
    CLAVE_ADMINISTRADOR,
    CORREO_ADMINISTRADOR,
    TELEFONO_ADMINISTRADOR,
    DUI_ADMINISTRADOR,
    NACIMIENTO_ADMINISTRADOR,
    IMAGEN_ADMINISTRADOR,
    FOTO_ADMINISTRADOR,
    REPETIR_CLAVE;
let SEARCH_FORM;
let ROWS_FOUND;

// Constantes para completar las rutas de la API.
const ADMINISTRADOR_API = 'services/admin/administradores.php';

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
    MODAL_TITLE.textContent = 'Crear administrador';
    CLAVE_ADMINISTRADOR.disabled = false;
    REPETIR_CLAVE.disabled = false;
    // Se prepara el formulario.
    SAVE_FORM.reset();
    FOTO_ADMINISTRADOR.src = "../../../resources/img/svg/avatar.svg";
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
        FORM.append('idAdministrador', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(ADMINISTRADOR_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar administrador';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_ADMINISTRADOR.value = ROW.ID;
            NOMBRE_ADMINISTRADOR.value = ROW.NOMBRE;
            APELLIDO_ADMINISTRADOR.value = ROW.APELLIDO;
            CORREO_ADMINISTRADOR.value = ROW.CORREO;
            TELEFONO_ADMINISTRADOR.value = ROW.TELÉFONO;
            DUI_ADMINISTRADOR.value = ROW.DUI;
            NACIMIENTO_ADMINISTRADOR.value = ROW.NACIMIENTO;
            FOTO_ADMINISTRADOR.src = SERVER_URL.concat('images/administradores/', ROW.IMAGEN);
            CLAVE_ADMINISTRADOR.disabled = true;
            REPETIR_CLAVE.disabled = true;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar administrador';
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el administrador de forma permanente?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idAdministrador', id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(ADMINISTRADOR_API, 'deleteRow', FORM);
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
        confirmAction('¿Desea eliminar el administrador de forma permanente?');
    }

}


/*
*   Función asíncrona para cambiar el estado de un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openState = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmUpdateAction('¿Desea cambiar el estado del administrador?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idAdministrador', id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(ADMINISTRADOR_API, 'changeState', FORM);
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
const administradoresPorPagina = 10;
let paginaActual = 1;
let administradores = [];

// Función para cargar tabla de administradores con paginación
async function fillTable(form = null) {
    const cargarTabla = document.getElementById('tabla_administradores');
    try {
        cargarTabla.innerHTML = '';
        // Petición para obtener los registros disponibles.
        let action;
        form ? action = 'searchRows' : action = 'readAll';
        const DATA = await fetchData(ADMINISTRADOR_API, action, form);

        if (DATA.status) {
            administradores = DATA.dataset;
            mostrarAdministradores(paginaActual);
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
        console.error('Error al obtener datos de la API:', error);
    }
}

// Función para mostrar administradores en una página específica
function mostrarAdministradores(pagina) {
    const inicio = (pagina - 1) * administradoresPorPagina;
    const fin = inicio + administradoresPorPagina;
    const administradoresPagina = administradores.slice(inicio, fin);

    const cargarTabla = document.getElementById('tabla_administradores');
    cargarTabla.innerHTML = '';
    administradoresPagina.forEach(row => {
        const estadoColor = row.ESTADO === 'Activo' ? 'green' : 'red';
        const tablaHtml = `
            <tr class="${getRowBackgroundColor(row.ESTADO)}">
                <td><img src="${SERVER_URL}images/administradores/${row.IMAGEN}" height="50" width="50" class="circulo"></td>
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

    const totalPaginas = Math.ceil(administradores.length / administradoresPorPagina);

    if (paginaActual > 1) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-dark" href="#" onclick="cambiarPagina(${paginaActual - 1})">Anterior</a></li>`;
    }

    for (let i = 1; i <= totalPaginas; i++) {
        paginacion.innerHTML += `<li class="page-item ${i === paginaActual ? 'active' : ''}"><a class="page-link text-light" href="#" onclick="cambiarPagina(${i})">${i}</a></li>`;
    }

    if (paginaActual < totalPaginas) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-dark" href="#" onclick="cambiarPagina(${paginaActual + 1})">Siguiente</a></li>`;
    }
}

// Función para cambiar de página
function cambiarPagina(nuevaPagina) {
    paginaActual = nuevaPagina;
    mostrarAdministradores(paginaActual);
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
    const adminHtml = await loadComponent('../components/admin.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = adminHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Administradores';
    fillTable();
    ROWS_FOUND = document.getElementById('rowsFound');
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_ADMINISTRADOR = document.getElementById('idAdministrador'),
        NOMBRE_ADMINISTRADOR = document.getElementById('nombreAdministrador'),
        APELLIDO_ADMINISTRADOR = document.getElementById('apellidoAdministrador'),
        CORREO_ADMINISTRADOR = document.getElementById('correoAdministrador'),
        TELEFONO_ADMINISTRADOR = document.getElementById('telefonoAdministrador'),
        DUI_ADMINISTRADOR = document.getElementById('duiAdministrador'),
        NACIMIENTO_ADMINISTRADOR = document.getElementById('nacimientoAdministrador'),
        CLAVE_ADMINISTRADOR = document.getElementById('claveAdministrador'),
        REPETIR_CLAVE = document.getElementById('repetirclaveAdministrador'),
        FOTO_ADMINISTRADOR = document.getElementById('img_admin'),
        IMAGEN_ADMINISTRADOR = document.getElementById('imagenAdministrador');
    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_ADMINISTRADOR.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(ADMINISTRADOR_API, action, FORM);
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
    // Llamada a la función para establecer la mascara del campo teléfono.
    vanillaTextMask.maskInput({
        inputElement: document.getElementById('telefonoAdministrador'),
        mask: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    });
    // Llamada a la función para establecer la mascara del campo DUI.
    vanillaTextMask.maskInput({
        inputElement: document.getElementById('duiAdministrador'),
        mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/]
    });

    IMAGEN_ADMINISTRADOR.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                FOTO_ADMINISTRADOR.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    })
};
