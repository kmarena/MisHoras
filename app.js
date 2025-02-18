// app.js

// Verificación inicial de carga del script
console.log('%cScript app.js cargado', 'color: green; font-size: 16px');

let ultimoRegistro = 'salida'; // Inicializar con un valor por defecto

// Función para registrar la entrada o salida
async function registrarEntradaSalida(tipo, fecha, hora) {
    console.log(`Registrando ${tipo} el ${fecha} a las ${hora}`);

    // Obtener registros existentes
    let registros = inicializarRegistros();

    // Crear nuevo registro
    const nuevoRegistro = {
        tipo: tipo,
        fecha: fecha,
        hora: hora
    };

    // Añadir el nuevo registro a la lista
    registros.push(nuevoRegistro);

    // Guardar registros actualizados en localStorage
    localStorage.setItem('registros', JSON.stringify(registros));

    console.log('Registro guardado:', nuevoRegistro);

    // Actualizar la tabla de registros
    mostrarRegistros();

    // Actualizar el último registro
    ultimoRegistro = tipo;
}

// Inicialización segura del almacenamiento de registros
function inicializarRegistros() {
    let registrosAlmacenados = localStorage.getItem('registros');
    console.log('Datos de registros en localStorage:', registrosAlmacenados);

    if (registrosAlmacenados) {
        try {
            const registrosParseados = JSON.parse(registrosAlmacenados);
            console.log('Registros parseados correctamente:', registrosParseados);
            return registrosParseados;
        } catch (error) {
            console.error('Error parseando registros:', error);
            console.warn('Inicializando registros vacíos debido al error');
            return [];
        }
    } else {
        console.log('No se encontraron registros previos');
        return [];
    }
}

// Función actualizada para mostrar los registros en tabla
function mostrarRegistros(forceRefresh = false) {
    if (window.location.pathname.includes('registros.html')) {
        const tbody = document.querySelector('#tabla-registros tbody');
        if (!tbody) {
            console.error('%cError crítico: Elemento #tabla-registros tbody no encontrado', 'color: red; font-size: 16px');
            console.log('Elementos disponibles en el DOM:', document.body.innerHTML);
            return;
        }

        console.groupCollapsed('Actualización de registros');
        console.log('La funcionalidad de Google Sheets ha sido eliminada.');

        // Limpiar tabla existente
        try {
            tbody.innerHTML = ''; // Limpieza más confiable
            console.log('Tabla de registros limpiada');
        } catch (error) {
            console.error('Error limpiando tabla de registros:', error);
        }

        // Obtener registros desde localStorage
        let registros = inicializarRegistros();
        console.log('Registros obtenidos:', registros);

        // Mostrar cada registro en la tabla
        registros.reverse().forEach((registro, index) => {
            console.log('Registro:', registro, 'Index:', index);
            let row = tbody.insertRow();
            let indexCell = row.insertCell();
            let fechaCell = row.insertCell();
            let horaCell = row.insertCell();
            let tipoCell = row.insertCell();
            let accionesCell = row.insertCell();

            indexCell.textContent = index + 1; // Calculate index

            tipoCell.textContent = registro.tipo;
            fechaCell.textContent = registro.fecha;
            horaCell.textContent = registro.hora;

            // Botón de borrar
            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Borrar';
            deleteButton.classList.add('delete-btn'); // Agrega una clase para estilo
            deleteButton.addEventListener('click', () => deleteRegistro(registro));
            accionesCell.appendChild(deleteButton);
        });

        console.log('Tabla de registros reconstruida con éxito');
        console.groupEnd();
    }
};

// Función para eliminar un registro
async function deleteRegistro(registro) {
    console.log('Eliminando registro:', registro);

    // Obtener registros existentes
    let registros = inicializarRegistros();

    // Filtrar el registro a eliminar
    registros = registros.filter(r => !(r.tipo === registro.tipo && r.fecha === registro.fecha && r.hora === registro.hora));

    // Guardar registros actualizados en localStorage
    localStorage.setItem('registros', JSON.stringify(registros));

    // Actualizar la tabla de registros
    mostrarRegistros();
}

// Función para actualizar la fecha y hora actuales
function actualizarFechaHora() {
    const ahora = new Date();
    const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fecha = ahora.toLocaleDateString('es-ES', opcionesFecha); // Fecha en formato legible
    const hora = ahora.toLocaleTimeString('es-ES'); // Hora en formato legible
    document.getElementById('fechaActual').textContent = fecha;
    document.getElementById('horaActual').textContent = hora;
}

// Función para actualizar la fecha y hora solo si los elementos existen
function actualizarFechaHoraSafely() {
    const fechaElement = document.getElementById('fechaActual');
    const horaElement = document.getElementById('horaActual');

    if (fechaElement && horaElement) {
        const ahora = new Date();
        const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const fecha = ahora.toLocaleDateString('es-ES', opcionesFecha); // Fecha en formato legible
        const hora = ahora.toLocaleTimeString('es-ES'); // Hora en formato legible
        fechaElement.textContent = fecha;
        horaElement.textContent = hora;
    }
}

// Actualizar la fecha y hora cada segundo solo si los elementos existen
setInterval(() => actualizarFechaHoraSafely(), 1000);
actualizarFechaHoraSafely(); // Llamar inmediatamente para mostrar la fecha y hora al cargar si los elementos existen

function actualizarTextoBoton() {
    let registros = inicializarRegistros();
    let textoBoton = 'Registrar Entrada'; // Texto por defecto

    if (registros.length > 0) {
        const ultimoRegistro = registros[registros.length - 1];
        textoBoton = ultimoRegistro.tipo === 'entrada' ? 'Registrar Salida' : 'Registrar Entrada';
    }

    document.getElementById('registroAutomatico').textContent = textoBoton;
}

function actualizarUltimoRegistro() {
    let registros = inicializarRegistros();
    if (registros.length > 0) {
        const ultimoRegistro = registros[registros.length - 1];
        const ultimoRegistroTexto = `Último Registro: ${ultimoRegistro.tipo} - ${ultimoRegistro.fecha} ${ultimoRegistro.hora}`;
        document.getElementById('ultimoRegistro').textContent = ultimoRegistroTexto;
    } else {
        document.getElementById('ultimoRegistro').textContent = 'Último Registro: No hay registros aún';
    }
}

// Verificar si estamos en index.html
if (document.getElementById('registroAutomatico')) {
    // Botón de registro automático
document.getElementById('registroAutomatico').addEventListener('click', async function () {
    try {
        const ahora = new Date();
        const fecha = ahora.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        const hora = ahora.toTimeString().split(' ')[0]; // Formato HH:MM:SS

        // Alternar entre entrada y salida
        const tipo = ultimoRegistro === 'entrada' ? 'salida' : 'entrada';

        // Registrar entrada/salida
        await registrarEntradaSalida(tipo, fecha, hora);

        actualizarTextoBoton(); // Actualizar el texto del botón

        // Actualizar el último registro en la página
        let registros = inicializarRegistros();
        if (registros.length > 0) {
            const ultimoRegistro = registros[registros.length - 1];
            const ultimoRegistroTexto = `Último Registro: ${ultimoRegistro.tipo} - ${ultimoRegistro.fecha} ${ultimoRegistro.hora}`;
            document.getElementById('ultimoRegistro').textContent = ultimoRegistroTexto;
        } else {
            document.getElementById('ultimoRegistro').textContent = 'Último Registro: No hay registros aún';
        }
    } catch (error) {
        console.error('Error durante registro automático:', error);
    }
});
}

// Verificar si estamos en registro-manual.html
if (document.getElementById('registroManualForm')) {
    // Formulario de registro manual
}

// Función para establecer el menú activo según la página actual
function setMenuActive() {
    const path = window.location.pathname.split('/').pop();
    let page;

    if (path === 'index.html' || path === '') {
        page = 'mis-horas';
    } else if (path === 'registro-manual.html') {
        page = 'registro-manual';
    } else if (path === 'registros.html') {
        page = 'registros';
    }

    if (page) {
        document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
        const menuItem = document.getElementById(`menu-${page}`);
        if (menuItem) {
            menuItem.classList.add('active');
        }
    }
}

function attachMenuEventListeners() {
    document.addEventListener('DOMContentLoaded', function() {
        // Navegación entre páginas
        document.querySelectorAll('.menu-item').forEach(item => {
            console.log('Añadiendo event listener a:', item.id);
            item.addEventListener('click', function () {
                console.log('Menú clickeado:', this.id);

                // Remover clase 'active' de todos los elementos
                document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));

                // Añadir clase 'active' al elemento seleccionado
                this.classList.add('active');

                // Determinar la página a cargar
                const page = this.id.replace('menu-', '');
                console.log('Página determinada:', page);

                if (page === 'mis-horas') {
                    console.log('Redirigiendo a index.html');
                    window.location.href = 'index.html';
                } else if (page === 'registro-manual') {
                    console.log('Redirigiendo a registro-manual.html');
                    window.location.href = 'registro-manual.html';
                } else if (page === 'registros') {
                    console.log('Redirigiendo a registros.html');
                    window.location.href = 'registros.html';
                } else {
                    console.error('Página no reconocida:', page);
                }
            });
        });

    });

    mostrarRegistros();
}

// Para asegurar que el script termina correctamente
console.log('%cScript app.js ejecutado completamente', 'color: blue; font-size: 16px');

// Establecer el menú activo al cargar la página
setMenuActive();
attachMenuEventListeners();
actualizarUltimoRegistro();
actualizarTextoBoton();

// Función para calcular el total de horas de la semana
function calcularTotalHorasSemana() {
    let totalHoras = 0;
    let registros = inicializarRegistros();
    
    // Obtener la fecha actual
    let ahora = new Date();
    
     // Calcular el inicio de la semana (sábado)
    let diaSemana = ahora.getDay(); // 0 para domingo, 1 para lunes, ..., 6 para sábado
    let diferencia = (diaSemana + 1) % 7; // Ajuste para que el sábado sea el inicio
    let inicioSemana = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - diferencia);
    inicioSemana.setHours(0, 0, 0, 0);
    inicioSemana.setMilliseconds(0);

    // Calcular el fin de la semana (viernes)
    let finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6); // Sumar 6 días para obtener el viernes
    finSemana.setHours(23, 59, 59, 999); // Establecer la hora a las 23:59:59
    
    // Filtrar registros de la última semana
   let registrosSemana = registros.filter(registro => {
        let fechaRegistro = new Date(registro.fecha + "T" + registro.hora);
        return fechaRegistro >= inicioSemana && fechaRegistro <= finSemana;
    });

   // Calcular el total de horas
    for (let i = 0; i < registrosSemana.length; i++) {
        if (registrosSemana[i].tipo === 'entrada') {
            // Buscar la salida correspondiente
            for (let j = i + 1; j < registrosSemana.length; j++) {
                if (registrosSemana[j].tipo === 'salida') {
                    let entrada = new Date(registrosSemana[i].fecha + "T" + registrosSemana[i].hora);
                    let salida = new Date(registrosSemana[j].fecha + "T" + registrosSemana[j].hora);
                    let diferencia = salida.getTime() - entrada.getTime();
                    totalHoras += diferencia;
                    i = j; // Avanzar i al registro de salida para evitar dobles conteos
                    break; // Salir del bucle interno después de encontrar la salida
                }
            }
        }
    }

    // Convertir milisegundos a horas
    totalHoras = totalHoras / (1000 * 60 * 60);
    
    return totalHoras;
}

// Función para mostrar el total de horas de la semana en la página
function mostrarTotalHorasSemana() {
    let totalHoras = calcularTotalHorasSemana();
    document.getElementById('horasSemana').textContent = Math.floor(totalHoras);
}

// Llamar a la función para mostrar el total de horas de la semana al cargar la página
document.addEventListener('DOMContentLoaded', mostrarTotalHorasSemana);
