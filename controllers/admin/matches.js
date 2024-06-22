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
    JORNADA;
let SEARCH_FORM;

// Constantes para completar las rutas de la API.
const PARTIDO_API = 'services/admin/partidos.php';

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
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    FECHA_PARTIDOS.classList.add('d-none');
    LOGO_EQUIPO_DIV.classList.add('d-none');
    LOGO_RIVAL_DIV.classList.remove('align-items-start');
    LOGO_RIVAL_DIV.classList.add('align-items-center');
    LOGO_RIVAL_DIV.classList.remove('col-sm-6');
    LOGO_RIVAL_DIV.classList.add('col-sm-12');
    ID_PARTIDO.value = null;
    MODAL_TITLE2.textContent = 'Agregar partido';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    await fillSelect(PARTIDO_API, 'readEquipos', 'equipos');
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
            LOGO_RIVAL_SEE.src = `${SERVER_URL}images/partidos/${ROW.logo_rival}`;
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
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idPartido', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(PARTIDO_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar partido';
            // Se prepara el formulario.
            SAVE_FORM.reset();

            FECHA_PARTIDOS.classList.remove('d-none');
            LOGO_EQUIPO_DIV.classList.remove('d-none');
            LOGO_RIVAL_DIV.classList.add('align-items-start');
            LOGO_RIVAL_DIV.classList.remove('align-items-center');
            LOGO_RIVAL_DIV.classList.add('col-sm-6');
            LOGO_RIVAL_DIV.classList.remove('col-sm-12');
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_PARTIDO.value = ROW.id_partido;
            RIVAL.value = ROW.nombre_rival;
            FECHA_PARTIDO.value = ROW.fecha_partido;
            CANCHA.value = ROW.cancha_partido;
            RESULTADO_PARTIDO.value = ROW.resultado_partido;
            LOCALIDAD.value = ROW.localidad_partido;
            FECHA_PARTIDO.disabled = true; // Se deshabilita el campo de fecha.
            TIPO_RESULTADO_PARTIDO.value = ROW.tipo_resultado_partido;
            await fillSelect(PARTIDO_API, 'readEquipos', 'equipos', ROW.id_equipo);
            await fillSelect(PARTIDO_API, 'readJornadas', 'jornada', ROW.id_jornada);
            LOGO1.src = `${SERVER_URL}images/equipos/${ROW.logo_equipo}`;
            LOGO2.src = `${SERVER_URL}images/partidos/${ROW.logo_rival}`;
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
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(PARTIDO_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const cardsHtml = `<div class="col-md-6 col-sm-12">
    <div class="tarjetas shadow p-4">
        <div class="row">
            <div class="col-auto">
                <img src="../../../resources/img/svg/calendar.svg" alt="">
            </div>
            <div class="col">
                <p class="fw-semibold mb-0">${row.fecha}</p>
                <p class="small">${row.localidad_partido}</p>
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
                 <img src="${SERVER_URL}images/partidos/${row.logo_rival}" class="img">
                <p class="small mt-3">${row.nombre_rival}</p>
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
        } else {
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
        LOGO_RIVAL2 = document.getElementById('logoRival'),
        LOGO_EQUIPO_DIV = document.getElementById('logo_equipo_div'),
        LOGO_RIVAL_DIV = document.getElementById('logo_rival_div'),
        TIPO_RESULTADO_PARTIDO = document.getElementById('tipoResultado');

    LOGO_RIVAL2.addEventListener('change', function (event) {
        // Verifica si hay una imagen seleccionada
        if (event.target.files && event.target.files[0]) {
            // con el objeto FileReader lee de forma asincrona el archivo seleccionado
            const reader = new FileReader();
            // Luego de haber leido la imagen seleccionada se nos devuele un objeto de tipo blob
            // Con el metodo createObjectUrl de fileReader crea una url temporal para la imagen
            reader.onload = function (event) {
                // finalmente la url creada se le asigna al atributo src de la etiqueta img
                LOGO2.src = event.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    });
    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Se verifica la acción a realizar.
        (ID_PARTIDO.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM);
        console.log('antes de saltar a la api' + FORM);
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
        fillCards();
    });

    vanillaTextMask.maskInput({
        inputElement: document.getElementById('resultado'),
        mask: [/\d/, '-', /\d/]
    });
};