let SAVE_MODAL,
    SEE_MODAL,
    SEE_FORM;
let SAVE_FORM,
    ID_PARTIDO,
    LOGO1,
    LOGO2,
    LOGO_RIVAL2,
    EQUIPO,
    MODAL_TITLE,
    MODAL_TITLE2,
    RIVAL,
    FECHA_PARTIDO,
    FECHA_PARTIDOS,
    CANCHA,
    LOGO,
    LOGO_RIVAL,
    RESULTADO_PARTIDO,
    LOCALIDAD,
    TIPO_RESULTADO_PARTIDO,
    ID_EQUIPO,
    ID_RIVAL,
    LOGO_RIVAL_SEE,
    LOGO_EQUIPO_SEE,
    JORNADA_SEE,
    EQUIPO_SEE,
    RIVAL_SEE,
    FECHA_PARTIDO_SEE,
    CANCHA_SEE,
    RESULTADO_PARTIDO_SEE,
    LOCALIDAD_SEE,
    TIPO_RESULTADO_PARTIDO_SEE,
    LOGO_EQUIPO_DIV,
    LOGO_RIVAL_DIV,
    JORNADA,
    IMAGENES_EQUIPOS,
    MENSAJE,
    MENSAJEALERT,
    IMAGENES_RIVALES;
let SEARCH_FORM;

// Constantes para completar las rutas de la API.
const PARTIDO_API = 'services/technics/partidos.php';

async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}


/*
* Función para preparar el formulario al momento de insertar un registro.
* Parámetros: ninguno.
* Retorno: ninguno.
*/
const openCreate = async () => {
    MENSAJEALERT.classList.add('d-none');
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    ID_PARTIDO.value = null;
    MODAL_TITLE2.textContent = 'Agregar partido';
    LOGO1.src = `${SERVER_URL}images/equipos/default.png`;
    LOGO2.src = `${SERVER_URL}images/rivales/default.png`;
    // Se prepara el formulario.
    SAVE_FORM.reset();
    IMAGENES_EQUIPOS = await fillSelectImage(PARTIDO_API, 'readEquipos', 'equipos');
    IMAGENES_RIVALES = await fillSelectImage(PARTIDO_API, 'readRivales', 'rival');
    await fillSelect(PARTIDO_API, 'readJornadas', 'jornada');
}

// Funcion para preparar el formulario al momento de abrirlo
/*
* Función asíncrona para preparar el formulario al momento de ver un registro.
* Parámetros: id (identificador del registro seleccionado).
* Retorno: ninguno.
*/
//

const seeModal = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idPartido', id);
        console.log(id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(PARTIDO_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        console.log(DATA);
        if (DATA.status) {
            console.log('Entre' + DATA.dataset.fecha_partido);
            SEE_MODAL.show();
            // Se muestra la caja de diálogo con su título.
            MODAL_TITLE.textContent = 'Ver partido';
            // Se prepara el formulario.
            SEE_FORM.reset();
            MENSAJE.classList.add('d-none');
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            EQUIPO_SEE.disabled = false;
            RIVAL_SEE.disabled = false;
            FECHA_PARTIDO_SEE.disabled = false;
            CANCHA_SEE.disabled = false;
            RESULTADO_PARTIDO_SEE.disabled = false;
            LOCALIDAD_SEE.disabled = false;
            TIPO_RESULTADO_PARTIDO_SEE.disabled = false;
            JORNADA_SEE.disabled = false;
            EQUIPO_SEE.value = ROW.nombre_equipo;
            RIVAL_SEE.value = ROW.nombre_rival;
            FECHA_PARTIDO_SEE.value = ROW.fecha_partido;
            CANCHA_SEE.value = ROW.cancha_partido;
            RESULTADO_PARTIDO_SEE.value = ROW.resultado_partido;
            LOCALIDAD_SEE.value = ROW.localidad_partido;
            TIPO_RESULTADO_PARTIDO_SEE.value = ROW.tipo_resultado_partido;
            JORNADA_SEE.value = ROW.nombre_jornada;
            LOGO_EQUIPO_SEE.src = `${SERVER_URL}images/equipos/${ROW.logo_equipo}`;
            LOGO_RIVAL_SEE.src = `${SERVER_URL}images/rivales/${ROW.logo_rival}`;
            EQUIPO_SEE.disabled = true;
            RIVAL_SEE.disabled = true;
            FECHA_PARTIDO_SEE.disabled = true;
            CANCHA_SEE.disabled = true;
            RESULTADO_PARTIDO_SEE.disabled = true;
            LOCALIDAD_SEE.disabled = true;
            TIPO_RESULTADO_PARTIDO_SEE.disabled = true;
            JORNADA_SEE.disabled = true;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SEE_MODAL.show();
        MODAL_TITLE.textContent = 'Ver partido';
    }
}
/*
* Función asíncrona para preparar el formulario al momento de actualizar un registro.
* Parámetros: id (identificador del registro seleccionado).
* Retorno: ninguno.
*/
const openUpdate = async (id) => {
    try {
        console.log(id, 'Estoy aqui en openUpdate, este es el id que se le mandara a la api');
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idPartido', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(PARTIDO_API, 'readOne', FORM);
        console.log(DATA, + ' Estoy aqui en openUpdate');
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE2.textContent = 'Actualizar partido';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            MENSAJEALERT.classList.add('d-none');
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_PARTIDO.value = ROW.id_partido;
            FECHA_PARTIDO.value = ROW.fecha_partido;
            CANCHA.value = ROW.cancha_partido;
            RESULTADO_PARTIDO.value = ROW.resultado_partido;
            LOCALIDAD.value = ROW.localidad_partido;
            TIPO_RESULTADO_PARTIDO.value = ROW.tipo_resultado_partido;
            console.log(ROW.id_equipo);
            IMAGENES_EQUIPOS = await fillSelectImage(PARTIDO_API, 'readEquipos', 'equipos', ROW.id_equipo);
            IMAGENES_RIVALES = await fillSelectImage(PARTIDO_API, 'readRivales', 'rival', ROW.id_rival);
            await fillSelect(PARTIDO_API, 'readJornadas', 'jornada', ROW.id_jornada);
            LOGO1.src = `${SERVER_URL}images/equipos/${ROW.logo_equipo}`;
            LOGO2.src = `${SERVER_URL}images/rivales/${ROW.logo_rival}`;
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        SAVE_MODAL.show();
        MODAL_TITLE2.textContent = 'Actualizar partido';
    }
}

/*
* Función asíncrona para eliminar un registro.
* Parámetros: id (identificador del registro seleccionado).
* Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el partido de forma permanente?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('idPartido', id);
            console.log(id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(PARTIDO_API, 'deleteRow', FORM);
            console.log(DATA.status);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se muestra un mensaje de éxito.
                await sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                fillCards();
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
* Función asíncrona para llenar las cartas con los registros disponibles.
* Parámetros: form (formulario de búsqueda).
* Retorno: ninguno.
*/
async function fillCards(form = null) {
    const lista_datos = [
        {
            equipo: 'Leones',
            rival: 'Tigres',
            fechaPartido: '15 de marzo del 2024',
            resultado_partido: '3-1',
            localidad: 'Visitante',
            id: 1,
            id_equipo: 1,
            resultado: '5 : 2',
            logo: '../../../../resources/img/svg/icons_dashboard/logo_gol.svg',
            logo_rival: '../../../../resources/img/svg/icons_dashboard/logo_rival.svg',
        },
        {
            equipo: 'Leones',
            rival: 'Tigres',
            fechaPartido: '15 de marzo del 2024',
            resultado_partido: '3-1',
            localidad: 'Visitante',
            id: 1,
            id_equipo: 1,
            resultado: '5 : 2',
            logo: '../../../../resources/img/svg/icons_dashboard/logo_gol.svg',
            logo_rival: '../../../../resources/img/svg/icons_dashboard/logo_rival.svg',
        },
        {
            equipo: 'Leones',
            rival: 'Tigres',
            fechaPartido: '15 de marzo del 2024',
            resultado_partido: '3-1',
            localidad: 'Visitante',
            id: 1,
            id_equipo: 1,
            resultado: '5 : 2',
            logo: '../../../../resources/img/svg/icons_dashboard/logo_gol.svg',
            logo_rival: '../../../../resources/img/svg/icons_dashboard/logo_rival.svg',
        },
        {
            equipo: 'Leones',
            rival: 'Tigres',
            fechaPartido: '15 de marzo del 2024',
            resultado_partido: '3-1',
            localidad: 'Visitante',
            id: 1,
            id_equipo: 1,
            resultado: '5 : 2',
            logo: '../../../../resources/img/svg/icons_dashboard/logo_gol.svg',
            logo_rival: '../../../../resources/img/svg/icons_dashboard/logo_rival.svg',
        }
    ];
    const cargarCartas = document.getElementById('matches_cards');

    try {
        cargarCartas.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll2';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(PARTIDO_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                let resultado = row.tipo_resultado_partido;
                const pendienteHtml = resultado === 'Pendiente' ? '<p class="text-warning fw-semibold mb-0">Pendiente</p>' : '';
                const cardsHtml = `<div class="col-md-6 col-sm-12">
                    <div class="tarjetas shadow p-4">
                        <div class="row">
                            <div class="col-auto">
                                <img src="../../../resources/img/svg/calendar.svg" alt="">
                            </div>
                            <div class="col">
                                <p class="fw-semibold mb-0">${row.fecha}</p>
                                <p class="small">${row.localidad_partido}</p>
                                ${pendienteHtml}
                            </div>
                        </div>
                        <div class="row align-items-center">
                            <div class="col-4">
                                <img src="${SERVER_URL}images/equipos/${row.logo_equipo}" class="img">
                                <p class="small mt-3">${row.nombre_equipo}</p>
                            </div>
                            <div class="col-4">
                                <h2 class="fw-semibold">${row.resultado_partido}</h2>
                            </div>
                            <div class="col-4">
                                <img src="${SERVER_URL}images/rivales/${row.logo_rival}" class="img">
                                <p class="small mt-3">${row.nombre_rival}</p>
                            </div>
                        </div>
                        <hr>
                        <button class="btn bg-yellow-principal-color text-white btn-sm rounded-3 mb-3" onclick="openUpdate(${row.id_partido})">
                            Editar partido
                        </button>
                        <button class="btn bg-blue-principal-color text-white btn-sm rounded-3 mb-3" onclick="seeModal(${row.id_partido})">
                            Más información
                        </button>
                        <button class="btn bg-red-cream-color text-white btn-sm rounded-3 mb-3" onclick="openDelete(${row.id_partido})">
                            Eliminar
                        </button>
                    </div>
                </div>`;
                cargarCartas.innerHTML += cardsHtml;
            });
        }
        else {
            sweetAlert(4, DATA.error, true);
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        // Mostrar materiales de respaldo
        lista_datos.forEach(row => {
            const cardsHtml = `<div class="col-md-6 col-sm-12">
    <div class="tarjetas shadow p-4">
        <div class="row">
            <div class="col-auto">
                <img src="../../../resources/img/svg/calendar.svg" alt="">
            </div>
            <div class="col">
                <p class="fw-semibold mb-0">${row.fechaPartido}</p>
                <p class="small">${row.localidad}</p>
            </div>
        </div>
        <div class="row align-items-center">
            <div class="col-4">
                <img src="${row.logo}" class="img">
                <p class="small mt-3">${row.equipo}</p>
            </div>
            <div class="col-4">
                <h2 class="fw-semibold">${row.resultado}</h2>
            </div>
            <div class="col-4">
                <img src="${row.logo_rival}" class="img">
                <p class="small mt-3">${row.rival}</p>
            </div>
        </div>
        <hr>
        <button class="btn bg-yellow-principal-color text-white btn-sm rounded-3 mb-3"
            onclick="openUpdate(${row.id_partido})">
            Editar partido
        </button>
        <button class="btn bg-blue-principal-color text-white btn-sm rounded-3 mb-3"
            onclick="seeModal(${row.id_partido})">
            Más información
        </button>
        <button class="btn bg-red-cream-color text-white btn-sm rounded-3 mb-3"
            onclick="openDelete(${row.id_partido})">
            Eliminar
        </button>
    </div>
</div>
`;
            cargarCartas.innerHTML += cardsHtml;
        });
    }
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const adminHtml = await loadComponent('../components/matches.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = adminHtml;
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Partidos';
    fillCards();
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal'),
        MODAL_TITLE2 = document.getElementById('modalTitle');

    SEE_MODAL = new bootstrap.Modal('#seeModal'),
        MODAL_TITLE = document.getElementById('modalTitle2'),
        LOGO_EQUIPO_SEE = document.getElementById('logo_equipo'),
        LOGO_RIVAL_SEE = document.getElementById('logo_rival');

    EQUIPO_SEE = document.getElementById('equipos_see');
    RIVAL_SEE = document.getElementById('rival_see');
    FECHA_PARTIDO_SEE = document.getElementById('fechaPartido_see');
    CANCHA_SEE = document.getElementById('cancha_see');
    RESULTADO_PARTIDO_SEE = document.getElementById('resultado_see');
    LOCALIDAD_SEE = document.getElementById('localidad_see');
    TIPO_RESULTADO_PARTIDO_SEE = document.getElementById('tipoResultado_see');
    JORNADA_SEE = document.getElementById('jornada_see');
    SEE_FORM = document.getElementById('seeForm');
    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        ID_PARTIDO = document.getElementById('idPartido'),
        EQUIPO = document.getElementById('equipos'),
        RIVAL = document.getElementById('rival'),
        FECHA_PARTIDO = document.getElementById('fechaPartido'),
        FECHA_PARTIDOS = document.getElementById('fechaPartidos'),
        CANCHA = document.getElementById('cancha'),
        RESULTADO_PARTIDO = document.getElementById('resultado'),
        LOCALIDAD = document.getElementById('localidad'),
        LOGO1 = document.getElementById('logo1'),
        LOGO2 = document.getElementById('logo2'),
        MENSAJE = document.getElementById('passwordHelpBlock'),
        MENSAJEALERT = document.getElementById('mensajeAlert'),
        TIPO_RESULTADO_PARTIDO = document.getElementById('tipoResultado');

    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica que el resultado partido tenga sentido con el tipo de resultado
        RESULTADO_PARTIDO.disabled = false;
        const str = RESULTADO_PARTIDO.value;
        const parts = str.split("-");
        const equipo = parts[0];
        const rival = parts[1];
        const mensaje = MENSAJEALERT.classList.remove('d-none');

        if ((TIPO_RESULTADO_PARTIDO.value == 'Victoria') && ((equipo < rival) || (equipo == rival))) {
            sweetAlert(2, 'El resultado no coincide con el tipo de resultado', false);
            mensaje;
            return;
        }
        if ((TIPO_RESULTADO_PARTIDO.value == 'Derrota') && ((equipo > rival) || (equipo == rival))) {
            sweetAlert(2, 'El resultado no coincide con el tipo de resultado', false);
            mensaje;
            return;
        }
        if ((TIPO_RESULTADO_PARTIDO.value == 'Empate') && (!(equipo == rival))) {
            sweetAlert(2, 'El resultado no coincide con el tipo de resultado', false);
            mensaje;
            return;
        }
        // Se verifica la acción a realizar.
        (ID_PARTIDO.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM);
        console.log('antes de saltar a la api' + FORM);
        console.log('antes de saltar a la api' + FECHA_PARTIDO.value);
        console.log('antes de saltar a la api' + action);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(PARTIDO_API, action, FORM);
        console.log('despues de saltar a la api' + DATA.status + ' ' + DATA.message);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se cierra la caja de diálogo.
            SAVE_MODAL.hide();
            // Se muestra un mensaje de éxito.
            sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            fillCards();
        } else {
            console.log(DATA);
            sweetAlert(2, DATA.error, false);
            console.error(DATA.exception);
        }
    });

    // Método para el evento change del campo select equipos
    EQUIPO.addEventListener('change', (event) => {
        // Obtiene el valor seleccionado del elemento select
        const selectedValue = event.target.value;

        // Busca la imagen correspondiente en el arreglo de IMAGENES_EQUIPOS
        const selectedImage = IMAGENES_EQUIPOS.find(image => image.id == selectedValue);

        // Si se encuentra la imagen, actualiza el atributo src del elemento img
        if (selectedImage) {
            LOGO1.src = `${SERVER_URL}images/equipos/${selectedImage.imagen}`;
        }
    });

    // Método para el evento change del campo select rivales
    RIVAL.addEventListener('change', (event) => {
        // Obtiene el valor seleccionado del elemento select
        const selectedValue = event.target.value;

        // Busca la imagen correspondiente en el arreglo de IMAGENES_EQUIPOS
        const selectedImage = IMAGENES_RIVALES.find(image => image.id == selectedValue);

        // Si se encuentra la imagen, actualiza el atributo src del elemento img
        if (selectedImage) {
            LOGO2.src = `${SERVER_URL}images/rivales/${selectedImage.imagen}`;
        }
    });

    // Método para el evento change del campo select Tipo de resultado
    TIPO_RESULTADO_PARTIDO.addEventListener('change', (event) => {
        // Obtiene el valor seleccionado del elemento select
        const selectedValue = event.target.value;

        if (selectedValue == 'Pendiente') {
            RESULTADO_PARTIDO.value = '0-0';
            RESULTADO_PARTIDO.disabled = true;
        }
        else {
            RESULTADO_PARTIDO.disabled = false;
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
        fillCards(FORM);
    });

    vanillaTextMask.maskInput({
        inputElement: document.getElementById('resultado'),
        mask: [/\d/, '-', /\d/]
    });

    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    })
};