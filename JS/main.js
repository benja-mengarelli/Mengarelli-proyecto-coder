//! Crear tabla pagina Stock
function crearTabla(tbody) {
    //LIMPIAR LA TABLA
    tbody.innerHTML = "";
    Stock.forEach((prod) => {
        const fila = document.createElement("tr");
        const tdCod = document.createElement("td");
        const tdNom = document.createElement("td");
        const tdPrc = document.createElement("td");
        const tdCant = document.createElement("td");
        const tdimg = document.createElement("td");

        fila.dataset.id = prod.codigo;
        tdCod.textContent = prod.codigo;
        tdNom.textContent = prod.nombre;
        tdPrc.textContent = prod.precio;
        tdCant.textContent = prod.stock;
        tdimg.innerHTML = `<img src="${prod.imagen}" alt="img" width="25" height="25">`;

        fila.append(tdCod, tdNom, tdCant, tdPrc, tdimg);
        tbody.appendChild(fila);

    })
}

//! Crear tabla pagina ventas
function tablaVentas(cajaBody) {
    cajaBody.innerHTML = ""

    Stock.forEach((prod) => {
        const cajaProd = document.createElement("div");
        cajaProd.className = "producto";
        cajaProd.innerHTML =
            `
        <img src="${prod.imagen}" alt="${prod.nombre}">
        <p>${prod.nombre}</p>
        `;

        if (prod.stock === 0) {
            cajaBody.className += "prodDesactivado";
        }

        cajaBody.appendChild(cajaProd);
    })
}

//! VARIABLES USO GENERAl || No hace falta convertir valores
// stock se inicializa vacio o se parsean si hay guardados
let Stock = JSON.parse(localStorage.getItem("Stock")) || [];

// ventas se inicializa si no existe
let Ventas = JSON.parse(localStorage.getItem("Ventas")) || { ventas: 0, efectivo: 0, transferencia: 0 };
// carrito para manejo de ventas
let Carrito = [];
// para pagina ventas
let productosVendidos = JSON.parse(localStorage.getItem("productosVendidos")) || [];
let flagApertura = false;

// cuentas corrientes generales
let cuentas_corrientes = JSON.parse(localStorage.getItem("C/C")) || [];

// clase para crear nuevos productos que se ingresan al stock
class Productos {
    constructor(codigo, nombre, precio, cantidad, imagen) {
        this.codigo = codigo
        this.nombre = nombre
        this.precio = precio
        this.stock = cantidad
        this.imagen = imagen
    }
}

//! VERIFICAR / OPCIONAL
document.querySelectorAll("#ir-a-seccion").forEach(btn => {
    btn.addEventListener("click", () => {
        //! Por cada click guardar los datos en formato JSON en StORAGE
        localStorage.setItem("Stock", JSON.stringify(Stock));
        localStorage.setItem("Ventas", JSON.stringify(Ventas));
        localStorage.setItem("C/C", JSON.stringify(C / C));
    })
});

//! SECCION 2 / PAGINA STOCK
document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector("#tablaStock")) {

        // BOTONES
        const agregar = document.getElementById("btnAgregar");
        const editar = document.getElementById("btnEditar");
        const eliminar = document.getElementById("btnEliminar");
        // MANEJO POPUP Y CARGA DE DATOS
        const popup = document.getElementById("esconder-pop-up");
        const cerrarPopup = document.getElementById("cerrarPopup");
        const form = document.getElementById("formDatos");
        // Tabla y cuerpo tabla // flag control boton
        const tabla = document.querySelector("#tablaStock");
        const tbody = document.querySelector("#tabla-productos")
        // flags para los modos
        let modoEdicion = false;
        let prodEdicionIndex = null;
        let modoEliminar = false;

        crearTabla(tbody);

        //! AGREGAR STOCK
        agregar.addEventListener("click", () => {
            popup.style.display = "flex";
        });

        cerrarPopup.addEventListener("click", () => {
            popup.style.display = "none";
            //! reiniciar flag
            prodEdicionIndex = null;
            form.reset();
        });

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const nombre = form.elements["nombre"].value;
            const precio = parseFloat(form.elements["precio"].value);
            const cantidad = parseInt(form.elements["cantidad"].value);
            const imagen = form.elements["imagen"].value;

            // Nuevo producto
            if (prodEdicionIndex === null) {
                const cdg = Stock.length > 0 ? Stock[Stock.length - 1].codigo + 1 : 1;
                const nuevo_producto = new Productos(cdg, nombre, precio, cantidad, imagen);
                Stock.push(nuevo_producto);
            }
            // Editar producto
            else {
                Stock[prodEdicionIndex].nombre = nombre;
                Stock[prodEdicionIndex].precio = precio;
                Stock[prodEdicionIndex].stock = cantidad;
                Stock[prodEdicionIndex].imagen = imagen;
                //! Reseteo del flag
                prodEdicionIndex = null;
            }

            localStorage.setItem("Stock", JSON.stringify(Stock));
            //? Cerrar pop-up carga datos
            crearTabla(tbody);
            popup.style.display = "none";
            form.reset();
        });

        //! ELIMINAR STOCK
        eliminar.addEventListener("click", () => {
            modoEliminar = !modoEliminar;
            tabla.classList.toggle("editable", modoEliminar);
            eliminar.textContent = modoEliminar ? "Terminar Edicion" : "Eliminar producto";
        });

        tbody.addEventListener("click", (elemento) => {
            if ((!modoEliminar) && (!modoEdicion)) return;

            const fila = elemento.target.closest("tr");
            if (!fila) return;

            if (modoEliminar) {
                const id = Number(fila.dataset.id);
                Stock = Stock.filter(prod => prod.codigo !== id);
                localStorage.setItem("Stock", JSON.stringify(Stock));
                crearTabla(tbody);
            }
            else if (modoEdicion) {
                const id = Number(fila.dataset.id);
                const index = Stock.findIndex(prod => prod.codigo === id);

                if (index !== -1) {
                    // establecer el elemento de busqueda para editarlo
                    prodEdicionIndex = index;

                    // Poner los valores en el form
                    form.elements["nombre"].value = Stock[index].nombre;
                    form.elements["precio"].value = Stock[index].precio;
                    form.elements["cantidad"].value = Stock[index].stock;

                    popup.style.display = "flex";
                }
            }
        })

        //! Editar stock
        editar.addEventListener("click", () => {
            modoEdicion = !modoEdicion;
            tabla.classList.toggle("editable", modoEdicion);
            editar.textContent = modoEdicion ? "Terminar Edicion" : "Editar producto";

            if (!modoEdicion) {
                //! reiniciar flag
                prodEdicionIndex = null;
                form.reset();
            }
        })
    }
})


//! SECCION 3 / PAGINA VENTAS
let cajaProductos = document.getElementById("caja-productos");
tablaVentas(cajaProductos);

let abrirCaja = document.getElementById("abrirCaja");
let cerrarCaja = document.getElementById("cerrarCaja");
let eliminar = document.getElementById("btnEliminarVenta");
let cobrar = document.getElementById("btnCobrarVenta");
let agregarCC = document.getElementById("btnAgregarVentaCC");
let totalCarrito = document.getElementById("total-carrito");
let total = 0;
let tbodyCarrito = document.getElementById("tbodyCarrito");
let totalVendido = document.getElementById("totalVendido");
let totalEft = document.getElementById("totalEft");
let totalTransf = document.getElementById("totalTransf");

// apertura caja habilita transacciones
funcionAbrirCaja();


function funcionAbrirCaja() {
    abrirCaja.addEventListener("click", () => {
        cerrarCaja.classList.replace("botonInactivo", "botonActivo");
        eliminar.classList.replace("botonInactivo", "botonActivo");
        cobrar.classList.replace("botonInactivo", "botonActivo");
        agregarCC.classList.replace("botonInactivo", "botonActivo");
        abrirCaja.classList.replace("botonActivo", "botonInactivo");

        //! se habilitan los event listener
        eliminar.addEventListener("click", funcionEliminar);
        cobrar.addEventListener("click", funcionCobrar);
        agregarCC.addEventListener("click", funcionAgregarCC);
        cerrarCaja.addEventListener("click", funcionCerrarCaja);

        abrirCaja.removeEventListener("click", funcionAbrirCaja);

        const productos = cajaProductos.querySelectorAll(".producto");
        productos.forEach(prod => {
            prod.addEventListener("click", funcionCarrito);
        });
    })
};

function funcionCerrarCaja() {
    // cierre caja deshabilita transacciones
    cerrarCaja.classList.replace("botonActivo", "botonInactivo");
    eliminar.classList.replace("botonActivo", "botonInactivo");
    cobrar.classList.replace("botonActivo", "botonInactivo");
    agregarCC.classList.replace("botonActivo", "botonInactivo");
    abrirCaja.classList.replace("botonInactivo", "botonActivo");

    //! se deshabilitan los event listener
    abrirCaja.addEventListener("click", funcionAbrirCaja);
    eliminar.removeEventListener("click", funcionEliminar);
    cobrar.removeEventListener("click", funcionCobrar);
    agregarCC.removeEventListener("click", funcionAgregarCC);
    cerrarCaja.removeEventListener("click", funcionCerrarCaja);

    const productos = cajaProductos.querySelectorAll(".producto");
    productos.forEach(prod => {
        prod.removeEventListener("click", funcionCarrito);
    });

    funcionEliminar();
    //! agregar transferencia datos cierre caja

};

function funcionEliminar() {
    //! Agregar sweet aler que diga carrito vaciado
    //! agregar timer junto al SA
    Carrito = []
    tbodyCarrito.innerHTML = ``;
    totalCarrito.innerText = `Total: $0`;
    total = 0;
};

function funcionCobrar() {

    const popup = document.getElementById("esconder-pop-up-1");
    const cerrarPopup = document.getElementById("cerrarPopup-1");
    const form = document.getElementById("formDatos-1");
    const totalCuenta = document.getElementById("total_cuenta");
    const inputAbonado = form.elements["Abonado"];
    const inputMedioPago = form.elements["medioPago"];
    const vueltoSpan = document.getElementById("vuelto");

    popup.style.display = "flex";
    totalCuenta.innerText = `Total a pagar: $${total}`;
    vueltoSpan.innerText = "";

    cerrarPopup.addEventListener("click", () => {
        popup.style.display = "none";
        vueltoSpan.innerText = "";
        //! reiniciar form
        form.reset();
    });

    inputAbonado.addEventListener("input", () => {
        const pagado = inputAbonado.value || 0;
        if (pagado >= total) {
            const vuelto = pagado - total;
            vueltoSpan.innerText = `Vuelto: $${vuelto}`;
        } else {
            vueltoSpan.innerText = "";
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const medioPago = inputMedioPago.value;
        const pagado = inputAbonado.value || 0;

        if (pagado < total) {
            alert("AAAAAAAA");
            return;
        }

        if (medioPago === "Efectivo") {
            Ventas.efectivo += total;
        }
        else {
            Ventas.transferencia += total;
        }
        Ventas.ventas += total;
        totalEft.innerText = `$${Ventas.efectivo}`;
        totalTransf.innerText = `$${Ventas.transferencia}`;
        totalVendido.innerText = `$${Ventas.ventas}`;

        funcionEliminar();
        popup.style.display = "none";
        form.reset();
        vueltoSpan.innerText = "";

    });
}

function funcionAgregarCC() {

    const popup = document.getElementById("esconder-pop-up-2");
    const cerrarPopup = document.getElementById("cerrarPopup-2");
    const form = document.getElementById("formDatos-2");

    popup.style.display = "flex";

    cerrarPopup.addEventListener("click", () => {
        popup.style.display = "none";
        //! reiniciar form
        form.reset();
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nombre = form.elements["nombre"].value;

        popup.style.display = "none";
        form.reset();
        const personaCC = {
            nombre: nombre,
            deudas: [...Carrito],
            total: Carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0)
        }

        cuentas_corrientes.push(personaCC);
        localStorage.setItem("C/C", JSON.stringify(cuentas_corrientes));

        funcionEliminar();
        //! Agregar SA
    });

};


function funcionCarrito(e) {
    // obtenemos el nombre desde el <p> dentro del producto
    const nombre = e.currentTarget.querySelector("p").textContent;

    // buscamos el producto en el stock (siempre estará)
    const prod = Stock.find(item => item.nombre === nombre);

    // buscamos si ya está en el carrito
    const prodCarrito = Carrito.find(item => item.nombre === nombre);

    if (prodCarrito) {
        // si ya existe en el carrito → sumar cantidad
        prodCarrito.cantidad += 1;
        const fila = document.querySelector(`tr[data-nombre='${nombre}']`);
        fila.querySelector(".cantidad").textContent = prodCarrito.cantidad;

    } else {
        // si no está → lo agregamos
        Carrito.push({
            nombre: prod.nombre,
            precio: prod.precio,
            cantidad: 1
        });
        // crear nueva fila
        const fila = document.createElement("tr");
        fila.dataset.nombre = prod.nombre; // para identificar la fila

        fila.innerHTML = `
            <td>${prod.nombre}</td>
            <td>$${prod.precio}</td>
            <td class="cantidad">1</td>
        `;

        tbodyCarrito.appendChild(fila);
    }

    total += prod.precio;
    totalCarrito.textContent = `Total: $${total}`;


};