let SAVE_MODAL,
    MODAL_TITLE;

let SEE_MODAL,
    MODAL_TITLE1;

let SEE_GOLES_MODAL,
    MODAL_TITLE2;

let SAVE_GOLES_MODAL,
    MODAL_TITLE3;

let SAVE_AMONESTACION_MODAL,
    MODAL_TITLE4;

let SEE_AMONESTACION_MODAL,
    MODAL_TITLE5;

let SEE_FORM_PARTICIPACION,
    ID_PARTICIPACION1,
    ID_JUGADOR1,
    TITULAR1,
    SUSTITUCION1,
    MINUTOS_JUGADOS1,
    GOLES1,
    ASISTENCIAS1,
    ESTADO_ANIMO1,
    PUNTUACION1;

let SAVE_FORM_PARTICIPACION,
    ID_PARTICIPACION,
    ID_JUGADOR,
    TITULAR,
    SUSTITUCION,
    MINUTOS_JUGADOS,
    GOLES,
    ASISTENCIAS,
    ESTADO_ANIMO,
    PUNTUACION;
    
let SAVE_FORM_GOLES,
    ID_GOLES,
    ID_PARTICIPACION_GOL,
    CANTIDAD,
    ID_TIPO_GOL;


let SAVE_FORM_AMONESTACION,
    ID_AMONESTACION
    ID_PARTICIPACION,
    CANTIDAD,
    ID_AMONESTACION;

let SEARCH_FORM;

// Constantes para completar las rutas de la API.
const PARTICIPACION_API = '';

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
    MODAL_TITLE.textContent = 'Agregar participación del jugador';
    // Se prepara el formulario.
    SAVE_FORM.reset();
}


const openCreateGol = () => {
    // Cerramos el modal que estaba anteriormete
    SEE_GOLES_MODAL.hide();
    SAVE_GOLES_MODAL.show();
    MODAL_TITLE3.textContent = 'Agregar tipo de gol';
    SAVE_FORM_GOLES.reset();
}

const openCreateAmonestacion = () => {
    // Cerramos el modal que estaba anteriormete
    SEE_AMONESTACION_MODAL.hide();
    SAVE_AMONESTACION_MODAL.show();
    MODAL_TITLE4.textContent = 'Agregar amonestación';
    SAVE_FORM_AMONESTACION.reset();
}


/*
*   Función para abrir los goles del jugador.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openGoles = () => {
    // Se muestra la caja de diálogo con su título.
    SEE_GOLES_MODAL.show();
    MODAL_TITLE2.textContent = 'Agregar tipo de gol';
    // Se prepara el formulario.
    SAVE_FORM.reset();
}

/*
*   Función para abrir las amonestaciones del jugador.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openAmonestaciones = () => {
    // Se muestra la caja de diálogo con su título.
    SEE_AMONESTACION_MODAL.show();
    MODAL_TITLE5.textContent = 'Agregar amonestación';
    // Se prepara el formulario.
    SAVE_FORM.reset();
}

// Funcion para preparar el formulario al momento de abrirlo

const seeModal = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idParticipacion', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(PARTICIPACION_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SEE_MODAL.show();
            MODAL_TITLE1.textContent = 'Participación del jugador';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_PARTICIPACION1.value = ROW.ID;
            ID_JUGADOR1.value = ROW.JUGADOR;
            TITULAR1.value = ROW.TITULAR;
            SUSTITUCION1.value = ROW.SUSTITUCION;
            MINUTOS_JUGADOS1.value = ROW.MINUTOS_JUGADOS;
            GOLES1.value = ROW.GOLES;
            ASISTENCIAS1.value = ROW.ASISTENCIAS;
            ESTADO_ANIMO1.value = ROW.ESTADO_ANIMO;
            PUNTUACION1.value = ROW.PUNTUACION;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        SEE_MODAL.show();
        MODAL_TITLE1.textContent = 'Participación del jugador';
        SEE_FORM.reset();
    }
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
            ID_PARTICIPACION1.value = ROW.ID;
            ID_JUGADOR1.value = ROW.JUGADOR;
            TITULAR1.value = ROW.TITULAR;
            SUSTITUCION1.value = ROW.SUSTITUCION;
            MINUTOS_JUGADOS1.value = ROW.MINUTOS_JUGADOS;
            GOLES1.value = ROW.GOLES;
            ASISTENCIAS1.value = ROW.ASISTENCIAS;
            ESTADO_ANIMO1.value = ROW.ESTADO_ANIMO;
            PUNTUACION1.value = ROW.PUNTUACION;
        } else {
            sweetAlert(2, DATA.error, false);
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
            console.log(id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(PARTICIPACION_API, 'deleteRow', FORM);
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
        confirmAction('¿Desea eliminar la participación del jugador?');
    }

}

const openUpdateGoles = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idGol', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(PARTICIPACION_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_GOLES_MODAL.show();
            MODAL_TITLE3.textContent = 'Actualizar tipo de gol';
            // Se prepara el formulario.
            SAVE_FORM_GOLES.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_GOLES.value = ROW.ID;
            ID_PARTICIPACION_GOL.value = ROW.PARTICIPACION;
            CANTIDAD.value = ROW.CANTIDAD;
            ID_TIPO_GOL.value = ROW.TIPO_GOL;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_GOLES_MODAL.show();
        MODAL_TITLE3.textContent = 'Actualizar tipo de gol';
        SEE_GOLES_MODAL.hide();
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
            FORM.append('idParticipacion', id);
            console.log(id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(PARTICIPACION_API, 'deleteRow', FORM);
            console.log(DATA.status);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se muestra un mensaje de éxito.
                await sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                cargarGolTarjetas();
            } else {
                sweetAlert(2, DATA.error, false);
            }
        }
    }
    catch (Error) {
        console.log(Error + ' Error al cargar el mensaje');
        confirmAction('¿Desea eliminar el tipo de gol de la participación del jugador?');
    }

}


const openUpdateAmonestacion = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idAmonestacion', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(PARTICIPACION_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_AMONESTACION_MODAL.show();
            MODAL_TITLE4.textContent = 'Actualizar amonestación';
            // Se prepara el formulario.
            SAVE_FORM_AMONESTACION.reset();
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_AMONESTACION.value = ROW.ID;
            ID_PARTICIPACION_GOL.value = ROW.PARTICIPACION;
            CANTIDAD.value = ROW.CANTIDAD;
            ID_AMONESTACION.value = ROW.AMONESTACION;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_AMONESTACION_MODAL.show();
        MODAL_TITLE4.textContent = 'Actualizar amonestación';
        SEE_AMONESTACION_MODAL.hide();
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
            FORM.append('idAmonestacion', id);
            console.log(id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(PARTICIPACION_API, 'deleteRow', FORM);
            console.log(DATA.status);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se muestra un mensaje de éxito.
                await sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                cargarAmonestacionTarjetas();
            } else {
                sweetAlert(2, DATA.error, false);
            }
        }
    }
    catch (Error) {
        console.log(Error + ' Error al cargar el mensaje');
        confirmAction('¿Desea eliminar la amonestación de la participación del jugador?');
    }

}


async function cargarTabla(form = null) {
    const lista_datos = [
        {
            imagen: '../../../../resources/img/svg/avatar.svg',
            nombre: 'Mateo',
            apellido: 'Ramírez',
            minutosJugados: 30,
            id: 1,
        },
        {
            imagen:  '../../../../resources/img/svg/avatar.svg',
            nombre: 'Mateo',
            apellido: 'Ramírez',
            minutosJugados: 30,
            id: 2,
        },
        {
            imagen:  '../../../../resources/img/svg/avatar.svg',
            nombre: 'Mateo',
            apellido: 'Ramírez',
            minutosJugados: 30,
            id: 3,
        },
        {
            imagen:  '../../../../resources/img/svg/avatar.svg',
            nombre: 'Mateo',
            apellido: 'Ramírez',
            minutosJugados: 30,
            id: 4,
        }
    ];
    const cargarTabla = document.getElementById('tabla_participacion');

    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(PARTICIPACION_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const tablaHtml = `
                <tr>
                    <img src="${SERVER_URL}images/admin/${row.imagen}" height="50" width="50" class="circulo"></td>
                    <td>${row.NOMBRE}</td>
                    <td>${row.APELLIDO}</td>
                    <td>${row.MINUTOS_JUGADOS}</td>
                    <td>
                        <button type="button" class="btn btn-warnig" onclick="openGoles()">
                        <img src="../../../resources/img/svg/icons_forms/ball.svg" width="30" height="30">
                        </button>
                    </td>
                    <td>
                        <button type="button" class="btn btn-warnig" onclick="openAmonestacion()">
                        <img src="../../../resources/img/svg/icons_forms/amonestacion.svg" width="30" height="30">
                        </button>
                    </td>
                    <td>
                        <button type="button" class="btn btn-outline-success" onclick="openUpdate(${row.ID})">
                        <img src="../../../recursos/img/svg/icons_forms/Frame.svg" width="30" height="30">
                        </button>
                        <button type="button" class="btn btn-outline-success" onclick="openUpdate(${row.ID})">
                        <img src="../../../recursos/img/svg/icons_forms/pen 1.svg" width="30" height="30">
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
                <td>${row.apellido}</td>
                <td>${row.minutosJugados}</td>
                <td>
                    <button type="button" class="btn transparente" onclick="openGoles()">
                    <img src="../../../resources/img/svg/icons_forms/ball.svg" width="30" height="30">
                    </button>
                </td>
                <td>
                    <button type="button" class="btn transparente" onclick="openAmonestaciones()">
                    <img src="../../../resources/img/svg/icons_forms/amonestacion.svg" width="30" height="30">
                    </button>
                </td>
                <td>
                    <button type="button" class="btn transparente" onclick="seeModal(${row.id})">
                    <img src="../../../resources/img/svg/icons_forms/cuerpo_tecnico.svg" width="18px" height="18px">
                    </button>
                    <button type="button" class="btn transparente" onclick="openUpdate(${row.cuerpo_técnico})">
                    <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18px" height="18px">
                    </button>
                    <button type="button" class="btn transparente" onclick="openDelete(${row.cuerpo_técnico})">
                    <img src="../../../resources/img/svg/icons_forms/trash 1.svg" width="18" height="18">
                    </button>
                </td>
            </tr>
            `;
            cargarTabla.innerHTML += tablaHtml;
        });
    }
}

async function cargarGolTarjetas (form = null) {
    const lista_datos_goles = [
        {
            cantidadGoles: 1,
            nombreGol: 'Fuera del área',
            idGol: 1,
        },
        {
            cantidadGoles: 4,
            nombreGol: 'Penalti',
            idGol: 2,
        }
    ];
    const cargarGoles = document.getElementById('gol_card');

    try {
        cargarGoles.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(PARTICIPACION_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const tarjetasGoles = `
                <div class="content shadow rounded-4 p-3 mb-4">
                <div class="row">
                    <div class="col-sm-12 col-md-10">
                        <p>${row.CANTIDAD}  ${row.ID_GOLES}</p>
                    </div>
                    <div class="col-sm-12 col-md-2">
                        <div class="container d-flex justify-content-between">
                            <button class="btn transparente me-md-2"><img
                                    src="../../../resources/img/svg/icons_forms/pen 1.svg" alt=""
                                    onclick="seeModal(${row.ID})"></button>
                            <button class="btn transparente"><img
                                    src="../../../resources/img/svg/icons_forms/trash 1.svg" alt=""
                                    onclick="seeModal(${row.ID})"></button>
                        </div>
                    </div>
                </div>
            </div>
                `;
                cargarGoles.innerHTML += tarjetasGoles;
            });
        } else {
            sweetAlert(4, DATA.error, true);
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        // Mostrar materiales de respaldo
        lista_datos_goles.forEach(row => {
            const tarjetasGoles = `
            <div class="content shadow rounded-4 p-3 mb-4">
            <div class="row">
                <div class="col-sm-12 col-md-10">
                    <p>${row.cantidadGoles}  ${row.nombreGol}</p>
                </div>
                <div class="col-sm-12 col-md-2">
                    <div class="container d-flex justify-content-between">
                        <button class="btn transparente me-md-2"><img
                                src="../../../resources/img/svg/icons_forms/pen 1.svg" alt=""
                                onclick="openUpdateGoles(${row.id})"></button>
                        <button class="btn transparente"><img
                                src="../../../resources/img/svg/icons_forms/trash 1.svg" alt=""
                                onclick="openDeleteGoles(${row.id})"></button>
                    </div>
                </div>
            </div>
        </div>
            `;
            cargarGoles.innerHTML += tarjetasGoles;
        });
    }
}


async function cargarAmonestacionTarjetas (form = null) {
    const lista_datos_amonestacion = [
        {
            cantidadAmonestacion: 2,
            nombreAmonestacion: 'Tarjeta amarilla',
            idAmonestacion: 1,
        },
        {
            cantidadAmonestacion: 1,
            nombreAmonestacion: 'Tarjeta roja',
            idAmonestacion: 1,
        }
    ];
    const cargarAmonestacion = document.getElementById('amonestacion_card');

    try {
        cargarAmonestacion.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(PARTICIPACION_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const tarjetasAmonestacion = `
                <div class="content shadow rounded-4 p-3 mb-4">
                <div class="row">
                    <div class="col-sm-12 col-md-10">
                        <p>${row.CANTIDAD}  ${row.ID_AMONESTACION}</p>
                    </div>
                    <div class="col-sm-12 col-md-2">
                        <div class="container d-flex justify-content-between">
                            <button class="btn transparente me-md-2"><img
                                    src="../../../resources/img/svg/icons_forms/pen 1.svg" alt=""
                                    onclick="seeModal(${row.ID})"></button>
                            <button class="btn transparente"><img
                                    src="../../../resources/img/svg/icons_forms/trash 1.svg" alt=""
                                    onclick="seeModal(${row.ID})"></button>
                        </div>
                    </div>
                </div>
            </div>
                `;
                cargarAmonestacion.innerHTML += tarjetasAmonestacion;
            });
        } else {
            sweetAlert(4, DATA.error, true);
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

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los componentes de manera síncrona
    const participacionHtml = await loadComponent('../componentes/matches_participations3.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = participacionHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Participaciones';
    cargarTabla();
    cargarGolTarjetas();
    cargarAmonestacionTarjetas();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE = document.getElementById('modalTitle');

    SEE_MODAL = new bootstrap.Modal('#seeModal'),
        MODAL_TITLE1 = document.getElementById('modalTitle1');

    SEE_GOLES_MODAL= new bootstrap.Modal('#golesModal'),
        MODAL_TITLE2 = document.getElementById('modalTitle3');
    
    SAVE_GOLES_MODAL = new bootstrap.Modal('#saveGolModal'),
        MODAL_TITLE3 = document.getElementById('modalTitle4');

    SEE_AMONESTACION_MODAL= new bootstrap.Modal('#amonestacionModal'),
        MODAL_TITLE5 = document.getElementById('modalTitle5');

    SAVE_AMONESTACION_MODAL = new bootstrap.Modal('#saveAmonestacionModal'),
        MODAL_TITLE4 = document.getElementById('modalTitle6');

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_ANALISIS = document.getElementById('idAnalisis'),
        // Método del evento para cuando se envía el formulario de guardar.
        SAVE_FORM.addEventListener('submit', async (event) => {
            // Se evita recargar la página web después de enviar el formulario.
            event.preventDefault();
            // Se verifica la acción a realizar.
            (ID_ANALISIS.value) ? action = 'updateRow' : action = 'createRow';
            // Constante tipo objeto con los datos del formulario.
            const FORM = new FormData(SAVE_FORM);
            // Petición para guardar los datos del formulario.
            const DATA = await fetchData(EQUIPO_API, action, FORM);
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

        SAVE_FORM_GOLES = document.getElementById('saveGolForm'),
        ID_GOLES = document.getElementById('idGol'),
        // Método del evento para cuando se envía el formulario de guardar.
        SAVE_FORM_GOLES.addEventListener('submit', async (event) => {
            // Se evita recargar la página web después de enviar el formulario.
            event.preventDefault();
            // Se verifica la acción a realizar.
            (ID_GOLES.value) ? action = 'updateRow' : action = 'createRow';
            // Constante tipo objeto con los datos del formulario.
            const FORM = new FormData(SAVE_FORM_GOLES);
            // Petición para guardar los datos del formulario.
            const DATA = await fetchData(PARTICIPACION_API, action, FORM);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se cierra la caja de diálogo.
                SAVE_GOLES_MODAL.hide();
                // Se muestra un mensaje de éxito.
                sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                cargarGolTarjetas();
            } else {
                sweetAlert(2, DATA.error, false);
                console.error(DATA.exception);
            }
        });

    // Constantes para establecer los elementos del formulario de guardar.
    SEE_FORM = document.getElementById('viewForm'),
        ID_ANALISISV = document.getElementById('idAnalisisV'),
     
    
    // Método del evento para cuando se envía el formulario de guardar.
    SEE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
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

