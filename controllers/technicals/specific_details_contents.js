
let SAVE_MODAL;
let SAVE_FORM,
    JUGADOR,
    SUBTEMA,
    TAREA,
    CANTIDAD_CONTENIDO,
    MINUTOS_TAREA,
    IDDETALLE_CONTENIDO,
    CONTENEDOR_MODAL,
    JUGADORES,
    ID_JUGADOR,
    ID_URL,
    ID_ENTRENAMIENTO,
    ID_EQUIPO,
    ADD_JUGADOR,
    BUSCADOR,
    CONTENEDOR1,
    CONTENEDOR2,
    CONTENIDO1,
    CONTENIDO2,
    ZONA1,
    ZONA2,
    ZONA3,
    OPCIONES,
    OPCIONES_SIN_PARSE,
    ZONA
    ;
let ACTIVATE = '';
let SEARCH_FORM;

let selectJugador;

// Constantes para completar las rutas de la API.
const SD_CONTENTS_API = 'services/technics/detalle_contenido.php';
const JUGADORES_API = '';

let lista_datos = [
    {
        jugadores: "Mario Alboran",
        id: 1,
    },
    {
        jugadores: 'Marco Polo',
        id: 2,
    },
    {
        jugadores: 'Susan Abigail',
        id: 3,
    },
    {
        jugadores: 'Agustin De Tarso',
        id: 4,
    }
];

function eliminarInput(idJugador) {
    const inputEliminar = document.getElementById('nombreAdministrador_' + idJugador);
    const btnEliminar = document.getElementById('btnEliminar_' + idJugador);
    const rowContainer = document.getElementById('rowContainer_' + idJugador);
    if (inputEliminar && btnEliminar && rowContainer) {
        rowContainer.remove();
        inputEliminar.remove();
        btnEliminar.remove();
    }
}

//Aqui esta vacío pero se rellenará a base de que se agreguén registros
const datosguardados = [];

async function eliminardata(accion) {
    if (accion == 'delete full') {
        console.log('entro al if');
        for (let i = 0; i < datosguardados.length; i++) {
            console.log('Eliminaré el input ', datosguardados[i]);
            eliminarInput(datosguardados[i]);
        }
        datosguardados.length = 0; // Vaciar el array
    } else {
        const datoEliminado = datosguardados.findIndex(elemento => elemento === accion);
        if (datoEliminado !== -1) { // Verificar si se encontró el elemento
            datosguardados.splice(datoEliminado, 1);
            console.log('Dato eliminado: ', accion);
        } else {
            console.log('El elemento no está presente en el arreglo.');
        }
    }
}


//Función asíncrona para cargar un componente HTML.
async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}
// Función para poblar un combobox (select) con opciones
const fillSelected = (data, selectId, idcontenedorbotones, selectedValue = null) => {
    const selectElement = document.getElementById(selectId);

    // Limpiar opciones previas del combobox
    selectElement.innerHTML = '';
    let options = [];
    data.forEach(item => {
        options.push(item.posicion);
        options.push(item.posicion_secundaria); // Esto lo agregue para que también sume lo de la posición secundaria
    });
    console.log(options);
    // Crear opción por defecto
    fillSelectedDynamic(selectId, idcontenedorbotones, options);
    // Llenar el combobox con los datos proporcionados
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id; // Suponiendo que hay una propiedad 'id' en los datos
        option.textContent = item.jugadores; // Cambia 'jugadores' al nombre de la propiedad que deseas mostrar en el combobox
        selectElement.appendChild(option);
    });
    const option = document.createElement('option');
    option.value = 'Seleccionar todos';
    option.textContent = 'Seleccionar todos';
    selectElement.appendChild(option);
    console.log(data, 'Estos son los datos que procesa el fillSelected');

    // Seleccionar el valor especificado si se proporciona
    if (selectedValue !== null) {
        selectElement.value = selectedValue;
    }
};

// Función para poblar un combobox (select) con opciones diferentes a un jugador
const fillSelectedDynamic = (selectId, idcontenedorbotones, options = null) => {
    const selectElement = document.getElementById(selectId);

    // Limpiar opciones previas del combobox
    selectElement.innerHTML = '';

    // Crear un arreglo de opciones únicas
    const uniqueOptions = [...new Set(options)];

    // Crear opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecciona a quién se asignará';
    selectElement.appendChild(defaultOption);

    // Agregar las opciones únicas al combobox
    uniqueOptions.forEach((option) => {
        ADD_JUGADOR = 1;
        if (option == 'Seleccionar todos') {
            let conca = (option);
            let boton = generarBotones(conca, option);
            document.getElementById(idcontenedorbotones).appendChild(boton);
        }
        let conca = ('Selecciona a todos los ' + option + 's');
        let boton = generarBotones(conca, option);
        document.getElementById(idcontenedorbotones).appendChild(boton);
    });
    OPCIONES = uniqueOptions;
};

const zona1func = () => {
    ZONA1.classList.add('active');
    ZONA2.classList.remove('active');
    ZONA3.classList.remove('active');
    ZONA = 'Zona 1';
}


const zona2func = () => {
    ZONA1.classList.remove('active');
    ZONA2.classList.add('active');
    ZONA3.classList.remove('active');
    ZONA = 'Zona 2';
}

const zona3func = () => {
    ZONA1.classList.remove('active');
    ZONA2.classList.remove('active');
    ZONA3.classList.add('active');
    ZONA = 'Zona 3';
}

const generarBotones = (texto, valor) =>{
    console.log('Estoy generando botones, este es el valor de ADD_JUGADOR ', ADD_JUGADOR);
    const boton = document.createElement('button');
    if (ADD_JUGADOR) {
    boton.classList.add('btn', 'btn-outline-primary', 'rounded-5', 'btn-style', 'py-2', 'px-3', 'mb-2', 'me-2');
    boton.textContent = texto;
    boton.type = 'button';
    boton.onclick = function() {
        
        let esOpcionValida = 0;
        console.log(OPCIONES, 'Estas son las opciones');
        esOpcionValida = OPCIONES.some(opcion => opcion == valor);
        if (esOpcionValida) {
            const jugadoresConPosicion = lista_datos.filter(jugador => 
                jugador.posicion === valor || jugador.posicion_secundaria === valor
            );            

            if (jugadoresConPosicion.length > 0) {
                // Aquí puedes manejar los jugadores que coinciden con la posición
                console.log(jugadoresConPosicion, 'Estos son los jugadores filtrados');

                //Aqui comienza la cración de los inputs
                //eliminardata('delete full');

                jugadoresConPosicion.forEach(jugadorSeleccionado => {
                    const elementoAgregado = datosguardados.some(elemento => elemento === jugadorSeleccionado.id);
                    if (!elementoAgregado) {
                        // Crear un nuevo contenedor de fila para el input y el botón
                        const rowContainer = document.createElement('div');
                        rowContainer.id = 'rowContainer_' + jugadorSeleccionado.id;
                        rowContainer.classList.add('row', 'py-1', 'ms-1');

                        // Crear un nuevo input para el nombre del jugador
                        const nombreJugadorInput = document.createElement('input');
                        nombreJugadorInput.id = 'nombreAdministrador_' + jugadorSeleccionado.id;
                        nombreJugadorInput.type = 'text';
                        nombreJugadorInput.name = 'nombreAdministrador_' + jugadorSeleccionado.id;
                        nombreJugadorInput.classList.add('col-9', 'rounded-3', 'me-2', 'inputt');
                        nombreJugadorInput.disabled = true;
                        nombreJugadorInput.value = jugadorSeleccionado.jugadores;

                        // Crear un nuevo botón de eliminar
                        const botonEliminar = document.createElement('button');
                        botonEliminar.id = 'btnEliminar_' + jugadorSeleccionado.id;
                        botonEliminar.type = 'button';
                        botonEliminar.classList.add('btn', 'transparente', 'col-1', 'border', 'border-danger');
                        datosguardados.push(jugadorSeleccionado.id);
                        console.log(datosguardados);
                        botonEliminar.onclick = function () {
                            eliminardata(jugadorSeleccionado.id);
                            eliminarInput(jugadorSeleccionado.id);
                        };

                        // Crear la imagen para el botón de eliminar
                        const imagenEliminar = document.createElement('img');
                        imagenEliminar.src = '../../../resources/img/svg/icons_forms/trash 1.svg';
                        imagenEliminar.width = 10;
                        imagenEliminar.height = 10;

                        // Agregar la imagen al botón de eliminar
                        botonEliminar.appendChild(imagenEliminar);

                        // Agregar el input y el botón al contenedor de fila
                        rowContainer.appendChild(nombreJugadorInput);
                        rowContainer.appendChild(botonEliminar);

                        // Obtener el contenedor de los nombres de los jugadores
                        const nombresDeLosJugadoresDiv = document.getElementById('nombresDeLosJugadores');

                        // Agregar el contenedor de fila al contenedor de nombres de los jugadores
                        nombresDeLosJugadoresDiv.appendChild(rowContainer);
                    }
                });

            } else if (esOpcionValida) {
                // Lógica para manejar cuando selectedJugadorId es válido pero no es una posición en lista_datos
                console.error(valor, 'Dio error y es una opción válida');
            }

        }
    };
}
    return boton;
    
}
/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/


const openCreateCancha = async () => {
    volverCancha();
    zona2func();
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Agregar detalle';
}

const zona1Seguir = () => {
    zona1func();
    openCreate();
}

const zona2Seguir = () => {
    zona2func();
    openCreate();
}

const zona3Seguir = () => {
    zona3func();
    openCreate();
}
const volverCancha = async () => {
    // Se muestra la caja de diálogo con su título.
    const modal = `<div class="col-sm-12 col-md-12 g-3 px-3 py-3">
                        <label for="contenido" class="form-label fw-semibold">Por favor elije en qué parte de la cancha se desarrollara el contenido</label>
                        <div class="row">
                            <div class="col-md-4 col-sm-12">
                                <button href="#" class="btn" role="button" data-bs-toggle="button"
                                onclick="zona1func()" ondblclick="zona1Seguir()" id="zona1">
                                    <img src="../../../resources/img/png/zona_campo_1.png"
                                        class="rounded float-start img-fluid" alt="...">
                                </button>
                            </div>
                            <div class="col-md-4 col-sm-12">
                                <button href="#" class="btn" role="button" data-bs-toggle="button"
                                onclick="zona2func()" ondblclick="zona2Seguir()" id="zona2">
                                    <img src="../../../resources/img/png/zona_campo_2.png"
                                        class="rounded mx-auto d-block img-fluid" alt="...">
                                </button>
                            </div>
                            <div class="col-md-4 col-sm-12">
                                <button href="#" class="btn" role="button" data-bs-toggle="button"
                                onclick="zona3func()" ondblclick="zona3Seguir()" id="zona3">
                                    <img src="../../../resources/img/png/zona_campo_3.png"
                                        class="rounded float-end img-fluid" alt="...">
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer col-sm-12 col-md-12 col-lg-12">
                    <button type="submit" class="btn bg-blue-principal-color text-white" onclick="openCreate()">Seguir</button>
                </div>`
    CONTENEDOR_MODAL.innerHTML = modal;
    ZONA1 = document.getElementById('zona1');
    ZONA2 = document.getElementById('zona2');
    ZONA3 = document.getElementById('zona3');
    if (ZONA == 'Zona 1') {
        zona1func();
    } else if (ZONA == 'Zona 2') {
        zona2func();
    }
    else {
        ZONA = 'Zona 3';
        zona3func();
    }
    
}
const cargarComponente = async (number) => {
    // Se muestra la caja de diálogo con su título.
    const modal = `<form id="saveForm">
<div class="modal-body row g-3">
    <!-- Campo oculto para asignar el id del registro al momento de modificar -->
    <input type="hidden" id="iddetallecontenido" name="idDetalle">
    <div class="col-sm-12 col-md-6">
        <label for="subcontenido" class="form-label fw-semibold">Principios de juego</label>
        <select id="subcontenido" type="text" name="idSubContenido" class="form-select"
            required></select>
    </div>
    <div class="col-sm-12 col-md-6">
        <label for="tarea" class="form-label fw-semibold">Tarea</label>
        <select id="tarea" type="text" name="IdTarea" class="form-select" required></select>
    </div>
    <div class="col-sm-12 col-md-6 mb-3">
        <label for="cantidadEquipo" class="form-label fw-semibold">Minutos del principio</label>
        <input id="cantidadEquipo" type="number" name="CantidadSubContenido" class="form-control"
            min="1" max="600" placeholder="Ingresa los minutos del contenido" required>
    </div>
    <div class="col-sm-12 col-md-6">
        <label for="minutostarea" class="form-label fw-semibold">Minutos tarea</label>
        <input id="minutostarea" type="number" name="CantidadTarea" class="form-control" min="1"
            max="600" placeholder="Ingresa los minutos de la tarea" required>
    </div>
    <div class="col-sm-12 col-md-12">
        <label for="telefonoEquipo" class="form-label fw-semibold">Jugador/ Jugadores</label>
        <div class="row">
            <div class="col-12" id="contenedorBotones">

            </div>
            <div class="col-sm-12 col-md-10">
                <select class="form-select me-3 borde-transparente campo rounded-3 shadow"
                    id="generador">
                    <option value="">Selecciona a quién se asignará</option>
                </select>
            </div>
        </div>
    </div>
    <div class="col-sm-12 col-md-12" id="nombresDeLosJugadores">

    </div>
</div>
<div class="modal-footer col-sm-12 col-md-12 col-lg-12">
    <button class="btn bg-yellow-principal-color text-white" id="volver" onclick="volverCancha()">Cambiar cancha</button>
    <button type="reset" class="btn bg-red-cream-color text-white" data-bs-dismiss="modal">Cancelar</button>
    <button type="submit" class="btn bg-blue-principal-color text-white ">Guardar</button>
</div>
</form>`;
    CONTENEDOR_MODAL.innerHTML = modal;
    if (number) {

        let boton = document.getElementById('volver');
        //Quiero que el boton se elimine
        boton.remove();
    }
}
const cargarDespues = async (number = 0) => {
    cargarComponente(number);

    // Constantes para establecer los elementos del formulario de guardar.
    SAVE_FORM = document.getElementById('saveForm'),
        IDDETALLE_CONTENIDO = document.getElementById('iddetallecontenido'),
        ID_SUBCONTENIDO = document.getElementById('iddetallecontenido'),
        SUBCONTENIDO = document.getElementById('subcontenido');
    TAREA = document.getElementById('tarea');
    ID_JUGADOR = document.getElementById('generador');
    CANTIDAD_CONTENIDO = document.getElementById('cantidadEquipo');
    MINUTOS_TAREA = document.getElementById('minutostarea');
    // Método del evento para cuando se envía el formulario de guardar.
    SAVE_FORM.addEventListener('submit', async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(SAVE_FORM);
        FORM.append('idEntrenamiento', ID_ENTRENAMIENTO);
        console.log(ID_ENTRENAMIENTO);
        // Petición para guardar los datos del formulario.
        if (!(IDDETALLE_CONTENIDO.value == 0)) {
            const DATA = await fetchData(SD_CONTENTS_API, 'updateRow', FORM);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se cierra la caja de diálogo.
                SAVE_MODAL.hide();
                // Se muestra un mensaje de éxito.
                sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                fillTable();
            } else {
                sweetAlert(2, DATA.error, false);
                console.error(DATA.exception);
            }
        } else {
            console.log(datosguardados);
            console.log(TAREA.value);
            // Convertir el arreglo a una cadena JSON
            const jugadoresJSON = JSON.stringify(datosguardados);
            FORM.append('arregloJugadores', jugadoresJSON);
            const DATA = await fetchData(SD_CONTENTS_API, 'createRow', FORM);
            console.log(DATA);
            if (DATA.status) {
                // Se cierra la caja de diálogo.
                SAVE_MODAL.hide();
                // Se muestra un mensaje de éxito.
                sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                fillTable();
            } else {
                sweetAlert(2, DATA.error, false);
                console.error(DATA.exception);
            }
        }
    });
};
/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/


const openCreate = async () => {
    // Selecciona el elemento después de que se haya creado
    await cargarDespues();
    selectJugador = document.getElementById('generador');
    // Añadir el listener para el evento 'change'
    selectJugador.addEventListener('change', (event) => {
        console.log('Estoy cambiando el select');
        const selectedJugadorId = event.target.value;
        if (ADD_JUGADOR) {
            if (selectedJugadorId == 'Seleccionar todos') {
                // Si entra a este if seleccionar todos los jugadores
                eliminardata('delete full');

                lista_datos.forEach(jugadorSeleccionado => {
                    const elementoAgregado = datosguardados.some(elemento => elemento === jugadorSeleccionado.id);
                    if (!elementoAgregado) {
                        // Crear un nuevo contenedor de fila para el input y el botón
                        const rowContainer = document.createElement('div');
                        rowContainer.id = 'rowContainer_' + jugadorSeleccionado.id;
                        rowContainer.classList.add('row', 'py-1', 'ms-1');

                        // Crear un nuevo input para el nombre del jugador
                        const nombreJugadorInput = document.createElement('input');
                        nombreJugadorInput.id = 'nombreAdministrador_' + jugadorSeleccionado.id;
                        nombreJugadorInput.type = 'text';
                        nombreJugadorInput.name = 'nombreAdministrador_' + jugadorSeleccionado.id;
                        nombreJugadorInput.classList.add('col-9', 'rounded-3', 'me-2', 'inputt');
                        nombreJugadorInput.disabled = true;
                        nombreJugadorInput.value = jugadorSeleccionado.jugadores;

                        // Crear un nuevo botón de eliminar
                        const botonEliminar = document.createElement('button');
                        botonEliminar.id = 'btnEliminar_' + jugadorSeleccionado.id;
                        botonEliminar.type = 'button';
                        botonEliminar.classList.add('btn', 'transparente', 'col-1', 'border', 'border-danger');
                        datosguardados.push(jugadorSeleccionado.id);
                        console.log(datosguardados);
                        botonEliminar.onclick = function () {
                            eliminardata(jugadorSeleccionado.id);
                            eliminarInput(jugadorSeleccionado.id);
                        };

                        // Crear la imagen para el botón de eliminar
                        const imagenEliminar = document.createElement('img');
                        imagenEliminar.src = '../../../resources/img/svg/icons_forms/trash 1.svg';
                        imagenEliminar.width = 10;
                        imagenEliminar.height = 10;

                        // Agregar la imagen al botón de eliminar
                        botonEliminar.appendChild(imagenEliminar);

                        // Agregar el input y el botón al contenedor de fila
                        rowContainer.appendChild(nombreJugadorInput);
                        rowContainer.appendChild(botonEliminar);

                        // Obtener el contenedor de los nombres de los jugadores
                        const nombresDeLosJugadoresDiv = document.getElementById('nombresDeLosJugadores');

                        // Agregar el contenedor de fila al contenedor de nombres de los jugadores
                        nombresDeLosJugadoresDiv.appendChild(rowContainer);
                    }
                });
            } else {
                const jugadorSeleccionado = lista_datos.find(jugadorSeleccionado => jugadorSeleccionado.id == selectedJugadorId);
                console.log(jugadorSeleccionado);
                const elementoAgregado = datosguardados.some(elemento => elemento === jugadorSeleccionado.id);
                if (!elementoAgregado) {
                    // Crear un nuevo contenedor de fila para el input y el botón
                    const rowContainer = document.createElement('div');
                    rowContainer.id = 'rowContainer_' + jugadorSeleccionado.id;
                    rowContainer.classList.add('row', 'py-1', 'ms-1');

                    // Crear un nuevo input para el nombre del jugador
                    const nombreJugadorInput = document.createElement('input');
                    nombreJugadorInput.id = 'nombreAdministrador_' + jugadorSeleccionado.id;
                    nombreJugadorInput.type = 'text';
                    nombreJugadorInput.name = 'nombreAdministrador_' + jugadorSeleccionado.id;
                    nombreJugadorInput.classList.add('col-9', 'rounded-3', 'me-2', 'inputt');
                    nombreJugadorInput.disabled = true;
                    nombreJugadorInput.value = jugadorSeleccionado.jugadores;

                    // Crear un nuevo botón de eliminar
                    const botonEliminar = document.createElement('button');
                    botonEliminar.id = 'btnEliminar_' + jugadorSeleccionado.id;
                    botonEliminar.type = 'button';
                    botonEliminar.classList.add('btn', 'transparente', 'col-1', 'border', 'border-danger');
                    datosguardados.push(jugadorSeleccionado.id);
                    console.log(datosguardados);
                    botonEliminar.onclick = function () {
                        eliminardata(jugadorSeleccionado.id);
                        eliminarInput(jugadorSeleccionado.id);
                    };

                    // Crear la imagen para el botón de eliminar
                    const imagenEliminar = document.createElement('img');
                    imagenEliminar.src = '../../../resources/img/svg/icons_forms/trash 1.svg';
                    imagenEliminar.width = 10;
                    imagenEliminar.height = 10;

                    // Agregar la imagen al botón de eliminar
                    botonEliminar.appendChild(imagenEliminar);

                    // Agregar el input y el botón al contenedor de fila
                    rowContainer.appendChild(nombreJugadorInput);
                    rowContainer.appendChild(botonEliminar);

                    // Obtener el contenedor de los nombres de los jugadores
                    const nombresDeLosJugadoresDiv = document.getElementById('nombresDeLosJugadores');

                    // Agregar el contenedor de fila al contenedor de nombres de los jugadores
                    nombresDeLosJugadoresDiv.appendChild(rowContainer);
                }
            }
        }
    });

    // Se prepara el formulario.
    SAVE_FORM.reset();
    ID_JUGADOR.disabled = false;
    eliminardata('delete full');
    ADD_JUGADOR = 1;
    IDDETALLE_CONTENIDO.value = 0;
    MODAL_TITLE.textContent = 'Agregar detalle';

    // Llenar el combobox de jugadores
    const FORM2 = new FormData();
    FORM2.append('cancha', ZONA);
    const FORM = new FormData();
    FORM.append('idEquipo', ID_EQUIPO);
    await fillSelectPost(SD_CONTENTS_API, 'readAllSubContenidos2', 'subcontenido', FORM2);
    await fillSelect(SD_CONTENTS_API, 'readAllTareas', 'tarea');
    const jugadores = await fetchData(SD_CONTENTS_API, 'readAllJugadores', FORM);
    console.log(jugadores.dataset);
    console.log(lista_datos);
    lista_datos = jugadores.dataset;
    console.log(lista_datos);
    fillSelected(jugadores.dataset, 'generador', 'contenedorBotones');
};

/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdate = async (id) => {
    try {
        cargarDespues(1);
        eliminardata('delete full');
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idDetalle', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(SD_CONTENTS_API, 'readOneDetalleContenido', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Actualizar detalle';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            ADD_JUGADOR = 0;

            const FORM = new FormData();
            FORM.append('idEquipo', ID_EQUIPO);
            await fillSelect(SD_CONTENTS_API, 'readAllSubContenidos', 'subcontenido', DATA.dataset.id_sub_tema_contenido);
            await fillSelect(SD_CONTENTS_API, 'readAllTareas', 'tarea', DATA.dataset.id_tarea);
            await fillSelectPost(SD_CONTENTS_API, 'readAllJugadores', 'generador', FORM, DATA.dataset.id_jugador);
            ID_JUGADOR.disabled = true;
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            IDDETALLE_CONTENIDO.value = ROW.id_detalle_contenido;
            MINUTOS_TAREA.value = parseInt(ROW.minutos_tarea);
            CANTIDAD_CONTENIDO.value = parseInt(ROW.minutos_contenido);

        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.error(Error);
        eliminardata('delete full');
        // En caso de error, llenar el combobox con datos simulados
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar detalle';

    }
}
const grapicsView = async () => {
    if (ACTIVATE == '') {
        ACTIVATE = 'd-none';
        CONTENEDOR1.classList.add(ACTIVATE);
        CONTENEDOR2.classList.add(ACTIVATE);
    }
    else {

        CONTENEDOR1.classList.remove(ACTIVATE);
        CONTENEDOR2.classList.remove(ACTIVATE);
        ACTIVATE = '';
    }
}

/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar esta asignación?');
    try {
        // Se verifica la respuesta del mensaje.
        if (RESPONSE) {
            // Se define una constante tipo objeto con los datos del registro seleccionado.
            const FORM = new FormData();
            FORM.append('IdDetalle', id);
            console.log(id);
            // Petición para eliminar el registro seleccionado.
            const DATA = await fetchData(SD_CONTENTS_API, 'deleteRow', FORM);
            console.log(DATA.status);
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                // Se muestra un mensaje de éxito.
                await sweetAlert(1, DATA.message, true);
                // Se carga nuevamente la tabla para visualizar los cambios.
                fillTable();
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
*   Función asíncrona para llenar la tabla con los registros disponibles.
*   Parámetros: form (formulario de búsqueda).
*   Retorno: ninguno.
*/
async function fillTable(form = null, actions = 0) {
    let action;
    const cargarTabla = document.getElementById('tabla_especificos_detalles_contenidos');

    try {
        cargarTabla.innerHTML = '';
        // Se verifica la acción a realizar.
        (actions) ? action = 'searchRows' : action = 'readAllDContenido';
        console.log(form);
        if (actions == 0) {
            form = new FormData();
            form.append('idEntrenamiento', ID_ENTRENAMIENTO);
        }
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(SD_CONTENTS_API, action, form);
        console.log(DATA);

        if (DATA.status) {
            Mensaje.innerHTML = ``;
            CONTENEDOR1.classList.remove('d-none');
            CONTENEDOR2.classList.remove('d-none');
            let form2 = new FormData();
            form2.append('idEntrenamiento', ID_ENTRENAMIENTO);
            const DATA2 = await fetchData(SD_CONTENTS_API, 'readAllGraphic', form2);
            let contenido = [];
            let minutosC = [];
            let minutosT = [];
            let tarea = [];
            let datos = DATA2.dataset;
            let datos2 = DATA2.dataset2;
            console.log('Console de graficos', datos);
            console.log('Console de graficos', datos2);
            datos.forEach(filter => {
                contenido.push(filter.sub_tema_contenido);
                minutosC.push(Number(filter.minutos_maximos_subtema));
            });
            datos2.forEach(filter => {
                tarea.push(filter.nombre_tarea);
                minutosT.push(Number(filter.minutos_maximos_tarea));
            });
            // Análisis de los minutos por subContenido
            let totalMinutosC = minutosC.reduce((acc, curr) => acc + curr, 0);
            let analisisContenido = contenido.map((nombre, index) => {
                let porcentaje = ((minutosC[index] / totalMinutosC) * 100).toFixed(2);
                return `${nombre}: ${minutosC[index]} minutos (${porcentaje}%)`;
            }).join('\n');

            // Análisis de los minutos por tarea
            let totalMinutosT = minutosT.reduce((acc, curr) => acc + curr, 0);
            let analisisTareas = tarea.map((nombre, index) => {
                let porcentaje = ((minutosT[index] / totalMinutosT) * 100).toFixed(2);
                return `${nombre}: ${minutosT[index]} minutos (${porcentaje}%)`;
            }).join('\n');

            // Función para calcular el total de minutos
            function calcularTotalMinutos(arreglo) {
                return arreglo.reduce((total, minutos) => total + minutos, 0);
            }

            // Calcular el total de minutos para contenidos y tareas
            const totalMinutosContenidos = calcularTotalMinutos(minutosC);
            const totalMinutosTareas = calcularTotalMinutos(minutosT);

            // Mostrar el análisis en los elementos correspondientes
            CONTENIDO1.textContent = `Tu entrenamiento dura ${totalMinutosContenidos} minutos y se basa en ${'\n'} ${analisisContenido}.`;
            CONTENIDO2.textContent = `Tu entrenamiento dura ${totalMinutosTareas} minutos y se basa en ${'\n'} ${analisisTareas}.`;

            DoughnutGraph('myChart', contenido, minutosC, 'Minutos por principios', 0);
            DoughnutGraph3('myChart2', tarea, minutosT, 'Minutos por Tarea', 0);
            // Mostrar elementos obtenidos de la API
            DATA.dataset.forEach(row => {
                const tablaHtml = `
                <tr>
                    <td>${row.dorsal_jugador}</td>
                    <td>${row.nombre_jugador}</td>
                    <td>${row.nombre_subtema}</td>
                    <td>${row.nombre_tarea}<td>
                    <td>
                    <button type="button" class="btn transparente" onclick="openUpdate(${row.id_detalle_contenido})">
                    <img src="../../../resources/img/svg/icons_forms/pen 1.svg" width="18" height="18">
                    </button>
                    <button type="button" class="btn transparente" onclick="openDelete(${row.id_detalle_contenido})">
                    <img src="../../../resources/img/svg/icons_forms/trash 1.svg" width="18" height="18">
                    </button>
                    </td>
            </tr>
                `;
                cargarTabla.innerHTML += tablaHtml;
            });
        } else {
            sweetAlert(4, DATA.error, true);
            Mensaje.innerHTML = `
            <p> Aún no has asignado contenidos ni tareas a este entrenamiento, presiona "Agregar contenidos para los jugadores"</p>
            `;
            CONTENEDOR1.classList.add('d-none');
            CONTENEDOR2.classList.add('d-none');
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        // Mostrar materiales de respaldo
        const tablaHtml = `
            <p> error al cargar los datos</p>
            `;
        cargarTabla.innerHTML += tablaHtml;
    }
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');
    // Carga los components de manera síncrona
    const subcontenidosHtml = await loadComponent('../components/specific_details_contents.html');
    // Llamada a la función para mostrar el encabezado.
    loadTemplate();
    // Agrega el HTML del encabezado
    appContainer.innerHTML = subcontenidosHtml;
    //Agrega el encabezado de la pantalla
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Contenidos por entrenamientos';
    ID_URL = new URLSearchParams(window.location.search);
    ID_ENTRENAMIENTO = ID_URL.get('id_entrenamiento');
    BUSCADOR = ID_URL.get('sub_tema');
    const FORM = new FormData();
    FORM.append('idEntrenamiento', ID_ENTRENAMIENTO);
    console.log(ID_ENTRENAMIENTO);
    const DATA = await fetchData(SD_CONTENTS_API, 'readOneEquipo', FORM);
    console.log('Esto es lo que devuelve data', DATA);
    ID_EQUIPO = DATA.dataset.id_equipo;
    console.log('Este es el idequipo que trae el windowsOnload', ID_EQUIPO);
    if (BUSCADOR == '0') {
        fillTable();
    } else {
        const FORM = new FormData();
        FORM.append('search', BUSCADOR);
        fillTable(FORM, 1);
    }
    const titulos = ['Agregar entrenamientos', 'Agregar tareas', 'Pasar asistencia', 'Ver jugadores y sus equipos', 'Ver jugadores'];
    const links = ['../pages/journeys.html', '../pages/tasks.html', '../pages/assists.html', '../pages/templates_name.html', '../pages/players.html'];
    insertTag('tags', titulos, links, 'Titulos relacionados');
    CONTENEDOR_MODAL = document.getElementById('contenedor_modal');
    // Constante para establecer el formulario de buscar.
    SEARCH_FORM = document.getElementById('searchForm');
    // Constantes para establecer los elementos del componente Modal.
    SAVE_MODAL = new bootstrap.Modal('#saveModal');
    MODAL_TITLE = document.getElementById('modalTitle');
    CONTENIDO1 = document.getElementById('contenido1');
    CONTENIDO2 = document.getElementById('contenido2');
    CONTENEDOR1 = document.getElementById('contenedor1graf');
    CONTENEDOR2 = document.getElementById('contenedor2graf');
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
        fillTable(FORM, 1);
    });

};