/*
* Controlador de uso general en las páginas web del sitio privado.
* Sirve para manejar la plantilla del encabezado y pie del documento.
*/

// Constante para establecer el elemento del contenido principal.
const MAIN = document.querySelector('main');
const FOOTER = document.querySelector('footer');
const EQUIPOS_API = 'services/public/equipos.php';

/* Función asíncrona para cargar el encabezado y pie del documento.
* Parámetros: ninguno.
* Retorno: ninguno.
*/
const loadTemplate = async () => {
    // Se agrega el encabezado de la página web antes del contenido principal.
    MAIN.insertAdjacentHTML('beforebegin', `
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
                      <img src="../../../resources/img/svg/icons_menu/IconF.svg" class="me-3"> 
                      Equipos
                    </button>
                 </div>
                 
                 <div class="nav-item me-5">  
                   <a class="nav-link active text-light" aria-current="page" href="about_us.html">Sobre nosotros</a>
                 </div>
                 
                 <div class="nav-item me-5">  
                   <a class="nav-link active text-light" aria-current="page" href="contact_us.html">Contáctanos</a>
                 </div>
                 
                 <form class="d-flex" role="search">
                    <input class="form-control me-2" type="search" placeholder="Buscar partido..." aria-label="Search">
                    <button class="btn btn-outline-light me-3" type="submit">Buscar</button>
                </form>
              </ul>
                </div>
          </div>
    </nav>
`);

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
                            <img src="../../../resources/img/png/Instagram.png" width=35px">
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
`);
}

const mostrarEquipos = async () => {
    const DATA = await fetchData(EQUIPOS_API, 'readEquipos');
    if (DATA.status) {
        const EQUIPOS = DATA.dataset;

        // Crear un objeto para agrupar los equipos por categoría
        const equiposPorCategoria = {};

        // Iterar sobre cada equipo y agruparlo por su 'nombre_categoria'
        EQUIPOS.forEach(equipo => {
            const { ID, NOMBRE, nombre_categoria } = equipo;

            // Si la categoría no existe en el objeto, la creamos
            if (!equiposPorCategoria[nombre_categoria]) {
                equiposPorCategoria[nombre_categoria] = [];
            }

            // Agregamos el equipo a la categoría correspondiente
            equiposPorCategoria[nombre_categoria].push({
                id: ID,
                nombre: NOMBRE
            });
        });

        // Convertir el objeto en un arreglo de objetos
        const equiposAgrupados = Object.keys(equiposPorCategoria).map(categoria => ({
            categoria,
            equipos: equiposPorCategoria[categoria]
        }));

        console.log(equiposAgrupados);

        const anchoPantalla = window.innerWidth;
        console.log(anchoPantalla);
        if (anchoPantalla <= 990) {
            equipos_dimension_menos_990();
        } else {
            equipos_dimension_mas_990();
        }
    }
};

const equipos_dimension_mas_990 = () => {
    console.log('equipos_dimension_mas_990');
};
const equipos_dimension_menos_990 = () => {
    console.log('equipos_dimension_menos_990');
};
//Cargamos el navbar cuando cargue la pagina.
window.onload = async function () {
    await loadTemplate()
}


