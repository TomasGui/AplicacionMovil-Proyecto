class destino {
    constructor(paramDestino,paramCantEnvios) {
        this.destino = paramDestino;
        this.cantEnvios = paramCantEnvios;
    }
}
/*
import { Share } from '@capacitor/share';

async function Compartir () {
    await Share.share({
        title: 'See cool stuff',
        text: 'Really awesome thing you need to see right meow',
        url: 'http://ionicframework.com/',
        dialogTitle: 'Share with buddies',
      });
      
}*/


//paginas
let paginaRegistro = document.querySelector("pagina-registro");
let paginaHome = document.querySelector("pagina-home");
let paginaLogin = document.querySelector("pagina-login");
let paginaCalculadora = document.querySelector("pagina-calculadora");
let paginaAgregarEnvio = document.querySelector("pagina-agregarenvio");
let paginaListaEnvios = document.querySelector("pagina-listaenvio");
let paginaDetalleEnvio = document.querySelector("pagina-detalleenvio");
let paginaEstadisticas = document.querySelector("pagina-estadisticas");
let paginaCiudadCercana = document.querySelector("pagina-ciudadcercana");

let router = document.querySelector("ion-router");
let itemsMenu = document.querySelectorAll(".item-menu");
let menu = document.querySelector("ion-menu");

inicializar() ;

function inicializar(){
    //itero todos los items del menu para escuchar el click y cerrarlo despues de navegar
    iterarMenu ();
    //cade vez cambie la ruta de navegacion mostramos u ocultamos paginas
    router.addEventListener("ionRouteDidChange", cambioDeRuta);
    //Accion de registrar
    document.querySelector("#registrar_btn").addEventListener("click", registrarUsuario);
    //Accion de registrar
    document.querySelector("#login_btn").addEventListener("click", validarDatosLogin);
    //Accion calcular distancia
    document.querySelector("#btn_calcular_distancia").addEventListener("click", validarCiudadesCalculadora);
    //Accion de agregar envio
    document.querySelector("#btn_agregar_envio").addEventListener("click", altaAgregarEnvio);
    //Accion de Cerrar Sesion
    document.querySelector("#cerrarSesion").addEventListener("click", cerrarSesion) ;
    //Accion de eliminar un registro
    document.querySelector("#btn_ciudad_cercana").addEventListener("click", cargarPosicionUsuario);
}


function iterarMenu () {
    
itemsMenu.forEach(item => {
    item.addEventListener("click", cerrarMenu)
});
}

function cambioDeRuta(event) {

    console.log("ionRouteDidChange", event);
    let navegacion = event.detail;
    let paginas = document.getElementsByClassName("pagina");
    // oculto todas las páginas
    for (let i=0; i < paginas.length; i++) {
        paginas[i].style.display = "none"
    }
     //Mostramos el home al usuario si abre la aplicacion y ya se conecto
     if(navegacion.to === '/' && !localStorage.getItem("apiKey")) {
        paginaLogin.style.display = "block";
    } else if (navegacion.to === "/" && localStorage.getItem("apiKey")) {
        paginaHome.style.display = "block"
    }

    if(navegacion.to === "/home") {
        paginaHome.style.display = "block"
    }
    if(navegacion.to === "/registro") {
        paginaRegistro.style.display = "block"
    }
    if(navegacion.to === "/login") {
        paginaLogin.style.display = "block"
    }
    if(navegacion.to === "/calculadora") {
        paginaCalculadora.style.display = "block"
        generarComboCiudades("ciudad1");
        generarComboCiudades("ciudad2");
    }
    if(navegacion.to === "/agregar") {
        paginaAgregarEnvio.style.display = "block";
        generarComboCiudades("agregar_ciudadOrigen");
        generarComboCiudades("agregar_ciudadDestino");
        generarComboCategorias("agregar_categoria");
    }
    
    if(navegacion.to === "/lista") {
        paginaListaEnvios.style.display = "block";
        generarListaEnvios("lista_envios") ;
        
    }
    if(navegacion.to === "/detalleenvio") {
        paginaDetalleEnvio.style.display = "block";
        //Compartir();
    }
    if(navegacion.to === "/estadisticas") {
        calcularGastoTotal();
        departamentosConMasEnvios();
        paginaEstadisticas.style.display = "block"
    }
    
    if(navegacion.to === "/ciudadcercana") {
        paginaCiudadCercana.style.display = "block"
    }
}

function cerrarSesion (){
    
    let mensaje = "Desea cerrar sesión ?" ; 
    let rutaSalir = "/" ; 
    let rutaCancelar = "/home"
    presentAlertConfirm(mensaje , rutaSalir , rutaCancelar);
}

function cerrarMenu(){
    menu.close();
}

function registrarUsuario () {

    let nombreUsuario = document.querySelector("#registro_nombre").value ; 
    let password = document.querySelector("#registro_password").value ; 

    try {
        if (!nombreUsuario) {
            throw "Por favor ingrese un usuario";
        }
        if (!password) {
            throw "Por favor ingrese un password";
        }
        if (nombreUsuario != "" && password != "") {
            let url = `https://envios.develotion.com/usuarios.php`;
            consultarAPIRegistroLogin (url,nombreUsuario, password); 
        }
    } catch (error) {
        mostrarMensajeError(error)
    }
}

function consultarAPIRegistroLogin (url,nombreUsuario, password) {
    fetch(url , {
        method: 'POST',
        body: JSON.stringify({
        usuario: `${nombreUsuario}`,
        password: `${password}`
        }),
        headers: {
        "Content-type": "application/json"
        } })
    .then(function(respuesta) {
        return respuesta.json();
    }).then(function(data) {
        if (url == "https://envios.develotion.com/usuarios.php" ) {
            let mensaje = mensajeRegistro(data) ;
            mostrarMensajeError(mensaje);
            if(data.codigo==200){
                borrarCampos(`registro`);
            }
        } else {
            let mensaje = mensajeLogin(data);
            if (mensajeLogin(data) == ""){
                borrarCampos(`login`);
                //Guardar en localstorage ApiKey y idUsuario
                localStorage.setItem("apiKey", data.apiKey);
                localStorage.setItem("id", data.id);
                router.push('/home');
            } else {
                mostrarMensajeError(mensaje);
            }
        }
    })
}

function validarDatosLogin() {
    let usuario = document.querySelector("#login_nombre").value;
    let password = document.querySelector("#login_password").value;
    try {
        if (!usuario || !password) {
            throw "Ambos campos son olbigatorios"
        } else {
            let url = 'https://envios.develotion.com/login.php';
            consultarAPIRegistroLogin(url,usuario,password);
        }
    } catch (error) {
        mostrarMensajeError(error);
    }
}

function mensajeRegistro(data){
    let mensaje = "";
    if(data.codigo==200) {
        mensaje ="Se ha registrado con extio \n";
        mensaje += `\n Su Token : ${data.apiKey}`
    }
    if(data.codigo==409) {
        mensaje = data.mensaje ; 
    }
    return mensaje;
}

function mensajeLogin(data) {
    let mensaje = "";
    if (data.codigo == 404 || data.codigo == 409){
        mensaje = data.mensaje;
    }
    return mensaje;
}

function borrarCampos(seccion) {
    document.querySelector(`#${seccion}_nombre`).value ="" ; 
    document.querySelector(`#${seccion}_password`).value=""; 
}

async function mostrarMensajeError(mensaje) {
    const alert = document.createElement('ion-alert');
    alert.header = 'Aviso';
    alert.message = mensaje;
    alert.buttons = ['OK'];
  
    document.body.appendChild(alert);
    await alert.present();
}

async function presentAlertConfirm(mensaje , rutaSalir , rutaCancelar) {

    const alert = document.createElement('ion-alert');
    alert.cssClass = 'my-custom-class';
    alert.header = 'AVISO';
    alert.message = `<strong> ${mensaje} </strong>!!!`;
    alert.buttons = [
       {
        text: 'SI',
        id: 'confirm-button',
        handler: () => {
            localStorage.clear();
            router.push(rutaSalir);
          console.log('Confirm Okay')
        }
      },
      {
        text: 'NO',
        role: 'cancel',
        cssClass: 'secondary',
        id: 'cancel-button',
        handler: (blah) => {
        router.push(rutaCancelar);
          console.log('Cancelar');
        }
      }
    ];
  
    document.body.appendChild(alert);
    return alert.present();
  }

async function validarCiudadesCalculadora(){
    let ciudad1 = document.querySelector("#ciudad1").value;
    let ciudad2 = document.querySelector("#ciudad2").value;
    try{
        if (ciudad1 == ciudad2) {
            throw "Las ciudades deben ser distintas";
        } else {
            let distancia = await calcularDistancia(ciudad1,ciudad2) ;
            await generarMapa(ciudad1,ciudad2, 'map');
            document.querySelector("#distanciaNumero").innerHTML = `La distancia entre ciudades es ${distancia} km.`;
            
        }
    } catch(error) {
        mostrarMensajeError(error);
    }
}

async function calcularDistancia(c1,c2) {

    let c1lat = 0;
    let c1lon = 0;
    let c2lat = 0;
    let c2lon = 0;
    let distanciaCalculada = 0 ; 

    let data = await consultarCiudades();

            let ciudades = data.ciudades;
            for(let i=0 ; i<ciudades.length ; i++) {
                if (c1 == ciudades[i].id)  {
                    c1lat = ciudades[i].latitud;
                    c1lon = ciudades[i].longitud;
                } else if (c2 == ciudades[i].id) {
                    c2lat = ciudades[i].latitud;
                    c2lon = ciudades[i].longitud;
                }
            } 
            distanciaCalculada =  obtenerDistanciaViaLatLon(c1lat, c1lon, c2lat, c2lon);
            /*if (necesitoMapa) {
                generarMapa(c1lat, c1lon, c2lat, c2lon, c1Nombre, c2Nombre, 'map');
                
                document.querySelector("#distanciaNumero").innerHTML = `La distancia entre ciudades es ${distanciaCalculada} km.`;
            }*/
        return distanciaCalculada;
}


let map = null;
async function generarMapa(c1, c2, idHtml) {
    let data = await consultarCiudades();
    let ciudades = data.ciudades;
    let c2Nombre = "";
    let c1Nombre = "";
    
    let c1lat = 0;
    let c1lon = 0;
    let c2lat = 0;
    let c2lon = 0;

    for(let i=0 ; i<ciudades.length ; i++) {
        if (c1 == ciudades[i].id)  {
            c1Nombre = ciudades[i].nombre;
            c1lat = ciudades[i].latitud;
            c1lon = ciudades[i].longitud;
        } else if (c2 == ciudades[i].id) {
            c2Nombre = ciudades[i].nombre;
            c2lat = ciudades[i].latitud;
            c2lon = ciudades[i].longitud;
            }
    }
    if (map != null) {
        map.remove();
    }
    map = L.map(idHtml).setView([c1lat, c1lon], 6);
        
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
        
    L.marker([c1lat, c1lon]).addTo(map)
        .bindPopup(c1Nombre);
    L.marker([c2lat, c2lon]).addTo(map)
        .bindPopup(c2Nombre)
        .openPopup();
    let latlngs = [
            [c1lat, c1lon],
            [c2lat, c2lon]
        ];
    let polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
    // zoom the map to the polyline
    map.fitBounds(polyline.getBounds());
}

function obtenerDistanciaViaLatLon(lat1, lon1, lat2, lon2) {
	var R = 6371;
	var dLat = deg2rad(lat2-lat1);
	var dLon = deg2rad(lon2-lon1); 
	var a = 
	Math.sin(dLat/2) * Math.sin(dLat/2) +
	Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
	Math.sin(dLon/2) * Math.sin(dLon/2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;
	return d.toFixed(2);
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

//Consultar API - GET Obtener Ciudades y retorna los datos de las ciudades
async function consultarCiudades() {
    let url = `https://envios.develotion.com/ciudades.php`;
    let response = await fetch(url , {
        method: 'GET',
        headers: {
        "apikey": localStorage.getItem("apiKey"), // agregar token del usuario logeado
        "Content-type": "application/json"
        } })
    let data= await response.json();
    return data ; 
}

//Generar combo Select Ciudades
async function generarComboCiudades(idSelector) {
    let data = await consultarCiudades() ;
    let opciones = "" ;
    if (data.codigo == 200) {
        let ciudades = data.ciudades;
        for(let i=0 ; i<ciudades.length ; i++) {
            opciones += `<ion-select-option value=${ciudades[i].id}> ${ciudades[i].nombre} </ion-select-option>`;
        }
        document.querySelector(`#${idSelector}`).innerHTML = opciones;
    } else {
        let mensaje = "Error al conectarse al servidor" ;
        mostrarMensajeError(mensaje);
    }
}
//Consultar API - GET Obtener Categorias y devuelve la consulta 
async function consultarCategorias() {
    let url = `https://envios.develotion.com/categorias.php`; 
    let response = await fetch(url , {
        method: 'GET',
        headers: {
        "apikey": localStorage.getItem("apiKey"), // agregar token del usuario logeado
        "Content-type": "application/json"
        } })
    let data = await response.json();
    return data ; 
} 

//Generar combo Select categoria
async function generarComboCategorias(idSelector) {
    let data = await consultarCategorias();
    let opciones = "" ;
    if (data.codigo == 200) {
        let categorias = data.categorias;
        for(let i=0 ; i<categorias.length ; i++) {
            opciones += `<ion-select-option value=${categorias[i].id}> ${categorias[i].nombre} </ion-select-option>`;
        }
        document.querySelector(`#${idSelector}`).innerHTML = opciones;
    } else {
        let mensaje = "Error al conectarse al servidor" ;
        mostrarMensajeError(mensaje);
    }
}


async function altaAgregarEnvio () {

    let idUsuario = localStorage.getItem("id");
    let idCiudadOrigen = document.querySelector("#agregar_ciudadOrigen").value;
    let idCiudadDestino = document.querySelector("#agregar_ciudadDestino").value;
    let peso = document.querySelector("#agregar_peso").value;
    let idCategoria = document.querySelector("#agregar_categoria").value;
    let distanciaCalculada= await calcularDistancia(idCiudadDestino , idCiudadOrigen, false); 
    const precioBase = 50 ; 
    const precioPorKilo = 10 ;
    const precioPorKilometro = 50 ;
    
    try {
        if (!idUsuario) {
            throw "No se pudo cargar el usuario correctamente";
        }
        if (!idCiudadOrigen) {
            throw "Seleccione una ciudad de Origen";
        }
        if (!idCiudadDestino) {
            throw "Seleccione una ciudad de Distino";
        }
        if (idCiudadDestino == idCiudadOrigen) {
            throw "Seleccione ciudades diferentes";
        }
        if (!peso || parseFloat(peso)<=0) {
            throw "Ingrese un peso (kg) mayor a cero";
        }
        if (!idCategoria) {
            throw "Seleccione una categoria";
        }
        if (distanciaCalculada>0) {
            let precioTotal = precioBase + (precioPorKilo * parseInt(peso)) ;
            let addicionalPrecioKm = precioPorKilometro * Math.floor(distanciaCalculada/100);
            precioTotal+= addicionalPrecioKm;
            let datosEnviados = await agregarEnvioAPI(idUsuario,idCiudadOrigen,idCiudadDestino , idCategoria , distanciaCalculada , peso , precioTotal);

                if(datosEnviados.codigo==200) {
                    mostrarMensajeError(datosEnviados.mensaje);
                    borrarCamposAgregarEnvio();
                } else {
                    mostrarMensajeError(datosEnviados.mensaje);
                }
        }
    } catch (error) {
        mostrarMensajeError(error)
    }
}

async function agregarEnvioAPI(idUsuario,idCiudadOrigen,idCiudadDestino , idCategoria , distancia , peso , precioTotal) {
    let url =`https://envios.develotion.com/envios.php`;
    let response = await fetch(url , {
        method: 'POST',
        body: JSON.stringify({
        idUsuario: `${idUsuario}`,
        idCiudadOrigen: `${idCiudadOrigen}`,
        idCiudadDestino: `${idCiudadDestino}`,
        peso: `${peso}`,
        distancia: `${distancia}`,
        precio: `${precioTotal}`,
        idCategoria: `${idCategoria}`,
        }),
        headers: {
        "apikey": localStorage.getItem("apiKey"),    
        "Content-type": "application/json"
        } })
    let data = await response.json();
    return data; 
}

function borrarCamposAgregarEnvio() {
    document.querySelector(`#agregar_ciudadOrigen`).value = "" ; 
    document.querySelector(`#agregar_ciudadDestino`).value=""; 
    document.querySelector(`#agregar_categoria`).value=""; 
    document.querySelector(`#agregar_peso`).value="";
}

async function consultarListaEnvios () {
    
    let idUsuario = localStorage.getItem("id");
    let apiKey = localStorage.getItem("apiKey");
    let url =`https://envios.develotion.com/envios.php?idUsuario=${idUsuario}`;
    let response = await fetch(url , {
        method: 'GET',
        headers: {
        "apikey": apiKey, 
        "Content-type": "application/json"
        } })
    let data = await response.json(); 
    return data ;
}

async function generarListaEnvios(idLista) {
    let data = await consultarListaEnvios () ; 
    let ciudades = await consultarCiudades ();
    let datoCompleto = agregarNombresCiudadesAEnvios(data , ciudades);
    let list = "" ;
    if(datoCompleto.codigo==200 ) {
        let listadoEnvios = datoCompleto.envios; 
        if(listadoEnvios.length>0) {
            
        for(let i=0; i<listadoEnvios.length; i++) {
            list += `<ion-item>
                    <ion-label>
                    <h2>Id ${listadoEnvios[i].id}</h2>
                    <p> Ciudad Origen :${listadoEnvios[i].nom_ciudad_origen}</p>
                    <p> Ciudad Destino :${listadoEnvios[i].nom_ciudad_destino}</p>
                    <p> Distancia : ${listadoEnvios[i].distancia} Km</p>
                    <p> Costo Total : $ ${listadoEnvios[i].precio}</p>
                    </ion-label>
                    <ion-icon name="add-circle-outline" style="zoom:2.0" class="btnDetalleEnvio" detalle-envio="${listadoEnvios[i].id}" id="detalle_id_${listadoEnvios[i].id}"></ion-icon>
                    <ion-icon name="trash-outline" style="zoom:2.0" class="btnEliminarEnvio" eliminar-envio="${listadoEnvios[i].id}" id="eliminar_envio_id${listadoEnvios[i].id}"></ion-icon>
                    </ion-item>`;
        }
        document.querySelector(`#${idLista}`).innerHTML =list ;
        accionDetalleEnvio();
        accionBotonEliminarEnvio ();
        } else {
            let mensaje = `<ion-item> 
                        <p> No hay envios presentes en el sistema </p>
                    </ion-item>`;
             document.querySelector(`#${idLista}`).innerHTML = mensaje ;
        }
        
    } else {
        mostrarMensajeError(data.mensaje);
    }
}

function accionDetalleEnvio () {
    const botonesDetalle = document.querySelectorAll(".btnDetalleEnvio");
    for (let i = 0; i < botonesDetalle.length; i++) {
        let botonActual = botonesDetalle[i];
        botonActual.addEventListener("click", detalleEnvio);
    }
}

function accionBotonEliminarEnvio () {
    const botonesEliminar = document.querySelectorAll(".btnEliminarEnvio");
    for (let i = 0; i < botonesEliminar.length; i++) {
        let botonActual = botonesEliminar[i];
        botonActual.addEventListener("click", eliminarEnvio);
    }
}

async function eliminarEnvio () {
    const idEnvio = this.getAttribute("eliminar-envio");
    let url = `https://envios.develotion.com/envios.php`;

    let response = await fetch(url , {
        method: 'DELETE',
        body: JSON.stringify({
        idEnvio: `${idEnvio}`        
        }),
        headers: {
        "apikey": localStorage.getItem("apiKey"),    
        "Content-type": "application/json"
        } })
    let data = await response.json();
    if(data.codigo==200) {
         mostrarMensajeError(data.mensaje);
        } else {
        mostrarMensajeError(data.mensaje);
    }
    
    generarListaEnvios("lista_envios"); 
}

async function detalleEnvio () {
    const idEnvio = this.getAttribute("detalle-envio");
    let data = await consultarListaEnvios();
    let ciudades = await consultarCiudades();
    let categoria = await consultarCategorias();
    let dataParcial = agregarNombresCiudadesAEnvios(data , ciudades); 
    let dataCompleta = agregarNombresCategoriasAEnvios(dataParcial , categoria); 
    router.push('/detalleenvio');
    console.log(dataCompleta)
    mostrarDetallesEnvio(idEnvio, dataCompleta);
}

function agregarNombresCiudadesAEnvios(datoEnvios , datoCiudades) {
    let envioCompleto = [];
    
    
    for (let i = 0 ; i<datoEnvios.envios.length ; i++) {
        let datoCompleto = null;
        let envio = datoEnvios.envios[i];
        let ciudad_origen = datoCiudades.ciudades.find(ciudad => ciudad.id === envio.ciudad_origen);
        let ciudad_destino = datoCiudades.ciudades.find(ciudad => ciudad.id === envio.ciudad_destino);
        datoCompleto = {
            ...envio,
            nom_ciudad_origen: ciudad_origen.nombre,
            nom_ciudad_destino: ciudad_destino.nombre
        }
        envioCompleto.push(datoCompleto);
    }

    let nuevoDatosEnvios = { 
        codigo: datoEnvios.codigo , 
        envios: envioCompleto }
    
    return nuevoDatosEnvios;
}

function agregarNombresCategoriasAEnvios(datoEnvios , datoCategorias) {
    let envioCompleto = [];

    for (let i = 0 ; i<datoEnvios.envios.length ; i++) {
        let datoCompleto = null;
        let envio = datoEnvios.envios[i];
        let categoria = datoCategorias.categorias.find(categoria => categoria.id === envio.id_categoria);
        datoCompleto = {
            ...envio,
            nom_categoria: categoria.nombre
        }
        envioCompleto.push(datoCompleto);
    }

    let nuevoDatosEnvios = { 
        codigo: datoEnvios.codigo , 
        envios: envioCompleto }
    console.log(nuevoDatosEnvios);
    return nuevoDatosEnvios;
}


function mostrarDetallesEnvio(idEnvio ,data){
    if(data.codigo==200 ){
        let envios = data.envios ; 
        let encontrado = false ;
        let detalleEnvio= "";
        let origen = 0 ;
        let destino = 0 ; 
        let i = 0 ; 
        while (i<envios.length && !encontrado)
        {
            if(envios[i].id == idEnvio){
                encontrado = true ; 
                let mapaDetalle = "mapaDetalle";
                detalleEnvio = `<ion-item>
                <ion-label>
                <h2>Id ${envios[i].id}</h2>
                <p> Ciudad Origen :${envios[i].nom_ciudad_origen}</p>
                <p> Ciudad Destino :${envios[i].nom_ciudad_destino}</p>
                <p> Distancia : ${envios[i].distancia} Km</p>
                <p> Peso : ${envios[i].peso} Kg</p>
                <p> Categoria: ${envios[i].nom_categoria}</p>
                <p> Costo Total : $ ${envios[i].precio}</p>
                </ion-label>
                <ion-icon name="share-social-outline" style="zoom:2.0" ></ion-icon>
                </ion-item>
                <div style="height: 400px;" id="${mapaDetalle}"></div>`

                origen = envios[i].ciudad_origen ;
                destino = envios[i].ciudad_destino;
            }
            i++;
        }
        document.querySelector(`#detalles`).innerHTML =detalleEnvio ;
        generarMapa(origen , destino ,mapaDetalle );
        console.log(detalleEnvio);

    } else {
        mostrarMensajeError(data.mensaje);
    }
}

async function calcularGastoTotal() {
    let data = await consultarListaEnvios();
    let total = 0;
    let envios = data.envios;
    for (let i = 0; i<envios.length; i++) {
        total += envios[i].precio;
    }
    document.querySelector("#gastoTotalEnvios").innerHTML = `<p>Su gasto total de envios es de $ ${total}</p>`;
}



async function departamentosConMasEnvios() {
    let dataEnvios = await consultarListaEnvios();
    let dataCiudades = await consultarCiudades ();
    let datoCompleto = agregarNombresCiudadesAEnvios(dataEnvios,dataCiudades);
    let resultado = "";
    let envios = datoCompleto.envios;
    let enviosMax = [];
    let destinosRepetidos = [];
    for (let i = 0; i<envios.length; i++) {
        let destinoActual = envios[i].nom_ciudad_destino;
        if(!destinoYaVisto(destinoActual,destinosRepetidos)){
            destinosRepetidos.push(destinoActual);
            let cantEnvios = 0;
            for (let n = 0; n<envios.length; n++) {
                if(destinoActual == envios[n].nom_ciudad_destino) {
                    cantEnvios++;
                }
            }
            let objetoDestino = new destino(destinoActual,cantEnvios);
            enviosMax.push(objetoDestino);
            if (enviosMax.length > 5) {
                let posicionDestinoMenosEnvios = obtenerMenorDestino(enviosMax);
                enviosMax.splice(posicionDestinoMenosEnvios, 1);
            }
        }
    }
    console.log(enviosMax);
    for (let i = 0; i<enviosMax.length; i++) {
        resultado += "<ion-item>";
        resultado += `<ion-label>${enviosMax[i].destino} - Total envios: ${enviosMax[i].cantEnvios}</ion-label>`;
        resultado += "</ion-item>";
    }
    document.querySelector("#departamentosMasEnvios").innerHTML = resultado;
}

function obtenerMenorDestino(listaEnvios) {
    let posicionMenorDestino = null;
    let min = Number.POSITIVE_INFINITY;
    for (let i = 0; i<listaEnvios.length; i++) {
        if (listaEnvios[i].cantEnvios < min) {
            min = listaEnvios[i].cantEnvios;
            posicionMenorDestino = i;
        }
    }
    return posicionMenorDestino;
}

function destinoYaVisto(destinoAbuscar,lista) {
    let esta = false;
    for (let i = 0; i<lista.length; i++) {
        if (destinoAbuscar == lista[i]) {
            esta = true;
        }
    }
    return esta;
}


let posicionUsuario = null;
let mapCiudadCercana = null;

function cargarPosicionUsuario() {
    window.navigator.geolocation.getCurrentPosition(
        function (pos) {
            posicionUsuario = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: pos.coords.accuracy
            };
            generarMapaCiudadCercana('contenedorMapa');
        },
        function () {
            alert("Ocurrió un error al obtener la posición del usuario");
            posicionUsuario = {
                latitude: -34.903816878014354,
                longitude: -56.19059048108193
            };
            generarMapaCiudadCercana('contenedorMapa');
        }
    );
}

function generarMapaCiudadCercana(idHtml) {
    
    if (mapCiudadCercana != null) {
        mapCiudadCercana.remove();
    }
    mapCiudadCercana = L.map(idHtml).setView([posicionUsuario.latitude, posicionUsuario.longitude], 6);
        
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapCiudadCercana);
    
    dibujarPosicionUsuario();
}

function dibujarPosicionUsuario() {
    L.marker([posicionUsuario.latitude, posicionUsuario.longitude]).addTo(mapCiudadCercana).bindPopup("Posición del usuario");
    /*
    if (posicionUsuario.accuracy && posicionUsuario.accuracy > 50) {
        L.circle([posicionUsuario.latitude, posicionUsuario.longitude], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: posicionUsuario.accuracy
        }).addTo(mapCiudadCercana);
    }
    */
    dibujarPosicionCiudadCercana();
}

async function dibujarPosicionCiudadCercana() {
    let dataCiudades = await consultarCiudades ();
    let ciudades = dataCiudades.ciudades;
    let ciudadMasCercana = null;
    let distanciaFinal = Number.POSITIVE_INFINITY;
    for (let i = 0; i<ciudades.length; i++) {
        clat = ciudades[i].latitud;
        clon = ciudades[i].longitud;
        let distanciaActual = obtenerDistanciaViaLatLon(posicionUsuario.latitude, posicionUsuario.longitude, clat, clon);
        if (distanciaActual < distanciaFinal) {
            ciudadMasCercana = ciudades[i];
            distanciaFinal = distanciaActual;
        }
    }
    L.marker([ciudadMasCercana.latitud, ciudadMasCercana.longitud]).addTo(mapCiudadCercana).bindPopup(`${ciudadMasCercana.nombre}, distancia: ${distanciaFinal}`);
    /*
    L.circle([ciudadMasCercana.latitud, ciudadMasCercana.longitud], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
        }).addTo(mapCiudadCercana);
    */
}




