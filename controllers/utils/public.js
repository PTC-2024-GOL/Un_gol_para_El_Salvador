/*
* Controlador de uso general en las páginas web del sitio privado.
* Sirve para manejar la plantilla del encabezado y pie del documento.
*/

// Constante para establecer el elemento del contenido principal.
const MAIN = document.querySelector('main');
let MAINCONTENT = ``;
const FOOTER = document.querySelector('footer');
const EQUIPOS_API = 'services/public/equipos.php';
let equiposAgrupado = [];
let EQUIPOS = 0;

MAINCONTENT = `
    <div id="menu">
    <nav class="navbar sticky-top navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand fs-6 text-light fw-semibold" href="index.html">
          <img src="../../../resources/img/svg/logos/logo_blanco.svg" width="60px"> Un gol para El Salvador
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        </ul>
                
        <!--/////////////////////////////////////////////////////////////////////////////-->
       
        <ul class="navbar-nav ">
           <div class="nav-item me-5">  
             <button class="nav-link active text-light" aria-current="page" href="soccer_teams.html" onClick = "mostrarEquipos()">
                <img src="../../../resources/img/svg/icons_menu/iconF.svg" class="me-3"> 
                Equipos
              </button>
           </div>
           
           <div class="nav-item me-5">  
             <a class="nav-link active text-light" aria-current="page" href="about_us.html">Sobre nosotros</a>
           </div>
           
           <div class="nav-item me-5">  
             <a class="nav-link active text-light" aria-current="page" href="contact_us.html">Contáctanos</a>
           </div>
           
           <div class="d-flex" id="searchDiv">
              <input class="form-control me-2" type="search" id="search" placeholder="Buscar partido..." aria-label="Search">
              <button class="btn btn-outline-light me-3" id="btnBuscar">Buscar</button>
          </div>
        </ul>
        </div>
    </div>
</nav>
</div>
`;

/* Función asíncrona para cargar el encabezado y pie del documento.
* Parámetros: ninguno.
* Retorno: ninguno.
*/

const isSearchPage = () => {
    const currentPage = window.location.pathname.split('/').pop();
    return currentPage === 'search.html';
};

const loadTemplate = async () => {
    let searchDiv;

    // Se agrega el encabezado de la página web antes del contenido principal.
    MAIN.insertAdjacentHTML('beforebegin',
        MAINCONTENT
    );

    // Se agrega el encabezado de la página web antes del contenido principal.
    FOOTER.insertAdjacentHTML('afterbegin', `
         <nav id="navbar" class="sticky-bottom navbar-expand-lg pb-4 pt-4">
             <div class="container-fluid">
                <div class="row mb-5 mt-4">
                    <div class="col-md-4">
                        <div class="d-flex justify-content-center align-items-center">
                            <img src="../../../resources/img/svg/logos/logo_blanco.svg" width="70px">
                            <p class="text-light mt-3 fs-4 fw-light">Un gol para El Salvador</p>
                        </div>
                        <div class="d-flex justify-content-center align-items-center">
                           <a href="https://www.facebook.com/UnGolParaElsalvador">
                            <img src="../../../resources/img/png/Facebook.png" width="35px">
                           </a>
                           <a>
                            <img src="../../../resources/img/png/WhatsApp.png" width="40px">
                           </a>
                           <a href="https://www.instagram.com/ungolparaelsalvador/?hl=es">
                            <img src="../../../resources/img/png/Instagram.png" width="35px">
                           </a>
                           <a href="https://www.tiktok.com/@ungolparaelsalvador?lang=es">
                            <img class="ms-1" src="../../../resources/img/png/tik-tok.png" width=30px">
                           </a>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="mt-3 mb-2">
                            <h6 class="text-light fw-bold">Contácto</h6>
                            <p class="text-light">(+503) 6023 5586</p>
                        </div>
                        <div class="mt-3 mb-2">
                            <h6 class="text-light fw-bold">Dirección</h6>
                            <p class="text-light">Antiguo Cuscatlán, El Salvador</p>
                        </div>
                        <div class="mt-3 mb-2">
                            <h6 class="text-light fw-bold">Correo electrónico</h6>
                            <p class="text-light">ungolparaelsalvador@gmail.com</p>
                        </div>
                    </div>
                     <div class="col-md-4">
                        <div class="mt-3 mb-2">
                            <h6 class="text-light fw-bold">Desarrolladores</h6>
                            <ul>
                                <li class="text-light">Susan Castillo</li>
                                <li class="text-light">Juan Flores</li>
                                <li class="text-light">Xochilt López</li>
                                <li class="text-light">Eduardo Cubías</li>
                                <li class="text-light">Joel Mena</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="text-center">
                    <span class="navbar-text text-light mx-auto">
                        © 2024 Un Gol para El Salvador. Todos los derechos reservados.
                    </span>
                </div>
             </div>
         </nav>
`)

    const searchButton = document.getElementById('btnBuscar'); // Selecciona el botón por su ID
    const searchField = document.getElementById('search'); // Campo de búsqueda
    searchDiv =  document.getElementById('searchDiv');

    // Verifica si está en la página de búsqueda y oculta el campo de búsqueda si es necesario
    if (isSearchPage()) {
        searchDiv.classList.add('d-none'); // Oculta el contenedor del buscador
    }


    searchButton.addEventListener('click', (event) => {
        event.preventDefault(); // Evita cualquier comportamiento predeterminado
        const search = searchField.value; // Obtiene el valor de búsqueda
        if (search) {
            window.location.href = `search.html?search=${search}`; // Redirige a la página de búsqueda con la consulta
            searchDiv.classList.add('d-none');

        } else {
            alert('Por favor, ingrese un término de búsqueda'); // Muestra un mensaje si el campo está vacío
        }
    });
}

const mostrarEquipos = async () => {
    if (EQUIPOS === 0) {

        EQUIPOS = 1;
        const DATA = await fetchData(EQUIPOS_API, 'readEquipos');
        if (DATA.status) {
            const EQUIPOS = DATA.dataset;

            // Crear un objeto para agrupar los equipos por categoría
            const equiposPorCategoria = {};

            // Iterar sobre cada equipo y agruparlo por su 'nombre_categoria'
            EQUIPOS.forEach(equipo => {
                const { ID, NOMBRE, logo_equipo, nombre_categoria } = equipo;

                // Si la categoría no existe en el objeto, la creamos
                if (!equiposPorCategoria[nombre_categoria]) {
                    equiposPorCategoria[nombre_categoria] = [];
                }

                // Agregamos el equipo a la categoría correspondiente
                equiposPorCategoria[nombre_categoria].push({
                    id: ID,
                    nombre: NOMBRE,
                    logo: logo_equipo
                });
            });

            // Convertir el objeto en un arreglo de objetos
            const equiposAgrupados = Object.keys(equiposPorCategoria).map(categoria => ({
                categoria,
                equipos: equiposPorCategoria[categoria]
            }));

            equiposAgrupado = equiposAgrupados;
            const anchoPantalla = window.innerWidth;

            if (anchoPantalla <= 990) {
                equipos_dimension_menos_990();
            } else {
                equipos_dimension_mas_990();
            }
        }
    }
    else {
        const ups = document.getElementsByClassName('equipos');
        // Verificamos si hay elementos
        if (ups.length > 0) {
            // Eliminar todos los elementos con la clase 'equipos'
            Array.from(ups).forEach(upsElement => {
                upsElement.remove(); // Eliminar el elemento
            });
        }

        EQUIPOS = 0;
    }
};

const equipos_dimension_mas_990 = () => {
    let contenido = ``;

    // Recorrer cada categoría y sus equipos
    equiposAgrupado.forEach(categoriaObj => {
        // Crear el contenedor de la categoría
        contenido += `<div class="col-12 col-md-6 col-lg-2 mb-4">`; // 6 columnas en pantallas medianas, 2 en grandes
        // Crear el título de la categoría
        contenido += `<h5 class="text-light">${categoriaObj.categoria}</h5>`;

        // Crear la lista de equipos sin puntos (list-unstyled)
        contenido += `<ul class="list-unstyled">`;

        // Iterar por cada equipo en la categoría
        categoriaObj.equipos.forEach(equipo => {
            // Agregar cada equipo como un item de lista con clases de Bootstrap
            contenido += `<li class="text-light fs-6 py-3 d-flex align-items-center">
                <button class="btn p-0 text-light d-flex align-items-center" onClick = "partidoEspecifico(${equipo.id})">
                <img src="${SERVER_URL}images/equipos/${equipo.logo}" alt="logo" class="rounded-circle me-2" style="width: 30px; height: 30px;">
                <span class="text-start">${equipo.nombre}</span>
                </button>
            </li>`;
        });

        contenido += `</ul>`;
        contenido += `</div>`;
    });

    // Insertar el contenido en el DOM
    MAIN.insertAdjacentHTML('beforebegin', `
        <nav class="navbar sticky-top navbar-expand-lg bg-body-tertiary px-3 equipos esconder">
            <div class="container-fluid">
                <div class="row">
                    <!-- El <p> ocupa toda la fila -->
                    <p class="text-light fw-semibold fs-5 text-start col-12 mb-3">Equipos de la academia por categoría:</p>

                    <!-- El contenido de las categorías -->
                    <div class="col-12 row" id="contenedor">
                        ${contenido}
                    </div>

                    <!-- Línea separadora blanca -->
                    <div class="col-12">
                        <hr class="text-white my-4" style="height: 3px; border: none; background-color: white;">
                    </div>
                </div>
            </div>
        </nav>
    `);
};

const partidoEspecifico = async (id) => {
    window.location.href = `matches.html?id=${id}`;
}

const equipos_dimension_menos_990 = () => {
    let contenido = ``;

    equiposAgrupado.forEach(categoriaObj => {
        // Crear el contenedor de la categoría
        contenido += `<div class="col-12 nav-item">`; // 1 columna en pantallas pequeñas
        
        // Crear el título de la categoría
        contenido += `<h5 class="text-light py-1 text-start">${categoriaObj.categoria}</h5>`;
        
        // Crear la lista de equipos sin puntos (list-unstyled)
        contenido += `<ul class="list-unstyled">`;
        
        // Iterar por cada equipo en la categoría
        categoriaObj.equipos.forEach(equipo => {
            // Agregar cada equipo como un item de lista con clases de Bootstrap
            contenido += `<li class="text-light fs-6 py-1 d-flex align-items-center">
                <button class="btn p-0 text-light d-flex align-items-center" onClick="partidoEspecifico(${equipo.id})" style="text-align: left;">
                    <img src="${SERVER_URL}images/equipos/${equipo.logo}" alt="logo" class="rounded-circle me-2" style="width: 30px; height: 30px;">
                    <span class="text-start">${equipo.nombre}</span>
                </button>
            </li>`;
        });
        
        contenido += `</ul>`;
        contenido += `</div>`;
    });    
    
    const div = document.getElementById('menu');
    div.remove();
    // Reemplazar el contenido de MAIN
    MAIN.insertAdjacentHTML('beforebegin', `
    <nav class="navbar sticky-top navbar-expand-lg bg-body-tertiary row equipos equipo">
        <div class="d-flex text-start col-12">
            <a class="navbar-brand fs-6 text-light fw-semibold" href="index.html">
          <img src="../../../resources/img/svg/logos/logo_blanco.svg" width="60px"> Un gol para El Salvador
      </a>
        </div>
        <hr>
        <button type="button" id="volver" class="btn btn-link text-white text-start col-12 mb-4 px-5">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left" viewBox="0 0 16 16">
  <path d="M10 12.796V3.204L4.519 8zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753"/>
</svg>  
        </button>
        <div class="container-fluid mb-4 px-5">
            <ul class="navbar-nav">
                ${contenido}
            </ul>
        </div>
    </nav>
    `);

    // Manejar el evento click del botón "volver"
    // Manejar el evento click del botón "volver"
    const boton = document.getElementById('volver');
    boton.addEventListener('click', () => {
        const ups = document.getElementsByClassName('equipos');
        // Verificamos si hay elementos
        if (ups.length > 0) {
            // Eliminar todos los elementos con la clase 'equipos'
            Array.from(ups).forEach(upsElement => {
                upsElement.remove(); // Eliminar el elemento
            });
            MAIN.insertAdjacentHTML('beforebegin', MAINCONTENT); // Insertar el navbar principal
        }
        EQUIPOS = 0; // Reiniciar el estado de EQUIPOS
    });

};

//Cargamos el navbar cuando cargue la pagina.
window.onload = async function () {
    await loadTemplate()
}


let lastScrollTop = 0; // Almacena la posición del scroll anterior

window.addEventListener('scroll', () => {
    const equiposBar = document.querySelector('.equipo');
    const equipos2 = document.querySelector('.esconder');
    if (window.scrollY > lastScrollTop) {
        if (equiposBar !== null) {
            // Usuario se desplaza hacia abajo
            equiposBar.classList.add('hidden');
        }
        else {
            //equipos2.classList.add('hidden');
            //console.log('Entre 2', equiposBar);
            const ups = document.getElementsByClassName('equipos');
            // Verificamos si hay elementos
            if (ups.length > 0) {
                // Eliminar todos los elementos con la clase 'equipos'
                Array.from(ups).forEach(upsElement => {
                    upsElement.remove(); // Eliminar el elemento
                });
            }

            EQUIPOS = 0;
        }
    } else {
        if (equiposBar !== null) {
            // Usuario se desplaza hacia abajo
            equiposBar.classList.remove('hidden');
        }
        else {
            equipos2.classList.remove('hidden');
        }
    }
    lastScrollTop = window.scrollY; // Actualiza la posición anterior
});
