
// Constantes para completar las rutas de la API.
const API = 'services/recuperacion/recuperacion.php';

window.onload = async function () {
    const BOTON = document.getElementById('boton');
    const INPUT1 = document.getElementById('email');

    BOTON.addEventListener('click', async (event) => {
        if (INPUT1.value === '') {
            sweetAlert(2, 'El campo del correo no puede estar vacío.', false);
            return false;
        }
            event.preventDefault();
            
            const fechaActualUTC = new Date();
            const FORM = new FormData();
            FORM.append('correo', INPUT1.value);
            FORM.append('nivel', 1);
            FORM.append('fecha', fechaActualUTC);
            const DATA = await fetchData(API, 'envioCorreo', FORM);
            if (DATA.status) {
                sweetAlert(1, DATA.message, true);
            } else {
                sweetAlert(2, DATA.error, false);
                console.error(DATA.exception);
            }
    });
};

