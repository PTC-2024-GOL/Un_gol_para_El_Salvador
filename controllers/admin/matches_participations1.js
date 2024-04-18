let ID_EQUIPO,
    IMAGEN_EQUIPO,
    NOMBRE_EQUIPO;

// Constantes para completar las rutas de la API.
const API = '';
const SOCCER_TEAM_API = '';
/* 
Para cargar una lista con la api en php, se hara referencia al metodo ReadAll, del archivo de la api con el cual se quiera
cargar la lista, en este caso en especifico, API se ocuparia para referenciar el link de la api que contenga todos los metodos
para las jornadas en si, mientras que TEMPORADA_API, se ocupara para referenciar el link de la api que contenga el metodo 
ReadAll con el fin de cargar la lista "reciclando" una api que ya existe. 
*/

async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

async function fillCards(form = null) {
    const lista_datos = [
        {
            imagen: '../../../../resources/img/svg/icons_dashboard/logo_gol.svg',
            nombre: 'Un gol para El Salvador',
            id: 1,
        },
        {
            imagen: '../../../../resources/img/svg/icons_dashboard/logo_gol.svg',
            nombre: 'Un gol para El Salvador',
            id: 1,
        },
        {
            imagen: '../../../../resources/img/svg/icons_dashboard/logo_gol.svg',
            nombre: 'Un gol para El Salvador',
            id: 1,
        },
        {
            imagen: '../../../../resources/img/svg/icons_dashboard/logo_gol.svg',
            nombre: 'Un gol para El Salvador',
            id: 1,
        }
    ];
    const cargarCartas = document.getElementById('cards');

    try {
        cargarCartas.innerHTML = '';
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        console.log(form);
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(API, action, form);
        console.log(DATA);

        if (DATA.status) {
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const cardsHtml =  `
                <div class="col-md-3 col-sm-12">
                  <div class="tarjetas-equipos shadow bg-skyBlue-pastel-color" onclick="goToMatches(${row.ID_EQUIPO})"> 
                    <img src="${row.IMAGEN_EQUIPO}" id="imagenEquipo" class="rounded-circle col-8 p-4"> 
                    <p class="titulo-equipo text-light p-2" id="tituloEquipo">${row.NOMBRE_EQUIPO}</p> 
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
            const cardsHtml = `
            <div class="col-md-3 col-sm-12">
              <div class="tarjetas-equipos bg-skyBlue-pastel-color" onclick="goToMatches(${row.id}, '${row.nombre}')"> 
                <img src="${row.imagen}" id="imagenEquipo" class="rounded-circle col-8 p-4"> 
                <p class="titulo-equipo text-light p-2 fw-semibold" id="tituloEquipo">${row.nombre}</p> </div>
            </div>
          `;
            cargarCartas.innerHTML += cardsHtml;
        });
    }
}

// Creamos una funcion que recibe como parametro el id del equipo que fue seleccionado
function goToMatches(idEquipo, nombreEquipo) {

    // Redirecciona a la otra pantalla y manda tambien el id del equipo
    window.location.href = `../pages/matches_participations2.html?idEquipo=${idEquipo}&nombreEquipo=${nombreEquipo}`;

}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const participacionesHtml = await loadComponent('../components/matches_participations1.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = participacionesHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Participaciones'; 
    fillCards();
};




