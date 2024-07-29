// Recibimos los parametros
const params = new URLSearchParams(window.location.search);
const idEquipo = params.get("idEquipo");
const idPartido = params.get("idPartido");

// ---------------------------- Variables para el modal y form para guardar la participacion ------------
let SAVE_MODAL,
    MODAL_TITLE;

let SAVE_FORM,
    ID_PARTICIPACION,
    TITULAR,
    SUSTITUCION,
    ID_JUGADOR,
    GOLES,
    MINUTOS,
    ASISTENCIAS,
    PUNTUACION;

//-- GOLES
// --------------- Variables para el modal y form para guardar los goles ---------------------------
let SAVE_MODAL_GOLES,
    MODAL_TITLE_GOLES1;

let SAVE_GOL_FORM,
    ID_GOL,
    CANTIDAD_GOLES,
    TIPOS_GOLES;

// --------------- Variables para ver el modal de goles
let SEE_GOLES_MODAL,
    MODAL_TITLE_GOLES2;

// -- AMONESTACIONES
// -------------- Variables para el modal Y form para guardar amonestaciones

let SAVE_AMONESTACION_MODAL,
    MODAL_TITLE_AMONESTACION1;

let SAVE_AMONESTACION_FORM,
    ID_AMONESTACION,
    CANTIDAD_AMONESTACION,
    TIPO_AMONESTACION;

// -------------- Variables para ver el modal de amonestaciones
let SEE_AMONESTACION_MODAL,
    MODAL_TITLE_AMONESTACION2;

let SEARCH_FORM;

let idParticipation;
let idPlayer;
let golesDiv;

let MESAGGE_GOL;
let MESSAGE_AMONESTACION;

// Constantes para completar las rutas de la API.
const PARTICIPACION_API = 'services/technics/participaciones_partidos.php';
const GOLES_API = 'services/technics/detalles_goles.php';
const AMONESTACIONES_API = 'services/technics/detalles_amonestaciones.php';
const TIPO_GOL_API = 'services/technics/tipos_goles.php';
const PARTIDO_API = 'services/technics/partidos.php';
const POSICIONES_API = 'services/technics/posiciones.php';

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
const openCreate = (idJugador) => {
    idPlayer = '';
    //ID_PARTICIPACION = '';
    fillSelect(POSICIONES_API, 'readAll', 'posicionPrincipal');
    resetEstadoAnimo();
    golesDiv.classList.add('d-none');
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Agregar participación del jugador';
    idPlayer = idJugador;
    // Se prepara el formulario.
    SAVE_FORM.reset();
}


const openCreateGol = async () => {
    // Cerramos el modal que estaba anteriormete
    await fillSelectOptions(TIPO_GOL_API, 'readAll', 'tipoGol');
    SEE_GOLES_MODAL.hide();
    SAVE_MODAL_GOLES.show();
    MODAL_TITLE_GOLES1.textContent = 'Agregar tipo de gol';
    SAVE_GOL_FORM.reset();
}

const openCreateAmonestacion = () => {
    // Cerramos el modal que estaba anteriormete
    SEE_AMONESTACION_MODAL.hide();
    SAVE_AMONESTACION_MODAL.show();
    MODAL_TITLE_AMONESTACION1.textContent = 'Agregar amonestación';
    SAVE_AMONESTACION_FORM.reset();
}


/*
*   Función para abrir los goles del jugador.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openGoles = async (idParticipacion) => {
    //ID_GOL = '';
    // Se muestra la caja de diálogo con su título.
    SEE_GOLES_MODAL.show();
    await cargarGolTarjetas(idParticipacion);
    idParticipation = idParticipacion;
    MODAL_TITLE_GOLES2.textContent = 'Agregar tipo de gol';
    // Se prepara el formulario.
    SAVE_GOL_FORM.reset();
}

/*
*   Función para abrir las amonestaciones del jugador.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openAmonestaciones = async (idParticipacion) => {
    //ID_AMONESTACION = '';
    // Se muestra la caja de diálogo con su título.
    SEE_AMONESTACION_MODAL.show();
    await cargarAmonestacionTarjetas(idParticipacion);
    idParticipation = idParticipacion;
    MODAL_TITLE_AMONESTACION2.textContent = 'Agregar amonestación';
    // Se prepara el formulario.
    SAVE_AMONESTACION_FORM.reset();
}


/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdate = async (id, idJugador) => {
    try {
        idPlayer = '';
        //ID_PARTICIPACION = '';
        idPlayer = idJugador;

        resetEstadoAnimo();
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idParticipacion', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(PARTICIPACION_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar participación del jugador';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            const switchtTitularChecked = (ROW.titular === '1') ? 'checked' : '';
            const switchtSustitucionChecked = (ROW.sustitucion === '1') ? 'checked' : '';
            ID_PARTICIPACION.value = ROW.id_participacion;
            TITULAR.checked = switchtTitularChecked;
            SUSTITUCION.checked = switchtSustitucionChecked;
            MINUTOS.value = ROW.minutos_jugados;
            await fillSelect(POSICIONES_API, 'readAll', 'posicionPrincipal', ROW.id_posicion);
            golesDiv.classList.remove('d-none');
            GOLES.value = ROW.goles;
            ASISTENCIAS.value = ROW.asistencias;
            PUNTUACION.value = ROW.puntuacion;

            //Obtenemos el elemento p de acuerdo al estado de animo que trae la api.
            const estadoAnimoElement = document.querySelector(`#${ROW.estado_animo.toLowerCase()}`);
            // Si trae un elemento p, entonces le va agregar estilo para que aparezca seleccionado.
            if (estadoAnimoElement) {
                estadoAnimoElement.parentElement.classList.add('selected');
            }
        } else {
            sweetAlert(4, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar participación del jugador';
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar la participación del jugador?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idParticipacion', id);

            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(PARTICIPACION_API, 'deleteRow', FORM);
            console.log(DATA.status);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se muestra un mensaje de éxito.
                await sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                await cargarTabla();
            } else {
                await sweetAlert(4, DATA.error, false);
            }
        }
    }
    catch (Error) {
        console.log(Error + ' Error al cargar el mensaje');
    }

}

const openUpdateGoles = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idDetalleGol', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(GOLES_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            SEE_GOLES_MODAL.hide();
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL_GOLES.show();
            MODAL_TITLE_GOLES1.textContent = 'Actualizar tipo de gol';
            // Se prepara el formulario.
            SAVE_GOL_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_GOL.value = ROW.id_detalle_gol;
            CANTIDAD_GOLES.value = ROW.cantidad_tipo_gol;
            await fillSelectOptions(TIPO_GOL_API, 'readAll', 'tipoGol', ROW.id_tipo_gol)
        } else {
            await sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDeleteGoles = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el tipo de gol de la participación del jugador?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idDetalleGol', id);

            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(GOLES_API, 'deleteRow', FORM);

            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se muestra un mensaje de éxito.
                await sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                await cargarGolTarjetas(idParticipation);
                SEE_GOLES_MODAL.show();
            } else {
                await sweetAlert(2, DATA.error, false);
            }
        }
    }
    catch (Error) {
        console.log(Error + ' Error al cargar el mensaje');
    }

}


const openUpdateAmonestacion = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idDetalleAmonestacion', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(AMONESTACIONES_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            SEE_AMONESTACION_MODAL.hide();
            // Se muestra la caja de diálogo con su título.
            SAVE_AMONESTACION_MODAL.show();
            MODAL_TITLE_AMONESTACION1.textContent = 'Actualizar amonestación';
            // Se prepara el formulario.
            SAVE_AMONESTACION_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_AMONESTACION.value = ROW.id_detalle_amonestacion;
            CANTIDAD_AMONESTACION.value = ROW.numero_amonestacion;
            TIPO_AMONESTACION.value = ROW.amonestacion;
        } else {
            await sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
    }

}
/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDeleteAmonestacion = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar la amonestación de la participación del jugador?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idDetalleAmonestacion', id);

            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(AMONESTACIONES_API, 'deleteRow', FORM);

            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se muestra un mensaje de éxito.
                await sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                await cargarAmonestacionTarjetas(idParticipation);
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
const participationByPage = 10;
let currentPage = 1;
let participation = [];

async function showParticipation(page) {
    const start = (page - 1) * participationByPage;
    const end = start + participationByPage;
    const participationPage = participation.slice(start, end);

    const cargarTabla = document.getElementById('participationCards');
    cargarTabla.innerHTML = '';

    const DATA2 = await fetchData(PARTICIPACION_API, 'readAll');

    // Mapa de id_jugador a id_participacion
    const participacionMap = new Map();

    if (DATA2.status) {
        DATA2.dataset.forEach(row => {
            if (parseInt(row.id_partido) === parseInt(idPartido)) {
                console.log('Entre aqui')
                participacionMap.set(row.id_jugador, row.id_participacion);
            }else{
                console.log('Cai en el else')
            }
        });
    }

    participationPage.forEach(row => {
        const idParticipacion = participacionMap.get(row.id_jugador) || 0;

        const tablaHtml = `
                    <div class="col-sm-6 col-md-4">
                        <div class="shadow rounded-5">
                            <div class="row p-3 align-items-center">
                            <div class="col-4 ">
                                <img src="${SERVER_URL}images/jugadores/${row.foto_jugador}" class="shadow" height="120px" width="120px" id="imgJugador">
                            </div>
                            <div class="col-8">
                                <div class="row align-items-center">
                                    <div class="col-9">
                                        <small class="text-blue-color">${row.posicion}</small>
                                        <p class="fw-semibold mb-0">${row.nombre_jugador} ${row.apellido_jugador}</p>
                                    </div>
                                    <div class="col-3 text-center">
                                        <div class="bg-blue-principal-color text-light rounded-circle" id="dorsal">
                                            <div class="fs-5">${row.dorsal_jugador}</div>
                                        </div>
                                    </div>
                                </div>                             
                                <hr>
                                <div class="d-flex mt-3 justify-content-center">
                                <button type="button" class="btn btn-light shadow-sm d-none" id="btnOpenCreate_${row.id_jugador}" onclick="openCreate(${row.id_jugador})">
                                    <img src="../../../resources/img/svg/plus.svg" width="20" height="20">
                                    Agregar participación 
                                </button>
                                
                                 <button type="button" class="btn transparente d-none mx-2" id="btnUpdate_${row.id_jugador}" onclick="openUpdate(${idParticipacion}, ${row.id_jugador})">
                                    <img src="../../../resources/img/svg/pen 2.svg" width="20" height="20">
                                </button>
                                
                                <button type="button" class="btn transparente d-none mx-2" id="btnOpenGol_${row.id_jugador}" onclick="openGoles(${idParticipacion})">
                                    <img src="../../../resources/img/svg/icons_forms/ball.svg" width="20" height="20">
                                </button>
                                
                                <button type="button" class="btn transparente d-none mx-2" id="btnOpenAmonestacion_${row.id_jugador}" onclick="openAmonestaciones(${idParticipacion})">
                                    <img src="../../../resources/img/svg/icons_forms/amonestacion.svg" width="20" height="20">
                                </button>
                                
                                <button type="button" class="btn transparente d-none mx-2" id="btnOpenDelete_${row.id_jugador}" onclick="openDelete(${idParticipacion})">
                                    <img src="../../../resources/img/svg/icons_forms/trash 1.svg" width="20" height="20">
                                </button>

                                </div>
                            </div>
                        </div
                        </div>
                    </div>
                `;
        cargarTabla.innerHTML += tablaHtml;

        // Actualizar la visibilidad de los botones después de añadir el HTML
        const btnOpenCreate = document.getElementById(`btnOpenCreate_${row.id_jugador}`);
        const btnUpdate = document.getElementById(`btnUpdate_${row.id_jugador}`);
        const btnOpenGol = document.getElementById(`btnOpenGol_${row.id_jugador}`);
        const btnOpenAmonestacion = document.getElementById(`btnOpenAmonestacion_${row.id_jugador}`);
        const btnOpenDelete = document.getElementById(`btnOpenDelete_${row.id_jugador}`);

        //Si el id de la participacion es mayor a 0, entonces significa que ya existe registrada la participacion para el jugador
        //por lo que botones para eliminar, actualizar, goles y tarjetas amarillas se mostraran.
        if (idParticipacion > 0) {
            btnUpdate.classList.remove('d-none');
            btnOpenGol.classList.remove('d-none');
            btnOpenAmonestacion.classList.remove('d-none');
            btnOpenDelete.classList.remove('d-none')
        } else {
            btnOpenCreate.classList.remove('d-none');
        }
    });

    updatePaginate();
}


async function cargarTabla() {
    resetButton();
    resetEstadoAnimo();

    const cargarTabla = document.getElementById('participationCards');

    try {
        cargarTabla.innerHTML = '';
        const form = new FormData();
        form.append('idEquipo', idEquipo)
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(PARTICIPACION_API, 'readAllByIdEquipo', form);


        if (DATA.status) {
            participation = DATA.dataset;
            await showParticipation(currentPage);
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

    const totalPaginas = Math.ceil(participation.length / participationByPage);

    if (currentPage > 1) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-dark" href="#" onclick="nextPage(${currentPage - 1})">Anterior</a></li>`;
    }

    for (let i = 1; i <= totalPaginas; i++) {
        paginacion.innerHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link text-light" href="#" onclick="nextPage(${i})">${i}</a></li>`;
    }

    if (currentPage < totalPaginas) {
        paginacion.innerHTML += `<li class="page-item"><a class="page-link text-dark" href="#" onclick="nextPage(${currentPage + 1})">Siguiente</a></li>`;
    }
}

// Función para cambiar de página
async function nextPage(newPage) {
    currentPage = newPage;
    await showParticipation(currentPage);
}

async function cargarGolTarjetas(idParticipacion) {
    MESAGGE_GOL.classList.add('d-none');
    const cargarGoles = document.getElementById('gol_card');
    let totalGoles = 0;
    try {
        cargarGoles.innerHTML = '';
        const form = new FormData();
        form.append('idParticipacion', idParticipacion);

        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(GOLES_API, 'readAllByIdParticipacion', form);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const tarjetasGoles = `
                <div class="content shadow rounded-4 p-3 mb-4">
                <div class="row">
                    <div class="col-sm-12 col-md-10">
                        <p>${row.cantidad_tipo_gol}  ${row.nombre_tipo_gol}</p>
                    </div>
                    <div class="col-sm-12 col-md-2">
                        <div class="container d-flex justify-content-between">
                            <button class="btn transparente me-md-2"><img
                                    src="../../../resources/img/svg/icons_forms/pen 1.svg" alt=""
                                    onclick="openUpdateGoles(${row.id_detalle_gol})"></button>
                            <button class="btn transparente"><img
                                    src="../../../resources/img/svg/icons_forms/trash 1.svg" alt=""
                                    onclick="openDeleteGoles(${row.id_detalle_gol})"></button>
                        </div>
                    </div>
                </div>
            </div>
                `;
                cargarGoles.innerHTML += tarjetasGoles;
                //totalGoles += parseInt(row.cantidad_tipo_gol, 10);
            });
            //cantidadGoles += totalGoles;
        } else {
            MESAGGE_GOL.classList.remove('d-none');
            MESAGGE_GOL.textContent = DATA.error;

        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
    }
}

let total_rojas;
let total_amarillas;

async function cargarAmonestacionTarjetas(idParticipacion) {

    // SE CUENTAN LA CANTIDAD DE TARJETAS ROJAS Y AMARILLAS DEL JUGADOR.
    //Tarjetas rojas
    const form = new FormData();
    form.append('idParticipacion', idParticipacion);
    const DATA1 = await fetchData(AMONESTACIONES_API, 'readTarjetaRojas', form);

    if (DATA1.status) {
        total_rojas = DATA1.dataset.totalRojas;
        console.log(total_rojas);
    } else {
        console.log('No tiene tarjetas rojas')
    }

    //Tarjetas amarillas
    const form1 = new FormData();
    form1.append('idParticipacion', idParticipacion);
    const DATA2 = await fetchData(AMONESTACIONES_API, 'readTarjetaAmarillas', form1);

    if (DATA2.status) {
        total_amarillas = DATA2.dataset.totalAmarillas;
        console.log(total_amarillas);
    } else {
        console.log('No tiene tarjetas amarillas')
    }
    ///////////////////////////////////////////////////////////////////////////////////

    MESSAGE_AMONESTACION.classList.add('d-none');

    const cargarAmonestacion = document.getElementById('amonestacion_card');

    try {
        cargarAmonestacion.innerHTML = '';

        const form = new FormData();
        form.append('idParticipacion', idParticipacion);

        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(AMONESTACIONES_API, 'readAllByIdParticipacion', form);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const tarjetasAmonestacion = `
                <div class="content shadow rounded-4 p-3 mb-4">
                <div class="row">
                    <div class="col-sm-12 col-md-10">
                        <p>${row.numero_amonestacion}  ${row.amonestacion}</p>
                    </div>
                    <div class="col-sm-12 col-md-2">
                        <div class="container d-flex justify-content-between">
                            <button class="btn transparente me-md-2"><img
                                    src="../../../resources/img/svg/icons_forms/pen 1.svg" alt=""
                                    onclick="openUpdateAmonestacion(${row.id_detalle_amonestacion})"></button>
                            <button class="btn transparente"><img
                                    src="../../../resources/img/svg/icons_forms/trash 1.svg" alt=""
                                    onclick="openDeleteAmonestacion(${row.id_detalle_amonestacion})"></button>
                        </div>
                    </div>
                </div>
            </div>
                `;
                cargarAmonestacion.innerHTML += tarjetasAmonestacion;
            });
        } else {
            MESSAGE_AMONESTACION.classList.remove('d-none');
            MESSAGE_AMONESTACION.textContent = DATA.error;

        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        // Mostrar materiales de respaldo
        lista_datos_amonestacion.forEach(row => {
            const tarjetasAmonestacion = `
            <div class="content shadow rounded-4 p-3 mb-4">
            <div class="row">
                <div class="col-sm-12 col-md-10">
                    <p>${row.cantidadAmonestacion}  ${row.nombreAmonestacion}</p>
                </div>
                <div class="col-sm-12 col-md-2">
                    <div class="container d-flex justify-content-between">
                        <button class="btn transparente me-md-2"><img
                                src="../../../resources/img/svg/icons_forms/pen 1.svg" alt=""
                                onclick="openUpdateAmonestacion(${row.id})"></button>
                        <button class="btn transparente"><img
                                src="../../../resources/img/svg/icons_forms/trash 1.svg" alt=""
                                onclick="openDeleteAmonestacion(${row.id})"></button>
                    </div>
                </div>
            </div>
        </div>
            `;
            cargarAmonestacion.innerHTML += tarjetasAmonestacion;
        });
    }
}

let animo;

// Lo que hace esta funcion es que a todos los elementos que tenga como clase estado-btn les quite la clase select,
// esto para quitarle el estilo de seleccionado al estado de animo.
function resetEstadoAnimo() {
    const allButtons = document.querySelectorAll('.estado-btn');
    allButtons.forEach(button => {
        button.classList.remove('selected');
    });
}

function resetButton() {
    const allButtons = document.querySelectorAll('.btn-style');
    allButtons.forEach(button => {
        button.classList.remove('style');
    });
}

//Funcion que obtiene el estado de animo y lo selecciona de acuerdo al elegido por el usuario
const estadoAnimo = (event) => {
    // Obtener el elemento clicado
    const clickedElement = event.currentTarget;

    // Busca el elemento p clickeado
    const pElement = clickedElement.querySelector('p');

    // Obtiene el texto del elemento <p>
    animo = pElement.textContent;

    // Obtienes todos los elementos que tengan la clase estado-btn
    const allButtons = document.querySelectorAll('.estado-btn');
    // Remueve la clase selected que pueda tener los elementos de la clase estado-btn
    allButtons.forEach(button => {
        button.classList.remove('selected');
    });

    // Agrega la clase 'selected' al botón clicado
    clickedElement.classList.add('selected');
};

// Funcion que permite el filtrado de jugadores a traves de su area de juego.
const filtroAreaJuego = async (event) => {
    //Obtenemos el elemento clicleado
    const clickedButton = event.currentTarget;
    //Obtenemos el texto del elemento clicleado
    const buttonText = clickedButton.innerText;

    let areaJuego = buttonText;

    const allButtons = document.querySelectorAll('.btn-style');

    allButtons.forEach(button => {
        button.classList.remove('style');
    });

    // Agrega la clase 'selected' al botón clicado
    clickedButton.classList.add('style');

    const FORM = new FormData();
    FORM.append('areaJuego', areaJuego);
    FORM.append('idEquipo', idEquipo);

    const DATA = await fetchData(PARTICIPACION_API, 'readAllByAreaJuego', FORM);

    if (DATA.status) {

        participation = DATA.dataset;
        await showParticipation(currentPage);
    } else {
        await sweetAlert(3, DATA.error, true);
    }

}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const participacionHtml = await loadComponent('../components/matches_participations3.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = participacionHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Participaciones';
    await cargarTabla();

    // DIV GOLES
    golesDiv = document.getElementById('golesDiv');
    MESAGGE_GOL = document.getElementById('messageGol');
    MESSAGE_AMONESTACION = document.getElementById('messageAmonestacion');


    // Constantes para establecer los elementos del componente para los modals.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    SAVE_FORM = document.getElementById('saveForm'),
        ID_PARTICIPACION = document.getElementById('idParticipacion'),
        TITULAR = document.getElementById('switchTitular'),
        SUSTITUCION = document.getElementById('switchSustitucion'),
        ID_JUGADOR = document.getElementById('jugador'),
        MINUTOS = document.getElementById('minutos'),
        ASISTENCIAS = document.getElementById('asistencias'),
        PUNTUACION = document.getElementById('puntuacion'),
        GOLES = document.getElementById('goles');

    // --------------------------------- GOLES ------------------------------

    SAVE_MODAL_GOLES = new bootstrap.Modal('#saveGolModal'),
        MODAL_TITLE_GOLES1 = document.getElementById('modalTitle4');

    SAVE_GOL_FORM = document.getElementById('saveGolForm'),
        ID_GOL = document.getElementById('idGol'),
        CANTIDAD_GOLES = document.getElementById('cantidadGol'),
        TIPOS_GOLES = document.getElementById('tipoGol');

    SEE_GOLES_MODAL = new bootstrap.Modal('#SeeGolesModal'),
        MODAL_TITLE_GOLES2 = document.getElementById('modalTitle3');

    // -------------------------------- AMONESTACIONES ------------------------

    SAVE_AMONESTACION_MODAL = new bootstrap.Modal('#saveAmonestacionModal'),
        MODAL_TITLE_AMONESTACION1 = document.getElementById('modalTitle6');

    SAVE_AMONESTACION_FORM = document.getElementById('saveAmonestacionForm'),
        ID_AMONESTACION = document.getElementById('idAmonestacion'),
        CANTIDAD_AMONESTACION = document.getElementById('cantidadAmonestacion'),
        TIPO_AMONESTACION = document.getElementById('tipoAmonestacion');

    SEE_AMONESTACION_MODAL = new bootstrap.Modal('#SeeAmonestacionModal'),
        MODAL_TITLE_AMONESTACION2 = document.getElementById('modalTitle5');

    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_PARTICIPACION.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM);

        const titular = TITULAR.checked ? 1 : 0;
        const sustitucion = SUSTITUCION.checked ? 1 : 0;

        FORM.set('titular', titular);
        FORM.set('sustitucion', sustitucion);
        FORM.append('animo', animo);
        FORM.append('idJugador', idPlayer);
        FORM.append('idPartido', idPartido);

        const minutos = parseInt(MINUTOS.value);
        const asistencias = parseInt(ASISTENCIAS.value);

        // Validación de los minutos jugados.
        if (minutos >= 116) {
            await sweetAlert(2, 'Los minutos jugados no pueden superar los 90 min.', false);
        } else if(asistencias > splitResultado) {
            await sweetAlert(2, `El resultado del partido es ${splitResultado}. El máximo de asistencias por jugador no puede ser más que el resultado del partido.`, false);
        } else {
            // Petición para guardar los datos del formulario.
            const DATA = await fetchData(PARTICIPACION_API, action, FORM);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se cierra la caja de diálogo.
                SAVE_MODAL.hide();
                // Se muestra un mensaje de éxito.
                await sweetAlert(1, DATA.message, false);
                // Se carga nuevamente la tabla para visualizar los cambios.
                await cargarTabla();
            } else {
                await sweetAlert(2, DATA.error, false);
                console.error(DATA.exception);
            }
        }
    });

    ////////////// Consulta el resultado del partido /////////////////////////////////
    let resultado_partido;
    let splitResultado;

    // Se verifica la acción a realizar.
    const formResult = new FormData();
    formResult.append('idPartido', idPartido);
    const DATA = await fetchData(PARTIDO_API, 'readOne', formResult);

    if (DATA.status) {
        resultado_partido = DATA.dataset.resultado_partido;
        splitResultado = parseInt(resultado_partido.split('-', 1));
    } else {
        console.log('No vino nada')
    }
    ///////////////////////////////////////////////////////////////////////////////////


    let totalGoles = 0;

    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_GOL_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.

        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_GOL.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_GOL_FORM);


        FORM.append('idParticipacion', idParticipation);

        const cantidadGol = parseInt(CANTIDAD_GOLES.value);

        let sumaTotalGoles = totalGoles + cantidadGol;

        if (sumaTotalGoles > splitResultado) {
            await sweetAlert(2, `La cantidad de goles que hubieron en el partido fueron ${splitResultado}, por lo que no puedes exceder de este resultado.`, false)
        }else if (cantidadGol > splitResultado) {
            await sweetAlert(2, `La cantidad de goles que hubieron en el partido fueron ${splitResultado}, por lo que no puedes exceder de este resultado.`, false)
        }
        else{
            // Petición para guardar los datos del formulario.
            const DATA = await fetchData(GOLES_API, action, FORM);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                totalGoles = sumaTotalGoles;

                SAVE_MODAL_GOLES.hide();
                SEE_GOLES_MODAL.show();
                // Se muestra un mensaje de éxito.
                await sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                await cargarGolTarjetas(idParticipation);
                console.log('Goles totales:', totalGoles);
            } else {
                await sweetAlert(2, DATA.error, false);
                console.error(DATA.exception);
            }
        }
    });

    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_AMONESTACION_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_AMONESTACION.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_AMONESTACION_FORM);

        FORM.append('idParticipacion', idParticipation);

        // Validación para tarjetas amarillas
        if (total_amarillas >= 2) {
            // Si el jugador ya tiene dos tarjetas amarillas, muestra mensaje y bloquea la adición de más amarillas
            await sweetAlert(2, 'El jugador seleccionado ya tiene dos tarjetas amarillas, por lo que es necesario asignarle tarjeta roja', false);

            // Si el jugador no tiene una tarjeta roja, permitir agregar una roja
            if (total_rojas === 0) {
                const confirmRedCard = await sweetAlert(2, 'Asignar una tarjeta roja al jugador.', true);
                if (confirmRedCard) {
                    // Aquí puedes manejar la lógica para asignar la tarjeta roja
                    const DATA = await fetchData(AMONESTACIONES_API, action, FORM);
                    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                    if (DATA.status) {
                        // Se cierra la caja de diálogo.
                        SAVE_AMONESTACION_MODAL.hide();
                        SEE_AMONESTACION_MODAL.show();
                        // Se muestra un mensaje de éxito.
                        await sweetAlert(1, DATA.message, true);
                        // Se carga nuevamente la tabla para visualizar los cambios.
                        await cargarAmonestacionTarjetas(idParticipation);
                    } else {
                        await sweetAlert(2, DATA.error, false);
                        console.error(DATA.exception);
                    }
                }
            } else {
                await sweetAlert(2, 'El jugador seleccionado ya tiene una tarjeta roja asignada', false);
            }
        } else if (total_rojas >= 1) {
            // Validación de tarjetas rojas
            await sweetAlert(2, 'El jugador seleccionado ya tiene una tarjeta roja asignada', false);
        } else {
            // Aquí puedes manejar la lógica para asignar una tarjeta amarilla o roja si las condiciones anteriores no se cumplen
            const DATA = await fetchData(AMONESTACIONES_API, action, FORM);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se cierra la caja de diálogo.
                SAVE_AMONESTACION_MODAL.hide();
                SEE_AMONESTACION_MODAL.show();
                // Se muestra un mensaje de éxito.
                await sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                await cargarAmonestacionTarjetas(idParticipation);
            } else {
                await sweetAlert(2, DATA.error, false);
                console.error(DATA.exception);
            }
        }
    });

    SEARCH_FORM = document.getElementById('searchForm');

    SEARCH_FORM.addEventListener('submit', async (event) => {
        event.preventDefault();

        const FORM = new FormData(SEARCH_FORM);

        const DATA = await fetchData(PARTICIPACION_API, 'searchRows', FORM);

        if (DATA.status) {
            participation = DATA.dataset;
            await showParticipation(currentPage);
        } else {
            await sweetAlert(3, DATA.error, true);
        }
    });
};

