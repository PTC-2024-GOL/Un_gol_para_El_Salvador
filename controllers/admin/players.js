let SAVE_MODAL;
let SAVE_FORM,
    ID_JUGADOR,
    NOMBRE_JUGADOR,
    APELLIDO_JUGADOR,
    DORSAL_JUGADOR,
    ESTATUS_JUGADOR,
    NACIMIENTO_JUGADOR,
    PERFIL_JUGADOR,
    ID_POSICION_PRINCIPAL,
    ID_POSICION_SECUNDARIA,
    ALTURA_JUGADOR,
    PESO_JUGADOR,
    MASA_CORPORAL,
    ALIAS_JUGADOR,
    CLAVE_JUGADOR,
    IMAGEN_JUGADOR,
    REPETIR_CLAVE;
let SEARCH_FORM;

// Constantes para completar las rutas de la API.
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
    MODAL_TITLE.textContent = 'Agregar jugador';
    // Se prepara el formulario.
    SAVE_FORM.reset();
}
/*
*   Función para abrir una nueva página.
*   Parámetros: id jugador.
*   Retorno: ninguno.
*/
const openPage = (id) => {
    // Cuando se haga clic en el botón, se redirigirá a la página de estado fisica específicas.
    console.log(id);
    window.location.href = '../pages/physical_states.html';
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
        FORM.append('idJugador', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(JUGADOR_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar jugador';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_JUGADOR.value = ROW.ID;
            NOMBRE_JUGADOR.value = ROW.NOMBRE;
            APELLIDO_JUGADOR.value = ROW.APELLIDO;
            ESTATUS_JUGADOR.value = ROW.ESTATUS;
            NACIMIENTO_JUGADOR.value = ROW.NACIMIENTO;
            PERFIL_JUGADOR.value = ROW.PERFIL;
            ID_POSICION_PRINCIPAL.value = ROW.POSICION_PRINCIPAL;
            ID_POSICION_SECUNDARIA.value = ROW.ID_POSICION_PRINCIPAL;
            ALTURA_JUGADOR.value = ROW.ALTURA;
            PESO_JUGADOR.value = ROW.PESO;
            MASA_CORPORAL.value = ROW.MASA_CORPORAL;
            ALIAS_JUGADOR.value = ROW.ALIAS;
            DORSAL_JUGADOR.value = ROW.DORSAL;
            CLAVE_JUGADOR.value = ROW.CLAVE;
            IMAGEN_JUGADOR.value = ROW.IMAGEN;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar jugador';
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar al jugador?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idJugador', id);
            console.log(id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(JUGADOR_API, 'deleteRow', FORM);
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
        confirmAction('¿Desea eliminar al jugador?');
    }

}


async function fillTable(form = null) {
    const lista_datos = [
        {
            imagen: '../../../../resources/img/svg/avatar.svg',
            nombre: 'Angel',
            apellido: 'Presidente',
            dorsal: '14',
            posicion_principal: 'Delantero',
            fecha: '2000-02-09',
            id: 1,
        },
        {
            imagen: '../../../../resources/img/svg/avatar.svg',
            nombre: 'Angel',
            apellido: 'Presidente',
            dorsal: '14',
            posicion_principal: 'Delantero',
            fecha: '2000-02-09',
            id: 1,
        },
        {
            imagen: '../../../../resources/img/svg/avatar.svg',
            nombre: 'Angel',
            apellido: 'Presidente',
            dorsal: '14',
            posicion_principal: 'Delantero',
            fecha: '2000-02-09',
            id: 1,
        },
        {
            imagen: '../../../../resources/img/svg/avatar.svg',
            nombre: 'Angel',
            apellido: 'Presidente',
            dorsal: '14',
            posicion_principal: 'Delantero',
            fecha: '2000-02-09',
            id: 1,
        }
    ];
    const cargarTabla = document.getElementById('tabla_jugadores');

    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(JUGADOR_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const tablaHtml = `
                <tr>
                    <td><img src="${SERVER_URL}images/admin/${row.IMAGEN}" height="50" width="50" class="circulo"></td>
                    <td>${row.NOMBRE}</td>
                    <td>${row.APELLIDO}</td>
                    <td>${row.DORSAL}</td>
                    <td>${row.POSICION_PRINCIPAL}</td>
                    <td>${row.NACIMIENTO}</td>
                    <td>
                <button type="button" class="btn transparente" onclick="openPage(${row.ID})">
                    <img src="../../../resources/img/svg/icons_forms/heart.svg" width="18" height="18">
                    </button>
                </td>
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
                <td>${row.apellido}</td>
                <td>${row.dorsal}</td>
                <td>${row.posicion_principal}</td>
                <td>${row.fecha}</td>
                <td>
                <button type="button" class="btn transparente" onclick="openPage(${row.id})">
                    <img src="../../../resources/img/svg/icons_forms/heart.svg" width="18" height="18">
                    </button>
                </td>
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
    // Carga los components de manera síncrona
    const playersHtml = await loadComponent('../components/players.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = playersHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Jugadores';
    fillTable();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_JUGADOR = document.getElementById('idJugador'),
        NOMBRE_JUGADOR = document.getElementById('nombreJugador'),
        APELLIDO_JUGADOR = document.getElementById('apellidoJugador'),
        ALIAS_JUGADOR = document.getElementById('aliasJugador'),
        NACIMIENTO_JUGADOR = document.getElementById('fechaNacimientoJugador'),
        PERFIL_JUGADOR = document.getElementById('perfilJugador'),
        ID_POSICION_PRINCIPAL = document.getElementById('posicionPrincipal'),
        ID_POSICION_SECUNDARIA = document.getElementById('posicionSecundaria'),
        ALTURA_JUGADOR = document.getElementById('alturaJugador'),
        PESO_JUGADOR = document.getElementById('pesoJugador');
    MASA_CORPORAL = document.getElementById('masaCorporal');
    DORSAL_JUGADOR = document.getElementById('dorsal');
    ESTATUS_JUGADOR = document.getElementById('estadoJugador');
    CLAVE_JUGADOR = document.getElementById('claveJugador');
    REPETIR_CLAVE = document.getElementById('repetirclaveJugador');
    IMAGEN_JUGADOR = document.getElementById('imagenAdministrador');

    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_ADMINISTRADOR.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(JUGADOR_API, action, FORM);
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
