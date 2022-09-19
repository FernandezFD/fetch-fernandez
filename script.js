
let carrito = JSON.parse(localStorage.getItem("carrito"))||[];

let productosJSON = [];
let dolarVenta;
let lista


window.onload=()=>{
    lista=document.getElementById("milista");
    document.getElementById("fila_prueba").style.background="white";
    obtenerValorDolar();

    document.getElementById("miSeleccion").setAttribute("option", "pordefecto");
    document.getElementById("miSeleccion").onchange=()=>ordenar();
};

function renderizarProductos() {

    console.log(productosJSON)
    for (const prod of productosJSON) {
        lista.innerHTML+=(`<li class="col-sm-3 list-group-item">
        <h3>ID: ${prod.id}</h3>
        <img src="${prod.foto}" class="img-fluid">
        <p>Producto: ${prod.nombre}</p>
        <p>Precio $ ${prod.precio}</p>
        <p>Precio U$ ${(prod.precio/dolarVenta).toFixed(1)}</p>
        <button class="btn btn-danger" id='btn${prod.id}'>COMPRAR</button>
    </li>`);
    }

    productosJSON.forEach(prod=> {

         document.getElementById(`btn${prod.id}`).onclick= function() {
            agregarACarrito(prod);
        };
    });
}

function agregarACarrito(productoNuevo) {
    let encontrado = carrito.find(p => p.id == productoNuevo.id);
    console.log(encontrado);
    if (encontrado == undefined) {
        let prodACarrito = {
            ...productoNuevo,
            cantidad:1
        };
        carrito.push(prodACarrito);
        console.log(carrito);
        Swal.fire(
            'Nuevo producto agregado al carro',
            productoNuevo.nombre,
            'success'
        );

        document.getElementById("tablabody").innerHTML+=(`
            <tr id='fila${prodACarrito.id}'>
            <td> ${prodACarrito.id} </td>
            <td> ${prodACarrito.nombre}</td>
            <td id='${prodACarrito.id}'> ${prodACarrito.cantidad}</td>
            <td> ${prodACarrito.precio}</td>
            <td> <button class='btn btn-light' onclick='eliminar(${prodACarrito.id})'>🗑️</button>`);
    } else {
 
        let posicion = carrito.findIndex(p => p.id == productoNuevo.id);
        console.log(posicion);
        carrito[posicion].cantidad += 1;

        document.getElementById(productoNuevo.id).innerHTML=carrito[posicion].cantidad;
    }

    document.getElementById("gastoTotal").innerText=(`Total: $ ${calcularTotal()}`);
    localStorage.setItem("carrito",JSON.stringify(carrito));
}

function calcularTotal() {
    let suma = 0;
    for (const elemento of carrito) {
        suma = suma + (elemento.precio * elemento.cantidad);
    }
    return suma;
}

function eliminar(id){
    let indice=carrito.findIndex(prod => prod.id==id);
    carrito.splice(indice,1);
    let fila=document.getElementById(`fila${id}`);
    document.getElementById("tablabody").removeChild(fila);
    document.getElementById("gastoTotal").innerText=(`Total: $ ${calcularTotal()}`);
    localStorage.setItem("carrito",JSON.stringify(carrito));
    Swal.fire("Producto eliminado del carro!")
}

function ordenar() {
    let seleccion = document.getElementById("miSeleccion").value;
    console.log(seleccion)
    if (seleccion == "menor") {
        productosJSON.sort(function(a, b) {
            return a.precio - b.precio
        });
    } else if (seleccion == "mayor") {
        productosJSON.sort(function(a, b) {
            return b.precio - a.precio
        });
    } else if (seleccion == "alfabetico") {
        productosJSON.sort(function(a, b) {
            return a.nombre.localeCompare(b.nombre);
        });
    }
    lista.innerHTML="";
    renderizarProductos();
}


async function obtenerJSON() {
    const URLJSON="productos.json"
    const resp=await fetch(URLJSON)
    const data= await resp.json()
    productosJSON = data;

    renderizarProductos();
}



async function obtenerValorDolar() {
    const URLDOLAR = "https://api-dolar-argentina.herokuapp.com/api/dolarblue";
    const resp=await fetch(URLDOLAR)
    const data=await resp.json()
    document.getElementById("fila_prueba").innerHTML+=(`<p align="center">Dolar compra: $ ${data.compra}  Dolar venta: $ ${data.venta}</p>`);
    dolarVenta = data.venta;
    obtenerJSON();
}

let finalizar=document.getElementById("finalizar");
finalizar.onclick=()=>{
    Swal.fire({
        title: 'Compra confirmada',
        text: 'Estamos preparando su envio',

        imageWidth: 170,
        imageHeight: 160,
        imageAlt: 'ok',
    });
    //borrar tabla, array carrito y local storage
    
    //Toastify
    Toastify({
        text:"Gracias por tu compra",
        duration:2500,
        gravity:"top",
        position:"right"
    }).showToast();

    //LUXON
    //AL momento de cerrar la compra...
    const fin=DateTime.now();
    const Interval=luxon.Interval;
    const tiempo=Interval.fromDateTimes(inicio,fin);
    console.log("Tardaste "+tiempo.length('minutes')+" minutos en cerrar la compra!");
}
