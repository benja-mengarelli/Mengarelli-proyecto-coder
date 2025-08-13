//! FUNCIONES

// verifica que el arreglo no este vacio (exista)
const stock_existe = (arreglo) => arreglo.length > 0;

// verifica que se ingresa un numero
const verificar_num = (num) => {
    const numero = parseFloat(num);
    return !isNaN(numero) && numero > 0;
};

// verifica que se ingresa una cadena y no algo vacio
const verificar_palabra = (cadena) => cadena.trim().length > 0;

function pedir_dato(mensaje, validacion) {
    let dato;
    let valido = false;

    do {
        dato = prompt(mensaje);
        valido = validacion(dato)
    } while (!valido)
    return dato;
}

//! cierre caja, falta terminar
function cierre_caja() {
    let cierre = Ventas.vendido - Ventas.efectivo - Ventas.transferencia;
    let mensaje = (
        "Vendido: \n" +
        "\tTotal ventas = $" + Ventas.vendido + "\n" +
        "\tTotal efectivo = $" + Ventas.efectivo + "\n" +
        "\tTotal transferencia = $" + Ventas.transferencia + "\n");

    if (cierre === 0) {
        mensaje += "La caja cerro en 0";
    }
    else if (cierre > 0) {
        mensaje += `Hay un faltante de $${cierre}`;
    }
    else {
        mensaje += `Hay un sobrante de $${cierre}`;
    }
    alert(mensaje)
}

//! funciones opciones
// Funcion 1 -agregar
function agregar_producto() {
    if (confirm("¿Desea agregar un nuevo producto?")) {

        const nombre = pedir_dato("Ingrese el nombre del producto:", verificar_palabra);
        const precio = parseFloat(pedir_dato(`Ingrese el precio de ${nombre} (solo números, decimales separados por punto):`, verificar_num));
        const stock = parseInt(pedir_dato(`Ingrese el stock de ${nombre} (números enteros):`, verificar_num));
        const codigo = Stock.length + 1;

        const nuevo_producto = new Productos(codigo, nombre, precio, stock);
        Stock.push(nuevo_producto);
        alert("Producto agregado con éxito");
    }
}

// funcion 2 eliminar
function eliminar_producto() {
    // se verifica si hay elementos en el stock
    if (!stock_existe(Stock)) return alert("No existe stock aún.");

    const cod = parseInt(pedir_dato("Ingrese el código del producto a eliminar:", verificar_num));
    const producto = Stock.find(p => p.codigo === cod);

    if (producto && producto.activo) {
        producto.activo = false;
        alert(`Producto ${producto.nombre} dado de baja.`);
    }
    else {
        alert("Código no válido o producto ya inactivo.");
    }
}

//funcion 3 vender
function vender() {
    if (!stock_existe(Stock)) return alert("No hay stock aún.");

    visualizar();
    //! se verifica el codigo ingresado y si esta activo
    const codigo = parseInt(pedir_dato("Ingrese el código del producto a vender:", verificar_num));
    const producto = Stock.find(p => p.codigo === codigo && p.activo);

    if (!producto) return alert("Código no válido o producto inactivo.");

    //! Se verifica si hay cantidad disponible
    const cantidad = parseInt(pedir_dato("Ingrese la cantidad vendida:", verificar_num));
    if (producto.stock < cantidad) {
        return alert("Stock insuficiente.");
    }

    //! se verifica medio de pago solo 1 o 2
    let medio_pago;
    do {
        medio_pago = parseInt(pedir_dato("Ingrese 1 - EFECTIVO / 2 - TRANSFERENCIA:", verificar_num));
    } while (!(medio_pago === 1 || medio_pago === 2));

    //! Ingreso de dinero
    const ingreso = parseFloat(pedir_dato("Ingrese la cantidad abonada:", verificar_num));

    // Registrar venta
    // se establece el total + se resta al stock + se suma el arreglo ventas
    const total = producto.precio * cantidad;
    producto.stock -= cantidad;
    Ventas.vendido += total;
    if (medio_pago == 1) {
        Ventas.efectivo += ingreso;
    }
    else {
        Ventas.transferencia += ingreso;
    }
    alert(`Producto ${producto.nombre} vendido.`);
}


function cierre_diario() {

}

function visualizar() {
    // si existe continuar
    if (stock_existe(Stock)) {
        let mensaje = "Productos en stock:\n\n";

        // recorrer el arreglo, guardar en puntero p cada elemento del arreglo (cada producto)
        for (let i = 0; i < Stock.length; i++) {
            const p = Stock[i];

            // Mostrar solo productos activos y agregar un mensaje general
            if (p.activo) {
                mensaje += `${i + 1}. Código: ${p.codigo} | Nombre: ${p.nombre} | Precio: $${p.precio} | Stock: ${p.stock}\n`;
            }
        }

        alert(mensaje);
    } 
    else {
        alert("No existe stock aún.");
    }
}


//! VARIABLES USO GENERAL/GLOBAL
// stock se inicializa vacio, alli se cargan los productos nuevos
const Stock = [];

// clase para crear nuevos productos que se ingresan al stock
//! atributo activo es para eliminar productos temporales
class Productos {
    constructor(codigo, nombre, precio, cantidad, activo = true) {
        this.codigo = codigo
        this.nombre = nombre
        this.precio = precio
        this.stock = cantidad
        this.activo = activo
    }
}

// objeto ventas donde se cargaran las transacciones diarias
const Ventas = {
    vendido: 0,
    efectivo: 0,
    transferencia: 0
};

let opcion = -1;
while (opcion !== 0) {
    opcion = prompt("Ingrese la opcion deseada: \n0- Salir\n1- Agregar producto\n2- Eliminar producto\n3- Vender producto\n4- Cerrar caja\n5- Visualizar stock");
    opcion = parseInt(opcion);

    switch (opcion) {
        case 0:
            alert("Hasta la vista");
            break;

        case 1:
            agregar_producto();
            break;

        case 2:
            eliminar_producto();
            break;

        case 3:
            vender();
            break;

        case 4:
            cierre_caja();
            break;

        case 5:
            visualizar();
            break;

        default:
            alert("Ingrese una opcion valida");
    }
}
