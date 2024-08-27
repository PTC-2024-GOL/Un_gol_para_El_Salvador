let TOTAL;
let MORA;
let JUGADOR;
let SIN_BECA;
let BECA;
let MEDIA_BECA;

let SEE_MODAL;
let SHOW_GRAPHIC;

// Constantes para completar las rutas de la API.
const PAGO_API = 'services/admin/pagos.php';

async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}


const graficoLinealIngresos = async () => {

    // Mandamos la peticion a la API para traernos la informacion correspondiente al total de ingreos por mes
    const DATA = await fetchData(PAGO_API, 'totalMoneyMounth');

    // Declaramos un arreglo que guardara la data de la api
    let datosApi = [];

    // recorremos todos los datos que vienen de la api y retorna los datos del mes y nota
    if (DATA.status) {
        datosApi = DATA.dataset.map((item) => {
            return {
                mes: item.mes,
                cantidad: item.cantidad
            };
        });
    }

    // Meses del año
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    // Declaramos una variables que tendra todos los meses del año, estos para asegurarnos de que aparezcan todos los meses.
    // en dado caso en un mes no venga cantidad, solo se pondra cero
    const datosCompletos = meses.map(mes => {
        const datoMes = datosApi.find(d => d.mes === mes);
        return {
            mes: mes,
            cantidad: datoMes ? datoMes.cantidad : 0 // Si no hay datos para el mes, se pone cero
        };
    });

    let mes = [];
    let cantidad = [];
    datosCompletos.forEach(filter => {
        mes.push(filter.mes);
        cantidad.push(filter.cantidad);
    });
    // Si ocurre un error, se utilizan los datos de ejemplo definidos arriba.
    lineGraph('analisis', mes, cantidad, 'Ingresos por meses ($)', 'Ingresos mensuales que han habido durante el presente año' );

}

const total = async () => {
    const DATA = await fetchData(PAGO_API, 'totalMoney');
    if (DATA.status) {
        TOTAL.textContent = '$' + DATA.dataset.total_pagos;
    } else {
        TOTAL.textContent = DATA.error;
    }
}

const totalMora = async () => {
    let mes = document.getElementById('mes').value;

    const FORM = new FormData();
    FORM.append('mes', mes);

    const DATA = await fetchData(PAGO_API, 'totalMoneyMora', FORM);

    if (DATA.status) {
        MORA.textContent = DATA.dataset.total_mora;
    } else {
        MORA.textContent = DATA.message;
    }
}

const totalJugadores = async () => {
    const DATA = await fetchData(PAGO_API, 'totalPlayers');
    if (DATA.status) {
        JUGADOR.textContent = DATA.dataset.total;
    } else {
        JUGADOR.textContent = DATA.error;
    }
}

const sinBeca = async () => {
    const DATA = await fetchData(PAGO_API, 'noScholarships');
    if (DATA.status) {
        SIN_BECA.textContent = DATA.dataset.becado;
    } else {
        SIN_BECA.textContent = DATA.error;
    }
}

const mediaBeca = async () => {
    const DATA = await fetchData(PAGO_API, 'halfScholarships');
    if (DATA.status) {
        MEDIA_BECA.textContent = DATA.dataset.becado;
    } else {
        MEDIA_BECA.textContent = DATA.error
    }
}

const becaCompleta = async () => {
    const DATA = await fetchData(PAGO_API, 'completeScholarships');
    if (DATA.status) {
        BECA.textContent = DATA.dataset.becado;
    }
}

const seeGraphic = async () => {
    SEE_MODAL.show();
    MODAL_TITLE.textContent = 'Becas';
}

const seeBecas = async () =>{
    let YEAR = document.getElementById('becasSelect');
    let SELECTED_YEAR = YEAR.options[YEAR.selectedIndex].text;


    const FORM = new FormData();

    FORM.append('año',SELECTED_YEAR);

    console.log(SELECTED_YEAR)

    const DATA = await fetchData(PAGO_API, 'graphicBecas', FORM);

    if (DATA.status) {
        SHOW_GRAPHIC.classList.add('d-none');
        let GRAPHIC_DATA = DATA.dataset;
        let becado = [];
        let total = [];
        GRAPHIC_DATA.forEach(filter => {
            becado.push(filter.becado);
            total.push(filter.total);
        });
        console.log(GRAPHIC_DATA);
        // Si ocurre un error, se utilizan los datos de ejemplo definidos arriba.
        barGraph1('graphic', becado, total, 'Total de becados', 'Total de jugadores por tipo de beca');
    } else {
        console.log(DATA.error)
    }
}

window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const lesionHtml = await loadComponent('../components/earnings.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = lesionHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Ingresos';
    await graficoLinealIngresos();

    TOTAL = document.getElementById('total');
    MORA = document.getElementById('mora');
    JUGADOR = document.getElementById('jugador');
    SIN_BECA = document.getElementById('sinBeca');
    BECA = document.getElementById('becaCompleta');
    MEDIA_BECA = document.getElementById('mediaBeca');

    await fillSelect(PAGO_API, 'years', 'becasSelect');

    SEE_MODAL = new bootstrap.Modal('#seeModal');
        MODAL_TITLE = document.getElementById('modalTitle');

    SHOW_GRAPHIC = document.getElementById('dnoneGraphic');

    await total();
    await totalJugadores();
    await sinBeca();
    await mediaBeca();
    await becaCompleta();
}