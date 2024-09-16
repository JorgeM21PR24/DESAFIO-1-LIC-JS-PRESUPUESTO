/***  backend.js ***/

// VARIABLES GLOBALES
/** Testeo con Saldo inicial */
const saldoInicial = 0;
// Array para almacenar las transacciones de Testeo
let transacciones = [
    { tipo: 'ingreso', descripcion: 'Salario', monto: 0 },
    { tipo: 'egreso', descripcion: 'Renta', monto: 0 },
    { tipo: 'ingreso', descripcion: 'Freelance', monto: 0 },
    { tipo: 'egreso', descripcion: 'Comida', monto: 0 },
    { tipo: 'egreso', descripcion: 'Transporte', monto: 0 }
];

// FUNCIONES
/** Función para obtener la fecha actual completo */
function obtenerFechaActual() {
    const fecha = new Date();
    const datosFecha = { year: 'numeric', month: 'long', day: 'numeric' };
    return fecha.toLocaleDateString('es-ES', datosFecha);
}

/** Especificar el formato segun guia */
function obtenerFechaActualFormateada() {
    // Objeto Date que contiene la fecha actual
    const fecha = new Date();
    const datosFecha = { month: 'long' };
    // Obtener el nombre del mes
    const mes = fecha.toLocaleDateString('es-ES', datosFecha);
    // Obtener el año de forma numerica
    const año = fecha.getFullYear(); 
    // Concatenar el mes y el años para obtener el formato deseado
    return `${mes} ${año}`; 
}

/** Función para mostrar la fecha en el FrontEnd atraves del elemento: elemento -fecha */
function mostrarFecha() {
    // elemento fecha obtendra el elemento del DOM con id = elemento-fecha
    const elementoFecha = document.getElementById('elemento-fecha');
    // Se asigna al atributo textContent el valor devuelto por la funcion obtenerFechaActualFormateada()
    elementoFecha.textContent = obtenerFechaActualFormateada();
}

/** Función para calcular el saldo total en la cuenta y el porcentaje de gastos */
function calcularDatos() {
    //* Declaraciones de variables locales
    let totalIngresos = 0;
    let totalEgresos = 0;
    
    // Se realiza el recorrido de una lista de transacciones guardadas temporalmente
    // Con el fin de totalizar egresos e ingresos
    transacciones.forEach(transaccion => {
        if (transaccion.tipo === 'ingreso') {
            totalIngresos += transaccion.monto;
        } else if (transaccion.tipo === 'egreso') {
            totalEgresos += transaccion.monto;
        }
    });
    // Caluclo de saldoTotal
    const saldoTotal = saldoInicial + totalIngresos - totalEgresos;
    
    /* Validacion con condicion ternaria para evitar error de operaciones indefinida.
    Se utiliza la formula de porcentaje de egreso dada en la guia 
    %egreso = (totalEgresos/ totalIngresos)*100 donde totalEgresos > 0 de lo contrario por
    defecto tendra el valor de cero.
    */
    const porcentajeGastos = totalIngresos > 0 ? (totalEgresos / totalIngresos) * 100 : 0;
   
    
    /* Una parte que me gusto aprender de JS es que se podra devolver una lista de variables sin
    necesidad de ocupar un objeto u lista como en JAVA 
    */
    return {
        totalIngresos,
        totalEgresos,
        saldoTotal,
        porcentajeGastos
    };
}

/** Función para actualizar la interfaz con los datos calculados */
function actualizarDatos() {
    /* Cada variable contendra su valor respetando el orden de los datos
    que proviene del retorno de la lista de variales que retorna la funcion "calcularDatos()" */
    const { totalIngresos, totalEgresos, saldoTotal, porcentajeGastos } = calcularDatos();
    // Obteniendo los valores para cada uno de los elementos de DOM para mostrarlo de lado de cliente
    // Mostrara las cantidades en dolares y formateado a 2 decimales
    document.getElementById('elemento-fecha').textContent = obtenerFechaActualFormateada();
    document.getElementById('elemento-ingresoTotal').textContent = `$ ${totalIngresos.toFixed(2)} `;
    document.getElementById('elemento-egresoTotal').textContent = `$ ${totalEgresos.toFixed(2)}`;
    document.getElementById('elemento-saldoTotal').textContent = `$ ${saldoTotal.toFixed(2)}`;
    // Elemento que cotendra el valor en porcentaje de los egresos
    document.getElementById('porcentaje-gastos').textContent = `${porcentajeGastos.toFixed(2)} %`;
    // Se invoca a la lista de transacciones
    mostrarListaTransacciones();
}


// Esperar a que el DOM esté completamente cargado antes de ejecutar las funciones
// document.addEventListener('DOMContentLoaded', mostrarFecha);

// Función para mostrar la lista de transacciones
function mostrarListaTransacciones() {
    const dataList = document.getElementById('data-list');
    dataList.innerHTML = ''; // Limpiar la lista
    // Recorre la lista de transacciones
    transacciones.forEach((transaccion, index) => {
        /* Se crea un nuevo elemento div y se almacena en la constante item. Este div servirá para contener la información de una transacción individual. */
        const item = document.createElement('div');
        //Convierte el primer carácter del tipo de la transacción a mayúscula y concatena el resto del tipo en minúsculas.
        item.textContent = `${transaccion.tipo.charAt(0).toUpperCase() + transaccion.tipo.slice(1)}: ${transaccion.descripcion} - ${transaccion.monto.toFixed(2)} $`;
        // Agrega el elemento div recién creado y configurado al final del contenido del elemento dataList
        dataList.appendChild(item);
    });
}

/** Manejar el envío del formulario: 
    Añade un "escuchador de eventos" al formulario que se activará cuando el formulario se envíe (evento submit). La función que sigue será ejecutada en ese momento, y el parámetro event contiene información sobre el evento de envío.
*/
document.getElementById('transaction-form').addEventListener('submit', (event) => {
    // // Previene el comportamiento por defecto del formulario, se puede personalizar envio data
    event.preventDefault(); 

    const tipo = document.getElementById('transaction-type').value;
    const descripcion = document.getElementById('description').value;
    const monto = parseFloat(document.getElementById('amount').value);
    // Validar si descripcion no este vacio y que el monto sea mayor a cero
    if (descripcion && monto > 0) {
        //Añade un nuevo objeto al array a la lista de transacciones
        transacciones.push({ tipo, descripcion, monto });
        //Restablece el formulario, reinicia los valores de los campos de formulario
        document.getElementById('transaction-form').reset();
        actualizarDatos(); 
    }
});

/** Lista de Ingresos */
document.getElementById('show-incomes').addEventListener('click', () => {
    const dataList = document.getElementById('data-list');
    dataList.innerHTML = ''; // Limpiar la lista

    transacciones.filter(t => t.tipo === 'ingreso').forEach((transaccion, index) => {
        const item = document.createElement('div');
        item.textContent = `${transaccion.descripcion} - $ ${transaccion.monto.toFixed(2)} `;
        dataList.appendChild(item);
    });
});

/** Lista de Egresos */
 /* Añade un "escuchador" de eventos al elemento. En este caso, está escuchando el evento click, lo que significa que cuando el usuario haga clic en el elemento con ID show-incomes, se ejecutará la función proporcionada (una función de flecha en este caso). */
document.getElementById('show-expenses').addEventListener('click', () => {
    // Lista o contenedor que almacenara las transacciones filtradas
    const dataList = document.getElementById('data-list');
    dataList.innerHTML = ''; // Limpiar la lista
   /* Filtra el array transacciones para obtener solo aquellas transacciones cuyo tipo es 'ingreso' */
    transacciones.filter(t => t.tipo === 'egreso').forEach((transaccion, index) => {
        // Crea un nuevo elemento div
        const item = document.createElement('div');
        // Establece el texto del nuevo elemento <div>, el monto aproximacion con dos digitos
        item.textContent = `${transaccion.descripcion} - $ ${transaccion.monto.toFixed(2)} `;
        // Agrega a la lista el nuevo div, con la informacion
        dataList.appendChild(item);
    });
});

/** Aquí, se está añadiendo un "event listener" al objeto document para que ejecute una función cuando el evento DOMContentLoaded ocurra. Este evento se dispara cuando el contenido HTML del documento ha sido completamente cargado y parseado, pero antes de que se carguen las hojas de estilo, imágenes, etc */
document.addEventListener('DOMContentLoaded', () => {
    // selecciona todos los elementos en el documento que tienen las clases c8 o c9
    const buttons = document.querySelectorAll('.c8, .c9');

     /* El método querySelectorAll devuelve una lista (similar a un array) que contiene todos estos elementos. Se almacena en la constante buttons. */
    buttons.forEach(button => {
        // Se añade un "event listener" al botón actual para que ejecute una función cuando se haga clic en él.
        button.addEventListener('click', () => {
         
            // Quita la clase 'selected' de todos los botones
            buttons.forEach(btn => btn.classList.remove('selected'));

            // Añadir la clase 'selected' al botón clickeado
            button.classList.add('selected');
        });
    });
});

// Inicializar la interfaz al cargar la página
document.addEventListener('DOMContentLoaded', actualizarDatos);
