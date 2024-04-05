let SAVE_MODAL;
let SAVE_FORM,
    ID_CUERPOTECNICO,
    PRIMERTECNICO_CUERPOTECNICO,
    SEGUNDOTECNICO_CUERPOTECNICO,
    PREPARADORFISICO_CUERPOTECNICO,
    DELEGADO_CUERPOTECNICO;
let SEARCH_FORM;

// Constantes para completar las rutas de la API.
const CUERPOTECNICO_API = '';

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
    MODAL_TITLE.textContent = 'Crear cuerpo técnico';
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
        FORM.append('idCuerpotecnico', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(CUERPOTECNICO_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar cuerpo técnico';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_CUERPOTECNICO.value = ROW.ID;
            PRIMERTECNICO_CUERPOTECNICO.value = ROW.PRIMER;
            SEGUNDOTECNICO_CUERPOTECNICO.value = ROW.SEGUNDO;
            PREPARADORFISICO_CUERPOTECNICO.value = ROW.PREPARADOR;
            DELEGADO_CUERPOTECNICO.value = ROW.DELEGADO
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar cuerpo técnico';
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el cuerpo técnico de forma permanente?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idCuerpotecnico', id);
            console.log(id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(CUERPOTECNICO_API, 'deleteRow', FORM);
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
        confirmAction('¿Desea eliminar el cuerpo técnico de forma permanente?');
    }

}


async function cargarTabla(form = null) {
    const lista_datos = [
        {
            primer: 'Chepe Mártinez',
            segundo: 'Daniel Menjívar',
            preparador: 'Carlos Escobar',
            delegado: 'David Muñoz',
            id: 1,
        },
        {
            primer: 'Xavi Hernández',
            segundo: 'Óscar Hernández',
            preparador: 'Iván Torres',
            delegado: 'josé de la Fuente',
            id: 2,
        },
        {
            primer: 'Pep Guardiola',
            segundo: 'Carlos Vicens',
            preparador: 'Juanma Lillo',
            delegado: 'Xabier Mancisidor',
            id: 3,
        },
        {
            primer: 'Carlo Ancelotti',
            segundo: 'Davide Ancelotti',
            preparador: 'Luis Llopis',
            delegado: 'Javier Mallo',
            id: 4,
        }
    ];
    const cargarTabla = document.getElementById('tabla_cuerpo_tecnico');

    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(CUERPOTECNICO_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const tablaHtml = `
                <tr>
                    <td>${row.PRIMER}</td>
                    <td>${row.SEGUNDO}</td>
                    <td>${row.PREPARADOR}</td>
                    <td>${row.DELEGADO}</td>
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
                <td>${row.primer}</td>
                <td>${row.segundo}</td>
                <td>${row.preparador}</td>
                <td>${row.delegado}</td>
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
    const cuerpoTecnicoHtml = await loadComponent('../componentes/coaching_staff.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = cuerpoTecnicoHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Cuerpos técnicos';
    cargarTabla();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    // Constantes para establecer los elementos del formulario de guardar.
        SAVE_FORM = document.getElementById('saveForm'),
        ID_CUERPOTECNICO = document.getElementById('idCuerpotecnico'),
        PRIMERTECNICO_CUERPOTECNICO = document.getElementById('primerTecnico'),
        SEGUNDOTECNICO_CUERPOTECNICO = document.getElementById('segundoTecnico'),
        PREPARADORFISICO_CUERPOTECNICO = document.getElementById('preparadorFisico'),
        DELEGADO_CUERPOTECNICO = document.getElementById('delegadoTecnico');
    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_CUERPOTECNICO.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(CUERPOTECNICO_API, action, FORM);
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
};
