//FUNCIONES 


//Funcion auxiliar que se llama al poner la cantidad a 0 en el carrito.
function quitarPeliculaCarrito(id){
    for (let i = 0;i < arrayCarrito.length;i++){
        if(id === arrayCarrito[i].id){
            arrayCarrito.splice(i,1);
            break;
        }
    }
    localStorage.setItem('carrito',JSON.stringify(arrayCarrito));
}

//Funcion que envia la factura al correo
function enviarCorreo(email,array) {
    var mensaje = "Detalle de la factura:\n\n";
    var total = 0;
    for (var i = 0; i < array.length; i++) {
        var item = array[i];
        mensaje += `  - Título: ${item.title}\n`;
        mensaje += `  - Cantidad: ${item.cantidad}\n`;
        mensaje += `  - Precio: ${item.precio * item.cantidad}€\n\n`;
        total = total + (item.precio * item.cantidad);
    }

    mensaje += `  - Precio total: ${total}€\n\n`;

    var templateParams = {
      to_email: email,
      from_name: 'Videoclub Jose Miguel Martinez Lopez',
      message: mensaje
    };

    emailjs.send("gmailpeliculas", "template_afi30ez", templateParams)
      .then(
        function(response) {
          console.log("Correo enviado con éxito", response);
          alert("Correo enviado con éxito");
        },
        function(error) {
          console.log("Error al enviar el correo", error);
          alert("Error al enviar el correo");
        }
      );
}

//Funcion que se encarga de limpiar la tabla del carrito para que no se dupliquen los productos
function limpiarTabla(){
    let tabla = document.getElementById('tabla');
    tabla.innerHTML = '';
    let fila = document.createElement('tr');
    let casillaNombre = document.createElement('td');
    let casillaCantidad = document.createElement('td');
    let casillaPrecio = document.createElement('td');
    let casillaBotones = document.createElement('td');

    fila.appendChild(casillaNombre);
    fila.appendChild(casillaCantidad);
    fila.appendChild(casillaPrecio);
    fila.appendChild(casillaBotones);
    
    casillaNombre.textContent = 'Pelicula';
    casillaCantidad.textContent = 'Cantidad';
    casillaPrecio.textContent = 'Precio';
    casillaBotones.textContent = 'Añadir/Quitar';
    tabla.appendChild(fila);

}

//Limpiar el grid de peliculas
function limpiarGrid(){
    section.innerHTML = '';
}

//Funcion que se encarga de cargar mas peliculas en la variable jsonPeliculas. Se ejecuta en el window scroll
async function cargarMasPeliculas(api){
    //Si cargando = true se para la funcion para no interferir con los procesos.
    if (cargando) {
        return;
    }
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollY + windowHeight >= documentHeight - 100){
        //Se carga la nueva pagina
        paginaActual++;
        //Indica que comienza la carga
        cargando = true;
        const nuevasPelis = await getDatos(api);
        //Se añaden las nuevas peliculas al json
        jsonpeliculas = jsonpeliculas.concat(nuevasPelis);
        //Se carga la vista con el json actualizado
        cargarVistaPeliculas(jsonpeliculas);
        // Indica que la carga ha finalizado
        cargando = false;
    }
}

//Muestra el modal del login
function showLogin(){
    loginsection.style.display = 'flex';
}

//Oculta el modal del login
function hideLogin(){
    loginsection.style.display = 'none';
}

//Elimina la sesion del usuario y recarga la pagina
function logout(){
    localStorage.removeItem('token');
    location.reload();
}

//Hace el login sobre la api de fakestore y comprueba si es correcto
function login(username,passwd){ 
    fetch(api_login,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                username: username,
                password: passwd
            })
        })
        .then (res => {
            if (!res.ok){
                alert('Usuario incorrecto');
            }
            return res.json();
        })
        .then (json =>{
            let token = json.token;
            if(token){
                localStorage.setItem('token',token);
                hideLogin();
                console.log('Inicio de sesión exitoso. Token:', token);
            }else{
                console.error('La respuesta de la API no contiene un token.');
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        })
}

//Añade un objeto al carrito y actualiza el localstorage. Se controla que si el objeto esta se sume uno a su cantidad
function addCarrito(json) {
    let pelicula = {
         'title': json.title,
         'id': json.id,
         'cantidad': 1,
         'precio': 5
    }
 
    console.log(pelicula);
    let existe = false;
    if (arrayCarrito.length > 0){
        for(let i =0;i<arrayCarrito.length;i++){
            if(pelicula.id === arrayCarrito[i].id){
                arrayCarrito[i].cantidad++;
                alert('Se ha sumado un producto');
                existe=true;
                break;
            }
        }

        if(!existe){
            arrayCarrito.push(pelicula);
            alert('Añadido nuevo producto');
        }
    }else{
        arrayCarrito.push(pelicula);
        alert('Añadido nuevo producto');
    }
    localStorage.setItem('carrito',JSON.stringify(arrayCarrito));
 }


 //Funcion que hace la llamada a la api y devuelve el json con las peliculas.
async function getDatos(url){
    const urlPagina = `${url}&page=${paginaActual}`;
    const response = await fetch(urlPagina);
    const json = await response.json();
    return json.results;
}

//Funcion principal. Carga los datos de la api y la vista de las peliculas con los datos obtenidos
async function main(api){
    jsonpeliculas = await getDatos(api);
    cargarVistaPeliculas(jsonpeliculas);
}

//Funcion que recorre los datos del json para mostrar las peliculas creado el arbol DOM
function cargarVistaPeliculas(json){
    limpiarGrid();
    for (let i=0;i<json.length;i++){
      //Url imagen
      let url = `https://image.tmdb.org/t/p/w500${json[i].poster_path}`;
  
      let div = document.createElement('div');
      let title = document.createElement('h1');
      let caja = document.createElement('article');
      let frontDiv = document.createElement('div');
      let rating = document.createElement('div');
      let backDiv = document.createElement('div');
      let movieImg = document.createElement('img');
      let descriptionP = document.createElement('p');
      let detailsButton = document.createElement('button');
      let addbutton = document.createElement('button');
      let icono = document.createElement('i');
      
    
      div.setAttribute('class','movie-card');
      addbutton.setAttribute('class','addbutton');
      caja.setAttribute('class','movie-card-article');
      caja.style.backgroundImage = `url('${url}')`;
      rating.textContent = json[i].vote_average.toFixed(1);
      frontDiv.setAttribute('class','flip-face flip-front');
      backDiv.setAttribute('class','flip-face flip-back');
      rating.setAttribute('class','rating');
  
      movieImg.setAttribute('src',url)
      movieImg.setAttribute('alt','f');

      addbutton.setAttribute('value',json[i].id);
      icono.setAttribute('class','fa-solid fa-cart-shopping');

  
      descriptionP.textContent = json[i].overview;
      detailsButton.textContent='Ver detalles';
      title.textContent = json[i].title;
  
      
      div.appendChild(title);
      div.appendChild(caja);
      div.appendChild(addbutton);
      addbutton.appendChild(icono);
      caja.appendChild(frontDiv);
      caja.appendChild(backDiv);
      
      frontDiv.appendChild(movieImg);
      frontDiv.appendChild(rating);
      backDiv.appendChild(descriptionP);
      backDiv.appendChild(detailsButton);
  
      section.appendChild(div);

      //Evento que ejecuta la funcion de añadir al carrito
      addbutton.addEventListener('click',function(){
        addCarrito(json[i]);
      })

      //Evento que abre el modal con los detalles del producto
      detailsButton.addEventListener('click',function(){
        let img = document.getElementById('details-img');
        img.setAttribute('src',url);
        let overview = document.getElementById('details-overview');
        overview.textContent = json[i].overview;
        let fecha = document.getElementById('details-fecha');
        fecha.textContent = 'FECHA DE ESTRENO: ' + json[i].release_date;
        let rate = document.getElementById('details-rate');
        rate.textContent = json[i].vote_average.toFixed(1);
        let votes = document.getElementById('details-votes');
        votes.textContent = json[i].vote_count;
        let popularity = document.getElementById('details-popularity');

        popularity.textContent = json[i].popularity.toFixed(0);
        
        window.location.href='#product-details';
      });
    }
}

