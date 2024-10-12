let SEE_MEDICAL,
    MODAL_TITLE_MEDICAL;

let SAVE_MODAL;
let SAVE_FORM,
    ID_JUGADOR,
    NOMBRE_JUGADOR,
    APELLIDO_JUGADOR,
    DORSAL_JUGADOR,
    NACIMIENTO_JUGADOR,
    PERFIL_JUGADOR,
    ALIAS,
    ESTATUS_JUGADOR,
    BECADO,
    GENERO_JUGADOR,
    IMAGEN_JUGADOR,
    TELEFONO_JUGADOR,
    TELEFONO_EMERGENCIA_JUGADOR,
    CORREO_JUGADOR,
    TIPO_SANGRE,
    OBSERVACION_MEDICA;
let SEARCH_FORM;
let IMAGEN;
let SELECT_GENER0;

let BOX_ALIAS;

// Constantes para completar las rutas de la API.
const JUGADOR_API = 'services/technics/jugadores.php';
const POSICIONES_API = 'services/technics/posiciones.php';
const ESTADO_API = 'services/technics/estado_fisico_jugador.php';
const TEST_API = 'services/technics/test_fisico_jugador.php';

async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

const seeModal = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idJugador', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(JUGADOR_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            SEE_MODAL.show();
            MODAL_TITLE.textContent = 'Información del jugador';
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_JUGADOR.value = ROW.ID;
            NOMBRE_JUGADOR.value = ROW.nombre_jugador;
            APELLIDO_JUGADOR.value = ROW.apellido_jugador;
            ESTATUS_JUGADOR.value = ROW.estatus_jugador;
            NACIMIENTO_JUGADOR.value = ROW.fecha_nacimiento_jugador;
            PERFIL_JUGADOR.value = ROW.perfil_jugador;
            await fillSelect(POSICIONES_API, 'readAll', 'posicionPrincipal', ROW.id_posicion_principal);
            await fillSelect(POSICIONES_API, 'readAll', 'posicionSecundaria', ROW.id_posicion_secundaria);
            DORSAL_JUGADOR.value = ROW.dorsal_jugador;
            ALIAS.value = ROW.alias_jugador;
            ESTATUS_JUGADOR.value = ROW.estatus_jugador;
            IMAGEN.src = SERVER_URL + 'images/jugadores/' + ROW.foto_jugador;
            GENERO_JUGADOR.value = ROW.genero_jugador;
            BECADO.value = ROW.becado;
            TELEFONO_JUGADOR.value = ROW.telefono;
            TELEFONO_EMERGENCIA_JUGADOR.value = ROW.telefono_de_emergencia;
            OBSERVACION_MEDICA.value = ROW.observacion_medica;
            TIPO_SANGRE.value = ROW.tipo_sangre;
            CORREO_JUGADOR.value = ROW.correo_jugador;
        } else {
            await sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SEE_MODAL.show();
        MODAL_TITLE.textContent = 'Información del jugador';
    }
}

const zona1func = async () => {
    ZONA1.classList.add('active');
    ZONA2.classList.remove('active');
    await estadofisico(idJugador);
}


const zona2func = async () => {
    ZONA1.classList.remove('active');
    ZONA2.classList.add('active');
    await rendimientoFisico(idJugador);
}

const estadofisico = async (id) => {
    const contenedorOne = document.getElementById('contenedor_estados');
    contenedorOne.innerHTML = `<div class="ps-5 pe-5 mt-3">
                    <div class="p-3 mb-0">
                        <div class="row justify-content-center align-items-center bg-blue-light-color">
                            <div class="col-md-3">
                                <p class="mt-3 fw-semibold">Altura(cm)</p>
                            </div>
                            <div class="col-md-3">
                                <p class="mt-3 fw-semibold">Peso(lbs)</p>
                            </div>
                            <div class="col-md-3">
                                <p class="mt-3 fw-semibold">IMC</p>
                            </div>
                            <div class="col-md-3">
                                <p class="mt-3 fw-semibold">Fecha de registro</p>
                            </div>
                        </div>
                    </div>

                    <!--Insertamos la tabla con los registro del estado fisico del jugador-->
                    <div class="pt-3 pe-3 ps-3" id="tableEstadoFisico">

                    </div>
                    <div class="text-center d-none mb-4" id="noData">
                        <p>Aún no hay registros para este jugador</p>
                    </div>
                    <div class="modal-footer col-sm-12 col-md-12 col-lg-12 d-flex justify-content-center">
                        <button type="submit" class="btn bg-blue-principal-color text-white"
                            onclick="goToPage()">Agregar estado físico</button>
                    </div>
                </div>`;
    try {
        const cargarTabla = document.getElementById('tableEstadoFisico');
        const noDataDiv = document.getElementById('noData');
        const FORM = new FormData();
        FORM.append('idJugador', id)

        const DATA = await fetchData(ESTADO_API, 'readAll', FORM);
        if (DATA.status) {
            DATA.dataset.forEach(row => {
                const tablaHtml = `
                            <div class="row justify-content-center align-items-center">
                                <div class="col-md-3">
                                    <p>${row.altura_jugador} ctm</p>
                                </div>
                                <div class="col-md-3">
                                    <p>${row.peso_jugador} lbs</p>
                                </div>
                                <div class="col-md-3">
                                    <p>${row.indice_masa_corporal}</p>
                                </div>
                                <div class="col-md-3">
                                   <p>${row.fecha_creacion_format}</p>
                                </div>   
                            </div>
                            <hr>
                        `;
                cargarTabla.innerHTML += tablaHtml;
            })
        } else {
            noDataDiv.classList.remove('d-none');
        }
    } catch (error) {
        console.log('Error al obtener datos de la API')
    }
}

const rendimientoFisico = async (id) => {
    const contenedorOne = document.getElementById('contenedor_estados');
        contenedorOne.innerHTML = `<div class="ps-5 pe-5 mt-3">
    <div class="p-3 mb-0">
        <div class="row justify-content-center align-items-center bg-blue-light-color">
            <div class="col-md-3">
                <p class="mt-3 fw-semibold">Pregunta</p>
            </div>
            <div class="col-md-3">
                <p class="mt-3 fw-semibold">Fecha</p>
            </div>
            <div class="col-md-3">
                <p class="mt-3 fw-semibold">Puntuación</p>
            </div>
        </div>
    </div>
    <div class="text-center d-none mb-4" id="noData">
        <p>Aún no hay registros para este jugador</p>
    </div>
    <!-- Insertamos la tabla con los registros del estado físico del jugador -->
    <div class="p-3" id="tableRendimientoFisico" style="max-height: 400px; overflow-y: auto;">
        <!-- Contenido de la tabla aquí -->
    </div>
</div>`;
        try {
            
    const cargarTabla = document.getElementById('tableRendimientoFisico');
    const noDataDiv = document.getElementById('noData');
            cargarTabla.innerHTML = '';
            const FORM = new FormData();
            FORM.append('idJugador', id)

            const DATA = await fetchData(TEST_API, 'readAll', FORM);
            if (DATA.status) {
                DATA.dataset.forEach(row => {
                    const tablaHtml = `
                            <div class="row justify-content-center align-items-center">
                                <div class="col-md-3">
                                    <p>${row.pregunta}</p>
                                </div>
                                <div class="col-md-3">
                                    <p>${row.fecha}</p>
                                </div>
                                <div class="col-md-3">
                                    <p>${row.respuesta}</p>
                                </div>   
                            </div>
                            <hr>
                        `;
                    cargarTabla.innerHTML += tablaHtml;
                })
            } else {
                noDataDiv.classList.remove('d-none');
            }
        } catch (error) {
            console.log('Error al obtener datos de la API')
        }
}


/*
*   Función para abrir una nueva página.
*   Parámetros: id jugador.
*   Retorno: ninguno.
*/
let idJugador;
const openPage = async (id, nombre) => {
    idJugador = id;
    SEE_MEDICAL.show();
    MODAL_TITLE_MEDICAL.textContent = `Rendimiento físico de ${nombre}`
    await zona1func(id);
}

const goToPage = () => {
    // Cuando se haga clic en el botón, se redirigirá a la página de estado fisica específicas.
    window.location.href = `../pages/physical_states.html?id=${idJugador}`;
    idJugador = 0;
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
                <button type="button" class="btn transparente" onclick="openPage(${row.id_jugador}, '${row.nombre_jugador} ${row.apellido_jugador}')">
                    <img src="../../../resources/img/svg/icons_forms/heart.svg" width="18" height="18">
                    </button>
                </td>
                    <td>
                    <button type="button" class="btn transparente" onclick="seeModal(${row.id_jugador})">
                    <img src="../../../resources/img/svg/icons_forms/cuerpo_tecnico.svg" width="18" height="18">
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
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-bs-dark" href="#" onclick="nextPage(${currentPage - 1})">Anterior</a></li>`;
    }

    for (let i = 1; i <= totalPaginas; i++) {
        paginacion.innerHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link text-bs-dark" href="#" onclick="nextPage(${i})">${i}</a></li>`;
    }

    if (currentPage < totalPaginas) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-bs-dark" href="#" onclick="nextPage(${currentPage + 1})">Siguiente</a></li>`;
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

    if (DATA.status) {
        playerSoccers = DATA.dataset;
        showPlayerSoccers(currentPage);
    } else {
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
    SEE_MODAL = new bootstrap.Modal('#seeModal'),
    MODAL_TITLE = document.getElementById('modalTitle');

    SEE_MEDICAL = new bootstrap.Modal('#seeMedicalRecord'),
        MODAL_TITLE_MEDICAL = document.getElementById('modalTitleMedical')


    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_JUGADOR = document.getElementById('idJugador'),
        NOMBRE_JUGADOR = document.getElementById('nombreJugador'),
        APELLIDO_JUGADOR = document.getElementById('apellidoJugador'),
        NACIMIENTO_JUGADOR = document.getElementById('fechaNacimientoJugador'),
        PERFIL_JUGADOR = document.getElementById('perfilJugador'),
        DORSAL_JUGADOR = document.getElementById('Dorsal'),
        BECADO = document.getElementById('beca'),
        ESTATUS_JUGADOR = document.getElementById('estadoJugador');
    GENERO_JUGADOR = document.getElementById('generoJugador'),
        IMAGEN_JUGADOR = document.getElementById('imagen_jugador'),
        IMAGEN = document.getElementById('imagenJugador'),
        TELEFONO_JUGADOR = document.getElementById('telefonoJugador'),
        TELEFONO_EMERGENCIA_JUGADOR = document.getElementById('telefonoEmergencia'),
        CORREO_JUGADOR = document.getElementById('correoContacto'),
        TIPO_SANGRE = document.getElementById('tipoSangre'),
        OBSERVACION_MEDICA = document.getElementById('observacionMedica'),
        ZONA1 = document.getElementById('zona1'),
        ZONA2 = document.getElementById('zona2'),
    ALIAS = document.getElementById('alias');

    SELECT_GENER0 = document.getElementById('selectGenero');

    BOX_ALIAS = document.getElementById('boxAlias');

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
