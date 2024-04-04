/*
* Controlador de uso general en las páginas web del sitio privado.
* Sirve para manejar la plantilla del encabezado y pie del documento.
*/

// Constante para completar la ruta de la API.
const USER_API = 'services/admin/administrador.php';
// Constante para establecer el elemento del contenido principal.
const MAIN = document.querySelector('main');
MAIN.style.paddingTop = '75px';
MAIN.style.paddingBottom = '100px';
MAIN.classList.add('container');

/* Función asíncrona para cargar el encabezado y pie del documento.
* Parámetros: ninguno.
* Retorno: ninguno.
*/
const loadTemplate = async () => {

// Se agrega el encabezado de la página web antes del contenido principal.
MAIN.insertAdjacentHTML('beforebegin', `
<header>
    <nav class="navbar bg-skyBlue-pastel-color fixed-top sticky-sm-top">
        <div class="container-fluid">
            <button class="navbar-toggler " type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar"
                aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <a class="navbar-brand" href="#">Administradores</a>
            <!-- Imagen de perfil y nombre -->
            <div class="d-none d-sm-block">
                <div class="row align-items-center justify-content-center">
                    <div class="col-auto ">
                        <div>
                            <p class="mb-0 float-end">Chepe Martínez</p>
                        </div>
                        <div>
                            <p class="text-body-secondary small float-end">Administrador</p>
                        </div>
                    </div>
                    <div class="col">
                        <img src="../../../resources/img/svg/avatar.svg" class="rounded-circle" alt="">
                    </div>
                </div>
            </div>
            <!-- Cuerpo -->
            <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel">
                <div class="offcanvas-header">
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"
                        aria-label="Close"></button>
                </div>
                <!-- Cuerpo del nav -->
                <div class="offcanvas-body">
                    <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                        <!-- Fila que contiene el logo centrado en la parte superior del menu -->
                        <div class="row justify-content-center mb-5">
                            <div class="col-auto">
                                <img src="../../../resources/img/svg/logos/logo_blanco.svg" width="140px" alt="">
                            </div>
                        </div>
                        <div class="container ms-2">
                            <!-- Etiqueta para el dashboard -->
                            <li class="nav-item">
                                <a class="nav-link active text-light" aria-current="page" href="#">
                                    <img src="../../../resources/img/svg/icons_menu/dashboard.svg" class="me-3"
                                        alt="">Dashboard</a>
                            </li>
                            <!-- Etiqueta para el usuario -->
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle text-light" href="#" role="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    <img src="../../../resources/img/svg/icons_menu/users.svg" class="me-3" alt="">
                                    Usuarios
                                </a>
                                <ul class="dropdown-menu bg-transparent">
                                    <li><a class="dropdown-item text-light" href="#">Jugadores</a></li>
                                    <li><a class="dropdown-item text-light" href="technical.html">Técnicos</a></li>
                                    <li><a class="dropdown-item text-light" href="admins.html">Usuarios</a></li>
                                </ul>
                            </li>
                            <!-- Etiqueta para el estadisticas -->
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle text-light" href="#" role="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    <img src="../../../resources/img/svg/icons_menu/estadisticas.svg" class="me-3" alt="">
                                    Estadísticas
                                </a>
                                <ul class="dropdown-menu bg-transparent">
                                    <li><a class="dropdown-item text-light" href="#">Jornadas</a></li>
                                    <li><a class="dropdown-item text-light" href="seasons.html">Temporadas</a></li>
                                </ul>
                            </li>
                            <!-- Etiqueta para el entrenamientos -->
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle text-light" href="#" role="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    <img src="../../../resources/img/svg/icons_menu/entrenamientos.svg" class="me-3"
                                        alt="">
                                    Entrenamientos
                                </a>
                                <ul class="dropdown-menu bg-transparent">
                                    <li><a class="dropdown-item text-light" href="#">Entrenamientos</a></li>
                                    <li><a class="dropdown-item text-light" href="#">Contenidos</a></li>
                                    <li><a class="dropdown-item text-light" href="#">Sub contenidos</a></li>
                                    <li><a class="dropdown-item text-light" href="#">Detalles</a></li>
                                    <li><a class="dropdown-item text-light" href="tasks.html">Tareas</a></li>
                                    <li><a class="dropdown-item text-light" href="#">Características de jugadores</a></li>
                                    <li><a class="dropdown-item text-light" href="#">Análisis de características</a></li>
                                    <li><a class="dropdown-item text-light" href="schedules.html">Horarios</a></li>
                                    <li><a class="dropdown-item text-light" href="#">Asistencia</a></li>
                                </ul>
                            </li>
                            <!-- Etiqueta para el equipos -->
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle text-light" href="#" role="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    <img src="../../../resources/img/svg/icons_menu/equipos.svg" class="me-3" alt="">
                                    Equipos
                                </a>
                                <ul class="dropdown-menu bg-transparent">
                                    <li><a class="dropdown-item text-light" href="#">Cuerpos técnicos</a></li>
                                    <li><a class="dropdown-item text-light" href="soccer_team.html">Equipos</a></li>
                                    <li><a class="dropdown-item text-light" href="#">Tipos de jugada</a></li>
                                    <li><a class="dropdown-item text-light" href="#">Tipos de goles</a></li>
                                    <li><a class="dropdown-item text-light" href="#">Participaciones</a></li>
                                    <li><a class="dropdown-item text-light" href="positions.html">Posiciones</a></li>
                                    <li><a class="dropdown-item text-light" href="categories.html">Categorías</a></li>
                                    <li><a class="dropdown-item text-light" href="#">Partidos</a></li>
                                </ul>
                            </li>
                            <!-- Etiqueta para el registro medico -->
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle text-light" href="#" role="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    <img src="../../../resources/img/svg/icons_menu/registro_medico.svg" class="me-3"
                                        alt="">
                                    Registro médico
                                </a>
                            </a>
                            <ul class="dropdown-menu bg-transparent">
                                <li><a class="dropdown-item text-light" href="#">Registro médico</a></li>
                                <li><a class="dropdown-item text-light" href="types_injuries.html">Tipos de lesiones</a></li>
                                <li><a class="dropdown-item text-light" href="typology.html">Tipologías</a></li>
                                <li><a class="dropdown-item text-light" href="#">Sub Tipologías</a></li>
                                <li><a class="dropdown-item text-light" href="#">Lesiones</a></li>
                            </ul>
                            </li>
                            <!-- Etiqueta para pagos -->
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle text-light" href="#" role="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    <img src="../../../resources/img/svg/icons_menu/pay.svg" class="me-3" alt="">
                                    Pagos
                                </a>
                            </a>
                            <ul class="dropdown-menu bg-transparent">
                                <li><a class="dropdown-item text-light" href="#">Pagos</a></li>
                            </ul>
                            </li>

                            <div class="contenedor p-3 rounded-3">
                                <!-- Etiqueta para el Ayuda -->
                                <li class="nav-item">
                                    <a class="nav-link active text-light" aria-current="page" href="#">
                                        <img src="../../../resources/img/svg/icons_menu/help.svg" class="me-3" alt="">
                                        Ayuda</a>
                                </li>
                                <!-- Etiqueta para contactanos -->
                                <li class="nav-item">
                                    <a class="nav-link active text-light" aria-current="page" href="#">
                                        <img src="../../../resources/img/svg/icons_menu/contactanos.svg" class="me-3"
                                            alt="">
                                        contáctanos</a>
                                </li>
                                <!-- Etiqueta para log out -->
                                <li class="nav-item">
                                    <a class="nav-link active text-light" aria-current="page" href="#">
                                        <img src="../../../resources/img/svg/icons_menu/log_out.svg" class="me-3" alt="">
                                        Cerrar sesión</a>
                                </li>
                            </div>
                        </div>
                </div>
                </ul>
            </div>
        </div>
        </div>
    </nav>
</header>
`);
}