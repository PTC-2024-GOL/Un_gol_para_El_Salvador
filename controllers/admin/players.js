let SAVE_MODAL;
let SAVE_FORM,
    ID_JUGADOR,
    NOMBRE_JUGADOR,
    APELLIDO_JUGADOR,
    DORSAL_JUGADOR,
    ESTATUS_JUGADOR,
    NACIMIENTO_JUGADOR,
    PERFIL_JUGADOR,
    BECADO,
    GENERO_JUGADOR,
    IMAGEN_JUGADOR,
    CLAVE_JUGADOR,
    REPETIR_CLAVE;
let SEARCH_FORM;
let IMAGEN;
let SELECT_GENER0;

// Constantes para completar las rutas de la API.
const JUGADOR_API = 'services/admin/jugadores.php';
const POSICIONES_API = 'services/admin/posiciones.php';

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
const openCreate = async () => {
    ID_JUGADOR.value = '';
    await fillSelect(POSICIONES_API, 'readAll', 'posicionPrincipal' );
    await fillSelect(POSICIONES_API, 'readAll', 'posicionSecundaria' );
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Agregar jugador';
    CLAVE_JUGADOR.disabled = false;
    REPETIR_CLAVE.disabled = false;
    // Se prepara el formulario.
    SAVE_FORM.reset();
    IMAGEN.src = '../../../resources/img/png/default.jpg';
}
/*
*   Función para abrir una nueva página.
*   Parámetros: id jugador.
*   Retorno: ninguno.
*/
const openPage = (id) => {
    // Cuando se haga clic en el botón, se redirigirá a la página de estado fisica específicas.
    window.location.href = `../pages/physical_states.html?id=${id}`;
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
            ID_JUGADOR.value = ROW.id_jugador;
            NOMBRE_JUGADOR.value = ROW.nombre_jugador;
            APELLIDO_JUGADOR.value = ROW.apellido_jugador;
            ESTATUS_JUGADOR.value = ROW.estatus_jugador;
            NACIMIENTO_JUGADOR.value = ROW.fecha_nacimiento_jugador;
            PERFIL_JUGADOR.value = ROW.perfil_jugador;
            await fillSelect(POSICIONES_API, 'readAll', 'posicionPrincipal', ROW.id_posicion_principal);
            await fillSelect(POSICIONES_API, 'readAll', 'posicionSecundaria', ROW.id_posicion_secundaria);
            DORSAL_JUGADOR.value = ROW.dorsal_jugador;
            CLAVE_JUGADOR.disabled = true;
            REPETIR_CLAVE.disabled = true;
            IMAGEN.src = SERVER_URL + 'images/jugadores/' + ROW.foto_jugador;
            GENERO_JUGADOR.value = ROW.genero_jugador;
            BECADO.value = ROW.becado;
        } else {
            await sweetAlert(2, DATA.error, false);
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

            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(JUGADOR_API, 'deleteRow', FORM);

            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se muestra un mensaje de éxito.
                await sweetAlert(1, DATA.message, true);
                SELECT_GENER0.value = 'Filtrar por género';
                // Se carga nuevamente la tabla para visualizar los cambios.
                await fillTable();
            } else {
                await sweetAlert(2, DATA.error, false);
            }
        }
    }
    catch (Error) {
        console.log(Error + ' Error al cargar el mensaje');
    }

}

// Manejo para la paginacion
const playerSoccerByPage = 10;
let currentPage = 1;
let playerSoccers = [];

function showPlayerSoccers(page) {
    const start = (page - 1) * playerSoccerByPage;
    const end = start + playerSoccerByPage;
    const playerSoccersPage = playerSoccers.slice(start, end);

    const fillTable = document.getElementById('tabla_jugadores');
    fillTable.innerHTML = '';
    playerSoccersPage.forEach(row => {
        const tablaHtml = `
                <tr>
                    <td><img src="${SERVER_URL}images/jugadores/${row.foto_jugador}" height="50" width="50" class="circulo"></td>
                    <td>${row.nombre_jugador}</td>
                    <td>${row.apellido_jugador}</td>
                    <td>${row.dorsal_jugador}</td>
                    <td>${row.posicionPrincipal}</td>
                    <td>${row.fecha_creacion}</td>
                    <td>
                <button type="button" class="btn transparente" onclick="openPage(${row.id_jugador})">
                    <img src="../../../resources/img/svg/icons_forms/heart.svg" width="18" height="18">
                    </button>
                </td>
                    <td>
                    <button type="button" class="btn transparente" onclick="openUpdate(${row.id_jugador})">
                    <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                    </button>
                    <button type="button" class="btn transparente" onclick="openDelete(${row.id_jugador})">
                    <img src="../../../resources/img/svg/icons_forms/trash 1.svg" width="18" height="18">
                    </button>
                    </td>
                </tr>
                `;
        fillTable.innerHTML += tablaHtml;
    });

    updatePaginate();
}



async function fillTable(form = null) {
    const cargarTabla = document.getElementById('tabla_jugadores');
    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(JUGADOR_API, action, form);

        if (DATA.status) {
            SELECT_GENER0.value = 'Filtrar por género';
            playerSoccers = DATA.dataset;
            showPlayerSoccers(currentPage);
        } else {
            await sweetAlert(3, DATA.error, true);
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
    }
}

// Función para actualizar los contlesiones de paginación
function updatePaginate() {
    const paginacion = document.querySelector('.pagination');
    paginacion.innerHTML = '';

    const totalPaginas = Math.ceil(playerSoccers.length / playerSoccerByPage);

    if (currentPage > 1) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-dark" href="#" onclick="nextPage(${currentPage - 1})">Anterior</a></li>`;
    }

    for (let i = 1; i <= totalPaginas; i++) {
        paginacion.innerHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link text-dark" href="#" onclick="nextPage(${i})">${i}</a></li>`;
    }

    if (currentPage < totalPaginas) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-dark" href="#" onclick="nextPage(${currentPage + 1})">Siguiente</a></li>`;
    }
}

// Función para cambiar de página
function nextPage(newPage) {
    currentPage = newPage;
    showPlayerSoccers(currentPage);
}

//Funcion que permite filtrar a los jugadores por su genero.
const FilterByGender = async () => {

    const FORM = new FormData();
    FORM.append('genero', SELECT_GENER0.value);

    const DATA = await fetchData(JUGADOR_API, 'readAllByGender', FORM);

    if(DATA.status){
        playerSoccers = DATA.dataset;
        showPlayerSoccers(currentPage);
    }else{
        console.log('Elige otra opción de filtrado')
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
        NACIMIENTO_JUGADOR = document.getElementById('fechaNacimientoJugador'),
        PERFIL_JUGADOR = document.getElementById('perfilJugador'),
        DORSAL_JUGADOR = document.getElementById('dorsal'),
        ESTATUS_JUGADOR = document.getElementById('estadoJugador'),
        BECADO = document.getElementById('beca'),
        GENERO_JUGADOR = document.getElementById('generoJugador'),
        IMAGEN_JUGADOR = document.getElementById('imagen_jugador'),
        IMAGEN = document.getElementById('imagenJugador'),
        CLAVE_JUGADOR = document.getElementById('claveJugador'),
        REPETIR_CLAVE = document.getElementById('repetirclaveJugador');

    SELECT_GENER0 = document.getElementById('selectGenero');

    // Agregamos el evento change al input de tipo file que selecciona la imagen
    IMAGEN_JUGADOR.addEventListener('change', function (event) {
        // Verifica si hay una imagen seleccionada
        if (event.target.files && event.target.files[0]) {
            // con el objeto FileReader lee de forma asincrona el archivo seleccionado
            const reader = new FileReader();
            // Luego de haber leido la imagen seleccionada se nos devuele un objeto de tipo blob
            // Con el metodo createObjectUrl de fileReader crea una url temporal para la imagen
            reader.onload = function (event) {
                // finalmente la url creada se le asigna al atributo src de la etiqueta img
                IMAGEN.src = event.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    });

    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_JUGADOR.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(JUGADOR_API, action, FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se cierra la caja de diálogo.
            SAVE_MODAL.hide();
            SELECT_GENER0.value = 'Filtrar por género';
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            await fillTable();
        } else {
            await sweetAlert(2, DATA.error, false);
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

        // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
        fillTable(FORM);
    });
};
