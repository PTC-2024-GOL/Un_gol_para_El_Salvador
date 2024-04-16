async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

// window.onload
window.onload = async function () {

    // Llamada a la función para establecer la mascara del campo teléfono.
    vanillaTextMask.maskInput({
        inputElement: document.getElementById('codigo'),
        mask: [/\d/, /\d/, /\d/, ' ' ,/\d/, /\d/, /\d/]
    });
}