let SAVE_MODAL;
let SAVE_FORM,
    ID_LESION,
    ID_TIPO_LESION,
    ID_SUB_TIPOLOGIA,
    NUMERO_LESIONES,
    PROMEDIO_LESIONES;
let SEARCH_FORM;

// Constantes para completar las rutas de la API.
const LESIONES_API = '';

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
    MODAL_TITLE.textContent = 'Crear lesión';
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
        FORM.append('idLesion', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(LESIONES_API_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar lesión';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_LESION.value = ROW.ID_LESION;
            ID_TIPO_LESION.value = ROW.TIPO_LESION;
            ID_SUB_TIPOLOGIA.value = ROW.SUB_TIPOLOGIA;
            NUMERO_LESIONES.value = ROW.NUMERO_LESIONES;
            PROMEDIO_LESIONES.value = ROW.PROMEDIO_LESIONES;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar lesión';
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar la lesión?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idLesion', id);
            console.log(id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(LESIONES_API, 'deleteRow', FORM);
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
        confirmAction('¿Desea eliminar la lesión?');
    }

}


async function fillTable(form = null) {
    const lista_datos = [
        {
            tipo_lesion: 'Lesión de tren superior',
            tipologia: 'ISQUIOS',
            numero_lesiones: '10',
            promedio_lesiones: '25%',
            id: 1,
        },
        {
            tipo_lesion: 'Lesión de tren inferior',
            tipologia: 'CUÁDRICEPS',
            numero_lesiones: '10',
            promedio_lesiones: '25%',
            id: 2,
        },
        {
            tipo_lesion: 'Lesión de tren superior',
            tipologia: 'SEMIMEMBRANOSO',
            numero_lesiones: '15',
            promedio_lesiones: '25%',
            id: 3,
        },
        {
            tipo_lesion: 'Lesión de tren inferior',
            tipologia: 'SÓLEO',
            numero_lesiones: '25',
            promedio_lesiones: '25%',
            id: 4,
        }
    ];
    const cargarTabla = document.getElementById('tabla_lesiones');

    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(LESIONES_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const tablaHtml = `
                <tr>
                    <td>${row.ID_TIPO_LESION}</td>
                    <td>${row.ID_SUB_TIPOLOGIA}</td>
                    <td>${row.NUMERO_LESIONES}</td>
                    <td>${row.PROMEDIO_LESIONES}</td>
                    <td>
                    <button type="button" class="btn transparente" onclick="openUpdate(${row.ID_LESION})">
                    <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                    </button>
                    <button type="button" class="btn transparente" onclick="openDelete(${row.ID_LESION})">
                    <img src="../../../resources/img/svg/icons_forms/trash 1.svg" width="18" height="18">
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
                <td>${row.tipo_lesion}</td>
                <td>${row.tipologia}</td>
                <td>${row.numero_lesiones}</td>
                <td>${row.promedio_lesiones}</td>
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
    const adminHtml = await loadComponent('../componentes/injuries.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = adminHtml;
    fillTable();
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
};
