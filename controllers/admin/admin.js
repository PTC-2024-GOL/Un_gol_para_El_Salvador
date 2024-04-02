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
    REPETIR_CLAVE;
let SEARCH_FORM;

// Constantes para completar las rutas de la API.
const ADMINISTRADOR_API = '';

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
            CLAVE_ADMINISTRADOR.value = ROW.CLAVE;
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
    const RESPONSE = await confirmAction('¿Desea eliminar el administrador?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idAdministrador', id);
            console.log(id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(ADMINISTRADOR_API, 'deleteRow', FORM);
            console.log(DATA.status);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se muestra un mensaje de éxito.
                await sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                cargarTabla();
            } else {
                sweetAlert(2, DATA.error, false);
            }
        }
    }
    catch (Error) {
        console.log(Error + ' Error al cargar el mensaje');
        confirmAction('¿Desea eliminar el administrador?');
    }

}


async function cargarTabla(form = null) {
    const lista_datos = [
        {
            imagen: '../../../../resources/img/svg/avatar.svg',
            nombre: 'José Martínez',
            correo: 'jose@gmail.com',
            telefono: '1234-5678',
            dui: '12345678-9',
            fecha: '1994-02-09',
            id: 1,
        },
        {
            imagen: '../../../../resources/img/svg/avatar.svg',
            nombre: 'José Martínez',
            correo: 'jose@gmail.com',
            telefono: '1234-5678',
            dui: '12345678-9',
            fecha: '1994-02-09',
            id: 2,
        },
        {
            imagen: '../../../../resources/img/svg/avatar.svg',
            nombre: 'José Martínez',
            correo: 'jose@gmail.com',
            telefono: '1234-5678',
            dui: '12345678-9',
            fecha: '1994-02-09',
            id: 3,
        },
        {
            imagen: '../../../../resources/img/svg/avatar.svg',
            nombre: 'José Martínez',
            correo: 'jose@gmail.com',
            telefono: '1234-5678',
            dui: '12345678-9',
            fecha: '1994-02-09',
            id: 4,
        }
    ];
    const cargarTabla = document.getElementById('tabla_administradores');

    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(ADMINISTRADOR_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const tablaHtml = `
                <tr>
                    <td><img src="${SERVER_URL}images/admin/${row.IMAGEN}" height="50" width="50" class="circulo"></td>
                    <td>${row.NOMBRE}</td>
                    <td>${row.CORREO}</td>
                    <td>${row.TELÉFONO}</td>
                    <td>${row.DUI}</td>
                    <td>${row.NACIMIENTO}</td>
                    <td>
                        <button type="button" class="btn btn-outline-success" onclick="openUpdate(${row.ID})">
                        <img src="../../recursos/img/svg/icons_forms/pen 1.svg" width="30" height="30">
                        </button>
                        <button type="button" class="btn btn-outline-danger" onclick="openDelete(${row.ID})">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>
                `;
                cargarTabla.innerHTML += tablaHtml;
            });
        } else {
            sweetAlert(4, DATA.error, true);
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        // Mostrar materiales de respaldo
        lista_datos.forEach(row => {
            const tablaHtml = `
            <tr>
                <td><img src="${row.imagen}" height="50" width="50" class="circulo"></td>
                <td>${row.nombre}</td>
                <td>${row.correo}</td>
                <td>${row.telefono}</td>
                <td>${row.dui}</td>
                <td>${row.fecha}</td>
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

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los componentes de manera síncrona
    const adminHtml = await loadComponent('../componentes/admin.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = adminHtml;
    cargarTabla();
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
        ROL_ADMINISTRADOR = document.getElementById('rolAdministrador'),
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
            cargarTabla();
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
        cargarTabla(FORM);
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
};
